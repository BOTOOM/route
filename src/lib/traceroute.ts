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

export type GeoLookupProvider = "ipgeolocation" | "ipwhois" | "local"

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
  warnings: string[]
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

const ipwhoisSchema = z.object({
  success: z.boolean().optional(),
  ip: z.string().optional(),
  continent: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  latitude: z.union([z.string(), z.number()]).nullable().optional(),
  longitude: z.union([z.string(), z.number()]).nullable().optional(),
  connection: z
    .object({
      isp: z.string().nullable().optional(),
      org: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  message: z.string().nullable().optional(),
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
  const warnings: string[] = []

  if (hops.length === 0) {
    warnings.push(
      "No se detectaron saltos válidos. Verifica que pegaste la salida completa del traceroute o cambia el perfil del parser.",
    )
  }

  const unresolvedHops = hops.filter((hop) => hop.unresolved).length
  if (unresolvedHops > 0) {
    warnings.push(
      `Se detectaron ${unresolvedHops} saltos sin respuesta o sin IP visible.`,
    )
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
      message: "El salto no expone una IP pública.",
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
      message: "IP privada o interna; no se intenta geolocalizar.",
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
    message: "Pendiente de resolución geográfica.",
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
      message: `ipgeolocation respondió ${response.status}.`,
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
  }
}

async function fetchIpwhois(ip: string): Promise<GeoLookup> {
  const response = await fetch(`https://ipwho.is/${ip}`)

  if (!response.ok) {
    return {
      ip,
      provider: "ipwhois",
      status: "error",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: `ipwho.is respondió ${response.status}.`,
    }
  }

  const payload = ipwhoisSchema.parse(await response.json())

  if (payload.success === false) {
    return {
      ip,
      provider: "ipwhois",
      status: "not-found",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message: payload.message ?? "No se pudo resolver la IP.",
    }
  }

  return {
    ip,
    provider: "ipwhois",
    status: "resolved",
    isp: payload.connection?.isp ?? null,
    organization: payload.connection?.org ?? null,
    continent: payload.continent ?? null,
    country: payload.country ?? null,
    city: payload.city ?? null,
    latitude: parseNumber(payload.latitude),
    longitude: parseNumber(payload.longitude),
    message: null,
  }
}

async function resolveGeo(ip: string, isPrivate: boolean): Promise<GeoLookup> {
  if (isPrivate) {
    return buildLocalGeoState(ip, true)
  }

  const apiKey = import.meta.env.VITE_IPGEOLOCATION_API_KEY?.trim()

  try {
    if (apiKey) {
      const primary = await fetchIpGeolocation(ip, apiKey)
      if (primary.status === "resolved") {
        return primary
      }
    }

    return await fetchIpwhois(ip)
  } catch (error) {
    return {
      ip,
      provider: apiKey ? "ipgeolocation" : "ipwhois",
      status: "error",
      isp: null,
      organization: null,
      continent: null,
      country: null,
      city: null,
      latitude: null,
      longitude: null,
      message:
        error instanceof Error
          ? error.message
          : "No fue posible resolver la geolocalización.",
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
  if (!geo) {
    return "Sin datos"
  }

  switch (geo.status) {
    case "resolved":
      return "Resuelta"
    case "private":
      return "Privada"
    case "missing-ip":
      return "Sin IP"
    case "not-found":
      return "No encontrada"
    case "provider-unconfigured":
      return "Pendiente"
    case "error":
      return "Error"
    default:
      return "Sin datos"
  }
}

export function getSourceLabel(source: TraceSource) {
  const labels: Record<TraceSource, string> = {
    windows: "Windows / tracert",
    linux: "Linux / macOS / traceroute",
    america: "Looking glass América",
    europa: "Looking glass Europa",
    asia: "Looking glass Asia",
    oceania: "Looking glass Oceanía",
  }

  return labels[source]
}

export function isPrivateIpv4(ip: string) {
  const [first, second] = ip.split(".").map(Number)

  if (first === 10) {
    return true
  }

  if (first === 172 && second >= 16 && second <= 31) {
    return true
  }

  if (first === 192 && second === 168) {
    return true
  }

  if (first === 127 || first === 0 || first === 169) {
    return true
  }

  return false
}
