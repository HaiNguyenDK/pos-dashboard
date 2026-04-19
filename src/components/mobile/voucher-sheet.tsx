import { useState } from "react"
import { Sparkles, Ticket, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { VOUCHERS, type Voucher } from "@/mocks/queue"

type Props = {
  open: boolean
  subtotal: number
  onClose: () => void
  onApply: (voucher: Voucher) => void
}

export function VoucherSheet({ open, subtotal, onClose, onApply }: Props) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  if (!open) return null

  const applyByCode = () => {
    const v = VOUCHERS.find(
      (x) => x.code.toLowerCase() === code.trim().toLowerCase()
    )
    if (!v) {
      setError("Mã không hợp lệ hoặc đã hết hạn")
      return
    }
    if (v.minSpend && subtotal < v.minSpend) {
      setError(`Đơn tối thiểu ${formatCurrency(v.minSpend)}`)
      return
    }
    onApply(v)
    setCode("")
    setError("")
  }

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[88%] w-full flex-col rounded-t-3xl bg-white shadow-xl">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" />
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2">
            <Ticket className="size-5 text-blue-600" />
            <div>
              <div className="text-base font-black text-slate-900">
                Áp mã giảm giá
              </div>
              <div className="text-[11px] text-slate-500">
                Nhập mã hoặc chọn từ danh sách
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex size-9 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b px-5 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                setError("")
              }}
              placeholder="VD: WELCOME10"
              className={cn(
                "h-11 flex-1 rounded-xl bg-slate-50 px-3 text-sm font-mono uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500",
                error && "ring-2 ring-rose-500"
              )}
            />
            <button
              type="button"
              onClick={applyByCode}
              className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Áp dụng
            </button>
          </div>
          {error ? (
            <div className="mt-1.5 text-xs font-semibold text-rose-600">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
            <Sparkles className="size-3.5" />
            Voucher khả dụng
          </div>
          <div className="flex flex-col gap-2">
            {VOUCHERS.map((v) => {
              const eligible = !v.minSpend || subtotal >= v.minSpend
              return (
                <button
                  key={v.code}
                  type="button"
                  disabled={!eligible}
                  onClick={() => onApply(v)}
                  className={cn(
                    "flex items-stretch gap-0 overflow-hidden rounded-xl border text-left transition-all",
                    eligible
                      ? "border-blue-200 bg-white hover:border-blue-500 hover:shadow-sm active:scale-[0.99]"
                      : "border-slate-200 bg-slate-50 opacity-50"
                  )}
                >
                  <div className="relative flex w-28 shrink-0 flex-col items-center justify-center gap-0.5 border-r border-dashed bg-gradient-to-br from-blue-500 to-blue-700 px-3 py-4 text-white">
                    <span className="text-[10px] font-bold uppercase opacity-80">
                      {v.type === "percent" ? "Giảm" : v.type === "fixed" ? "Giảm" : "Free"}
                    </span>
                    <span className="text-2xl font-black tabular-nums leading-none">
                      {v.type === "percent"
                        ? `${v.value}%`
                        : v.type === "fixed"
                          ? `${v.value}`
                          : "1"}
                    </span>
                    {v.type === "fixed" ? (
                      <span className="text-[10px] opacity-80">USD</span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-0.5 px-3 py-3">
                    <div className="font-mono text-[10px] font-bold text-blue-600">
                      {v.code}
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {v.label}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {v.minSpend
                        ? `Đơn từ ${formatCurrency(v.minSpend)}`
                        : "Áp mọi đơn"}
                      {v.appliesTo && v.appliesTo !== "all"
                        ? ` · ${v.appliesTo === "food" ? "Món" : "Đồ uống"}`
                        : ""}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
