import { Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import type { DiningTable } from "@/types"

type OpenOrderHint = {
  itemCount: number
  total: number
}

type Props = {
  table: DiningTable
  openOrder?: OpenOrderHint
  onClick?: () => void
}

const ACCENT: Record<DiningTable["status"], { ring: string; bg: string; dot: string; label: string; labelColor: string }> = {
  available: {
    ring: "ring-blue-100",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
    label: "Trống",
    labelColor: "text-blue-700",
  },
  occupied: {
    ring: "ring-emerald-100",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
    label: "Đang dùng",
    labelColor: "text-emerald-700",
  },
  reserved: {
    ring: "ring-rose-100",
    bg: "bg-rose-50",
    dot: "bg-rose-500",
    label: "Đã đặt",
    labelColor: "text-rose-600",
  },
}

export function TableCard({ table, openOrder, onClick }: Props) {
  const accent = ACCENT[table.status]
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex min-h-[108px] flex-col justify-between rounded-2xl border bg-white p-3 text-left transition-all",
        "hover:border-blue-300 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl ring-4",
            accent.bg,
            accent.ring
          )}
        >
          <span className="text-sm font-bold text-slate-900">{table.name}</span>
        </div>
        <span className={cn("size-2 rounded-full", accent.dot)} aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-0.5">
        <div className={cn("text-[11px] font-semibold", accent.labelColor)}>
          {accent.label}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Users className="size-3" />
          <span>{table.seats} chỗ</span>
        </div>
        {openOrder ? (
          <div className="mt-1 flex items-center justify-between rounded-md bg-slate-50 px-1.5 py-1 text-[11px]">
            <span className="text-slate-600">{openOrder.itemCount} món</span>
            <span className="font-semibold text-blue-600 tabular-nums">
              {formatCurrency(openOrder.total)}
            </span>
          </div>
        ) : null}
      </div>
    </button>
  )
}
