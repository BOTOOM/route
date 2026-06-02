import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { MapPinned, Pause, Play, RotateCcw } from "lucide-react"

import { getMapCenter, getMapHops, getRouteCoordinates, type ParsedTrace } from "@/lib/traceroute"
import {
  buildAnimatedCoordinates,
  createRouteSegments,
  getPlaybackCoordinate,
  getPlaybackHops,
  playbackSegmentDurationMs,
  type RouteCoordinate,
} from "@/lib/route-playback"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Map,
  MapControls,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/components/ui/map"

type PlaybackState = "idle" | "playing" | "paused" | "complete"

export function TraceMapCard({ trace }: { trace: ParsedTrace }) {
  const traceKey = useMemo(() => getTracePlaybackKey(trace), [trace])

  return <TraceMapCardContent key={traceKey} trace={trace} />
}

function TraceMapCardContent({ trace }: { trace: ParsedTrace }) {
  const { t } = useTranslation()
  const mapHops = useMemo(() => getMapHops(trace), [trace])
  const routeCoordinates = useMemo(() => getRouteCoordinates(trace), [trace])
  const routeSegments = useMemo(() => createRouteSegments(routeCoordinates), [routeCoordinates])
  const mapCenter = useMemo<[number, number]>(() => getMapCenter(trace), [trace])
  const playbackHops = useMemo(() => getPlaybackHops(mapHops), [mapHops])
  const playbackCoordinates = useMemo(
    () => playbackHops.map(getPlaybackCoordinate),
    [playbackHops],
  )
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle")
  const [activePointIndex, setActivePointIndex] = useState(0)
  const [animatedCoordinates, setAnimatedCoordinates] = useState<RouteCoordinate[]>([])
  const animatedRouteSegments = useMemo(
    () => createRouteSegments(animatedCoordinates),
    [animatedCoordinates],
  )
  const prefersReducedMotion = usePrefersReducedMotion()
  const animationFrameRef = useRef<number | null>(null)
  const segmentIndexRef = useRef(0)
  const segmentStartedAtRef = useRef(0)
  const pausedElapsedRef = useRef(0)
  const canPlay = playbackHops.length > 1
  const activePlaybackHop = playbackHops[activePointIndex] ?? playbackHops[0]

  const stopAnimationFrame = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const resetPlayback = useCallback(() => {
    stopAnimationFrame()
    segmentIndexRef.current = 0
    segmentStartedAtRef.current = 0
    pausedElapsedRef.current = 0
    setPlaybackState("idle")
    setActivePointIndex(0)
    setAnimatedCoordinates([])
  }, [setActivePointIndex, setAnimatedCoordinates, setPlaybackState, stopAnimationFrame])

  const completePlayback = useCallback(() => {
    stopAnimationFrame()
    segmentIndexRef.current = Math.max(playbackHops.length - 1, 0)
    segmentStartedAtRef.current = 0
    pausedElapsedRef.current = 0
    setPlaybackState("complete")
    setActivePointIndex(Math.max(playbackHops.length - 1, 0))
    setAnimatedCoordinates(playbackCoordinates)
  }, [
    playbackCoordinates,
    playbackHops.length,
    setActivePointIndex,
    setAnimatedCoordinates,
    setPlaybackState,
    stopAnimationFrame,
  ])

  const startPlayback = useCallback(() => {
    if (!canPlay) {
      return
    }

    stopAnimationFrame()
    segmentIndexRef.current = 0
    segmentStartedAtRef.current = 0
    pausedElapsedRef.current = 0
    setActivePointIndex(0)
    setAnimatedCoordinates(playbackCoordinates.slice(0, 1))
    setPlaybackState("playing")
  }, [
    canPlay,
    playbackCoordinates,
    setActivePointIndex,
    setAnimatedCoordinates,
    setPlaybackState,
    stopAnimationFrame,
  ])

  useEffect(() => {
    return () => stopAnimationFrame()
  }, [stopAnimationFrame])

  useEffect(() => {
    if (!canPlay || playbackState !== "playing") {
      return
    }

    if (prefersReducedMotion) {
      const frame = requestAnimationFrame(completePlayback)

      return () => cancelAnimationFrame(frame)
    }

    let lastPaintedAt = 0

    const tick = (now: number) => {
      const segmentIndex = segmentIndexRef.current

      if (segmentIndex >= playbackHops.length - 1) {
        completePlayback()
        return
      }

      if (segmentStartedAtRef.current === 0) {
        segmentStartedAtRef.current = now - pausedElapsedRef.current
      }

      const destinationHop = playbackHops[segmentIndex + 1]
      const duration = playbackSegmentDurationMs(destinationHop?.latencyMs)
      const elapsed = Math.min(now - segmentStartedAtRef.current, duration)
      const progress = elapsed / duration

      if (now - lastPaintedAt >= 33 || progress >= 1) {
        setAnimatedCoordinates(
          buildAnimatedCoordinates(playbackHops, segmentIndex, progress),
        )
        setActivePointIndex(progress >= 1 ? segmentIndex + 1 : segmentIndex)
        lastPaintedAt = now
      }

      if (progress >= 1) {
        segmentIndexRef.current = segmentIndex + 1
        segmentStartedAtRef.current = now
        pausedElapsedRef.current = 0
        setActivePointIndex(segmentIndex + 1)

        if (segmentIndexRef.current >= playbackHops.length - 1) {
          completePlayback()
          return
        }
      }

      animationFrameRef.current = requestAnimationFrame(tick)
    }

    animationFrameRef.current = requestAnimationFrame(tick)

    return () => stopAnimationFrame()
  }, [
    canPlay,
    completePlayback,
    playbackHops,
    playbackState,
    prefersReducedMotion,
    stopAnimationFrame,
  ])

  const handlePlaybackAction = () => {
    if (!canPlay) {
      return
    }

    if (prefersReducedMotion) {
      if (playbackState === "complete") {
        resetPlayback()
      } else {
        completePlayback()
      }
      return
    }

    if (playbackState === "playing") {
      stopAnimationFrame()
      pausedElapsedRef.current =
        segmentStartedAtRef.current > 0
          ? Math.max(0, performance.now() - segmentStartedAtRef.current)
          : pausedElapsedRef.current
      setPlaybackState("paused")
      return
    }

    if (playbackState === "paused") {
      setPlaybackState("playing")
      return
    }

    startPlayback()
  }

  const playbackAction = getPlaybackAction(playbackState, prefersReducedMotion)

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-balance text-white">{t("map.title")}</CardTitle>
          <CardDescription className="text-pretty text-slate-400">
            {t("map.description")}
          </CardDescription>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <Button
            type="button"
            onClick={handlePlaybackAction}
            disabled={!canPlay}
            className="min-h-10 rounded-xl bg-emerald-300 px-4 text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform hover:bg-emerald-200 active:scale-[0.96] disabled:bg-white/10 disabled:text-slate-500"
            aria-label={t(playbackAction.ariaLabelKey)}
          >
            <playbackAction.Icon className="size-4" />
            {t(playbackAction.labelKey)}
          </Button>
          <span className="max-w-60 text-xs text-pretty text-slate-500 sm:text-right">
            {canPlay
              ? t("map.scaleNote")
              : t("map.needPoints")}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {mapHops.length > 0 ? (
          <div className="relative h-[420px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-slate-950/25">
            {canPlay ? (
              <div className="pointer-events-none absolute left-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-2xl bg-slate-950/80 p-3 text-white shadow-2xl shadow-slate-950/30 ring-1 ring-white/10 backdrop-blur-md sm:max-w-xs">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
                  {t(getPlaybackStatusKey(playbackState))}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {activePlaybackHop
                    ? t("map.hop", { hop: activePlaybackHop.hop })
                    : t("map.ready")}
                </p>
                <p className="mt-0.5 text-xs text-pretty text-slate-300">
                  {activePlaybackHop?.location || activePlaybackHop?.ip || t("map.resolvedPoint")}
                </p>
                <p className="mt-2 text-xs tabular-nums text-emerald-200">
                  {activePlaybackHop?.latencyMs !== null && activePlaybackHop?.latencyMs !== undefined
                    ? `${activePlaybackHop.latencyMs} ms`
                    : t("map.noLatency")}
                </p>
              </div>
            ) : null}
            <Map center={mapCenter} zoom={1.65} className="h-full w-full">
              <MapControls showZoom showFullscreen position="bottom-right" />
              {routeSegments.map((segment, index) => (
                <MapRoute
                  key={`base-${index}`}
                  id={`trace-route-base-${index}`}
                  coordinates={segment}
                  color="#34d399"
                  opacity={0.28}
                  width={3}
                  interactive={false}
                />
              ))}
              {animatedRouteSegments.map((segment, index) => (
                <MapRoute
                  key={`playback-${index}`}
                  id={`trace-route-playback-${index}`}
                  coordinates={segment}
                  color="#22d3ee"
                  opacity={0.95}
                  width={5}
                  interactive={false}
                />
              ))}

              {mapHops.map((hop) => (
                <MapMarker key={`${hop.hop}-${hop.ip}`} longitude={hop.longitude} latitude={hop.latitude}>
                  <MarkerContent>
                    <div
                      className={cn(
                        "relative flex size-5 items-center justify-center rounded-full border border-white/70 bg-emerald-400 shadow-lg shadow-emerald-500/25 transition-[height,width,background-color,box-shadow] duration-300",
                        activePlaybackHop?.hop === hop.hop &&
                          playbackState !== "idle" &&
                          "size-7 bg-cyan-300 shadow-cyan-400/40",
                      )}
                    >
                      {activePlaybackHop?.hop === hop.hop && playbackState === "playing" ? (
                        <span className="absolute inset-0 animate-ping rounded-full bg-cyan-300/35" />
                      ) : null}
                      <div className="size-2 rounded-full bg-slate-950" />
                    </div>
                    <MarkerLabel className="text-[11px] text-white">#{hop.hop}</MarkerLabel>
                  </MarkerContent>
                  <MarkerPopup closeButton>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {t("map.hop", { hop: hop.hop })}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {hop.location || t("common.unavailableLocation")}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {hop.ip ?? t("common.missingIp")}
                      </p>
                      {hop.organization ? (
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {hop.organization}
                        </p>
                      ) : null}
                    </div>
                  </MarkerPopup>
                </MapMarker>
              ))}
            </Map>
          </div>
        ) : (
          <Alert className="border-white/10 bg-slate-950/50">
            <MapPinned className="size-4" />
            <AlertTitle>{t("map.pendingTitle")}</AlertTitle>
            <AlertDescription>{t("map.pendingDescription")}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function getPlaybackAction(playbackState: PlaybackState, prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return playbackState === "complete"
      ? {
          labelKey: "map.actions.restart",
          ariaLabelKey: "map.actions.restartAria",
          Icon: RotateCcw,
        }
      : {
          labelKey: "map.actions.show",
          ariaLabelKey: "map.actions.showAria",
          Icon: Play,
        }
  }

  if (playbackState === "playing") {
    return {
      labelKey: "map.actions.pause",
      ariaLabelKey: "map.actions.pauseAria",
      Icon: Pause,
    }
  }

  if (playbackState === "paused") {
    return {
      labelKey: "map.actions.resume",
      ariaLabelKey: "map.actions.resumeAria",
      Icon: Play,
    }
  }

  if (playbackState === "complete") {
    return {
      labelKey: "map.actions.repeat",
      ariaLabelKey: "map.actions.repeatAria",
      Icon: RotateCcw,
    }
  }

  return {
    labelKey: "map.actions.play",
    ariaLabelKey: "map.actions.playAria",
    Icon: Play,
  }
}

function getPlaybackStatusKey(playbackState: PlaybackState) {
  if (playbackState === "playing") {
    return "map.status.moving"
  }

  if (playbackState === "paused") {
    return "map.status.paused"
  }

  if (playbackState === "complete") {
    return "map.status.complete"
  }

  return "map.status.ready"
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener("change", updatePreference)

    return () => mediaQuery.removeEventListener("change", updatePreference)
  }, [])

  return prefersReducedMotion
}

function getTracePlaybackKey(trace: ParsedTrace) {
  return trace.hops
    .map((hop) =>
      [
        hop.hop,
        hop.ip ?? "",
        hop.latencyMs ?? "",
        hop.geo?.status ?? "",
        hop.geo?.latitude ?? "",
        hop.geo?.longitude ?? "",
      ].join(":"),
    )
    .join("|")
}
