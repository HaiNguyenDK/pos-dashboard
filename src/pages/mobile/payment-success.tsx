import { useNavigate } from "react-router-dom"
import { Check, FileText, Mail, MessageSquare, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"

export function MobilePaymentSuccessPage() {
  const navigate = useNavigate()
  const actions: Array<{
    id: string
    label: string
    icon: typeof Printer
    primary?: boolean
  }> = [
    { id: "print", label: "In hoá đơn", icon: Printer, primary: true },
    { id: "email", label: "Gửi qua Email", icon: Mail },
    { id: "sms", label: "Gửi qua SMS", icon: MessageSquare },
    { id: "einvoice", label: "Xuất hoá đơn điện tử", icon: FileText },
  ]

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="flex flex-1 flex-col items-center px-6 pt-10 pb-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30" />
          <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40">
            <Check className="size-10 text-white" strokeWidth={3} />
          </div>
        </div>

        <h1 className="mt-5 text-xl font-black text-slate-900">
          Thanh toán thành công
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Đơn #1234 · Bàn A3 · Cheryl
        </p>

        <div className="mt-6 w-full rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Số tiền</span>
            <span className="text-2xl font-black tabular-nums text-slate-900">
              {formatCurrency(366.5)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-dashed pt-3 text-sm">
            <span className="text-slate-500">Phương thức</span>
            <span className="font-semibold">💵 Tiền mặt</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-slate-500">Khách đưa</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(400)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-slate-500">Tiền thối</span>
            <span className="font-semibold tabular-nums text-emerald-600">
              {formatCurrency(33.5)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-dashed pt-3 text-xs text-slate-400">
            <span>17/04/2026 14:27</span>
            <span className="font-mono">TX-20260417-0042</span>
          </div>
        </div>

        <div className="mt-5 w-full space-y-2">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                a.primary
                  ? "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  a.primary ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                )}
              >
                <a.icon className="size-4" />
              </div>
              <span className="flex-1 text-sm font-semibold">{a.label}</span>
              <span className="text-slate-400">→</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-2 pb-6">
        <Button
          onClick={() => navigate("/mobile/home")}
          variant="outline"
          className="h-12 w-full rounded-full border-slate-200 text-sm font-bold hover:bg-slate-50"
        >
          Xong, về trang chủ
        </Button>
      </div>
    </div>
  )
}
