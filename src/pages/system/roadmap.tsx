import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Code2,
  Flame,
  Gauge,
  HardDrive,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Wrench,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"

type Phase = {
  id: string
  no: string
  name: string
  subtitle: string
  duration: string
  weeks: number
  startWeek: number
  icon: typeof Rocket
  color: string              // solid, for badges/bars
  softBg: string
  ring: string
  goal: string
  features: { title: string; detail: string; priority?: "must" | "should" }[]
  deliverable: string
  skipped?: string[]
}

const PHASES: Phase[] = [
  {
    id: "p0",
    no: "0",
    name: "Nền tảng",
    subtitle: "Foundation",
    duration: "2–3 tuần",
    weeks: 3,
    startWeek: 0,
    icon: HardDrive,
    color: "bg-slate-700",
    softBg: "bg-slate-50",
    ring: "ring-slate-200",
    goal:
      "Không bán được gì nếu thiếu. BE, DB, auth, GraphQL endpoint, FE wire up.",
    features: [
      { title: "Backend core", detail: "Node/Nest + PostgreSQL", priority: "must" },
      { title: "Auth thật", detail: "JWT + refresh + PIN flow", priority: "must" },
      {
        title: "GraphQL endpoint",
        detail: "10 schemas cốt lõi (Order, Bill, MenuItem, Table, Staff, Viewer)",
        priority: "must",
      },
      {
        title: "Seed + admin setup",
        detail: "Tạo quán, invite staff đầu tiên",
        priority: "must",
      },
      {
        title: "FE wire GraphQL",
        detail: "Apollo/urql, replace mocks hiện tại",
        priority: "must",
      },
      {
        title: "Hosting tối thiểu",
        detail: "FE Vercel, BE Railway/Fly, DB managed",
        priority: "must",
      },
    ],
    deliverable:
      "Nhân viên login PIN thật, xem menu trong DB thật. Mọi app chạy trên URL production.",
  },
  {
    id: "p1",
    no: "1",
    name: "MVP chạy quán đầu tiên",
    subtitle: "Go-live minimum",
    duration: "4–6 tuần",
    weeks: 5,
    startWeek: 3,
    icon: Rocket,
    color: "bg-rose-500",
    softBg: "bg-rose-50",
    ring: "ring-rose-200",
    goal:
      "Đủ để bán hàng thật 1 ngày từ mở → đóng. Không có → không launch được.",
    features: [
      {
        title: "Create order + add items + send kitchen",
        detail: "Flow chính xuyên suốt",
        priority: "must",
      },
      {
        title: "Checkout tiền mặt + VietQR",
        detail: "2 phương thức phổ biến nhất VN",
        priority: "must",
      },
      {
        title: "In bill nhiệt ESC/POS",
        detail: "WiFi printer tại quầy",
        priority: "must",
      },
      {
        title: "KDS bếp cơ bản",
        detail: "Nhận ticket + bump, 1 station",
        priority: "must",
      },
      {
        title: "Table status + sơ đồ bàn",
        detail: "Không nhận đơn chồng được",
        priority: "must",
      },
      {
        title: "Cashier shift X/Z report",
        detail: "Đối soát tiền cuối ca",
        priority: "must",
      },
      {
        title: "Menu CRUD",
        detail: "Manager update giá từ dashboard",
        priority: "must",
      },
      {
        title: "PIN login + 3 role",
        detail: "Owner / Waiter / Cashier",
        priority: "must",
      },
      {
        title: "Offline queue cơ bản",
        detail: "Cache mutation khi mất wifi 10s",
        priority: "should",
      },
    ],
    deliverable:
      "1 quán thật chạy được cả ngày với waiter + cashier + bếp. Không crash, không mất đơn.",
    skipped: [
      "Split bill",
      "Voucher",
      "Loyalty",
      "KDS station routing",
      "Booking",
      "Waitlist",
      "Guest QR",
      "Reviews",
      "HR",
      "Recipe",
    ],
  },
  {
    id: "p2",
    no: "2",
    name: "Làm quán đàng hoàng",
    subtitle: "Polish pain points",
    duration: "3–4 tuần",
    weeks: 4,
    startWeek: 8,
    icon: Wrench,
    color: "bg-orange-500",
    softBg: "bg-orange-50",
    ring: "ring-orange-200",
    goal: "MVP đủ bán nhưng cashier kêu ca nhiều. Fix pain để khách hài lòng.",
    features: [
      {
        title: "Split bill",
        detail: "Chia đều / chia theo món — F&B VN rất phổ biến",
        priority: "must",
      },
      {
        title: "Voucher + discount",
        detail: "Marketing cần promo code",
        priority: "must",
      },
      {
        title: "Loyalty basic",
        detail: "Lookup SĐT, cộng điểm tự động",
        priority: "should",
      },
      {
        title: "Reservation / booking",
        detail: "Tối cuối tuần cần đặt trước",
        priority: "must",
      },
      {
        title: "KDS station routing",
        detail: "Grill / Bar tách ticket cho quán >1 bếp",
        priority: "should",
      },
      {
        title: "Reprint + refund có PIN",
        detail: "Khách đổi ý, supervisor approve",
        priority: "must",
      },
      {
        title: "Move/merge table",
        detail: "Khách đổi chỗ / nhóm đông hơn",
        priority: "should",
      },
      {
        title: "E-receipt SMS/Email",
        detail: "Giảm giấy, khách thích",
        priority: "should",
      },
      {
        title: "Push noti waiter khi món ready",
        detail: "Giảm waiter chạy ra bếp hỏi",
        priority: "must",
      },
    ],
    deliverable: "Quán chạy mượt, khách hài lòng, cashier không cằn nhằn.",
  },
  {
    id: "p3",
    no: "3",
    name: "Compliance & mở rộng",
    subtitle: "Legal & scale-ready",
    duration: "3–4 tuần",
    weeks: 4,
    startWeek: 12,
    icon: Shield,
    color: "bg-amber-500",
    softBg: "bg-amber-50",
    ring: "ring-amber-200",
    goal:
      "Bắt buộc hợp pháp VN + mở khả năng mở thêm chi nhánh, giám sát tốt.",
    features: [
      {
        title: "Hoá đơn điện tử TCT",
        detail: "VNPT/Viettel/MISA — bắt buộc cho DN xuất VAT",
        priority: "must",
      },
      {
        title: "Card EMV SDK",
        detail: "VNPAY Terminal / Stripe / SumUp cho khách có thẻ",
        priority: "should",
      },
      {
        title: "Waitlist + SMS gọi khách",
        detail: "Giờ cao điểm hết bàn",
        priority: "must",
      },
      {
        title: "Low-stock alert + inventory count",
        detail: "Không bán món hết nguyên liệu",
        priority: "must",
      },
      {
        title: "Multi-terminal sync",
        detail: "2 máy POS cùng quán phải đồng bộ",
        priority: "must",
      },
      {
        title: "Backup + disaster recovery",
        detail: "DB snapshot hàng ngày, retention 30d",
        priority: "must",
      },
      {
        title: "Monitoring (Sentry + health)",
        detail: "Phát hiện sớm lỗi, alert",
        priority: "must",
      },
    ],
    deliverable: "Đủ pháp lý để xuất hoá đơn, scale được, giám sát tốt.",
  },
  {
    id: "p4",
    no: "4",
    name: "Tối ưu vận hành",
    subtitle: "Operations intelligence",
    duration: "4–5 tuần",
    weeks: 5,
    startWeek: 16,
    icon: Gauge,
    color: "bg-emerald-500",
    softBg: "bg-emerald-50",
    ring: "ring-emerald-200",
    goal: "Giúp chủ quán kiểm soát chi phí, ra quyết định data-driven.",
    features: [
      {
        title: "Recipe/BOM + auto-deduct stock",
        detail: "Kiểm soát COGS chính xác",
        priority: "must",
      },
      {
        title: "Suppliers + PO",
        detail: "Mua hàng có trace, lịch sử giá",
        priority: "should",
      },
      {
        title: "HR: staff list + shift schedule",
        detail: "Lên lịch ca trước tuần",
        priority: "must",
      },
      {
        title: "Clock in/out + timesheet",
        detail: "Chấm công tự động qua PIN",
        priority: "must",
      },
      {
        title: "Payroll preview",
        detail: "Tính lương cuối tháng",
        priority: "should",
      },
      {
        title: "Analytics nâng cao",
        detail: "Doanh thu theo giờ/món/nhân viên",
        priority: "must",
      },
      {
        title: "Trending + dead items report",
        detail: "Cân đối menu theo thực tế",
        priority: "should",
      },
    ],
    deliverable:
      "Chủ quán biết quán lời/lỗ theo món, biết nhân viên nào performance cao.",
  },
  {
    id: "p5",
    no: "5",
    name: "Customer-facing",
    subtitle: "Self-service",
    duration: "3 tuần",
    weeks: 3,
    startWeek: 21,
    icon: Smartphone,
    color: "bg-blue-500",
    softBg: "bg-blue-50",
    ring: "ring-blue-200",
    goal: "Sau khi nội bộ ổn, mở ra cho khách tự phục vụ. Giảm load waiter.",
    features: [
      {
        title: "Guest QR self-order",
        detail: "Khách quét QR bàn → tự order",
        priority: "must",
      },
      {
        title: "Pay-at-table QR",
        detail: "Khách không phải đợi bill",
        priority: "must",
      },
      {
        title: "Reviews + staff reply",
        detail: "Tăng rating Google/Facebook",
        priority: "should",
      },
      {
        title: "E-menu không có order",
        detail: "Bản đơn giản cho quán nhỏ",
        priority: "should",
      },
    ],
    deliverable: "Khách tự chủ trải nghiệm, giảm ~30% load waiter vào giờ cao điểm.",
  },
  {
    id: "p6",
    no: "6",
    name: "Multi-store & advanced",
    subtitle: "Only if scaling",
    duration: "4–6 tuần",
    weeks: 5,
    startWeek: 24,
    icon: Sparkles,
    color: "bg-violet-500",
    softBg: "bg-violet-50",
    ring: "ring-violet-200",
    goal: "Chỉ cần khi có 2+ chi nhánh hoặc franchise.",
    features: [
      { title: "Central menu across branches", detail: "1 menu → n quán", priority: "must" },
      { title: "Central reporting", detail: "Tổng hợp doanh thu đa chi nhánh", priority: "must" },
      { title: "Inter-branch inventory transfer", detail: "Mượn nguyên liệu giữa chi nhánh", priority: "should" },
      { title: "Franchise/owner dashboard", detail: "Chủ xem toàn bộ chuỗi", priority: "must" },
      { title: "Public API + webhooks", detail: "Partner TheFork, Shopee Food", priority: "should" },
    ],
    deliverable: "Chuỗi 3–10 quán vận hành tập trung.",
  },
]

