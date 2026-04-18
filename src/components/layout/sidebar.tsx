import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ListOrdered,
  History,
  Receipt,
  UtensilsCrossed,
} from "lucide-react"

import { cn } from "@/lib/utils"

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/orders", label: "Order List", icon: ListOrdered },
  { to: "/history", label: "History", icon: History },
  { to: "/bills", label: "Bills", icon: Receipt },
]

export function Sidebar() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border hidden w-60 shrink-0 flex-col border-r md:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
          <UtensilsCrossed className="size-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">POS Dashboard</span>
          <span className="text-muted-foreground text-xs">Admin console</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="text-muted-foreground border-sidebar-border border-t px-5 py-3 text-xs">
        v0.0.1 — Press <kbd className="font-mono">d</kbd> to toggle theme
      </div>
    </aside>
  )
}
