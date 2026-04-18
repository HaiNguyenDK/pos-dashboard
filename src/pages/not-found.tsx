import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold">{t("not_found.title")}</h1>
      <p className="text-muted-foreground">{t("not_found.message")}</p>
      <Button asChild>
        <Link to="/dashboard">{t("not_found.back_link")}</Link>
      </Button>
    </div>
  )
}
