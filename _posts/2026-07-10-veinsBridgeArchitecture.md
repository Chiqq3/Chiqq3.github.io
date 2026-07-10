---
layout: post
title: "Architecture: A TCP Bridge Between ROS 2 and OMNeT++"
date: 2026-07-10 12:00:00+0900
description: How bridge_node, the TCP server, and the OMNeT++-side RosbridgeManager/RosbridgeApp modules stay in lockstep to move vehicle positions and channel physics between scenario_simulator_v2 and Veins every timestep.
tags: V2X ROS2 OMNeT++ Simulation
categories: Systems
featured: false
---

## Introduction

This is the first write-up in the [V2X co-simulation project](/projects/veins_cosim/): bridging [scenario_simulator_v2](https://github.com/tier4/scenario_simulator_v2) (Autoware's scenario testing framework) with [Veins](https://veins.car2x.org/), so scenarios get a physically modeled V2X channel instead of an idealized one. This post covers the plumbing — how the two simulators, running as separate processes on separate clocks (ROS 2's 30 Hz entity stream vs. OMNeT++'s discrete-event scheduler), stay synchronized every timestep.

## Two Processes, One Wire Protocol

`veins_bridge` runs as a ROS 2 node; Veins runs as a separate OMNeT++ process. They talk over a single TCP connection, one JSON message at a time, each framed with a 4-byte big-endian length prefix. There's a two-phase handshake:

**Handshake phase**, before the scenario starts:
```
bridge  → OMNeT++:  INIT  { veins_timestep, map{}, rsus[], channel{}, node_config{} }
OMNeT++ → bridge:   INIT_ACK
bridge fires ready_callback_ → publishes /veins_bridge/ready
```

**Step phase**, once the scenario is running:
```
OMNeT++ → bridge:   STEP_REQUEST  { veins_time }
bridge  → OMNeT++:  STEP_RESPONSE { sim_time, entities[], despawned[] }
OMNeT++ → bridge:   V2X_EVENT     { sender, receiver, rssi_dbm, ... }
```

OMNeT++ drives the pacing — it asks for the next position snapshot when its own discrete-event clock is ready for it, rather than the ROS side pushing at a fixed rate. That decouples the two simulators' native update rates cleanly.

## Sampling Positions Without Coupling to ROS's Clock

`PositionSampler` subscribes to `traffic_simulator`'s entity-status topic, which publishes at a fixed 30 Hz regardless of what Veins needs. Rather than forwarding every frame, it only fires its callback once per `veins_timestep` of *simulation* time (typically 0.1 s), tracking which entity names appeared or disappeared since the last snapshot so OMNeT++ knows when to spawn or despawn a node. `TcpServer::updateSnapshot()` then just overwrites a single latest-snapshot slot under a mutex — `TcpServer` always answers a `STEP_REQUEST` with whatever the most recent snapshot is, rather than replaying a queue.

## Deriving Scenario Geometry Instead of Hand-Authoring It

Two pieces of geometry that Veins needs — the playground bounds and building obstacles — are derived automatically rather than authored by hand for each new scenario:

- **Map bounds** come from scanning every `local_x`/`local_y` tag in the scenario's Lanelet2 `.osm` file for its extrema. OMNeT++ then shifts every incoming coordinate by `-origin` so positions land in `[0, size]` regardless of where the map sits in global space.
- **Building obstacles** come from `generateObstaclesXml()`, which parses the scenario's OpenSCENARIO YAML for `MiscObject` building footprints, rotates each one by its `WorldPosition.h`, and writes a Veins-format `obstacles.xml`. This runs on *every* invocation — even producing an empty `<obstacles/>` stub when there's nothing to extract — because `omnetpp.ini` loads that file unconditionally; a missing file aborts OMNeT++ at startup, and a stale one would silently carry building geometry over from a previous run.

## What Comes Back: Channel Status as a ROS Topic

Every `V2X_EVENT` from OMNeT++ becomes a `V2XChannelStatus` message — sender/receiver id, SNR, received power, BER/PER, and whether the frame was lost to collision vs. low SNR. These are also folded into a `V2XChannelStatusArray`, published with `transient_local` QoS (depth 1): a new subscriber gets the current per-entity table immediately on connect, and a fresh copy goes out whenever any single receiver's status changes. That means any downstream node — including the bandit-based user-association logic this is ultimately feeding — can just ask "what is entity X's link quality right now" without tracking channel history itself.

## Reproducibility

Every run snapshots its generated `obstacles.xml` and `config.xml` into a timestamped `run_YYYYMMDD_HHMMSS/` directory alongside the channel log, before the *next* run overwrites the live copies in `scenario_dir`. So a channel trace from any past run can always be traced back to the exact obstacle geometry and analogue-model chain OMNeT++ actually used to produce it — important when the same scenario gets re-run under different channel configs (path loss exponent, fading, obstacle shadowing on/off) to see how each factor moves the numbers.

## What's Next

This covers the transport and synchronization layer. The next branch will go into the channel physics itself — the two-ray ground reflection, Nakagami-*m* fading, and knife-edge obstacle/vehicle shadowing models that turn these raw position snapshots into the SNR and BER/PER numbers this post's messages actually carry.
