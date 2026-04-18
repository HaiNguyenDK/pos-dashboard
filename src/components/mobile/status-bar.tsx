import { Battery, Signal, Wifi } from "lucide-react"

export function StatusBar() {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between px-6 pt-2 text-[14px] font-semibold tabular-nums text-slate-900">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal className="size-3.5" strokeWidth={2.5} />
        <Wifi className="size-3.5" strokeWidth={2.5} />
        <Battery className="size-4" strokeWidth={2.5} />
      </div>
    </div>
  )
}
