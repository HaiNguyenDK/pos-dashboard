import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  formatCurrency,
  formatOrderDate,
  formatOrderTime,
  getAvatarColor,
  getInitials,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Order, OrderStatus } from "@/types"

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
  cancelled: "bg-red-100 text-red-600",
}

type Props = {
  order: Order
  onSeeDetail: () => void
  onPayBills: () => void
}

export function OrderListCard({ order, onSeeDetail, onPayBills }: Props) {
  const { t } = useTranslation()
  const initials = getInitials(order.customerName)
  const avatarColor = getAvatarColor(order.customerName)
  const modeLabel =
    order.mode === "dine-in"
      ? t("order_card.mode_dine_in")
      : t("order_card.mode_take_away")

  return (
    <article className="bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white",
              avatarColor
            )}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{order.customerName}</div>
            <div className="text-muted-foreground text-xs">
              {t("order_payment.order_number", { code: order.code })} / {modeLabel}
            </div>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium",
            STATUS_CLASS[order.status]
          )}
        >
          {t(STATUS_KEY[order.status])}
        </span>
      </header>

      <div className="flex items-center justify-between text-sm">
        <span>{formatOrderDate(order.createdAt)}</span>
        <span className="text-muted-foreground">
          {formatOrderTime(order.createdAt)}
        </span>
      </div>

      <div className="border-t" />

      <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-2 text-sm">
        <div className="text-muted-foreground text-xs">{t("order_card.item_count")}</div>
        <div className="text-muted-foreground text-right text-xs">
          {t("order_card.qty")}
        </div>
        <div className="text-muted-foreground text-right text-xs">
          {t("order_card.price")}
        </div>
        {order.items.map((item, i) => (
          <div key={i} className="contents">
            <div className="truncate">{item.name}</div>
            <div className="text-right tabular-nums">{item.quantity}</div>
            <div className="text-right tabular-nums">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <span className="text-sm">{t("order_card.total")}</span>
        <span className="text-base font-bold tabular-nums">
          {formatCurrency(order.total)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onSeeDetail}
          className="h-11 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          {t("order_card.see_detail")}
        </Button>
        <Button
          type="button"
          onClick={onPayBills}
          className={cn(
            "h-11 rounded-full bg-blue-600 font-semibold text-white shadow-none",
            "hover:bg-blue-700 focus-visible:ring-blue-600"
          )}
        >
          {t("order_card.pay_bills")}
        </Button>
      </div>
    </article>
  )
}
