---
layout: page
title: Multi-Armed Bandits for V2X User Association
img: assets/img/project/project_mab.gif
importance: 1
category: Research
related_publications: false
branches_title: Branches
branches:
  - title: "An Introduction to MAB"
    description: An overview of the classic multi-armed bandit problem and its three main variants (stochastic, adversarial, and Bayesian bandits), with a brief look at contextual extensions.
    date: 2025-11-14
    url: /blog/2025/MABIntro/
  - title: "UCB Exploration in Sparse Rewarded Bandits"
    description: How the UCB hyperparameter affects arm selection when reward distributions are highly sparse, motivated by real V2X user-association traces.
    date: 2025-11-14
    url: /blog/2025/ucbTest/
  - title: "UCB Under Non-stochastic Environment"
    description: How UCB adapts when arm reward distributions shift suddenly, as happens when a vehicle hands off between RSUs.
    date: 2025-11-15
    url: /blog/2025/ucbShift/
  - title: "UCB Under Gradual Distribution Decay"
    description: What happens to UCB's exploration parameter when arm quality degrades gradually, the more realistic case of signal path loss as a vehicle drives away from an RSU.
    date: 2025-11-15
    url: /blog/2025/ucbDynamic/
---

## Project Overview

**Focus:** Online learning for user association in vehicular networks
**Context:** Ph.D. research on V2X communication under mmWave channel blockage
**Technologies:** Multi-armed bandits (UCB family)

Choosing which roadside unit (RSU) a vehicle should associate with, moment to moment, is a sequential decision problem under uncertainty. Link quality is unknown ahead of time, changes as the vehicle moves, and can be blocked outright by buildings or other vehicles at mmWave frequencies. This project treats that problem as a **multi-armed bandit**, where each RSU is an arm and the reward is the achievable link quality, and studies how classic bandit algorithms like UCB need to be adapted once the "arms" behave like real wireless channels instead of stationary slot machines.

## Why Bandits

Supervised learning needs labeled data on every option; in a live vehicular network you only observe the outcome of the RSU you actually chose. That's exactly the exploration/exploitation trade-off bandits are built for. The branches below trace a progression from the textbook stochastic bandit setting toward the messier, non-stationary conditions that show up in real V2X scenarios, sparse rewards, sudden hand-off shifts, and gradual path-loss decay.

## Where This Is Going

Next steps are extending this from single-agent UCB toward contextual and multi-agent formulations that account for mmWave blockage prediction directly, tying this research line together with the [scenario co-simulation work](/projects/veins_cosim/) being built to generate more realistic V2X test scenarios.
