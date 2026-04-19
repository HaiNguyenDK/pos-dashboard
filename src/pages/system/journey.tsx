import {
  ArrowDown,
  Bell,
  CalendarCheck,
  ChefHat,
  Heart,
  ListChecks,
  MapPin,
  QrCode,
  ScanLine,
  Smartphone,
  Sparkles,
  Star,
  Utensils,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"

type Stage = {
  no: number
  emoji: string
  title: string
  duration: string
  desc: string
  actorIcons: { icon: typeof MapPin; label: string }[]
  apps: string[]
  events: string[]
  feeling?: { score: number; label: string }
  color: string
  bg: string
}

const STAGES: Stage[] = [
  {
    no: 1,
    emoji: "📅",
    title: "Trước khi đến",
    duration: "−1 ngày → −1 giờ",
    desc: "Khách đặt bàn online, nhận SMS xác nhận, có thể được nhắc trước 2h.",
    actorIcons: [
      { icon: Smartphone, label: "Khách (web/app)" },
      { icon: CalendarCheck, label: "Lễ tân duyệt" },
    ],
    apps: ["Customer web", "Dashboard"],
    events: [
      "createBooking",
      "confirmBooking → SMS xác nhận",
      "sendBookingReminder (auto −2h)",
    ],
    feeling: { score: 4, label: "Háo hức" },
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50/50 border-blue-200",
  },
  {
    no: 2,
    emoji: "🚪",
    title: "Đến quán",
    duration: "0 → 5 phút",
    desc: "Lễ tân chào, check booking. Nếu chưa có bàn → vào hàng đợi.",
    actorIcons: [
      { icon: MapPin, label: "Khách đến" },
      { icon: Heart, label: "Lễ tân chào" },
    ],
    apps: ["Dashboard"],
    events: [
      "markBookingArrived → tạo Order",
      "createWaitlistEntry (nếu hết bàn)",
      "notifyWaitlistEntry (SMS gọi)",
    ],
    feeling: { score: 5, label: "Được chào đón" },
    color: "from-teal-500 to-teal-700",
    bg: "bg-teal-50/50 border-teal-200",
  },
  {
    no: 3,
    emoji: "🪑",
    title: "Ngồi vào bàn",
    duration: "5 → 10 phút",
    desc: "Khách ngồi xuống. 2 lựa chọn: tự quét QR menu hoặc waiter cầm POS đến phục vụ.",
    actorIcons: [
      { icon: ScanLine, label: "Khách quét QR" },
      { icon: Smartphone, label: "Waiter cầm POS" },
    ],
    apps: ["Customer QR", "Mobile POS"],
    events: ["startGuestSession", "createOrder (waiter)"],
    feeling: { score: 4, label: "Tò mò" },
    color: "from-orange-500 to-amber-600",
    bg: "bg-amber-50/50 border-amber-200",
  },
  {
    no: 4,
    emoji: "🍔",
    title: "Gọi món",
    duration: "10 → 15 phút",
    desc: "Khách chọn món có modifier, ghi chú. Cart submit → bếp nhận ticket ngay.",
    actorIcons: [
      { icon: ListChecks, label: "Khách chọn món" },
      { icon: Utensils, label: "Waiter xác nhận" },
      { icon: ChefHat, label: "Bếp nhận" },
    ],
    apps: ["Customer QR", "Mobile POS", "KDS"],
    events: ["addOrderItems → ticketCreated", "kitchen ticket appears trên KDS"],
    feeling: { score: 5, label: "Hứng thú" },
    color: "from-rose-500 to-fuchsia-600",
    bg: "bg-rose-50/50 border-rose-200",
  },
  {
    no: 5,
    emoji: "👨‍🍳",
    title: "Đợi & ăn",
    duration: "15 → 60 phút",
    desc: "Bếp nấu theo timer KDS. Bump khi xong → waiter nhận push noti → bưng ra bàn.",
    actorIcons: [
      { icon: ChefHat, label: "Bếp chế biến" },
      { icon: Bell, label: "Waiter nhận noti" },
      { icon: Utensils, label: "Phục vụ món" },
    ],
    apps: ["KDS", "Mobile POS"],
    events: [
      "startTicket / bumpTicket",
      "ticketUpdated → notification cho waiter",
      "Khách có thể callStaff khi cần",
    ],
    feeling: { score: 4, label: "Hài lòng" },
    color: "from-violet-500 to-purple-700",
    bg: "bg-violet-50/50 border-violet-200",
  },
  {
    no: 6,
    emoji: "💳",
    title: "Thanh toán",
    duration: "60 → 65 phút",
    desc: "Khách yêu cầu bill. Có thể chia bill, áp voucher, gắn loyalty. Trả tại bàn QR/cash hoặc lên quầy.",
    actorIcons: [
      { icon: Wallet, label: "Waiter / Thu ngân" },
      { icon: QrCode, label: "Khách quét QR" },
      { icon: Sparkles, label: "Tích điểm" },
    ],
    apps: ["Mobile POS", "Dashboard"],
    events: [
      "applyVoucher / attachCustomerToOrder",
      "splitOrder (nếu chia)",
      "checkoutOrder → Bill + receiptUrl",
      "stockMovement auto deduct",
    ],
    feeling: { score: 4, label: "Nhanh gọn" },
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50/50 border-emerald-200",
  },
  {
    no: 7,
    emoji: "⭐",
    title: "Sau khi rời quán",
    duration: "+5 phút → +∞",
    desc: "Khách nhận e-receipt qua SMS/email, được mời đánh giá ngay trong app QR. Điểm vào tài khoản loyalty.",
    actorIcons: [
      { icon: Smartphone, label: "Khách feedback" },
      { icon: Star, label: "Quản lý reply" },
    ],
    apps: ["Customer QR", "Dashboard"],
    events: [
      "sendReceipt (SMS/Email)",
      "createReview → quản lý nhận noti",
      "Loyalty points cộng",
    ],
    feeling: { score: 5, label: "Sẽ quay lại" },
    color: "from-amber-500 to-orange-600",
    bg: "bg-orange-50/50 border-orange-200",
  },
]

export function SystemJourneyPage() {
  const totalMinutes = 70
  const happyMoments = STAGES.filter((s) => s.feeling && s.feeling.score >= 4)
    .length
  return (
    <div className="flex flex-col gap-10">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Customer Journey
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Hành trình khách hàng — 7 chặng
        </h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600">
          Mỗi chặng đều ghi rõ <b>ai làm gì</b>, <b>app nào</b>, và <b>event
          backend</b> được kích hoạt. Tổng trải nghiệm trung bình{" "}
          <b className="text-slate-900">{totalMinutes} phút</b>, với{" "}
          <b className="text-slate-900">{happyMoments}/7 chặng</b> đạt mức hài
          lòng cao.
        </p>
      </header>

      <SatisfactionCurve />

      <div className="flex flex-col gap-6">
        {STAGES.map((s, i) => (
          <div key={s.no} className="flex flex-col items-center">
            <StageCard stage={s} />
            {i < STAGES.length - 1 ? (
              <div className="my-2 flex flex-col items-center text-slate-300">
                <ArrowDown className="size-5" />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Outcomes />
    </div>
  )
}

function SatisfactionCurve() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          Đường cong cảm xúc khách
        </h3>
        <span className="text-[11px] text-slate-500">
          (theo từng chặng · 1–5)
        </span>
      </div>
      <div className="relative h-32">
        <svg
          viewBox="0 0 700 120"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[20, 40, 60, 80, 100].map((y) => (
            <line
              key={y}
              x1="0"
              x2="700"
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="2 4"
            />
          ))}
          {(() => {
            const points = STAGES.map((s, i) => {
              const x = (i / (STAGES.length - 1)) * 700
              const score = s.feeling?.score ?? 3
              const y = 110 - (score / 5) * 90
              return { x, y }
            })
            const path = points
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
              .join(" ")
            const area = `${path} L 700 120 L 0 120 Z`
            return (
              <>
                <path d={area} fill="url(#g1)" />
                <path
                  d={path}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={5}
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />
                ))}
              </>
            )
          })()}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {STAGES.map((s) => (
          <div key={s.no}>
            <div className="text-2xl">{s.emoji}</div>
            <div className="mt-0.5 text-[9px] font-semibold text-slate-500 leading-tight">
              {s.title}
            </div>
            <div className="text-[10px] font-black text-slate-900">
              {s.feeling?.score ?? "—"}/5
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StageCard({ stage }: { stage: Stage }) {
  return (
    <article
      className={cn(
        "w-full rounded-3xl border-2 p-5 shadow-sm md:p-6",
        stage.bg
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex shrink-0 flex-col items-center gap-2 md:w-32">
          <div
            className={cn(
              "relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl text-white shadow-lg",
              stage.color
            )}
          >
            <span aria-hidden="true">{stage.emoji}</span>
            <span className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-white text-xs font-black text-slate-900 shadow-md">
              {stage.no}
            </span>
          </div>
          <div className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700">
            ⏱ {stage.duration}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-black tracking-tight text-slate-900">
            {stage.title}
          </h3>
          <p className="mt-1 text-sm text-slate-700">{stage.desc}</p>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <DetailBlock title="Ai tham gia">
              <div className="flex flex-col gap-1.5">
                {stage.actorIcons.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-slate-700"
                  >
                    <a.icon className="size-3.5 text-slate-500" />
                    {a.label}
                  </div>
                ))}
              </div>
            </DetailBlock>
            <DetailBlock title="App sử dụng">
              <div className="flex flex-wrap gap-1">
                {stage.apps.map((a) => (
                  <span
                    key={a}
                    className="rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </DetailBlock>
            <DetailBlock title="Event backend">
              <ul className="flex flex-col gap-1">
                {stage.events.map((e) => (
                  <li
                    key={e}
                    className="font-mono text-[10px] text-slate-600"
                  >
                    · {e}
                  </li>
                ))}
              </ul>
            </DetailBlock>
          </div>
        </div>

        {stage.feeling ? (
          <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-white/70 p-3 md:w-24">
            <div className="text-[9px] font-bold uppercase text-slate-500">
              Cảm xúc
            </div>
            <div className="flex">
              {Array.from({ length: stage.feeling.score }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <div className="text-center text-[10px] font-semibold text-slate-700">
              {stage.feeling.label}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  )
}

function DetailBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl bg-white/80 p-3 ring-1 ring-slate-200/60">
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {title}
      </div>
      {children}
    </div>
  )
}

function Outcomes() {
  const items = [
    { icon: "🎯", label: "Tích điểm tự động", desc: "Loyalty points cộng theo tier" },
    { icon: "⭐", label: "Đánh giá ngay", desc: "Trong app QR, không phải mở web khác" },
    { icon: "📲", label: "Hoá đơn điện tử", desc: "SMS/Email/HĐĐT TCT khi yêu cầu" },
    { icon: "🔁", label: "Quay lại lần sau", desc: "Voucher cá nhân hoá theo tier" },
  ]
  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
      <h3 className="text-lg font-black">Sau hành trình → Outcomes</h3>
      <p className="mt-1 text-sm text-slate-300">
        4 thứ khách mang về để quay lại lần sau
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((i) => (
          <div
            key={i.label}
            className="rounded-xl bg-white/10 p-3 backdrop-blur"
          >
            <div className="text-2xl">{i.icon}</div>
            <div className="mt-1 text-sm font-bold">{i.label}</div>
            <div className="mt-0.5 text-[11px] text-slate-300">{i.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
