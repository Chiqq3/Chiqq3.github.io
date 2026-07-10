---
layout: page
title: Bringing Your Own Simulator to Veins
img:
importance: 2
category: Intern
related_publications: false
branches_title: Tutorials
branches:
  - title: "Part 1. The Minimal Contract"
    description: What Veins actually needs from your side, and a toy ROS node that publishes a vehicle driving a simple route.
    date: 2026-04-20
    url: /blog/2026/veinsBridgeMinimalContract/
  - title: "Part 2. A Length Prefixed JSON Protocol"
    description: Framing messages over a raw TCP socket so both sides always agree on where one message ends and the next begins.
    date: 2026-04-29
    url: /blog/2026/veinsBridgeWireProtocol/
  - title: "Part 3. Your First OMNeT++ Module"
    description: A minimal simple module that connects out to your bridge, receives the handshake, and says hello back.
    date: 2026-05-12
    url: /blog/2026/veinsBridgeFirstModule/
  - title: "Part 4. The Step Loop"
    description: Letting OMNeT++ pull a fresh position snapshot on its own clock instead of being pushed to on someone else's.
    date: 2026-05-24
    url: /blog/2026/veinsBridgeStepLoop/
  - title: "Part 5. Your Own Node Manager"
    description: Spawning and despawning vehicle modules dynamically, the job TraCIScenarioManager normally does for you.
    date: 2026-06-05
    url: /blog/2026/veinsBridgeNodeManager/
  - title: "Part 6. Bootstrapping the World from OpenStreetMap"
    description: Deriving map bounds and building obstacles from a plain OSM file, no SUMO network required.
    date: 2026-06-18
    url: /blog/2026/veinsBridgeOsmWorld/
  - title: "Part 7. Reporting Channel Quality Back"
    description: Turning received signal strength into a live table your own system can query at any time.
    date: 2026-06-29
    url: /blog/2026/veinsBridgeChannelReport/
  - title: "Part 8. Exposing Bit and Packet Error Rate"
    description: Veins already computes packet and bit error rate internally and throws them away. A small patch gets them back.
    date: 2026-07-08
    url: /blog/2026/veinsBridgeErrorRates/
---

## Project Overview

Veins is usually paired with SUMO through TraCI. That works fine until the vehicles you care about do not live in SUMO. Maybe they live in your own simulator, your own robotics stack, or a small script you wrote last week and have not fully forgiven yourself for. This project builds a TCP bridge that lets Veins take positions from anywhere, while still computing a real physically grounded wireless channel instead of assuming every link works perfectly.

<div class="caption" style="border: 1px dashed var(--global-divider-color); border-radius: 6px; padding: 3rem 1rem; text-align: center; margin: 2rem 0;">
Architecture diagram goes here. A sketch of the two simulators, the bridge between them, and the pieces the tutorial series builds one at a time.
</div>

## Purpose

My PhD research studies user association under mmWave blockage, which needs channel traces that behave like an actual street rather than an abstract bandit environment. Building a full VANET testbed for that felt heavy, so the pragmatic answer was to keep Veins as the channel model and feed it positions from whatever system happens to be driving the scenario that week.

That decoupling turned out to be useful on its own, independent of what generates the positions. The tutorial series below documents it end to end.

* A minimal position contract that any external system can satisfy, demonstrated with a toy ROS node instead of a specific simulator
* A request and response protocol so Veins pulls positions on its own discrete event clock rather than getting pushed to on someone else's
* A custom node manager that spawns and despawns vehicles dynamically, replacing the job TraCIScenarioManager normally does
* World bootstrapping straight from OpenStreetMap, so the pipeline works without a SUMO network file
* A channel status report that flows back out, so whatever system supplied the positions can also ask what the radio actually saw
* A small patch that surfaces packet and bit error rate, numbers Veins already computes internally and normally discards

## Where This Is Going

The next obvious extension is 3D geometry. Right now obstacles come from flat OSM building footprints, which is a reasonable approximation but ignores things like overpasses and building height variation. Importing a Blender scene and converting it into something Veins can shadow against is on the someday list, once the flat version has proven itself.
