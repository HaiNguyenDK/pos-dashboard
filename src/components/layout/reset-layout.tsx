import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { LanguageSwitcher } from "@/components/language-switcher"
import { ResetProgress } from "@/components/auth/reset-progress"
import { ResetStepIndicator } from "@/components/auth/reset-step-indicator"
import { RESET_STEPS, getResetStepIndex } from "@/components/auth/reset-steps"
import { cn } from "@/lib/utils"

export function ResetLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentStep = getResetStepIndex(pathname)
  const { t } = useTranslation()

  const goBack = () => {
    if (currentStep === 0) {
      navigate("/login")
      return
    }
    navigate(RESET_STEPS[currentStep - 1].route)
  }

  const goNext = () => {
    if (currentStep >= RESET_STEPS.length - 1) {
      navigate("/dashboard")
      return
    }
    navigate(RESET_STEPS[currentStep + 1].route)
  }

  return (
    <div className="bg-background relative h-svh overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher variant="pill" />
      </div>
      <div className="grid h-full grid-cols-1 md:grid-cols-[2fr_3fr]">
        <aside className="bg-muted/40 hidden flex-col p-8 md:flex lg:p-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {t("auth.reset_layout.title")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t("auth.reset_layout.subtitle")}
            </p>
          </div>

          <div className="mt-10 flex-1">
            <ResetStepIndicator currentStep={currentStep} />
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={goBack}
              className="text-foreground hover:text-foreground/70 inline-flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <ChevronLeft className="size-4" />
              {t("common.back")}
            </button>
            <button
              type="button"
              onClick={goNext}
              className={cn(
                "text-foreground hover:text-foreground/70 inline-flex items-center gap-1 text-sm font-medium transition-colors"
              )}
            >
              {t("common.next")}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </aside>

        <section className="flex flex-col overflow-y-auto px-6 py-8 md:px-10 md:py-10 lg:px-16 lg:py-12">
          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
            <Outlet />
          </div>
          <div className="mx-auto w-full max-w-xl pt-6">
            <ResetProgress currentStep={currentStep} />
          </div>
        </section>
      </div>
    </div>
  )
}
