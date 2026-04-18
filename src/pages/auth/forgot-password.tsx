import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { KopagLogo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const canSubmit = email.trim().length > 0

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate("/forgot-password/verify")
  }

  return (
    <div className="flex flex-col gap-6">
      <KopagLogo />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {t("auth.forgot_password.title")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("auth.forgot_password.subtitle")}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reset-email">{t("auth.forgot_password.email_label")}</Label>
          <Input
            id="reset-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("auth.forgot_password.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <Button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "mt-1 h-11 rounded-full bg-blue-600 text-base font-semibold text-white shadow-none",
            "hover:bg-blue-700 focus-visible:ring-blue-600",
            "disabled:opacity-60"
          )}
        >
          {t("common.send")}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          {t("common.terms_text_signup")}{" "}
          <a href="#" className="text-blue-600 hover:underline">
            {t("common.terms_of_service")}
          </a>{" "}
          &{" "}
          <a href="#" className="text-blue-600 hover:underline">
            {t("common.privacy_policy")}
          </a>
        </p>
      </form>
    </div>
  )
}
