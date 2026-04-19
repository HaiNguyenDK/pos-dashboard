import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Bell, Minus, Plus, Search, ShoppingBag, Sparkles } from "lucide-react"

import { GuestHeader } from "@/components/guest/guest-header"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { MENU_CATEGORIES, MENU_ITEMS } from "@/mocks/menu"

export function GuestMenuPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const tableName = (tableId ?? "a3").replace(/^t-?/i, "").toUpperCase()
  const [categoryId, setCategoryId] = useState<string>("popular")
  const [query, setQuery] = useState("")
  const [cart, setCart] = useState<Record<string, number>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q) {
      return MENU_ITEMS.filter((i) => i.name.toLowerCase().includes(q))
    }
    if (categoryId === "popular") return MENU_ITEMS.slice(0, 8)
    return MENU_ITEMS.filter((i) => i.categoryId === categoryId)
  }, [categoryId, query])

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [id, n]) => {
    const item = MENU_ITEMS.find((m) => m.id === id)
    return sum + (item?.price ?? 0) * n
  }, 0)

  const add = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  const dec = (id: string) =>
    setCart((prev) => {
      const n = (prev[id] ?? 0) - 1
      if (n <= 0) {
        const { [id]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: n }
    })

  return (
    <div className="flex flex-1 flex-col">
      <GuestHeader
        title={`Bàn ${tableName}`}
        subtitle="Tự chọn món"
        hideBack
        right={
          <button
            type="button"
            aria-label="Gọi nhân viên"
            className="flex h-9 items-center gap-1.5 rounded-full bg-orange-500 px-3 text-xs font-bold text-white active:scale-95"
          >
            <Bell className="size-3.5" />
            Gọi phục vụ
          </button>
        }
      />

      <div className="sticky top-14 z-10 bg-gradient-to-b from-amber-50/90 to-amber-50/40 px-4 py-3 backdrop-blur">
        <div className="relative mb-3">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm món..."
            className="h-11 w-full rounded-full border border-amber-200 bg-white pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <CategoryChip
            active={categoryId === "popular"}
            onClick={() => setCategoryId("popular")}
          >
            <Sparkles className="size-3.5" />
            Bán chạy
          </CategoryChip>
          {MENU_CATEGORIES.map((c) => (
            <CategoryChip
              key={c.id}
              active={categoryId === c.id}
              onClick={() => setCategoryId(c.id)}
            >
              {c.name}
            </CategoryChip>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pt-3 pb-28">
        <div className="flex flex-col gap-3">
          {filtered.map((item) => {
            const qty = cart[item.id] ?? 0
            return (
              <article
                key={item.id}
                className="flex gap-3 rounded-2xl border border-amber-100 bg-white p-3 shadow-sm"
              >
                <div
                  className="flex size-24 shrink-0 items-center justify-center rounded-xl text-4xl"
                  style={{ backgroundImage: item.imageGradient }}
                  aria-hidden="true"
                >
                  {item.emoji}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="line-clamp-2 text-[11px] leading-snug text-slate-500">
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-base font-black tabular-nums text-orange-600">
                      {formatCurrency(item.price)}
                    </span>
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => add(item.id)}
                        className="flex items-center gap-1 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold text-white active:scale-95"
                      >
                        <Plus className="size-3.5" strokeWidth={3} />
                        Thêm
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 rounded-full bg-orange-50 px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => dec(item.id)}
                          className="flex size-7 items-center justify-center rounded-full bg-white shadow-sm active:scale-90"
                        >
                          <Minus className="size-3.5 text-orange-600" />
                        </button>
                        <span className="w-6 text-center text-sm font-black tabular-nums text-orange-700">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => add(item.id)}
                          className="flex size-7 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm active:scale-90"
                        >
                          <Plus className="size-3.5" strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}

          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Không tìm thấy món nào
            </div>
          ) : null}
        </div>
      </div>

      {cartCount > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md px-4 pb-4">
          <Link
            to={`/guest/${tableId}/cart`}
            className={cn(
              "flex h-14 w-full items-center justify-between rounded-full bg-gradient-to-r from-orange-500 to-amber-600 px-5 text-white shadow-xl shadow-orange-500/30",
              "active:scale-[0.98] transition-transform"
            )}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="size-5" />
              <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-xs font-black">
                {cartCount}
              </span>
              <span className="text-sm font-black">Xem giỏ →</span>
            </span>
            <span className="text-base font-black tabular-nums">
              {formatCurrency(cartTotal)}
            </span>
          </Link>
        </div>
      ) : null}
    </div>
  )
}

function CategoryChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "bg-slate-900 text-white"
          : "bg-white/80 text-slate-600 ring-1 ring-amber-200"
      )}
    >
      {children}
    </button>
  )
}
