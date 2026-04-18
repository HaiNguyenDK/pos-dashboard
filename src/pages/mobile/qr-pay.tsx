import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Copy, RefreshCcw, X } from "lucide-react"

import { formatCurrency } from "@/lib/format"

const TOTAL = 366.5
const TIMEOUT_SECONDS = 300

export function MobileQrPayPage() {
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(TIMEOUT_SECONDS)
  const [status, setStatus] = useState<"waiting" | "success">("waiting")

  useEffect(() => {
    if (status !== "waiting") return
    const id = window.setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [status])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeLabel = `${String(minutes).padStart(1, "0")}:${String(secs).padStart(2, "0")}`

  return (
    <div className="relative flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <div className="text-[11px] text-slate-400">Đơn #1234</div>
          <div className="text-sm font-bold">Bàn A3</div>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Đóng"
          className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Quét QR để thanh toán
        </div>
        <div className="text-4xl font-black tabular-nums">
          {formatCurrency(TOTAL)}
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-2xl">
          <QrArt />
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-600">
            <span className="font-black tracking-wider text-blue-700">VietQR</span>
            <span className="h-3 w-px bg-slate-300" />
            <span>Napas 247</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-1 text-center">
          <div className="text-xs text-slate-400">Ngân hàng: Vietcombank</div>
          <div className="text-sm font-semibold">KOPAG RESTO · 0123456789</div>
          <div className="mt-1 text-xs text-slate-400">Nội dung</div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold">KOPAG-1234</span>
            <button
              type="button"
              aria-label="Copy"
              className="flex size-7 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
            >
              <Copy className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
          </span>
          <span className="font-medium text-amber-200">
            Đang chờ khách quét… {timeLabel}
          </span>
        </div>
      </div>

      <div className="space-y-2 px-4 pb-6">
        <button
          type="button"
          onClick={() => setStatus("success")}
          className="w-full rounded-full bg-emerald-500 py-3 text-sm font-bold active:scale-[0.98]"
        >
          (Demo) Mô phỏng nhận được tiền
        </button>
        <button
          type="button"
          onClick={() => setSeconds(TIMEOUT_SECONDS)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-3 text-sm font-semibold text-white active:bg-white/20"
        >
          <RefreshCcw className="size-4" />
          Tạo QR mới
        </button>
        <button
          type="button"
          onClick={() => navigate("/mobile/payment")}
          className="w-full rounded-full py-2 text-sm text-slate-400 active:text-white"
        >
          Đổi phương thức khác
        </button>
      </div>

      {status === "success" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-emerald-600 px-6 text-white">
          <div className="flex size-20 items-center justify-center rounded-full bg-white text-emerald-600">
            <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="text-2xl font-black">Nhận được tiền!</div>
          <div className="text-sm text-emerald-100">
            {formatCurrency(TOTAL)} · Vietcombank
          </div>
          <button
            type="button"
            onClick={() => navigate("/mobile/pay/success")}
            className="mt-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-700"
          >
            Tiếp tục
          </button>
        </div>
      ) : null}
    </div>
  )
}

function QrArt() {
  return (
    <div className="relative mx-auto flex size-60 items-center justify-center rounded-2xl bg-white">
      <svg viewBox="0 0 100 100" className="size-full text-slate-900">
        {Array.from({ length: 324 }).map((_, i) => {
          const x = (i % 18) * 5 + 5
          const y = Math.floor(i / 18) * 5 + 5
          const seed = (x * 31 + y * 17) % 7
          if (seed < 3) return null
          return <rect key={i} x={x} y={y} width={4.2} height={4.2} fill="currentColor" rx={0.5} />
        })}
        <rect x={5} y={5} width={22} height={22} rx={4} fill="none" stroke="currentColor" strokeWidth={2.5} />
        <rect x={11} y={11} width={10} height={10} rx={1.5} fill="currentColor" />
        <rect x={73} y={5} width={22} height={22} rx={4} fill="none" stroke="currentColor" strokeWidth={2.5} />
        <rect x={79} y={11} width={10} height={10} rx={1.5} fill="currentColor" />
        <rect x={5} y={73} width={22} height={22} rx={4} fill="none" stroke="currentColor" strokeWidth={2.5} />
        <rect x={11} y={79} width={10} height={10} rx={1.5} fill="currentColor" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white shadow">
          K
        </div>
      </div>
    </div>
  )
}
