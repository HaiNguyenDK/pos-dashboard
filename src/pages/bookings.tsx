import { useMemo, useState } from "react"
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import {
  BOOKINGS,
  BOOKING_SOURCE_META,
  BOOKING_STATUS_META,
  type Booking,
  type BookingStatus,
} from "@/mocks/bookings"

type TabId = "today" | "upcoming" | "past" | "all"

function dateOffset(offset: number) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

const TODAY = dateOffset(0)

export function BookingsPage() {
  const [tab, setTab] = useState<TabId>("today")
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")
  const [query, setQuery] = useState("")
  const [bookings, setBookings] = useState(BOOKINGS)
  const [selectedId, setSelectedId] = useState<string>(BOOKINGS[0]?.id ?? "")
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return bookings
      .filter((b) => {
        if (tab === "today") return b.date === TODAY
        if (tab === "upcoming") return b.date > TODAY
        if (tab === "past") return b.date < TODAY
        return true
      })
      .filter((b) => (statusFilter === "all" ? true : b.status === statusFilter))
      .filter((b) =>
        q
          ? b.customerName.toLowerCase().includes(q) ||
            b.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
            b.code.toLowerCase().includes(q)
          : true
      )
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return a.time.localeCompare(b.time)
      })
  }, [bookings, tab, statusFilter, query])

  const selected = bookings.find((b) => b.id === selectedId) ?? filtered[0]

  const counts = useMemo(() => {
    return {
      today: bookings.filter((b) => b.date === TODAY).length,
      upcoming: bookings.filter((b) => b.date > TODAY).length,
      past: bookings.filter((b) => b.date < TODAY).length,
      all: bookings.length,
    }
  }, [bookings])

  const todayStats = useMemo(() => {
    const t = bookings.filter((b) => b.date === TODAY)
    return {
      confirmed: t.filter((b) => b.status === "confirmed").length,
      pending: t.filter((b) => b.status === "pending").length,
      arrived: t.filter((b) => b.status === "arrived").length,
      guests: t
        .filter((b) => b.status === "confirmed" || b.status === "arrived")
        .reduce((s, b) => s + b.partySize, 0),
    }
  }, [bookings])

  const update = (id: string, patch: Partial<Booking>) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))

  const confirm = (id: string) => {
    update(id, { status: "confirmed" })
    toast.success("Đã xác nhận · gửi SMS xác nhận cho khách")
  }
  const sendReminder = (id: string) => {
    const b = bookings.find((x) => x.id === id)
    if (!b) return
    update(id, { remindersSent: b.remindersSent + 1 })
    toast.success("Đã gửi SMS nhắc lịch")
  }
  const markArrived = (id: string) => {
    update(id, { status: "arrived", arrivedAt: new Date().toISOString() })
    toast.success("Đã đánh dấu khách đến · chuyển sang order flow")
  }
  const cancel = (id: string) => {
    update(id, { status: "cancelled" })
    toast.info("Đã huỷ booking")
  }
  const markNoShow = (id: string) => {
    update(id, { status: "no_show" })
    toast.warning("Đánh dấu không đến — hoàn cọc theo policy")
  }

  const addBooking = (data: {
    name: string
    phone: string
    partySize: number
    date: string
    time: string
    note: string
    deposit: number
  }) => {
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      code: `BK-${1000 + Math.floor(Math.random() * 999)}`,
      customerName: data.name,
      phone: data.phone,
      partySize: data.partySize,
      date: data.date,
      time: data.time,
      duration: 90,
      status: "pending",
      source: "phone",
      deposit: data.deposit,
      specialRequests: data.note,
      remindersSent: 0,
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [booking, ...prev])
    setSelectedId(booking.id)
    setAddOpen(false)
    toast.success(`Đã thêm booking ${booking.code}`)
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Đặt bàn</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Hôm nay:{" "}
              <b className="text-slate-900">{todayStats.confirmed + todayStats.arrived}</b>{" "}
              bàn đã xác nhận / {todayStats.guests} khách · {todayStats.pending}{" "}
              chờ duyệt
            </p>
          </div>

          <div className="relative ml-auto w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              placeholder="Tìm tên / SĐT / mã"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 rounded-full pl-10"
            />
          </div>

          <Button
            onClick={() => setAddOpen(true)}
            className={cn(
              "h-11 rounded-full bg-blue-600 px-5 text-white shadow-none hover:bg-blue-700",
              "focus-visible:ring-blue-600"
            )}
          >
            <Plus className="mr-2 size-4" />
            Thêm booking
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Hôm nay"
            value={counts.today}
            color="bg-blue-50 text-blue-700 border-blue-200"
            icon={CalendarDays}
          />
          <StatCard
            label="Sắp tới"
            value={counts.upcoming}
            color="bg-violet-50 text-violet-700 border-violet-200"
            icon={Clock}
          />
          <StatCard
            label="Đã xác nhận"
            value={todayStats.confirmed}
            color="bg-emerald-50 text-emerald-700 border-emerald-200"
            icon={CheckCircle2}
          />
          <StatCard
            label="Khách hôm nay"
            value={todayStats.guests}
            color="bg-amber-50 text-amber-700 border-amber-200"
            icon={Users}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-muted flex rounded-full p-1">
            {(
              [
                { id: "today" as const, label: "Hôm nay" },
                { id: "upcoming" as const, label: "Sắp tới" },
                { id: "past" as const, label: "Đã qua" },
                { id: "all" as const, label: "Tất cả" },
              ]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                  tab === t.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as BookingStatus | "all")}
          >
            <SelectTrigger className="data-[size=default]:h-9 ml-auto w-44 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Mọi trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="arrived">Đã đến</SelectItem>
              <SelectItem value="cancelled">Đã huỷ</SelectItem>
              <SelectItem value="no_show">Không đến</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-background rounded-2xl border">
          {filtered.length === 0 ? (
            <div className="text-muted-foreground px-6 py-12 text-center text-sm">
              Không có booking nào
            </div>
          ) : (
            <GroupedList
              items={filtered}
              selectedId={selected?.id}
              onSelect={setSelectedId}
            />
          )}
        </div>
      </div>

      <aside className="bg-background flex flex-col gap-4 rounded-2xl border p-5 xl:sticky xl:top-20">
        {selected ? (
          <BookingDetail
            booking={selected}
            onConfirm={() => confirm(selected.id)}
            onSendReminder={() => sendReminder(selected.id)}
            onMarkArrived={() => markArrived(selected.id)}
            onCancel={() => cancel(selected.id)}
            onNoShow={() => markNoShow(selected.id)}
          />
        ) : (
          <div className="text-muted-foreground py-10 text-center text-sm">
            Chọn 1 booking để xem chi tiết
          </div>
        )}
      </aside>

      <AddBookingDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onConfirm={addBooking}
      />
    </div>
  )
}

