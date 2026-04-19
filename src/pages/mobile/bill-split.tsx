import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle2, Minus, Plus, Users, UtensilsCrossed } from "lucide-react"

import { MobileHeader } from "@/components/mobile/mobile-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"

type BillLine = {
  id: string
  name: string
  emoji: string
  modifier?: string
  qty: number
  unitPrice: number
}

const LINES: BillLine[] = [
  { id: "b1", name: "Kopag Benedict", emoji: "🍳", modifier: "Vừa · không hành", qty: 2, unitPrice: 75.5 },
  { id: "b2", name: "Beef Burger", emoji: "🍔", modifier: "Well done · thêm phô mai", qty: 1, unitPrice: 103 },
  { id: "b3", name: "Cappuccino", emoji: "☕", qty: 2, unitPrice: 28 },
  { id: "b4", name: "Fresh Lemonade", emoji: "🍋", modifier: "Ít đá", qty: 1, unitPrice: 24 },
]

const TAX_RATE = 0.1
const SERVICE_RATE = 0.05

type Mode = "even" | "byItem"

const BUCKET_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
]
const BUCKET_BG = [
  "bg-blue-50 border-blue-200 text-blue-900",
  "bg-emerald-50 border-emerald-200 text-emerald-900",
  "bg-violet-50 border-violet-200 text-violet-900",
  "bg-amber-50 border-amber-200 text-amber-900",
  "bg-rose-50 border-rose-200 text-rose-900",
  "bg-teal-50 border-teal-200 text-teal-900",
]

export function MobileBillSplitPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>("even")
  const [portions, setPortions] = useState(2)
  // byItem: per-line bucket assignment
  const [assignments, setAssignments] = useState<Record<string, number>>(
    LINES.reduce((acc, l) => ({ ...acc, [l.id]: 0 }), {})
  )
  const [activeBucket, setActiveBucket] = useState(0)

  const subtotal = LINES.reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const tax = subtotal * TAX_RATE
  const service = subtotal * SERVICE_RATE
  const total = subtotal + tax + service

  const evenPerPerson = total / portions

  const buckets = useMemo(() => {
    if (mode === "byItem") {
      const count = Math.max(1, ...Object.values(assignments).map((v) => v + 1))
      return Array.from({ length: count }, (_, i) => {
        const lines = LINES.filter((l) => assignments[l.id] === i)
        const sub = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)
        const bucketTax = sub * TAX_RATE
        const bucketService = sub * SERVICE_RATE
        return {
          index: i,
          lines,
          subtotal: sub,
          tax: bucketTax,
          service: bucketService,
          total: sub + bucketTax + bucketService,
        }
      })
    }
    return Array.from({ length: portions }, (_, i) => ({
      index: i,
      lines: LINES,
      subtotal: subtotal / portions,
      tax: tax / portions,
      service: service / portions,
      total: evenPerPerson,
    }))
  }, [mode, portions, assignments, subtotal, tax, service, evenPerPerson])

  const addBucket = () => {
    const count = Math.max(...Object.values(assignments).map((v) => v + 1), 1)
    if (count < 6) setActiveBucket(count)
  }

  const assignLine = (lineId: string) =>
    setAssignments((prev) => ({ ...prev, [lineId]: activeBucket }))

  const unassignedCount = Object.values(assignments).filter((v) => v === -1).length
  const canConfirm =
    mode === "even"
      ? portions >= 2
      : buckets.every((b) => b.lines.length > 0) && buckets.length >= 2

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader title="Chia hoá đơn" subtitle="Đơn #1234 · Bàn A3" />

      <div className="bg-white px-4 pb-3 pt-2">
        <div className="flex gap-1.5 rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("even")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-colors",
              mode === "even"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-600"
            )}
          >
            <Users className="size-4" />
            Chia đều
          </button>
          <button
            type="button"
            onClick={() => setMode("byItem")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-colors",
              mode === "byItem"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-600"
            )}
          >
            <UtensilsCrossed className="size-4" />
            Chia theo món
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
          <span className="text-xs font-semibold text-slate-600">Tổng đơn</span>
          <span className="text-base font-black tabular-nums text-emerald-700">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-32">
        {mode === "even" ? (
          <EvenSplit
            portions={portions}
            setPortions={setPortions}
            perPerson={evenPerPerson}
            total={total}
          />
        ) : (
          <ByItemSplit
            lines={LINES}
            assignments={assignments}
            setAssignments={setAssignments}
            activeBucket={activeBucket}
            setActiveBucket={setActiveBucket}
            buckets={buckets}
            onAddBucket={addBucket}
            onAssign={assignLine}
            unassignedCount={unassignedCount}
          />
        )}
      </div>

      <div className="absolute right-0 bottom-0 left-0 border-t bg-white px-4 py-3">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            {buckets.length} bill · {mode === "even" ? `${portions} người` : "phân theo món"}
          </span>
          <span>
            Tổng kiểm tra:{" "}
            <span className="font-semibold text-slate-900 tabular-nums">
              {formatCurrency(buckets.reduce((s, b) => s + b.total, 0))}
            </span>
          </span>
        </div>
        <Button
          onClick={() => navigate("/mobile/payment")}
          disabled={!canConfirm}
          className={cn(
            "h-12 w-full rounded-full text-base font-bold shadow-none",
            canConfirm
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-100 text-slate-400"
          )}
        >
          Xác nhận chia · Thanh toán bill đầu tiên
        </Button>
      </div>
    </div>
  )
}

