import type { MenuItem } from "@/types"

import { formatCurrency } from "@/lib/format"
import { QtyControl } from "./qty-control"

type Props = {
  item: MenuItem
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

export function CartItemRow({ item, quantity, onIncrement, onDecrement }: Props) {
  const lineTotal = item.price * quantity

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-xl text-xl"
        style={{ backgroundImage: item.imageGradient }}
        aria-hidden="true"
      >
        {item.emoji}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="truncate text-sm font-medium">{item.name}</div>
        <QtyControl
          value={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          size="sm"
        />
      </div>
      <div className="text-sm font-semibold tabular-nums">
        {formatCurrency(lineTotal)}
      </div>
    </div>
  )
}
