import { Outlet } from "react-router-dom"

export function GuestShell() {
  return (
    <div className="min-h-svh w-full bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col">
        <Outlet />
      </div>
    </div>
  )
}
