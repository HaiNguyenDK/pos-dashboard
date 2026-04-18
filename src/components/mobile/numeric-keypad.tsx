import { Delete } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  onKey: (key: string) => void
  onBackspace: () => void
  className?: string
}

const ROW1 = ["1", "2", "3"]
const ROW2 = ["4", "5", "6"]
const ROW3 = ["7", "8", "9"]

export function NumericKeypad({ onKey, onBackspace, className }: Props) {
  return (
    <div className={cn("grid grid-cols-3 gap-2.5", className)}>
      {[...ROW1, ...ROW2, ...ROW3].map((k) => (
        <Key key={k} onClick={() => onKey(k)}>
          {k}
        </Key>
      ))}
      <Key onClick={() => onKey("00")}>00</Key>
      <Key onClick={() => onKey("0")}>0</Key>
      <Key onClick={onBackspace} variant="muted" ariaLabel="Xoá">
        <Delete className="size-5" />
      </Key>
    </div>
  )
}

function Key({
  children,
  onClick,
  variant = "default",
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: "default" | "muted"
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "flex h-12 items-center justify-center rounded-xl text-lg font-semibold transition-all active:scale-95",
        variant === "default"
          ? "bg-slate-100 text-slate-900 active:bg-slate-200"
          : "bg-rose-50 text-rose-500 active:bg-rose-100"
      )}
    >
      {children}
    </button>
  )
}
