import { Outlet } from "react-router-dom"

import { TopNav } from "./top-nav"

export function AppShell() {
  return (
    <div className="bg-muted/30 flex min-h-svh flex-col">
      <TopNav />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
