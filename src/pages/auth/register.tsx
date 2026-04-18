import { useMemo, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"

import { KopagLogo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function RegisterPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const checks = useMemo(() => {
    const hasMinLength = password.length >= 8 && !/\s/.test(password)
    const hasMixed =
      /[0-9]/.test(password) &&
      /[a-zA-Z]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    return { hasMinLength, hasMixed }
  }, [password])

  const passwordsMatch = password.length > 0 && password === confirm
  const canSubmit =
    email.trim().length > 0 &&
    checks.hasMinLength &&
    checks.hasMixed &&
    passwordsMatch

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    navigate("/login")
  }

  return (
    <div className="flex flex-col gap-4">
      <KopagLogo />

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {t("auth.register.title")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("auth.register.subtitle")}
        </p>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1">
          <Label htmlFor="reg-email">{t("auth.register.email_label")}</Label>
          <Input
            id="reg-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("auth.register.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="reg-password">{t("auth.register.password_label")}</Label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth.register.password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? t("common.hide_password") : t("common.show_password")
              }
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            >
              {showPassword ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="reg-confirm">{t("auth.register.confirm_label")}</Label>
          <div className="relative">
            <Input
              id="reg-confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth.register.confirm_placeholder")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={cn(
                "h-10 rounded-xl pr-10",
                confirm.length > 0 && !passwordsMatch && "border-destructive"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm ? t("common.hide_password") : t("common.show_password")
              }
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            >
              {showConfirm ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </button>
          </div>
        </div>

        <ul className="text-muted-foreground list-disc pl-5 text-sm leading-tight">
          <li>{t("auth.register.requirements_8_chars")}</li>
          <li>{t("auth.register.requirements_mixed")}</li>
        </ul>

        <Button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "h-10 rounded-full bg-blue-600 text-sm font-semibold text-white shadow-none",
            "hover:bg-blue-700 focus-visible:ring-blue-600",
            "disabled:opacity-60"
          )}
        >
          {t("common.continue")}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="border-border w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background text-muted-foreground px-3">
              {t("common.or")}
            </span>
          </div>
        </div>
      </form>

      <div className="text-muted-foreground text-center text-sm">
        {t("auth.register.login_text")}{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          {t("common.login")}
        </Link>
      </div>

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
    </div>
  )
}
