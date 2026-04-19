import { Outlet } from "react-router-dom"

export function KdsShell() {
  return (
    <div className="flex h-svh w-full overflow-hidden bg-slate-900 text-slate-100 antialiased">
      <Outlet />
    </div>
  )
}
