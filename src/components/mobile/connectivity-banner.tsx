import { CloudOff } from "lucide-react"

type Props = {
  pendingCount?: number
}

export function ConnectivityBanner({ pendingCount = 0 }: Props) {
  return (
    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900">
      <CloudOff className="size-3.5" />
      <span className="flex-1">
        Mất kết nối
        {pendingCount > 0 ? ` — ${pendingCount} thao tác đang chờ sync` : ""}
      </span>
    </div>
  )
}
