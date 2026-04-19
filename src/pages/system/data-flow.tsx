import {
  ArrowDown,
  Bell,
  ChefHat,
  CheckCircle2,
  Database,
  HandPlatter,
  PackageMinus,
  Printer,
  QrCode,
  Receipt,
  ScanLine,
  Smartphone,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"

type Step = {
  no: number
  title: string
  actor: string
  actorColor: string
  app: string
  appColor: string
  graphqlOp: string
  opType: "mutation" | "query" | "subscription"
  payload?: string[]
  side?: "client" | "server" | "external"
  emoji: string
  realtime?: boolean
}

const STEPS: Step[] = [
  {
    no: 1,
    title: "Khách quét QR bàn A3",
    actor: "Khách",
    actorColor: "bg-blue-500",
    app: "Customer QR",
    appColor: "bg-rose-500",
    graphqlOp: "startGuestSession(tableQrCode)",
    opType: "mutation",
    payload: ["tableQrCode: 'KP-A3-x9k2'"],
    emoji: "📱",
    side: "client",
  },
  {
    no: 2,
    title: "BE tạo session + Order",
    actor: "Backend",
    actorColor: "bg-slate-800",
    app: "GraphQL API",
    appColor: "bg-emerald-500",
    graphqlOp: "GuestSession + Order created",
    opType: "mutation",
    payload: ["sessionId, orderId", "table.status → OCCUPIED", "broadcast tableUpdated"],
    emoji: "🗄️",
    side: "server",
    realtime: true,
  },
  {
    no: 3,
    title: "Khách thêm 3 món vào giỏ",
    actor: "Khách",
    actorColor: "bg-blue-500",
    app: "Customer QR",
    appColor: "bg-rose-500",
    graphqlOp: "guestAddItems(sessionId, items)",
    opType: "mutation",
    payload: [
      "items: [Burger×1, Salad×1, Coke×2]",
      "auto split → 2 KitchenTickets (Grill + Bar)",
    ],
    emoji: "🛒",
    side: "client",
  },
  {
    no: 4,
    title: "BE phát ticketCreated",
    actor: "Backend",
    actorColor: "bg-slate-800",
    app: "GraphQL API",
    appColor: "bg-emerald-500",
    graphqlOp: "subscription ticketCreated(station)",
    opType: "subscription",
    payload: [
      "Grill nhận ticket Burger",
      "Bar nhận ticket Coke + Salad",
      "Mobile POS waiter nhận guestSessionUpdated",
    ],
    emoji: "📡",
    side: "server",
    realtime: true,
  },
  {
    no: 5,
    title: "Bếp + Bar bump khi xong",
    actor: "Bếp & Bar",
    actorColor: "bg-rose-500",
    app: "KDS Tablet",
    appColor: "bg-slate-800",
    graphqlOp: "bumpTicket(ticketId)",
    opType: "mutation",
    payload: ["status: PREPARING → READY", "broadcast ticketUpdated"],
    emoji: "👨‍🍳",
    side: "client",
  },
  {
    no: 6,
    title: "Waiter nhận push noti",
    actor: "Phục vụ",
    actorColor: "bg-amber-500",
    app: "Mobile POS",
    appColor: "bg-orange-500",
    graphqlOp: "subscription ticketUpdated",
    opType: "subscription",
    payload: ["chime + push noti", "'Burger sẵn sàng cho Bàn A3'"],
    emoji: "🔔",
    side: "client",
    realtime: true,
  },
  {
    no: 7,
    title: "Khách bấm thanh toán + áp voucher",
    actor: "Khách",
    actorColor: "bg-blue-500",
    app: "Customer QR",
    appColor: "bg-rose-500",
    graphqlOp: "applyVoucher + guestCheckout",
    opType: "mutation",
    payload: ["voucher WELCOME10 (-10%)", "mode: QR"],
    emoji: "💳",
    side: "client",
  },
  {
    no: 8,
    title: "BE gọi VietQR + tạo Bill",
    actor: "Backend",
    actorColor: "bg-slate-800",
    app: "GraphQL + VietQR",
    appColor: "bg-emerald-500",
    graphqlOp: "Bill + paymentIntent",
    opType: "mutation",
    payload: [
      "VietQR API: tạo QR động",
      "Bill PENDING → trả về paymentIntent",
    ],
    emoji: "🏦",
    side: "external",
  },
  {
    no: 9,
    title: "Khách quét QR bằng app NH",
    actor: "Khách",
    actorColor: "bg-blue-500",
    app: "App ngân hàng (ngoài)",
    appColor: "bg-violet-500",
    graphqlOp: "Webhook Napas → BE",
    opType: "mutation",
    payload: [
      "Bank gửi webhook: tiền đã về",
      "Bill PAID + paidAt cập nhật",
    ],
    emoji: "🏧",
    side: "external",
  },
  {
    no: 10,
    title: "Stock auto-deduct theo Recipe",
    actor: "Backend",
    actorColor: "bg-slate-800",
    app: "GraphQL API",
    appColor: "bg-emerald-500",
    graphqlOp: "stockMovement bulk-create",
    opType: "mutation",
    payload: [
      "Burger: -150g thịt bò, -1 bánh mì, -30g phô mai",
      "Coke: -2 chai từ kho",
      "Nếu < reorderPoint → emit ingredientLowStock",
    ],
    emoji: "📦",
    side: "server",
    realtime: true,
  },
  {
    no: 11,
    title: "Loyalty cộng điểm",
    actor: "Backend",
    actorColor: "bg-slate-800",
    app: "GraphQL API",
    appColor: "bg-emerald-500",
    graphqlOp: "LoyaltyCustomer.points += earn",
    opType: "mutation",
    payload: [
      "Khách Gold (2x) · total $185 → +370 điểm",
      "Cập nhật visits + totalSpent",
    ],
    emoji: "✨",
    side: "server",
  },
  {
    no: 12,
    title: "E-receipt gửi SMS / Email",
    actor: "Backend",
    actorColor: "bg-slate-800",
    app: "SMS Gateway",
    appColor: "bg-violet-500",
    graphqlOp: "sendReceipt(billId, channel)",
    opType: "mutation",
    payload: [
      "Brandname SMS: 'KOPAG · Bill #1234 ...'",
      "Receipt PDF link 7-day expiry",
    ],
    emoji: "📲",
    side: "external",
  },
  {
    no: 13,
    title: "Khách đánh giá ⭐⭐⭐⭐⭐",
    actor: "Khách",
    actorColor: "bg-blue-500",
    app: "Customer QR",
    appColor: "bg-rose-500",
    graphqlOp: "createReview(rating, comment)",
    opType: "mutation",
    payload: [
      "rating: 5",
      "tags: ['ngon', 'phục vụ tốt']",
      "broadcast → Manager dashboard noti",
    ],
    emoji: "⭐",
    side: "client",
    realtime: true,
  },
]

const ICON_MAP: Record<string, typeof ScanLine> = {
  "1": ScanLine,
  "2": Database,
  "3": Smartphone,
  "4": Bell,
  "5": ChefHat,
  "6": HandPlatter,
  "7": Wallet,
  "8": QrCode,
  "9": Receipt,
  "10": PackageMinus,
  "11": Sparkles,
  "12": Printer,
  "13": Star,
}

export function SystemDataFlowPage() {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Data Flow
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Luồng dữ liệu của 1 đơn hàng
        </h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600">
          Theo dõi 1 đơn hàng tự khách (QR) đi qua{" "}
          <b>{STEPS.length} bước</b> trên 4 app + GraphQL API + 2 hệ thống
          ngoài (VietQR, SMS Gateway). Các bước realtime được đẩy qua
          subscription.
        </p>
      </header>

      <Legend />

      <div className="relative">
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div key={s.no}>
              <StepCard step={s} icon={ICON_MAP[String(s.no)] ?? CheckCircle2} />
              {i < STEPS.length - 1 ? (
                <div className="my-2 flex justify-center text-slate-300">
                  <ArrowDown className="size-4" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <Outcome />
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4">
      <span className="text-xs font-bold text-slate-700">Chú thích:</span>
      <Pill icon="📱" label="Client (UI)" tone="blue" />
      <Pill icon="🖥️" label="Backend" tone="emerald" />
      <Pill icon="🌐" label="External (3rd-party)" tone="violet" />
      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
        ⚡ Realtime
      </span>
      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
        mutation
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
        subscription
      </span>
    </div>
  )
}

function Pill({
  icon,
  label,
  tone,
}: {
  icon: string
  label: string
  tone: "blue" | "emerald" | "violet"
}) {
  const cls =
    tone === "blue"
      ? "bg-blue-50 text-blue-700"
      : tone === "emerald"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-violet-50 text-violet-700"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
        cls
      )}
    >
      <span>{icon}</span> {label}
    </span>
  )
}

