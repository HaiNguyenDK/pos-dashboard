import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { OtpInput } from "@/components/auth/otp-input"
import { KopagLogo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const OTP_LENGTH = 7

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [otp, setOtp] = useState("")
  const canSubmit = otp.length === OTP_LENGTH

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate("/forgot-password/new")
  }

  return (
    <div className="flex flex-col gap-6">
      <KopagLogo />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {t("auth.verify_otp.title")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("auth.verify_otp.subtitle")}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <OtpInput length={OTP_LENGTH} value={otp} onChange={setOtp} autoFocus />

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

        <p className="text-muted-foreground text-center text-sm">
          {t("auth.verify_otp.change_text")}{" "}
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="font-medium text-blue-600 hover:underline"
          >
            {t("auth.verify_otp.change_button")}
          </button>
        </p>
      </form>
    </div>
  )
}
