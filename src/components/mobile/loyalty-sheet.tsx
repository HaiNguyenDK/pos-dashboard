import { useMemo, useState } from "react"
import { Gift, Phone, Sparkles, UserPlus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  LOYALTY_CUSTOMERS,
  TIER_META,
  type LoyaltyCustomer,
} from "@/mocks/queue"

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (customer: LoyaltyCustomer) => void
}

export function LoyaltySheet({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.replace(/\s/g, "").trim().toLowerCase()
    if (!q) return LOYALTY_CUSTOMERS.slice(0, 5)
    return LOYALTY_CUSTOMERS.filter(
      (c) =>
        c.phone.replace(/\s/g, "").includes(q) ||
        c.name.toLowerCase().includes(q)
    )
  }, [query])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[88%] w-full flex-col rounded-t-3xl bg-white shadow-xl">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" />
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2">
            <Gift className="size-5 text-violet-600" />
            <div>
              <div className="text-base font-black text-slate-900">
                Khách hàng thân thiết
              </div>
              <div className="text-[11px] text-slate-500">
                Tìm theo số điện thoại hoặc tên
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

        <div className="border-b px-5 py-3">
          <div className="relative">
            <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="0901 234 567"
              className="h-11 w-full rounded-full bg-slate-50 pl-10 pr-3 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Phone className="size-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Chưa có khách với SĐT này
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  Tạo tài khoản mới cho khách
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white"
              >
                <UserPlus className="size-3.5" />
                Đăng ký khách mới
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((c) => {
                const tier = TIER_META[c.tier]
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelect(c)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                      "border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm active:scale-[0.99]"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl ring-2",
                        tier.bg,
                        tier.ring
                      )}
                    >
                      {tier.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {c.name}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
                            tier.bg,
                            tier.text
                          )}
                        >
                          {tier.label}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        {c.phone}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{c.visits} lần ghé</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-0.5 font-semibold text-violet-600">
                          <Sparkles className="size-3" />
                          {c.points.toLocaleString()} điểm
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
