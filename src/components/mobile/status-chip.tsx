import { cn } from "@/lib/utils"
import type { OrderStatus, TableStatus } from "@/types"

export type ChipStatus = OrderStatus | TableStatus | "paid"

const LABELS: Record<ChipStatus, string> = {
  available: "Bàn trống",
  occupied: "Đang dùng",
  reserved: "Đã đặt",
  pending: "Chờ bếp",
  preparing: "Đang nấu",
  ready: "Sẵn sàng",
  served: "Đã phục vụ",
  completed: "Hoàn tất",
  cancelled: "Đã huỷ",
  paid: "Đã thanh toán",
}

const STYLES: Record<ChipStatus, string> = {
  available: "bg-blue-50 text-blue-700",
  occupied: "bg-emerald-50 text-emerald-700",
  reserved: "bg-rose-50 text-rose-600",
  pending: "bg-amber-50 text-amber-700",
  preparing: "bg-violet-50 text-violet-700",
  ready: "bg-emerald-50 text-emerald-700",
  served: "bg-teal-50 text-teal-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-rose-50 text-rose-600",
  paid: "bg-emerald-50 text-emerald-700",
}

const DOT_STYLES: Record<ChipStatus, string> = {
  available: "bg-blue-500",
  occupied: "bg-emerald-500",
  reserved: "bg-rose-500",
  pending: "bg-amber-500",
  preparing: "bg-violet-500",
  ready: "bg-emerald-500",
  served: "bg-teal-500",
  completed: "bg-blue-500",
  cancelled: "bg-rose-500",
  paid: "bg-emerald-500",
}

type Props = {
  status: ChipStatus
  size?: "sm" | "md"
  withDot?: boolean
  className?: string
}

export function StatusChip({ status, size = "sm", withDot, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        STYLES[status],
        className
      )}
    >
      {withDot ? <span className={cn("size-1.5 rounded-full", DOT_STYLES[status])} /> : null}
      {LABELS[status]}
    </span>
  )
}
