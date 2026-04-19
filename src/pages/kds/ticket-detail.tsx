import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Ban, Check, Printer, RotateCcw, User } from "lucide-react"

import { SideRail } from "@/components/kds/side-rail"
import { StationTag } from "@/components/kds/station-tag"
import { TicketItemRow } from "@/components/kds/ticket-item-row"
import { TimerBadge } from "@/components/kds/timer-badge"
import { UnavailableSheet } from "@/components/kds/unavailable-sheet"
import { cn } from "@/lib/utils"
import { KDS_TICKETS } from "@/mocks/kds-tickets"

export function KdsTicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const base = KDS_TICKETS.find((t) => t.id === id) ?? KDS_TICKETS[0]
  const [items, setItems] = useState(base.items.map((i) => ({ ...i })))
  const [unavailableFor, setUnavailableFor] = useState<{
    id: string
    name: string
    emoji: string
  } | null>(null)

  const allDone = items.every((i) => i.prepDone || i.voided)
  const toggleItem = (itemId: string) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? { ...it, prepDone: !it.prepDone } : it
      )
    )

  const handleBumpAll = () => {
    navigate(`/kds/grid?station=${base.station}`)
  }

  return (
    <>
      <SideRail currentStation={base.station} />

      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/60 px-6 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-1.5 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            <ArrowLeft className="size-4" />
            Quay lại Grid
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1.5 text-sm font-semibold text-slate-300 hover:bg-slate-700"
          >
            <Printer className="size-4" />
            In giấy
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
              <div className="flex flex-col gap-2">
                <StationTag station={base.station} size="md" />
                <h1 className="text-3xl font-black text-white">
                  Ticket #{base.code}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
                  <span className="font-bold">
                    {base.tableName ? `Bàn ${base.tableName}` : "Mang đi"}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span>{base.customerName}</span>
                  <span className="text-slate-500">·</span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <User className="size-3.5" />
                    Waiter {base.waiterName}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Nhận lúc{" "}
                  {new Date(base.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Timer
                </div>
                <TimerBadge
                  startedAt={base.createdAt}
                  size="xl"
                  className="font-black"
                />
              </div>
            </div>

            {base.orderNote ? (
              <div className="rounded-xl bg-amber-500/10 p-4 ring-1 ring-amber-500/30">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  ⚠ Ghi chú đơn
                </div>
                <div className="mt-1 text-sm font-medium text-amber-100">
                  {base.orderNote}
                </div>
              </div>
            ) : null}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
                  Danh sách món ({items.filter((i) => !i.voided).length})
                </h2>
                <span className="text-xs text-slate-500">
                  Tick khi xong món
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((it) => (
                  <TicketItemRow
                    key={it.id}
                    item={it}
                    interactive
                    onToggle={() => toggleItem(it.id)}
                  />
                ))}
              </div>
            </div>

            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-4 ring-1",
                allDone
                  ? "bg-emerald-500/10 ring-emerald-500/40 text-emerald-200"
                  : "bg-slate-800/50 ring-slate-700 text-slate-400"
              )}
            >
              <span className="text-sm font-semibold">
                {allDone
                  ? "Tất cả đã xong — sẵn sàng bump"
                  : `Còn ${items.filter((i) => !i.prepDone && !i.voided).length} món chưa xong`}
              </span>
              <div className="flex gap-2">
                <span
                  className={cn(
                    "size-3 rounded-full",
                    items.filter((i) => i.prepDone).length >= 1
                      ? "bg-emerald-400"
                      : "bg-slate-700"
                  )}
                />
                <span
                  className={cn(
                    "size-3 rounded-full",
                    items.filter((i) => i.prepDone).length >= 2
                      ? "bg-emerald-400"
                      : "bg-slate-700"
                  )}
                />
                <span
                  className={cn(
                    "size-3 rounded-full",
                    allDone ? "bg-emerald-400" : "bg-slate-700"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <button
              type="button"
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 text-sm font-bold text-slate-200 hover:bg-slate-700"
            >
              <RotateCcw className="size-4" />
              Recall
            </button>
            <button
              type="button"
              onClick={() =>
                setUnavailableFor({
                  id: items[0].id,
                  name: items[0].name,
                  emoji: items[0].emoji,
                })
              }
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 text-sm font-bold text-amber-200 hover:bg-amber-500/20"
            >
              <Ban className="size-4" />
              Báo hết món
            </button>
            <button
              type="button"
              onClick={handleBumpAll}
              className={cn(
                "flex h-14 flex-[2] items-center justify-center gap-2 rounded-xl text-base font-black transition-colors",
                allDone
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  : "bg-emerald-500/60 text-slate-950/80 hover:bg-emerald-500"
              )}
            >
              <Check className="size-5" strokeWidth={3} />
              BUMP ALL
            </button>
          </div>
        </footer>

        <UnavailableSheet
          open={unavailableFor !== null}
          item={unavailableFor ?? undefined}
          onClose={() => setUnavailableFor(null)}
          onConfirm={() => setUnavailableFor(null)}
        />
      </main>
    </>
  )
}
