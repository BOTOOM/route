import { useMemo } from "react"
import { MapPinned } from "lucide-react"

import { getMapCenter, getMapHops, getRouteCoordinates, type ParsedTrace } from "@/lib/traceroute"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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

export function TraceMapCard({ trace }: { trace: ParsedTrace }) {
  const mapHops = useMemo(() => getMapHops(trace), [trace])
  const routeCoordinates = useMemo(() => getRouteCoordinates(trace), [trace])
  const mapCenter = useMemo<[number, number]>(() => getMapCenter(trace), [trace])

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">Trayectoria geográfica</CardTitle>
        <CardDescription className="text-slate-400">
          Se dibuja solo con hops que lograron resolver coordenadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mapHops.length > 0 ? (
          <div className="h-[420px] overflow-hidden rounded-2xl border border-white/10">
            <Map center={mapCenter} zoom={1.65} className="h-full w-full" attributionControl={false}>
              <MapControls showZoom showFullscreen position="bottom-right" />
              {routeCoordinates.length > 1 ? (
                <MapRoute coordinates={routeCoordinates} color="#34d399" opacity={0.75} width={3} />
              ) : null}

              {mapHops.map((hop) => (
                <MapMarker key={`${hop.hop}-${hop.ip}`} longitude={hop.longitude} latitude={hop.latitude}>
                  <MarkerContent>
                    <div className="relative flex size-5 items-center justify-center rounded-full border border-white/70 bg-emerald-400 shadow-lg shadow-emerald-500/25">
                      <div className="size-2 rounded-full bg-slate-950" />
                    </div>
                    <MarkerLabel className="text-[11px] text-white">#{hop.hop}</MarkerLabel>
                  </MarkerContent>
                  <MarkerPopup closeButton>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900 dark:text-white">Salto {hop.hop}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {hop.location || "Ubicación no disponible"}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {hop.ip ?? "Sin IP"}
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
            <AlertTitle>Mapa pendiente</AlertTitle>
            <AlertDescription>
              No hubo suficientes hops con coordenadas. Si el resultado usa IPs
              privadas o la API no responde, el análisis textual sigue siendo útil.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
