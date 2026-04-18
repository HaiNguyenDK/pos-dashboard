import { cn } from "@/lib/utils"

export type DonutSegment = {
  name: string
  value: number
  color: string
}

type Props = {
  segments: DonutSegment[]
  className?: string
}

const SIZE = 180
const RADIUS = 70
const STROKE = 28

export function IncomeDonutChart({ segments, className }: Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const circumference = 2 * Math.PI * RADIUS

  let offset = 0
  const arcs = segments.map((s, i) => {
    const length = (s.value / total) * circumference
    const dashArray = `${length} ${circumference - length}`
    const dashOffset = -offset
    offset += length
    return (
      <circle
        key={i}
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={s.color}
        strokeWidth={STROKE}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
      />
    )
  })

  return (
    <div className={cn("relative shrink-0", className)}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="size-40"
        style={{ transform: "rotate(-90deg)" }}
      >
        {arcs}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="text-muted-foreground text-xs">Total</span>
        <span className="text-foreground text-lg font-bold tabular-nums">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
