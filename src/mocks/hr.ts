export type StaffRole = "owner" | "manager" | "cashier" | "waiter" | "chef" | "host"
export type StaffStatus = "active" | "leave" | "inactive"

export type Staff = {
  id: string
  name: string
  initials: string
  phone: string
  email: string
  role: StaffRole
  status: StaffStatus
  pin: string          // last 2 digits shown only
  joinedAt: string
  hourlyRate: number   // USD/hour
  avatarColor: string
  thisWeekHours: number
  thisMonthHours: number
  thisMonthRevenue?: number
}

export type Shift = {
  id: string
  staffId: string
  date: string         // YYYY-MM-DD
  startTime: string    // HH:mm
  endTime: string
  role: StaffRole
  status: "scheduled" | "clocked_in" | "completed" | "absent"
  clockedInAt?: string
  clockedOutAt?: string
}

const ROLE_META: Record<
  StaffRole,
  { label: string; bg: string; text: string }
> = {
  owner: { label: "Chủ", bg: "bg-violet-100", text: "text-violet-700" },
  manager: { label: "Quản lý", bg: "bg-blue-100", text: "text-blue-700" },
  cashier: { label: "Thu ngân", bg: "bg-emerald-100", text: "text-emerald-700" },
  waiter: { label: "Phục vụ", bg: "bg-amber-100", text: "text-amber-700" },
  chef: { label: "Đầu bếp", bg: "bg-rose-100", text: "text-rose-700" },
  host: { label: "Lễ tân", bg: "bg-teal-100", text: "text-teal-700" },
}
export { ROLE_META }

export const STAFF: Staff[] = [
  {
    id: "s-1",
    name: "Nguyễn Thành Long",
    initials: "NL",
    phone: "+84 901 111 111",
    email: "long.nguyen@kopag.vn",
    role: "owner",
    status: "active",
    pin: "****42",
    joinedAt: "2023-01-15",
    hourlyRate: 0,
    avatarColor: "bg-gradient-to-br from-violet-500 to-violet-700",
    thisWeekHours: 0,
    thisMonthHours: 0,
  },
  {
    id: "s-2",
    name: "Trần Minh Hạnh",
    initials: "MH",
    phone: "+84 912 222 222",
    email: "hanh.tran@kopag.vn",
    role: "manager",
    status: "active",
    pin: "****08",
    joinedAt: "2023-03-20",
    hourlyRate: 8,
    avatarColor: "bg-gradient-to-br from-blue-500 to-blue-700",
    thisWeekHours: 42,
    thisMonthHours: 168,
    thisMonthRevenue: 28400,
  },
  {
    id: "s-3",
    name: "Rijal Arudam",
    initials: "RJ",
    phone: "+84 923 333 333",
    email: "rijal@kopag.vn",
    role: "waiter",
    status: "active",
    pin: "****15",
    joinedAt: "2024-02-01",
    hourlyRate: 5,
    avatarColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    thisWeekHours: 38,
    thisMonthHours: 152,
    thisMonthRevenue: 15600,
  },
  {
    id: "s-4",
    name: "Phạm Quỳnh Anh",
    initials: "QA",
    phone: "+84 934 444 444",
    email: "quynh.pham@kopag.vn",
    role: "waiter",
    status: "active",
    pin: "****23",
    joinedAt: "2024-05-10",
    hourlyRate: 5,
    avatarColor: "bg-gradient-to-br from-pink-500 to-rose-600",
    thisWeekHours: 35,
    thisMonthHours: 140,
    thisMonthRevenue: 12800,
  },
  {
    id: "s-5",
    name: "Lê Văn Minh",
    initials: "VM",
    phone: "+84 945 555 555",
    email: "minh.le@kopag.vn",
    role: "chef",
    status: "active",
    pin: "****91",
    joinedAt: "2023-08-05",
    hourlyRate: 7,
    avatarColor: "bg-gradient-to-br from-rose-500 to-red-700",
    thisWeekHours: 48,
    thisMonthHours: 192,
  },
  {
    id: "s-6",
    name: "Hoàng Thị Mai",
    initials: "TM",
    phone: "+84 956 666 666",
    email: "mai.hoang@kopag.vn",
    role: "cashier",
    status: "active",
    pin: "****34",
    joinedAt: "2024-01-12",
    hourlyRate: 6,
    avatarColor: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    thisWeekHours: 40,
    thisMonthHours: 160,
    thisMonthRevenue: 22100,
  },
  {
    id: "s-7",
    name: "Đỗ Anh Tuấn",
    initials: "AT",
    phone: "+84 967 777 777",
    email: "tuan.do@kopag.vn",
    role: "host",
    status: "leave",
    pin: "****56",
    joinedAt: "2024-04-18",
    hourlyRate: 5,
    avatarColor: "bg-gradient-to-br from-teal-500 to-teal-700",
    thisWeekHours: 0,
    thisMonthHours: 96,
  },
  {
    id: "s-8",
    name: "Vũ Đức Huy",
    initials: "ĐH",
    phone: "+84 978 888 888",
    email: "huy.vu@kopag.vn",
    role: "chef",
    status: "active",
    pin: "****77",
    joinedAt: "2023-11-22",
    hourlyRate: 6.5,
    avatarColor: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    thisWeekHours: 45,
    thisMonthHours: 180,
  },
]

