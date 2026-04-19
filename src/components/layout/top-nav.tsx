import { useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import {
  Bell,
  BookOpen,
  Briefcase,
  ChevronDown,
  ClipboardList,
  Clock,
  FolderOpen,
  IdCard,
  LayoutGrid,
  Menu,
  MessageSquareQuote,
  Package,
  Receipt,
  ShoppingCart,
  UserSquare2,
  Users,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { KopagLogo } from "@/components/brand/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type NavLeaf = {
  to: string
  labelKey: string
  icon: typeof LayoutGrid
}

type NavGroup = {
  labelKey: string
  icon: typeof LayoutGrid
  items: NavLeaf[]
}

const DIRECT: NavLeaf = {
  to: "/dashboard",
  labelKey: "nav.dashboard",
  icon: LayoutGrid,
}

const GROUPS: NavGroup[] = [
  {
    labelKey: "nav.group_sales",
    icon: ShoppingCart,
    items: [
      { to: "/orders", labelKey: "nav.order_list", icon: ClipboardList },
      { to: "/bills", labelKey: "nav.bills", icon: Receipt },
      { to: "/history", labelKey: "nav.history", icon: Clock },
    ],
  },
  {
    labelKey: "nav.group_customers",
    icon: UserSquare2,
    items: [
      { to: "/queue", labelKey: "nav.queue", icon: Users },
      { to: "/bookings", labelKey: "nav.bookings", icon: BookOpen },
      { to: "/reviews", labelKey: "nav.reviews", icon: MessageSquareQuote },
    ],
  },
  {
    labelKey: "nav.group_management",
    icon: Briefcase,
    items: [
      { to: "/products", labelKey: "nav.products_management", icon: FolderOpen },
      { to: "/inventory", labelKey: "nav.inventory", icon: Package },
      { to: "/hr", labelKey: "nav.hr", icon: IdCard },
    ],
  },
]

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/")
  const groupActive = (g: NavGroup) => g.items.some((i) => isActive(i.to))

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-white px-4 md:gap-2 md:px-6 dark:bg-background">
      <KopagLogo />

      <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
        <NavLink
          to={DIRECT.to}
          className={({ isActive: a }) =>
            cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              a
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          <DIRECT.icon className="size-4" />
          {t(DIRECT.labelKey)}
        </NavLink>

        {GROUPS.map((g) => {
          const active = groupActive(g)
          return (
            <DropdownMenu key={g.labelKey}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "data-[state=open]:bg-muted",
                    active
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <g.icon className="size-4" />
                  {t(g.labelKey)}
                  <ChevronDown className="size-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" sideOffset={8} className="w-56">
                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t(g.labelKey)}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {g.items.map((item) => {
                  const itemActive = isActive(item.to)
                  return (
                    <DropdownMenuItem key={item.to} asChild>
                      <Link
                        to={item.to}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium",
                          itemActive
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40"
                            : "text-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "size-4",
                            itemActive
                              ? "text-blue-600"
                              : "text-muted-foreground"
                          )}
                        />
                        {t(item.labelKey)}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}
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
            <MobileLink item={DIRECT} onClick={() => setMenuOpen(false)} />
            {GROUPS.map((g) => (
              <div key={g.labelKey} className="mt-2">
                <div className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t(g.labelKey)}
                </div>
                {g.items.map((it) => (
                  <MobileLink
                    key={it.to}
                    item={it}
                    onClick={() => setMenuOpen(false)}
                  />
                ))}
              </div>
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

function MobileLink({
  item,
  onClick,
}: {
  item: NavLeaf
  onClick: () => void
}) {
  const { t } = useTranslation()
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
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
  )
}
