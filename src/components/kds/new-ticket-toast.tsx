import { useEffect } from "react"
import { BellRing, X } from "lucide-react"

import { StationTag } from "./station-tag"
import type { KdsTicket } from "@/mocks/kds-tickets"

type Props = {
  ticket: KdsTicket | null
  onClose: () => void
}

export function NewTicketToast({ ticket, onClose }: Props) {
  useEffect(() => {
    if (!ticket) return
    const id = window.setTimeout(onClose, 5000)
    return () => window.clearTimeout(id)
  }, [ticket, onClose])

  if (!ticket) return null
  const itemsCount = ticket.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="pointer-events-none absolute top-4 right-4 z-40 animate-in slide-in-from-top duration-300">
      <div className="pointer-events-auto flex w-80 items-start gap-3 rounded-2xl border-2 border-blue-500 bg-slate-900/95 p-3 shadow-2xl shadow-blue-500/20 backdrop-blur">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
          <BellRing className="size-5 text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Ticket mới
            </span>
            <StationTag station={ticket.station} />
          </div>
          <div className="mt-0.5 font-bold text-white">
            #{ticket.code} · {ticket.tableName ? `Bàn ${ticket.tableName}` : "Mang đi"}
          </div>
          <div className="text-xs text-slate-400">
            {itemsCount} món · {ticket.customerName}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="flex size-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
