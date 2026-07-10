---
layout: post
title: "Part 4. The Step Loop"
date: 2026-05-24 09:00:00+0900
description: Letting OMNeT++ pull a fresh position snapshot on its own clock instead of getting pushed to on someone else's.
tags: OMNeT++ Veins Tutorial
categories: Systems
featured: false
---

## Introduction

Part 3 got us a working handshake that runs exactly once. A simulation that only says hello is not much of a simulation. This part turns the handshake into a loop.

## Why OMNeT++ Has To Pull

OMNeT++ is a discrete event simulator. It does not tick at a fixed wall clock rate, it jumps straight from one scheduled event to the next, however far apart they are in simulation time. That means OMNeT++ has to be the one asking "what time is it and where is everyone," on its own schedule, rather than having positions pushed at it whenever your external system feels like publishing.

So the pattern is request and response. OMNeT++ sends a `STEP_REQUEST` when it is ready for the next update, and whatever plays the bridge role answers with a `STEP_RESPONSE` containing the freshest snapshot it has. If your publisher runs at a different rate than the simulation timestep, and it almost certainly will, that is fine. The bridge only ever needs to answer with "here is the latest I've got."

## The OMNeT++ Side

```cpp
void BridgeManager::handleMessage(omnetpp::cMessage* msg) {
  if (msg == step_timer_) {
    doStep();
  }
}

void BridgeManager::doStep() {
  nlohmann::json req = { {"type", "STEP_REQUEST"}, {"sim_time", omnetpp::simTime().dbl()} };
  send_json(sock_fd_, req.dump());

  std::string body;
  recv_json(sock_fd_, body);
  processStepResponse(body);

  step_timer_ = new omnetpp::cMessage("veins_bridge_step");
  scheduleAt(omnetpp::simTime() + veins_timestep_, step_timer_);
}
```

Each step schedules the next one, so once `doStep` fires for the first time the loop keeps itself going for the rest of the run.

## The Bridge Side

The bridge needs two things happening independently, a subscriber that keeps overwriting one "latest snapshot" slot, and a TCP handler that reads whatever is in that slot whenever a `STEP_REQUEST` arrives.

```cpp
std::mutex        snapshot_mutex_;
VehiclePoseArray  latest_snapshot_;

void onVehiclePoses(const VehiclePoseArray& msg) {
  std::lock_guard<std::mutex> lock(snapshot_mutex_);
  latest_snapshot_ = msg;
}

void handleStepRequest(int client_fd) {
  VehiclePoseArray snapshot;
  {
    std::lock_guard<std::mutex> lock(snapshot_mutex_);
    snapshot = latest_snapshot_;
  }
  send_json(client_fd, toStepResponseJson(snapshot));
}
```

Notice there is no queue anywhere. `latest_snapshot_` is a single slot, overwritten every time a new message arrives, read every time OMNeT++ asks. This is deliberate. Your publisher and OMNeT++'s clock are two different notions of time that happen to coexist, and trying to keep them in lockstep through a queue is a good way to introduce backlog and lag for no benefit. Freshest available beats perfectly ordered here.

## Try It Yourself

Point the Part 1 publisher at this bridge, run the OMNeT++ module, and watch the log. You should see a new position printed on every simulated timestep, tracking the toy vehicle as it drives its route, even though the publisher and the simulator are not synchronized in any tighter way than "the bridge always has something to answer with."

## What's Next

So far there has only ever been one vehicle, present from the very first step. Part 5 handles vehicles appearing and disappearing during a run, which means teaching OMNeT++ to create and destroy modules on the fly.
