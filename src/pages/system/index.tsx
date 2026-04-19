import { Link } from "react-router-dom"
import {
  ArrowRight,
  ChefHat,
  ClipboardList,
  Crown,
  Database,
  HandPlatter,
  Hash,
  Laptop,
  ListChecks,
  Network,
  QrCode,
  Smartphone,
  Tablet,
  UserCog,
  Users,
  Utensils,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"

export function SystemIndexPage() {
  return (
    <div className="flex flex-col gap-12">
      <Hero />
      <SectionApps />
      <SectionPersonas />
      <SectionPillars />
      <SectionExploreNext />
    </div>
  )
}

function Hero() {
  return (
    <section className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
        <Network className="size-3.5" />
        System Overview
      </div>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
        Kopag POS — Hệ thống vận hành <br />
        <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          nhà hàng end-to-end
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
        Một nền tảng kết nối <b>4 ứng dụng</b>, phục vụ <b>6 vai trò</b> trong
        chuỗi vận hành: từ lúc khách quét QR tại bàn đến lúc bill được in &
        điểm thưởng được cộng.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
        <Stat label="Apps" value="4" />
        <Stat label="Roles" value="6" />
        <Stat label="Touchpoints" value="14" />
        <Stat label="GraphQL ops" value="80+" />
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
      <span className="font-black text-slate-900 tabular-nums">{value}</span>
      <span className="font-medium text-slate-500">{label}</span>
    </span>
  )
}

function SectionApps() {
  const apps = [
    {
      icon: Laptop,
      label: "Dashboard Web",
      sub: "Manager / Cashier · Desktop",
      color: "from-blue-500 to-blue-700",
      uses: ["Báo cáo", "Quản lý menu", "Đặt bàn", "HR", "Kho", "Đánh giá"],
      href: "/dashboard",
    },
    {
      icon: Smartphone,
      label: "Mobile POS",
      sub: "Waiter handheld · Android",
      color: "from-orange-500 to-amber-600",
      uses: ["Order tại bàn", "Gửi bếp", "Thanh toán pay-at-table", "Print bill"],
      href: "/mobile",
    },
    {
      icon: Tablet,
      label: "KDS Tablet",
      sub: "Chef / Bartender · Landscape",
      color: "from-slate-700 to-slate-900",
      uses: ["Nhận ticket", "Bump khi xong", "Báo hết món", "All-day summary"],
      href: "/kds",
    },
    {
      icon: QrCode,
      label: "Customer QR App",
      sub: "Guest phone · Public web",
      color: "from-rose-500 to-fuchsia-600",
      uses: ["Quét QR bàn", "Tự gọi món", "Thanh toán QR", "Đánh giá"],
      href: "/guest/t-03",
    },
  ]

  return (
    <section>
      <SectionTitle
        eyebrow="Architecture"
        title="4 ứng dụng — 1 backend"
        subtitle="Mỗi vai trò có giao diện chuyên biệt, tất cả nói chuyện qua cùng một GraphQL API."
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {apps.map((a) => (
          <Link
            key={a.label}
            to={a.href}
            className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-lg"
          >
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                a.color
              )}
            >
              <a.icon className="size-6" />
            </div>
            <div>
              <div className="text-base font-black text-slate-900">{a.label}</div>
              <div className="text-[11px] text-slate-500">{a.sub}</div>
            </div>
            <ul className="flex flex-col gap-1 text-xs text-slate-600">
              {a.uses.map((u) => (
                <li key={u} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-slate-400" />
                  {u}
                </li>
              ))}
            </ul>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
              Mở app <ArrowRight className="size-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <SystemDiagram />
      </div>
    </section>
  )
}

function SystemDiagram() {
  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Laptop, label: "Dashboard", color: "bg-blue-500" },
          { icon: Smartphone, label: "Mobile POS", color: "bg-orange-500" },
          { icon: Tablet, label: "KDS", color: "bg-slate-800" },
          { icon: QrCode, label: "Guest QR", color: "bg-rose-500" },
        ].map((a) => (
          <div key={a.label} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-xl text-white shadow-md",
                a.color
              )}
            >
              <a.icon className="size-5" />
            </div>
            <div className="text-[11px] font-semibold text-slate-700">
              {a.label}
            </div>
          </div>
        ))}
      </div>

      <div className="my-4 flex items-center justify-center gap-2">
        <div className="h-12 w-px bg-slate-300" />
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          GraphQL · WebSocket · Auth
        </div>
        <div className="h-12 w-px bg-slate-300" />
      </div>

      <div className="mx-auto flex max-w-2xl items-center justify-around rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/30">
            <Database className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold opacity-80">Backend</div>
            <div className="text-base font-black">GraphQL API + Subscriptions</div>
          </div>
        </div>
        <div className="hidden text-[11px] text-slate-300 md:block">
          PostgreSQL · Redis · S3
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="h-12 w-px bg-slate-300" />
      </div>

      <div className="mx-auto flex max-w-2xl items-center justify-around rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <Integration label="VietQR" icon="🏦" />
        <Integration label="VNPAY/MoMo" icon="💳" />
        <Integration label="Hoá đơn ĐT" icon="🧾" />
        <Integration label="SMS Brand" icon="📱" />
      </div>
      <div className="mt-2 text-center text-[10px] text-slate-500">
        ↑ Tích hợp dịch vụ ngoài
      </div>
    </div>
  )
}

