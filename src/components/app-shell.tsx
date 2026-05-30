import { useState, type ReactNode } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { Globe2, Menu, Route, ScanSearch } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navigation = [
  {
    to: "/",
    label: "Inicio",
    description: "Empieza rápido y aprende mejor",
  },
  {
    to: "/local",
    label: "Route Local",
    description: "Pega o carga tu traceroute y analízalo",
  },
  {
    to: "/global",
    label: "Route Global",
    description: "Compara rutas desde otras regiones",
  },
  {
    to: "/resources",
    label: "Uso responsable",
    description: "Buenas prácticas y créditos necesarios",
  },
]

function navClassName(active: boolean) {
  return cn(
    buttonVariants({ variant: "ghost", size: "sm" }),
    "min-h-10 justify-start transition-transform duration-200 ease-out active:scale-[0.96]",
    active
      ? "bg-emerald-400 text-slate-950 shadow-[0_12px_30px_rgba(16,185,129,0.24)] hover:bg-emerald-300 hover:text-slate-950"
      : "text-slate-100 hover:bg-white/10 hover:text-white",
  )
}

function NavigationLinks({
  onNavigate,
  mobile = false,
}: {
  onNavigate?: () => void
  mobile?: boolean
}) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1",
        mobile && "flex-col items-stretch gap-2",
      )}
      aria-label="Navegación principal"
    >
      {navigation.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) => navClassName(isActive)}
          onClick={onNavigate}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === "/"

  return (
    <div className="min-h-screen text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-500/10">
              <Route className="size-5" />
            </div>
            <div className="min-w-0">
              <NavLink to="/" className="font-heading text-base font-semibold text-white">
                Uni Route
              </NavLink>
              <p className="truncate text-xs text-slate-400">
                Visualiza rutas, latencia y saltos de red
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <NavigationLinks />
            <a
              href="https://github.com/BOTOOM/route"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
              )}
            >
              Repositorio
            </a>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="border-white/10 bg-white/5 text-slate-100 md:hidden"
                  aria-label="Abrir menú"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-white/10 bg-slate-950/98 text-slate-100"
            >
              <SheetHeader className="border-b border-white/10">
                <SheetTitle>Uni Route</SheetTitle>
                <SheetDescription className="text-slate-400">
                  Analiza rutas locales y globales desde una vista clara.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 p-4">
                <NavigationLinks mobile onNavigate={() => setOpen(false)} />
                <a
                  href="https://github.com/BOTOOM/route"
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full border-white/10 bg-white/5 text-slate-100",
                  )}
                  onClick={() => setOpen(false)}
                >
                  Repositorio
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main
        className={cn(
          isLanding
            ? "flex flex-col"
            : "mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8",
        )}
      >
        {children}
      </main>

      <footer className="border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 text-sm text-slate-400 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <ScanSearch className="size-4 text-emerald-300" />
              <span>
                Aprende traceroute con una experiencia visual pensada para estudiantes y
                exploración guiada.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Globe2 className="size-4 text-cyan-300" />
              <span>
                Compara rutas locales y globales para entender cómo cambia internet según
                el origen.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ScanSearch className="size-4 text-emerald-300" />
              <span>Usa trazas y herramientas públicas con respeto.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
