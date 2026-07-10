---
layout: post
title: "Part 8. Exposing Bit and Packet Error Rate"
date: 2026-07-08 09:00:00+0900
description: Veins already computes packet and bit error rate internally and throws them away. A small patch gets them back.
tags: V2X Veins Tutorial
categories: Systems
featured: false
---

## Introduction

Part 7 got signal to noise ratio, received power, and collision status flowing back out of Veins. That is already a usable channel report, but Veins is quietly computing two more numbers worth having, packet error rate and raw bit error rate, and then discarding both before your application layer ever sees them. This part gets them back, without reimplementing any wireless math from scratch.

## The Numbers Already Exist

Veins' 802.11p decider decides whether a frame counts as received by computing a per modulation chunk success rate and comparing it against a random draw. That success rate calculation already needs the exact packet error rate we want, it just never gets handed back to the caller once the decode decision has been made.

```cpp
// existing code, unchanged
packetOkSinr = NistErrorRate::getChunkSuccessRate(
    bitrate, BANDWIDTH_11P, sinrMin,
    PHY_HDR_SERVICE_LENGTH + lengthMPDU + PHY_TAIL_LENGTH);
```

Packet error rate is just one minus that number. It was sitting right there the whole time.

## Surfacing Packet Error Rate

Give `packetOk` two optional out parameters and fill them in before the function decides which of DECODED, NOT_DECODED, or COLLISION to return.

```cpp
enum Decider80211p::PACKET_OK_RESULT Decider80211p::packetOk(
    double sinrMin, double snrMin, int lengthMPDU, double bitrate,
    double* outPer, double* outBer) {

  double packetOkSinr = NistErrorRate::getChunkSuccessRate(
      bitrate, BANDWIDTH_11P, sinrMin,
      PHY_HDR_SERVICE_LENGTH + lengthMPDU + PHY_TAIL_LENGTH);

  if (outPer) *outPer = 1.0 - packetOkSinr;
  if (outBer) *outBer = NistErrorRate::getRawBer(bitrate, BANDWIDTH_11P, sinrMin);

  // header check and the DECODED / NOT_DECODED / COLLISION logic below is untouched
}
```

Both values get computed unconditionally, before the branching, so they come out populated whether the frame decoded cleanly, failed from low power, or collided with another transmission.

## A Raw Bit Error Rate Function

`getChunkSuccessRate` already folds in the coding gain from forward error correction, which is exactly what you want for a decode decision and not quite what you want for a raw bit error rate. Add a sibling function that stops one step earlier.

```cpp
double NistErrorRate::getRawBer(unsigned int datarate, Bandwidth bw, double snr_mW) {
  switch (getMCS(datarate, bw)) {
    case MCS::ofdm_bpsk_r_1_2:
    case MCS::ofdm_bpsk_r_3_4:
      return getBpskBer(snr_mW);
    case MCS::ofdm_qpsk_r_1_2:
    case MCS::ofdm_qpsk_r_3_4:
      return getQpskBer(snr_mW);
    case MCS::ofdm_qam16_r_1_2:
    case MCS::ofdm_qam16_r_3_4:
      return get16QamBer(snr_mW);
    case MCS::ofdm_qam64_r_2_3:
    case MCS::ofdm_qam64_r_3_4:
      return get64QamBer(snr_mW);
    default:
      ASSERT2(false, "unhandled modulation");
      return 0;
  }
}
```

Every per modulation BER curve used here already existed inside `NistErrorRate` for `getChunkSuccessRate`'s own use. This just calls the same math one step earlier and hands the raw number straight back instead of folding it into a coded success rate.

## Two New Getters

`DeciderResult80211` gains a `per` and a `ber` field, populated by the same constructor call that already sets signal to noise ratio and received power, plus two small accessors.

```cpp
double getPer() const { return per; }
double getBer() const { return ber; }
```

Both default to minus one, meaning not evaluated, so any existing caller that never passes them keeps behaving exactly as before.

## Applying It as a Patch

This change touches Veins itself rather than your own bridge code, so keep it as a patch file applied on top of a clean checkout rather than a long lived fork you have to rebase by hand every time Veins updates.

```bash
patch -p1 -d /path/to/veins-5.3.1 < veins-core-ber-per.patch
```

Every part of it is additive. No existing function signature changes meaning for existing callers, and no existing scenario that never asked for `per`/`ber` behaves any differently after applying it.

## Wiring It Into the Report

Part 7's `onWSM` hook now has two more numbers available for free.

```cpp
BridgeManager::getInstance()->reportEvent({
  .sender = wsm->getSenderAddress(),
  .receiver = getParentModule()->getFullName(),
  .snr_db = result->getSnr(),
  .recv_power_dbm = result->getRecvPower_dBm(),
  .is_collision = result->isCollision(),
  .per = result->getPer(),
  .ber = result->getBer(),
});
```

Thread `per` and `ber` through the same `V2X_EVENT` message and the same channel status table from Part 7, and every downstream consumer gets a full link budget rather than just a rough signal to noise number.

## Try It Yourself

Apply the patch, rebuild Veins, rerun Part 7's scenario, and confirm `getPer()`/`getBer()` come back with real numbers instead of the minus one default. Drive the vehicle further from the stationary node and watch both climb well before frames actually start failing to decode, since forward error correction buys real headroom against raw bit errors before it finally gives up.

## Where the Series Leaves Off

That closes the loop the whole series was building toward. Positions go in from wherever you actually keep them, a full physically grounded link budget comes back out, and neither side of that exchange ever needed to know how the other one works internally. What you do with that channel feed from here is entirely up to you. Mine happens to feed a multi armed bandit trying to solve user association, which is a story for a different project page entirely.
