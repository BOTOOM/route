import { describe, expect, it } from "vitest"

import {
  buildAnimatedCoordinates,
  createRouteSegments,
  getPlaybackHops,
  interpolateRouteCoordinate,
  playbackSegmentDurationMs,
} from "@/lib/route-playback"
import type { MapHop } from "@/lib/traceroute"

function mapHop(overrides: Partial<MapHop>): MapHop {
  return {
    hop: 1,
    label: "1",
    latitude: 0,
    longitude: 0,
    location: "",
    organization: null,
    ip: null,
    latencyMs: null,
    ...overrides,
  }
}

describe("route playback helpers", () => {
  it("scales segment duration from latency with useful bounds", () => {
    expect(playbackSegmentDurationMs(null)).toBe(900)
    expect(playbackSegmentDurationMs(-1)).toBe(900)
    expect(playbackSegmentDurationMs(1)).toBe(360)
    expect(playbackSegmentDurationMs(25)).toBe(710)
    expect(playbackSegmentDurationMs(10_000)).toBe(1700)
  })

  it("interpolates across the antimeridian using the shortest path", () => {
    expect(interpolateRouteCoordinate([170, 10], [-170, 20], 0.5)).toEqual([
      180,
      15,
    ])
    expect(interpolateRouteCoordinate([-170, 10], [170, 20], 0.5)).toEqual([
      -180,
      15,
    ])
  })

  it("splits route segments at the antimeridian instead of drawing across the world", () => {
    expect(createRouteSegments([[-122, 37], [153, -27]])).toEqual([
      [
        [-122, 37],
        [-180, -6.670588],
      ],
      [
        [180, -6.670588],
        [153, -27],
      ],
    ])

    expect(createRouteSegments([[170, 10], [-170, 20]])).toEqual([
      [
        [170, 10],
        [180, 15],
      ],
      [
        [-180, 15],
        [-170, 20],
      ],
    ])
  })

  it("collapses adjacent hops that share the same visible coordinates", () => {
    const hops = [
      mapHop({ hop: 1, longitude: -74, latitude: 4.7 }),
      mapHop({ hop: 2, longitude: -74.0001, latitude: 4.7001 }),
      mapHop({ hop: 3, longitude: -58.4, latitude: -34.6 }),
    ]

    expect(getPlaybackHops(hops).map((hop) => hop.hop)).toEqual([1, 3])
  })

  it("builds coordinates that reveal the active segment progressively", () => {
    const hops = [
      mapHop({ hop: 1, longitude: 0, latitude: 0 }),
      mapHop({ hop: 2, longitude: 10, latitude: 10 }),
      mapHop({ hop: 3, longitude: 20, latitude: 0 }),
    ]

    expect(buildAnimatedCoordinates(hops, 1, 0.25)).toEqual([
      [0, 0],
      [10, 10],
      [12.5, 7.5],
    ])
  })
})
