import { useEffect, useState } from "react"
import { Check, MoreVertical, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import type { KdsTicket } from "@/mocks/kds-tickets"

import { StationTag } from "./station-tag"
import { TicketItemRow } from "./ticket-item-row"
import { TimerBadge, getCardStyleByLevel, getTimerLevel } from "./timer-badge"

type Props = {
  ticket: KdsTicket
  onStart?: () => void
  onBump?: () => void
  onLongPress?: () => void
  onClick?: () => void
  hotkey?: number
}

export function TicketCard({
  ticket,
  onStart,
  onBump,
  onLongPress,
  onClick,
  hotkey,
}: Props) {
  const [minutes, setMinutes] = useState(0)

  useEffect(() => {
    const compute = () => {
      const elapsed = Date.now() - new Date(ticket.createdAt).getTime()
      setMinutes(Math.floor(elapsed / 60000))
    }
    compute()
    const id = window.setInterval(compute, 1000)
    return () => window.clearInterval(id)
  }, [ticket.createdAt])

  const level = getTimerLevel(minutes)
  const isCritical = level === "critical"

  const cardStyle = getCardStyleByLevel(level)

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border-2 transition-all",
        cardStyle
      )}
    >
      {hotkey !== undefined ? (
        <div className="absolute -top-1 -right-1 z-10 flex size-7 items-center justify-center rounded-bl-lg rounded-tr-xl bg-blue-500 text-sm font-black text-white shadow-lg">
          {hotkey}
        </div>
      ) : null}

      <header className="flex items-start justify-between gap-3 px-4 pt-3 pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <StationTag station={ticket.station} />
            <span className="font-mono text-sm font-bold text-slate-400">
              #{ticket.code}
            </span>
          </div>
          <div className="flex items-center gap-2 text-base">
            <span className="font-black text-white">
              {ticket.tableName ? `Bàn ${ticket.tableName}` : "Mang đi"}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">{ticket.customerName}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <TimerBadge startedAt={ticket.createdAt} size="lg" />
          {isCritical ? (
            <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-300">
              Quá hạn!
            </span>
          ) : null}
          <button
            type="button"
            onClick={onLongPress}
            aria-label="Thêm"
            className="flex size-7 items-center justify-center rounded-md text-slate-500 opacity-0 transition-opacity hover:bg-slate-700 hover:text-slate-300 group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </header>

      {ticket.orderNote ? (
        <div className="mx-4 mb-2 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-200 ring-1 ring-amber-500/20">
          ⚠ {ticket.orderNote}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onClick}
        className="flex-1 cursor-pointer divide-y divide-slate-700/50 px-4 text-left"
      >
        {ticket.items.map((it) => (
          <TicketItemRow key={it.id} item={it} compact />
        ))}
      </button>

      <footer className="mt-2 grid grid-cols-1 p-3">
        {ticket.status === "pending" ? (
          <button
            type="button"
            onClick={onStart}
            className={cn(
              "flex h-14 items-center justify-center gap-2 rounded-xl text-base font-black transition-colors",
              "bg-blue-500 text-white hover:bg-blue-400 active:scale-[0.98]"
            )}
          >
            <Play className="size-5" strokeWidth={3} />
            BẮT ĐẦU
          </button>
        ) : (
          <button
            type="button"
            onClick={onBump}
            className={cn(
              "flex h-14 items-center justify-center gap-2 rounded-xl text-base font-black transition-colors",
              isCritical
                ? "bg-rose-500 text-white hover:bg-rose-400"
                : level === "warn" || level === "danger"
                  ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                  : "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
              "active:scale-[0.98]"
            )}
          >
            <Check className="size-5" strokeWidth={3} />
            {isCritical ? "BUMP NOW!" : "BUMP"}
          </button>
        )}
      </footer>
    </article>
  )
}
