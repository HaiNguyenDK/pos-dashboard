import { Link, NavLink, Outlet } from "react-router-dom"
import { ArrowLeft, Building2 } from "lucide-react"

import { cn } from "@/lib/utils"

const PAGES = [
  { to: "/system", label: "Tổng quan", end: true },
  { to: "/system/journey", label: "Hành trình khách" },
  { to: "/system/operations", label: "Vận hành 1 ngày" },
  { to: "/system/data-flow", label: "Luồng dữ liệu đơn" },
]

export function SystemShell() {
  return (
    <div className="min-h-svh w-full bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="size-4" />
            Quay lại app
          </Link>
          <div className="mx-2 h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm">
              <Building2 className="size-4" />
            </div>
            <span className="text-sm font-bold text-slate-900">
              Kopag · System Documentation
            </span>
          </div>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {PAGES.map((p) => (
              <NavLink
                key={p.to}
                to={p.to}
                end={p.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )
                }
              >
                {p.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-500">
        Kopag POS Documentation · Generated for stakeholder presentations
      </footer>
    </div>
  )
}
