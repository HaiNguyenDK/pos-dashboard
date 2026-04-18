import { useMemo, useState } from "react"
import { ChevronsRight, MoreVertical, Plus, Search } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AddProductPanel } from "@/components/pos/add-product-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { MENU_CATEGORIES, MENU_ITEMS } from "@/mocks/menu"
import type { MenuItem } from "@/types"

type TabId = "all" | string

const PAGE_SIZE = 8

const GROUP_MAP: Record<string, string> = {
  appetizer: "Food",
  main: "Food",
  dessert: "Food",
  beverage: "Drink",
}

function productCode(id: string) {
  const num = parseInt(id.replace("m-", ""), 10) || 0
  return String(12340 + num).padStart(5, "0")
}

export function ProductsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<TabId>("main")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<MenuItem | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MENU_ITEMS.filter((item) => {
      if (tab !== "all" && item.categoryId !== tab) return false
      if (q && !item.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [tab, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageItems = useMemo(() => {
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
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-semibold">{t("products.title")}</h1>

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

          <Button
            type="button"
            onClick={() => setSelected(null)}
            className={cn(
              "h-11 rounded-full bg-blue-50 text-blue-600 shadow-none",
              "hover:bg-blue-100 focus-visible:ring-blue-600"
            )}
          >
            <Plus className="mr-2 size-4" />
            {t("products.add_button")}
          </Button>
        </div>

        <div
          role="tablist"
          className="bg-muted flex w-full items-center gap-1 rounded-full p-1"
        >
          {[{ id: "all", name: t("products.tab_all") } as const, ...MENU_CATEGORIES].map(
            (c) => {
              const active = c.id === tab
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setTab(c.id)
                    setPage(1)
                  }}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c.name}
                </button>
              )
            }
          )}
        </div>

        <div className="bg-background rounded-2xl border">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{t("products.heading")}</h2>
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
                  <th className="px-6 py-3 text-left font-medium">
                    {t("products.column_name")}
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    {t("products.column_code")}
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    {t("products.column_category")}
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    {t("products.column_stock")}
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    {t("products.column_price")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pageItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-muted-foreground px-6 py-10 text-center"
                    >
                      {t("products.no_products")}
                    </td>
                  </tr>
                ) : (
                  pageItems.map((item) => {
                    const isSelected = selected?.id === item.id
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected ? "bg-blue-50/70" : "hover:bg-muted/30"
                        )}
                      >
                        <td className="px-6 py-4 font-medium">{item.name}</td>
                        <td className="text-muted-foreground px-6 py-4">
                          #{productCode(item.id)}
                        </td>
                        <td className="text-muted-foreground px-6 py-4">
                          {GROUP_MAP[item.categoryId] ?? "Food"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-blue-600">
                            {item.available}
                          </span>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 tabular-nums">
                          {formatCurrency(item.price)}
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

      <AddProductPanel
        className="xl:sticky xl:top-20"
        product={selected}
        onClear={() => setSelected(null)}
      />
    </div>
  )
}
