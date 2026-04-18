import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import {
  Bell,
  ClipboardList,
  Clock,
  FolderOpen,
  LayoutGrid,
  Menu,
  Receipt,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { KopagLogo } from "@/components/brand/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type NavItem = {
  to: string
  labelKey: string
  icon: typeof LayoutGrid
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutGrid },
  { to: "/orders", labelKey: "nav.order_list", icon: ClipboardList },
  { to: "/history", labelKey: "nav.history", icon: Clock },
  { to: "/bills", labelKey: "nav.bills", icon: Receipt },
  { to: "/products", labelKey: "nav.products_management", icon: FolderOpen },
]

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-white px-4 md:gap-4 md:px-6 dark:bg-background">
      <KopagLogo />

      <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="size-4" />
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1 md:hidden" />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full md:hidden"
            aria-label={t("nav.open_menu")}
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle className="flex items-center">
              <KopagLogo />
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="size-4" />
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <LanguageSwitcher />

      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        aria-label={t("nav.notifications", { defaultValue: "Notifications" })}
      >
        <Bell className="size-4" />
      </Button>

      <Link
        to="/profile"
        aria-label={t("nav.open_profile")}
        className="rounded-full ring-offset-2 transition-shadow hover:ring-2 hover:ring-blue-500"
      >
        <Avatar className="size-9">
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  )
}
