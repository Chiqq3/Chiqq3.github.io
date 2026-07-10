---
layout: page
title: V2X Co-Simulation - Bridging Autoware and Veins
img:
importance: 2
category: Intern
related_publications: false
branches_title: Branches
branches:
  - title: "Architecture: A TCP Bridge Between ROS 2 and OMNeT++"
    description: How bridge_node, the TCP server, and the OMNeT++-side RosbridgeManager/RosbridgeApp modules stay in lockstep to move vehicle positions and channel physics between the two simulators every timestep.
    date: 2026-07-10
    url: /blog/2026/veinsBridgeArchitecture/
---

## Project Overview

**Focus:** Co-simulation infrastructure for realistic V2X channel modeling
**Base:** [scenario_simulator_v2](https://github.com/tier4/scenario_simulator_v2), TIER IV's scenario testing framework for Autoware
**Technologies:** ROS 2, C++, OMNeT++ / Veins 5.3.1, TCP, OpenSCENARIO

[scenario_simulator_v2](https://github.com/tier4/scenario_simulator_v2) drives realistic traffic scenarios for testing Autoware, but out of the box it has no model of the wireless channel — every vehicle and roadside unit (RSU) is assumed to communicate perfectly. My mmWave / V2X user-association research needs the opposite: a scenario where link quality is a first-class, physically grounded variable that degrades with distance, fading, and obstacles, in step with the same traffic the AV stack is being tested against.

This project adds that missing piece: `veins_bridge`, a ROS 2 package that co-simulates each scenario run against [Veins](https://veins.car2x.org/) (an OMNeT++-based vehicular network simulator), so every vehicle and RSU gets a live, physically modeled V2X channel — carrier frequency, path loss, fading, and building/vehicle shadowing — instead of an idealized link.

## Purpose

- Give scenario_simulator_v2 scenarios a **real PHY-layer channel model** (two-ray ground reflection, Nakagami-m fading, knife-edge obstacle diffraction, vehicle-body shadowing) instead of assuming perfect connectivity.
- Report per-receiver **SNR, received power, BER/PER, and collisions** back into ROS 2 as `V2XChannelStatus` messages, so downstream nodes (and my bandit-based user-association research) can consume live channel quality.
- Auto-derive scenario geometry — building footprints from OpenSCENARIO, map bounds from the Lanelet2 map, RSU positions from the smart-pole config — so a new scenario doesn't require hand-authoring a separate OMNeT++ world.
- Keep every run reproducible: each run snapshots its generated `obstacles.xml`/`config.xml` alongside the channel log, so a channel trace can always be traced back to the exact physics that produced it.

## How It Fits Together

`bridge_node` runs as a ROS 2 node alongside the scenario. Each simulation step it samples every entity's position, forwards it over a TCP connection to Veins, and receives back the channel status Veins computed for that step — republished as `V2XChannelStatusArray` with transient-local QoS, so any subscriber can always ask "what is entity X's V2X link quality right now" without tracking history itself. On the OMNeT++ side, a matching `RosbridgeManager`/`RosbridgeApp` pair (installed into the Veins source tree) owns the same TCP connection and drives the simulated radios.

This is very much in-progress work — the architecture branch below is the first write-up, with the channel-model deep dive and the setup/reproduction guide to follow as they're written.
