import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { RESET_STEPS } from "./reset-steps"

type Props = {
  currentStep: number
}

export function ResetStepIndicator({ currentStep }: Props) {
  const { t } = useTranslation()
  return (
    <ol className="flex flex-col gap-7">
      {RESET_STEPS.map((step, i) => {
        const isActive = i === currentStep
        return (
          <li key={step.route} className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-xl leading-none transition-all",
                isActive
                  ? "border-2 border-blue-500 ring-4 ring-blue-500/15"
                  : "border border-gray-200"
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span aria-hidden="true">{step.emoji}</span>
            </div>
            <div className="pt-1">
              <div
                className={cn(
                  "text-base font-semibold",
                  !isActive && "text-foreground/80"
                )}
              >
                {t(step.titleKey)}
              </div>
              <div className="text-muted-foreground mt-0.5 text-sm">
                {t(step.descriptionKey)}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
