import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowUpRight,
  ChevronsRight,
  ChevronsUpDown,
  Download,
  Eye,
  EyeOff,
  MessageSquare,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Settings as SettingsIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BILLS } from "@/mocks/bills"
import { formatCurrency } from "@/lib/format"
import type { PaymentMethod } from "@/types"

import {
  IncomeDonutChart,
  type DonutSegment,
} from "@/components/pos/income-donut-chart"
import {
  ProfileSidebar,
  type ProfileTab,
} from "@/components/pos/profile-sidebar"
import {
  SalesAreaChart,
  type SalesPoint,
} from "@/components/pos/sales-area-chart"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { MENU_ITEMS } from "@/mocks/menu"

type Stat = {
  labelKey: string
  value: string
  change: string
  emoji: string
  iconBg: string
  changeTone: "positive" | "negative"
}

const STATS: Stat[] = [
  {
    labelKey: "profile.analytics.stat_total_sale",
    value: "$24,064",
    change: "27.4%",
    emoji: "🔔",
    iconBg: "bg-blue-50",
    changeTone: "positive",
  },
  {
    labelKey: "profile.analytics.stat_total_order",
    value: "$24,064",
    change: "27.4%",
    emoji: "⏳",
    iconBg: "bg-amber-50",
    changeTone: "positive",
  },
  {
    labelKey: "profile.analytics.stat_total_revenue",
    value: "$24,064",
    change: "27.4%",
    emoji: "💰",
    iconBg: "bg-emerald-50",
    changeTone: "positive",
  },
  {
    labelKey: "profile.analytics.stat_cancelled_order",
    value: "$24,064",
    change: "27.4%",
    emoji: "📌",
    iconBg: "bg-rose-50",
    changeTone: "negative",
  },
]

const SALES_DATA: SalesPoint[] = [
  { month: "Jan", value: 420 },
  { month: "Feb", value: 250 },
  { month: "Mar", value: 620 },
  { month: "Apr", value: 2500 },
  { month: "May", value: 480 },
  { month: "Jun", value: 560 },
]

type IncomeSegment = DonutSegment & { nameKey: string }

const INCOME_SEGMENTS: IncomeSegment[] = [
  {
    name: "Main Course",
    nameKey: "profile.analytics.income_main_course",
    value: 8500,
    color: "#1E3A8A",
  },
  {
    name: "Beverage",
    nameKey: "profile.analytics.income_beverage",
    value: 4500,
    color: "#2563EB",
  },
  {
    name: "Others",
    nameKey: "profile.analytics.income_others",
    value: 2490,
    color: "#93C5FD",
  },
]

const TRANSACTIONS = [
  {
    id: "tx-1",
    name: "Tomato",
    date: "Wed, 04 Jun 2023",
    quality: "25/100",
    price: 30,
    gradient: "linear-gradient(135deg,#fecaca,#ef4444)",
    emoji: "🍅",
  },
  {
    id: "tx-2",
    name: "Egg",
    date: "Wed, 04 Jun 2023",
    quality: "45/100",
    price: 45,
    gradient: "linear-gradient(135deg,#fde68a,#f59e0b)",
    emoji: "🥚",
  },
  {
    id: "tx-3",
    name: "Meat",
    date: "Wed, 04 Jun 2023",
    quality: "85/100",
    price: 157,
    gradient: "linear-gradient(135deg,#fecaca,#b91c1c)",
    emoji: "🥩",
  },
  {
    id: "tx-4",
    name: "Fish",
    date: "Wed, 04 Jun 2023",
    quality: "85/100",
    price: 30,
    gradient: "linear-gradient(135deg,#bae6fd,#0ea5e9)",
    emoji: "🐟",
  },
  {
    id: "tx-5",
    name: "Chicken",
    date: "Wed, 04 Jun 2023",
    quality: "85/100",
    price: 30,
    gradient: "linear-gradient(135deg,#fef3c7,#d97706)",
    emoji: "🍗",
  },
  {
    id: "tx-6",
    name: "Chili",
    date: "Wed, 04 Jun 2023",
    quality: "85/100",
    price: 30,
    gradient: "linear-gradient(135deg,#fecaca,#dc2626)",
    emoji: "🌶️",
  },
  {
    id: "tx-7",
    name: "Lemon",
    date: "Wed, 04 Jun 2023",
    quality: "85/100",
    price: 30,
    gradient: "linear-gradient(135deg,#fef9c3,#eab308)",
    emoji: "🍋",
  },
]

