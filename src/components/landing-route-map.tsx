import { useEffect, useMemo, useState } from "react"

import { Map, MapArc, MapMarker, MarkerContent, MarkerLabel } from "@/components/ui/map"

type LandingRouteMapProps = {
  reduceMotion: boolean
}

const routePoints: {
  label: string
  location: string
  ip: string
  coordinates: [number, number]
  latency: string
}[] = [
  {
    label: "Origen",
    location: "Caribe",
    ip: "203.0.113.10",
    coordinates: [-69.93, 18.49],
    latency: "4 ms",
  },
  {
    label: "Salto 2",
    location: "Miami",
    ip: "198.51.100.24",
    coordinates: [-80.19, 25.76],
    latency: "31 ms",
  },
  {
    label: "Salto 3",
    location: "Nueva York",
    ip: "198.51.100.88",
    coordinates: [-74.01, 40.71],
    latency: "48 ms",
  },
  {
    label: "Salto 4",
    location: "Londres",
    ip: "192.0.2.34",
    coordinates: [-0.13, 51.51],
    latency: "92 ms",
  },
  {
    label: "Destino",
    location: "Frankfurt",
    ip: "192.0.2.80",
    coordinates: [8.68, 50.11],
    latency: "108 ms",
  },
]

export function LandingRouteMap({ reduceMotion }: LandingRouteMapProps) {
  const [activeHop, setActiveHop] = useState(1)
  const displayedHop = reduceMotion ? routePoints.length - 1 : activeHop
  const routeArcs = useMemo(
    () =>
      routePoints.slice(1).map((point, index) => ({
        id: `${routePoints[index].location}-${point.location}`,
        from: routePoints[index].coordinates,
        to: point.coordinates,
      })),
    [],
  )
  const visibleArcs = reduceMotion ? routeArcs : routeArcs.slice(0, displayedHop)
  const currentPoint = routePoints[displayedHop]

  useEffect(() => {
    if (reduceMotion) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveHop((current) => (current >= routePoints.length - 1 ? 1 : current + 1))
    }, 950)

    return () => window.clearInterval(intervalId)
  }, [reduceMotion])

  return (
    <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950 shadow-[0_24px_90px_rgba(2,6,23,0.38)]">
      <div className="border-b border-white/10 bg-slate-950/80 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-200/80">
              Saltos IP geolocalizados
            </p>
            <p className="mt-1 text-balance text-base font-semibold text-white sm:text-lg">
              Puntos aproximados entre redes, no calles.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-[1rem] border border-cyan-300/15 bg-cyan-400/10 px-3 py-2 text-sm">
            <span className="text-slate-300">{currentPoint.label} activo</span>
            <span className="font-semibold text-white">{currentPoint.location}</span>
            <span className="tabular-nums text-emerald-200">{currentPoint.latency}</span>
          </div>
        </div>
      </div>

      <div className="relative min-h-[310px] overflow-hidden">
        <Map
          center={[-33, 38]}
          zoom={1.35}
          className="h-full min-h-[310px] w-full"
          dragPan={false}
          scrollZoom={false}
          boxZoom={false}
          doubleClickZoom={false}
          keyboard={false}
        >
          <MapArc
            data={routeArcs}
            curvature={0.16}
            interactive={false}
            paint={{
              "line-color": "#155e75",
              "line-width": 2,
              "line-opacity": 0.36,
              "line-dasharray": [1.2, 1.4],
            }}
          />
          <MapArc
            data={visibleArcs}
            curvature={0.16}
            interactive={false}
            paint={{
              "line-color": "#22d3ee",
              "line-width": 4,
              "line-opacity": 0.88,
            }}
          />

          {routePoints.map((point, index) => {
            const isActive = index === displayedHop
            const isVisited = reduceMotion || index <= displayedHop

            return (
              <MapMarker
                key={point.label}
                longitude={point.coordinates[0]}
                latitude={point.coordinates[1]}
              >
                <MarkerContent>
                  <div
                    className={
                      isActive
                        ? "landing-map-marker landing-map-marker-active"
                        : "landing-map-marker"
                    }
                    data-visited={isVisited}
                  >
                    <span />
                  </div>
                  <MarkerLabel className="rounded-full bg-slate-950/80 px-2 py-1 text-[10px] font-medium text-cyan-100 shadow-lg shadow-slate-950/40">
                    {point.location}
                  </MarkerLabel>
                </MarkerContent>
              </MapMarker>
            )
          })}
        </Map>
      </div>

      <div className="border-t border-white/10 bg-slate-950/80 px-3 py-2 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400">IP de ejemplo</span>
          <span className="font-mono text-cyan-100">{currentPoint.ip}</span>
        </div>
      </div>
    </div>
  )
}
