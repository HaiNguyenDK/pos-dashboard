import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { KopagLogo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function WelcomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <KopagLogo />

      <div
        className="flex size-20 items-center justify-center rounded-full border-2 border-blue-500 bg-white text-4xl leading-none ring-4 ring-blue-500/15"
        aria-hidden="true"
      >
        🚀
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {t("auth.welcome.title")}
        </h1>
        <p className="text-muted-foreground text-sm">{t("auth.welcome.subtitle")}</p>
      </div>

      <Button
        type="button"
        onClick={() => navigate("/login")}
        className={cn(
          "h-11 rounded-full bg-blue-600 text-base font-semibold text-white shadow-none",
          "hover:bg-blue-700 focus-visible:ring-blue-600"
        )}
      >
        {t("common.log_in")}
      </Button>
    </div>
  )
}
