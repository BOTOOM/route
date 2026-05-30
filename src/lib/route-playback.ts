import type { MapHop } from "@/lib/traceroute"

export type RouteCoordinate = [number, number]

const MIN_SEGMENT_DURATION_MS = 360
const MAX_SEGMENT_DURATION_MS = 1700
const UNKNOWN_SEGMENT_DURATION_MS = 900
const COORDINATE_EPSILON = 0.0005

export function getPlaybackCoordinate(hop: Pick<MapHop, "longitude" | "latitude">): RouteCoordinate {
  return [hop.longitude, hop.latitude]
}

export function playbackSegmentDurationMs(latencyMs: number | null | undefined) {
  if (latencyMs === null || latencyMs === undefined || Number.isNaN(latencyMs) || latencyMs <= 0) {
    return UNKNOWN_SEGMENT_DURATION_MS
  }

  return Math.round(
    Math.min(
      MAX_SEGMENT_DURATION_MS,
      Math.max(MIN_SEGMENT_DURATION_MS, 260 + Math.sqrt(latencyMs) * 90),
    ),
  )
}

export function interpolateRouteCoordinate(
  start: RouteCoordinate,
  end: RouteCoordinate,
  progress: number,
): RouteCoordinate {
  const safeProgress = Math.min(Math.max(progress, 0), 1)
  const [startLongitude, startLatitude] = start
  const [endLongitude, endLatitude] = end
  const adjustedEndLongitude = unwrapEndLongitude(startLongitude, endLongitude)

  return [
    roundCoordinate(
      normalizeLongitude(
        startLongitude + (adjustedEndLongitude - startLongitude) * safeProgress,
      ),
    ),
    roundCoordinate(startLatitude + (endLatitude - startLatitude) * safeProgress),
  ]
}

export function createRouteSegments(coordinates: RouteCoordinate[]) {
  const segments: RouteCoordinate[][] = []

  for (let index = 0; index < coordinates.length - 1; index += 1) {
    segments.push(...createRouteSegment(coordinates[index], coordinates[index + 1]))
  }

  return segments
}

export function getPlaybackHops(mapHops: MapHop[]) {
  return mapHops.filter((hop, index) => {
    const previous = mapHops[index - 1]

    if (!previous) {
      return true
    }

    return !areCoordinatesClose(getPlaybackCoordinate(previous), getPlaybackCoordinate(hop))
  })
}

export function buildAnimatedCoordinates(
  playbackHops: MapHop[],
  segmentIndex: number,
  progress: number,
): RouteCoordinate[] {
  const currentHop = playbackHops[segmentIndex]
  const nextHop = playbackHops[segmentIndex + 1]

  if (!currentHop || !nextHop) {
    return playbackHops.map(getPlaybackCoordinate)
  }

  const completedCoordinates = playbackHops
    .slice(0, segmentIndex + 1)
    .map(getPlaybackCoordinate)

  return [
    ...completedCoordinates,
    interpolateRouteCoordinate(
      getPlaybackCoordinate(currentHop),
      getPlaybackCoordinate(nextHop),
      progress,
    ),
  ]
}

function createRouteSegment(start: RouteCoordinate, end: RouteCoordinate): RouteCoordinate[][] {
  const [startLongitude, startLatitude] = start
  const [endLongitude, endLatitude] = end
  const adjustedEndLongitude = unwrapEndLongitude(startLongitude, endLongitude)
  const crossesAntimeridian = Math.abs(adjustedEndLongitude - endLongitude) > 0

  if (!crossesAntimeridian) {
    return [[start, end]]
  }

  const boundaryLongitude = adjustedEndLongitude > startLongitude ? 180 : -180
  const wrappedBoundaryLongitude = boundaryLongitude === 180 ? -180 : 180
  const progress =
    (boundaryLongitude - startLongitude) / (adjustedEndLongitude - startLongitude)
  const boundaryLatitude = roundCoordinate(
    startLatitude + (endLatitude - startLatitude) * progress,
  )

  return [
    [start, [boundaryLongitude, boundaryLatitude]],
    [[wrappedBoundaryLongitude, boundaryLatitude], end],
  ]
}

function areCoordinatesClose(first: RouteCoordinate, second: RouteCoordinate) {
  return (
    Math.abs(first[0] - second[0]) < COORDINATE_EPSILON &&
    Math.abs(first[1] - second[1]) < COORDINATE_EPSILON
  )
}

function unwrapEndLongitude(startLongitude: number, endLongitude: number) {
  const delta = endLongitude - startLongitude

  if (delta > 180) {
    return endLongitude - 360
  }

  if (delta < -180) {
    return endLongitude + 360
  }

  return endLongitude
}

function normalizeLongitude(longitude: number) {
  if (longitude > 180) {
    return longitude - 360
  }

  if (longitude < -180) {
    return longitude + 360
  }

  return longitude
}

function roundCoordinate(coordinate: number) {
  return Number(coordinate.toFixed(6))
}
