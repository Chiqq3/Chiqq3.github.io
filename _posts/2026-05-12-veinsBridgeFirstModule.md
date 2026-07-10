---
layout: post
title: "Part 3. Your First OMNeT++ Module"
date: 2026-05-12 09:00:00+0900
description: A minimal simple module that connects out to your bridge, receives the handshake, and says hello back.
tags: OMNeT++ Veins Tutorial
categories: Systems
featured: false
---

## Introduction

We now have a position source from Part 1 and a framing protocol from Part 2. Time to make OMNeT++ speak it.

An OMNeT++ module comes in two files. A `.ned` file declares the module's interface, its parameters and gates, mostly bookkeeping. A `.cc`/`.h` pair implements the actual behavior. We only need one module for this whole series, so let's call it `BridgeManager` and give it exactly one job for now, connect to a TCP server and complete a handshake.

## The NED Declaration

```
simple BridgeManager
{
    parameters:
        @class(veins::BridgeManager);
        string bridgeHost = default("localhost");
        int    bridgePort = default(6666);
        int    connectRetries = default(10);
        int    connectRetryInterval = default(1);
        @display("i=block/cogwheel");
}
```

Nothing exciting yet, just a host, a port, and a couple of retry knobs, because the bridge process and OMNeT++ tend to start at slightly different times and it is nicer to wait a second and try again than to crash.

## Connecting and Shaking Hands

```cpp
class BridgeManager : public omnetpp::cSimpleModule {
protected:
  void initialize(int stage) override;
  int numInitStages() const override { return 1; }

private:
  bool connectToBridge();
  void processInit(const std::string& body);

  int sock_fd_{-1};
  std::string bridge_host_;
  int bridge_port_{6666};
};
```

```cpp
void BridgeManager::initialize(int stage) {
  bridge_host_ = par("bridgeHost").stringValue();
  bridge_port_ = par("bridgePort");

  if (!connectToBridge()) {
    throw omnetpp::cRuntimeError("BridgeManager could not reach the bridge");
  }

  std::string body;
  if (!recv_json(sock_fd_, body)) {
    throw omnetpp::cRuntimeError("bridge closed the connection before sending INIT");
  }
  processInit(body);
}

void BridgeManager::processInit(const std::string& body) {
  auto j = nlohmann::json::parse(body);
  EV_INFO << "BridgeManager received INIT, timestep " << j.value("timestep", 0.1) << endl;

  nlohmann::json ack = { {"type", "INIT_ACK"} };
  send_json(sock_fd_, ack.dump());
}
```

`connectToBridge` is a plain retry loop around `socket`/`connect`, the same shape as any TCP client you have written before, so it is left out here to keep the post short. The interesting part is that our module is the client and whatever plays the bridge role is the server, which is worth remembering because it is easy to get backwards when both sides are new code you wrote yourself an hour ago.

## Try It Yourself

Stand up a tiny stub server that sends a fake `INIT` and waits for the `INIT_ACK`, just enough to exercise the handshake without building the real bridge yet.

```python
import socket, struct, json

srv = socket.create_server(("localhost", 6666))
conn, _ = srv.accept()

init = json.dumps({"type": "INIT", "timestep": 0.1}).encode()
conn.sendall(struct.pack(">I", len(init)) + init)

(length,) = struct.unpack(">I", conn.recv(4))
print("got", json.loads(conn.recv(length)))
```

Run the stub, then run your OMNeT++ module against it. The stub should print `got {'type': 'INIT_ACK'}` and the OMNeT++ log should show the timestep it parsed out of the fake `INIT`. That is a full round trip through both simulators, even though neither one is doing anything useful yet.

## What's Next

Right now the handshake happens once and then nothing else occurs. Part 4 turns this into an actual loop, with OMNeT++ asking for a fresh position on every simulation step.
