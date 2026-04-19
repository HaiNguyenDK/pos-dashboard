import { NavLink, useNavigate } from "react-router-dom"
import { ClipboardList, Eye, LayoutGrid, Settings, Wifi } from "lucide-react"

import { cn } from "@/lib/utils"
import { STATIONS, type KdsStation } from "@/mocks/kds-tickets"

type Props = {
  currentStation?: KdsStation
  onStationChange?: (s: KdsStation) => void
  online?: boolean
  user?: { name: string; initials: string }
}

export function SideRail({
  currentStation,
  onStationChange,
  online = true,
  user = { name: "Chef Minh", initials: "CM" },
}: Props) {
  const navigate = useNavigate()
  return (
    <aside className="flex h-full w-20 shrink-0 flex-col items-center justify-between border-r border-slate-800 bg-slate-950 py-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30">
          <span className="text-lg font-black text-white">K</span>
        </div>

        <div className="my-1 h-px w-8 bg-slate-800" />

        <div className="flex flex-col items-center gap-2">
          {STATIONS.map((s) => {
            const active = currentStation === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onStationChange?.(s.id)}
                className={cn(
                  "relative flex size-14 flex-col items-center justify-center gap-0.5 rounded-xl transition-all",
                  active
                    ? "bg-slate-800 ring-2 ring-blue-500"
                    : "hover:bg-slate-800/60"
                )}
                aria-label={`Station ${s.label}`}
                aria-pressed={active}
              >
                <span className="text-2xl leading-none">{s.icon}</span>
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    active ? "text-blue-300" : "text-slate-400"
                  )}
                >
                  {s.label}
                </span>
                {active ? (
                  <span className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="my-1 h-px w-8 bg-slate-800" />

        <NavButton
          icon={Eye}
          label="Expo"
          onClick={() => navigate("/kds/expo")}
        />
        <NavButton
          icon={ClipboardList}
          label="All-day"
          onClick={() => navigate("/kds/all-day")}
        />
        <NavButton
          icon={LayoutGrid}
          label="Grid"
          onClick={() => navigate("/kds/grid")}
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <NavButton
          icon={Settings}
          label="Cài đặt"
          onClick={() => navigate("/kds/settings")}
        />
        <div className="flex flex-col items-center gap-1">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-black text-white">
            {user.initials}
          </div>
          <div
            className="flex items-center gap-1 text-[10px] font-medium"
            aria-live="polite"
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                online ? "bg-emerald-400" : "bg-rose-500 animate-pulse"
              )}
            />
            <Wifi className={cn("size-3", online ? "text-emerald-400" : "text-rose-500")} />
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavButton({
  icon: Icon,
  label,
  onClick,
  to,
}: {
  icon: typeof Settings
  label: string
  onClick?: () => void
  to?: string
}) {
  const baseClass =
    "flex size-12 flex-col items-center justify-center gap-0.5 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
  const content = (
    <>
      <Icon className="size-4" />
      <span className="text-[9px] font-semibold">{label}</span>
    </>
  )
  if (to) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(baseClass, isActive && "bg-slate-800 text-blue-300")
        }
      >
        {content}
      </NavLink>
    )
  }
  return (
    <button type="button" onClick={onClick} className={baseClass}>
      {content}
    </button>
  )
}
