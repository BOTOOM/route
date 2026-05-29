import { lazy, Suspense, useRef, useState } from "react"
import { AlertTriangle, HardDriveUpload, MonitorCog, TerminalSquare } from "lucide-react"

import { enrichTraceWithGeo, parseTrace, type ParsedTrace, type TraceSource } from "@/lib/traceroute"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

type InputMode = "paste" | "file"

const TraceResults = lazy(() =>
  import("@/components/trace-results").then((module) => ({
    default: module.TraceResults,
  })),
)

function ResultsFallback() {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <div className="h-6 w-52 animate-pulse rounded-full bg-white/10" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-28 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-64 animate-pulse rounded-3xl bg-white/10" />
      </CardContent>
    </Card>
  )
}

const localSources: {
  value: Extract<TraceSource, "windows" | "linux">
  label: string
  command: string
  helper: string
}[] = [
  {
    value: "windows",
    label: "Windows",
    command: "tracert github.com",
    helper: "Perfil pensado para la salida clásica de `tracert`.",
  },
  {
    value: "linux",
    label: "Linux / macOS",
    command: "traceroute github.com",
    helper: "Funciona bien para salidas tipo traceroute clásico en Unix.",
  },
]

export function LocalPage() {
  const [source, setSource] = useState<Extract<TraceSource, "windows" | "linux">>("windows")
  const [inputMode, setInputMode] = useState<InputMode>("paste")
  const [rawTrace, setRawTrace] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [trace, setTrace] = useState<ParsedTrace | null>(null)
  const [resolvingGeo, setResolvingGeo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  async function handleAnalyze() {
    setError(null)

    if (!rawTrace.trim()) {
      setError("Pega una salida de traceroute o carga un archivo antes de analizar.")
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    const parsed = parseTrace(rawTrace, source)
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

  async function handleFileChange(file: File | null) {
    setError(null)

    if (!file) {
      return
    }

    try {
      const text = await file.text()
      setRawTrace(text)
      setFileName(file.name)
      setInputMode("file")
    } catch (fileError) {
      setError(
        fileError instanceof Error
          ? fileError.message
          : "No fue posible leer el archivo seleccionado.",
      )
    }
  }

  const activeSource = localSources.find((item) => item.value === source) ?? localSources[0]

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/20">
                Route Local
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-300">
                MVP web
              </Badge>
            </div>
            <div>
              <CardTitle className="text-3xl text-white">
                Analiza traceroutes generados en tu propio equipo
              </CardTitle>
              <CardDescription className="mt-3 max-w-2xl text-base text-slate-300">
                Elige el sistema operativo, pega la salida o carga un `.txt`, y obtén
                una vista moderna con hops, latencia, mapa y contexto geográfico.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-amber-400/15 bg-amber-400/10">
          <CardHeader>
            <CardTitle className="text-white">Sobre el traceroute automático</CardTitle>
            <CardDescription className="text-slate-200">
              El navegador no puede invocar `tracert` o `traceroute` nativos del OS.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-200">
            Por eso el flujo actual es seguro y compatible con GitHub Pages: pegas el
            resultado o subes el archivo. El helper/CLI que ejecutará el traceroute
            local y lo entregará a la app queda preparado como siguiente fase.
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Configurar análisis</CardTitle>
            <CardDescription className="text-slate-400">
              Cambia entre Windows y Linux/macOS para ajustar el parser a la salida que
              generaste.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">Sistema operativo</p>
              <div className="flex flex-wrap gap-2">
                {localSources.map((item) => (
                  <Button
                    key={item.value}
                    variant={source === item.value ? "default" : "outline"}
                    className={cn(
                      source === item.value
                        ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                    onClick={() => setSource(item.value)}
                  >
                    {item.value === "windows" ? (
                      <MonitorCog className="size-4" />
                    ) : (
                      <TerminalSquare className="size-4" />
                    )}
                    {item.label}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-slate-400">{activeSource.helper}</p>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 font-mono text-sm text-cyan-200">
                {activeSource.command}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">Modo de ingreso</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={inputMode === "paste" ? "default" : "outline"}
                  className={cn(
                    inputMode === "paste"
                      ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                  )}
                  onClick={() => setInputMode("paste")}
                >
                  Texto plano
                </Button>
                <Button
                  variant={inputMode === "file" ? "default" : "outline"}
                  className={cn(
                    inputMode === "file"
                      ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                  )}
                  onClick={() => setInputMode("file")}
                >
                  <HardDriveUpload className="size-4" />
                  Archivo
                </Button>
              </div>
            </div>

            {inputMode === "file" ? (
              <div className="space-y-3">
                <Input
                  type="file"
                  accept=".txt,.log,.text"
                  className="border-white/10 bg-slate-950/45 text-slate-200 file:text-slate-200"
                  onChange={(event) =>
                    handleFileChange(event.target.files?.[0] ?? null)
                  }
                />
                <p className="text-sm text-slate-400">
                  {fileName ? `Archivo cargado: ${fileName}` : "Carga un archivo con la salida textual del traceroute."}
                </p>
              </div>
            ) : null}

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">Salida del traceroute</p>
              <Textarea
                value={rawTrace}
                onChange={(event) => setRawTrace(event.target.value)}
                className="min-h-[240px] border-white/10 bg-slate-950/45 text-slate-100 placeholder:text-slate-500"
                placeholder="Pega aquí la salida completa del traceroute..."
              />
            </div>

            {error ? (
              <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
                <AlertTriangle className="size-4" />
                <AlertTitle>No se pudo iniciar el análisis</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <Button
              className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
              size="lg"
              onClick={handleAnalyze}
            >
              Analizar traceroute
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Ayuda contextual</CardTitle>
            <CardDescription className="text-slate-400">
              Conserva la lógica educativa del proyecto original, pero con una estructura
              más clara y moderna.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion className="space-y-3">
              <AccordionItem
                value="capture"
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4"
              >
                <AccordionTrigger className="text-white">
                  Cómo capturar la salida correctamente
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <p>
                    Ejecuta el comando en una terminal real y copia el bloque completo,
                    incluyendo encabezado y saltos.
                  </p>
                  <p>
                    Si tu herramienta devuelve líneas con `* * *`, pégalas también; el
                    parser las conservará como hops sin respuesta.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="geo"
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4"
              >
                <AccordionTrigger className="text-white">
                  Qué pasa con IPs privadas o internas
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <p>
                    Si un salto usa una IP privada, se conserva en tabla y latencia, pero
                    no se intenta ubicar en mapa porque no existe una geolocalización
                    pública fiable para esas direcciones.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="quality"
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4"
              >
                <AccordionTrigger className="text-white">
                  Qué mejoró frente al proyecto legacy
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <p>El parser ya no depende de partir cada línea por espacios fijos.</p>
                  <p>
                    La geolocalización se sincroniza con todas las promesas antes de
                    dibujar mapa y estadísticas.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <Suspense fallback={<ResultsFallback />}>
        <TraceResults
          trace={trace}
          resolvingGeo={resolvingGeo}
          emptyTitle="Todavía no hay resultados locales"
          emptyDescription="Pega una salida de traceroute o carga un archivo para ver hops, mapa y latencia."
        />
      </Suspense>
    </div>
  )
}
