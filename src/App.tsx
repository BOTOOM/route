import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const HomePage = lazy(() =>
  import("@/pages/home-page").then((module) => ({ default: module.HomePage })),
)
const LocalPage = lazy(() =>
  import("@/pages/local-page").then((module) => ({ default: module.LocalPage })),
)
const GlobalPage = lazy(() =>
  import("@/pages/global-page").then((module) => ({ default: module.GlobalPage })),
)
const NotFoundPage = lazy(() =>
  import("@/pages/not-found-page").then((module) => ({
    default: module.NotFoundPage,
  })),
)

function RouteFallback() {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded-full bg-white/10" />
        <div className="h-8 w-72 animate-pulse rounded-full bg-white/10" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-20 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-20 animate-pulse rounded-2xl bg-white/10" />
      </CardContent>
    </Card>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/local" element={<LocalPage />} />
            <Route path="/global" element={<GlobalPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
