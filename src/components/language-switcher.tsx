import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SUPPORTED_LANGUAGES, type AppLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type Props = {
  variant?: "icon" | "pill"
  className?: string
}

export function LanguageSwitcher({ variant = "icon", className }: Props) {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? i18n.language ?? "en") as AppLanguage
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === current) ?? SUPPORTED_LANGUAGES[0]

  const handleChange = (value: string) => {
    void i18n.changeLanguage(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Change language"
          className={cn(
            variant === "icon"
              ? "border-input bg-background hover:bg-muted relative flex size-9 items-center justify-center rounded-full border transition-colors"
              : "border-input bg-background hover:bg-muted flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors",
            className
          )}
        >
          <Globe className="size-4" />
          {variant === "pill" ? <span>{currentLang.short}</span> : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup value={current} onValueChange={handleChange}>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuRadioItem key={lang.code} value={lang.code}>
              {lang.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuItem disabled className="text-muted-foreground text-xs">
          {currentLang.short}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
