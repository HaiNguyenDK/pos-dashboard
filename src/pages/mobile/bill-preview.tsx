import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Gift, Percent, Scissors, Sparkles, Tag, Ticket, X } from "lucide-react"

import { LoyaltySheet } from "@/components/mobile/loyalty-sheet"
import { MobileHeader } from "@/components/mobile/mobile-header"
import { VoucherSheet } from "@/components/mobile/voucher-sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { TIER_META, type LoyaltyCustomer, type Voucher } from "@/mocks/queue"

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
  const [voucher, setVoucher] = useState<Voucher | null>(null)
  const [customer, setCustomer] = useState<LoyaltyCustomer | null>(null)
  const [voucherOpen, setVoucherOpen] = useState(false)
  const [loyaltyOpen, setLoyaltyOpen] = useState(false)

  const subtotal = LINES.reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const tax = subtotal * TAX_RATE
  const service = subtotal * SERVICE_RATE

  const voucherDiscount = voucher
    ? voucher.type === "percent"
      ? (subtotal * voucher.value) / 100
      : voucher.type === "fixed"
        ? voucher.value
        : 0
    : 0

  const total = Math.max(
    0,
    subtotal + tax + service - discount - voucherDiscount + tip
  )

  const pointsEarned = customer
    ? Math.floor(total * TIER_META[customer.tier].ptPerDollar)
    : 0

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader title="Hoá đơn" subtitle="Đơn #1234 · Bàn A3" />

      <div className="flex-1 overflow-y-auto p-4 pb-48">
        {customer ? (
          <LoyaltyBadge
            customer={customer}
            pointsEarned={pointsEarned}
            onRemove={() => setCustomer(null)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoyaltyOpen(true)}
            className="mb-3 flex w-full items-center justify-between rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 px-4 py-3 transition-colors hover:bg-violet-50"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Gift className="size-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900">
                  Khách hàng thân thiết?
                </div>
                <div className="text-[11px] text-slate-500">
                  Gắn số điện thoại để tích điểm
                </div>
              </div>
            </div>
            <span className="text-violet-600">→</span>
          </button>
        )}

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
            {voucher ? (
              <Row
                label={`Voucher (${voucher.code})`}
                value={`−${formatCurrency(voucherDiscount)}`}
                valueClass="text-blue-600"
                onRemove={() => setVoucher(null)}
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

        <div className="mt-4 grid grid-cols-4 gap-2">
          <ActionChip
            icon={Ticket}
            label="Voucher"
            active={!!voucher}
            onClick={() => setVoucherOpen(true)}
          />
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
          <ActionChip
            icon={Scissors}
            label="Chia bill"
            onClick={() => navigate("/mobile/bill/split")}
          />
        </div>

        {pointsEarned > 0 ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-2.5 text-white">
            <Sparkles className="size-4" />
            <span className="flex-1 text-sm font-semibold">
              Sẽ cộng{" "}
              <b className="font-black tabular-nums">
                +{pointsEarned.toLocaleString()}
              </b>{" "}
              điểm sau khi thanh toán
            </span>
          </div>
        ) : null}
      </div>

      <div className="absolute right-0 bottom-0 left-0 border-t bg-white px-4 py-3">
        <Button
          onClick={() => navigate("/mobile/payment")}
          className="h-12 w-full rounded-full bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
        >
          Chọn phương thức thanh toán
        </Button>
      </div>

      <VoucherSheet
        open={voucherOpen}
        subtotal={subtotal}
        onClose={() => setVoucherOpen(false)}
        onApply={(v) => {
          setVoucher(v)
          setVoucherOpen(false)
        }}
      />
      <LoyaltySheet
        open={loyaltyOpen}
        onClose={() => setLoyaltyOpen(false)}
        onSelect={(c) => {
          setCustomer(c)
          setLoyaltyOpen(false)
        }}
      />
    </div>
  )
}

function LoyaltyBadge({
  customer,
  pointsEarned,
  onRemove,
}: {
  customer: LoyaltyCustomer
  pointsEarned: number
  onRemove: () => void
}) {
  const tier = TIER_META[customer.tier]
  return (
    <div
      className={cn(
        "mb-3 flex items-center gap-3 rounded-2xl border-2 p-3",
        tier.bg,
        tier.ring.replace("ring-", "border-")
      )}
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl bg-white text-2xl ring-2",
          tier.ring
        )}
      >
        {tier.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-slate-900">
            {customer.name}
          </span>
          <span
            className={cn(
              "rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
              tier.text
            )}
          >
            {tier.label}
          </span>
        </div>
        <div className="mt-0.5 font-mono text-[11px] text-slate-600">
          {customer.phone}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-700">
          <span className="inline-flex items-center gap-0.5 font-semibold">
            <Sparkles className="size-3" />
            {customer.points.toLocaleString()} điểm
          </span>
          <span>·</span>
          <span className="text-emerald-700 font-semibold">
            +{pointsEarned.toLocaleString()} sau đơn này
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Bỏ liên kết khách"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-white/70"
      >
        <X className="size-4" />
      </button>
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
