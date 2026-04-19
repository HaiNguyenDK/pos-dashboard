export type BookingStatus =
  | "pending"
  | "confirmed"
  | "arrived"
  | "cancelled"
  | "no_show"

export type BookingSource = "phone" | "walkin" | "app" | "web" | "partner"

export type Booking = {
  id: string
  code: string
  customerName: string
  phone: string
  email?: string
  partySize: number
  date: string                // "2026-04-18"
  time: string                // "19:30"
  duration: number            // phút
  tableName?: string
  status: BookingStatus
  source: BookingSource
  deposit?: number
  specialRequests?: string
  remindersSent: number
  createdAt: string
  arrivedAt?: string
}

const today = new Date()
const d = (offsetDays: number) => {
  const dt = new Date(today)
  dt.setDate(dt.getDate() + offsetDays)
  return dt.toISOString().slice(0, 10)
}

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString()

export const BOOKINGS: Booking[] = [
  {
    id: "bk-1",
    code: "BK-1042",
    customerName: "Nguyễn Thành An",
    phone: "+84 901 234 567",
    email: "an.nguyen@gmail.com",
    partySize: 4,
    date: d(0),
    time: "19:30",
    duration: 90,
    tableName: "A3",
    status: "confirmed",
    source: "app",
    deposit: 200,
    specialRequests: "Sinh nhật, chuẩn bị bánh",
    remindersSent: 1,
    createdAt: hoursAgo(26),
  },
  {
    id: "bk-2",
    code: "BK-1043",
    customerName: "Trần Minh Hạnh",
    phone: "+84 912 345 678",
    partySize: 2,
    date: d(0),
    time: "18:00",
    duration: 60,
    tableName: "B1",
    status: "arrived",
    source: "web",
    remindersSent: 1,
    createdAt: hoursAgo(48),
    arrivedAt: hoursAgo(1),
  },
  {
    id: "bk-3",
    code: "BK-1044",
    customerName: "Lê Hoàng",
    phone: "+84 987 654 321",
    partySize: 6,
    date: d(0),
    time: "20:00",
    duration: 120,
    status: "pending",
    source: "phone",
    specialRequests: "Ghép 2 bàn, ghế trẻ em",
    remindersSent: 0,
    createdAt: hoursAgo(3),
  },
  {
    id: "bk-4",
    code: "BK-1045",
    customerName: "Phạm Quỳnh",
    phone: "+84 966 555 444",
    partySize: 3,
    date: d(1),
    time: "12:00",
    duration: 90,
    tableName: "C2",
    status: "confirmed",
    source: "app",
    deposit: 150,
    remindersSent: 0,
    createdAt: hoursAgo(12),
  },
  {
    id: "bk-5",
    code: "BK-1046",
    customerName: "Hoàng Văn Đức",
    phone: "+84 923 111 222",
    email: "duc.h@company.vn",
    partySize: 10,
    date: d(1),
    time: "19:00",
    duration: 150,
    tableName: "A1, A2",
    status: "confirmed",
    source: "phone",
    deposit: 500,
    specialRequests: "Tiệc công ty, có nhu cầu karaoke",
    remindersSent: 2,
    createdAt: hoursAgo(72),
  },
  {
    id: "bk-6",
    code: "BK-1041",
    customerName: "Đỗ Lan Hương",
    phone: "+84 938 222 333",
    partySize: 2,
    date: d(-1),
    time: "19:00",
    duration: 60,
    tableName: "B3",
    status: "no_show",
    source: "app",
    remindersSent: 2,
    createdAt: hoursAgo(36),
  },
  {
    id: "bk-7",
    code: "BK-1040",
    customerName: "Vũ Tuấn",
    phone: "+84 977 888 999",
    partySize: 4,
    date: d(-1),
    time: "18:30",
    duration: 90,
    status: "cancelled",
    source: "web",
    remindersSent: 0,
    createdAt: hoursAgo(40),
  },
  {
    id: "bk-8",
    code: "BK-1047",
    customerName: "Bùi Thị Mai",
    phone: "+84 909 123 456",
    partySize: 5,
    date: d(2),
    time: "18:00",
    duration: 120,
    status: "confirmed",
    source: "partner",
    deposit: 300,
    specialRequests: "Qua TheFork",
    remindersSent: 0,
    createdAt: hoursAgo(6),
  },
]

export const BOOKING_SOURCE_META: Record<BookingSource, { label: string; icon: string }> = {
  phone: { label: "Gọi điện", icon: "📞" },
  walkin: { label: "Đi vào", icon: "🚶" },
  app: { label: "App khách", icon: "📱" },
  web: { label: "Website", icon: "🌐" },
  partner: { label: "Đối tác", icon: "🤝" },
}

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: { label: "Chờ xác nhận", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  confirmed: { label: "Đã xác nhận", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  arrived: { label: "Đã đến", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  cancelled: { label: "Đã huỷ", bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
  no_show: { label: "Không đến", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
}
