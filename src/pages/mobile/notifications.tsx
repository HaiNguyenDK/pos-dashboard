import { useState } from "react"
import { AlertTriangle, Bell, CheckCheck, Sparkles, UserPlus } from "lucide-react"

import { MobileHeader } from "@/components/mobile/mobile-header"
import { cn } from "@/lib/utils"

type Notification = {
  id: string
  kind: "kitchen_ready" | "order_assigned" | "alert" | "promo"
  title: string
  body: string
  time: string
  read: boolean
}

const INITIAL: Notification[] = [
  {
    id: "n1",
    kind: "kitchen_ready",
    title: "Beef Burger sẵn sàng",
    body: "Đơn #1234 · Bàn A3",
    time: "Vừa xong",
    read: false,
  },
  {
    id: "n2",
    kind: "kitchen_ready",
    title: "Cappuccino x2 sẵn sàng",
    body: "Đơn #1234 · Bàn A3",
    time: "2 phút trước",
    read: false,
  },
  {
    id: "n3",
    kind: "order_assigned",
    title: "Đơn #1235 được gán cho bạn",
    body: "Bàn B2 · Kylian Rex · 3 món",
    time: "5 phút trước",
    read: false,
  },
  {
    id: "n4",
    kind: "alert",
    title: "Bếp tạm dừng Alfredo",
    body: "Hết nguyên liệu — đánh dấu không khả dụng",
    time: "1 giờ trước",
    read: true,
  },
  {
    id: "n5",
    kind: "promo",
    title: "Chương trình happy hour 17:00–19:00",
    body: "Tất cả đồ uống giảm 20%",
    time: "2 giờ trước",
    read: true,
  },
]

const KIND_ICON = {
  kitchen_ready: { icon: Bell, bg: "bg-emerald-100 text-emerald-600" },
  order_assigned: { icon: UserPlus, bg: "bg-blue-100 text-blue-600" },
  alert: { icon: AlertTriangle, bg: "bg-amber-100 text-amber-700" },
  promo: { icon: Sparkles, bg: "bg-violet-100 text-violet-600" },
} as const

export function MobileNotificationsPage() {
  const [notifs, setNotifs] = useState(INITIAL)

  const markAll = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))

  const unreadCount = notifs.filter((n) => !n.read).length

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader
        title="Thông báo"
        subtitle={unreadCount > 0 ? `${unreadCount} chưa đọc` : "Đã đọc hết"}
        right={
          <button
            type="button"
            onClick={markAll}
            disabled={unreadCount === 0}
            className="flex h-9 items-center gap-1 rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-700 disabled:opacity-40"
          >
            <CheckCheck className="size-3.5" />
            Đánh dấu đã đọc
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-100">
              <Bell className="size-7 text-slate-400" />
            </div>
            <div className="text-sm font-bold text-slate-900">Chưa có thông báo</div>
            <div className="text-xs text-slate-500">
              Khi bếp hoàn thành món hoặc có đơn mới được gán, bạn sẽ thấy ở đây.
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {notifs.map((n) => {
              const kind = KIND_ICON[n.kind]
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 p-3.5 transition-colors",
                    !n.read && "bg-blue-50/40"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      kind.bg
                    )}
                  >
                    <kind.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <span className="flex-1 text-sm font-bold text-slate-900">
                        {n.title}
                      </span>
                      {!n.read ? (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-600" />
                      ) : null}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-600">{n.body}</div>
                    <div className="mt-1 text-[11px] text-slate-400">{n.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
