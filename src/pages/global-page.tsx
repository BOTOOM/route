import { lazy, Suspense, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ExternalLink, FileText, Link2, Orbit, Radar } from "lucide-react"

import {
  CONTINENTS,
  getToolsByContinent,
  type ContinentKey,
  type LookingGlassTool,
} from "@/lib/global-tools"
import {
  getSourceLabelKey,
  type TraceSource,
} from "@/lib/traceroute"
import { useTraceAnalysis } from "@/hooks/use-trace-analysis"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { TraceResultsFallback } from "@/components/trace-results-fallback"

const parserProfiles: TraceSource[] = ["america", "europa", "asia", "oceania", "linux", "windows"]

const TraceResults = lazy(() =>
  import("@/components/trace-results").then((module) => ({
    default: module.TraceResults,
  })),
)

export function GlobalPage() {
  const { t } = useTranslation()
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
  const { analyzeTrace, error, resolvingGeo, trace } = useTraceAnalysis()

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
    await analyzeTrace({
      rawTrace,
      source: parserSource,
      emptyMessage: t("global.errors.empty"),
    })
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/20">
                {t("global.badge")}
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-300">
                {t("global.publicTools")}
              </Badge>
            </div>
            <div>
              <CardTitle className="text-3xl text-white">
                {t("global.title")}
              </CardTitle>
              <CardDescription className="mt-3 max-w-3xl text-base text-slate-300">
                {t("global.description")}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Alert className="border-white/10 bg-slate-950/45">
          <Orbit className="size-4 text-cyan-300" />
          <AlertTitle className="text-white">{t("global.externalAlert.title")}</AlertTitle>
          <AlertDescription className="text-slate-300">
            {t("global.externalAlert.description")}
          </AlertDescription>
        </Alert>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">{t("global.toolsTitle")}</CardTitle>
            <CardDescription className="text-slate-400">
              {t("global.toolsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">{t("global.destinationLabel")}</p>
              <Input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="border-white/10 bg-slate-950/45 text-slate-100"
                placeholder={t("global.destinationPlaceholder")}
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
                    {t(`tools.continents.${item.key}.label`)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {CONTINENTS.map((item) => (
                <TabsContent key={item.key} value={item.key} className="space-y-4">
                  <p className="text-sm text-slate-400">
                    {t(`tools.continents.${item.key}.summary`)}
                  </p>
                  <div className="grid gap-4">
                    {getToolsByContinent(item.key).map((tool) => {
                      const selected = tool.id === activeTool?.id
                      const instructions = t(`tools.items.${tool.id}.instructions`, {
                        returnObjects: true,
                      }) as string[]

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
                                  {t(`global.status.${tool.status}`)}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                                >
                                  {t(getSourceLabelKey(tool.sourceProfile))}
                                </Badge>
                              </div>
                            </div>
                            <CardDescription className="text-slate-300">
                              {t(`tools.items.${tool.id}.notes`)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm text-slate-300">
                              {instructions.map((step) => (
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
                                {t("global.openTool")}
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
                                {t("global.useProfile")}
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
            <CardTitle className="text-white">{t("global.pasteTitle")}</CardTitle>
            <CardDescription className="text-slate-400">
              {t("global.pasteDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {activeTool ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 font-medium text-white">
                  <Radar className="size-4 text-cyan-300" />
                  {t("global.activeTool", { name: activeTool.name })}
                </div>
                <p className="mt-2">
                  {t("global.suggestedDestination")}{" "}
                  <span className="font-mono text-cyan-200">{destination || "github.com"}</span>
                </p>
              </div>
            ) : null}

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">{t("global.resultFormat")}</p>
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
                    {t(getSourceLabelKey(profile))}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">{t("global.rawResult")}</p>
              <Textarea
                value={rawTrace}
                onChange={(event) => setRawTrace(event.target.value)}
                className="min-h-[260px] border-white/10 bg-slate-950/45 text-slate-100 placeholder:text-slate-500"
                placeholder={t("global.rawPlaceholder")}
              />
            </div>

            {error ? (
              <Alert className="border-destructive/40 bg-destructive/10">
                <FileText className="size-4" />
                <AlertTitle>{t("global.errorTitle")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button
                size="lg"
                className="min-h-11 bg-emerald-400 text-slate-950 transition-transform duration-200 ease-out hover:bg-emerald-300 active:scale-[0.96]"
                onClick={handleAnalyze}
              >
                {t("global.analyze")}
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
                  {t("global.reopenTool")}
                </a>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>

      <Suspense fallback={<TraceResultsFallback />}>
        <TraceResults
          trace={trace}
          resolvingGeo={resolvingGeo}
          emptyTitle={t("global.emptyTitle")}
          emptyDescription={t("global.emptyDescription")}
        />
      </Suspense>
    </div>
  )
}
