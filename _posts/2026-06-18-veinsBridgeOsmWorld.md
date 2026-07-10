---
layout: post
title: "Part 6. Bootstrapping the World from OpenStreetMap"
date: 2026-06-18 09:00:00+0900
description: Deriving map bounds and building obstacles from a plain OSM file, no SUMO network required.
tags: OSM Veins Tutorial
categories: Systems
featured: false
---

## Introduction

Vehicles now spawn, move, and despawn correctly, but they are doing it in an empty void with no size and no buildings. This part gives the void an actual shape, using nothing but a plain `.osm` export, no SUMO network conversion required.

## What a Map Actually Needs to Provide

For our purposes a map answers exactly two questions. How big is the playground, and where are the buildings that should block a signal. Everything else in an OSM file, roads, bus stops, that one bakery someone tagged with excessive detail, we can ignore entirely.

## Reading the File

An OSM file is XML with two element types we care about. `<node>` elements carry a lat/lon pair each. `<way>` elements reference a sequence of nodes and carry tags, and a way tagged `building=yes` is a building footprint.

```python
import xml.etree.ElementTree as ET

tree = ET.parse("map.osm")
root = tree.getroot()

nodes = {}
for n in root.findall("node"):
    nodes[n.get("id")] = (float(n.get("lat")), float(n.get("lon")))

buildings = []
for way in root.findall("way"):
    is_building = any(
        tag.get("k") == "building" for tag in way.findall("tag")
    )
    if not is_building:
        continue
    refs = [nd.get("ref") for nd in way.findall("nd")]
    buildings.append([nodes[r] for r in refs if r in nodes])
```

## Projecting Lat/Lon Into Meters

OMNeT++ works in a flat local coordinate system, not latitude and longitude, so every point needs projecting. At city scale a simple equirectangular projection anchored at one corner of the map is accurate enough, no need to reach for a full UTM library for this.

```python
import math

EARTH_RADIUS_M = 6378137.0

def project(lat, lon, lat0, lon0):
    x = math.radians(lon - lon0) * math.cos(math.radians(lat0)) * EARTH_RADIUS_M
    y = math.radians(lat - lat0) * EARTH_RADIUS_M
    return x, y
```

Pick `lat0, lon0` as the minimum latitude and longitude across all nodes and every projected point comes out non negative, which is convenient since OMNeT++ playground coordinates are expected to start at zero.

## Computing Bounds and Writing Obstacles

Once every node is projected, bounds fall out as a min and max over `x` and `y`. Buildings become polygons in that same frame. The exact obstacle XML tags depend on which obstacle module your Veins version ships, so check its documentation for attribute names, but the shape is roughly one root element containing one entry per building, each holding an ordered list of projected points.

```xml
<obstacles>
  <obstacle id="0" typeId="building">
    <point x="12.4" y="8.1"/>
    <point x="12.4" y="30.0"/>
    <point x="40.2" y="30.0"/>
    <point x="40.2" y="8.1"/>
  </obstacle>
</obstacles>
```

## Regenerate Every Run, Even When Empty

`omnetpp.ini` typically loads this file unconditionally through something like `xmldoc("obstacles.xml")`. That has two consequences worth remembering. A missing file crashes OMNeT++ at startup rather than degrading gracefully, and a stale file silently carries a previous scenario's buildings into the current run. The fix is to regenerate the file on every single run, writing an empty `<obstacles/>` root when there is nothing to extract rather than skipping the write.

## Feeding Bounds Into INIT

The `INIT` message from Part 3 gains two more fields, the map origin and its size, computed once when the bridge starts.

```json
{"type": "INIT", "timestep": 0.1,
 "map": {"origin_x": 0.0, "origin_y": 0.0, "size_x": 500.0, "size_y": 350.0}}
```

From here on, every incoming position gets shifted by that origin before it reaches `updateMobility`, so the OMNeT++ side never has to think about latitude and longitude again.

## Try It Yourself

Export a small area from openstreetmap.org, run the parser above, and print the resulting bounds and building count. Feed the origin into `INIT`, drop the generated obstacles file where your `omnetpp.ini` expects it, and rerun Part 5's scenario. The vehicle should now be driving past actual buildings instead of through open space.

## What's Next

The last missing piece is the point of this entire series, using the channel Veins actually computed. Part 7 reports received signal quality back out, closing the loop.
