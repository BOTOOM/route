import { z } from "zod"

const HOP_LINE_REGEX = /^\s*(\d+)\s+(.+)$/
const LATENCY_REGEX = /<?(\d+(?:\.\d+)?)\s*ms/gi
const LATENCY_TOKEN_REGEX = /<?\d+(?:\.\d+)?\s*ms/gi
const IPV4_REGEX =
  /\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/g
const IPV4_IN_PARENS_REGEX =
  /\(((?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3})\)/
const IPV4_IN_BRACKETS_REGEX =
  /\[((?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3})\]/
const WINDOWS_DESTINATION_REGEX =
  /Tracing route to\s+(.+?)(?:\s+\[((?:\d{1,3}\.){3}\d{1,3})\])?$/i
const UNIX_DESTINATION_REGEX =
  /traceroute to\s+(.+?)(?:\s+\(((?:\d{1,3}\.){3}\d{1,3})\))?(?:,|$)/i

export const TRACE_SOURCES = [
  "windows",
  "linux",
  "america",
  "europa",
  "asia",
  "oceania",
] as const

export type TraceSource = (typeof TRACE_SOURCES)[number]

export type GeoLookupStatus =
  | "resolved"
  | "private"
  | "missing-ip"
  | "not-found"
  | "provider-unconfigured"
  | "error"

export type GeoLookupProvider = "ipgeolocation" | "ipinfo" | "ipapi" | "local"

export type TraceWarning =
  | { code: "noValidHops" }
  | { code: "unresolvedHops"; count: number }

export type GeoLookupMessageKey =
  | "missingIp"
  | "privateIp"
  | "pending"
  | "providerHttp"
  | "notResolved"
  | "lookupFailed"

export type TraceHop = {
  id: string
  hop: number
  host: string | null
  ip: string | null
  latencyMs: number | null
  latencySamples: number[]
  raw: string
  unresolved: boolean
  isPrivate: boolean
  geo: GeoLookup | null
}

export type ParsedTrace = {
  source: TraceSource
  destination: string | null
  hops: TraceHop[]
  warnings: TraceWarning[]
  raw: string
}

export type GeoLookup = {
  ip: string | null
  provider: GeoLookupProvider
  status: GeoLookupStatus
  isp: string | null
  organization: string | null
  continent: string | null
  country: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  message: string | null
  messageKey: GeoLookupMessageKey | null
  messageParams?: Record<string, string | number>
}

export type TraceMetric = {
  totalHops: number
  publicHops: number
  privateHops: number
  unresolvedHops: number
  resolvedGeoHops: number
  averageLatencyMs: number | null
  finalDestination: string | null
  countries: string[]
}

export type ChartDatum = {
  hop: string
  latency: number
}

export type MapHop = {
  hop: number
  label: string
  latitude: number
  longitude: number
  location: string
  organization: string | null
  ip: string | null
  latencyMs: number | null
}

const ipgeolocationSchema = z.object({
  ip: z.string().optional(),
  isp: z.string().nullable().optional(),
  organization: z.string().nullable().optional(),
  continent_name: z.string().nullable().optional(),
  country_name: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  latitude: z.union([z.string(), z.number()]).nullable().optional(),
  longitude: z.union([z.string(), z.number()]).nullable().optional(),
})

