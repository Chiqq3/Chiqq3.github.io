---
layout: post
title: "UCB Under Gradual Distribution Decay"
date: 2025-11-15
description: Investigating how UCB exploration parameters interact with different rates of gradual arm quality degradation
tags: Online-learning MAB UCB
categories: Experiment
featured: true
---

## Introduction

In my [previous blog post](https://chiqq3.github.io/blog/2025/ucbShift/), I explored how the UCB algorithm handles sudden distribution shifts in non-stationary multi-armed bandit problems. However, I realized that in my V2X (Vehicle-to-Infrastructure) scenario, arm quality changes are often more gradual than abrupt.

Consider this real-world scenario: as a vehicle moves away from an RSU (Roadside Unit), the signal quality doesn't instantly drop—it degrades progressively due to increasing distance (path loss). This motivated me to investigate: **How does UCB perform when arm distributions decay gradually over time?**

---

## V2X Scenario Context

In vehicle-to-infrastructure communication:
- **Large-scale fading**: Signal strength decreases with distance (assuming line-of-sight)
- **Vehicle approaching RSU**: Signal quality gradually improves
- **Vehicle moving away from RSU**: Signal quality gradually degrades

This creates a **periodic decay pattern** where arm quality changes in predictable stages rather than randomly.

---

## Experimental Setup

**Initial Configuration:**
- 5 arms with initial Bernoulli reward means: `[0, 0.85, 0.3, 0, 0.45]`
- **Only Arm 2 undergoes periodic decay**
- Decay parameters:
  - **Decay rate**: 0.1 (reduces mean by 0.2 each interval)
  - **Decay intervals**: `[2, 5, 10]` time steps
  - Intervals represent: fast (2), medium (5), and slow (10) decay speeds
- UCB parameters tested: `c ∈ {0.05, 0.25, 0.5, 1.0}`
- Total time steps: 100

**Key Timeline:**
- **Red line**: Marks when Arm 2's mean reaches 0.45 (equal to Arm 5)
- **Optimal strategy before red line**: Choose Arm 2 (mean = 0.85)
- **Optimal strategy after red line**: Choose Arm 2 or Arm 5 (both mean = 0.45), Arm 3 is sub-optimal (mean = 0.3)

---

## Experimental Results

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/blog/ucbshift_0_05.jpg" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 1: UCB behavior with c=0.05 (minimal exploration) under different decay intervals
</div>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/blog/ucbshift_0_25.jpg" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 2: UCB behavior with c=0.25 (low exploration) under different decay intervals
</div>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/blog/ucbshift_0_5.jpg" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 3: UCB behavior with c=0.5 (moderate exploration) under different decay intervals
</div>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/blog/ucbshift_1.jpg" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 4: UCB behavior with c=1.0 (high exploration) under different decay intervals
</div>

---

## Key Findings

#### 1. Very Small c Values Cannot Track Distribution Changes

- The algorithm behaves almost like a pure greedy policy
- Quickly locks onto Arm 2 before the red line
- Insufficient exploration makes the algorithm blind to environmental changes

---

#### 2. The Interaction Between Decay Speed and Exploration Parameter

- Need the c value to be a bit larger for sufficient exploration that enables detection of change
- Fast decaying with suitable c sometimes acheives good results since it takes shorter time for the ucb to realize that the arm is on decay
  
---

#### 3. Higher Exploration Rates Enable Faster Change Detection but Increase Sub-optimal Selections

**c = 0.5 (Moderate Exploration)**
- Could detect the change among arms
- Might increase the chance of choosing the sub-optimal selection due to less exploration rate

**c = 1.0 (High Exploration)**
- Could detect the change among arms
- More exploration behavior that would also increase the chance of choosing sub-optimal selection
- **Trade-off**: While it detects changes quickly, excessive exploration may reduce cumulative reward

---

#### 4. Universal pattern across all c values

**Surprisingly: Same c value performs better with fast decay**

- The reason: The algorithm needs less time to distiguish the large differences among arms comparing to the moderate ones.

---

## UCB Value Evolution Patterns

### Low c Values (0.05, 0.25)
- **UCB values converge quickly** and remain stable
- Small exploration bonus means historical performance dominates
- Difficult to react to environmental changes
- UCB curves show little fluctuation over time

### High c Values (0.5, 1.0)
- **UCB values fluctuate continuously**
- Large exploration bonus maintains uncertainty about all arms
- Easier to switch between arms when distributions change
- UCB curves remain dynamic throughout the experiment

---

## Theoretical Explanation

### Why Does Standard UCB Struggle with Non-Stationary Environments?

**1. Historical Data Accumulation Problem**
- Arm 2 accumulates many high rewards early on
- Its sample mean remains high: `μ̂₂ = (Σ rewards) / n₂`
- Even as new rewards decrease, the historical average changes slowly

**2. Exploration Bonus Decay**
- The UCB exploration term: `c√(ln t / n)`
- As the number of trials `n` increases, this term **shrinks**
- Reduced exploration bonus means less incentive to revisit Arm 2 and discover its decline

**3. Lock-in Effect**
- Small c values create a "lock-in" to historically good arms
- The algorithm becomes increasingly confident in outdated information
- Breaking this lock-in requires either:
  - Very low rewards from the locked arm (forcing reconsideration)
  - High exploration parameter (maintaining uncertainty)

---

## Recommendations for Non-Stationary Bandits

Based on these experiments, standard UCB should be enhanced with:

#### 1. **Discounted UCB**
```
Instead of: μ̂ₖ = (Σ all rewards) / n
Use: μ̂ₖ = (Σ γᵗ × reward_t) / (Σ γᵗ)
```
Recent rewards have more weight (γ < 1)

#### 2. **Change Detection + Adaptive c**
- Monitor reward statistics for drift
- Increase c when change detected
- Reset arm statistics after confirmed distribution shift

#### 3. **Contextual Information**
In V2X scenarios, incorporate:
- Vehicle position and velocity
- Signal strength measurements  
- Historical RSU performance patterns

This leads naturally to **Contextual Multi-Armed Bandits** (CMAB), which I'm actively researching!

---

**Further Reading:**
- Cao, Y., et al. (2019). *Nearly Optimal Adaptive Procedure with Change Detection for Piecewise-Stationary Bandit*. AISTATS 2019.
- Liu, F., Lee, J., & Shroff, N. (2018). *A Change-Detection based Framework for Piecewise-stationary Multi-Armed Bandit Problem*. AAAI 2018.
