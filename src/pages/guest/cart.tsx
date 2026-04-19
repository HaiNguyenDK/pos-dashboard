import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ChefHat, Minus, Plus, StickyNote, Trash2 } from "lucide-react"

import { GuestHeader } from "@/components/guest/guest-header"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { MENU_ITEMS } from "@/mocks/menu"

type CartLine = {
  id: string
  menuItemId: string
  qty: number
  note?: string
}

const INITIAL: CartLine[] = [
  { id: "l1", menuItemId: "m-1", qty: 2, note: "Không hành" },
  { id: "l2", menuItemId: "m-3", qty: 1 },
  { id: "l3", menuItemId: "m-16", qty: 1 },
]

const TAX_RATE = 0.1

export function GuestCartPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const tableName = (tableId ?? "a3").replace(/^t-?/i, "").toUpperCase()
  const navigate = useNavigate()
  const [lines, setLines] = useState(INITIAL)

  const subtotal = lines.reduce((sum, l) => {
    const item = MENU_ITEMS.find((m) => m.id === l.menuItemId)
    return sum + (item?.price ?? 0) * l.qty
  }, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const inc = (id: string) =>
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
    )
  const dec = (id: string) =>
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
    )
  const remove = (id: string) =>
    setLines((prev) => prev.filter((l) => l.id !== id))

  const sendToKitchen = () => {
    navigate(`/guest/${tableId}/pay`)
  }

  return (
    <div className="flex flex-1 flex-col">
      <GuestHeader title="Giỏ hàng" subtitle={`Bàn ${tableName}`} />

      <div className="flex-1 px-4 pt-3 pb-40">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="text-6xl opacity-40">🛒</div>
            <div className="text-base font-bold text-slate-900">
              Giỏ trống
            </div>
            <div className="text-xs text-slate-500">
              Chọn món trên menu để thêm vào đơn
            </div>
            <Link
              to={`/guest/${tableId}/menu`}
              className="mt-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white"
            >
              Tới menu
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {lines.map((l) => {
              const item = MENU_ITEMS.find((m) => m.id === l.menuItemId)
              if (!item) return null
              return (
                <article
                  key={l.id}
                  className="flex gap-3 rounded-2xl border border-amber-100 bg-white p-3"
                >
                  <div
                    className="flex size-16 shrink-0 items-center justify-center rounded-xl text-3xl"
                    style={{ backgroundImage: item.imageGradient }}
                    aria-hidden="true"
                  >
                    {item.emoji}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {item.name}
                        </h3>
                        <div className="text-xs font-semibold text-orange-600 tabular-nums">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.id)}
                        aria-label="Xoá"
                        className="flex size-7 items-center justify-center rounded-full text-rose-500 active:bg-rose-50"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    {l.note ? (
                      <div className="mt-1 inline-flex items-center gap-1 self-start rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                        <StickyNote className="size-3" />
                        {l.note}
                      </div>
                    ) : null}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full bg-orange-50 px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => dec(l.id)}
                          className="flex size-7 items-center justify-center rounded-full bg-white shadow-sm active:scale-90"
                        >
                          <Minus className="size-3.5 text-orange-600" />
                        </button>
                        <span className="w-6 text-center text-sm font-black tabular-nums text-orange-700">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => inc(l.id)}
                          className="flex size-7 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm active:scale-90"
                        >
                          <Plus className="size-3.5" strokeWidth={3} />
                        </button>
                      </div>
                      <span className="text-sm font-black tabular-nums">
                        {formatCurrency(item.price * l.qty)}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}

            <Link
              to={`/guest/${tableId}/menu`}
              className="mt-1 flex h-12 items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-amber-300 bg-white/50 text-sm font-semibold text-orange-600 hover:bg-orange-50"
            >
              <Plus className="size-4" />
              Thêm món khác
            </Link>

            <div className="mt-2 flex flex-col gap-1.5 rounded-2xl bg-white p-4 ring-1 ring-amber-100">
              <SummaryRow label="Tạm tính" value={formatCurrency(subtotal)} />
              <SummaryRow label="Thuế (10%)" value={formatCurrency(tax)} />
              <div className="mt-1 flex items-baseline justify-between border-t border-dashed pt-2">
                <span className="text-sm font-bold text-slate-900">Tổng</span>
                <span className="text-2xl font-black tabular-nums text-orange-600">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-[11px] text-blue-900">
              <ChefHat className="mt-0.5 size-4 shrink-0" />
              <span>
                Khi nhấn <b>Gửi bếp</b>, món sẽ được đưa xuống bếp ngay. Có thể
                thêm món khác sau.
              </span>
            </div>
          </div>
        )}
      </div>

      {lines.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-amber-200 bg-white/95 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={sendToKitchen}
            className={cn(
              "flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-base font-black text-white shadow-xl shadow-orange-500/30",
              "active:scale-[0.98]"
            )}
          >
            <ChefHat className="size-5" />
            Gửi bếp & thanh toán
          </button>
        </div>
      ) : null}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
}
