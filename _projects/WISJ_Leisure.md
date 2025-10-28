---
layout: page
title: WISJ ML Summer School
img: assets/img/project/WISJ_SS1.gif
importance: 1
category: Leisure
related_publications: false
---

## Project Overview

**Duration:** July 12th - August 23rd, 2025
**Location:** Code Chrysalis: Coding Bootcamp in Tokyo, Japan  
**Project Name:** IntelliRSU - Intelligent 5G Base Station Selection for Vehicular Networks  
**Technologies:** Machine Learning, Random Forest, Feature Engineering, Python

## Program Background

The [WISJ (Women in Science Japan) Machine Learning (ML) Summer School](https://www.womeninsciencejapan.com/machine-learning-program) is a selective six-week program designed to teach women and gender minority scientists applied machine learning through lectures, hands-on tutorials, and mentor-guided projects. The program aims to equip participants with the technical knowledge and skills needed to continue their machine learning journey in their respective scientific domains.

## My Motivation

As a researcher who had primarily worked with machine learning in theory, I joined this program to gain practical, hands-on experience applying ML techniques to real-world problems. I was particularly interested in bridging the gap between theoretical knowledge and project implementation, especially as I was facing challenges in my own research that required a fresh, data-driven perspective.

## Problem Statement

In modern vehicular networks, signal propagation poses significant challenges for maintaining reliable 5G connectivity. As vehicles move through urban environments, they encounter:

- **Dynamic blockages** from buildings, obstacles, and other vehicles
- **Rapid mobility** requiring frequent handoffs between base stations (RSUs)
- **Signal quality variations** that impact communication reliability

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/project/WISJ_SS1.gif" title="Signal Propagation Visualization" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Visualization of signal propagation in vehicular networks with Ray-Tracing
</div>

The critical question: **How can we intelligently predict the optimal base station for a moving vehicle to ensure seamless connectivity?**

## Project Objective

The goal of IntelliRSU was to develop an intelligent system that:
1. Predicts the best 5G base station (RSU) for vehicles in real-time
2. Handles mobility and blockage challenges effectively
3. Achieves high accuracy suitable for real-world deployment
4. Provides immediate deployment value for next-generation connected vehicles

## Methodology

Our approach combined feature engineering with machine learning:

1. **Feature Clustering**: Analyzed and grouped relevant features affecting signal quality
2. **Random Forest Classification**: Implemented an optimized Random Forest model for base station selection
3. **Performance Optimization**: Iteratively refined the model through data analysis and parameter tuning
4. **Validation**: Tested the system under various scenarios to ensure robustness

## Results & Demonstration

The project successfully achieved **near-perfect performance** in predicting optimal base station selection. The final results were presented in a 3-minute presentation at the summer school.

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Cq165CkvKbo" allowfullscreen></iframe>
        </div>
    </div>
</div>
<div class="caption">
    Final presentation: IntelliRSU - Intelligent 5G Base Station Selection
</div>

### Key Achievements:
- ✅ Solved critical mobility and blockage challenges in vehicular networks
- ✅ Achieved near-perfect accuracy through feature clustering and Random Forest optimization
- ✅ Developed a framework ready for real-world deployment

## Reflections & Key Learnings

This summer school experience was truly transformative for my research journey. Although I had theoretical knowledge of machine learning, this was my first opportunity to apply it to a complete, practical project from start to finish.

**What made this experience special:**

- **Problem-solving through different perspectives**: When facing challenges in understanding the data, I learned to approach problems from multiple angles - observing patterns, questioning assumptions, and iteratively refining my approach. This process of discovery and problem-solving brought me genuine joy and excitement.

- **Invaluable mentorship**: My mentor **Alexey** provided exceptional guidance throughout the project. His expertise was instrumental in shaping both the technical approach and the quality of this work. His advice helped me navigate challenges and think critically about model optimization.

- **Inspiring community**: I had the privilege of meeting many talented women and professionals in the field. The collaborative and supportive environment fostered by WISJ created an ideal space for learning and growth.

- **Bridging theory and practice**: Moving from theoretical understanding to hands-on implementation gave me confidence to tackle data-driven problems in my own research with a more practical, experimental mindset.

## Future Directions

Future work will focus on:
- Extending the framework to larger-scale networks
- Investigating ensemble methods for even higher accuracy
- Real-world field testing in diverse urban environments

## Acknowledgments

I would like to express my sincere gratitude to:
- **Alexey**, my mentor, for his invaluable advice and guidance throughout this project
- **WISJ AI Summer School** for providing this incredible opportunity to develop cutting-edge research in an inspiring and collaborative environment
- **JST SPRING-GX program** for supporting my participation
