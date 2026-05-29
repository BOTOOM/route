import { lazy, Suspense, useMemo, useRef, useState } from "react"
import { ExternalLink, FileText, Link2, Orbit, Radar } from "lucide-react"

import {
  CONTINENTS,
  getToolsByContinent,
  type ContinentKey,
  type LookingGlassTool,
} from "@/lib/global-tools"
import {
  enrichTraceWithGeo,
  getSourceLabel,
  parseTrace,
  type ParsedTrace,
  type TraceSource,
} from "@/lib/traceroute"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const parserProfiles: TraceSource[] = ["america", "europa", "asia", "oceania", "linux", "windows"]

const TraceResults = lazy(() =>
  import("@/components/trace-results").then((module) => ({
    default: module.TraceResults,
  })),
)

function ResultsFallback() {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <div className="h-6 w-56 animate-pulse rounded-full bg-white/10" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-28 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-64 animate-pulse rounded-3xl bg-white/10" />
      </CardContent>
    </Card>
  )
}

export function GlobalPage() {
  const initialTools = getToolsByContinent("america")
  const [continent, setContinent] = useState<ContinentKey>("america")
  const [selectedToolId, setSelectedToolId] = useState<string | null>(
    initialTools[0]?.id ?? null,
  )
  const [destination, setDestination] = useState("github.com")
  const [parserSource, setParserSource] = useState<TraceSource>(
    initialTools[0]?.sourceProfile ?? "linux",
  )
  const [rawTrace, setRawTrace] = useState("")
  const [trace, setTrace] = useState<ParsedTrace | null>(null)
  const [resolvingGeo, setResolvingGeo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const tools = useMemo(() => getToolsByContinent(continent), [continent])
  const activeTool =
    tools.find((tool) => tool.id === selectedToolId) ?? tools[0] ?? null

  function handleToolSelect(tool: LookingGlassTool) {
    setSelectedToolId(tool.id)
    setParserSource(tool.sourceProfile)
  }

  function handleContinentChange(nextContinent: ContinentKey) {
    const nextTools = getToolsByContinent(nextContinent)
    const nextTool = nextTools[0] ?? null

    setContinent(nextContinent)
    setSelectedToolId(nextTool?.id ?? null)
    setParserSource(nextTool?.sourceProfile ?? "linux")
  }

  async function handleAnalyze() {
    setError(null)

    if (!rawTrace.trim()) {
      setError("Pega el resultado que te devolvió la looking glass antes de analizar.")
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    const parsed = parseTrace(rawTrace, parserSource)
    setTrace(parsed)

    if (parsed.hops.length === 0) {
      return
    }

    setResolvingGeo(true)
    const enriched = await enrichTraceWithGeo(parsed)

    if (requestIdRef.current !== requestId) {
      return
    }

    setTrace(enriched)
    setResolvingGeo(false)
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/20">
                Route Global
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-300">
                Looking glasses por continente
              </Badge>
            </div>
            <div>
              <CardTitle className="text-3xl text-white">
                Compara cómo cambia la ruta desde otras regiones del mundo
              </CardTitle>
              <CardDescription className="mt-3 max-w-3xl text-base text-slate-300">
                Mantiene el espíritu del modo global original, pero ahora con catálogo
                más curado, explicación por continente y parser configurable cuando la
                salida del tercero cambia.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Alert className="border-white/10 bg-slate-950/45">
          <Orbit className="size-4 text-cyan-300" />
          <AlertTitle className="text-white">Sobre el iframe</AlertTitle>
          <AlertDescription className="text-slate-300">
            La mayoría de looking glasses públicas bloquean iframes por CSP o
            `X-Frame-Options`. Por eso el flujo confiable sigue siendo abrir en nueva
            pestaña, correr traceroute allí y pegar el resultado acá.
          </AlertDescription>
        </Alert>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Herramientas globales</CardTitle>
            <CardDescription className="text-slate-400">
              Selecciona un continente, abre una herramienta HTTPS y luego pega su salida
              textual para normalizarla.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">Destino a estudiar</p>
              <Input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="border-white/10 bg-slate-950/45 text-slate-100"
                placeholder="IP o dominio"
              />
            </div>

            <Tabs
              value={continent}
              onValueChange={(value) => handleContinentChange(value as ContinentKey)}
            >
              <TabsList className="w-full justify-start overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40 p-1">
                {CONTINENTS.map((item) => (
                  <TabsTrigger
                    key={item.key}
                    value={item.key}
                    className="data-active:bg-white data-active:text-slate-950"
                  >
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {CONTINENTS.map((item) => (
                <TabsContent key={item.key} value={item.key} className="space-y-4">
                  <p className="text-sm text-slate-400">{item.summary}</p>
                  <div className="grid gap-4">
                    {getToolsByContinent(item.key).map((tool) => {
                      const selected = tool.id === activeTool?.id

                      return (
                        <Card
                          key={tool.id}
                          className={cn(
                            "border-white/10 bg-slate-950/35 transition-colors",
                            selected && "border-cyan-400/30 bg-cyan-400/8",
                          )}
                        >
                          <CardHeader className="space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <CardTitle className="text-lg text-white">{tool.name}</CardTitle>
                                <CardDescription className="mt-1 text-slate-400">
                                  {tool.provider}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  variant="outline"
                                  className="border-white/10 bg-white/5 text-slate-300"
                                >
                                  {tool.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                                >
                                  {getSourceLabel(tool.sourceProfile)}
                                </Badge>
                              </div>
                            </div>
                            <CardDescription className="text-slate-300">
                              {tool.notes}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm text-slate-300">
                              {tool.instructions.map((step) => (
                                <p key={step}>• {step}</p>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={tool.url}
                                target="_blank"
                                rel="noreferrer"
                                className={cn(
                                  buttonVariants({ size: "sm" }),
                                  "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
                                )}
                              >
                                <ExternalLink className="size-4" />
                                Abrir herramienta
                              </a>
                              <Button
                                variant={selected ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                  selected
                                    ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                                )}
                                onClick={() => handleToolSelect(tool)}
                              >
                                Usar este perfil
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Pegar salida y normalizar</CardTitle>
            <CardDescription className="text-slate-400">
              Usa el parser sugerido por la herramienta, o cámbialo si el formato que
              pegaste se parece más a otro perfil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {activeTool ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 font-medium text-white">
                  <Radar className="size-4 text-cyan-300" />
                  Herramienta activa: {activeTool.name}
                </div>
                <p className="mt-2">
                  Destino sugerido para copiar en la herramienta externa:{" "}
                  <span className="font-mono text-cyan-200">{destination || "github.com"}</span>
                </p>
              </div>
            ) : null}

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">Perfil de parser</p>
              <div className="flex flex-wrap gap-2">
                {parserProfiles.map((profile) => (
                  <Button
                    key={profile}
                    variant={parserSource === profile ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      parserSource === profile
                        ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                    onClick={() => setParserSource(profile)}
                  >
                    {getSourceLabel(profile)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">Resultado bruto</p>
              <Textarea
                value={rawTrace}
                onChange={(event) => setRawTrace(event.target.value)}
                className="min-h-[260px] border-white/10 bg-slate-950/45 text-slate-100 placeholder:text-slate-500"
                placeholder="Pega aquí la salida textual de la looking glass..."
              />
            </div>

            {error ? (
              <Alert className="border-destructive/40 bg-destructive/10">
                <FileText className="size-4" />
                <AlertTitle>No se pudo iniciar el análisis global</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button
                size="lg"
                className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                onClick={handleAnalyze}
              >
                Analizar salida global
              </Button>
              {activeTool ? (
                <a
                  href={activeTool.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
                  )}
                >
                  <Link2 className="size-4" />
                  Reabrir herramienta
                </a>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>

      <Suspense fallback={<ResultsFallback />}>
        <TraceResults
          trace={trace}
          resolvingGeo={resolvingGeo}
          emptyTitle="Todavía no hay resultados globales"
          emptyDescription="Abre una looking glass, ejecuta traceroute desde el continente deseado y pega aquí la salida para comparar regiones."
        />
      </Suspense>
    </div>
  )
}
