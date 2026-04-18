import { useTranslation } from "react-i18next"

import type { DiningTable } from "@/types"
import { cn } from "@/lib/utils"

type Props = {
  table: DiningTable
  selected: boolean
  onSelect: () => void
  disabled?: boolean
}

const STATUS_STYLE: Record<
  DiningTable["status"],
  { bg: string; text: string; ring: string }
> = {
  available: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    ring: "ring-blue-600",
  },
  reserved: {
    bg: "bg-red-50",
    text: "text-red-500",
    ring: "ring-red-500",
  },
  occupied: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    ring: "ring-emerald-500",
  },
}

function Chair({ vertical = false }: { vertical?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-accent-foreground/10 shrink-0 rounded-full",
        vertical ? "h-7 w-2.5" : "h-2.5 w-7"
      )}
    />
  )
}

export function TableVisual({ table, selected, onSelect, disabled }: Props) {
  const { t } = useTranslation()
  const isLarge = table.size === "large"
  const style = STATUS_STYLE[table.status]
  const topChairs = isLarge ? 5 : 1
  const bottomChairs = isLarge ? 5 : 1

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={cn("flex gap-2", isLarge ? "gap-3" : "")}>
        {Array.from({ length: topChairs }).map((_, i) => (
          <Chair key={i} />
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <Chair vertical />
        <button
          type="button"
          onClick={onSelect}
          disabled={disabled}
          aria-label={t("select_table.select_table_aria", { name: table.name })}
          aria-pressed={selected}
          className={cn(
            "flex items-center justify-center rounded-2xl transition-all m-1",
            style.bg,
            isLarge ? "h-24 w-48" : "h-24 w-24",
            selected && "ring-2 ring-blue-600 ring-offset-2",
            disabled
              ? "cursor-not-allowed opacity-80"
              : "cursor-pointer hover:opacity-90"
          )}
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
            <span className={cn("text-sm font-semibold", style.text)}>
              {table.name}
            </span>
          </div>
        </button>
        <Chair vertical />
      </div>

      <div className={cn("flex gap-2", isLarge ? "gap-3" : "")}>
        {Array.from({ length: bottomChairs }).map((_, i) => (
          <Chair key={i} />
        ))}
      </div>
    </div>
  )
}
