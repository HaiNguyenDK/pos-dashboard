import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"

import { cn } from "@/lib/utils"

type Duration = "fifteen_min" | "end_of_shift" | "end_of_day" | "indefinite"

const DURATION_OPTIONS: { id: Duration; label: string }[] = [
  { id: "fifteen_min", label: "15 phút (tạm thời)" },
  { id: "end_of_shift", label: "Đến cuối ca" },
  { id: "end_of_day", label: "Cả ngày hôm nay" },
  { id: "indefinite", label: "Vô thời hạn (quản lý khôi phục)" },
]

type Props = {
  open: boolean
  item?: { id: string; name: string; emoji: string }
  onClose: () => void
  onConfirm: (payload: { duration: Duration; reason: string }) => void
}

export function UnavailableSheet({ open, item, onClose, onConfirm }: Props) {
  const [duration, setDuration] = useState<Duration>("end_of_shift")
  const [reason, setReason] = useState("")

  if (!open || !item) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/20 text-3xl">
              {item.emoji}
            </div>
            <div>
              <div className="text-lg font-black text-white">{item.name}</div>
              <div className="text-xs text-slate-400">Đánh dấu tạm hết</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex size-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">
              Khoảng thời gian hết
            </label>
            <div className="flex flex-col gap-2">
              {DURATION_OPTIONS.map((o) => {
                const active = duration === o.id
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setDuration(o.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                      active
                        ? "border-amber-500 bg-amber-500/10 text-amber-200"
                        : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                    )}
                  >
                    <span className="text-sm font-semibold">{o.label}</span>
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                        active
                          ? "border-amber-400 bg-amber-400"
                          : "border-slate-600"
                      )}
                    >
                      {active ? (
                        <span className="size-2 rounded-full bg-slate-900" />
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">
              Lý do (tuỳ chọn)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vd: Hết nguyên liệu, đầu bếp chính nghỉ"
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-200 ring-1 ring-amber-500/30">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              Hiệu lực ngay lập tức. Menu và các ticket chứa món này sẽ bị cảnh báo.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-slate-700 bg-slate-800 text-sm font-bold text-slate-200 hover:bg-slate-700"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => onConfirm({ duration, reason })}
            className="h-12 rounded-xl bg-amber-500 text-sm font-black text-slate-950 hover:bg-amber-400"
          >
            Xác nhận 86 món
          </button>
        </div>
      </div>
    </div>
  )
}
