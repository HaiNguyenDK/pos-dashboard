import { useState } from "react"
import { ChevronRight, SquarePen } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { MenuItem, ServiceMode } from "@/types"
import { AddNoteDialog } from "./add-note-dialog"
import { CartItemRow } from "./cart-item-row"

type CartLine = {
  item: MenuItem
  quantity: number
}

type Props = {
  mode: ServiceMode
  onModeChange: (mode: ServiceMode) => void
  customerName: string
  onCustomerNameChange: (name: string) => void
  tables: string[]
  onSelectTable: () => void
  note: string
  onNoteChange: (note: string) => void
  lines: CartLine[]
  onIncrement: (menuItemId: string) => void
  onDecrement: (menuItemId: string) => void
  onProcess: () => void
}

const TAX_RATE = 0.1

export function CartPanel({
  mode,
  onModeChange,
  customerName,
  onCustomerNameChange,
  tables,
  onSelectTable,
  note,
  onNoteChange,
  lines,
  onIncrement,
  onDecrement,
  onProcess,
}: Props) {
  const { t } = useTranslation()
  const [noteOpen, setNoteOpen] = useState(false)
  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const hasItems = lines.length > 0

  return (
    <aside className="bg-background flex h-full flex-col rounded-2xl border shadow-sm">
      <div className="flex flex-col gap-5 p-6">
        <div role="tablist" className="bg-muted flex rounded-full p-1">
          {(["dine-in", "take-away"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => onModeChange(m)}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all",
                mode === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              {m === "dine-in" ? t("cart.mode_dine_in") : t("cart.mode_take_away")}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">{t("cart.customer_info_heading")}</h3>
          <Input
            placeholder={t("cart.customer_name_placeholder")}
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className="h-11 rounded-xl"
          />
          <button
            type="button"
            onClick={onSelectTable}
            className="border-input bg-background flex h-11 items-center justify-between rounded-xl border px-3 text-sm transition-colors hover:bg-accent/40"
          >
            <span
              className={cn(
                tables.length > 0 ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {tables.length > 0 ? tables.join(", ") : t("cart.select_table")}
            </span>
            <ChevronRight className="text-muted-foreground size-4" />
          </button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setNoteOpen(true)}
            className="h-11 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <SquarePen className="mr-2 size-4" />
            {note ? t("cart.edit_note") : t("cart.add_note")}
          </Button>
        </div>
      </div>

      <AddNoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        note={note}
        onSave={onNoteChange}
      />

      <div className="border-t" />

      <div className="flex min-h-0 flex-1 flex-col px-6 pt-4">
        <h3 className="text-lg font-semibold">{t("cart.order_details_heading")}</h3>
        <div className="-mx-1 flex-1 overflow-y-auto px-1">
          {hasItems ? (
            <div className="divide-y">
              {lines.map((line) => (
                <CartItemRow
                  key={line.item.id}
                  item={line.item}
                  quantity={line.quantity}
                  onIncrement={() => onIncrement(line.item.id)}
                  onDecrement={() => onDecrement(line.item.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              {t("cart.no_items")}
            </p>
          )}
        </div>
      </div>

      <div className="border-t bg-background/60 backdrop-blur flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span className="font-medium tabular-nums">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("cart.tax")}</span>
          <span className="font-medium tabular-nums">{formatCurrency(tax)}</span>
        </div>
        <div className="border-dashed border-t my-1" />
        <div className="flex items-baseline justify-between">
          <span className="text-base font-semibold">{t("cart.total")}</span>
          <span className="text-xl font-bold text-emerald-600 tabular-nums">
            {formatCurrency(total)}
          </span>
        </div>
        <Button
          type="button"
          onClick={onProcess}
          disabled={!hasItems}
          className={cn(
            "mt-1 h-11 rounded-full bg-blue-600 text-sm font-semibold text-white shadow-none",
            "hover:bg-blue-700 focus-visible:ring-blue-600",
            "disabled:opacity-60"
          )}
        >
          {t("cart.process_button")}
        </Button>
      </div>
    </aside>
  )
}
