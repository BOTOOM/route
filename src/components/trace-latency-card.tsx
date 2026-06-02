import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { TimerReset } from "lucide-react"

import { getChartData, type ParsedTrace } from "@/lib/traceroute"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TraceLatencyCard({ trace }: { trace: ParsedTrace }) {
  const { t } = useTranslation()
  const chartData = useMemo(() => getChartData(trace), [trace])

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">{t("results.latency.title")}</CardTitle>
        <CardDescription className="text-slate-400">
          {t("results.latency.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hop" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#cbd5e1", fontSize: 12 }}
                  tickFormatter={(value) => `${value}ms`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "1rem",
                    color: "#e2e8f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ fill: "#22d3ee", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Alert className="border-white/10 bg-slate-950/50">
            <TimerReset className="size-4" />
            <AlertTitle>{t("results.latency.emptyTitle")}</AlertTitle>
            <AlertDescription>{t("results.latency.emptyDescription")}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
