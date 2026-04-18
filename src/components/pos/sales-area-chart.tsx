import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"

export type SalesPoint = {
  month: string
  value: number
}

type Props = {
  data: SalesPoint[]
  defaultIndex?: number
  className?: string
}

const WIDTH = 760
const HEIGHT = 320
const PAD = { top: 20, right: 20, bottom: 36, left: 56 }
const CHART_W = WIDTH - PAD.left - PAD.right
const CHART_H = HEIGHT - PAD.top - PAD.bottom
const Y_LABELS = [5000, 2000, 500, 250, 0]

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return ""
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
}

export function SalesAreaChart({ data, defaultIndex = 3, className }: Props) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  const maxY = 5000
  const points = useMemo(
    () =>
      data.map((d, i) => ({
        x: PAD.left + (i / Math.max(1, data.length - 1)) * CHART_W,
        y: PAD.top + CHART_H - (Math.min(d.value, maxY) / maxY) * CHART_H,
        month: d.month,
        value: d.value,
      })),
    [data]
  )

  const linePath = smoothPath(points)
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${PAD.top + CHART_H}` +
    ` L ${points[0].x} ${PAD.top + CHART_H} Z`

  const active = points[activeIndex]
  const prev = points[Math.max(0, activeIndex - 1)]
  const pct =
    prev && prev.value > 0
      ? ((active.value - prev.value) / prev.value) * 100
      : 0

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sales-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Y_LABELS.map((label, i) => {
          const y = PAD.top + (i / (Y_LABELS.length - 1)) * CHART_H
          return (
            <g key={label}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + CHART_W}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 12}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#9CA3AF"
              >
                {label.toLocaleString()}
              </text>
            </g>
          )
        })}

        <path d={areaPath} fill="url(#sales-fill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <line
          x1={active.x}
          y1={PAD.top}
          x2={active.x}
          y2={PAD.top + CHART_H}
          stroke="#A78BFA"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={12}
            fill="transparent"
            onMouseEnter={() => setActiveIndex(i)}
            style={{ cursor: "pointer" }}
          />
        ))}

        <circle
          cx={active.x}
          cy={active.y}
          r="6"
          fill="#2563EB"
          stroke="white"
          strokeWidth="3"
        />

        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={PAD.top + CHART_H + 22}
            textAnchor="middle"
            fontSize="12"
            fill="#9CA3AF"
          >
            {p.month}
          </text>
        ))}

        <foreignObject
          x={active.x - 70}
          y={active.y - 56}
          width="140"
          height="40"
        >
          <div
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-white shadow-lg"
            style={{ fontSize: 13 }}
          >
            <span className="font-semibold tabular-nums">
              ${active.value.toFixed(2)}
            </span>
            <span className="text-xs text-emerald-400">
              ↑ {Math.abs(pct).toFixed(1)}%
            </span>
          </div>
        </foreignObject>
      </svg>
    </div>
  )
}
