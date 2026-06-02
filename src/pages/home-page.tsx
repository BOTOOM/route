import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, Compass, Globe2, GraduationCap, MapPinned, Radar, ShieldCheck } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { TegakiRenderer } from "tegaki/react"
import caveat from "tegaki/fonts/caveat"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

const quickActions = [
  {
    titleKey: "home.quickActions.local.title",
    descriptionKey: "home.quickActions.local.description",
    icon: MapPinned,
    href: "/local",
    ctaKey: "home.quickActions.local.cta",
  },
  {
    titleKey: "home.quickActions.global.title",
    descriptionKey: "home.quickActions.global.description",
    icon: Globe2,
    href: "/global",
    ctaKey: "home.quickActions.global.cta",
  },
]

const learnCards = [
  {
    titleKey: "home.learnCards.path.title",
    descriptionKey: "home.learnCards.path.description",
    icon: Radar,
  },
  {
    titleKey: "home.learnCards.latency.title",
    descriptionKey: "home.learnCards.latency.description",
    icon: Compass,
  },
  {
    titleKey: "home.learnCards.region.title",
    descriptionKey: "home.learnCards.region.description",
    icon: GraduationCap,
  },
]

const steps = [
  {
    labelKey: "home.steps.one.label",
    titleKey: "home.steps.one.title",
    descriptionKey: "home.steps.one.description",
  },
  {
    labelKey: "home.steps.two.label",
    titleKey: "home.steps.two.title",
    descriptionKey: "home.steps.two.description",
  },
  {
    labelKey: "home.steps.three.label",
    titleKey: "home.steps.three.title",
    descriptionKey: "home.steps.three.description",
  },
]

const statItems = [
  { value: "2", labelKey: "home.stats.modes" },
  { value: "3", labelKey: "home.stats.views" },
  { value: "24/7", labelKey: "home.stats.web" },
]

const heroHighlights = [
  {
    titleKey: "home.heroHighlights.paste.title",
    descriptionKey: "home.heroHighlights.paste.description",
  },
  {
    titleKey: "home.heroHighlights.observe.title",
    descriptionKey: "home.heroHighlights.observe.description",
  },
  {
    titleKey: "home.heroHighlights.compare.title",
    descriptionKey: "home.heroHighlights.compare.description",
  },
]

const LandingRouteMap = lazy(() =>
  import("@/components/landing-route-map").then((module) => ({
    default: module.LandingRouteMap,
  })),
)

function AnimatedTagline({ reduceMotion }: { reduceMotion: boolean }) {
  const { t } = useTranslation()
  const tagline = t("home.tagline")

  if (reduceMotion) {
    return (
      <p className="font-heading text-xl font-semibold tracking-wide text-cyan-200 sm:text-2xl">
        {tagline}
      </p>
    )
  }

  return (
    <TegakiRenderer
      as="div"
      font={caveat}
      timing={{
        glyphGap: 0.04,
        wordGap: 0.08,
        stagger: { advance: "38%", duration: 0.48 },
      }}
      className="font-heading text-[1.35rem] font-semibold tracking-wide text-cyan-200 sm:text-[1.9rem]"
      aria-label={tagline}
    >
      {tagline}
    </TegakiRenderer>
  )
}

