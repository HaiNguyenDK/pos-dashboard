import { AlertTriangle, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import type { KdsItem } from "@/mocks/kds-tickets"

type Props = {
  item: KdsItem
  onToggle?: () => void
  interactive?: boolean
  compact?: boolean
}

export function TicketItemRow({
  item,
  onToggle,
  interactive,
  compact,
}: Props) {
  const done = item.prepDone
  const voided = item.voided
  const content = (
    <>
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg text-xl",
          done ? "bg-emerald-500/20" : "bg-slate-700/60",
          voided && "opacity-40"
        )}
      >
        {done ? (
          <Check className="size-5 text-emerald-400" strokeWidth={3} />
        ) : (
          <span aria-hidden="true">{item.emoji}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "shrink-0 font-black tabular-nums text-white",
              compact ? "text-xl" : "text-2xl",
              voided && "line-through decoration-rose-500 decoration-2 opacity-50"
            )}
          >
            ×{item.quantity}
          </span>
          <span
            className={cn(
              "min-w-0 truncate font-bold text-white",
              compact ? "text-base" : "text-lg",
              done && "line-through opacity-60",
              voided && "line-through decoration-rose-500 decoration-2 opacity-50"
            )}
          >
            {item.name}
          </span>
        </div>
        {item.modifiers.length > 0 ? (
          <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-sm text-slate-400">
            {item.modifiers.map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span className="size-1 rounded-full bg-slate-500" />
                {m}
              </span>
            ))}
          </div>
        ) : null}
        {item.note ? (
          <div
            className={cn(
              "mt-1 flex items-start gap-1.5 rounded-md px-2 py-1 text-[13px] italic",
              item.urgent
                ? "bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/30"
                : "bg-blue-500/10 text-blue-200"
            )}
          >
            {item.urgent ? (
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            ) : (
              <span aria-hidden="true">📝</span>
            )}
            <span className="font-medium">{item.note}</span>
          </div>
        ) : null}
      </div>
    </>
  )

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={voided}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
          done
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-slate-700/60 bg-slate-900/40 hover:bg-slate-800/60"
        )}
      >
        {content}
      </button>
    )
  }

  return <div className="flex items-start gap-3 py-2">{content}</div>
}
