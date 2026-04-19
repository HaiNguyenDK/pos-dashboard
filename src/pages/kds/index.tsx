import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Eye } from "lucide-react"

import { cn } from "@/lib/utils"
import { STATIONS, type KdsStation } from "@/mocks/kds-tickets"

export function KdsStationPickerPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<KdsStation | "expo" | null>(null)
  const [pin, setPin] = useState("")

  const go = () => {
    if (!selected) return
    if (selected === "expo") {
      navigate("/kds/expo")
    } else {
      navigate(`/kds/grid?station=${selected}`)
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8">
      <div className="flex w-full max-w-4xl flex-col gap-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/30">
            <span className="text-2xl font-black text-white">K</span>
          </div>
          <h1 className="text-3xl font-black text-white">Kopag KDS</h1>
          <p className="mt-2 text-sm text-slate-400">
            Chọn station cho thiết bị này — chỉ cần thiết lập 1 lần
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STATIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelected(s.id)}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-2xl border-2 bg-slate-900/60 p-6 transition-all",
                selected === s.id
                  ? "border-blue-500 shadow-xl shadow-blue-500/20"
                  : "border-slate-800 hover:border-slate-600"
              )}
            >
              <span className="text-5xl">{s.icon}</span>
              <span className="text-lg font-black text-white">{s.label}</span>
              <span className="text-xs text-slate-400">{s.location}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setSelected("expo")}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-2xl border-2 bg-slate-900/60 p-6 transition-all",
              selected === "expo"
                ? "border-blue-500 shadow-xl shadow-blue-500/20"
                : "border-slate-800 hover:border-slate-600"
            )}
          >
            <Eye className="size-10 text-blue-400" />
            <span className="text-lg font-black text-white">Expo</span>
            <span className="text-xs text-slate-400">Điều phối</span>
          </button>
        </div>

        {selected ? (
          <div className="flex flex-col items-center gap-3">
            <div className="text-sm font-medium text-slate-400">
              Nhập PIN supervisor để tiếp tục
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex size-12 items-center justify-center rounded-lg border-2 text-xl font-bold text-white tabular-nums",
                    i < pin.length
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-slate-700 bg-slate-900"
                  )}
                >
                  {i < pin.length ? "●" : ""}
                </div>
              ))}
            </div>
            <input
              type="password"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value.slice(0, 6))}
              className="sr-only"
            />
            <button
              type="button"
              onClick={go}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-black text-white hover:bg-blue-400 active:scale-[0.98]"
            >
              Vào KDS
              <ArrowRight className="size-4" />
            </button>
            <p className="text-[11px] text-slate-500">
              Demo: PIN bất kỳ 6 chữ số. Hoặc nhấn <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">Vào KDS</kbd> để bỏ qua.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
