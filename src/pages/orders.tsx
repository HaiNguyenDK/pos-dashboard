import { useMemo, useState } from "react"
import { ChevronRight, Search } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

import { OrderDetailDrawer } from "@/components/pos/order-detail-drawer"
import { OrderListCard } from "@/components/pos/order-list-card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ORDERS } from "@/mocks/orders"
import type { Order, OrderStatus } from "@/types"

type TabId = "all" | OrderStatus

type Tab = {
  id: TabId
  labelKey: string
}

const TABS: Tab[] = [
  { id: "all", labelKey: "orders.tab_all" },
  { id: "pending", labelKey: "orders.tab_waiting" },
  { id: "completed", labelKey: "orders.tab_completed" },
  { id: "ready", labelKey: "orders.tab_ready" },
  { id: "cancelled", labelKey: "orders.tab_cancelled" },
]

export function OrdersPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<TabId>("all")
  const [query, setQuery] = useState("")
  const [date, setDate] = useState("22/02/2024")
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ORDERS.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false
      if (!q) return true
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.code.toLowerCase().includes(q)
      )
    })
  }, [tab, query])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-semibold">{t("orders.title")}</h1>

        <div className="relative min-w-0 flex-1 max-w-xl mx-auto">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("common.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-full pl-10"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">
            {t("common.date_label")}
          </span>
          <div className="relative">
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-40 rounded-xl pr-10"
            />
            <ChevronRight className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div
        role="tablist"
        className="bg-muted flex w-full items-center gap-1 rounded-full p-1"
      >
        {TABS.map((tabItem) => {
          const active = tabItem.id === tab
          return (
            <button
              key={tabItem.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(tabItem.id)}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(tabItem.labelKey)}
            </button>
          )
        })}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("orders.customer_list")}</h2>
          <span className="text-muted-foreground text-sm">
            {t("common.showing_items", { count: filtered.length })}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-background text-muted-foreground rounded-2xl border p-10 text-center text-sm">
            {t("orders.no_orders")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((order) => (
              <OrderListCard
                key={order.id}
                order={order}
                onSeeDetail={() => setDetailOrder(order)}
                onPayBills={() =>
                  toast.success(t("orders.pay_bill_toast", { code: order.code }), {
                    description: t("orders.payment_flow_pending"),
                  })
                }
              />
            ))}
          </div>
        )}
      </section>

      <OrderDetailDrawer
        open={detailOrder !== null}
        onOpenChange={(open) => {
          if (!open) setDetailOrder(null)
        }}
        order={detailOrder}
      />
    </div>
  )
}
