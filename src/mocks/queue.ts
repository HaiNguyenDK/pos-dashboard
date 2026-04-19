export type QueueStatus = "waiting" | "notified" | "seated" | "cancelled" | "no_show"

export type QueueEntry = {
  id: string
  code: string
  customerName: string
  phone: string
  partySize: number
  preferredZone?: "A" | "B" | "C" | "any"
  note?: string
  status: QueueStatus
  estimatedMinutes: number
  createdAt: string
  notifiedAt?: string
  seatedAt?: string
  seatedTableName?: string
  smsCount: number
}

const now = Date.now()
const minAgo = (m: number) => new Date(now - m * 60 * 1000).toISOString()

export const QUEUE_ENTRIES: QueueEntry[] = [
  {
    id: "q-1",
    code: "Q-042",
    customerName: "Nguyễn Anh",
    phone: "+84 901 234 567",
    partySize: 4,
    preferredZone: "A",
    note: "Gần cửa sổ",
    status: "waiting",
    estimatedMinutes: 15,
    createdAt: minAgo(8),
    smsCount: 0,
  },
  {
    id: "q-2",
    code: "Q-043",
    customerName: "Trần Bình",
    phone: "+84 912 345 678",
    partySize: 2,
    status: "notified",
    estimatedMinutes: 5,
    createdAt: minAgo(20),
    notifiedAt: minAgo(3),
    smsCount: 1,
  },
  {
    id: "q-3",
    code: "Q-044",
    customerName: "Lê Hương",
    phone: "+84 987 654 321",
    partySize: 6,
    preferredZone: "B",
    note: "Có ghế trẻ em",
    status: "waiting",
    estimatedMinutes: 25,
    createdAt: minAgo(12),
    smsCount: 0,
  },
  {
    id: "q-4",
    code: "Q-045",
    customerName: "Phạm Minh",
    phone: "+84 966 555 444",
    partySize: 3,
    status: "waiting",
    estimatedMinutes: 20,
    createdAt: minAgo(5),
    smsCount: 0,
  },
  {
    id: "q-5",
    code: "Q-041",
    customerName: "Hoàng Nam",
    phone: "+84 923 111 222",
    partySize: 2,
    status: "seated",
    estimatedMinutes: 0,
    createdAt: minAgo(40),
    notifiedAt: minAgo(20),
    seatedAt: minAgo(15),
    seatedTableName: "A2",
    smsCount: 1,
  },
  {
    id: "q-6",
    code: "Q-040",
    customerName: "Đỗ Lan",
    phone: "+84 938 222 333",
    partySize: 5,
    status: "cancelled",
    estimatedMinutes: 0,
    createdAt: minAgo(55),
    smsCount: 0,
  },
]

export type Voucher = {
  code: string
  label: string
  type: "percent" | "fixed" | "free_item"
  value: number
  minSpend?: number
  expiresAt?: string
  appliesTo?: "all" | "food" | "drink"
}

export const VOUCHERS: Voucher[] = [
  {
    code: "WELCOME10",
    label: "Giảm 10% khách mới",
    type: "percent",
    value: 10,
    minSpend: 100,
  },
  {
    code: "KOPAG50K",
    label: "Giảm 50.000đ đơn từ 300K",
    type: "fixed",
    value: 50,
    minSpend: 300,
  },
  {
    code: "HAPPYHOUR",
    label: "Giảm 20% đồ uống 17–19h",
    type: "percent",
    value: 20,
    appliesTo: "drink",
  },
  {
    code: "VIP100",
    label: "Voucher thành viên VIP 100K",
    type: "fixed",
    value: 100,
  },
]

export type LoyaltyTier = "new" | "silver" | "gold" | "platinum"

export type LoyaltyCustomer = {
  id: string
  name: string
  phone: string
  email?: string
  tier: LoyaltyTier
  points: number
  visits: number
  totalSpent: number
  lastVisitAt: string
  birthday?: string
}

export const LOYALTY_CUSTOMERS: LoyaltyCustomer[] = [
  {
    id: "c-1",
    name: "Cheryl Arema",
    phone: "0901234567",
    email: "cheryl@gmail.com",
    tier: "gold",
    points: 1284,
    visits: 23,
    totalSpent: 4580,
    lastVisitAt: minAgo(60 * 24 * 3),
    birthday: "1995-04-22",
  },
  {
    id: "c-2",
    name: "Rijal Arudam",
    phone: "0912345678",
    tier: "platinum",
    points: 3210,
    visits: 58,
    totalSpent: 12400,
    lastVisitAt: minAgo(60 * 12),
  },
  {
    id: "c-3",
    name: "Vinicius Bayu",
    phone: "0987654321",
    tier: "silver",
    points: 420,
    visits: 8,
    totalSpent: 1250,
    lastVisitAt: minAgo(60 * 24 * 10),
  },
]

export const TIER_META: Record<
  LoyaltyTier,
  { label: string; icon: string; bg: string; text: string; ring: string; ptPerDollar: number }
> = {
  new: {
    label: "Mới",
    icon: "🌱",
    bg: "bg-slate-100",
    text: "text-slate-700",
    ring: "ring-slate-200",
    ptPerDollar: 1,
  },
  silver: {
    label: "Silver",
    icon: "🥈",
    bg: "bg-slate-100",
    text: "text-slate-700",
    ring: "ring-slate-300",
    ptPerDollar: 1.5,
  },
  gold: {
    label: "Gold",
    icon: "🥇",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-300",
    ptPerDollar: 2,
  },
  platinum: {
    label: "Platinum",
    icon: "💎",
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-300",
    ptPerDollar: 3,
  },
}
