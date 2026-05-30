import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  Copy,
  HardDriveUpload,
  MonitorCog,
  TerminalSquare,
} from "lucide-react"

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
  hint: string
}[] = [
  {
    value: "windows",
    label: "Windows",
    command: "tracert github.com",
    hint: "Copia el resultado completo que aparece después de ejecutar `tracert`.",
  },
  {
    value: "linux",
    label: "Linux / macOS",
    command: "traceroute github.com",
    hint: "Copia todas las líneas que devuelve `traceroute`, incluso las que tengan asteriscos.",
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
  const copyFeedbackTimeoutRef = useRef<number | null>(null)
  const copyLabelRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(copyFeedbackTimeoutRef.current)
      }
    }
  }, [])

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

  const handleCopyCommand = useCallback(() => {
    setError(null)
    if (copyLabelRef.current) {
      copyLabelRef.current.textContent = "Copiado"
    }

    if (copyFeedbackTimeoutRef.current !== null) {
      window.clearTimeout(copyFeedbackTimeoutRef.current)
    }

    copyFeedbackTimeoutRef.current = window.setTimeout(() => {
      if (copyLabelRef.current) {
        copyLabelRef.current.textContent = "Copiar"
      }
      copyFeedbackTimeoutRef.current = null
    }, 1800)

    void copyTextToClipboard(activeSource.command).catch((copyError: unknown) => {
      setError(
        copyError instanceof Error
          ? `No fue posible copiar el comando: ${copyError.message}`
          : "No fue posible copiar el comando. Cópialo manualmente desde la tarjeta.",
      )
    })
  }, [activeSource.command])

  useEffect(() => {
    const copyButton = document.querySelector<HTMLButtonElement>(
      "[data-copy-command-button='true']",
    )

    if (!copyButton) {
      return
    }

    copyButton.addEventListener("click", handleCopyCommand)

    return () => copyButton.removeEventListener("click", handleCopyCommand)
  }, [handleCopyCommand])

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/20">
                Route Local
              </Badge>
            </div>
            <div>
              <CardTitle className="text-3xl text-white">
                Analiza una ruta generada en tu propio equipo
              </CardTitle>
              <CardDescription className="mt-3 max-w-2xl text-base text-slate-300">
                Ejecuta un comando, pega la salida o carga un archivo, y convierte el
                resultado en saltos, latencia y mapa.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-amber-400/15 bg-amber-400/10">
          <CardHeader>
            <CardTitle className="text-white">Cómo obtener la traza</CardTitle>
            <CardDescription className="text-slate-200">
              Por seguridad, el navegador no ejecuta comandos de tu sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-200">
            Abre una terminal, ejecuta el comando sugerido y pega aquí el resultado.
            También puedes guardar la salida en un archivo de texto y subirlo.
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Prepara tu resultado</CardTitle>
            <CardDescription className="text-slate-400">
              Elige tu sistema para que Uni Route lea mejor el texto que vas a pegar.
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
              <p className="text-sm text-slate-400">{activeSource.hint}</p>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 shadow-2xl shadow-slate-950/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Comando sugerido
                    </p>
                    <code className="mt-1 block break-all font-mono text-sm text-cyan-200">
                      {activeSource.command}
                    </code>
                  </div>
                  <button
                    type="button"
                    data-copy-command-button="true"
                    className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 text-sm font-medium text-cyan-100 outline-none transition-transform duration-200 ease-out hover:bg-cyan-300/20 focus-visible:ring-3 focus-visible:ring-cyan-300/40 active:scale-[0.96]"
                    aria-label={`Copiar comando para ${activeSource.label}`}
                  >
                    <Copy className="size-4" />
                    <span ref={copyLabelRef}>Copiar</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">Cómo vas a ingresar el resultado</p>
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
                  Pegar texto
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
              className="min-h-11 bg-emerald-400 text-slate-950 transition-transform duration-200 ease-out hover:bg-emerald-300 active:scale-[0.96]"
              size="lg"
              onClick={handleAnalyze}
            >
              Analizar traceroute
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Consejos rápidos</CardTitle>
            <CardDescription className="text-slate-400">
              Pequeñas pistas para que el resultado sea más fácil de interpretar.
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
                    análisis las conservará como saltos sin respuesta.
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
                  Qué revisar antes de compartir una traza
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <p>
                    Si vas a publicar una captura o un texto, revisa nombres internos,
                    etiquetas de red o direcciones que prefieras mantener privadas.
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

async function copyTextToClipboard(text: string) {
  if (copyTextWithSelection(text)) {
    return
  }

  if (!navigator.clipboard || !window.isSecureContext) {
    throw new Error("El navegador no permitió acceder al portapapeles.")
  }

  try {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => {
        window.setTimeout(
          () => reject(new Error("El portapapeles tardó demasiado en responder.")),
          800,
        )
      }),
    ])
  } catch (clipboardError) {
    throw clipboardError instanceof Error
      ? clipboardError
      : new Error("El navegador no permitió acceder al portapapeles.")
  }
}

function copyTextWithSelection(text: string) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.setAttribute("readonly", "")
  textArea.style.position = "fixed"
  textArea.style.left = "-9999px"
  textArea.style.top = "0"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    return document.execCommand("copy")
  } finally {
    document.body.removeChild(textArea)
  }
}
