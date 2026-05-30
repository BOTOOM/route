import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function TraceResultsFallback({ titleWidth = "w-56" }: { titleWidth?: string }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <div className={`h-6 ${titleWidth} animate-pulse rounded-full bg-white/10`} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-28 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-64 animate-pulse rounded-3xl bg-white/10" />
      </CardContent>
    </Card>
  )
}
