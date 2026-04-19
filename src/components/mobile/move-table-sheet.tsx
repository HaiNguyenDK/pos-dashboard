import { useMemo, useState } from "react"
import { ArrowRight, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { TABLES } from "@/mocks/tables"
import type { DiningTable } from "@/types"

type Props = {
  open: boolean
  currentTableName?: string
  onClose: () => void
  onConfirm: (destinationTableId: string, reason: string) => void
}

const ZONES = ["A", "B", "C"] as const

export function MoveTableSheet({
  open,
  currentTableName,
  onClose,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [reason, setReason] = useState("")

  const byZone = useMemo(() => {
    const map = new Map<string, DiningTable[]>()
    for (const z of ZONES) map.set(z, [])
    for (const t of TABLES) {
      if (t.name === currentTableName) continue
      map.get(t.zone)?.push(t)
    }
    return map
  }, [currentTableName])

  if (!open) return null

  const destTable = TABLES.find((t) => t.id === selected)

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[92%] w-full flex-col rounded-t-3xl bg-white shadow-xl">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" />
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <div className="text-base font-black text-slate-900">
              Chuyển bàn
            </div>
            <div className="text-[11px] text-slate-500">
              Từ{" "}
              <span className="font-semibold text-slate-900">
                Bàn {currentTableName ?? "—"}
              </span>{" "}
              → chọn bàn đích
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex size-9 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {ZONES.map((zone) => {
            const tables = byZone.get(zone) ?? []
            if (tables.length === 0) return null
            return (
              <section key={zone} className="mb-4">
                <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Zone {zone}
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {tables.map((t) => {
                    const active = selected === t.id
                    const disabled =
                      t.status !== "available" && t.status !== "reserved"
                    return (
                      <button
                        key={t.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelected(t.id)}
                        className={cn(
                          "relative flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 transition-all",
                          active
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-slate-200 bg-white",
                          disabled && "opacity-40"
                        )}
                      >
                        <span className="text-sm font-black text-slate-900">
                          {t.name}
                        </span>
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase",
                            t.status === "available"
                              ? "text-emerald-600"
                              : t.status === "reserved"
                                ? "text-amber-600"
                                : "text-rose-600"
                          )}
                        >
                          {t.status === "available"
                            ? "Trống"
                            : t.status === "reserved"
                              ? "Đặt trước"
                              : "Đang dùng"}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}

          <section className="mt-3">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Lý do (tuỳ chọn)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vd: Khách muốn bàn cạnh cửa sổ"
              className="h-11 w-full rounded-xl bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>
        </div>

        {destTable ? (
          <div className="mx-4 mb-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm">
            <span className="font-semibold">{currentTableName ?? "—"}</span>
            <ArrowRight className="size-4 text-blue-600" />
            <span className="font-bold text-blue-700">{destTable.name}</span>
            <span className="ml-auto text-xs text-blue-600/80">
              Zone {destTable.zone} · {destTable.seats} chỗ
            </span>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 border-t p-4 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Huỷ
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onConfirm(selected, reason)}
            className={cn(
              "h-12 rounded-full text-sm font-bold shadow-none",
              selected
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-100 text-slate-400"
            )}
          >
            Xác nhận chuyển bàn
          </button>
        </div>
      </div>
    </div>
  )
}
