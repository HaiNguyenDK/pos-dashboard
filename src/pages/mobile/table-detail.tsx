import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Minus, Plus, Users } from "lucide-react"

import { MobileHeader } from "@/components/mobile/mobile-header"
import { StatusChip } from "@/components/mobile/status-chip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { TABLES } from "@/mocks/tables"

export function MobileTableDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const table = TABLES.find((t) => t.id === id) ?? TABLES[0]
  const [customerName, setCustomerName] = useState("")
  const [guests, setGuests] = useState(2)
  const [mode, setMode] = useState<"dine-in" | "take-away">("dine-in")
  const [note, setNote] = useState("")

  const hasRunningOrder = table.status === "occupied"

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader
        title={`Bàn ${table.name}`}
        subtitle={`${table.seats} chỗ · Zone ${table.zone}`}
      />

      <div className="flex-1 overflow-y-auto p-4 pb-28">
        <div
          className={cn(
            "flex flex-col items-center gap-2 rounded-3xl p-6",
            table.status === "available"
              ? "bg-gradient-to-br from-blue-50 to-blue-100/60"
              : table.status === "occupied"
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/60"
                : "bg-gradient-to-br from-rose-50 to-rose-100/60"
          )}
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white text-2xl font-black text-slate-900 shadow-sm ring-4 ring-white/60">
            {table.name}
          </div>
          <StatusChip status={table.status} size="md" withDot />
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Users className="size-4" />
            <span>Tối đa {table.seats} người</span>
          </div>
        </div>

        {hasRunningOrder ? (
          <div className="mt-4 rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Đơn đang chạy</div>
                <div className="text-base font-bold text-slate-900">
                  #1244 · Rijal Arudam
                </div>
              </div>
              <StatusChip status="preparing" />
            </div>
            <div className="mt-3 flex justify-between border-t pt-3 text-sm">
              <span className="text-slate-500">4 món · 18:42</span>
              <span className="font-bold text-blue-600 tabular-nums">
                {formatCurrency(245.5)}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                onClick={() => navigate("/mobile/cart")}
                className="h-11 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                Xem / Thêm món
              </Button>
              <Button
                onClick={() => navigate("/mobile/bill")}
                className="h-11 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Thanh toán
              </Button>
            </div>
          </div>
        ) : (
          <form className="mt-4 flex flex-col gap-4 rounded-2xl border bg-white p-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                Tên khách
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nhập tên khách (tuỳ chọn)"
                className="h-11 w-full rounded-xl bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                Số người
              </label>
              <div className="inline-flex items-center gap-4 rounded-full bg-slate-50 px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm active:scale-95"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-base font-bold tabular-nums">
                  {guests}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setGuests((g) => Math.min(table.seats, g + 1))
                  }
                  className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm active:scale-95"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                Hình thức
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["dine-in", "take-away"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition-colors",
                      mode === m
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600"
                    )}
                  >
                    {m === "dine-in" ? "Dùng tại chỗ" : "Mang đi"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                Ghi chú đơn
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Ví dụ: khách dị ứng hành"
                className="w-full resize-none rounded-xl bg-slate-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        )}
      </div>

      {!hasRunningOrder ? (
        <div className="absolute right-0 bottom-0 left-0 border-t bg-white px-4 py-3 md:bottom-0">
          <Button
            onClick={() => navigate("/mobile/menu")}
            className="h-12 w-full rounded-full bg-blue-600 text-base font-bold text-white hover:bg-blue-700"
          >
            Bắt đầu order →
          </Button>
        </div>
      ) : null}
    </div>
  )
}
