import { BookOpenText, ExternalLink, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const credits = [
  {
    name: "MapLibre GL",
    descriptionKey: "resources.credits.items.maplibre",
    href: "https://maplibre.org/",
  },
  {
    name: "CARTO basemaps",
    descriptionKey: "resources.credits.items.carto",
    href: "https://carto.com/basemaps/",
  },
  {
    name: "OpenStreetMap",
    descriptionKey: "resources.credits.items.osm",
    href: "https://www.openstreetmap.org/copyright",
  },
]

export function ResourcesPage() {
  const { t } = useTranslation()
  const usageRules = t("resources.usageRules", { returnObjects: true }) as string[]

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(2,6,23,0.25)]">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/20">
                {t("resources.badge")}
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-300">
                {t("resources.guide")}
              </Badge>
            </div>
            <div>
              <CardTitle className="text-balance text-4xl text-white">
                {t("resources.title")}
              </CardTitle>
              <CardDescription className="mt-3 max-w-2xl text-pretty text-base text-slate-300">
                {t("resources.description")}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="rounded-[2rem] border-emerald-400/15 bg-emerald-400/[0.08] shadow-[0_20px_80px_rgba(16,185,129,0.12)]">
          <CardHeader>
            <div className="flex items-center gap-3 text-emerald-200">
              <HeartHandshake className="size-5" />
              <span className="text-sm font-medium uppercase tracking-[0.2em]">
                {t("resources.communityEyebrow")}
              </span>
            </div>
            <CardTitle className="text-balance text-white">
              {t("resources.communityTitle")}
            </CardTitle>
            <CardDescription className="text-pretty text-slate-200">
              {t("resources.communityDescription")}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[2rem] border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(2,6,23,0.22)]">
          <CardHeader>
            <div className="flex items-center gap-3 text-cyan-200">
              <ShieldCheck className="size-5" />
              <CardTitle className="text-white">{t("resources.beforeSharing.title")}</CardTitle>
            </div>
            <CardDescription className="text-pretty text-slate-300">
              {t("resources.beforeSharing.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {usageRules.map((rule) => (
              <div
                key={rule}
                className="rounded-[1.4rem] border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300"
              >
                {rule}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(2,6,23,0.22)]">
          <CardHeader>
            <div className="flex items-center gap-3 text-amber-200">
              <Sparkles className="size-5" />
              <CardTitle className="text-white">{t("resources.external.title")}</CardTitle>
            </div>
            <CardDescription className="text-pretty text-slate-300">
              {t("resources.external.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <p>
              {t("resources.external.bodyOne")}
            </p>
            <p>
              {t("resources.external.bodyTwo")}
            </p>
            <Link
              to="/global"
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-h-11 rounded-2xl bg-cyan-400 px-5 text-slate-950 transition-transform duration-200 ease-out hover:bg-cyan-300 active:scale-[0.96]",
              )}
            >
              {t("common.openGlobal")}
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(2,6,23,0.22)]">
          <CardHeader>
            <div className="flex items-center gap-3 text-fuchsia-200">
              <BookOpenText className="size-5" />
              <CardTitle className="text-white">{t("resources.credits.title")}</CardTitle>
            </div>
            <CardDescription className="text-pretty text-slate-300">
              {t("resources.credits.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {credits.map((credit) => (
              <a
                key={credit.name}
                href={credit.href}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-[1.4rem] border border-white/10 bg-slate-950/45 p-4 transition-colors hover:bg-slate-950/65"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{credit.name}</p>
                    <p className="mt-2 text-pretty text-sm text-slate-300">
                      {t(credit.descriptionKey)}
                    </p>
                  </div>
                  <ExternalLink className="mt-1 size-4 shrink-0 text-slate-500 transition-colors group-hover:text-cyan-200" />
                </div>
              </a>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(2,6,23,0.22)]">
          <CardHeader>
            <CardTitle className="text-white">{t("resources.practice.title")}</CardTitle>
            <CardDescription className="text-pretty text-slate-300">
              {t("resources.practice.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link
              to="/local"
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-h-11 rounded-2xl bg-emerald-400 px-5 text-slate-950 transition-transform duration-200 ease-out hover:bg-emerald-300 active:scale-[0.96]",
              )}
            >
              {t("common.openLocal")}
            </Link>
            <a
              href="https://github.com/BOTOOM/route"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 rounded-2xl border-white/12 bg-white/5 px-5 text-slate-100 transition-transform duration-200 ease-out hover:bg-white/10 active:scale-[0.96]",
              )}
            >
              {t("common.sourceCode")}
              <ExternalLink className="size-4" />
            </a>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
