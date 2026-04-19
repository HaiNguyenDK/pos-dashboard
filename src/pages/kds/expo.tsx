import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"

import { SideRail } from "@/components/kds/side-rail"
import { StationTag } from "@/components/kds/station-tag"
import { TimerBadge } from "@/components/kds/timer-badge"
import { cn } from "@/lib/utils"
import { KDS_TICKETS, STATIONS, type KdsTicket } from "@/mocks/kds-tickets"

type OrderGroup = {
  orderId: string
  code: string
  tableName?: string
  customerName: string
  createdAt: string
  tickets: KdsTicket[]
}

export function KdsExpoPage() {
  const [tickets, setTickets] = useState(KDS_TICKETS)

  const groups: OrderGroup[] = useMemo(() => {
    const map = new Map<string, OrderGroup>()
    for (const t of tickets) {
      if (!map.has(t.orderId)) {
        map.set(t.orderId, {
          orderId: t.orderId,
          code: t.code,
          tableName: t.tableName,
          customerName: t.customerName,
          createdAt: t.createdAt,
          tickets: [],
        })
      }
      map.get(t.orderId)!.tickets.push(t)
    }
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [tickets])

  const serve = (group: OrderGroup) => {
    setTickets((prev) => prev.filter((t) => t.orderId !== group.orderId))
  }

  return (
    <>
      <SideRail />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👁️</span>
            <div>
              <div className="text-lg font-black text-white">Expo View</div>
              <div className="text-[11px] text-slate-400">
                Điều phối giữa các station · {groups.length} đơn active
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-300">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Live
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 md:grid-cols-2">
            {groups.map((g) => {
              const allReady = g.tickets.every((t) => t.status === "ready")
              const anyPending = g.tickets.some((t) => t.status === "pending")
              return (
                <article
                  key={g.orderId}
                  className={cn(
                    "flex flex-col overflow-hidden rounded-2xl border-2",
                    allReady
                      ? "border-emerald-500 bg-emerald-500/5"
                      : anyPending
                        ? "border-amber-500/40 bg-slate-800/50"
                        : "border-slate-700 bg-slate-800/50"
                  )}
                >
                  <header className="flex items-start justify-between gap-3 border-b border-slate-700 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          #{g.code}
                        </span>
                        <span className="text-sm font-bold text-slate-200">
                          {g.tableName ? `Bàn ${g.tableName}` : "Mang đi"}
                        </span>
                        <span className="text-xs text-slate-500">
                          · {g.customerName}
                        </span>
                      </div>
                    </div>
                    <TimerBadge startedAt={g.createdAt} />
                  </header>

                  <div className="divide-y divide-slate-700/50 p-4">
                    {g.tickets.map((t) => {
                      const statusClass =
                        t.status === "ready"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : t.status === "preparing"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-slate-700 text-slate-400"
                      const statusLabel =
                        t.status === "ready"
                          ? "✓ Ready"
                          : t.status === "preparing"
                            ? "● Đang nấu"
                            : "○ Chờ"
                      return (
                        <div
                          key={t.id}
                          className="flex items-center gap-3 py-2"
                        >
                          <StationTag station={t.station} />
                          <div className="min-w-0 flex-1 text-sm">
                            {t.items.map((it, i) => (
                              <span key={i} className="mr-2 text-slate-200">
                                <b>×{it.quantity}</b> {it.name}
                              </span>
                            ))}
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                              statusClass
                            )}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <footer className="border-t border-slate-700 p-3">
                    <button
                      type="button"
                      onClick={() => allReady && serve(g)}
                      disabled={!allReady}
                      className={cn(
                        "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition-colors",
                        allReady
                          ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-[0.98]"
                          : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                      )}
                    >
                      {allReady ? (
                        <>
                          Expo — Serve #{g.code}
                          <ArrowRight className="size-4" />
                        </>
                      ) : (
                        <>
                          Đang chờ{" "}
                          {
                            g.tickets.filter((t) => t.status !== "ready").length
                          }{" "}
                          station
                        </>
                      )}
                    </button>
                  </footer>
                </article>
              )
            })}
          </div>

          {groups.length === 0 ? (
            <div className="mt-20 text-center">
              <div className="text-6xl opacity-30">🍽️</div>
              <h3 className="mt-3 text-xl font-black text-white">
                Không có đơn nào đang xử lý
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Mọi ticket đã được serve.
              </p>
            </div>
          ) : null}
        </div>

        <footer className="border-t border-slate-800 bg-slate-900/60 px-6 py-2 text-xs text-slate-400 backdrop-blur">
          Expo = điều phối · Đơn chỉ Serve được khi tất cả station bump xong. Các
          station: {STATIONS.map((s) => `${s.icon} ${s.label}`).join(" · ")}
        </footer>
      </main>
    </>
  )
}
