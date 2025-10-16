"use client"

import { useEffect, useMemo, useRef, useState } from "react"

export function Timer({
  startTimeMs,
  durationSeconds,
  onExpire,
}: {
  startTimeMs: number
  durationSeconds: number
  onExpire: () => void
}) {
  const [now, setNow] = useState<number>(() => Date.now())
  const expiredRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = useMemo(() => {
    const elapsed = Math.floor((now - startTimeMs) / 1000)
    return Math.max(durationSeconds - elapsed, 0)
  }, [now, startTimeMs, durationSeconds])

  useEffect(() => {
    if (remaining <= 0 && !expiredRef.current) {
      expiredRef.current = true
      onExpire()
    }
  }, [remaining, onExpire])

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
  const ss = String(remaining % 60).padStart(2, "0")

  return (
    <div className="px-3 py-2 rounded-md border bg-secondary inline-flex items-center gap-2">
      <span className="sr-only">Time remaining</span>
      <span aria-live="polite" aria-atomic="true" className="tabular-nums font-semibold text-lg">
        {mm}:{ss}
      </span>
    </div>
  )
}
