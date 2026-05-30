import { lazy, Suspense, useMemo } from "react"
import { Activity, Globe2, MapPinned, Route, TimerReset } from "lucide-react"

import {
  formatGeoStatus,
  getSourceLabel,
  getTraceMetrics,
  type ParsedTrace,
} from "@/lib/traceroute"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const TraceMapCard = lazy(() =>
  import("@/components/trace-map-card").then((module) => ({
    default: module.TraceMapCard,
  })),
)
const TraceLatencyCard = lazy(() =>
  import("@/components/trace-latency-card").then((module) => ({
    default: module.TraceLatencyCard,
  })),
)

function statusVariant(status: string) {
  if (status === "Resuelta") {
    return "default"
  }

  if (status === "Privada") {
    return "secondary"
  }

  return "outline"
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Route
  label: string
  value: string
  description: string
}) {
  return (
    <Card className="border-white/10 bg-white/5 shadow-2xl shadow-slate-950/20">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-300">
            {label}
          </Badge>
          <Icon className="size-4 text-emerald-300" />
        </div>
        <CardTitle className="text-3xl text-white">{value}</CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card className="border-dashed border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function VisualizationFallback() {
  return <Skeleton className="h-[520px] rounded-3xl bg-white/10" />
}

export function TraceResults({
  trace,
  resolvingGeo,
  emptyTitle,
  emptyDescription,
}: {
  trace: ParsedTrace | null
  resolvingGeo: boolean
  emptyTitle: string
  emptyDescription: string
}) {
  const metrics = useMemo(() => (trace ? getTraceMetrics(trace) : null), [trace])

  if (!trace) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Route}
          label="Saltos"
          value={`${metrics?.totalHops ?? 0}`}
          description="Número total de hops detectados en la salida pegada."
        />
        <MetricCard
          icon={TimerReset}
          label="Latencia media"
          value={
            metrics?.averageLatencyMs !== null &&
            metrics?.averageLatencyMs !== undefined
              ? `${metrics.averageLatencyMs} ms`
              : "Sin datos"
          }
          description="Promedio calculado con las muestras encontradas en cada salto."
        />
        <MetricCard
          icon={Globe2}
          label="IPs públicas"
          value={`${metrics?.publicHops ?? 0}`}
          description="Saltos con IP pública candidata para geolocalización."
        />
        <MetricCard
          icon={MapPinned}
          label="Puntos en mapa"
          value={`${metrics?.resolvedGeoHops ?? 0}`}
          description="Saltos que sí terminaron con coordenadas utilizables."
        />
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-white">Resumen del análisis</CardTitle>
            <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
              {getSourceLabel(trace.source)}
            </Badge>
            {resolvingGeo && (
              <Badge variant="outline" className="border-amber-400/20 bg-amber-400/10 text-amber-200">
                Resolviendo geodatos...
              </Badge>
            )}
          </div>
          <CardDescription className="text-slate-400">
            Destino detectado:{" "}
            <span className="font-medium text-slate-200">
              {metrics?.finalDestination ?? "No identificado"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trace.warnings.length > 0 && (
            <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              <Activity className="size-4" />
              <AlertTitle>Observaciones del análisis</AlertTitle>
              <AlertDescription>
                <ul className="space-y-1 pl-4">
                  {trace.warnings.map((warning) => (
                    <li key={warning} className="list-disc">
                      {warning}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {resolvingGeo ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-28 rounded-2xl bg-white/10" />
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {(metrics?.countries ?? []).length > 0 ? (
              metrics?.countries.map((country) => (
                <Badge
                  key={country}
                  variant="outline"
                  className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                >
                  {country}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-400">
                Todavía no hay países resueltos
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Suspense fallback={<VisualizationFallback />}>
          <TraceMapCard trace={trace} />
        </Suspense>
        <Suspense fallback={<VisualizationFallback />}>
          <TraceLatencyCard trace={trace} />
        </Suspense>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Tabla de hops</CardTitle>
          <CardDescription className="text-slate-400">
            Resultado normalizado para comparar IP, host, latencia y estado geográfico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-300">Hop</TableHead>
                <TableHead className="text-slate-300">IP</TableHead>
                <TableHead className="text-slate-300">Host</TableHead>
                <TableHead className="text-slate-300">Latencia</TableHead>
                <TableHead className="text-slate-300">Estado geo</TableHead>
                <TableHead className="text-slate-300">Ubicación</TableHead>
                <TableHead className="text-slate-300">Red</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trace.hops.map((hop) => {
                const location = [hop.geo?.city, hop.geo?.country]
                  .filter(Boolean)
                  .join(", ")
                const geoStatus = formatGeoStatus(hop.geo)

                return (
                  <TableRow key={hop.id} className="border-white/10">
                    <TableCell className="font-medium text-white">{hop.hop}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-300">
                      {hop.ip ?? "***"}
                    </TableCell>
                    <TableCell className="max-w-60 truncate text-slate-300">
                      {hop.host ?? "Sin hostname"}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {hop.latencyMs !== null ? `${hop.latencyMs} ms` : "***"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant(geoStatus)}
                        className="border-white/10 bg-white/5 text-slate-200"
                      >
                        {geoStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {location || hop.geo?.message || "Sin ubicación"}
                    </TableCell>
                    <TableCell className="max-w-60 truncate text-slate-300">
                      {hop.geo?.organization || hop.geo?.isp || "Sin organización"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
