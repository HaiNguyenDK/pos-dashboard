import { useMemo, useState } from "react"
import { Combine, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { TABLES } from "@/mocks/tables"
import type { DiningTable } from "@/types"

type Props = {
  open: boolean
  primaryTableName?: string
  onClose: () => void
  onConfirm: (tableIds: string[]) => void
}

const ZONES = ["A", "B", "C"] as const

export function MergeTablesSheet({
  open,
  primaryTableName,
  onClose,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<string[]>([])

  const byZone = useMemo(() => {
    const map = new Map<string, DiningTable[]>()
    for (const z of ZONES) map.set(z, [])
    for (const t of TABLES) {
      if (t.name === primaryTableName) continue
      map.get(t.zone)?.push(t)
    }
    return map
  }, [primaryTableName])

  if (!open) return null

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const pickedTables = selected
    .map((id) => TABLES.find((t) => t.id === id))
    .filter((t): t is DiningTable => !!t)
  const totalSeats =
    (TABLES.find((t) => t.name === primaryTableName)?.seats ?? 0) +
    pickedTables.reduce((s, t) => s + t.seats, 0)

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[92%] w-full flex-col rounded-t-3xl bg-white shadow-xl">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" />
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2">
            <Combine className="size-5 text-violet-600" />
            <div>
              <div className="text-base font-black text-slate-900">
                Ghép bàn
              </div>
              <div className="text-[11px] text-slate-500">
                Chọn bàn phụ để gộp vào{" "}
                <span className="font-semibold text-slate-900">
                  Bàn {primaryTableName ?? "—"}
                </span>
              </div>
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
                    const active = selected.includes(t.id)
                    const disabled = t.status === "occupied"
                    return (
                      <button
                        key={t.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => toggle(t.id)}
                        className={cn(
                          "relative flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 transition-all",
                          active
                            ? "border-violet-500 bg-violet-50 shadow-sm"
                            : "border-slate-200 bg-white",
                          disabled && "opacity-40"
                        )}
                      >
                        {active ? (
                          <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-black text-white">
                            ✓
                          </span>
                        ) : null}
                        <span className="text-sm font-black text-slate-900">
                          {t.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {t.seats} chỗ
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        {selected.length > 0 ? (
          <div className="mx-4 mb-3 rounded-xl bg-violet-50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-md bg-violet-600 px-2 py-0.5 text-xs font-black text-white">
                Bàn {primaryTableName}
              </span>
              {pickedTables.map((t) => (
                <span
                  key={t.id}
                  className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-violet-700 ring-1 ring-violet-200"
                >
                  + {t.name}
                </span>
              ))}
            </div>
            <div className="mt-1.5 text-[11px] text-violet-700">
              Tổng {totalSeats} chỗ · {pickedTables.length + 1} bàn được gộp
            </div>
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
            disabled={selected.length === 0}
            onClick={() => onConfirm(selected)}
            className={cn(
              "h-12 rounded-full text-sm font-bold shadow-none",
              selected.length > 0
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-slate-100 text-slate-400"
            )}
          >
            Xác nhận ghép bàn
          </button>
        </div>
      </div>
    </div>
  )
}
