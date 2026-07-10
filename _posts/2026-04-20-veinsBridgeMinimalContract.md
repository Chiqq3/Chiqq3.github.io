---
layout: post
title: "Part 1. The Minimal Contract"
date: 2026-04-20 09:00:00+0900
description: What Veins actually needs from an external position source, and a toy ROS node that plays the part.
tags: V2X ROS2 Veins Tutorial
categories: Systems
featured: true
---

## Introduction

This is the first part of a series on decoupling Veins from SUMO. Veins normally gets its vehicle positions from SUMO through TraCI. That is a fine default, but sometimes your vehicles live somewhere else entirely, your own simulator, your own robotics stack, a spreadsheet you are not proud of. The series builds a small TCP bridge that lets Veins take positions from any of those, one working piece per post.

Before touching sockets or OMNeT++, we need to answer a smaller question first. What is the actual minimum Veins needs to know about a vehicle?

## The Minimal Schema

Strip away everything specific to any particular simulator and a vehicle position update needs exactly four kinds of information.

* An identity, so the same vehicle can be recognized across updates
* A pose, position and heading
* A speed, mostly for later use by things like Doppler or mobility models
* A rough bounding box, useful for shadowing models later in the series

As a plain interface definition this looks like

```
# VehiclePose.msg
string  id
float64 x
float64 y
float64 yaw
float64 speed_mps
float64 length_m
float64 width_m
float64 height_m
```

And since Veins also needs to know when a vehicle appears or disappears, we bundle a batch of these together with two extra lists.

```
# VehiclePoseArray.msg
VehiclePose[] vehicles
string[]      spawned
string[]      despawned
```

`spawned` and `despawned` hold ids new since the last update and ids that are gone. This lets the receiving side manage node lifecycle later without polling or guessing.

## A Toy Publisher

For the rest of this series we need a stand in for "whatever system you actually have." We will use a small ROS 2 node that drives one imaginary vehicle around a fixed route, looping forever. Nothing about the bridge cares that this is fake, which is exactly the point.

```python
import math
import rclpy
from rclpy.node import Node
from demo_interfaces.msg import VehiclePose, VehiclePoseArray

ROUTE = [(0.0, 0.0), (40.0, 0.0), (40.0, 30.0), (0.0, 30.0)]
SPEED_MPS = 8.0


class RoutePublisher(Node):
    def __init__(self):
        super().__init__("route_publisher")
        self.pub = self.create_publisher(VehiclePoseArray, "vehicle_poses", 10)
        self.timer = self.create_timer(0.1, self.tick)
        self.dist_along_route = 0.0
        self.known = False

    def tick(self):
        self.dist_along_route += SPEED_MPS * 0.1
        x, y, yaw = self._sample_route(self.dist_along_route)

        pose = VehiclePose(id="car_0", x=x, y=y, yaw=yaw,
                            speed_mps=SPEED_MPS,
                            length_m=4.5, width_m=1.8, height_m=1.5)

        msg = VehiclePoseArray(vehicles=[pose])
        if not self.known:
            msg.spawned = ["car_0"]
            self.known = True

        self.pub.publish(msg)

    def _sample_route(self, dist):
        # walk the polyline, wrap around at the end, return (x, y, yaw)
        ...
```

The `_sample_route` helper is left as an exercise. Walk the polyline, wrap around when you reach the end, compute yaw from the direction of travel between the current and next waypoint.

## Try It Yourself

Build the interface package, run the node, and echo the topic.

```bash
colcon build --packages-select demo_interfaces
ros2 run demo_pkg route_publisher &
ros2 topic echo /vehicle_poses
```

You should see `car_0` marching around the rectangle, with `spawned` set once and empty afterward. That is the entire contract this series builds against. No Veins yet, no TCP, just a clean stream of positions in a shape we control.

## What's Next

Part 2 wraps this stream in a wire protocol simple enough to implement in an afternoon, so both sides always agree on where one message ends and the next begins.
