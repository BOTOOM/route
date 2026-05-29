import { ArrowRight, Code2, Globe2, MapPinned, ShieldCheck, TestTube2 } from "lucide-react"
import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const pillars = [
  {
    title: "Route Local",
    description:
      "Pega un `tracert` o `traceroute`, normaliza los hops y visualiza latencias, IPs y geolocalización.",
    icon: MapPinned,
  },
  {
    title: "Route Global",
    description:
      "Abre looking glasses por continente, compara rutas desde otras regiones y pega la salida para analizarla.",
    icon: Globe2,
  },
  {
    title: "Motor de parsing",
    description:
      "El parser ahora usa regex y normalización robusta en vez de depender de `split(' ')` y posiciones frágiles.",
    icon: Code2,
  },
]

const modernizationItems = [
  "Frontend renovado con Vite + React + TypeScript + pnpm.",
  "UI moderna con shadcn/ui y diseño dark-first orientado a redes.",
  "Mapas con mapcn + MapLibre, listos para despliegue estático.",
  "Compatibilidad con GitHub Pages vía GitHub Actions y base path /route/.",
  "Pruebas unitarias enfocadas en el parser y la lógica de normalización.",
]

export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card className="border-white/10 bg-white/5 shadow-2xl shadow-slate-950/30">
          <CardHeader className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/20">
                Modernización completa
              </Badge>
              <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                React + Vite
              </Badge>
              <Badge variant="outline" className="border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100">
                shadcn/ui + mapcn
              </Badge>
            </div>
            <div className="space-y-4">
              <CardTitle className="max-w-3xl text-4xl leading-tight text-white sm:text-5xl">
                Traza rutas locales y globales con una interfaz pensada para analizar,
                aprender y comparar.
              </CardTitle>
              <CardDescription className="max-w-2xl text-base text-slate-300">
                Uni Route ahora se apoya en un dominio de parsing más robusto, mapas
                modernos y una UX responsive para estudiar traceroutes sin depender de
                un Angular legacy ni de un despliegue obsoleto.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/local" className={cn(buttonVariants({ size: "lg" }), "bg-emerald-400 text-slate-950 hover:bg-emerald-300")}>
                Analizar traceroute local
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/global"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
                )}
              >
                Explorar Route Global
              </Link>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-emerald-400/10 bg-emerald-400/8">
          <CardHeader>
            <CardTitle className="text-white">Limitación importante</CardTitle>
            <CardDescription className="text-slate-300">
              Un navegador no puede ejecutar el traceroute nativo del sistema operativo
              por sí solo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-200">
            <p>
              El MVP web usa copiar/pegar o carga de archivo. El helper local automático
              queda preparado como fase futura para no bloquear el despliegue estático en
              GitHub Pages.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="font-medium text-white">MVP actual</p>
                <p className="mt-1 text-slate-400">Pegar salida o cargar `.txt`</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="font-medium text-white">Fase futura</p>
                <p className="mt-1 text-slate-400">CLI/helper externo opcional</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="border-white/10 bg-white/5">
            <CardHeader className="space-y-4">
              <pillar.icon className="size-6 text-emerald-300" />
              <div>
                <CardTitle className="text-white">{pillar.title}</CardTitle>
                <CardDescription className="mt-2 text-slate-400">
                  {pillar.description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Qué cambió</CardTitle>
            <CardDescription className="text-slate-400">
              La modernización no fue estética solamente: también corrigió problemas
              estructurales del proyecto anterior.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            {modernizationItems.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4"
              >
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Guía rápida de uso</CardTitle>
            <CardDescription className="text-slate-400">
              El flujo cambió para ser más claro tanto para estudiantes como para
              usuarios técnicos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion className="space-y-3">
              <AccordionItem
                value="local"
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4"
              >
                <AccordionTrigger className="text-white">
                  ¿Cómo usar Route Local?
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <p>1. Ejecuta `tracert` o `traceroute` desde tu equipo.</p>
                  <p>2. Copia el resultado o sube el archivo `.txt`.</p>
                  <p>3. La app normaliza los hops, grafica latencias y dibuja el mapa.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="global"
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4"
              >
                <AccordionTrigger className="text-white">
                  ¿Cómo usar Route Global?
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <p>1. Abre una looking glass por continente.</p>
                  <p>2. Lanza traceroute desde esa región contra tu destino.</p>
                  <p>3. Pega el texto bruto en Uni Route para visualizar cambios entre regiones.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="testing"
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4"
              >
                <AccordionTrigger className="text-white">
                  ¿Qué se priorizó en la reestructuración?
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pb-4 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <TestTube2 className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                    <span>Parsers con pruebas unitarias y salidas reales de ejemplo.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <TestTube2 className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                    <span>Sincronización de geodatos con `Promise.all`, no por orden accidental de respuestas.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <TestTube2 className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                    <span>Despliegue moderno y compatible con GitHub Pages.</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
