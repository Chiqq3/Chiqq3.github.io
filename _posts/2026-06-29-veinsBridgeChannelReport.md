---
layout: post
title: "Part 7. Reporting Channel Quality Back"
date: 2026-06-29 09:00:00+0900
description: Turning received signal strength into a live table your own system can query at any time.
tags: V2X Veins Tutorial
categories: Systems
featured: false
---

## Introduction

Everything so far has flowed in one direction, positions going into Veins. That gets us a physically simulated channel, but a channel nobody hears about is just a very elaborate way to waste CPU cycles. This last part sends something back out, which is the entire reason this series exists.

## What Veins Actually Hands You

Veins' application layer sees every frame a node successfully receives, along with the PHY layer's opinion of how well it received it, signal to noise ratio, raw received power, and whether the drop was caused by a collision rather than plain low signal. An application module built on Veins' standard demo application base class gets a hook for exactly this.

```cpp
void BridgeApp::onWSM(BaseFrame1609_4* wsm) {
  auto* info = check_and_cast<PhyToMacControlInfo*>(wsm->getControlInfo());
  auto* result = check_and_cast<DeciderResult80211*>(info->getDeciderResult());

  BridgeManager::getInstance()->reportEvent({
    .sender = wsm->getSenderAddress(),
    .receiver = getParentModule()->getFullName(),
    .snr_db = result->getSnr(),
    .recv_power_dbm = result->getRecvPower_dBm(),
    .is_collision = result->isCollision(),
  });
}
```

Every node in the scenario runs one of these, so every reception anywhere in the network eventually funnels through `reportEvent`.

## Getting It Back to the Bridge

`BridgeManager` collects these reports and sends them out as `V2X_EVENT` messages over the same TCP connection used for `STEP_REQUEST`/`STEP_RESPONSE`, piggybacking on the existing step loop rather than opening a second connection.

```cpp
void BridgeManager::sendPendingEvents() {
  for (auto& ev : pending_events_) {
    nlohmann::json j = {
      {"type", "V2X_EVENT"},
      {"sender", ev.sender}, {"receiver", ev.receiver},
      {"snr_db", ev.snr_db}, {"recv_power_dbm", ev.recv_power_dbm},
      {"is_collision", ev.is_collision},
    };
    send_json(sock_fd_, j.dump());
  }
  pending_events_.clear();
}
```

## Turning a Stream of Events Into a Live Table

A raw stream of events is awkward to consume. Anyone who wants to know "what is the current channel quality for this receiver" has to replay history and remember the last event for every id themselves. Better to do that bookkeeping once, on the bridge side, and expose the result as a table that always reflects the latest known state.

```cpp
std::mutex status_mutex_;
std::map<std::string, ChannelStatus> latest_by_receiver_;

void onV2xEvent(const ChannelStatus& status) {
  std::lock_guard<std::mutex> lock(status_mutex_);
  latest_by_receiver_[status.receiver] = status;
}
```

Publish that map with a QoS setting that delivers the current contents immediately to any new subscriber, rather than only to whoever happened to be listening when the last update went out. In ROS 2 terms this is a transient local durability setting, but the same idea applies regardless of what your external system actually is. Whoever asks, whenever they ask, gets the freshest known answer without needing a history to replay.

## Try It Yourself

Add a second, stationary node to the Part 5 scenario and let it exchange periodic beacons with the moving vehicle. Print incoming events as they arrive, confirm signal quality drops as the vehicle drives further away or behind a Part 6 building, and confirm a fresh subscriber attaching mid run immediately sees the current table rather than an empty one.

## What's Next

`snr_db`, `recv_power_dbm`, and `is_collision` are already a working channel report. But Veins is quietly computing two more numbers you would want for anything resembling a real link budget, bit error rate and packet error rate, and then throwing them away before they ever reach your application. Part 8 goes and gets them back.
