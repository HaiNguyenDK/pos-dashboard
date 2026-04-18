import { cn } from "@/lib/utils"
import { RESET_STEPS } from "./reset-steps"

type Props = {
  currentStep: number
}

export function ResetProgress({ currentStep }: Props) {
  return (
    <div
      className="flex items-center gap-3"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={RESET_STEPS.length}
    >
      {RESET_STEPS.map((step, i) => (
        <div
          key={step.route}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i <= currentStep ? "bg-blue-600" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  )
}
