import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  showWordmark?: boolean
}

export function KopagLogo({ className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className="size-9"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="kopag-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="kopag-wave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="19" r="6.5" fill="url(#kopag-sun)" />
        <g stroke="#F97316" strokeWidth="1.6" strokeLinecap="round">
          <line x1="20" y1="6" x2="20" y2="9" />
          <line x1="9" y1="19" x2="12" y2="19" />
          <line x1="28" y1="19" x2="31" y2="19" />
          <line x1="12" y1="10.5" x2="14" y2="12.5" />
          <line x1="26" y1="12.5" x2="28" y2="10.5" />
        </g>
        <path
          d="M4 28 Q 12 22, 20 28 T 36 28 L 36 34 Q 28 30, 20 34 T 4 34 Z"
          fill="url(#kopag-wave)"
        />
      </svg>
      {showWordmark ? (
        <span className="text-2xl font-bold tracking-tight">Kopag</span>
      ) : null}
    </div>
  )
}