// Generate shifts for current week
const today = new Date()
const monday = new Date(today)
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
monday.setHours(0, 0, 0, 0)

function dateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

function makeShift(
  dayOffset: number,
  staffId: string,
  startTime: string,
  endTime: string,
  status: Shift["status"] = "scheduled"
): Shift {
  const d = new Date(monday)
  d.setDate(monday.getDate() + dayOffset)
  return {
    id: `sh-${staffId}-${dayOffset}`,
    staffId,
    date: dateStr(d),
    startTime,
    endTime,
    role: STAFF.find((s) => s.id === staffId)!.role,
    status,
  }
}

const TODAY_OFFSET = (today.getDay() + 6) % 7

export const SHIFTS: Shift[] = [
  // Mon
  makeShift(0, "s-2", "08:00", "17:00", TODAY_OFFSET > 0 ? "completed" : "scheduled"),
  makeShift(0, "s-3", "10:00", "19:00", TODAY_OFFSET > 0 ? "completed" : "scheduled"),
  makeShift(0, "s-5", "08:00", "18:00", TODAY_OFFSET > 0 ? "completed" : "scheduled"),
  makeShift(0, "s-6", "09:00", "17:00", TODAY_OFFSET > 0 ? "completed" : "scheduled"),
  // Tue
  makeShift(1, "s-2", "08:00", "17:00", TODAY_OFFSET > 1 ? "completed" : "scheduled"),
  makeShift(1, "s-4", "14:00", "22:00", TODAY_OFFSET > 1 ? "completed" : "scheduled"),
  makeShift(1, "s-5", "10:00", "20:00", TODAY_OFFSET > 1 ? "completed" : "scheduled"),
  makeShift(1, "s-8", "14:00", "22:00", TODAY_OFFSET > 1 ? "completed" : "scheduled"),
  // Wed
  makeShift(2, "s-3", "10:00", "19:00", TODAY_OFFSET > 2 ? "completed" : "scheduled"),
  makeShift(2, "s-4", "10:00", "19:00", TODAY_OFFSET > 2 ? "completed" : "scheduled"),
  makeShift(2, "s-5", "08:00", "18:00", TODAY_OFFSET > 2 ? "completed" : "scheduled"),
  makeShift(2, "s-6", "09:00", "17:00", TODAY_OFFSET > 2 ? "completed" : "scheduled"),
  // Thu — today example
  makeShift(3, "s-2", "08:00", "17:00", TODAY_OFFSET >= 3 ? "clocked_in" : "scheduled"),
  makeShift(3, "s-3", "10:00", "19:00", TODAY_OFFSET >= 3 ? "clocked_in" : "scheduled"),
  makeShift(3, "s-5", "10:00", "20:00", TODAY_OFFSET >= 3 ? "clocked_in" : "scheduled"),
  makeShift(3, "s-6", "14:00", "22:00"),
  makeShift(3, "s-8", "08:00", "18:00", TODAY_OFFSET >= 3 ? "clocked_in" : "scheduled"),
  // Fri
  makeShift(4, "s-2", "08:00", "17:00"),
  makeShift(4, "s-3", "14:00", "22:00"),
  makeShift(4, "s-4", "14:00", "22:00"),
  makeShift(4, "s-5", "08:00", "18:00"),
  makeShift(4, "s-6", "09:00", "17:00"),
  // Sat
  makeShift(5, "s-3", "10:00", "22:00"),
  makeShift(5, "s-4", "10:00", "22:00"),
  makeShift(5, "s-5", "10:00", "22:00"),
  makeShift(5, "s-6", "10:00", "22:00"),
  makeShift(5, "s-8", "10:00", "22:00"),
  // Sun
  makeShift(6, "s-3", "10:00", "22:00"),
  makeShift(6, "s-5", "10:00", "22:00"),
  makeShift(6, "s-6", "10:00", "22:00"),
]

export const STATUS_META: Record<
  StaffStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  active: { label: "Đang làm", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  leave: { label: "Nghỉ phép", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  inactive: { label: "Nghỉ việc", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
}
