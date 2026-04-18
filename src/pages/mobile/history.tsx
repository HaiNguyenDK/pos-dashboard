import { useMemo, useState } from "react"
import { Calendar, ChevronDown, Printer, Search } from "lucide-react"

import { MobileHeader } from "@/components/mobile/mobile-header"
import { StatusChip } from "@/components/mobile/status-chip"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { BILLS } from "@/mocks/bills"

const PAGE_SIZE = 7

const PAYMENT_LABEL = {
  cash: "Tiền mặt",
  qr: "VietQR",
  card: "Thẻ",
  ewallet: "Ví điện tử",
} as const

const PAYMENT_EMOJI = {
  cash: "💵",
  qr: "📱",
  card: "💳",
  ewallet: "👝",
} as const

export function MobileHistoryPage() {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return BILLS
    return BILLS.filter(
      (b) =>
        b.customerName.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q)
    )
  }, [query])

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader title="Lịch sử đơn" subtitle={`${filtered.length} đơn`} />

      <div className="bg-white px-4 pb-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Tìm theo mã đơn / khách"
            className="h-10 w-full rounded-full bg-slate-100 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip active icon={Calendar} label="Hôm nay" />
          <FilterChip label="Tuần này" />
          <FilterChip label="Tháng này" />
          <FilterChip label="Tất cả" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
        <div className="flex flex-col gap-2">
          {pageItems.map((b) => (
            <div key={b.id} className="rounded-2xl border bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-400">
                      #{b.code}
                    </span>
                    <StatusChip status="paid" />
                  </div>
                  <div className="mt-0.5 truncate text-sm font-bold text-slate-900">
                    {b.customerName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(b.paidAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })}{" "}
                    · {b.tableName ?? "Mang đi"} · {b.items.length} món
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-base font-black tabular-nums text-slate-900">
                    {formatCurrency(b.total)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {PAYMENT_EMOJI[b.paymentMethod]}{" "}
                    {PAYMENT_LABEL[b.paymentMethod]}
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 active:bg-slate-200"
                >
                  Chi tiết
                </button>
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-blue-50 text-xs font-semibold text-blue-600 active:bg-blue-100"
                >
                  <Printer className="size-3.5" />
                  In lại
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full bg-white border px-4 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            ← Trước
          </button>
          <span className="text-xs text-slate-500">
            Trang {page}/{totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full bg-white border px-4 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterChip({
  active,
  label,
  icon: Icon,
}: {
  active?: boolean
  label: string
  icon?: typeof Calendar
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold",
        active
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-600"
      )}
    >
      {Icon ? <Icon className="size-3" /> : null}
      {label}
      <ChevronDown className="size-3 opacity-60" />
    </button>
  )
}
