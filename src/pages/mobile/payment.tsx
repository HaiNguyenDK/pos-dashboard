import { useNavigate } from "react-router-dom"
import {
  Banknote,
  ChevronRight,
  CreditCard,
  QrCode,
  SplitSquareHorizontal,
} from "lucide-react"

import { MobileHeader } from "@/components/mobile/mobile-header"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

type Method = {
  id: string
  title: string
  subtitle: string
  icon: typeof Banknote
  accent: string
  to?: string
  disabled?: boolean
  disabledReason?: string
}

export function MobilePaymentPage() {
  const navigate = useNavigate()

  const methods: Method[] = [
    {
      id: "cash",
      title: "Tiền mặt",
      subtitle: "Nhập tiền khách đưa, tự tính thối",
      icon: Banknote,
      accent: "bg-lime-100 text-lime-700",
      to: "/mobile/pay/cash",
    },
    {
      id: "qr",
      title: "VietQR",
      subtitle: "Khách quét QR bằng app ngân hàng",
      icon: QrCode,
      accent: "bg-slate-100 text-slate-800",
      to: "/mobile/pay/qr",
    },
    {
      id: "card",
      title: "Thẻ EMV",
      subtitle: "Thẻ ngân hàng qua card reader BLE",
      icon: CreditCard,
      accent: "bg-blue-100 text-blue-700",
      disabled: true,
      disabledReason: "Chưa pair card reader",
    },
    {
      id: "split",
      title: "Chia nhiều phương thức",
      subtitle: "Ví dụ 50% tiền mặt + 50% QR",
      icon: SplitSquareHorizontal,
      accent: "bg-violet-100 text-violet-700",
    },
  ]

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader title="Thanh toán" subtitle="Đơn #1234 · Bàn A3" />

      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-6 text-center text-white">
        <div className="text-sm font-medium text-blue-100">Tổng thanh toán</div>
        <div className="mt-1 text-4xl font-black tabular-nums">
          {formatCurrency(366.5)}
        </div>
        <div className="mt-1 text-xs text-blue-100">
          4 món · đã áp giảm giá $20
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
        <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">
          Chọn phương thức
        </h3>
        <div className="flex flex-col gap-2">
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={m.disabled}
              onClick={() => m.to && navigate(m.to)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border bg-white p-3 text-left transition-all",
                !m.disabled &&
                  "hover:border-blue-300 hover:shadow-sm active:scale-[0.99]",
                m.disabled && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl",
                  m.accent
                )}
              >
                <m.icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900">{m.title}</div>
                <div className="mt-0.5 truncate text-[11px] text-slate-500">
                  {m.disabled ? m.disabledReason : m.subtitle}
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-slate-400" />
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-amber-50 p-3">
          <div className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
            Mẹo
          </div>
          <div className="mt-1 text-xs text-amber-900">
            Khách hỏi xuất hoá đơn điện tử? Chọn "Xuất HĐĐT" sau khi thanh toán
            thành công, nhập MST & email công ty để gửi.
          </div>
        </div>
      </div>
    </div>
  )
}
