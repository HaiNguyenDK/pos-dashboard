import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ShoppingBag, Sparkles } from "lucide-react"

import { MenuItemCard } from "@/components/mobile/menu-item-card"
import { MobileHeader } from "@/components/mobile/mobile-header"
import { ModifierSheet } from "@/components/mobile/modifier-sheet"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { MENU_CATEGORIES, MENU_ITEMS } from "@/mocks/menu"
import type { MenuItem } from "@/types"

export function MobileMenuPage() {
  const navigate = useNavigate()
  const [categoryId, setCategoryId] = useState<string>("favorites")
  const [query, setQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [cartCounts, setCartCounts] = useState<Record<string, number>>({
    "m-1": 2,
    "m-3": 1,
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let items = MENU_ITEMS
    if (!q) {
      if (categoryId === "favorites") {
        items = MENU_ITEMS.slice(0, 8)
      } else {
        items = items.filter((i) => i.categoryId === categoryId)
      }
    } else {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      )
    }
    return items
  }, [categoryId, query])

  const cartCount = Object.values(cartCounts).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cartCounts).reduce((sum, [id, n]) => {
    const item = MENU_ITEMS.find((m) => m.id === id)
    return sum + (item?.price ?? 0) * n
  }, 0)

  const quickAdd = (id: string) =>
    setCartCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))

  return (
    <div className="relative flex h-full flex-col bg-slate-50">
      <MobileHeader
        title="Bàn A3 · Đơn #1234"
        subtitle="Chọn món thêm vào đơn"
        right={
          <button
            type="button"
            onClick={() => navigate("/mobile/cart")}
            aria-label="Xem giỏ"
            className="relative flex size-9 items-center justify-center rounded-full bg-slate-100"
          >
            <ShoppingBag className="size-4" />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        }
      />

      <div className="bg-white px-4 pb-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm món"
            className="h-10 w-full rounded-full bg-slate-100 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex shrink-0 gap-2 overflow-x-auto border-b bg-white px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CategoryChip
          active={categoryId === "favorites"}
          onClick={() => setCategoryId("favorites")}
        >
          <Sparkles className="size-3.5" />
          Yêu thích
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

      <div className="flex-1 overflow-y-auto px-3 py-3 pb-28">
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Không tìm thấy món nào
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filtered.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={cartCounts[item.id] ?? 0}
                onClick={() => setSelectedItem(item)}
                onQuickAdd={() => quickAdd(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {cartCount > 0 ? (
        <div className="absolute right-0 bottom-0 left-0 border-t bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => navigate("/mobile/cart")}
            className={cn(
              "flex h-12 w-full items-center justify-between rounded-full bg-blue-600 px-5 text-white shadow-lg shadow-blue-500/30",
              "active:scale-[0.98] transition-transform"
            )}
          >
            <span className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {cartCount}
              </span>
              <span className="text-sm font-bold">Xem giỏ</span>
            </span>
            <span className="text-sm font-bold tabular-nums">
              {formatCurrency(cartTotal)}
            </span>
          </button>
        </div>
      ) : null}

      <ModifierSheet
        item={selectedItem}
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        onAdd={(p) => {
          if (selectedItem) {
            setCartCounts((prev) => ({
              ...prev,
              [selectedItem.id]: (prev[selectedItem.id] ?? 0) + p.quantity,
            }))
            setSelectedItem(null)
          }
        }}
      />
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
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-600"
      )}
    >
      {children}
    </button>
  )
}
