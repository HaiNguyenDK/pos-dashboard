import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export type TimerLevel = "fresh" | "soft" | "warn" | "danger" | "critical"

export function getTimerLevel(minutesElapsed: number): TimerLevel {
  if (minutesElapsed < 5) return "fresh"
  if (minutesElapsed < 8) return "soft"
  if (minutesElapsed < 12) return "warn"
  if (minutesElapsed < 15) return "danger"
  return "critical"
}

type Props = {
  startedAt: string
  size?: "md" | "lg" | "xl"
  className?: string
}

export function TimerBadge({ startedAt, size = "md", className }: Props) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const elapsed = Math.max(0, now - new Date(startedAt).getTime())
  const totalSeconds = Math.floor(elapsed / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const level = getTimerLevel(minutes)

  const color =
    level === "fresh"
      ? "text-slate-300"
      : level === "soft"
        ? "text-amber-300"
        : level === "warn"
          ? "text-amber-400"
          : level === "danger"
            ? "text-rose-400"
            : "text-rose-300"

  const sizeClass =
    size === "xl"
      ? "text-3xl"
      : size === "lg"
        ? "text-xl"
        : "text-base"

  return (
    <span
      className={cn(
        "font-bold tabular-nums",
        sizeClass,
        color,
        (level === "danger" || level === "critical") && "animate-pulse",
        className
      )}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  )
}

export function getCardStyleByLevel(level: TimerLevel) {
  switch (level) {
    case "fresh":
      return "bg-slate-800 border-slate-700"
    case "soft":
      return "bg-slate-800 border-amber-500/40"
    case "warn":
      return "bg-amber-950/60 border-amber-500/70"
    case "danger":
      return "bg-amber-950/80 border-amber-400 shadow-[0_0_0_1px_rgba(251,191,36,0.3)] animate-pulse"
    case "critical":
      return "bg-rose-950/70 border-rose-500 shadow-[0_0_0_2px_rgba(244,63,94,0.4)] animate-pulse"
  }
}
