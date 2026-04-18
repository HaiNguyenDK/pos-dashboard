import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { MobileHeader } from "@/components/mobile/mobile-header"
import { NumericKeypad } from "@/components/mobile/numeric-keypad"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"

const TOTAL = 366.5

export function MobileCashPayPage() {
  const navigate = useNavigate()
  const [cents, setCents] = useState(Math.round(TOTAL * 100))

  const amount = cents / 100
  const change = amount - TOTAL
  const enough = amount >= TOTAL

  const onKey = (k: string) => {
    if (k === "00") {
      setCents((c) => c * 100)
    } else {
      const d = parseInt(k, 10)
      if (!Number.isNaN(d)) setCents((c) => c * 10 + d)
    }
  }
  const onBack = () => setCents((c) => Math.floor(c / 10))

  const suggestions = [400, 500, 1000]

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader title="Tiền mặt" subtitle="Đơn #1234 · Bàn A3" />

      <div className="bg-white px-5 py-5">
        <div className="text-xs font-medium text-slate-500">Tổng đơn</div>
        <div className="text-xl font-bold text-slate-900 tabular-nums">
          {formatCurrency(TOTAL)}
        </div>

        <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
          <div className="text-xs font-medium text-slate-500">Khách đưa</div>
          <div className="mt-1 text-right text-3xl font-black tabular-nums text-slate-900">
            {formatCurrency(amount)}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2.5">
          <span className="text-sm font-semibold text-emerald-800">
            {enough ? "Tiền thối" : "Còn thiếu"}
          </span>
          <span
            className={cn(
              "text-lg font-black tabular-nums",
              enough ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {enough
              ? formatCurrency(change)
              : `−${formatCurrency(TOTAL - amount)}`}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 pb-28">
        <div className="mb-3 flex gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setCents(s * 100)}
              className="flex-1 rounded-full bg-white border border-slate-200 py-2 text-sm font-semibold text-slate-700 active:scale-[0.98]"
            >
              {formatCurrency(s)}
            </button>
          ))}
        </div>

        <NumericKeypad onKey={onKey} onBackspace={onBack} />
      </div>

      <div className="absolute right-0 bottom-0 left-0 border-t bg-white px-4 py-3">
        <Button
          onClick={() => navigate("/mobile/pay/success")}
          disabled={!enough}
          className={cn(
            "h-12 w-full rounded-full text-base font-bold shadow-none",
            enough
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-100 text-slate-400"
          )}
        >
          Xác nhận thanh toán
        </Button>
      </div>
    </div>
  )
}
