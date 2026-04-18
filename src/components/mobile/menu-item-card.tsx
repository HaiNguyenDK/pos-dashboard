import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import type { MenuItem } from "@/types"

type Props = {
  item: MenuItem
  quantity?: number
  onClick?: () => void
  onQuickAdd?: () => void
}

export function MenuItemCard({ item, quantity = 0, onClick, onQuickAdd }: Props) {
  const soldOut = item.available === 0
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={soldOut}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border bg-white text-left transition-all",
        "hover:border-blue-300 active:scale-[0.98]",
        "disabled:opacity-60"
      )}
    >
      <div
        className="relative flex h-24 shrink-0 items-center justify-center text-4xl"
        style={{ backgroundImage: item.imageGradient }}
        aria-hidden="true"
      >
        {item.emoji}
        {quantity > 0 ? (
          <span className="absolute top-1.5 left-1.5 flex size-6 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600 shadow-sm ring-2 ring-blue-500">
            {quantity}
          </span>
        ) : null}
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-xs font-semibold text-white">
            Hết hàng
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-2.5">
        <h3 className="line-clamp-1 text-[13px] font-semibold text-slate-900">
          {item.name}
        </h3>
        <div className="text-[10px] text-slate-500">
          Còn {item.available} · Đã bán {item.sold}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-blue-600 tabular-nums">
            {formatCurrency(item.price)}
          </span>
          {onQuickAdd && !soldOut ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                onQuickAdd()
              }}
              className={cn(
                "flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm",
                "active:scale-95 transition-transform"
              )}
            >
              <Plus className="size-4" strokeWidth={3} />
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}
