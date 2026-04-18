import { Delete } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  onKey: (key: string) => void
  onBackspace: () => void
  disabled?: boolean
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

export function PinKeypad({ onKey, onBackspace, disabled }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 px-8">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          disabled={disabled}
          onClick={() => onKey(k)}
          className={cn(
            "flex h-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-semibold text-slate-900",
            "active:scale-95 active:bg-slate-200 transition-all",
            "disabled:opacity-50"
          )}
        >
          {k}
        </button>
      ))}
      <div />
      <button
        type="button"
        disabled={disabled}
        onClick={() => onKey("0")}
        className={cn(
          "flex h-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-semibold text-slate-900",
          "active:scale-95 active:bg-slate-200 transition-all",
          "disabled:opacity-50"
        )}
      >
        0
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onBackspace}
        aria-label="Xoá"
        className={cn(
          "flex h-16 items-center justify-center rounded-2xl text-slate-600",
          "active:scale-95 active:bg-slate-100 transition-all",
          "disabled:opacity-50"
        )}
      >
        <Delete className="size-6" />
      </button>
    </div>
  )
}

export function PinDots({ length, value }: { length: number; value: string }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {Array.from({ length }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "size-3.5 rounded-full border-2 transition-all",
            i < value.length
              ? "border-blue-600 bg-blue-600"
              : "border-slate-300 bg-transparent"
          )}
        />
      ))}
    </div>
  )
}
