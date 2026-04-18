import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"

type Props = {
  title?: string
  subtitle?: string
  onBack?: () => void
  hideBack?: boolean
  right?: React.ReactNode
  className?: string
  transparent?: boolean
}

export function MobileHeader({
  title,
  subtitle,
  onBack,
  hideBack,
  right,
  className,
  transparent,
}: Props) {
  const navigate = useNavigate()
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 px-4",
        transparent ? "bg-transparent" : "border-b bg-white",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {hideBack ? (
          <div className="size-9" />
        ) : (
          <button
            type="button"
            onClick={() => (onBack ? onBack() : navigate(-1))}
            aria-label="Quay lại"
            className="flex size-9 items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200"
          >
            <ChevronLeft className="size-5 text-slate-900" />
          </button>
        )}
        <div className="min-w-0">
          {title ? (
            <div className="truncate text-base font-bold text-slate-900">
              {title}
            </div>
          ) : null}
          {subtitle ? (
            <div className="truncate text-[11px] text-slate-500">{subtitle}</div>
          ) : null}
        </div>
      </div>
      {right ? <div className="flex shrink-0 items-center gap-1">{right}</div> : null}
    </header>
  )
}
