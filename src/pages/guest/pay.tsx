import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Check, ChefHat, Handshake, QrCode, Shield } from "lucide-react"

import { GuestHeader } from "@/components/guest/guest-header"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"

const TOTAL = 265.6

type Method = "qr" | "counter"

export function GuestPayPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const tableName = (tableId ?? "a3").replace(/^t-?/i, "").toUpperCase()
  const navigate = useNavigate()
  const [method, setMethod] = useState<Method>("qr")

  return (
    <div className="flex flex-1 flex-col">
      <GuestHeader title="Thanh toán" subtitle={`Bàn ${tableName}`} />

      <div className="flex-1 px-4 pt-3 pb-32">
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-5 text-white shadow-lg shadow-orange-500/30">
          <div className="text-xs font-semibold opacity-80">Tổng thanh toán</div>
          <div className="mt-0.5 text-4xl font-black tabular-nums">
            {formatCurrency(TOTAL)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs opacity-80">
            <ChefHat className="size-3.5" />
            Bếp đã nhận đơn · Đang chuẩn bị
          </div>
        </div>

        <h3 className="mt-5 mb-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Chọn cách thanh toán
        </h3>

        <div className="flex flex-col gap-2">
          <MethodCard
            id="qr"
            active={method === "qr"}
            icon={QrCode}
            title="Quét QR thanh toán ngay"
            subtitle="Chuyển khoản qua app ngân hàng / ví điện tử"
            badge="Nhanh nhất"
            onClick={() => setMethod("qr")}
          />
          <MethodCard
            id="counter"
            active={method === "counter"}
            icon={Handshake}
            title="Thanh toán tại quầy"
            subtitle="Nhân viên sẽ tính tiền khi bạn rời bàn"
            onClick={() => setMethod("counter")}
          />
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-[11px] text-emerald-900 ring-1 ring-emerald-200">
          <Shield className="mt-0.5 size-4 shrink-0" />
          <span>
            Thanh toán an toàn qua VietQR/Napas. Không lưu thông tin thẻ. Hoá đơn
            sẽ được gửi qua SMS/Email nếu bạn cung cấp.
          </span>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-amber-200 bg-white/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate(`/guest/${tableId}/success?method=${method}`)}
          className={cn(
            "flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-base font-black text-white shadow-xl shadow-orange-500/30",
            "active:scale-[0.98]"
          )}
        >
          {method === "qr" ? (
            <>
              <QrCode className="size-5" />
              Hiện QR thanh toán
            </>
          ) : (
            <>
              <Check className="size-5" />
              Xác nhận thanh toán tại quầy
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function MethodCard({
  id: _id,
  active,
  icon: Icon,
  title,
  subtitle,
  badge,
  onClick,
}: {
  id: string
  active: boolean
  icon: typeof QrCode
  title: string
  subtitle: string
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left transition-all",
        active
          ? "border-orange-500 shadow-lg shadow-orange-500/10"
          : "border-amber-100 hover:border-amber-300"
      )}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          active
            ? "bg-orange-500 text-white"
            : "bg-orange-50 text-orange-600"
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">{title}</span>
          {badge ? (
            <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 text-[11px] text-slate-500">{subtitle}</div>
      </div>
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
          active
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-slate-300"
        )}
      >
        {active ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
    </button>
  )
}
