import { useMemo } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ChefHat, MessageSquareWarning } from "lucide-react"

import { cn } from "@/lib/utils"
import { INGREDIENTS } from "@/mocks/inventory"
import { KDS_TICKETS } from "@/mocks/kds-tickets"
import { REVIEWS } from "@/mocks/reviews"

export function DashboardAlertStrip() {
  const lowStock = useMemo(
    () => INGREDIENTS.filter((i) => i.stock < i.reorderPoint),
    []
  )
  const overdueTickets = useMemo(
    () =>
      KDS_TICKETS.filter((t) => {
        if (t.status === "ready") return false
        const mins = (Date.now() - new Date(t.createdAt).getTime()) / 60000
        return mins > 8
      }),
    []
  )
  const unrepliedCritical = useMemo(
    () =>
      REVIEWS.filter((r) => !r.staffReply && r.rating <= 2),
    []
  )

  const alerts = [
    {
      id: "stock",
      icon: AlertTriangle,
      label: "Nguyên liệu sắp hết",
      count: lowStock.length,
      to: "/inventory",
      tone: "amber",
      detail: lowStock
        .slice(0, 3)
        .map((i) => i.name)
        .join(", "),
    },
    {
      id: "kds",
      icon: ChefHat,
      label: "Ticket bếp chờ lâu",
      count: overdueTickets.length,
      to: "/kds/grid",
      tone: "rose",
      detail: `${overdueTickets.length} ticket > 8 phút`,
    },
    {
      id: "reviews",
      icon: MessageSquareWarning,
      label: "Đánh giá cần xử lý",
      count: unrepliedCritical.length,
      to: "/reviews",
      tone: "violet",
      detail: unrepliedCritical.length > 0 ? "Khách không hài lòng" : "—",
    },
  ].filter((a) => a.count > 0)

  if (alerts.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        ⚠ Cần chú ý ({alerts.reduce((s, a) => s + a.count, 0)})
      </h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {alerts.map((a) => (
          <Link
            key={a.id}
            to={a.to}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border-2 p-3 transition-all hover:shadow-md active:scale-[0.99]",
              a.tone === "amber" &&
                "border-amber-200 bg-amber-50/60 hover:border-amber-400",
              a.tone === "rose" &&
                "border-rose-200 bg-rose-50/60 hover:border-rose-400",
              a.tone === "violet" &&
                "border-violet-200 bg-violet-50/60 hover:border-violet-400"
            )}
          >
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl text-white",
                a.tone === "amber" && "bg-amber-500",
                a.tone === "rose" && "bg-rose-500",
                a.tone === "violet" && "bg-violet-500"
              )}
            >
              <a.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {a.label}
                </span>
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-black text-white",
                    a.tone === "amber" && "bg-amber-500",
                    a.tone === "rose" && "bg-rose-500",
                    a.tone === "violet" && "bg-violet-500"
                  )}
                >
                  {a.count}
                </span>
              </div>
              <div className="mt-0.5 truncate text-[11px] text-slate-600">
                {a.detail}
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-slate-600">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