const TRENDING = Array.from({ length: 5 }).map((_, i) => ({
  id: `tr-${i}`,
  item: MENU_ITEMS[i % MENU_ITEMS.length],
  orders: 150,
  change: "27.4%",
}))

const STUB_COPY: Record<
  Exclude<ProfileTab, "analytics" | "transaction">,
  { titleKey: string; bodyKey: string }
> = {
  account: {
    titleKey: "profile.account.title",
    bodyKey: "profile.account.subtitle",
  },
  report: {
    titleKey: "profile.report.title",
    bodyKey: "profile.report.heading",
  },
}

export function ProfilePage() {
  const [tab, setTab] = useState<ProfileTab>("analytics")
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
      <div className="flex min-w-0 flex-col gap-6">
        {tab === "analytics" ? (
          <AnalyticsView />
        ) : tab === "account" ? (
          <AccountSettingView />
        ) : tab === "report" ? (
          <ReportView />
        ) : tab === "transaction" ? (
          <TransactionView />
        ) : (
          <StubView tab={tab} />
        )}
      </div>

      <ProfileSidebar
        active={tab}
        onChange={setTab}
        onLogout={() => {
          toast.success(t("profile.logged_out"))
          navigate("/login")
        }}
        className="xl:sticky xl:top-20"
      />
    </div>
  )
}