const TOTAL_WEEKS = 29

type TeamRow = {
  phase: string
  be: number
  fe: number
  mobile: number
  devops: number
  qa: number
}
const TEAM: TeamRow[] = [
  { phase: "0 · Nền tảng", be: 2, fe: 1, mobile: 0, devops: 1, qa: 0 },
  { phase: "1 · MVP", be: 2, fe: 1, mobile: 1, devops: 0.5, qa: 1 },
  { phase: "2 · Polish", be: 2, fe: 1, mobile: 1, devops: 0, qa: 1 },
  { phase: "3 · Compliance", be: 2, fe: 0.5, mobile: 1, devops: 0.5, qa: 1 },
  { phase: "4 · Operations", be: 1, fe: 2, mobile: 0, devops: 0, qa: 1 },
  { phase: "5 · Customer", be: 1, fe: 1, mobile: 0.5, devops: 0, qa: 0.5 },
]

const DECISIONS = [
  { q: "BE stack", opts: ["Node+Nest", "Node+Apollo", "Go", "Python/FastAPI"], rec: "Node+Nest" },
  { q: "Database", opts: ["PostgreSQL", "MySQL"], rec: "PostgreSQL" },
  { q: "Hosting", opts: ["Railway/Render", "AWS", "GCP"], rec: "Railway cho MVP, AWS sau scale" },
  { q: "Mobile stack", opts: ["Kotlin/Compose native", "Expo/RN"], rec: "Kotlin native cho Android POS" },
  { q: "Payment provider #1", opts: ["VNPAY", "Napas", "MoMo"], rec: "VNPAY hoặc Napas" },
  { q: "E-invoice provider", opts: ["VNPT", "Viettel", "MISA", "EasyInvoice"], rec: "VNPT / MISA" },
  { q: "Quán pilot", opts: ["Tự mở", "Tìm đối tác"], rec: "Tìm đối tác để real-world test" },
]