const ipinfoSchema = z.object({
  ip: z.string().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  loc: z.string().nullable().optional(),
  org: z.string().nullable().optional(),
  bogon: z.boolean().optional(),
  error: z
    .object({
      title: z.string().nullable().optional(),
      message: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
})

const ipapiSchema = z.object({
  ip: z.string().optional(),
  city: z.string().nullable().optional(),
  country_name: z.string().nullable().optional(),
  continent_code: z.string().nullable().optional(),
  latitude: z.union([z.string(), z.number()]).nullable().optional(),
  longitude: z.union([z.string(), z.number()]).nullable().optional(),
  org: z.string().nullable().optional(),
  asn: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  error: z.boolean().optional(),
})

function average(values: number[]) {
  if (values.length === 0) {
    return null
  }

  return Number(
    (values.reduce((total, value) => total + value, 0) / values.length).toFixed(
      2,
    ),
  )
}

function splitLines(raw: string) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
}

function firstIpv4(text: string) {
  const matches = text.match(IPV4_REGEX)
  return matches?.[0] ?? null
}

function extractLatencySamples(text: string) {
  return [...text.matchAll(LATENCY_REGEX)].map((match) => Number(match[1]))
}

function sanitizeLabel(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const cleaned = value
    .replace(LATENCY_TOKEN_REGEX, "")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim()

  if (
    cleaned.length === 0 ||
    /^(request timed out\.?|sin respuesta)$/i.test(cleaned)
  ) {
    return null
  }

  return cleaned
}

function createHop(options: {
  hop: number
  host: string | null
  ip: string | null
  latencySamples: number[]
  raw: string
  unresolved?: boolean
}) {
  const ip = options.ip
  const isPrivate = ip ? isPrivateIpv4(ip) : false

  return {
    id: `${options.hop}-${ip ?? "unknown"}-${options.raw.length}`,
    hop: options.hop,
    host: sanitizeLabel(options.host),
    ip,
    latencySamples: options.latencySamples,
    latencyMs: average(options.latencySamples),
    raw: options.raw,
    unresolved:
      options.unresolved ?? (!ip && options.latencySamples.length === 0),
    isPrivate,
    geo: buildLocalGeoState(ip, isPrivate),
  } satisfies TraceHop
}

function extractDestination(raw: string, source: TraceSource) {
  const firstLines = splitLines(raw).slice(0, 5)

  if (source === "windows") {
    for (const line of firstLines) {
      const match = line.match(WINDOWS_DESTINATION_REGEX)
      if (match) {
        return match[2] ?? match[1].trim()
      }
    }
  }

  for (const line of firstLines) {
    const match = line.match(UNIX_DESTINATION_REGEX)
    if (match) {
      return match[2] ?? match[1].trim()
    }
  }

  return null
}

function parseWindowsLine(line: string) {
  const match = line.match(HOP_LINE_REGEX)
  if (!match) {
    return null
  }

  const hop = Number(match[1])
  const content = match[2].trim()
  const latencySamples = extractLatencySamples(content)
  const ip =
    content.match(IPV4_IN_BRACKETS_REGEX)?.[1] ?? firstIpv4(content) ?? null

  const timeout = /request timed out/i.test(content)
  const withoutLatencies = content.replace(LATENCY_TOKEN_REGEX, "").trim()

  let host = withoutLatencies
  if (ip && content.match(IPV4_IN_BRACKETS_REGEX)) {
    host = withoutLatencies.replace(`[${ip}]`, "").trim()
  } else if (ip) {
    host = withoutLatencies.replace(ip, "").trim()
  }

  return createHop({
    hop,
    host,
    ip,
    latencySamples,
    raw: line,
    unresolved: timeout || (!ip && latencySamples.length === 0),
  })
}

function parseUnixLikeLine(line: string) {
  const match = line.match(HOP_LINE_REGEX)
  if (!match) {
    return null
  }

  const hop = Number(match[1])
  const content = match[2].trim()
  const latencySamples = extractLatencySamples(content)
  const ip =
    content.match(IPV4_IN_PARENS_REGEX)?.[1] ?? firstIpv4(content) ?? null

  let host: string | null = null

  if (ip && content.includes(`(${ip})`)) {
    host = content.slice(0, content.indexOf(`(${ip})`)).trim()
  } else if (ip && !content.startsWith(ip)) {
    host = content.slice(0, content.indexOf(ip)).trim()
  }

  return createHop({
    hop,
    host,
    ip,
    latencySamples,
    raw: line,
    unresolved: /^(?:\*\s*)+$/.test(content) || (!ip && latencySamples.length === 0),
  })
}

function parseLines(raw: string, source: TraceSource) {
  const parser = source === "windows" ? parseWindowsLine : parseUnixLikeLine
  const lines = splitLines(raw)

  return lines
    .map((line) => parser(line))
    .flatMap((hop) => (hop ? [hop] : []))
}

export function parseTrace(raw: string, source: TraceSource): ParsedTrace {
  const hops = parseLines(raw, source)
  const warnings: TraceWarning[] = []

  if (hops.length === 0) {
    warnings.push({ code: "noValidHops" })
  }

  const unresolvedHops = hops.filter((hop) => hop.unresolved).length
  if (unresolvedHops > 0) {
    warnings.push({ code: "unresolvedHops", count: unresolvedHops })
  }

  return {
    source,
    destination: extractDestination(raw, source),
    hops,
    warnings,
    raw,
  }
}

function parseNumber(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function buildLocalGeoState(ip: string | null, isPrivate: boolean): GeoLookup {
  if (!ip) {
    return {
      ip,
      provider: "local",
      status: "missing-ip",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: null,
      messageKey: "missingIp",
    }
  }

  if (isPrivate) {
    return {
      ip,
      provider: "local",
      status: "private",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: null,
      messageKey: "privateIp",
    }
  }

  return {
    ip,
    provider: "local",
    status: "provider-unconfigured",
    isp: null,
    organization: null,
    continent: null,
    country: null,
    city: null,
    latitude: null,
    longitude: null,
    message: null,
    messageKey: "pending",
  }
}

async function fetchIpGeolocation(ip: string, apiKey: string): Promise<GeoLookup> {
  const response = await fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`,
  )

  if (!response.ok) {
    return {
      ip,
      provider: "ipgeolocation",
      status: "error",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: null,
      messageKey: "providerHttp",
      messageParams: {
        provider: "ipgeolocation",
        status: response.status,
      },
    }
  }

  const payload = ipgeolocationSchema.parse(await response.json())

  return {
    ip,
    provider: "ipgeolocation",
    status: "resolved",
    isp: payload.isp ?? null,
    organization: payload.organization ?? null,
    continent: payload.continent_name ?? null,
    country: payload.country_name ?? null,
    city: payload.city ?? null,
    latitude: parseNumber(payload.latitude),
    longitude: parseNumber(payload.longitude),
    message: null,
    messageKey: null,
  }
}

async function fetchIpinfo(ip: string, token: string): Promise<GeoLookup> {
  const response = await fetch(
    `https://ipinfo.io/${ip}/json?token=${encodeURIComponent(token)}`,
  )

  if (!response.ok) {
    return {
      ip,
      provider: "ipinfo",
      status: "error",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: null,
      messageKey: "providerHttp",
      messageParams: {
        provider: "ipinfo",
        status: response.status,
      },
    }
  }

  const payload = ipinfoSchema.parse(await response.json())
  const [latitude, longitude] =
    payload.loc?.split(",").map((value) => Number(value)) ?? []

  if (payload.bogon || payload.error) {
    return {
      ip,
      provider: "ipinfo",
      status: payload.bogon ? "private" : "not-found",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: payload.error?.message ?? payload.error?.title ?? null,
      messageKey: "notResolved",
    }
  }

  return {
    ip,
    provider: "ipinfo",
    status: "resolved",
    isp: payload.org ?? null,
    organization: payload.org ?? null,
    continent: null,
    country: payload.country ?? null,
    city: payload.city ?? null,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    message: null,
    messageKey: null,
  }
}

async function fetchIpapi(ip: string): Promise<GeoLookup> {
  const response = await fetch(`https://ipapi.co/${ip}/json/`)

  if (!response.ok) {
    return {
      ip,
      provider: "ipapi",
      status: "error",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: null,
      messageKey: "providerHttp",
      messageParams: {
        provider: "ipapi.co",
        status: response.status,
      },
    }
  }

  const payload = ipapiSchema.parse(await response.json())

  if (payload.error) {
    return {
      ip,
      provider: "ipapi",
      status: "not-found",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: payload.reason ?? null,
      messageKey: "notResolved",
    }
  }

  return {
    ip,
    provider: "ipapi",
    status: "resolved",
    isp: payload.org ?? payload.asn ?? null,
    organization: payload.org ?? null,
    continent: payload.continent_code ?? null,
    country: payload.country_name ?? null,
    city: payload.city ?? null,
    latitude: parseNumber(payload.latitude),
    longitude: parseNumber(payload.longitude),
    message: null,
    messageKey: null,
  }
}

async function resolveGeo(ip: string, isPrivate: boolean): Promise<GeoLookup> {
  if (isPrivate) {
    return buildLocalGeoState(ip, true)
  }

  const ipinfoToken = import.meta.env.VITE_IPINFO_TOKEN?.trim()
  const ipgeolocationApiKey = import.meta.env.VITE_IPGEOLOCATION_API_KEY?.trim()

  try {
    if (ipinfoToken) {
      const primary = await fetchIpinfo(ip, ipinfoToken)
      if (primary.status === "resolved") {
        return primary
      }
    }

    if (ipgeolocationApiKey) {
      const secondary = await fetchIpGeolocation(ip, ipgeolocationApiKey)
      if (secondary.status === "resolved") {
        return secondary
      }
    }

    return await fetchIpapi(ip)
  } catch (error) {
    return {
      ip,
      provider: ipinfoToken
        ? "ipinfo"
        : ipgeolocationApiKey
          ? "ipgeolocation"
          : "ipapi",
      status: "error",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: error instanceof Error ? error.message : null,
      messageKey: "lookupFailed",
    }
  }
}

export async function enrichTraceWithGeo(trace: ParsedTrace) {
  const hops = await Promise.all(
    trace.hops.map(async (hop) => {
      if (!hop.ip) {
        return {
          ...hop,
          geo: buildLocalGeoState(null, false),
        }
      }

      return {
        ...hop,
        geo: await resolveGeo(hop.ip, hop.isPrivate),
      }
    }),
  )

  return {
    ...trace,
    hops,
  } satisfies ParsedTrace
}

export function getTraceMetrics(trace: ParsedTrace): TraceMetric {
  const countries = new Set(
    trace.hops
      .map((hop) => hop.geo?.country)
      .filter((country): country is string => Boolean(country)),
  )

  return {
    totalHops: trace.hops.length,
    publicHops: trace.hops.filter((hop) => hop.ip && !hop.isPrivate).length,
    privateHops: trace.hops.filter((hop) => hop.isPrivate).length,
    unresolvedHops: trace.hops.filter((hop) => hop.unresolved).length,
    resolvedGeoHops: trace.hops.filter(
      (hop) =>
        hop.geo?.status === "resolved" &&
        hop.geo.latitude !== null &&
        hop.geo.longitude !== null,
    ).length,
    averageLatencyMs: average(
      trace.hops
        .map((hop) => hop.latencyMs)
        .filter((latency): latency is number => latency !== null),
    ),
    finalDestination: trace.destination ?? trace.hops.at(-1)?.ip ?? null,
    countries: [...countries],
  }
}

export function getChartData(trace: ParsedTrace): ChartDatum[] {
  return trace.hops
    .filter((hop) => hop.latencyMs !== null)
    .map((hop) => ({
      hop: `${hop.hop}`,
      latency: hop.latencyMs ?? 0,
    }))
}

export function getMapHops(trace: ParsedTrace): MapHop[] {
  return trace.hops
    .filter(
      (hop): hop is TraceHop & { geo: GeoLookup } =>
        hop.geo?.status === "resolved" &&
        hop.geo.latitude !== null &&
        hop.geo.longitude !== null,
    )
    .map((hop) => ({
      hop: hop.hop,
      label: `${hop.hop}`,
      latitude: hop.geo.latitude ?? 0,
      longitude: hop.geo.longitude ?? 0,
      location: [hop.geo.city, hop.geo.country].filter(Boolean).join(", "),
      organization: hop.geo.organization,
      ip: hop.ip,
      latencyMs: hop.latencyMs,
    }))
}

export function getRouteCoordinates(trace: ParsedTrace) {
  return getMapHops(trace).map((hop) => [hop.longitude, hop.latitude] as [
    number,
    number,
  ])
}

export function getMapCenter(trace: ParsedTrace): [number, number] {
  const coordinates = getRouteCoordinates(trace)

  if (coordinates.length === 0) {
    return [-74.0721, 4.711]
  }

  const [longitude, latitude] = coordinates.reduce(
    (totals, coordinate) => {
      return [totals[0] + coordinate[0], totals[1] + coordinate[1]]
    },
    [0, 0],
  )

  return [
    Number((longitude / coordinates.length).toFixed(4)),
    Number((latitude / coordinates.length).toFixed(4)),
  ]
}

export function formatGeoStatus(geo: GeoLookup | null) {
  return getGeoStatusKey(geo)
}

export function getGeoStatusKey(geo: GeoLookup | null) {
  if (!geo) {
    return "traceroute.geoStatus.empty"
  }

  switch (geo.status) {
    case "resolved":
      return "traceroute.geoStatus.resolved"
    case "private":
      return "traceroute.geoStatus.private"
    case "missing-ip":
      return "traceroute.geoStatus.missingIp"
    case "not-found":
      return "traceroute.geoStatus.notFound"
    case "provider-unconfigured":
      return "traceroute.geoStatus.providerUnconfigured"
    case "error":
      return "traceroute.geoStatus.error"
    default:
      return "traceroute.geoStatus.empty"
  }
}

export function getSourceLabel(source: TraceSource) {
  return getSourceLabelKey(source)
}

export function getSourceLabelKey(source: TraceSource) {
  const labels: Record<TraceSource, string> = {
    windows: "traceroute.source.windows",
    linux: "traceroute.source.linux",
    america: "traceroute.source.america",
    europa: "traceroute.source.europa",
    asia: "traceroute.source.asia",
    oceania: "traceroute.source.oceania",
  }

  return labels[source]
}

export function isPrivateIpv4(ip: string) {
  const octets = ip.split(".").map(Number)
  const [first, second, third, fourth] = octets

  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet))) {
    return true
  }

  if (first === 0 || first === 10 || first === 127) {
    return true
  }

  if (first === 100 && second >= 64 && second <= 127) {
    return true
  }

  if (first === 169 && second === 254) {
    return true
  }

  if (first === 172 && second >= 16 && second <= 31) {
    return true
  }

  if (first === 192 && second === 0 && third === 0) {
    return true
  }

  if (first === 192 && second === 0 && third === 2) {
    return true
  }

  if (first === 192 && second === 168) {
    return true
  }

  if (first === 198 && (second === 18 || second === 19)) {
    return true
  }

  if (first === 198 && second === 51 && third === 100) {
    return true
  }

  if (first === 203 && second === 0 && third === 113) {
    return true
  }

  if (first === 255 && second === 255 && third === 255 && fourth === 255) {
    return true
  }

  return first >= 224
}
