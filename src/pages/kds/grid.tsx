import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowUpDown, RotateCcw, Volume2, VolumeX } from "lucide-react"

import { SideRail } from "@/components/kds/side-rail"
import { TicketCard } from "@/components/kds/ticket-card"
import { NewTicketToast } from "@/components/kds/new-ticket-toast"
import { UnavailableSheet } from "@/components/kds/unavailable-sheet"
import { cn } from "@/lib/utils"
import {
  KDS_TICKETS,
  STATIONS,
  type KdsStation,
  type KdsTicket,
} from "@/mocks/kds-tickets"

type SortMode = "oldest" | "newest"

export function KdsGridPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const stationParam = (searchParams.get("station") ?? "grill") as KdsStation
  const [tickets, setTickets] = useState<KdsTicket[]>(KDS_TICKETS)
  const [soundOn, setSoundOn] = useState(true)
  const [sortMode, setSortMode] = useState<SortMode>("oldest")
  const [unavailableFor, setUnavailableFor] = useState<{
    id: string
    name: string
    emoji: string
  } | null>(null)
  const [recall, setRecall] = useState<KdsTicket | null>(null)
  const [demoToast, setDemoToast] = useState<KdsTicket | null>(null)

  const stationInfo = STATIONS.find((s) => s.id === stationParam) ?? STATIONS[0]

  const filtered = useMemo(() => {
    const list = tickets.filter(
      (t) => t.station === stationParam && t.status !== "ready"
    )
    return list.sort((a, b) => {
      const aT = new Date(a.createdAt).getTime()
      const bT = new Date(b.createdAt).getTime()
      return sortMode === "oldest" ? aT - bT : bT - aT
    })
  }, [tickets, stationParam, sortMode])

  const countByStation = useMemo(() => {
    const map = new Map<KdsStation, number>()
    for (const s of STATIONS) map.set(s.id, 0)
    for (const t of tickets) {
      if (t.status === "ready") continue
      map.set(t.station, (map.get(t.station) ?? 0) + 1)
    }
    return map
  }, [tickets])

  const handleStart = (ticket: KdsTicket) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id
          ? { ...t, status: "preparing", startedAt: new Date().toISOString() }
          : t
      )
    )
  }

  const handleBump = (ticket: KdsTicket) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticket.id))
    setRecall(ticket)
    window.setTimeout(() => setRecall(null), 30000)
  }

  const handleRecall = () => {
    if (!recall) return
    setTickets((prev) => [recall, ...prev])
    setRecall(null)
  }

  const switchStation = (s: KdsStation) => {
    setSearchParams({ station: s })
  }

  const simulateNew = () => {
    const demo: KdsTicket = {
      id: `kt-demo-${Date.now()}`,
      code: String(1250 + Math.floor(Math.random() * 99)),
      orderId: "demo",
      tableName: ["A1", "A2", "B3", "C1"][Math.floor(Math.random() * 4)],
      customerName: "Demo Khách",
      mode: "dine-in",
      station: stationParam,
      status: "pending",
      waiterName: "Demo",
      createdAt: new Date().toISOString(),
      items: [
        {
          id: "d1",
          name: "Eggs Benedict",
          emoji: "🍳",
          quantity: 1,
          modifiers: ["Medium"],
        },
      ],
    }
    setTickets((prev) => [demo, ...prev])
    setDemoToast(demo)
  }

  return (
    <>
      <SideRail
        currentStation={stationParam}
        onStationChange={switchStation}
        online
      />

      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/60 px-6 py-3 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stationInfo.icon}</span>
              <div>
                <div className="text-lg font-black text-white">
                  {stationInfo.label} Station
                </div>
                <div className="text-[11px] text-slate-400">
                  {stationInfo.location} · {filtered.length} ticket active
                </div>
              </div>
            </div>

            <div className="ml-4 hidden gap-1.5 md:flex">
              {STATIONS.map((s) => {
                const count = countByStation.get(s.id) ?? 0
                const active = s.id === stationParam
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => switchStation(s.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
                      active
                        ? "border-blue-500 bg-blue-500/10 text-blue-300"
                        : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                    )}
                  >
                    <span>{s.icon}</span>
                    {s.label}
                    <span
                      className={cn(
                        "ml-0.5 rounded-full px-1.5 text-[10px]",
                        active
                          ? "bg-blue-500 text-white"
                          : "bg-slate-800 text-slate-400"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSortMode((m) => (m === "oldest" ? "newest" : "oldest"))
              }
              className="flex h-10 items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-3 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <ArrowUpDown className="size-3.5" />
              {sortMode === "oldest" ? "Cũ nhất trước" : "Mới nhất trước"}
            </button>
            <button
              type="button"
              onClick={() => setSoundOn((v) => !v)}
              aria-label="Toggle sound"
              className={cn(
                "flex size-10 items-center justify-center rounded-full border",
                soundOn
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 bg-slate-800/50 text-slate-500"
              )}
            >
              {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>
            <button
              type="button"
              onClick={simulateNew}
              className="flex h-10 items-center gap-2 rounded-full bg-blue-500 px-4 text-xs font-black text-white hover:bg-blue-400"
            >
              Mô phỏng ticket mới
            </button>
          </div>
        </header>

        {recall ? (
          <div className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="size-4 text-amber-300" />
                <span className="text-amber-200">
                  Vừa bump <b>#{recall.code}</b> ·{" "}
                  <span className="text-amber-300">
                    Có thể recall trong 30 giây
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleRecall}
                className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-black text-slate-950 hover:bg-amber-400"
              >
                Recall
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <EmptyState station={stationInfo.label} />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((t, idx) => (
                <TicketCard
                  key={t.id}
                  ticket={t}
                  hotkey={idx < 8 ? idx + 1 : undefined}
                  onStart={() => handleStart(t)}
                  onBump={() => handleBump(t)}
                  onClick={() => navigate(`/kds/ticket/${t.id}`)}
                  onLongPress={() =>
                    setUnavailableFor({
                      id: t.items[0].id,
                      name: t.items[0].name,
                      emoji: t.items[0].emoji,
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>

        <NewTicketToast ticket={demoToast} onClose={() => setDemoToast(null)} />

        <UnavailableSheet
          open={unavailableFor !== null}
          item={unavailableFor ?? undefined}
          onClose={() => setUnavailableFor(null)}
          onConfirm={() => {
            setUnavailableFor(null)
          }}
        />
      </main>
    </>
  )
}

function EmptyState({ station }: { station: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="text-6xl opacity-30">🍽️</div>
      <h3 className="text-xl font-black text-white">Không có ticket nào</h3>
      <p className="text-sm text-slate-400">
        {station} station đang rảnh rỗi. Ticket mới sẽ hiện ở đây ngay khi
        waiter gửi bếp.
      </p>
    </div>
  )
}
