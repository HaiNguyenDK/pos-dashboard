import { Link, useParams } from "react-router-dom"
import { ArrowRight, HandPlatter, ScanLine, Sparkles } from "lucide-react"

export function GuestWelcomePage() {
  const { tableId } = useParams<{ tableId: string }>()
  const tableName = (tableId ?? "a3").replace(/^t-?/i, "").toUpperCase()

  return (
    <div className="flex flex-1 flex-col px-6 pt-10 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/30" />
          <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-600 shadow-xl shadow-orange-400/40">
            <HandPlatter className="size-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700">
            <ScanLine className="size-3" />
            Đã quét QR
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
            Chào mừng đến <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
              Kopag Resto
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Bạn đang ngồi ở{" "}
            <b className="font-black text-slate-900">Bàn {tableName}</b>. Tự chọn
            món trên menu — nhân viên sẽ phục vụ khi bếp xong.
          </p>
        </div>

        <div className="grid w-full grid-cols-3 gap-2">
          <Feature icon="🍽️" label="300+ món" />
          <Feature icon="⚡" label="Gọi bếp ngay" />
          <Feature icon="💳" label="Trả bàn hoặc QR" />
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-xs text-slate-600 ring-1 ring-amber-200">
          <Sparkles className="size-3.5 text-amber-500" />
          <span>
            Tích điểm sau khi thanh toán — lên đến{" "}
            <b className="text-amber-700">3% giá trị đơn</b>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to={`/guest/${tableId}/menu`}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-base font-black text-white shadow-lg shadow-orange-500/40 active:scale-[0.98]"
        >
          Xem menu
          <ArrowRight className="size-5" strokeWidth={2.5} />
        </Link>
        <button
          type="button"
          className="h-12 rounded-full border border-amber-200 bg-white text-sm font-semibold text-slate-700 hover:bg-amber-50"
        >
          Gọi nhân viên 🔔
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Cần trợ giúp? Vẫy tay hoặc nhấn "Gọi nhân viên"
        </p>
      </div>
    </div>
  )
}

function Feature({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-white/60 px-2 py-3 text-center ring-1 ring-amber-100">
      <span className="text-2xl">{icon}</span>
      <span className="text-[11px] font-semibold text-slate-600">{label}</span>
    </div>
  )
}