function GroupedList({
  items,
  selectedId,
  onSelect,
}: {
  items: Booking[]
  selectedId?: string
  onSelect: (id: string) => void
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const b of items) {
      if (!map.has(b.date)) map.set(b.date, [])
      map.get(b.date)!.push(b)
    }
    return Array.from(map.entries())
  }, [items])

  return (
    <div className="divide-y">
      {grouped.map(([date, list]) => (
        <section key={date}>
          <header className="bg-muted/40 flex items-center justify-between px-5 py-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
              <CalendarDays className="size-3.5" />
              {new Date(date).toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
            <span className="text-muted-foreground text-[11px]">
              {list.length} booking · {list.reduce((s, b) => s + b.partySize, 0)}{" "}
              khách
            </span>
          </header>
          <ul className="divide-y">
            {list.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                active={selectedId === b.id}
                onClick={() => onSelect(b.id)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function BookingRow({
  booking,
  active,
  onClick,
}: {
  booking: Booking
  active?: boolean
  onClick: () => void
}) {
  const status = BOOKING_STATUS_META[booking.status]
  const source = BOOKING_SOURCE_META[booking.source]
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-4 px-5 py-3 text-left transition-colors",
          active ? "bg-blue-50/70" : "hover:bg-muted/40"
        )}
      >
        <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-slate-100 py-2">
          <span className="text-xs font-semibold text-slate-500">
            {booking.time.split(":")[0]}h
          </span>
          <span className="text-lg font-black text-slate-900 tabular-nums">
            {booking.time.split(":")[1]}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{booking.customerName}</span>
            <span className="font-mono text-[10px] font-semibold text-slate-400">
              {booking.code}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Users className="size-3" />
              {booking.partySize}
            </span>
            <span>·</span>
            <span>{booking.tableName ?? "Chưa xếp bàn"}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              {source.icon} {source.label}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
              status.bg,
              status.text
            )}
          >
            <span className={cn("size-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
          {booking.deposit ? (
            <span className="text-[10px] font-semibold text-emerald-700">
              Cọc {formatCurrency(booking.deposit)}
            </span>
          ) : null}
        </div>
      </button>
    </li>
  )
}

function BookingDetail({
  booking,
  onConfirm,
  onSendReminder,
  onMarkArrived,
  onCancel,
  onNoShow,
}: {
  booking: Booking
  onConfirm: () => void
  onSendReminder: () => void
  onMarkArrived: () => void
  onCancel: () => void
  onNoShow: () => void
}) {
  const status = BOOKING_STATUS_META[booking.status]
  const source = BOOKING_SOURCE_META[booking.source]
  return (
    <>
      <header className="flex items-start justify-between gap-2">
        <div>
          <div className="font-mono text-xs text-slate-400">{booking.code}</div>
          <h3 className="mt-0.5 text-lg font-bold">{booking.customerName}</h3>
          <div className="text-sm text-slate-600">{booking.phone}</div>
          {booking.email ? (
            <div className="text-xs text-slate-500">{booking.email}</div>
          ) : null}
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
            status.bg,
            status.text
          )}
        >
          <span className={cn("size-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <InfoCell icon={CalendarDays} label="Ngày">
          {new Date(booking.date).toLocaleDateString("vi-VN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          })}
        </InfoCell>
        <InfoCell icon={Clock} label="Giờ">
          {booking.time} · {booking.duration} phút
        </InfoCell>
        <InfoCell icon={Users} label="Số khách">
          {booking.partySize} người
        </InfoCell>
        <InfoCell
          icon={Wallet}
          label="Tiền cọc"
          tone={booking.deposit ? "emerald" : undefined}
        >
          {booking.deposit ? formatCurrency(booking.deposit) : "Không cọc"}
        </InfoCell>
      </div>

      <div className="flex flex-col gap-1.5 rounded-xl bg-slate-50 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Bàn</span>
          <span className="font-bold">{booking.tableName ?? "Chưa xếp"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Nguồn</span>
          <span className="font-semibold">
            {source.icon} {source.label}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Đã gửi nhắc</span>
          <span className="font-semibold">
            {booking.remindersSent} lần
          </span>
        </div>
      </div>

      {booking.specialRequests ? (
        <div className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
          <b>Yêu cầu:</b> {booking.specialRequests}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 pt-1">
        {booking.status === "pending" ? (
          <Button
            onClick={onConfirm}
            className="h-11 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <CheckCircle2 className="mr-2 size-4" />
            Xác nhận booking
          </Button>
        ) : null}

        {booking.status === "confirmed" ? (
          <>
            <Button
              onClick={onMarkArrived}
              className="h-11 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="mr-2 size-4" />
              Đánh dấu đã đến
            </Button>
            <Button
              onClick={onSendReminder}
              variant="outline"
              className="h-11 rounded-full"
            >
              <MessageSquare className="mr-2 size-4" />
              Gửi SMS nhắc
            </Button>
          </>
        ) : null}

        {booking.status === "confirmed" || booking.status === "pending" ? (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onCancel}
              variant="outline"
              className="h-10 rounded-full text-rose-600 hover:bg-rose-50"
            >
              <XCircle className="mr-1 size-4" />
              Huỷ
            </Button>
            <Button
              onClick={onNoShow}
              variant="outline"
              className="h-10 rounded-full text-slate-600"
            >
              <X className="mr-1 size-4" />
              No-show
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-2 border-t pt-3">
        <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          Timeline
        </div>
        <ul className="mt-2 space-y-1.5 text-xs">
          <TimelineRow
            label="Booking tạo"
            time={booking.createdAt}
            done
          />
          <TimelineRow
            label="Đã xác nhận"
            done={["confirmed", "arrived", "no_show"].includes(booking.status)}
          />
          <TimelineRow
            label={`Nhắc lịch (${booking.remindersSent})`}
            done={booking.remindersSent > 0}
          />
          <TimelineRow
            label={
              booking.arrivedAt
                ? `Khách đến (${new Date(booking.arrivedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })})`
                : "Khách đến"
            }
            done={booking.status === "arrived"}
          />
        </ul>
      </div>
    </>
  )
}

function InfoCell({
  icon: Icon,
  label,
  children,
  tone,
}: {
  icon: typeof Users
  label: string
  children: React.ReactNode
  tone?: "emerald"
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-slate-50 px-3 py-2">
      <div className="text-muted-foreground flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
        <Icon className="size-3" />
        {label}
      </div>
      <div
        className={cn(
          "text-sm font-bold",
          tone === "emerald" && "text-emerald-700"
        )}
      >
        {children}
      </div>
    </div>
  )
}

function TimelineRow({
  label,
  time,
  done,
}: {
  label: string
  time?: string
  done?: boolean
}) {
  return (
    <li className="flex items-start gap-2">
      <span
        className={cn(
          "mt-1 size-2 shrink-0 rounded-full",
          done ? "bg-emerald-500" : "bg-slate-300"
        )}
      />
      <div className="flex flex-1 justify-between gap-2">
        <span className={cn(done ? "text-foreground" : "text-muted-foreground")}>
          {label}
        </span>
        <span className="text-muted-foreground tabular-nums">
          {time
            ? new Date(time).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      </div>
    </li>
  )
}

function StatCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string
  value: number
  color: string
  icon: typeof Users
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border p-3", color)}>
      <div className="flex size-10 items-center justify-center rounded-xl bg-white/80">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
          {label}
        </span>
        <span className="text-2xl font-black tabular-nums">{value}</span>
      </div>
    </div>
  )
}

function AddBookingDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (data: {
    name: string
    phone: string
    partySize: number
    date: string
    time: string
    note: string
    deposit: number
  }) => void
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [partySize, setPartySize] = useState(2)
  const [date, setDate] = useState(TODAY)
  const [time, setTime] = useState("19:00")
  const [note, setNote] = useState("")
  const [deposit, setDeposit] = useState(0)

  const shiftDate = (offset: number) => {
    const d = new Date(date)
    d.setDate(d.getDate() + offset)
    setDate(d.toISOString().slice(0, 10))
  }

  const submit = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Cần tên và số điện thoại")
      return
    }
    onConfirm({ name, phone, partySize, date, time, note, deposit })
    setName("")
    setPhone("")
    setPartySize(2)
    setNote("")
    setDeposit(0)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center justify-between text-xl font-bold">
            Thêm booking
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="flex size-8 items-center justify-center rounded-full hover:bg-slate-100"
            >
              <X className="size-4" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-sm font-semibold">
                Tên khách
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn An"
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-semibold">
                <Phone className="mr-1 inline size-3.5" />
                Số điện thoại
              </Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901 234 567"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-sm font-semibold">Ngày</Label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => shiftDate(-1)}
                  className="flex size-10 items-center justify-center rounded-full border hover:bg-slate-50"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 flex-1 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => shiftDate(1)}
                  className="flex size-10 items-center justify-center rounded-full border hover:bg-slate-50"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-semibold">Giờ</Label>
              <div className="flex flex-wrap gap-1.5">
                {["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"].map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={cn(
                        "h-8 rounded-full border px-2.5 text-xs font-semibold",
                        time === t
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white"
                      )}
                    >
                      {t}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-semibold">Số người</Label>
            <div className="flex flex-wrap items-center gap-1.5">
              {[2, 3, 4, 6, 8, 10, 12].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPartySize(n)}
                  className={cn(
                    "h-10 min-w-12 rounded-full border px-3 text-sm font-bold",
                    partySize === n
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white"
                  )}
                >
                  {n === 12 ? "12+" : n}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-sm font-semibold">
                Tiền cọc
              </Label>
              <Input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                placeholder="0"
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-semibold">
                <Mail className="mr-1 inline size-3.5" />
                Email (tuỳ chọn)
              </Label>
              <Input
                type="email"
                placeholder="khach@email.com"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-semibold">
              Yêu cầu đặc biệt
            </Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Vd: sinh nhật, ghép bàn, ghế trẻ em"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-900">
            <Bell className="mt-0.5 size-4 shrink-0" />
            SMS xác nhận sẽ được gửi ngay sau khi lưu. SMS nhắc tự gửi trước 2h.
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="h-11 flex-1 rounded-full"
            >
              Huỷ
            </Button>
            <Button
              onClick={submit}
              className="h-11 flex-1 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Tạo booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
