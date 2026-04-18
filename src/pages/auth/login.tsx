import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"

import { KopagLogo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function LoginPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const canSubmit = email.length > 0 && password.length > 0

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate("/dashboard")
  }

  return (
    <div className="flex flex-col gap-5">
      <KopagLogo />

      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {t("auth.login.title")}
        </h1>
        <p className="text-muted-foreground text-sm">{t("auth.login.subtitle")}</p>
      </div>

      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t("auth.login.email_label")}</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("auth.login.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">{t("auth.login.password_label")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t("auth.login.password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl pr-11"
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

        <Button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "mt-1 h-11 rounded-full bg-blue-600 text-base font-semibold text-white shadow-none",
            "hover:bg-blue-700 focus-visible:ring-blue-600",
            "disabled:opacity-60"
          )}
        >
          {t("common.log_in")}
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
        {t("auth.login.signup_text")}{" "}
        <Link to="/register" className="font-medium text-blue-600 hover:underline">
          {t("common.register")}
        </Link>
      </div>

      <p className="text-muted-foreground text-center text-xs">
        {t("common.terms_text_login")}{" "}
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
