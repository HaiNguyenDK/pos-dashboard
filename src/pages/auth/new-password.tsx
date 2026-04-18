import { useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { KopagLogo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function NewPasswordPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const checks = useMemo(() => {
    const hasMinLength = password.length >= 8 && !/\s/.test(password)
    const hasMixed =
      /[0-9]/.test(password) &&
      /[a-zA-Z]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    return { hasMinLength, hasMixed }
  }, [password])

  const passwordsMatch = password.length > 0 && password === confirm
  const canSubmit = checks.hasMinLength && checks.hasMixed && passwordsMatch

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    navigate("/forgot-password/welcome")
  }

  return (
    <div className="flex flex-col gap-6">
      <KopagLogo />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {t("auth.new_password.title")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("auth.new_password.subtitle")}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password">{t("auth.new_password.password_label")}</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            placeholder={t("auth.new_password.password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-password">
            {t("auth.new_password.confirm_label")}
          </Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder={t("auth.new_password.confirm_placeholder")}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={cn(
              "h-11 rounded-xl",
              confirm.length > 0 && !passwordsMatch && "border-destructive"
            )}
          />
        </div>

        <ul className="text-muted-foreground list-disc space-y-1.5 pl-5 text-sm">
          <li>{t("auth.new_password.requirements_8_chars")}</li>
          <li>{t("auth.new_password.requirements_mixed")}</li>
        </ul>

        <Button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "mt-1 h-11 rounded-full bg-blue-600 text-base font-semibold text-white shadow-none",
            "hover:bg-blue-700 focus-visible:ring-blue-600",
            "disabled:opacity-60"
          )}
        >
          {t("common.continue")}
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