function EvenSplit({
  portions,
  setPortions,
  perPerson,
  total,
}: {
  portions: number
  setPortions: (n: number) => void
  perPerson: number
  total: number
}) {
  return (
    <>
      <section className="rounded-2xl bg-white p-5">
        <label className="mb-3 block text-sm font-semibold text-slate-900">
          Số người
        </label>
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => setPortions(Math.max(2, portions - 1))}
            className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-700 active:scale-95"
          >
            <Minus className="size-5" />
          </button>
          <span className="w-16 text-center text-5xl font-black tabular-nums text-slate-900">
            {portions}
          </span>
          <button
            type="button"
            onClick={() => setPortions(Math.min(10, portions + 1))}
            className="flex size-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white active:scale-95"
          >
            <Plus className="size-5" />
          </button>
        </div>

        <div className="mt-5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-4 text-white">
          <div className="text-xs opacity-80">Mỗi người trả</div>
          <div className="mt-0.5 text-3xl font-black tabular-nums">
            {formatCurrency(perPerson)}
          </div>
          <div className="mt-1 text-[11px] opacity-70">
            {portions} × {formatCurrency(perPerson)} = {formatCurrency(total)}
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Các bill sẽ được tạo
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: portions }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border p-3",
                BUCKET_BG[i % BUCKET_BG.length]
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-black text-white",
                    BUCKET_COLORS[i % BUCKET_COLORS.length]
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-[11px] font-semibold">Bill #{i + 1}</span>
              </div>
              <div className="mt-1.5 text-base font-black tabular-nums">
                {formatCurrency(perPerson)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function ByItemSplit({
  lines,
  assignments,
  setAssignments,
  activeBucket,
  setActiveBucket,
  buckets,
  onAddBucket,
  onAssign,
  unassignedCount,
}: {
  lines: BillLine[]
  assignments: Record<string, number>
  setAssignments: (a: Record<string, number>) => void
  activeBucket: number
  setActiveBucket: (i: number) => void
  buckets: Array<{ index: number; lines: BillLine[]; subtotal: number; tax: number; service: number; total: number }>
  onAddBucket: () => void
  onAssign: (lineId: string) => void
  unassignedCount: number
}) {
  return (
    <>
      <section className="rounded-2xl bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Các bill ({buckets.length})
          </h3>
          <button
            type="button"
            onClick={onAddBucket}
            disabled={buckets.length >= 6}
            className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold text-white disabled:opacity-40"
          >
            <Plus className="size-3" /> Thêm bill
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {buckets.map((b) => {
            const active = activeBucket === b.index
            return (
              <button
                key={b.index}
                type="button"
                onClick={() => setActiveBucket(b.index)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border-2 p-3 transition-all",
                  active
                    ? cn(
                        "border-slate-900 shadow-sm",
                        BUCKET_BG[b.index % BUCKET_BG.length]
                      )
                    : "border-slate-200 bg-slate-50"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-black text-white",
                    BUCKET_COLORS[b.index % BUCKET_COLORS.length]
                  )}
                >
                  {b.index + 1}
                </span>
                <div className="text-left">
                  <div className="text-[10px] font-semibold opacity-80">
                    Bill #{b.index + 1}
                  </div>
                  <div className="text-sm font-black tabular-nums">
                    {formatCurrency(b.total)}
                  </div>
                  <div className="text-[10px] opacity-70">
                    {b.lines.length} món
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Gán món vào Bill #{activeBucket + 1}
          </h3>
          {unassignedCount > 0 ? (
            <span className="text-[10px] font-semibold text-rose-500">
              Còn {unassignedCount} món chưa gán
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          {lines.map((l) => {
            const assignedTo = assignments[l.id]
            const isInActive = assignedTo === activeBucket
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onAssign(l.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  isInActive
                    ? cn(
                        "border-blue-500 shadow-sm",
                        BUCKET_BG[activeBucket % BUCKET_BG.length]
                      )
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  {l.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      ×{l.qty} {l.name}
                    </span>
                  </div>
                  {l.modifier ? (
                    <div className="text-[11px] text-slate-500">
                      {l.modifier}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-bold tabular-nums">
                    {formatCurrency(l.unitPrice * l.qty)}
                  </span>
                  {assignedTo >= 0 ? (
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white",
                        BUCKET_COLORS[assignedTo % BUCKET_COLORS.length]
                      )}
                    >
                      {isInActive ? (
                        <CheckCircle2 className="size-3" />
                      ) : null}
                      Bill {assignedTo + 1}
                    </span>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            setAssignments(
              lines.reduce(
                (acc, l) => ({ ...acc, [l.id]: -1 }),
                {} as Record<string, number>
              )
            )
          }
          className="mt-3 text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
        >
          Bỏ gán tất cả
        </button>
      </section>
    </>
  )
}
