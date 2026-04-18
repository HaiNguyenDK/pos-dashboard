/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react"
import { Delete } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderCode: string
  subtotal: number
  tax: number
  total: number
  onConfirm: (method: PaymentMethod, amount: number) => void
}

type MethodOption = {
  id: PaymentMethod
  labelKey: string
  icon: React.ReactNode
}

function CashIcon() {
  return (
    <span className="text-3xl leading-none" aria-hidden="true">
      💵
    </span>
  )
}

function QrisIcon() {
  return (
    <svg viewBox="0 0 52 24" className="h-6 w-auto" aria-hidden="true">
      <g fill="currentColor">
        <path d="M2 4h3v3H2zM2 17h3v3H2zM47 4h3v3h-3z" />
      </g>
      <text
        x="26"
        y="17"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontWeight="800"
        fontSize="14"
        letterSpacing="0.5"
        fill="currentColor"
      >
        QRIS
      </text>
    </svg>
  )
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 52 32" className="h-8 w-auto" aria-hidden="true">
      <circle cx="20" cy="16" r="12" fill="#EB001B" />
      <circle cx="32" cy="16" r="12" fill="#F79E1B" fillOpacity="0.85" />
    </svg>
  )
}

const METHODS: MethodOption[] = [
  { id: "cash", labelKey: "order_payment.method_cash", icon: <CashIcon /> },
  { id: "qr", labelKey: "order_payment.method_qris", icon: <QrisIcon /> },
  { id: "card", labelKey: "order_payment.method_card", icon: <MastercardIcon /> },
]

const KEYS: (string | "backspace")[] = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  "00", "0", "backspace",
]

export function OrderPaymentDrawer({
  open,
  onOpenChange,
  orderCode,
  subtotal,
  tax,
  total,
  onConfirm,
}: Props) {
  const { t } = useTranslation()
  const totalCents = Math.round(total * 100)
  const [method, setMethod] = useState<PaymentMethod>("cash")
  const [amountCents, setAmountCents] = useState(totalCents)

  useEffect(() => {
    if (open) {
      setMethod("cash")
      setAmountCents(Math.round(total * 100))
    }
  }, [open, total])

  const displayAmount = useMemo(
    () => formatCurrency(amountCents / 100),
    [amountCents]
  )

  const handleKey = (key: string) => {
    if (key === "backspace") {
      setAmountCents((prev) => Math.floor(prev / 10))
      return
    }
    if (key === "00") {
      setAmountCents((prev) => prev * 100)
      return
    }
    const digit = parseInt(key, 10)
    if (Number.isNaN(digit)) return
    setAmountCents((prev) => prev * 10 + digit)
  }

  const canPay = amountCents >= totalCents && totalCents > 0

  const handlePayment = () => {
    if (!canPay) return
    onConfirm(method, amountCents / 100)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b p-6">
          <SheetTitle className="text-xl font-bold">
            {t("order_payment.title")}
          </SheetTitle>
          <p className="text-muted-foreground text-sm">
            {t("order_payment.order_number", { code: orderCode })}
          </p>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
          <div className="bg-muted/50 flex flex-col gap-3 rounded-2xl p-5">
            <Row label={t("order_payment.subtotal")} value={formatCurrency(subtotal)} />
            <Row label={t("order_payment.tax")} value={formatCurrency(tax)} />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-base font-semibold">
                {t("order_payment.total")}
              </span>
              <span className="text-2xl font-bold text-blue-600 tabular-nums">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-sm font-semibold">
              {t("order_payment.payment_method")}
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {METHODS.map((m) => {
                const selected = m.id === method
                return (
                  <div key={m.id} className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMethod(m.id)}
                      aria-pressed={selected}
                      className={cn(
                        "flex h-20 w-full items-center justify-center rounded-xl border-2 bg-white transition-colors",
                        selected
                          ? "border-blue-500"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      {m.icon}
                    </button>
                    <span className="text-foreground text-center text-xs font-medium">
                      {t(m.labelKey)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-sm font-semibold">
              {t("order_payment.input_amount")}
            </Label>
            <div className="border-input flex h-14 items-center justify-end rounded-2xl border px-5">
              <span className="text-2xl font-bold tabular-nums">
                {displayAmount}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {KEYS.map((key) => {
              const isBackspace = key === "backspace"
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKey(key)}
                  aria-label={isBackspace ? t("order_payment.backspace_aria") : key}
                  className={cn(
                    "flex h-12 items-center justify-center rounded-full text-lg font-semibold transition-colors",
                    isBackspace
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  )}
                >
                  {isBackspace ? <Delete className="size-5" /> : key}
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t p-6">
          <Button
            type="button"
            onClick={handlePayment}
            disabled={!canPay}
            className={cn(
              "h-12 w-full rounded-full bg-blue-600 text-base font-semibold text-white shadow-none",
              "hover:bg-blue-700 focus-visible:ring-blue-600",
              "disabled:opacity-60"
            )}
          >
            {t("order_payment.payment_button")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}
