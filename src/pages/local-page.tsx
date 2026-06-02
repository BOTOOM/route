import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  AlertTriangle,
  Copy,
  HardDriveUpload,
  MonitorCog,
  TerminalSquare,
} from "lucide-react"

import type { TraceSource } from "@/lib/traceroute"
import { useTraceAnalysis } from "@/hooks/use-trace-analysis"
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
import { TraceResultsFallback } from "@/components/trace-results-fallback"

type InputMode = "paste" | "file"

const TraceResults = lazy(() =>
  import("@/components/trace-results").then((module) => ({
    default: module.TraceResults,
  })),
)

const localSources: {
  value: Extract<TraceSource, "windows" | "linux">
  labelKey: string
  command: string
  hintKey: string
}[] = [
  {
    value: "windows",
    labelKey: "local.sources.windows.label",
    command: "tracert github.com",
    hintKey: "local.sources.windows.hint",
  },
  {
    value: "linux",
    labelKey: "local.sources.linux.label",
    command: "traceroute github.com",
    hintKey: "local.sources.linux.hint",
  },
]

export function LocalPage() {
  const { t } = useTranslation()
  const [source, setSource] = useState<Extract<TraceSource, "windows" | "linux">>("windows")
  const [inputMode, setInputMode] = useState<InputMode>("paste")
  const [rawTrace, setRawTrace] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const { analyzeTrace, error, resolvingGeo, setError, trace } = useTraceAnalysis()
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
    await analyzeTrace({
      rawTrace,
      source,
      emptyMessage: t("local.errors.empty"),
    })
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
          : t("local.errors.fileRead"),
      )
    }
  }

  const activeSource = localSources.find((item) => item.value === source) ?? localSources[0]

  const handleCopyCommand = useCallback(() => {
    setError(null)
    if (copyLabelRef.current) {
      copyLabelRef.current.textContent = t("local.form.copied")
    }

    if (copyFeedbackTimeoutRef.current !== null) {
      window.clearTimeout(copyFeedbackTimeoutRef.current)
    }

    copyFeedbackTimeoutRef.current = window.setTimeout(() => {
      if (copyLabelRef.current) {
        copyLabelRef.current.textContent = t("local.form.copy")
      }
      copyFeedbackTimeoutRef.current = null
    }, 1800)

    void copyTextToClipboard(activeSource.command).catch(() => {
      setError(t("local.errors.copyFallback"))
    })
  }, [activeSource.command, setError, t])

  useEffect(() => {
    if (copyLabelRef.current) {
      copyLabelRef.current.textContent = t("local.form.copy")
    }
  }, [source, t])

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
                {t("local.badge")}
              </Badge>
            </div>
            <div>
              <CardTitle className="text-3xl text-white">
                {t("local.title")}
              </CardTitle>
              <CardDescription className="mt-3 max-w-2xl text-base text-slate-300">
                {t("local.description")}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-amber-400/15 bg-amber-400/10">
          <CardHeader>
            <CardTitle className="text-white">{t("local.howTo.title")}</CardTitle>
            <CardDescription className="text-slate-200">
              {t("local.howTo.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-200">
            {t("local.howTo.body")}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">{t("local.form.title")}</CardTitle>
            <CardDescription className="text-slate-400">
              {t("local.form.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">{t("local.form.osLabel")}</p>
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
                    {t(item.labelKey)}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-slate-400">{t(activeSource.hintKey)}</p>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 shadow-2xl shadow-slate-950/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      {t("local.form.suggestedCommand")}
                    </p>
                    <code className="mt-1 block break-all font-mono text-sm text-cyan-200">
                      {activeSource.command}
                    </code>
                  </div>
                  <button
                    type="button"
                    data-copy-command-button="true"
                    className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 text-sm font-medium text-cyan-100 outline-none transition-transform duration-200 ease-out hover:bg-cyan-300/20 focus-visible:ring-3 focus-visible:ring-cyan-300/40 active:scale-[0.96]"
                    aria-label={t("local.form.copyAria", { label: t(activeSource.labelKey) })}
                  >
                    <Copy className="size-4" />
                    <span ref={copyLabelRef}>{t("local.form.copy")}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">{t("local.form.inputMode")}</p>
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
                  {t("local.form.paste")}
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
                  {t("local.form.file")}
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
                  {fileName
                    ? t("local.form.loadedFile", { fileName })
                    : t("local.form.uploadHint")}
                </p>
              </div>
            ) : null}

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">{t("local.form.outputLabel")}</p>
              <Textarea
                value={rawTrace}
                onChange={(event) => setRawTrace(event.target.value)}
                className="min-h-[240px] border-white/10 bg-slate-950/45 text-slate-100 placeholder:text-slate-500"
                placeholder={t("local.form.outputPlaceholder")}
              />
            </div>

            {error ? (
              <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
                <AlertTriangle className="size-4" />
                <AlertTitle>{t("local.form.errorTitle")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <Button
              className="min-h-11 bg-emerald-400 text-slate-950 transition-transform duration-200 ease-out hover:bg-emerald-300 active:scale-[0.96]"
              size="lg"
              onClick={handleAnalyze}
            >
              {t("local.form.analyze")}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">{t("local.tips.title")}</CardTitle>
            <CardDescription className="text-slate-400">
              {t("local.tips.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion className="space-y-3">
              <AccordionItem
                value="capture"
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4"
              >
                <AccordionTrigger className="text-white">
                  {t("local.tips.capture.title")}
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <p>{t("local.tips.capture.body")}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="geo"
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4"
              >
                <AccordionTrigger className="text-white">
                  {t("local.tips.private.title")}
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <p>{t("local.tips.private.body")}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="quality"
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4"
              >
                <AccordionTrigger className="text-white">
                  {t("local.tips.sharing.title")}
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <p>{t("local.tips.sharing.body")}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <Suspense fallback={<TraceResultsFallback titleWidth="w-52" />}>
        <TraceResults
          trace={trace}
          resolvingGeo={resolvingGeo}
          emptyTitle={t("local.form.emptyTitle")}
          emptyDescription={t("local.form.emptyDescription")}
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
    throw new Error("Clipboard access is not available.")
  }

  try {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => {
        window.setTimeout(
          () => reject(new Error("Clipboard response timed out.")),
          800,
        )
      }),
    ])
  } catch (clipboardError) {
    throw clipboardError instanceof Error
      ? clipboardError
      : new Error("Clipboard access is not available.")
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
