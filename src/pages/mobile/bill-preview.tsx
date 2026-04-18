import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Percent, Scissors, Tag } from "lucide-react"

import { MobileHeader } from "@/components/mobile/mobile-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"

type BillLine = {
  id: string
  name: string
  modifier?: string
  qty: number
  unitPrice: number
}

const LINES: BillLine[] = [
  { id: "b1", name: "Kopag Benedict", modifier: "Vừa · không hành", qty: 2, unitPrice: 75.5 },
  { id: "b2", name: "Beef Burger", modifier: "Well done · thêm phô mai", qty: 1, unitPrice: 103 },
  { id: "b3", name: "Cappuccino", qty: 2, unitPrice: 28 },
  { id: "b4", name: "Fresh Lemonade", modifier: "Ít đá", qty: 1, unitPrice: 24 },
]

const TAX_RATE = 0.1
const SERVICE_RATE = 0.05

export function MobileBillPreviewPage() {
  const navigate = useNavigate()
  const [discount, setDiscount] = useState(20)
  const [tip, setTip] = useState(30)

  const subtotal = LINES.reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const tax = subtotal * TAX_RATE
  const service = subtotal * SERVICE_RATE
  const total = subtotal + tax + service - discount + tip

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader title="Hoá đơn" subtitle="Đơn #1234 · Bàn A3" />

      <div className="flex-1 overflow-y-auto p-4 pb-48">
        <div className="rounded-2xl bg-white p-4">
          <div className="flex items-center justify-between border-b border-dashed pb-3">
            <div>
              <div className="text-xs text-slate-500">Khách hàng</div>
              <div className="text-sm font-bold text-slate-900">Cheryl Arema</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">2 khách · 17/04</div>
              <div className="text-sm font-bold text-slate-900">14:23</div>
            </div>
          </div>

          <div className="divide-y">
            {LINES.map((l) => (
              <div key={l.id} className="flex gap-3 py-3">
                <span className="w-8 shrink-0 text-sm font-bold text-slate-400 tabular-nums">
                  ×{l.qty}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    {l.name}
                  </div>
                  {l.modifier ? (
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {l.modifier}
                    </div>
                  ) : null}
                </div>
                <span className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(l.unitPrice * l.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 border-t border-dashed pt-3 text-sm">
            <Row label="Tạm tính" value={formatCurrency(subtotal)} />
            <Row label="Thuế (10%)" value={formatCurrency(tax)} />
            <Row label="Phí dịch vụ (5%)" value={formatCurrency(service)} />
            {discount > 0 ? (
              <Row
                label="Giảm giá"
                value={`−${formatCurrency(discount)}`}
                valueClass="text-rose-600"
                onRemove={() => setDiscount(0)}
              />
            ) : null}
            {tip > 0 ? (
              <Row
                label="Tip"
                value={`+${formatCurrency(tip)}`}
                valueClass="text-emerald-600"
                onRemove={() => setTip(0)}
              />
            ) : null}
          </div>

          <div className="mt-3 flex items-baseline justify-between rounded-xl bg-emerald-50 px-3 py-2.5">
            <span className="text-sm font-bold text-slate-900">TỔNG CỘNG</span>
            <span className="text-xl font-black text-emerald-600 tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <ActionChip
            icon={Tag}
            label="Giảm giá"
            active={discount > 0}
            onClick={() => setDiscount(discount > 0 ? 0 : 20)}
          />
          <ActionChip
            icon={Percent}
            label="Tip"
            active={tip > 0}
            onClick={() => setTip(tip > 0 ? 0 : 30)}
          />
          <ActionChip icon={Scissors} label="Chia bill" onClick={() => {}} />
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 border-t bg-white px-4 py-3">
        <Button
          onClick={() => navigate("/mobile/payment")}
          className="h-12 w-full rounded-full bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
        >
          Chọn phương thức thanh toán
        </Button>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  valueClass,
  onRemove,
}: {
  label: string
  value: string
  valueClass?: string
  onRemove?: () => void
}) {
  return (
    <div className="flex items-center justify-between text-slate-500">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn("tabular-nums", valueClass ?? "text-slate-900")}>
          {value}
        </span>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-[11px] text-slate-500 hover:bg-rose-100 hover:text-rose-500"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  )
}

function ActionChip({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Tag
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-[11px] font-semibold transition-colors",
        active
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  )
}
