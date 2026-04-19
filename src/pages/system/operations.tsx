import {
  Bed,
  ChefHat,
  ClipboardCheck,
  Coffee,
  Flame,
  HandPlatter,
  KeyRound,
  Lock,
  Moon,
  Package,
  PieChart,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Users,
  Utensils,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"

type Event = {
  time: string
  icon: typeof Sun
  title: string
  detail: string
  who: string[]              // role labels
  apps: string[]
  intensity?: number          // 1-5 busy level
}

type DayBlock = {
  label: string
  hours: string
  icon: typeof Sun
  bg: string
  accent: string
  events: Event[]
}

const DAY: DayBlock[] = [
  {
    label: "Mở quán",
    hours: "07:00 – 09:00",
    icon: Sunrise,
    bg: "from-orange-50 to-amber-50",
    accent: "bg-orange-500",
    events: [
      {
        time: "07:00",
        icon: KeyRound,
        title: "Setup",
        detail: "Quản lý mở cửa, bật điện, kiểm tra báo cháy, vệ sinh sàn.",
        who: ["Quản lý"],
        apps: [],
        intensity: 1,
      },
      {
        time: "07:30",
        icon: ClipboardCheck,
        title: "Check-in nhân viên + xem ca",
        detail: "Nhân viên clock-in bằng PIN trên Mobile POS / KDS.",
        who: ["Quản lý", "Tất cả NV"],
        apps: ["Dashboard", "Mobile POS", "KDS"],
        intensity: 2,
      },
      {
        time: "08:00",
        icon: Package,
        title: "Check kho + chuẩn bị bếp",
        detail:
          "Bếp prep nguyên liệu. Quản lý xem cảnh báo low-stock, đặt hàng nếu cần.",
        who: ["Bếp", "Quản lý"],
        apps: ["Dashboard /inventory", "KDS All-day"],
        intensity: 3,
      },
      {
        time: "08:30",
        icon: Coffee,
        title: "Brewing + setup bar",
        detail: "Pha cà phê demo, refill nguyên liệu bar, syrup, đá.",
        who: ["Bartender"],
        apps: ["KDS"],
        intensity: 2,
      },
    ],
  },
  {
    label: "Sáng",
    hours: "09:00 – 11:30",
    icon: Sun,
    bg: "from-yellow-50 to-amber-50/40",
    accent: "bg-yellow-500",
    events: [
      {
        time: "09:00",
        icon: HandPlatter,
        title: "Đón khách sớm",
        detail: "Khách lác đác. Lễ tân chào, waiter phục vụ chậm rãi.",
        who: ["Lễ tân", "Phục vụ"],
        apps: ["Dashboard /queue", "Mobile POS"],
        intensity: 2,
      },
      {
        time: "10:00",
        icon: Utensils,
        title: "Brunch · cà phê",
        detail: "Cao điểm cà phê + brunch nhẹ. Bar bận, bếp vừa phải.",
        who: ["Bar", "Phục vụ"],
        apps: ["KDS Bar", "Mobile POS"],
        intensity: 3,
      },
      {
        time: "11:00",
        icon: ClipboardCheck,
        title: "Chuẩn bị bookings trưa",
        detail: "Lễ tân review danh sách booking trưa, sắp xếp bàn.",
        who: ["Lễ tân"],
        apps: ["Dashboard /bookings"],
        intensity: 2,
      },
    ],
  },
  {
    label: "Trưa cao điểm",
    hours: "11:30 – 14:00",
    icon: Flame,
    bg: "from-rose-50 to-orange-100/60",
    accent: "bg-rose-500",
    events: [
      {
        time: "11:30",
        icon: Users,
        title: "Đông khách văn phòng",
        detail: "Hàng đợi xuất hiện, lễ tân gửi SMS gọi khách khi có bàn.",
        who: ["Lễ tân", "Phục vụ"],
        apps: ["Dashboard /queue", "Mobile POS"],
        intensity: 5,
      },
      {
        time: "12:00",
        icon: ChefHat,
        title: "KDS ngập ticket",
        detail:
          "Tickets liên tục, cook bump nhanh. Cảnh báo timer >8' xuất hiện.",
        who: ["Bếp", "Bar"],
        apps: ["KDS Grid"],
        intensity: 5,
      },
      {
        time: "12:30",
        icon: Wallet,
        title: "Pay-at-table peak",
        detail:
          "Thu ngân + waiter handheld đẩy thanh toán nhanh. VietQR xài nhiều nhất.",
        who: ["Thu ngân", "Phục vụ"],
        apps: ["Mobile POS", "Dashboard"],
        intensity: 5,
      },
      {
        time: "13:30",
        icon: Sparkles,
        title: "Giảm dần",
        detail: "Khách ăn xong rời, bàn dọn. Bếp thở.",
        who: ["Phục vụ"],
        apps: ["Mobile POS"],
        intensity: 3,
      },
    ],
  },
  {
    label: "Chiều",
    hours: "14:00 – 17:00",
    icon: Sun,
    bg: "from-blue-50 to-sky-50",
    accent: "bg-blue-500",
    events: [
      {
        time: "14:00",
        icon: ClipboardCheck,
        title: "X-report giữa ca",
        detail: "Thu ngân chốt sổ giữa ca, đối soát tiền mặt + QR.",
        who: ["Thu ngân", "Quản lý"],
        apps: ["Dashboard"],
        intensity: 3,
      },
      {
        time: "14:30",
        icon: Package,
        title: "Restock kho · prep tối",
        detail: "Bếp prep nguyên liệu cho tối. Manager nhập kho từ NCC.",
        who: ["Bếp", "Quản lý"],
        apps: ["Dashboard /inventory"],
        intensity: 3,
      },
      {
        time: "15:30",
        icon: Coffee,
        title: "Cà phê chiều · trà",
        detail: "Lượng vừa phải. Bar busy, bếp nóng nghỉ ngắn.",
        who: ["Bar", "Phục vụ"],
        apps: ["KDS Bar", "Mobile POS"],
        intensity: 2,
      },
    ],
  },
  {
    label: "Tối cao điểm",
    hours: "17:00 – 21:00",
    icon: Sunset,
    bg: "from-violet-50 to-purple-100/60",
    accent: "bg-violet-500",
    events: [
      {
        time: "17:00",
        icon: Users,
        title: "Bookings tối check-in",
        detail: "Lễ tân check booking. Tiệc 10 người vào ghép bàn A1+A2.",
        who: ["Lễ tân"],
        apps: ["Dashboard /bookings", "Mobile POS"],
        intensity: 4,
      },
      {
        time: "18:00",
        icon: Flame,
        title: "Dinner peak bắt đầu",
        detail: "Nhà hàng đầy. Hàng đợi liên tục, KDS đỏ rực.",
        who: ["Tất cả"],
        apps: ["Tất cả"],
        intensity: 5,
      },
      {
        time: "19:30",
        icon: ChefHat,
        title: "KDS cao điểm",
        detail:
          "Cook bump tay liên tục. Timer cảnh báo > 15' xuất hiện vài ticket.",
        who: ["Bếp", "Bar"],
        apps: ["KDS Grid"],
        intensity: 5,
      },
      {
        time: "20:30",
        icon: Wallet,
        title: "Đẩy thanh toán",
        detail:
          "Khách yêu cầu bill liên tục. Chia bill nhiều, áp voucher, gắn loyalty.",
        who: ["Thu ngân", "Phục vụ"],
        apps: ["Mobile POS"],
        intensity: 5,
      },
    ],
  },
  {
    label: "Hết giờ",
    hours: "21:00 – 22:30",
    icon: Moon,
    bg: "from-indigo-50 to-slate-100",
    accent: "bg-indigo-500",
    events: [
      {
        time: "21:30",
        icon: Sparkles,
        title: "Giảm khách",
        detail: "Khách ăn xong, không nhận thêm khách mới.",
        who: ["Phục vụ"],
        apps: ["Mobile POS"],
        intensity: 2,
      },
      {
        time: "22:00",
        icon: PieChart,
        title: "Z-report cuối ngày",
        detail:
          "Thu ngân đối soát tổng doanh thu theo phương thức. Manager review.",
        who: ["Thu ngân", "Quản lý"],
        apps: ["Dashboard"],
        intensity: 3,
      },
      {
        time: "22:15",
        icon: ClipboardCheck,
        title: "Review reviews & noti",
        detail:
          "Quản lý reply các đánh giá tiêu cực, ưu tiên rating ≤2.",
        who: ["Quản lý"],
        apps: ["Dashboard /reviews"],
        intensity: 2,
      },
      {
        time: "22:30",
        icon: Lock,
        title: "Đóng quán",
        detail:
          "Nhân viên clock-out. Quản lý khoá KDS, lock screen Mobile POS.",
        who: ["Tất cả"],
        apps: ["Tất cả"],
        intensity: 1,
      },
      {
        time: "23:00",
        icon: Bed,
        title: "Nghỉ",
        detail: "Hệ thống quay subscription chế độ stand-by.",
        who: ["—"],
        apps: ["—"],
        intensity: 0,
      },
    ],
  },
]

export function SystemOperationsPage() {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Daily Operations
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Vận hành 1 ngày · 07:00 → 23:00
        </h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600">
          Timeline thực tế tại 1 nhà hàng F&B. Các đỉnh cao điểm <b>11:30–14:00</b>{" "}
          (lunch) và <b>18:00–21:00</b> (dinner) là khi mọi app được dùng đồng
          thời.
        </p>
      </header>

      <BusyHeatmap />

      <div className="space-y-8">
        {DAY.map((block) => (
          <DayBlockSection key={block.label} block={block} />
        ))}
      </div>

      <SummaryCards />
    </div>
  )
}

