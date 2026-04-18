import { useTranslation } from "react-i18next"

import type { Order, OrderStatus } from "@/types"
import { cn } from "@/lib/utils"

type Props = {
  order: Order
}

const STATUS_KEY: Record<OrderStatus, string> = {
  pending: "order_detail.status_waiting",
  preparing: "order_detail.status_preparing",
  ready: "order_detail.status_ready",
  served: "order_detail.status_served",
  completed: "order_detail.status_completed",
  cancelled: "order_detail.status_cancelled",
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  preparing: "bg-purple-100 text-purple-700",
  ready: "bg-emerald-100 text-emerald-700",
  served: "bg-teal-100 text-teal-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
}

export function OrderCard({ order }: Props) {
  const { t } = useTranslation()
  const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
  return (
    <div className="bg-background flex w-[260px] shrink-0 flex-col gap-2 rounded-2xl border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 truncate text-base font-semibold">
          {order.customerName}
        </div>
        <div className="text-muted-foreground shrink-0 text-sm font-medium">
          #{order.code}
        </div>
      </div>
      <div className="text-muted-foreground text-sm">
        {t("bills.bill_items", {
          count: itemsCount,
          table: order.tableName ?? "—",
        })}
      </div>
      <span
        className={cn(
          "mt-1 inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-medium",
          STATUS_CLASS[order.status]
        )}
      >
        {t(STATUS_KEY[order.status])}
      </span>
    </div>
  )
}
