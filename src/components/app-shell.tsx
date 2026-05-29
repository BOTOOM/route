import { useState, type ReactNode } from "react"
import { NavLink } from "react-router-dom"
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
    description: "Resumen del proyecto y estrategia de uso",
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
]

function navClassName(active: boolean) {
  return cn(
    buttonVariants({ variant: active ? "default" : "ghost", size: "sm" }),
    "justify-start",
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
                Traceroute moderno para análisis local, global y educativo
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
                  Analiza rutas locales y globales desde una interfaz moderna.
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

      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <ScanSearch className="size-4 text-emerald-300" />
            <span>
              Renovación completa sobre React + Vite, con parsing robusto y mapas en
              MapLibre.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Globe2 className="size-4 text-cyan-300" />
            <span>
              GitHub Pages /route · MVP web con copy-paste o archivo · helper local en
              fase futura
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
