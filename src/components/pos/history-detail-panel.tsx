import { Printer } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  formatCurrency,
  formatOrderTime,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import { MENU_ITEMS } from "@/mocks/menu"
import type { Order } from "@/types"

type Props = {
  order: Order | null
  onPrint: () => void
  className?: string
}

export function HistoryDetailPanel({ order, onPrint, className }: Props) {
  const { t } = useTranslation()
  return (
    <aside
      className={cn(
        "bg-background flex flex-col rounded-2xl border shadow-sm",
        className
      )}
    >
      {order ? (
        <>
          <header className="border-b p-6">
            <h3 className="text-lg font-bold">{t("history_detail.heading")}</h3>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("history_detail.order_number", {
                  code: order.code.padStart(5, "0"),
                })}
              </span>
              <span className="text-muted-foreground">
                {formatOrderTime(order.createdAt)}
              </span>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
            <div className="flex flex-col gap-3">
              <InfoRow value={order.customerName} />
              <InfoRow value={order.tableName ?? "—"} />
              <InfoRow
                value={
                  order.mode === "dine-in"
                    ? t("history_detail.dine_in")
                    : t("history_detail.take_away")
                }
              />
            </div>

            <div className="border-t" />

            <section className="flex flex-col gap-3">
              <h4 className="text-base font-semibold">
                {t("history_detail.order_list")}
              </h4>
              <div className="flex flex-col gap-4">
                {order.items.map((item, i) => {
                  const menuItem = MENU_ITEMS.find(
                    (m) => m.id === item.menuItemId
                  )
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="flex size-16 shrink-0 items-center justify-center rounded-xl text-2xl"
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
                          {t("history_detail.item_count", { count: item.quantity })}
                        </div>
                        {item.note ? (
                          <div className="truncate text-xs text-blue-600">
                            {item.note}
                          </div>
                        ) : null}
                        <div className="mt-1 text-sm font-bold tabular-nums">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <div className="border-t" />

            <section className="flex flex-col gap-3">
              <h4 className="text-base font-semibold">
                {t("history_detail.order_summary")}
              </h4>
              <div className="flex flex-col gap-2">
                <SummaryRow
                  label={t("history_detail.subtotal")}
                  value={formatCurrency(order.subtotal)}
                />
                <SummaryRow
                  label={t("history_detail.tax")}
                  value={formatCurrency(order.tax)}
                />
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-base font-semibold">
                    {t("history_detail.total")}
                  </span>
                  <span className="text-base font-bold tabular-nums">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <div className="border-t p-6">
            <Button
              type="button"
              onClick={onPrint}
              className={cn(
                "h-12 w-full rounded-full bg-blue-600 text-base font-semibold text-white shadow-none",
                "hover:bg-blue-700 focus-visible:ring-blue-600"
              )}
            >
              <Printer className="mr-2 size-4" />
              {t("history_detail.print_invoice")}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground flex h-80 items-center justify-center p-6 text-center text-sm">
          {t("history_detail.select_order_message")}
        </div>
      )}
    </aside>
  )
}

function InfoRow({ value }: { value: string }) {
  return (
    <div className="border-input rounded-xl border px-4 py-3 text-sm">
      {value}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}