function BusyHeatmap() {
  const allEvents = DAY.flatMap((d) => d.events)
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          Mức độ bận theo giờ
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-emerald-300" />
            Nhẹ
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-amber-400" />
            Vừa
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-rose-500" />
            Cao điểm
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        <div className="grid grid-flow-col auto-cols-fr gap-1">
          {allEvents.map((e, i) => {
            const intensity = e.intensity ?? 0
            const color =
              intensity >= 5
                ? "bg-rose-500"
                : intensity >= 4
                  ? "bg-rose-400"
                  : intensity >= 3
                    ? "bg-amber-400"
                    : intensity >= 2
                      ? "bg-emerald-400"
                      : intensity >= 1
                        ? "bg-emerald-300"
                        : "bg-slate-200"
            return (
              <div
                key={i}
                className="group flex flex-col items-center gap-1"
                title={`${e.time} · ${e.title}`}
              >
                <div
                  className={cn("h-12 w-full rounded-md", color)}
                  style={{ height: `${20 + intensity * 12}px` }}
                />
                <span className="text-[8px] tabular-nums text-slate-500">
                  {e.time}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DayBlockSection({ block }: { block: DayBlock }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200 bg-gradient-to-br p-6",
        block.bg
      )}
    >
      <header className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl text-white shadow-md",
            block.accent
          )}
        >
          <block.icon className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">{block.label}</h2>
          <div className="text-xs font-semibold text-slate-600">
            {block.hours}
          </div>
        </div>
      </header>

      <div className="relative pl-6">
        <div className="absolute left-2.5 top-0 h-full w-0.5 bg-slate-300/60" />
        <div className="flex flex-col gap-3">
          {block.events.map((e) => (
            <EventRow key={e.time + e.title} event={e} />
          ))}
        </div>
      </div>
    </section>
  )
}

