import { ChevronLeft, Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"

type Props = {
  title?: string
  subtitle?: string
  hideBack?: boolean
  right?: React.ReactNode
  className?: string
}

export function GuestHeader({
  title,
  subtitle,
  hideBack,
  right,
  className,
}: Props) {
  const navigate = useNavigate()
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-amber-200/60 bg-white/80 px-4 backdrop-blur",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {hideBack ? (
          <div className="size-9" />
        ) : (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex size-9 items-center justify-center rounded-full hover:bg-amber-100 active:bg-amber-200"
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
      <div className="flex shrink-0 items-center gap-1">
        {right}
        <button
          type="button"
          aria-label="Language"
          className="flex size-9 items-center justify-center rounded-full hover:bg-amber-100"
        >
          <Globe className="size-4 text-slate-600" />
        </button>
      </div>
    </header>
  )
}
