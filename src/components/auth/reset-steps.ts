export type ResetStep = {
  emoji: string
  titleKey: string
  descriptionKey: string
  route: string
}

export const RESET_STEPS: ResetStep[] = [
  {
    emoji: "🔑",
    titleKey: "auth.reset_steps.forgot_password_title",
    descriptionKey: "auth.reset_steps.forgot_password_desc",
    route: "/forgot-password",
  },
  {
    emoji: "📩",
    titleKey: "auth.reset_steps.verify_email_title",
    descriptionKey: "auth.reset_steps.verify_email_desc",
    route: "/forgot-password/verify",
  },
  {
    emoji: "✍️",
    titleKey: "auth.reset_steps.create_password_title",
    descriptionKey: "auth.reset_steps.create_password_desc",
    route: "/forgot-password/new",
  },
  {
    emoji: "🚀",
    titleKey: "auth.reset_steps.welcome_title",
    descriptionKey: "auth.reset_steps.welcome_desc",
    route: "/forgot-password/welcome",
  },
]

export function getResetStepIndex(pathname: string) {
  const idx = RESET_STEPS.findIndex((s) => s.route === pathname)
  return idx === -1 ? 0 : idx
}
