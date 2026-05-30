import { useCallback, useRef, useState } from "react"

import { enrichTraceWithGeo, parseTrace, type ParsedTrace, type TraceSource } from "@/lib/traceroute"

export function useTraceAnalysis() {
  const [trace, setTrace] = useState<ParsedTrace | null>(null)
  const [resolvingGeo, setResolvingGeo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const analyzeTrace = useCallback(
    async ({
      rawTrace,
      source,
      emptyMessage,
    }: {
      rawTrace: string
      source: TraceSource
      emptyMessage: string
    }) => {
      setError(null)
      setResolvingGeo(false)

      if (!rawTrace.trim()) {
        setError(emptyMessage)
        return
      }

      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId

      const parsed = parseTrace(rawTrace, source)
      setTrace(parsed)

      if (parsed.hops.length === 0) {
        return
      }

      setResolvingGeo(true)
      const enriched = await enrichTraceWithGeo(parsed)

      if (requestIdRef.current !== requestId) {
        return
      }

      setTrace(enriched)
      setResolvingGeo(false)
    },
    [],
  )

  return {
    analyzeTrace,
    error,
    resolvingGeo,
    setError,
    trace,
  }
}
