import { useMemo, useState } from "react"
import { AlertTriangle, Search } from "lucide-react"

import { SideRail } from "@/components/kds/side-rail"
import { UnavailableSheet } from "@/components/kds/unavailable-sheet"
import { cn } from "@/lib/utils"
import { MENU_ITEMS } from "@/mocks/menu"

type Row = {
  id: string
  name: string
  emoji: string
  imageGradient: string
  made: number
  preparing: number
  remaining: number
  unavailable?: boolean
}

function generateRows(): Row[] {
  return MENU_ITEMS.slice(0, 18).map((m, idx) => {
    const rng = (idx * 7 + 13) % 100
    return {
      id: m.id,
      name: m.name,
      emoji: m.emoji,
      imageGradient: m.imageGradient,
      made: 10 + (rng % 40),
      preparing: rng % 5,
      remaining: Math.max(0, 80 - (rng % 60)),
      unavailable: idx === 3 || idx === 7,
    }
  })
}

export function KdsAllDayPage() {
  const [query, setQuery] = useState("")
  const [targetUnavailable, setTargetUnavailable] = useState<{
    id: string
    name: string
    emoji: string
  } | null>(null)

  const rows = useMemo(() => generateRows(), [])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => (q ? r.name.toLowerCase().includes(q) : true))
  }, [rows, query])

  const totalMade = rows.reduce((s, r) => s + r.made, 0)
  const totalPreparing = rows.reduce((s, r) => s + r.preparing, 0)
  const lowStock = rows.filter((r) => r.remaining < 10 && !r.unavailable).length

  return (
    <>
      <SideRail />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧾</span>
            <div>
              <div className="text-lg font-black text-white">
                All-day Summary
              </div>
              <div className="text-[11px] text-slate-400">
                Hôm nay, 17/04/2026 · real-time
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Stat label="Đã làm" value={totalMade} tone="emerald" />
            <Stat label="Đang nấu" value={totalPreparing} tone="blue" />
            <Stat label="Low stock" value={lowStock} tone="amber" />
          </div>
        </header>

        <div className="border-b border-slate-800 bg-slate-900/40 px-6 py-3">
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm món..."
              className="h-10 w-full rounded-full border border-slate-700 bg-slate-800 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur">
              <tr className="text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3">Món</th>
                <th className="px-3 py-3 text-right">Đã làm</th>
                <th className="px-3 py-3 text-right">Đang nấu</th>
                <th className="px-3 py-3 text-right">Còn lại</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((r) => {
                const low = r.remaining < 10 && !r.unavailable
                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "text-sm transition-colors hover:bg-slate-800/40",
                      r.unavailable && "opacity-60"
                    )}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-10 items-center justify-center rounded-lg text-xl"
                          style={{ backgroundImage: r.imageGradient }}
                        >
                          {r.emoji}
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {r.name}
                            {r.unavailable ? (
                              <span className="ml-2 rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-black text-rose-300">
                                🚫 HẾT
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-emerald-300 tabular-nums">
                      {r.made}
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-blue-300 tabular-nums">
                      {r.preparing}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-3 text-right font-bold tabular-nums",
                        r.unavailable
                          ? "text-slate-500"
                          : low
                            ? "text-amber-300"
                            : "text-slate-300"
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {low ? (
                          <AlertTriangle className="size-3.5 text-amber-400" />
                        ) : null}
                        {r.remaining}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {r.unavailable ? (
                        <button
                          type="button"
                          className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
                        >
                          Khôi phục
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setTargetUnavailable({
                              id: r.id,
                              name: r.name,
                              emoji: r.emoji,
                            })
                          }
                          className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20"
                        >
                          🚫 Báo hết
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <UnavailableSheet
          open={targetUnavailable !== null}
          item={targetUnavailable ?? undefined}
          onClose={() => setTargetUnavailable(null)}
          onConfirm={() => setTargetUnavailable(null)}
        />
      </main>
    </>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "emerald" | "blue" | "amber"
}) {
  const color =
    tone === "emerald"
      ? "text-emerald-300 bg-emerald-500/10"
      : tone === "blue"
        ? "text-blue-300 bg-blue-500/10"
        : "text-amber-300 bg-amber-500/10"
  return (
    <div className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5", color)}>
      <span className="text-xs font-semibold opacity-80">{label}</span>
      <span className="text-base font-black tabular-nums">{value}</span>
    </div>
  )
}