export function SystemRoadmapPage() {
  const totalFeatures = PHASES.reduce((s, p) => s + p.features.length, 0)
  const musts = PHASES.reduce(
    (s, p) => s + p.features.filter((f) => f.priority === "must").length,
    0
  )
  return (
    <div className="flex flex-col gap-10">
      <Header total={totalFeatures} musts={musts} />
      <GanttView />
      <PhasesList />
      <TeamMatrix />
      <Decisions />
      <NextSteps />
    </div>
  )
}

function Header({ total, musts }: { total: number; musts: number }) {
  return (
    <header>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        <Target className="size-3.5" />
        Development Roadmap
      </div>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
        Plan phát triển theo chức năng
      </h1>
      <p className="mt-3 max-w-3xl text-base text-slate-600">
        <b>7 phases</b> từ zero đến chuỗi đa chi nhánh. Tháng thứ 2 đã có thể
        launch quán đầu tiên (Phase 1 MVP). Phase 0 là bắt buộc nền tảng.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Chip icon={Circle} label="Phases" value="7" tone="slate" />
        <Chip icon={Flame} label="Features" value={String(total)} tone="rose" />
        <Chip
          icon={AlertTriangle}
          label="Must-have"
          value={String(musts)}
          tone="amber"
        />
        <Chip icon={Rocket} label="Tuần tới MVP" value="8" tone="blue" />
      </div>
    </header>
  )
}

