import { useTranslation } from "react-i18next"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  formatCurrency,
  formatOrderDate,
  formatOrderTime,
  getAvatarColor,
  getInitials,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import { MENU_ITEMS } from "@/mocks/menu"
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
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export function OrderDetailDrawer({ open, onOpenChange, order }: Props) {
  const { t } = useTranslation()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        {order ? (
          <>
            <SheetHeader className="border-b p-6">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white",
                    getAvatarColor(order.customerName)
                  )}
                  aria-hidden="true"
                >
                  {getInitials(order.customerName)}
                </div>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="truncate text-lg font-bold">
                    {order.customerName}
                  </SheetTitle>
                  <p className="text-muted-foreground text-xs">
                    {t("order_payment.order_number", { code: order.code })} /{" "}
                    {order.mode === "dine-in"
                      ? t("history_detail.dine_in")
                      : t("history_detail.take_away")}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium",
                    STATUS_CLASS[order.status]
                  )}
                >
                  {t(STATUS_KEY[order.status])}
                </span>
              </div>
            </SheetHeader>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
              <div className="flex items-center justify-between text-sm">
                <span>{formatOrderDate(order.createdAt)}</span>
                <span className="text-muted-foreground">
                  {formatOrderTime(order.createdAt)}
                </span>
              </div>

              <div className="border-t" />

              <section className="flex flex-col gap-3">
                <h3 className="text-base font-semibold">
                  {t("order_detail.order_list")}
                </h3>
                <div className="flex flex-col gap-2">
                  {order.items.map((item, i) => {
                    const menuItem = MENU_ITEMS.find(
                      (m) => m.id === item.menuItemId
                    )
                    return (
                      <div
                        key={i}
                        className="bg-muted/40 flex items-center gap-3 rounded-xl p-3"
                      >
                        <div
                          className="flex size-16 shrink-0 items-center justify-center rounded-lg text-2xl"
                          style={{ backgroundImage: menuItem?.imageGradient }}
                          aria-hidden="true"
                        >
                          {menuItem?.emoji ?? "🍽️"}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <div className="truncate text-sm font-semibold">
                            {item.name}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {t("order_detail.item_count", { count: item.quantity })}
                          </div>
                          {item.note ? (
                            <div className="truncate text-xs text-blue-600">
                              {item.note}
                            </div>
                          ) : null}
                        </div>
                        <div className="shrink-0 text-sm font-bold tabular-nums">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              <div className="border-t" />

              <div className="flex flex-col gap-3">
                <Row
                  label={t("order_detail.subtotal")}
                  value={formatCurrency(order.subtotal)}
                />
                <Row
                  label={t("order_detail.tax")}
                  value={formatCurrency(order.tax)}
                />
                <Row label={t("order_detail.discount")} value="$0" />
              </div>

              <div className="border-t" />

              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">
                  {t("order_detail.total")}
                </span>
                <span className="text-2xl font-bold text-blue-600 tabular-nums">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}
