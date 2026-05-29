import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function NotFoundPage() {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">Ruta no encontrada</CardTitle>
        <CardDescription className="text-slate-400">
          La página que buscas no existe dentro de Uni Route.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          to="/"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-emerald-400 text-slate-950 hover:bg-emerald-300",
          )}
        >
          Volver al inicio
        </Link>
      </CardContent>
    </Card>
  )
}