function Chip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Target
  label: string
  value: string
  tone: "slate" | "rose" | "amber" | "blue"
}) {
  const map = {
    slate: "bg-slate-50 border-slate-200 text-slate-800",
    rose: "bg-rose-50 border-rose-200 text-rose-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
  }
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3",
        map[tone]
      )}
    >
      <Icon className="size-5 opacity-80" />
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
          {label}
        </div>
        <div className="text-2xl font-black tabular-nums">{value}</div>
      </div>
    </div>
  )
}

function GanttView() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900">Timeline</h3>
          <p className="text-xs text-slate-500">
            Mỗi ô = 1 tuần · có overlap giữa các phase
          </p>
        </div>
        <div className="text-[10px] font-bold tabular-nums text-slate-400">
          0 ────────────── tuần ────────────── {TOTAL_WEEKS}
        </div>
      </div>

      {/* Month ruler */}
      <div
        className="grid border-b border-slate-200 pb-1 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500"
        style={{ gridTemplateColumns: `120px repeat(${TOTAL_WEEKS}, 1fr)` }}
      >
        <div />
        {Array.from({ length: TOTAL_WEEKS }).map((_, i) => {
          const month = Math.floor(i / 4) + 1
          const isFirst = i % 4 === 0
          return (
            <div
              key={i}
              className={cn(
                "text-center",
                isFirst ? "text-slate-700" : "text-slate-300"
              )}
            >
              {isFirst ? `T${month}` : ""}
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-2">
        {PHASES.map((p) => (
          <div
            key={p.id}
            className="grid items-center"
            style={{ gridTemplateColumns: `120px repeat(${TOTAL_WEEKS}, 1fr)` }}
          >
            <div className="flex items-center gap-2 pr-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white",
                  p.color
                )}
              >
                {p.no}
              </span>
              <span className="truncate text-xs font-bold text-slate-700">
                {p.name}
              </span>
            </div>
            <div
              className="relative col-span-full"
              style={{
                gridColumn: `2 / span ${TOTAL_WEEKS}`,
                display: "grid",
                gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)`,
                gap: 2,
              }}
            >
              {Array.from({ length: TOTAL_WEEKS }).map((_, i) => {
                const inside = i >= p.startWeek && i < p.startWeek + p.weeks
                return (
                  <div
                    key={i}
                    className={cn(
                      "h-6 rounded-sm",
                      inside
                        ? p.color
                        : "bg-slate-100"
                    )}
                    style={{ opacity: inside ? 1 : 0.6 }}
                  />
                )
              })}
              <div
                className="absolute inset-y-0 flex items-center gap-1 px-2 text-[10px] font-bold text-white drop-shadow-sm"
                style={{
                  left: `${(p.startWeek / TOTAL_WEEKS) * 100}%`,
                  width: `${(p.weeks / TOTAL_WEEKS) * 100}%`,
                }}
              >
                <span className="truncate">{p.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 p-3 ring-1 ring-blue-200">
        <Rocket className="size-4 shrink-0 text-blue-600" />
        <span className="text-xs text-blue-900">
          <b>Go-live điểm 1</b>: cuối tuần 8 (Phase 1 hoàn tất) ·{" "}
          <b>Go-live điểm 2</b>: cuối tuần 16 (Phase 3 compliance) có thể
          bán doanh nghiệp
        </span>
      </div>
    </section>
  )
}

function PhasesList() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        Chi tiết từng phase
      </h2>
      {PHASES.map((p, idx) => (
        <PhaseCard key={p.id} phase={p} index={idx} />
      ))}
    </section>
  )
}

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const musts = phase.features.filter((f) => f.priority === "must").length
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm ring-1",
        phase.ring
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1.5",
          phase.color
        )}
      />

      <div className="flex flex-wrap items-start gap-5">
        <div className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "flex size-16 items-center justify-center rounded-2xl text-white shadow-md",
              phase.color
            )}
          >
            <phase.icon className="size-7" />
          </div>
          <div className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-black text-white">
            PHASE {phase.no}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              {phase.name}
            </h3>
            <span className="text-sm font-semibold text-slate-500">
              {phase.subtitle}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 font-bold text-slate-700">
              ⏱ {phase.duration}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 font-bold text-rose-700">
              {musts} must
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 font-bold text-blue-700">
              {phase.features.length} features
            </span>
            {index === 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 font-bold text-white">
                Bắt buộc trước
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm text-slate-600">{phase.goal}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2">
        {phase.features.map((f) => (
          <div
            key={f.title}
            className={cn(
              "flex items-start gap-2.5 rounded-xl p-3",
              phase.softBg
            )}
          >
            <CheckCircle2
              className={cn(
                "mt-0.5 size-4 shrink-0",
                f.priority === "must" ? "text-rose-500" : "text-slate-400"
              )}
              strokeWidth={2.5}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">
                  {f.title}
                </span>
                {f.priority === "must" ? (
                  <span className="rounded bg-rose-500 px-1 py-0 text-[9px] font-black uppercase text-white">
                    MUST
                  </span>
                ) : (
                  <span className="rounded bg-slate-300 px-1 py-0 text-[9px] font-black uppercase text-slate-700">
                    NICE
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-600">{f.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-5 flex items-start gap-3 rounded-xl p-4",
          phase.color.replace("bg-", "bg-") + "/10"
        )}
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.04)",
        }}
      >
        <Zap className={cn("size-5 shrink-0", phase.color.replace("bg-", "text-"))} />
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Deliverable
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {phase.deliverable}
          </div>
        </div>
      </div>

      {phase.skipped && phase.skipped.length > 0 ? (
        <div className="mt-3 rounded-xl bg-slate-50 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Skip tạm (để phase sau)
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {phase.skipped.map((s) => (
              <span
                key={s}
                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 line-through"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}

function TeamMatrix() {
  const totals = TEAM.reduce(
    (acc, r) => ({
      be: acc.be + r.be,
      fe: acc.fe + r.fe,
      mobile: acc.mobile + r.mobile,
      devops: acc.devops + r.devops,
      qa: acc.qa + r.qa,
    }),
    { be: 0, fe: 0, mobile: 0, devops: 0, qa: 0 }
  )
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <Users className="size-5 text-slate-700" />
        <h3 className="text-xl font-black text-slate-900">Team allocation</h3>
      </div>
      <p className="mb-4 text-sm text-slate-600">
        Core team tối thiểu{" "}
        <b>
          {Math.ceil(
            Math.max(
              ...TEAM.map((r) => r.be + r.fe + r.mobile + r.devops + r.qa)
            )
          )}{" "}
          người
        </b>{" "}
        khi cao điểm. DevOps thường kiêm nhiệm.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 text-left font-bold">Phase</th>
              <th className="px-3 py-2 text-center font-bold">BE</th>
              <th className="px-3 py-2 text-center font-bold">FE</th>
              <th className="px-3 py-2 text-center font-bold">Mobile</th>
              <th className="px-3 py-2 text-center font-bold">DevOps</th>
              <th className="px-3 py-2 text-center font-bold">QA</th>
              <th className="px-3 py-2 text-right font-bold">Tổng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {TEAM.map((r) => {
              const total = r.be + r.fe + r.mobile + r.devops + r.qa
              return (
                <tr key={r.phase} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-semibold text-slate-900">
                    {r.phase}
                  </td>
                  <HeadcountCell value={r.be} color="bg-blue-500" />
                  <HeadcountCell value={r.fe} color="bg-emerald-500" />
                  <HeadcountCell value={r.mobile} color="bg-orange-500" />
                  <HeadcountCell value={r.devops} color="bg-violet-500" />
                  <HeadcountCell value={r.qa} color="bg-rose-500" />
                  <td className="px-3 py-2.5 text-right font-black tabular-nums text-slate-900">
                    {total}
                  </td>
                </tr>
              )
            })}
            <tr className="border-t-2 border-slate-300 bg-slate-50">
              <td className="px-3 py-2.5 font-black text-slate-900">
                Person-weeks tổng
              </td>
              {[totals.be, totals.fe, totals.mobile, totals.devops, totals.qa].map(
                (v, i) => (
                  <td
                    key={i}
                    className="px-3 py-2.5 text-center font-black tabular-nums text-slate-700"
                  >
                    {v.toFixed(1)}
                  </td>
                )
              )}
              <td className="px-3 py-2.5 text-right font-black tabular-nums text-slate-900">
                {(
                  totals.be + totals.fe + totals.mobile + totals.devops + totals.qa
                ).toFixed(1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

function HeadcountCell({ value, color }: { value: number; color: string }) {
  if (value === 0)
    return <td className="px-3 py-2.5 text-center text-slate-300">—</td>
  return (
    <td className="px-3 py-2.5 text-center">
      <span
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-full text-xs font-black text-white",
          color
        )}
      >
        {value}
      </span>
    </td>
  )
}

function Decisions() {
  return (
    <section className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="size-5 text-amber-600" />
        <h3 className="text-xl font-black text-slate-900">
          Quyết định cần chốt trước Phase 0
        </h3>
      </div>
      <p className="mb-4 text-sm text-slate-700">
        Những lựa chọn này ảnh hưởng cả codebase. <b>Không chốt = không bắt
        đầu được</b>.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {DECISIONS.map((d, i) => (
          <div
            key={d.q}
            className="flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-amber-200"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-white">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-900">{d.q}</div>
              <div className="mt-0.5 flex flex-wrap gap-1 text-[10px]">
                {d.opts.map((o) => (
                  <span
                    key={o}
                    className="rounded-full bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600"
                  >
                    {o}
                  </span>
                ))}
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-700">
                <CheckCircle2 className="size-3" />
                <span>
                  Đề xuất: <b>{d.rec}</b>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function NextSteps() {
  const items = [
    {
      icon: Code2,
      title: "Dựng BE skeleton",
      detail:
        "Nest/Node + Prisma + GraphQL · 1–2 entity mẫu + docker-compose",
    },
    {
      icon: CheckCircle2,
      title: "Viết Definition of Done Phase 1",
      detail: "Acceptance criteria cho 9 feature must-have + E2E test cases",
    },
    {
      icon: Gauge,
      title: "Estimate hạ tầng chi tiết",
      detail: "Cost tháng: Vercel + Railway + Postgres + Cloudflare + SMS",
    },
    {
      icon: Users,
      title: "Tuyển/phân công team Phase 0",
      detail: "JD BE + FE + DevOps · contract NDA + repository access",
    },
  ]
  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 text-white">
      <div className="mb-4 flex items-center gap-2">
        <Rocket className="size-5" />
        <h3 className="text-xl font-black">Bước tiếp theo</h3>
      </div>
      <p className="mb-4 text-sm text-slate-300">
        4 việc ngay sau khi chốt quyết định ở trên:
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((i) => (
          <div
            key={i.title}
            className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <i.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">{i.title}</div>
              <div className="mt-0.5 text-xs text-slate-300">{i.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