function EventRow({ event }: { event: Event }) {
  const intensity = event.intensity ?? 0
  const intensityColor =
    intensity >= 5
      ? "bg-rose-500"
      : intensity >= 4
        ? "bg-rose-400"
        : intensity >= 3
          ? "bg-amber-400"
          : intensity >= 2
            ? "bg-emerald-400"
            : intensity >= 1
              ? "bg-emerald-300"
              : "bg-slate-300"
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute -left-[18px] top-3 size-3 rounded-full ring-4 ring-white",
          intensityColor
        )}
      />
      <div className="rounded-xl bg-white/80 p-3 ring-1 ring-slate-200/60 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <event.icon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 tabular-nums">
                {event.time}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {event.title}
              </span>
              {intensity >= 4 ? (
                <span className="rounded-full bg-rose-100 px-1.5 py-0 text-[9px] font-black uppercase text-rose-700">
                  Cao điểm
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-[12px] text-slate-600">{event.detail}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {event.who.map((w) => (
                <span
                  key={w}
                  className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700"
                >
                  👤 {w}
                </span>
              ))}
              {event.apps.map((a) => (
                <span
                  key={a}
                  className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCards() {
  const stats = [
    { icon: "🪑", label: "Lượt khách", value: "180+", desc: "trung bình mỗi ngày" },
    { icon: "🍽️", label: "Đơn", value: "75–95", desc: "lunch + dinner" },
    { icon: "⏱", label: "Cao điểm", value: "5h", desc: "11h30–14h + 18h–21h" },
    { icon: "👥", label: "Nhân sự", value: "12–15", desc: "3 ca xen kẽ" },
  ]
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="text-3xl">{s.icon}</div>
          <div className="mt-1 text-xl font-black tabular-nums text-slate-900">
            {s.value}
          </div>
          <div className="text-xs font-bold text-slate-700">{s.label}</div>
          <div className="text-[10px] text-slate-500">{s.desc}</div>
        </div>
      ))}
    </section>
  )
}
