import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import type { MenuItem } from "@/types"

type Size = "small" | "medium" | "large"
type Spice = "none" | "mild" | "hot"

type Props = {
  item: MenuItem | null
  open: boolean
  onClose: () => void
  onAdd: (payload: { quantity: number; size: Size; spice: Spice; toppings: string[]; note: string }) => void
}

const SIZE_DELTA: Record<Size, number> = {
  small: 0,
  medium: 0,
  large: 10,
}

const TOPPINGS = [
  { id: "egg", label: "Thêm trứng", price: 5 },
  { id: "cheese", label: "Phô mai", price: 8 },
  { id: "veg", label: "Thêm rau", price: 2 },
]

export function ModifierSheet({ item, open, onClose, onAdd }: Props) {
  const [size, setSize] = useState<Size>("medium")
  const [spice, setSpice] = useState<Spice>("mild")
  const [toppings, setToppings] = useState<string[]>([])
  const [note, setNote] = useState("")
  const [qty, setQty] = useState(1)

  if (!open || !item) return null

  const toppingTotal = toppings.reduce(
    (sum, id) => sum + (TOPPINGS.find((t) => t.id === id)?.price ?? 0),
    0
  )
  const unit = item.price + SIZE_DELTA[size] + toppingTotal
  const total = unit * qty

  const toggleTopping = (id: string) =>
    setToppings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const handleAdd = () => {
    onAdd({ quantity: qty, size, spice, toppings, note })
    setSize("medium")
    setSpice("mild")
    setToppings([])
    setNote("")
    setQty(1)
  }

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[88%] w-full flex-col rounded-t-3xl bg-white shadow-xl">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" />
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="flex size-14 items-center justify-center rounded-xl text-2xl"
              style={{ backgroundImage: item.imageGradient }}
              aria-hidden="true"
            >
              {item.emoji}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
              <div className="text-sm font-semibold text-blue-600 tabular-nums">
                {formatCurrency(item.price)}
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

        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <Section title="Kích cỡ" required>
            <div className="grid grid-cols-3 gap-2">
              {(["small", "medium", "large"] as const).map((s) => (
                <OptionButton
                  key={s}
                  active={size === s}
                  onClick={() => setSize(s)}
                >
                  <span className="font-medium">
                    {s === "small" ? "Nhỏ" : s === "medium" ? "Vừa" : "Lớn"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    +{SIZE_DELTA[s] === 0 ? "0" : formatCurrency(SIZE_DELTA[s])}
                  </span>
                </OptionButton>
              ))}
            </div>
          </Section>

          <Section title="Độ cay">
            <div className="grid grid-cols-3 gap-2">
              {(["none", "mild", "hot"] as const).map((s) => (
                <OptionButton
                  key={s}
                  active={spice === s}
                  onClick={() => setSpice(s)}
                >
                  <span>{s === "none" ? "Không cay" : s === "mild" ? "Vừa" : "Rất cay"}</span>
                </OptionButton>
              ))}
            </div>
          </Section>

          <Section title="Topping">
            <div className="flex flex-col gap-2">
              {TOPPINGS.map((t) => {
                const active = toppings.includes(t.id)
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTopping(t.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2.5 transition-colors",
                      active
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-md border-2 transition-colors",
                          active
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        )}
                      >
                        {active ? "✓" : null}
                      </span>
                      <span className="text-sm font-medium">{t.label}</span>
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums">
                      +{formatCurrency(t.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section title="Ghi chú">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Ví dụ: không hành, nước riêng"
              className="w-full resize-none rounded-xl bg-slate-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Section>

          <Section title="Số lượng">
            <div className="inline-flex items-center gap-4 rounded-full border px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-lg font-bold active:scale-95"
              >
                −
              </button>
              <span className="w-6 text-center text-base font-bold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white active:scale-95"
              >
                +
              </button>
            </div>
          </Section>
        </div>

        <div className="border-t bg-white p-4 pb-6">
          <Button
            onClick={handleAdd}
            className={cn(
              "h-12 w-full rounded-full bg-blue-600 text-base font-bold text-white shadow-none",
              "hover:bg-blue-700"
            )}
          >
            Thêm vào đơn — {formatCurrency(total)}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  required,
  children,
}: {
  title: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 py-2.5">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        {required ? (
          <span className="text-[10px] font-semibold text-rose-500">BẮT BUỘC</span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

function OptionButton({
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
        "flex flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2.5 text-sm transition-all",
        active
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-700"
      )}
    >
      {children}
    </button>
  )
}