function Integration({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-semibold text-slate-700">{label}</span>
    </div>
  )
}

function SectionPersonas() {
  const personas = [
    {
      icon: Crown,
      label: "Chủ / Quản lý",
      apps: ["Dashboard"],
      tasks: "Báo cáo, lịch nhân sự, kho, voucher, KDS overview",
      color: "bg-violet-100 text-violet-700",
    },
    {
      icon: Users,
      label: "Lễ tân",
      apps: ["Dashboard"],
      tasks: "Hàng đợi, đặt bàn, gọi SMS, chia bàn",
      color: "bg-teal-100 text-teal-700",
    },
    {
      icon: HandPlatter,
      label: "Phục vụ",
      apps: ["Mobile POS"],
      tasks: "Chọn bàn, gọi món, gửi bếp, pay-at-table",
      color: "bg-amber-100 text-amber-700",
    },
    {
      icon: ChefHat,
      label: "Đầu bếp / Bar",
      apps: ["KDS"],
      tasks: "Nhận ticket, bump khi xong, báo hết món",
      color: "bg-rose-100 text-rose-700",
    },
    {
      icon: Wallet,
      label: "Thu ngân",
      apps: ["Dashboard", "Mobile POS"],
      tasks: "Tính tiền, chia bill, in bill, X/Z report",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: Smartphone,
      label: "Khách hàng",
      apps: ["Guest QR"],
      tasks: "Quét QR bàn, tự gọi món, thanh toán, đánh giá",
      color: "bg-blue-100 text-blue-700",
    },
  ]

  return (
    <section>
      <SectionTitle
        eyebrow="Personas"
        title="6 vai trò trong nhà hàng"
        subtitle="Mỗi vai trò chỉ tiếp xúc với 1–2 app nên giao diện được tối giản theo công việc thực tế."
      />

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {personas.map((p) => (
          <article
            key={p.label}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl",
                p.color
              )}
            >
              <p.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold text-slate-900">{p.label}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {p.apps.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700"
                  >
                    {a}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-600">{p.tasks}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function SectionPillars() {
  const pillars = [
    {
      icon: HandPlatter,
      title: "Trải nghiệm khách",
      points: [
        "Self-order qua QR",
        "Thanh toán nhanh (QR / counter)",
        "Tích điểm tự động",
        "Đánh giá ngay sau bữa",
      ],
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Utensils,
      title: "Vận hành tại quán",
      points: [
        "Bếp KDS theo station",
        "Pay-at-table giảm chờ",
        "Hàng đợi thông minh",
        "Auto-trừ kho theo công thức",
      ],
      color: "from-emerald-500 to-emerald-700",
    },
    {
      icon: UserCog,
      title: "Quản lý từ xa",
      points: [
        "Báo cáo real-time",
        "Cảnh báo low-stock",
        "Lịch nhân viên",
        "Quản lý đa chi nhánh",
      ],
      color: "from-violet-500 to-violet-700",
    },
    {
      icon: Network,
      title: "Tích hợp mở",
      points: [
        "GraphQL API",
        "Subscription real-time",
        "Webhook 3rd-party",
        "Hoá đơn điện tử TCT",
      ],
      color: "from-amber-500 to-orange-600",
    },
  ]

  return (
    <section>
      <SectionTitle
        eyebrow="Value pillars"
        title="4 trụ cột của hệ thống"
      />
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                p.color
              )}
            >
              <p.icon className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{p.title}</h3>
              <ul className="mt-2 space-y-1">
                {p.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-1.5 text-xs text-slate-600"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-slate-400" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionExploreNext() {
  const next = [
    {
      to: "/system/journey",
      title: "Hành trình khách hàng",
      desc: "7 stages từ đặt bàn đến đánh giá",
      icon: ListChecks,
      color: "bg-blue-500",
    },
    {
      to: "/system/operations",
      title: "Vận hành 1 ngày",
      desc: "Timeline 8AM → 11PM theo phòng ban",
      icon: ClipboardList,
      color: "bg-emerald-500",
    },
    {
      to: "/system/data-flow",
      title: "Luồng dữ liệu đơn",
      desc: "1 đơn hàng đi qua 4 app + BE",
      icon: Hash,
      color: "bg-violet-500",
    },
  ]
  return (
    <section>
      <SectionTitle eyebrow="Khám phá tiếp" title="Đào sâu hơn" />
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {next.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md"
          >
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-xl text-white shadow-sm",
                n.color
              )}
            >
              <n.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-900">{n.title}</div>
              <div className="mt-0.5 text-xs text-slate-500">{n.desc}</div>
            </div>
            <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
          </Link>
        ))}
      </div>
    </section>
  )
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {eyebrow}
      </div>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 max-w-3xl text-sm text-slate-600">{subtitle}</p>
      ) : null}
    </div>
  )
}

