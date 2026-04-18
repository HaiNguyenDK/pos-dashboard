import { ChevronRight } from "lucide-react"

import { StatusChip } from "./status-chip"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import type { Order } from "@/types"

type Props = {
  order: Order
  onClick?: () => void
  className?: string
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
]

function colorFor(name: string) {
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_COLORS[idx % AVATAR_COLORS.length]
}

export function OrderRow({ order, onClick, className }: Props) {
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left transition-all",
        "hover:border-blue-300 active:scale-[0.99]",
        className
      )}
    >
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white",
          colorFor(order.customerName)
        )}
      >
        {initials(order.customerName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-slate-900">
            {order.customerName}
          </span>
          <StatusChip status={order.status} />
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-slate-500">
            #{order.code} · {order.tableName ?? "Mang đi"} · {itemCount} món
          </span>
          <span className="shrink-0 font-semibold text-slate-900 tabular-nums">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-slate-400" />
    </button>
  )
}
