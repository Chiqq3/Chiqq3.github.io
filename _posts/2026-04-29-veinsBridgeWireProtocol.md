---
layout: post
title: "Part 2. A Length Prefixed JSON Protocol"
date: 2026-04-29 09:00:00+0900
description: Framing messages over a raw TCP socket so both sides always agree on where one message ends and the next begins.
tags: TCP OMNeT++ Tutorial Veins
categories: Systems
featured: false
---

## Introduction

Part 1 gave us a clean stream of vehicle positions coming out of a toy ROS node. Before any of that reaches Veins it has to cross a plain TCP socket, and TCP has an inconvenient property worth dealing with early.

## Why Framing Matters

TCP delivers a stream of bytes, with no concept of "message" built in. Send two JSON documents back to back and the other side might receive them in one read, or in three, split at an arbitrary byte. Without an agreement on boundaries, the receiver has no reliable way to know where one message ends and the next begins.

The usual fix is a length prefix. Send four bytes stating how many bytes follow, then send exactly that many bytes. The receiver reads the four byte header first, learns the payload size, then reads exactly that much and stops. Simple, and it works regardless of how the underlying stream happens to chop things up.

## The Recipe

```cpp
#include <arpa/inet.h>
#include <cstdint>
#include <string>
#include <sys/socket.h>

bool send_json(int fd, const std::string& body) {
  uint32_t len = htonl(static_cast<uint32_t>(body.size()));
  if (send(fd, &len, sizeof(len), 0) != sizeof(len)) return false;
  size_t sent = 0;
  while (sent < body.size()) {
    ssize_t n = send(fd, body.data() + sent, body.size() - sent, 0);
    if (n <= 0) return false;
    sent += static_cast<size_t>(n);
  }
  return true;
}

bool recv_json(int fd, std::string& out) {
  uint32_t len_net = 0;
  if (recv(fd, &len_net, sizeof(len_net), MSG_WAITALL) != sizeof(len_net)) return false;
  uint32_t len = ntohl(len_net);

  out.resize(len);
  size_t got = 0;
  while (got < len) {
    ssize_t n = recv(fd, out.data() + got, len - got, 0);
    if (n <= 0) return false;
    got += static_cast<size_t>(n);
  }
  return true;
}
```

`htonl`/`ntohl` handle byte order so the same code works regardless of which machine is big endian and which is little endian. Everything else is a loop that keeps calling `send`/`recv` until the expected number of bytes has actually moved, since either call is allowed to transfer less than you asked for.

## A Standalone Echo Test

Wrap this in the smallest possible server so we can poke it without any Veins or ROS involved yet.

```cpp
int main() {
  int server_fd = socket(AF_INET, SOCK_STREAM, 0);
  sockaddr_in addr{};
  addr.sin_family = AF_INET;
  addr.sin_addr.s_addr = INADDR_ANY;
  addr.sin_port = htons(6666);
  bind(server_fd, reinterpret_cast<sockaddr*>(&addr), sizeof(addr));
  listen(server_fd, 1);

  int client_fd = accept(server_fd, nullptr, nullptr);
  std::string body;
  while (recv_json(client_fd, body)) {
    send_json(client_fd, body);  // echo it straight back
  }
}
```

## Try It Yourself

Compile the echo server and poke it from Python, which makes the length prefix easy to construct by hand and lets us sanity check the framing independently of the C++ side.

```bash
g++ -std=c++17 echo_server.cpp -o echo_server
./echo_server &
```

```python
import socket, struct, json

s = socket.create_connection(("localhost", 6666))
body = json.dumps({"hello": "veins"}).encode()
s.sendall(struct.pack(">I", len(body)) + body)

(length,) = struct.unpack(">I", s.recv(4))
print(json.loads(s.recv(length)))
```

You should get `{'hello': 'veins'}` printed straight back. Try sending two messages in a tight loop with no delay between them and confirm both come back intact and in order. That is the framing this whole series relies on, and it is small enough that it is worth actually testing rather than trusting.

## What's Next

Part 3 puts this protocol to work inside a real OMNeT++ module, connecting out to a TCP server for the first time and completing a small handshake.
