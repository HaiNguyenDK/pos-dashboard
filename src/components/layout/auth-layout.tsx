import { Outlet } from "react-router-dom"

import { AuthSlider } from "@/components/auth/auth-slider"
import { LanguageSwitcher } from "@/components/language-switcher"

export function AuthLayout() {
  return (
    <div className="bg-background h-svh overflow-hidden p-3 md:p-4 lg:p-5">
      <div className="mx-auto grid h-full w-full max-w-350 gap-4 md:grid-cols-2 lg:gap-8">
        <div className="hidden md:block">
          <AuthSlider />
        </div>
        <div className="relative flex items-center justify-center overflow-y-auto">
          <div className="absolute top-4 right-4 z-10">
            <LanguageSwitcher variant="pill" />
          </div>
          <div className="w-full max-w-md py-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
