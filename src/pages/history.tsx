import { useMemo, useState } from "react"
import {
  ChevronsRight,
  ChevronsUpDown,
  MoreVertical,
} from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

import { HistoryDetailPanel } from "@/components/pos/history-detail-panel"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { ORDERS } from "@/mocks/orders"
import type { Order, OrderStatus } from "@/types"

type TabId = "all" | OrderStatus

const TABS: { id: TabId; labelKey: string }[] = [
  { id: "all", labelKey: "orders.tab_all" },
  { id: "pending", labelKey: "orders.tab_waiting" },
  { id: "completed", labelKey: "orders.tab_completed" },
  { id: "ready", labelKey: "orders.tab_ready" },
  { id: "cancelled", labelKey: "orders.tab_cancelled" },
]

const PAGE_SIZE = 8

function formatShortDateTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d)
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d)
}

export function HistoryPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<TabId>("all")
  const [selected, setSelected] = useState<Order | null>(ORDERS[0] ?? null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (tab === "all") return ORDERS
    return ORDERS.filter((o) => o.status === tab)
  }, [tab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  const pagesShown = useMemo(() => {
    const windowSize = 4
    const start = Math.max(
      1,
      Math.min(currentPage - 1, totalPages - windowSize + 1)
    )
    const end = Math.min(start + windowSize - 1, totalPages)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages])

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{t("history.title")}</h1>
          <span className="text-muted-foreground text-sm">
            {t("history.showing_orders", { count: filtered.length })}
          </span>
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
                onClick={() => {
                  setTab(tabItem.id)
                  setPage(1)
                }}
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

        <div className="bg-background rounded-2xl border">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{t("history.heading")}</h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                {filtered.length}
              </span>
            </div>
            <button
              type="button"
              aria-label={t("common.more")}
              className="text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="size-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <SortableTh>{t("history.column_order_number")}</SortableTh>
                  <SortableTh>{t("history.column_date_time")}</SortableTh>
                  <th className="px-6 py-3 text-left font-medium">
                    {t("history.column_payment_status")}
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    {t("history.column_amount")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pageOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-muted-foreground px-6 py-10 text-center"
                    >
                      {t("history.no_orders")}
                    </td>
                  </tr>
                ) : (
                  pageOrders.map((order) => {
                    const isSelected = selected?.id === order.id
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelected(order)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected ? "bg-blue-50/70" : "hover:bg-muted/30"
                        )}
                      >
                        <td className="text-muted-foreground px-6 py-4 font-medium">
                          #{order.code.padStart(5, "0")}
                        </td>
                        <td className="text-muted-foreground px-6 py-4">
                          {formatShortDateTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-blue-600 font-medium">
                            {t("history.status_paid")}
                          </span>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 tabular-nums">
                          {formatCurrency(order.total)}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t px-6 py-4">
            <span className="text-muted-foreground text-sm">
              {t("common.page_of", { current: currentPage, total: totalPages })}
            </span>
            <div className="flex items-center gap-1.5">
              {pagesShown.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    p === currentPage
                      ? "bg-blue-600 text-white"
                      : "border-input border hover:bg-muted"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage >= totalPages}
                aria-label={t("common.next_page")}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border transition-colors",
                  "border-blue-500 text-blue-600 hover:bg-blue-50",
                  "disabled:cursor-not-allowed disabled:opacity-40"
                )}
              >
                <ChevronsRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <HistoryDetailPanel
        order={selected}
        onPrint={() =>
          selected
            ? toast.success(
                t("history.print_toast", {
                  code: selected.code.padStart(5, "0"),
                })
              )
            : undefined
        }
        className="xl:sticky xl:top-20"
      />
    </div>
  )
}

function SortableTh({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left font-medium">
      <span className="inline-flex items-center gap-1.5">
        {children}
        <ChevronsUpDown className="size-3.5" />
      </span>
    </th>
  )
}
