import { Outlet } from "react-router-dom"

import { StatusBar } from "./status-bar"

export function MobileShell() {
  return (
    <div className="min-h-svh w-full bg-slate-200 md:flex md:items-center md:justify-center md:p-6 dark:bg-slate-950">
      <div className="relative mx-auto w-full max-w-[430px] overflow-hidden bg-white md:h-[844px] md:w-[390px] md:rounded-[54px] md:border-[14px] md:border-slate-900 md:shadow-2xl">
        <div className="absolute top-0 left-1/2 z-30 hidden h-7 w-32 -translate-x-1/2 rounded-b-[20px] bg-slate-900 md:block" />
        <div className="flex h-svh w-full flex-col md:h-full">
          <StatusBar />
          <div className="min-h-0 flex-1 overflow-hidden">
            <Outlet />
          </div>
          <div className="hidden h-1.5 w-32 shrink-0 self-center rounded-full bg-slate-900 opacity-80 md:mb-1.5 md:block" />
        </div>
      </div>
    </div>
  )
}