function StepCard({ step, icon: Icon }: { step: Step; icon: typeof ScanLine }) {
  const sideColor =
    step.side === "server"
      ? "border-emerald-300 bg-emerald-50/40"
      : step.side === "external"
        ? "border-violet-300 bg-violet-50/40"
        : "border-blue-300 bg-blue-50/40"
  const sideIcon =
    step.side === "server" ? "🖥️" : step.side === "external" ? "🌐" : "📱"
  const opColor =
    step.opType === "mutation"
      ? "bg-slate-900 text-white"
      : step.opType === "subscription"
        ? "bg-blue-600 text-white"
        : "bg-emerald-600 text-white"

  return (
    <article className={cn("rounded-2xl border-2 p-4 shadow-sm", sideColor)}>
      <div className="flex items-start gap-4">
        <div className="relative flex shrink-0 flex-col items-center">
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-2xl text-white shadow-md",
              step.actorColor
            )}
          >
            <Icon className="size-6" />
          </div>
          <div className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-white text-[11px] font-black text-slate-900 ring-2 ring-slate-300">
            {step.no}
          </div>
          <div className="mt-1 text-[10px] font-bold text-slate-500">
            {sideIcon}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-black text-slate-900">{step.title}</h3>
            {step.realtime ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                ⚡ realtime
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold text-white",
                step.actorColor
              )}
            >
              👤 {step.actor}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold text-white",
                step.appColor
              )}
            >
              {step.app}
            </span>
          </div>

          <div className="mt-2.5 rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider",
                  opColor
                )}
              >
                {step.opType}
              </span>
              <code className="font-mono text-[11px] font-bold text-slate-900">
                {step.graphqlOp}
              </code>
            </div>
            {step.payload && step.payload.length > 0 ? (
              <ul className="mt-2 space-y-0.5 border-l-2 border-slate-200 pl-3">
                {step.payload.map((p, i) => (
                  <li
                    key={i}
                    className="font-mono text-[10px] text-slate-600"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

function Outcome() {
  const counts = STEPS.reduce(
    (acc, s) => {
      acc[s.opType]++
      if (s.side) acc[s.side]++
      if (s.realtime) acc.realtime++
      return acc
    },
    {
      mutation: 0,
      query: 0,
      subscription: 0,
      client: 0,
      server: 0,
      external: 0,
      realtime: 0,
    } as Record<string, number>
  )
  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
      <h3 className="text-lg font-black">Tổng kết chuyến đi của 1 đơn</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryStat label="GraphQL operations" value={STEPS.length} />
        <SummaryStat label="Mutations" value={counts.mutation} />
        <SummaryStat label="Subscriptions" value={counts.subscription} />
        <SummaryStat label="Realtime events" value={counts.realtime} />
        <SummaryStat label="Client → Server" value={counts.client} />
        <SummaryStat label="Server work" value={counts.server} />
        <SummaryStat label="External integrations" value={counts.external} />
        <SummaryStat label="Apps tham gia" value={4} />
      </div>
      <p className="mt-4 text-xs text-slate-300">
        Mọi bước đều có audit log. Khi mất mạng, client queue mutation lên local
        SQLite/IndexedDB, sync lại khi reconnect (idempotency keys do BE
        enforced).
      </p>
    </section>
  )
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur">
      <div className="text-3xl font-black tabular-nums">{value}</div>
      <div className="mt-1 text-[11px] font-semibold text-slate-300">
        {label}
      </div>
    </div>
  )
}
