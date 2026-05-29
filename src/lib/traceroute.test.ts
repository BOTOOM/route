import { afterEach, describe, expect, it, vi } from "vitest"

import {
  enrichTraceWithGeo,
  getChartData,
  getMapCenter,
  getMapHops,
  getTraceMetrics,
  isPrivateIpv4,
  parseTrace,
} from "@/lib/traceroute"

const windowsTrace = `
Tracing route to github.com [140.82.121.4]
over a maximum of 30 hops:

  1     1 ms     1 ms     1 ms  router.local [192.168.0.1]
  2    11 ms    12 ms    10 ms  10.0.0.1
  3    24 ms    23 ms    24 ms  ae1.edge.example.net [203.0.113.5]
  4     *        *        *     Request timed out.
`

const unixTrace = `
traceroute to github.com (140.82.121.4), 30 hops max, 60 byte packets
 1  _gateway (192.168.1.1)  1.123 ms  0.991 ms  0.900 ms
 2  172.16.0.1  5.111 ms  5.053 ms  5.008 ms
 3  core1.isp.net (198.51.100.9)  20.111 ms  19.888 ms  20.002 ms
 4  * * *
`

const globalTrace = `
traceroute to example.com (93.184.216.34), 30 hops max, 60 byte packets
 1  ae1.border.example.net (203.0.113.1)  10.1 ms  9.9 ms  9.8 ms
 2  203.0.113.9  20.5 ms  20.4 ms  20.3 ms
`

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("parseTrace", () => {
  it("normalizes Windows tracert output", () => {
    const parsed = parseTrace(windowsTrace, "windows")

    expect(parsed.destination).toBe("140.82.121.4")
    expect(parsed.hops).toHaveLength(4)
    expect(parsed.hops[0]).toMatchObject({
      hop: 1,
      host: "router.local",
      ip: "192.168.0.1",
      isPrivate: true,
      latencyMs: 1,
    })
    expect(parsed.hops[1]).toMatchObject({
      hop: 2,
      host: null,
      ip: "10.0.0.1",
      isPrivate: true,
      latencyMs: 11,
    })
    expect(parsed.hops[3]?.unresolved).toBe(true)
    expect(parsed.warnings).toContain(
      "Se detectaron 1 saltos sin respuesta o sin IP visible.",
    )
  })

  it("normalizes Unix traceroute output", () => {
    const parsed = parseTrace(unixTrace, "linux")

    expect(parsed.destination).toBe("140.82.121.4")
    expect(parsed.hops).toHaveLength(4)
    expect(parsed.hops[0]).toMatchObject({
      host: "_gateway",
      ip: "192.168.1.1",
      isPrivate: true,
    })
    expect(parsed.hops[2]).toMatchObject({
      host: "core1.isp.net",
      ip: "198.51.100.9",
      isPrivate: false,
      latencyMs: 20,
    })
    expect(parsed.hops[3]?.ip).toBeNull()
    expect(parsed.hops[3]?.unresolved).toBe(true)
  })

  it("supports global looking-glass profiles with unix-like output", () => {
    const parsed = parseTrace(globalTrace, "america")

    expect(parsed.source).toBe("america")
    expect(parsed.destination).toBe("93.184.216.34")
    expect(parsed.hops).toHaveLength(2)
    expect(parsed.hops[0]).toMatchObject({
      host: "ae1.border.example.net",
      ip: "203.0.113.1",
    })
    expect(parsed.hops[1]).toMatchObject({
      host: null,
      ip: "203.0.113.9",
      latencyMs: 20.4,
    })
  })
})

describe("trace helpers", () => {
  it("computes private ranges correctly", () => {
    expect(isPrivateIpv4("10.0.0.1")).toBe(true)
    expect(isPrivateIpv4("172.16.4.9")).toBe(true)
    expect(isPrivateIpv4("192.168.10.8")).toBe(true)
    expect(isPrivateIpv4("169.254.1.10")).toBe(true)
    expect(isPrivateIpv4("8.8.8.8")).toBe(false)
  })

  it("derives metrics, chart data and map data from enriched traces", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        ip: "198.51.100.9",
        continent: "North America",
        country: "United States",
        city: "San Jose",
        latitude: 37.3382,
        longitude: -121.8863,
        connection: {
          isp: "Example ISP",
          org: "Example Backbone",
        },
      }),
    })

    vi.stubGlobal("fetch", fetchMock)

    const parsed = parseTrace(unixTrace, "linux")
    const enriched = await enrichTraceWithGeo(parsed)
    const metrics = getTraceMetrics(enriched)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith("https://ipwho.is/198.51.100.9")
    expect(enriched.hops[0]?.geo?.status).toBe("private")
    expect(enriched.hops[2]?.geo).toMatchObject({
      status: "resolved",
      country: "United States",
      city: "San Jose",
    })
    expect(metrics).toMatchObject({
      totalHops: 4,
      publicHops: 1,
      privateHops: 2,
      unresolvedHops: 1,
      resolvedGeoHops: 1,
      finalDestination: "140.82.121.4",
      countries: ["United States"],
    })
    expect(metrics.averageLatencyMs).toBeCloseTo(8.69, 2)
    expect(getChartData(enriched)).toHaveLength(3)
    expect(getMapHops(enriched)).toHaveLength(1)
    expect(getMapCenter(enriched)).toEqual([-121.8863, 37.3382])
  })
})