function AnalyticsView() {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {t("profile.analytics.greeting", { name: "Rijal" })}{" "}
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("profile.analytics.subtitle")}
          </p>
        </div>
        <div className="relative mx-auto min-w-0 max-w-xl flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input placeholder={t("common.search")} className="h-11 rounded-full pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <CircleButton ariaLabel={t("common.messages")}>
            <MessageSquare className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rose-500" />
          </CircleButton>
          <CircleButton ariaLabel={t("common.settings")}>
            <SettingsIcon className="size-4" />
          </CircleButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.labelKey} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="bg-background flex flex-col gap-4 rounded-2xl border p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">
              {t("profile.analytics.sales_heading")}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="size-2 rounded-full bg-blue-500" />
                <span>{t("profile.analytics.income_legend")}</span>
              </div>
              <Select defaultValue="6m">
                <SelectTrigger className="data-[size=default]:h-9 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6m">
                    {t("profile.analytics.sales_period_6m")}
                  </SelectItem>
                  <SelectItem value="3m">
                    {t("profile.analytics.sales_period_3m")}
                  </SelectItem>
                  <SelectItem value="1m">
                    {t("profile.analytics.sales_period_1m")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SalesAreaChart data={SALES_DATA} defaultIndex={3} />
        </section>

        <section className="bg-background flex flex-col gap-4 rounded-2xl border p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">
              {t("profile.analytics.income_heading")}
            </h2>
            <Select defaultValue="jan">
              <SelectTrigger className="data-[size=default]:h-9 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jan">Jan</SelectItem>
                <SelectItem value="feb">Feb</SelectItem>
                <SelectItem value="mar">Mar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-center justify-between gap-4">
            <IncomeDonutChart segments={INCOME_SEGMENTS} />
            <ul className="flex flex-col gap-3 text-sm">
              {INCOME_SEGMENTS.map((s) => (
                <li key={s.nameKey} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span>{t(s.nameKey)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="bg-background flex flex-col gap-4 rounded-2xl border p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {t("profile.analytics.transactions_heading")}
            </h2>
            <Select defaultValue="recent">
              <SelectTrigger className="data-[size=default]:h-9 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">
                  {t("profile.analytics.sort_recent")}
                </SelectItem>
                <SelectItem value="oldest">
                  {t("profile.analytics.sort_oldest")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground border-b text-left text-xs">
                <tr>
                  <th className="pb-2 font-medium">
                    {t("profile.analytics.column_name_products")}
                  </th>
                  <th className="pb-2 font-medium">
                    {t("profile.analytics.column_date_time")}
                  </th>
                  <th className="pb-2 text-right font-medium">
                    {t("profile.analytics.column_price")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {TRANSACTIONS.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-lg"
                          style={{ backgroundImage: tx.gradient }}
                          aria-hidden="true"
                        >
                          {tx.emoji}
                        </div>
                        <span className="font-medium">{tx.name}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground py-3">{tx.date}</td>
                    <td className="py-3 text-right font-medium tabular-nums">
                      ${tx.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-background flex flex-col gap-3 rounded-2xl border p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {t("profile.analytics.trending_menu")}
            </h2>
            <button
              type="button"
              aria-label={t("common.more")}
              className="text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>
          <div className="flex flex-col divide-y">
            {TRENDING.map((row) => (
              <div key={row.id} className="flex items-center gap-3 py-2.5">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg text-lg"
                  style={{ backgroundImage: row.item.imageGradient }}
                  aria-hidden="true"
                >
                  {row.item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {row.item.name}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {t("profile.analytics.trending_order_label")} :{" "}
                    <span className="text-blue-600 font-medium">{row.orders}</span>
                  </div>
                </div>
                <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
                  {row.change}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function StubView({ tab }: { tab: Exclude<ProfileTab, "analytics" | "transaction"> }) {
  const { t } = useTranslation()
  const copy = STUB_COPY[tab]
  return (
    <section className="bg-background flex flex-col gap-2 rounded-2xl border p-8">
      <h1 className="text-2xl font-bold">{t(copy.titleKey)}</h1>
      <p className="text-muted-foreground text-sm">{t(copy.bodyKey)}</p>
    </section>
  )
}

const TRANSACTION_PAGE_SIZE = 7
const TRANSACTION_TOTAL_PAGES = 40

function TransactionView() {
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("recent")
  const [page, setPage] = useState(1)
  const [activeId, setActiveId] = useState<string>(TRANSACTIONS[0]?.id ?? "")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TRANSACTIONS
    return TRANSACTIONS.filter((tx) => tx.name.toLowerCase().includes(q))
  }, [query])

  const pageItems = filtered.slice(0, TRANSACTION_PAGE_SIZE)
  const pagesShown = [1, 2, 3, 4]

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold">{t("profile.transaction.title")}</h1>
        <div className="relative mx-auto min-w-0 max-w-xl flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("common.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-full pl-10"
          />
        </div>
        <Button
          type="button"
          onClick={() => toast.success(t("profile.transaction.add_product_toast"))}
          className={cn(
            "h-11 rounded-full bg-blue-50 px-5 text-blue-600 shadow-none",
            "hover:bg-blue-100 focus-visible:ring-blue-600"
          )}
        >
          <Plus className="mr-2 size-4" />
          {t("profile.transaction.add_product_button")}
        </Button>
        <Button
          type="button"
          onClick={() => toast.success(t("profile.transaction.downloaded_toast"))}
          className={cn(
            "h-11 rounded-full bg-blue-50 px-5 text-blue-600 shadow-none",
            "hover:bg-blue-100 focus-visible:ring-blue-600"
          )}
        >
          <Download className="mr-2 size-4" />
          {t("profile.transaction.download_button")}
        </Button>
      </div>

      <div className="bg-background rounded-2xl border">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-lg font-semibold">
            {t("profile.transaction.heading")}
          </h2>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="data-[size=default]:h-9 w-32 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                {t("profile.transaction.sort_recent")}
              </SelectItem>
              <SelectItem value="oldest">
                {t("profile.transaction.sort_oldest")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs">
              <tr>
                <th className="px-6 py-3 text-left font-medium">
                  {t("profile.transaction.column_product_name")}
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    {t("profile.transaction.column_date_time")}
                    <ChevronsUpDown className="size-3.5" />
                  </span>
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  {t("profile.transaction.column_quality")}
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  {t("profile.transaction.column_price")}
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  {t("profile.transaction.column_action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-muted-foreground px-6 py-10 text-center"
                  >
                    {t("profile.transaction.no_transactions")}
                  </td>
                </tr>
              ) : (
                pageItems.map((tx) => {
                  const isActive = tx.id === activeId
                  return (
                    <tr key={tx.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-xl"
                            style={{ backgroundImage: tx.gradient }}
                            aria-hidden="true"
                          >
                            {tx.emoji}
                          </div>
                          <span className="font-medium">{tx.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground px-6 py-4">{tx.date}</td>
                      <td className="text-muted-foreground px-6 py-4 tabular-nums">
                        {tx.quality}
                      </td>
                      <td className="px-6 py-4 font-medium tabular-nums">
                        ${tx.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveId(tx.id)}
                            aria-label={t("common.edit")}
                            className={cn(
                              "flex size-9 items-center justify-center rounded-lg transition-colors",
                              isActive
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "border-input border hover:bg-muted"
                            )}
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={t("common.more")}
                            className="border-input hover:bg-muted flex size-9 items-center justify-center rounded-lg border transition-colors"
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <span className="text-muted-foreground text-sm">
            {t("common.page_of", {
              current: page,
              total: TRANSACTION_TOTAL_PAGES,
            })}
          </span>
          <div className="flex items-center gap-1.5">
            {pagesShown.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  p === page
                    ? "bg-blue-600 text-white"
                    : "border-input border hover:bg-muted"
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, TRANSACTION_TOTAL_PAGES))
              }
              disabled={page >= TRANSACTION_TOTAL_PAGES}
              aria-label={t("common.next_page")}
              className={cn(
                "flex size-9 items-center justify-center rounded-full border transition-colors",
                "border-blue-500 text-blue-600 hover:bg-blue-50",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function StatCard({ stat }: { stat: Stat }) {
  const { t } = useTranslation()
  return (
    <div className="bg-background flex flex-col gap-4 rounded-2xl border p-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full text-lg",
            stat.iconBg
          )}
          aria-hidden="true"
        >
          {stat.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{t(stat.labelKey)}</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">
              {t("profile.analytics.stat_from_last_week")}
            </span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 font-medium",
                stat.changeTone === "positive"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              )}
            >
              {stat.change}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold tabular-nums">{stat.value}</span>
        <ArrowUpRight className="size-5 text-emerald-500" />
      </div>
    </div>
  )
}

function CircleButton({
  children,
  ariaLabel,
}: {
  children: React.ReactNode
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="border-input bg-background hover:bg-muted/50 relative flex size-11 items-center justify-center rounded-full border transition-colors"
    >
      {children}
    </button>
  )
}

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: "Cash",
  card: "Debit/Credit card",
  qr: "Qris",
  ewallet: "E-wallet",
}

const REPORT_PAGE_SIZE = 9

function formatReportDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}

function ReportView() {
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [range, setRange] = useState("daily")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return BILLS
    return BILLS.filter((b) =>
      PAYMENT_LABEL[b.paymentMethod].toLowerCase().includes(q)
    )
  }, [query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / REPORT_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * REPORT_PAGE_SIZE
    return filtered.slice(start, start + REPORT_PAGE_SIZE)
  }, [filtered, currentPage])

  const pagesShown = useMemo(() => {
    const windowSize = 4
    const start = Math.max(
      1,
      Math.min(currentPage - 1, totalPages - windowSize + 1)
    )
    const end = Math.min(start + windowSize - 1, totalPages)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages])

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold">{t("profile.report.title")}</h1>
        <div className="relative mx-auto min-w-0 max-w-xl flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("common.search")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            className="h-11 rounded-full pl-10"
          />
        </div>
        <Button
          type="button"
          onClick={() => toast.success(t("profile.report.report_downloaded"))}
          className={cn(
            "h-11 rounded-full bg-blue-50 px-5 text-blue-600 shadow-none",
            "hover:bg-blue-100 focus-visible:ring-blue-600"
          )}
        >
          <Download className="mr-2 size-4" />
          {t("profile.report.download_button")}
        </Button>
      </div>

      <div className="bg-background rounded-2xl border">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-lg font-semibold">{t("profile.report.heading")}</h2>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="data-[size=default]:h-9 w-28 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{t("profile.report.range_daily")}</SelectItem>
              <SelectItem value="weekly">
                {t("profile.report.range_weekly")}
              </SelectItem>
              <SelectItem value="monthly">
                {t("profile.report.range_monthly")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    {t("profile.report.column_date_time")}
                    <ChevronsUpDown className="size-3.5" />
                  </span>
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  {t("profile.report.column_payment_method")}
                </th>
                <th className="px-6 py-3 text-right font-medium">
                  {t("profile.report.column_total_collected")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-muted-foreground px-6 py-10 text-center"
                  >
                    {t("profile.report.no_records")}
                  </td>
                </tr>
              ) : (
                pageItems.map((bill) => (
                  <tr key={bill.id} className="hover:bg-muted/30">
                    <td className="text-muted-foreground px-6 py-4">
                      {formatReportDate(bill.paidAt)}
                    </td>
                    <td className="text-muted-foreground px-6 py-4">
                      {PAYMENT_LABEL[bill.paymentMethod]}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-blue-600 tabular-nums">
                      {formatCurrency(bill.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <span className="text-muted-foreground text-sm">
            {t("common.page_of", { current: currentPage, total: totalPages })}
          </span>
          <div className="flex items-center gap-1.5">
            {pagesShown.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  p === currentPage
                    ? "bg-blue-600 text-white"
                    : "border-input border hover:bg-muted"
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              aria-label={t("common.next_page")}
              className={cn(
                "flex size-9 items-center justify-center rounded-full border transition-colors",
                "border-blue-500 text-blue-600 hover:bg-blue-50",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}


function AccountSettingView() {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{t("profile.account.title")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("profile.account.subtitle")}
          </p>
        </div>
        <div className="relative mx-auto min-w-0 max-w-xl flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input placeholder={t("common.search")} className="h-11 rounded-full pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <CircleButton ariaLabel={t("common.messages")}>
            <MessageSquare className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rose-500" />
          </CircleButton>
          <CircleButton ariaLabel={t("common.settings")}>
            <SettingsIcon className="size-4" />
          </CircleButton>
        </div>
      </div>
      <ProfileSettingCard />
      <UpdatePasswordCard />
    </>
  )
}

function ProfileSettingCard() {
  const { t } = useTranslation()
  const [name, setName] = useState("Kopag resto")
  const [email, setEmail] = useState("kopag@resto.id")
  const [phone, setPhone] = useState("+62 8123456789")
  const [address, setAddress] = useState("Bogor - Jawa Barat")

  const handleUpdate = () => {
    if (!name.trim()) {
      toast.error(t("profile.account.name_required"))
      return
    }
    toast.success(t("profile.account.profile_updated"))
  }

  const handleCancel = () => {
    setName("Kopag resto")
    setEmail("kopag@resto.id")
    setPhone("+62 8123456789")
    setAddress("Bogor - Jawa Barat")
  }

  return (
    <section className="bg-background flex flex-col gap-5 rounded-2xl border p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold">
          {t("profile.account.profile_setting_title")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("profile.account.profile_setting_subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FieldInput
          id="profile-name"
          label={t("profile.account.field_name")}
          value={name}
          onChange={setName}
        />
        <FieldInput
          id="profile-email"
          label={t("profile.account.field_email")}
          type="email"
          value={email}
          onChange={setEmail}
        />
        <FieldInput
          id="profile-phone"
          label={t("profile.account.field_phone")}
          value={phone}
          onChange={setPhone}
        />
        <FieldInput
          id="profile-address"
          label={t("profile.account.field_address")}
          value={address}
          onChange={setAddress}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="h-11 min-w-28 rounded-full font-medium"
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="button"
          onClick={handleUpdate}
          className={cn(
            "h-11 min-w-32 rounded-full bg-blue-600 font-semibold text-white shadow-none",
            "hover:bg-blue-700 focus-visible:ring-blue-600"
          )}
        >
          {t("common.update")}
        </Button>
      </div>
    </section>
  )
}

function UpdatePasswordCard() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)

  const handleUpdate = () => {
    if (!current.trim() || !next.trim()) {
      toast.error(t("profile.account.passwords_required"))
      return
    }
    toast.success(t("profile.account.password_updated"))
    setCurrent("")
    setNext("")
  }

  const handleCancel = () => {
    setCurrent("")
    setNext("")
  }

  return (
    <section className="bg-background flex flex-col gap-5 rounded-2xl border p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold">{t("profile.account.password_title")}</h2>
        <p className="text-muted-foreground text-sm">
          {t("profile.account.password_subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PasswordField
          id="current-password"
          label={t("profile.account.current_password_label")}
          placeholder={t("profile.account.current_password_placeholder")}
          value={current}
          onChange={setCurrent}
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
        />
        <PasswordField
          id="new-password"
          label={t("profile.account.new_password_label")}
          placeholder={t("profile.account.new_password_placeholder")}
          value={next}
          onChange={setNext}
          show={showNext}
          onToggle={() => setShowNext((v) => !v)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="h-11 min-w-28 rounded-full font-medium"
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="button"
          onClick={handleUpdate}
          className={cn(
            "h-11 min-w-32 rounded-full bg-blue-600 font-semibold text-white shadow-none",
            "hover:bg-blue-700 focus-visible:ring-blue-600"
          )}
        >
          {t("common.update")}
        </Button>
      </div>
    </section>
  )
}

function FieldInput({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl"
      />
    </div>
  )
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  show,
  onToggle,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 rounded-xl pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? t("common.hide_password") : t("common.show_password")}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
        >
          {show ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </div>
    </div>
  )
}

