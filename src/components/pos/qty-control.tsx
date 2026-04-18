import { Minus, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

type Props = {
  value: number
  onDecrement: () => void
  onIncrement: () => void
  size?: "sm" | "md"
  className?: string
}

export function QtyControl({
  value,
  onDecrement,
  onIncrement,
  size = "md",
  className,
}: Props) {
  const { t } = useTranslation()
  const btnBase =
    size === "sm"
      ? "size-7 text-sm"
      : "size-9 text-base"
  const active = value > 0

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={onDecrement}
        disabled={value === 0}
        aria-label={t("qty.decrease_aria")}
        className={cn(
          btnBase,
          "bg-muted text-muted-foreground inline-flex items-center justify-center rounded-full transition-colors",
          "hover:bg-muted/70 disabled:opacity-60"
        )}
      >
        <Minus className={size === "sm" ? "size-3.5" : "size-4"} />
      </button>

      <span
        className={cn(
          "min-w-6 text-center font-semibold tabular-nums",
          size === "sm" ? "text-sm" : "text-base",
          !active && "text-muted-foreground"
        )}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        aria-label={t("qty.increase_aria")}
        className={cn(
          btnBase,
          "inline-flex items-center justify-center rounded-full transition-colors",
          active
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-muted text-muted-foreground hover:bg-muted/70"
        )}
      >
        <Plus className={size === "sm" ? "size-3.5" : "size-4"} />
      </button>
    </div>
  )
}
