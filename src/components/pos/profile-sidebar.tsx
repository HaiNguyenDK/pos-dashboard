import {
  ClipboardList,
  LogOut,
  MoreVertical,
  PieChart,
  Settings,
  Wallet,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export type ProfileTab = "analytics" | "account" | "report" | "transaction"

type MenuItem = {
  id: ProfileTab
  labelKey: string
  icon: typeof PieChart
}

const MENU: MenuItem[] = [
  { id: "analytics", labelKey: "profile.sidebar.analytics", icon: PieChart },
  { id: "account", labelKey: "profile.sidebar.account_setting", icon: Settings },
  { id: "report", labelKey: "profile.sidebar.report", icon: ClipboardList },
  { id: "transaction", labelKey: "profile.sidebar.transaction", icon: Wallet },
]

type Props = {
  active: ProfileTab
  onChange: (tab: ProfileTab) => void
  onLogout?: () => void
  className?: string
}

export function ProfileSidebar({ active, onChange, onLogout, className }: Props) {
  const { t } = useTranslation()
  return (
    <aside
      className={cn(
        "bg-background flex flex-col gap-5 rounded-2xl border p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("profile.sidebar.profile")}</h3>
        <button
          type="button"
          aria-label={t("common.more")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <MoreVertical className="size-4" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar className="size-24 ring-2 ring-blue-500 ring-offset-2">
          <AvatarFallback className="bg-slate-900 text-base font-semibold text-white">
            RJ
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-0.5 text-center">
          <div className="flex items-center gap-1.5 text-lg font-bold">
            Rijal
            <span aria-hidden="true">🍀</span>
          </div>
          <div className="text-muted-foreground text-xs">
            {t("profile.sidebar.owner_role")}
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {MENU.map((item) => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {t(item.labelKey)}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto border-t pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="text-muted-foreground hover:text-foreground flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors"
        >
          <LogOut className="size-4" />
          {t("common.log_out")}
        </button>
      </div>
    </aside>
  )
}
