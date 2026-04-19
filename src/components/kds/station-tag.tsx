import { cn } from "@/lib/utils"
import { STATIONS, type KdsStation } from "@/mocks/kds-tickets"

type Props = {
  station: KdsStation
  size?: "sm" | "md"
  className?: string
}

export function StationTag({ station, size = "sm", className }: Props) {
  const s = STATIONS.find((x) => x.id === station)
  if (!s) return null
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-bold uppercase tracking-wider",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        s.accent,
        className
      )}
    >
      <span aria-hidden="true">{s.icon}</span>
      {s.label}
    </span>
  )
}
