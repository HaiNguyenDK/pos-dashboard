import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, Plus, Search, Settings } from "lucide-react"

import { OrderRow } from "@/components/mobile/order-row"
import { TableCard } from "@/components/mobile/table-card"
import { cn } from "@/lib/utils"
import { ORDERS } from "@/mocks/orders"
import { TABLES } from "@/mocks/tables"

type Tab = "tables" | "orders"

export function MobileHomePage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>("tables")
  const [query, setQuery] = useState("")

  const activeOrders = useMemo(
    () =>
      ORDERS.filter((o) =>
        ["pending", "preparing", "ready", "served"].includes(o.status)
      ),
    []
  )

  const filteredTables = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TABLES.filter((t) =>
      q ? t.name.toLowerCase().includes(q) : true
    )
  }, [query])

  const tablesByZone = useMemo(() => {
    const map = new Map<string, typeof TABLES>()
    for (const t of filteredTables) {
      if (!map.has(t.zone)) map.set(t.zone, [])
      map.get(t.zone)!.push(t)
    }
    return map
  }, [filteredTables])

  const readyCount = activeOrders.filter((o) => o.status === "ready").length

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex items-center justify-between bg-white px-4 py-3">
        <div>
          <div className="text-[11px] text-slate-500">Xin chào 👋</div>
          <div className="text-lg font-bold text-slate-900">Rijal</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate("/mobile/notifications")}
            aria-label="Thông báo"
            className="relative flex size-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
          >
            <Bell className="size-4" />
            <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/mobile/settings")}
            aria-label="Cài đặt"
            className="flex size-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white px-4 pb-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bàn hoặc khách"
            className="h-10 w-full rounded-full bg-slate-100 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex shrink-0 gap-1 bg-white px-4 pb-3">
        <TabButton
          active={tab === "tables"}
          onClick={() => setTab("tables")}
          label="Bàn"
          count={TABLES.length}
        />
        <TabButton
          active={tab === "orders"}
          onClick={() => setTab("orders")}
          label="Đơn đang chạy"
          count={activeOrders.length}
          badge={readyCount > 0 ? readyCount : undefined}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tab === "tables" ? (
          <div className="flex flex-col gap-5 pb-24">
            {Array.from(tablesByZone.entries()).map(([zone, items]) => (
              <section key={zone}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Zone {zone}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {items.length} bàn
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {items.map((t) => (
                    <TableCard
                      key={t.id}
                      table={t}
                      openOrder={
                        t.status === "occupied"
                          ? { itemCount: 4, total: 184.5 }
                          : undefined
                      }
                      onClick={() => navigate(`/mobile/table/${t.id}`)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-24">
            {activeOrders.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                onClick={() => navigate("/mobile/cart")}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/mobile/menu")}
        aria-label="Đơn mang đi"
        className={cn(
          "absolute right-4 bottom-6 flex h-14 items-center gap-2 rounded-full bg-blue-600 px-5 text-white shadow-lg shadow-blue-500/40",
          "active:scale-95 transition-transform"
        )}
      >
        <Plus className="size-5" strokeWidth={2.5} />
        <span className="text-sm font-bold">Mang đi</span>
      </button>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  label,
  count,
  badge,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
  badge?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-600"
      )}
    >
      {label} <span className={active ? "text-blue-100" : "text-slate-400"}>({count})</span>
      {badge ? (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  )
}