function MapFallback() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70">
      <div className="landing-hero-grid" aria-hidden="true" />
      <div className="landing-orbit landing-orbit-lg" aria-hidden="true" />
      <div className="landing-orbit landing-orbit-sm" aria-hidden="true" />
      <div className="absolute inset-x-4 top-4 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
        <div className="h-3 w-28 animate-pulse rounded-full bg-emerald-300/25" />
        <div className="mt-4 h-5 w-64 max-w-full animate-pulse rounded-full bg-white/12" />
      </div>
      <div className="absolute inset-x-4 bottom-4 grid gap-2 sm:grid-cols-3">
        {statItems.map((item) => (
          <div key={item.labelKey} className="rounded-[1.1rem] border border-white/10 bg-slate-950/70 p-3">
            <div className="h-4 w-10 animate-pulse rounded-full bg-cyan-300/20" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const { t } = useTranslation()

  return (
    <div className="landing-hero-visual relative overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/65 p-3 shadow-[0_24px_90px_rgba(2,6,23,0.5)] sm:p-4">
      <div className="landing-side-glow landing-side-glow-cyan" aria-hidden="true" />
      <div className="landing-side-glow landing-side-glow-emerald" aria-hidden="true" />
      <Suspense fallback={<MapFallback />}>
        <LandingRouteMap reduceMotion={reduceMotion} />
      </Suspense>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {statItems.map((item) => (
          <div key={item.labelKey} className="landing-visual-card">
            <div className="tabular-nums text-2xl font-semibold text-white">{item.value}</div>
            <p className="mt-1 text-sm text-slate-300">{t(item.labelKey)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HomePage() {
  const scopeRef = useRef<HTMLDivElement>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = () => setReduceMotion(mediaQuery.matches)

    updateMotion()
    mediaQuery.addEventListener("change", updateMotion)

    return () => mediaQuery.removeEventListener("change", updateMotion)
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-hero-item]", {
          opacity: 0,
          y: 24,
          filter: "blur(10px)",
        })

        gsap.timeline({ defaults: { ease: "power3.out" } }).to("[data-hero-item]", {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.72,
          stagger: 0.1,
        })

        const packets = gsap.utils.toArray<HTMLElement>(".landing-packet")
        const beams = gsap.utils.toArray<HTMLElement>(".landing-beam")

        if (packets.length > 0) {
          gsap.to(packets, {
            x: () => gsap.utils.random(-18, 18),
            y: () => gsap.utils.random(-14, 14),
            opacity: () => gsap.utils.random(0.35, 0.85),
            duration: () => gsap.utils.random(2.2, 4.4),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.16,
          })
        }

        if (beams.length > 0) {
          gsap.to(beams, {
            scaleX: 1,
            opacity: 0.55,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            stagger: 0.22,
            transformOrigin: "0% 50%",
          })
        }
      })

      return () => mm.revert()
    },
    { scope: scopeRef },
  )

  return (
    <div ref={scopeRef} className="pb-12">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="landing-background-mesh" aria-hidden="true" />
        <div className="landing-packet left-[4%] top-[14%]" aria-hidden="true" />
        <div className="landing-packet left-[48%] top-[10%]" aria-hidden="true" />
        <div className="landing-packet left-[93%] top-[32%]" aria-hidden="true" />
        <div className="landing-packet left-[72%] top-[82%]" aria-hidden="true" />
        <div className="landing-beam left-[2%] top-[70%] w-44 rotate-[18deg]" aria-hidden="true" />
        <div className="landing-beam right-[4%] top-[18%] w-56 -rotate-[22deg]" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center space-y-7">
            <div data-hero-item className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/20">
                {t("home.badges.visual")}
              </Badge>
              <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                {t("home.badges.scope")}
              </Badge>
            </div>

            <div data-hero-item className="space-y-4">
              <AnimatedTagline reduceMotion={reduceMotion} />
              <h1 className="max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                {t("home.title")}
              </h1>
              <p className="max-w-2xl text-pretty text-lg leading-8 text-slate-300">
                {t("home.description")}
              </p>
            </div>

            <div data-hero-item className="flex flex-wrap gap-3">
              <Link
                to="/local"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "min-h-11 rounded-2xl bg-emerald-400 px-5 text-slate-950 shadow-[0_18px_50px_rgba(16,185,129,0.28)] transition-transform duration-200 ease-out hover:bg-emerald-300 active:scale-[0.96]",
                )}
              >
                {t("home.primaryCta")}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/global"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-11 rounded-2xl border-white/12 bg-white/6 px-5 text-slate-100 shadow-[0_18px_40px_rgba(2,6,23,0.25)] transition-transform duration-200 ease-out hover:bg-white/10 active:scale-[0.96]",
                )}
              >
                {t("home.secondaryCta")}
              </Link>
            </div>

            <div
              data-hero-item
              className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_70px_rgba(2,6,23,0.25)] sm:grid-cols-3"
            >
              {heroHighlights.map((item) => (
                <div key={item.titleKey} className="rounded-2xl bg-slate-950/45 p-4">
                  <div className="tabular-nums text-2xl font-semibold text-white">
                    {t(item.titleKey)}
                  </div>
                  <p className="mt-2 text-pretty text-sm text-slate-300">
                    {t(item.descriptionKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div data-hero-item className="lg:pl-4">
            <HeroVisual reduceMotion={reduceMotion} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-4 lg:grid-cols-2">
          {quickActions.map((action) => (
            <Card
              key={action.titleKey}
              className="rounded-[1.75rem] border-white/10 bg-white/5 shadow-[0_20px_70px_rgba(2,6,23,0.22)]"
            >
              <CardHeader className="space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-400/12 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.14)]">
                  <action.icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-balance text-2xl text-white">
                    {t(action.titleKey)}
                  </CardTitle>
                  <CardDescription className="mt-2 text-pretty text-base text-slate-300">
                    {t(action.descriptionKey)}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  to={action.href}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "min-h-11 rounded-2xl bg-cyan-400 px-5 text-slate-950 transition-transform duration-200 ease-out hover:bg-cyan-300 active:scale-[0.96]",
                  )}
                >
                  {t(action.ctaKey)}
                  <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <Badge className="bg-white/8 text-slate-200 hover:bg-white/10">
              {t("home.sections.read.eyebrow")}
            </Badge>
            <h2 className="max-w-xl text-balance font-heading text-3xl font-semibold text-white sm:text-4xl">
              {t("home.sections.read.title")}
            </h2>
            <p className="max-w-lg text-pretty text-slate-300">
              {t("home.sections.read.description")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {learnCards.map((card) => (
              <Card
                key={card.titleKey}
                className="rounded-[1.75rem] border-white/10 bg-slate-950/45 shadow-[0_20px_70px_rgba(2,6,23,0.2)]"
              >
                <CardHeader className="space-y-4">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.14)]">
                    <card.icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-balance text-xl text-white">
                      {t(card.titleKey)}
                    </CardTitle>
                    <CardDescription className="mt-2 text-pretty text-slate-300">
                      {t(card.descriptionKey)}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
          <div className="space-y-4">
            <Badge className="bg-cyan-400/14 text-cyan-100 hover:bg-cyan-400/18">
              {t("home.sections.steps.eyebrow")}
            </Badge>
            <h2 className="max-w-xl text-balance font-heading text-3xl font-semibold text-white sm:text-4xl">
              {t("home.sections.steps.title")}
            </h2>
            <p className="max-w-lg text-pretty text-slate-300">
              {t("home.sections.steps.description")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <Card
                key={step.labelKey}
                className="rounded-[1.75rem] border-white/10 bg-slate-950/45 shadow-[0_20px_70px_rgba(2,6,23,0.2)]"
              >
                <CardHeader className="space-y-4">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-cyan-400/12 font-semibold tabular-nums text-cyan-100">
                    {t(step.labelKey)}
                  </div>
                  <div>
                    <CardTitle className="text-balance text-xl text-white">
                      {t(step.titleKey)}
                    </CardTitle>
                    <CardDescription className="mt-2 text-pretty text-slate-300">
                      {t(step.descriptionKey)}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-emerald-400/[0.08] via-slate-900 to-cyan-400/[0.08] shadow-[0_24px_90px_rgba(2,6,23,0.34)]">
          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-emerald-200">
                <ShieldCheck className="size-5" />
                <span className="text-sm font-medium uppercase tracking-[0.2em]">
                  {t("home.responsible.eyebrow")}
                </span>
              </div>
              <h2 className="max-w-2xl text-balance font-heading text-3xl font-semibold text-white">
                {t("home.responsible.title")}
              </h2>
              <p className="max-w-2xl text-pretty text-slate-300">
                {t("home.responsible.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/local"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "min-h-11 rounded-2xl bg-emerald-400 px-5 text-slate-950 transition-transform duration-200 ease-out hover:bg-emerald-300 active:scale-[0.96]",
                )}
              >
                {t("home.responsible.localCta")}
              </Link>
              <Link
                to="/resources"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-11 rounded-2xl border-white/12 bg-white/5 px-5 text-slate-100 transition-transform duration-200 ease-out hover:bg-white/10 active:scale-[0.96]",
                )}
              >
                {t("home.responsible.resourcesCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
