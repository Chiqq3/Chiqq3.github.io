---
layout: post
title: "Part 5. Your Own Node Manager"
date: 2026-06-05 09:00:00+0900
description: Spawning and despawning vehicle modules dynamically, the job TraCIScenarioManager normally does for you.
tags: OMNeT++ Veins Tutorial
categories: Systems
featured: false
---

## Introduction

Every vehicle so far has existed from the first simulated step onward. Real scenarios are not that polite, vehicles enter and leave. Normally `TraCIScenarioManager` handles this for you, quietly creating and destroying vehicle modules as SUMO reports cars entering and leaving the network. Since we are not using SUMO, that job falls to us.

## Tracking Modules by ID

The bridge already gives us stable string ids from Part 1's schema. All we need on the OMNeT++ side is a map from that id to the live module representing it.

```cpp
std::map<std::string, omnetpp::cModule*> vehicles_;
```

Everything else in this post is really just keeping that map honest.

## Spawning a Vehicle

Creating a module at runtime in OMNeT++ follows a fixed recipe, get the module type, create an instance, finalize its parameters, build its submodules, then initialize it.

```cpp
omnetpp::cModule* BridgeManager::spawnVehicle(const std::string& id) {
  auto* moduleType = omnetpp::cModuleType::get(par("vehicleModuleType").stringValue());
  auto* mod = moduleType->create(id.c_str(), getParentModule());
  mod->finalizeParameters();
  mod->buildInside();
  mod->scheduleStart(omnetpp::simTime());
  mod->callInitialize();

  vehicles_[id] = mod;
  return mod;
}
```

One gotcha worth knowing about before it costs you an afternoon. Calling this from inside your own module's `initialize()` can misfire, because `create()` inserts the new module into the parent mid iteration, which restarts OMNeT++'s own initialization walk and tries to initialize your new vehicle before it actually exists yet. The clean workaround is to not spawn anything during `initialize()` at all. Instead, schedule a zero time self message and do the spawning once that fires, safely after the whole initialization cycle has finished.

## Despawning a Vehicle

The other direction is much shorter.

```cpp
void BridgeManager::despawnVehicle(const std::string& id) {
  auto it = vehicles_.find(id);
  if (it == vehicles_.end()) return;
  it->second->deleteModule();
  vehicles_.erase(it);
}
```

## Wiring It Into the Step Loop

Part 1's schema already carries `spawned` and `despawned` lists alongside the poses. `processStepResponse` from Part 4 just needs to act on them.

```cpp
void BridgeManager::processStepResponse(const std::string& body) {
  auto j = nlohmann::json::parse(body);

  for (auto& id : j["despawned"]) despawnVehicle(id.get<std::string>());
  for (auto& id : j["spawned"])   spawnVehicle(id.get<std::string>());

  for (auto& v : j["vehicles"]) {
    auto id = v["id"].get<std::string>();
    if (!vehicles_.count(id)) continue;  // already despawned this same step, ignore
    updateMobility(vehicles_[id], v["x"], v["y"], v["yaw"], v["speed_mps"]);
  }
}
```

Despawn before spawn so an id that leaves and immediately reappears (rare, but toy publishers do strange things when you are debugging them) does not collide with itself.

## Try It Yourself

Extend the Part 1 publisher to add a second vehicle a few seconds in, and remove the first one a bit after that. Watch the OMNeT++ GUI, a second car icon should appear mid run and the original one should vanish, all driven entirely by your own code standing in for TraCI.

## What's Next

Vehicles now come and go correctly, but they are all driving around in an empty, boundless void. Part 6 gives that void an actual map, pulled straight from OpenStreetMap.
