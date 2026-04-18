import { useMemo, useState } from "react"
import {
  ChevronRight,
  ChevronsRight,
  MoreVertical,
  Printer,
  Search,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { BILLS } from "@/mocks/bills"

const PAGE_SIZE = 7

export function BillsPage() {
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const [date, setDate] = useState("22/02/2024")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return BILLS
    return BILLS.filter(
      (b) =>
        b.customerName.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.tableCode?.toLowerCase().includes(q)
    )
  }, [query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageBills = useMemo(() => {
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-semibold">{t("bills.title")}</h1>

        <div className="relative mx-auto min-w-0 max-w-xl flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("common.search")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
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

      <div className="bg-background rounded-2xl border">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{t("bills.heading")}</h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
              {filtered.length}
            </span>
          </div>
          <button
            type="button"
            aria-label={t("common.more")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <MoreVertical className="size-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left font-medium">
                  {t("bills.column_name")}
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  {t("bills.column_table")}
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  {t("bills.column_order_number")}
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  {t("bills.column_status")}
                </th>
                <th className="px-6 py-3 text-right font-medium">
                  {t("bills.column_action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageBills.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-muted-foreground px-6 py-10 text-center"
                  >
                    {t("bills.no_bills")}
                  </td>
                </tr>
              ) : (
                pageBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium">{bill.customerName}</div>
                      <div className="text-muted-foreground text-xs">
                        {t("bills.bill_items", {
                          count: bill.items.length,
                          table: bill.tableName ?? "—",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">{bill.tableCode ?? "—"}</td>
                    <td className="px-6 py-4">#{bill.code}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                        {t("bills.status_completed")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label={t("bills.print_bill_aria")}
                          onClick={() =>
                            toast.success(
                              t("bills.print_toast", { code: bill.code })
                            )
                          }
                          className="border-input hover:bg-blue-600 hover:border-blue-600 hover:text-white flex size-9 items-center justify-center rounded-lg border transition-colors"
                        >
                          <Printer className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={t("bills.delete_bill_aria")}
                          onClick={() =>
                            toast(t("bills.delete_toast", { code: bill.code }), {
                              description: t("bills.delete_pending"),
                            })
                          }
                          className="border-input hover:bg-red-500 hover:border-red-500 hover:text-white flex size-9 items-center justify-center rounded-lg border transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
  )
}
