---
layout: page
title: Vehicular Network Simulation with SUMO and Ray Tracing
img:
importance: 2
category: Research
related_publications: false
branches_title: Branches
branches:
  - title: "SUMO Simulation with Ray Tracing"
    description: A tutorial on building realistic vehicular network scenarios from real-world maps, combining SUMO mobility traces with MATLAB ray tracing for propagation.
    date: 2025-11-05
    url: /blog/2025/sumoRT/
---

## Project Overview

**Focus:** Simulation tooling for realistic vehicular network research
**Technologies:** SUMO, OpenStreetMap, OpenCellID, MATLAB Ray Tracing

Testing a wireless algorithm is only as convincing as the environment it's tested in. This project builds a simulation pipeline that combines **SUMO** (for real vehicle mobility, generated directly from OpenStreetMap maps) with **MATLAB Ray Tracing** driven by real base-station locations from OpenCellID, giving both an accurate mobility model and a physically grounded propagation model in the same urban scenario, without relying on commercial tools like Wireless InSite.

## Purpose

This started as tooling to support the [MAB / V2X user-association research](/projects/mab_v2x/). Before an online-learning algorithm can be evaluated meaningfully, it needs channel traces that behave like real streets and real signal propagation rather than an abstract synthetic bandit. It has since become its own reusable pipeline, script-based, reproducible, and general enough to support other vehicular-network experiments beyond bandits.
