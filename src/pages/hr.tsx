import { useMemo, useState } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import {
  ROLE_META,
  SHIFTS,
  STAFF,
  STATUS_META,
  type Shift,
  type Staff,
  type StaffRole,
} from "@/mocks/hr"

type Tab = "staff" | "schedule"

export function HrPage() {
  const [tab, setTab] = useState<Tab>("staff")
  const [query, setQuery] = useState("")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nhân sự</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản lý nhân viên, phân ca, theo dõi giờ công
          </p>
        </div>

        <div className="relative ml-auto w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            placeholder={
              tab === "staff" ? "Tìm nhân viên" : "Tìm theo tên / ca"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-full pl-10"
          />
        </div>

        <Button className="h-11 rounded-full bg-blue-600 px-5 text-white hover:bg-blue-700 shadow-none">
          {tab === "staff" ? (
            <>
              <UserPlus className="mr-2 size-4" />
              Thêm nhân viên
            </>
          ) : (
            <>
              <Plus className="mr-2 size-4" />
              Thêm ca
            </>
          )}
        </Button>
      </div>

      <div className="bg-muted flex w-fit rounded-full p-1">
        <button
          type="button"
          onClick={() => setTab("staff")}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
            tab === "staff"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="size-4" />
          Nhân viên ({STAFF.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("schedule")}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
            tab === "schedule"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <CalendarDays className="size-4" />
          Lịch làm việc
        </button>
      </div>

      {tab === "staff" ? (
        <StaffView query={query} />
      ) : (
        <ScheduleView query={query} />
      )}
    </div>
  )
}

function StaffView({ query }: { query: string }) {
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all")
  const [selectedId, setSelectedId] = useState<string>(STAFF[0]?.id ?? "")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return STAFF.filter(
      (s) =>
        (roleFilter === "all" || s.role === roleFilter) &&
        (q
          ? s.name.toLowerCase().includes(q) ||
            s.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
            s.email.toLowerCase().includes(q)
          : true)
    )
  }, [query, roleFilter])

  const selected = filtered.find((s) => s.id === selectedId) ?? filtered[0]

  const activeCount = STAFF.filter((s) => s.status === "active").length
  const totalPayroll = STAFF.reduce(
    (s, x) => s + x.hourlyRate * x.thisMonthHours,
    0
  )
  const avgHours = Math.round(
    STAFF.filter((s) => s.status === "active").reduce(
      (a, b) => a + b.thisWeekHours,
      0
    ) / Math.max(1, activeCount)
  )

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Tổng nhân viên"
          value={String(STAFF.length)}
          tone="bg-blue-50 text-blue-700 border-blue-200"
        />
        <StatCard
          icon={Shield}
          label="Đang làm"
          value={String(activeCount)}
          tone="bg-emerald-50 text-emerald-700 border-emerald-200"
        />
        <StatCard
          icon={Clock}
          label="Giờ TB/tuần"
          value={`${avgHours}h`}
          tone="bg-amber-50 text-amber-700 border-amber-200"
        />
        <StatCard
          icon={DollarSign}
          label="Lương tháng này"
          value={formatCurrency(totalPayroll)}
          tone="bg-violet-50 text-violet-700 border-violet-200"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <RoleChip
          label="Tất cả"
          active={roleFilter === "all"}
          onClick={() => setRoleFilter("all")}
          count={STAFF.length}
        />
        {(Object.keys(ROLE_META) as StaffRole[]).map((r) => (
          <RoleChip
            key={r}
            label={ROLE_META[r].label}
            active={roleFilter === r}
            onClick={() => setRoleFilter(r)}
            count={STAFF.filter((s) => s.role === r).length}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="bg-background rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Nhân viên</th>
                <th className="px-3 py-3 text-left font-medium">Vai trò</th>
                <th className="px-3 py-3 text-right font-medium">Tuần này</th>
                <th className="px-3 py-3 text-right font-medium">Tháng này</th>
                <th className="px-5 py-3 text-right font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((s) => (
                <StaffRow
                  key={s.id}
                  staff={s}
                  active={selected?.id === s.id}
                  onClick={() => setSelectedId(s.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <aside className="bg-background flex flex-col gap-4 rounded-2xl border p-5 lg:sticky lg:top-20">
          {selected ? <StaffDetail staff={selected} /> : null}
        </aside>
      </div>
    </>
  )
}

function StaffRow({
  staff,
  active,
  onClick,
}: {
  staff: Staff
  active?: boolean
  onClick: () => void
}) {
  const role = ROLE_META[staff.role]
  const status = STATUS_META[staff.status]
  return (
    <tr
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-colors",
        active ? "bg-blue-50/70" : "hover:bg-muted/30"
      )}
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-sm font-black text-white",
              staff.avatarColor
            )}
          >
            {staff.initials}
          </div>
          <div>
            <div className="font-bold">{staff.name}</div>
            <div className="text-muted-foreground text-[11px]">
              {staff.phone} · PIN {staff.pin}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold",
            role.bg,
            role.text
          )}
        >
          {role.label}
        </span>
      </td>
      <td className="px-3 py-3 text-right">
        <span className="font-bold tabular-nums">{staff.thisWeekHours}h</span>
      </td>
      <td className="px-3 py-3 text-right">
        <div className="font-bold tabular-nums">{staff.thisMonthHours}h</div>
        <div className="text-[10px] text-slate-500 tabular-nums">
          {formatCurrency(staff.hourlyRate * staff.thisMonthHours)}
        </div>
      </td>
      <td className="px-5 py-3 text-right">
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
      </td>
    </tr>
  )
}

function StaffDetail({ staff }: { staff: Staff }) {
  const role = ROLE_META[staff.role]
  const status = STATUS_META[staff.status]
  return (
    <>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-16 items-center justify-center rounded-2xl text-lg font-black text-white",
            staff.avatarColor
          )}
        >
          {staff.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black">{staff.name}</h3>
          <div className="mt-0.5 flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                role.bg,
                role.text
              )}
            >
              {role.label}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
                status.bg,
                status.text
              )}
            >
              <span className={cn("size-1.5 rounded-full", status.dot)} />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-xl bg-slate-50 p-3 text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="size-3.5 text-slate-400" />
          <span>{staff.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Mail className="size-3.5 text-slate-400" />
          <span className="truncate">{staff.email}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Shield className="size-3.5 text-slate-400" />
          <span>
            PIN: <b className="font-mono">{staff.pin}</b>
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <CalendarDays className="size-3.5 text-slate-400" />
          <span>
            Vào làm:{" "}
            {new Date(staff.joinedAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-amber-50 p-3">
          <div className="text-[10px] font-semibold uppercase text-amber-700">
            Tuần này
          </div>
          <div className="mt-0.5 text-xl font-black tabular-nums text-amber-900">
            {staff.thisWeekHours}h
          </div>
        </div>
        <div className="rounded-xl bg-violet-50 p-3">
          <div className="text-[10px] font-semibold uppercase text-violet-700">
            Tháng này
          </div>
          <div className="mt-0.5 text-xl font-black tabular-nums text-violet-900">
            {staff.thisMonthHours}h
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-emerald-50 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-emerald-800">
            Lương tháng ước tính
          </span>
          <span className="text-lg font-black tabular-nums text-emerald-700">
            {formatCurrency(staff.hourlyRate * staff.thisMonthHours)}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-emerald-700/80">
          {formatCurrency(staff.hourlyRate)}/giờ × {staff.thisMonthHours} giờ
        </div>
      </div>

      {staff.thisMonthRevenue ? (
        <div className="rounded-xl bg-blue-50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-blue-800">
              Doanh số phục vụ
            </span>
            <span className="text-lg font-black tabular-nums text-blue-700">
              {formatCurrency(staff.thisMonthRevenue)}
            </span>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          className="h-10 rounded-full bg-slate-100 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          Chỉnh sửa
        </button>
        <button
          type="button"
          className="h-10 rounded-full bg-rose-50 text-sm font-bold text-rose-600 hover:bg-rose-100"
        >
          Reset PIN
        </button>
      </div>
    </>
  )
}

function ScheduleView({ query: _query }: { query: string }) {
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date()
  const monday = useMemo(() => {
    const d = new Date(today)
    d.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7)
    d.setHours(0, 0, 0, 0)
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset])

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        return d
      }),
    [monday]
  )

  const weekLabel = `${monday.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  })} – ${days[6].toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`

  const todayStr = today.toISOString().slice(0, 10)

  // filter shifts within this week
  const dayStrs = days.map((d) => d.toISOString().slice(0, 10))
  const weekShifts = SHIFTS.filter((s) => dayStrs.includes(s.date))

  const activeStaff = STAFF.filter((s) => s.status === "active")
  const totalHours = weekShifts.reduce((sum, s) => {
    const [sh, sm] = s.startTime.split(":").map(Number)
    const [eh, em] = s.endTime.split(":").map(Number)
    return sum + (eh * 60 + em - sh * 60 - sm) / 60
  }, 0)

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          icon={CalendarDays}
          label="Tuần"
          value={weekLabel}
          tone="bg-blue-50 text-blue-700 border-blue-200"
        />
        <StatCard
          icon={Users}
          label="Đang lên lịch"
          value={String(new Set(weekShifts.map((s) => s.staffId)).size)}
          tone="bg-emerald-50 text-emerald-700 border-emerald-200"
        />
        <StatCard
          icon={Clock}
          label="Tổng giờ tuần"
          value={`${totalHours}h`}
          tone="bg-amber-50 text-amber-700 border-amber-200"
        />
        <StatCard
          icon={DollarSign}
          label="Chi phí nhân sự"
          value={formatCurrency(
            weekShifts.reduce((sum, s) => {
              const staff = STAFF.find((x) => x.id === s.staffId)
              const [sh, sm] = s.startTime.split(":").map(Number)
              const [eh, em] = s.endTime.split(":").map(Number)
              const hrs = (eh * 60 + em - sh * 60 - sm) / 60
              return sum + (staff?.hourlyRate ?? 0) * hrs
            }, 0)
          )}
          tone="bg-violet-50 text-violet-700 border-violet-200"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w - 1)}
            className="flex size-10 items-center justify-center rounded-full border hover:bg-slate-50"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold hover:bg-slate-200"
          >
            Tuần này
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w + 1)}
            className="flex size-10 items-center justify-center rounded-full border hover:bg-slate-50"
          >
            <ChevronRight className="size-5" />
          </button>
          <span className="ml-3 text-sm font-bold">{weekLabel}</span>
        </div>
      </div>

      <div className="bg-background overflow-x-auto rounded-2xl border">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[180px_repeat(7,1fr)] gap-px bg-slate-200">
            <div className="bg-muted/40 px-3 py-2 text-xs font-bold text-slate-600">
              Nhân viên
            </div>
            {days.map((d) => {
              const dStr = d.toISOString().slice(0, 10)
              const isToday = dStr === todayStr
              return (
                <div
                  key={dStr}
                  className={cn(
                    "px-3 py-2 text-xs",
                    isToday
                      ? "bg-blue-50 font-black text-blue-700"
                      : "bg-muted/40 font-bold text-slate-600"
                  )}
                >
                  <div className="uppercase">
                    {d.toLocaleDateString("vi-VN", { weekday: "short" })}
                  </div>
                  <div
                    className={cn(
                      "mt-0.5 text-base font-black",
                      isToday ? "text-blue-700" : "text-slate-900"
                    )}
                  >
                    {d.getDate()}
                  </div>
                </div>
              )
            })}

            {activeStaff.map((s) => (
              <ScheduleRow
                key={s.id}
                staff={s}
                days={days}
                shifts={weekShifts.filter((x) => x.staffId === s.id)}
                todayStr={todayStr}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function ScheduleRow({
  staff,
  days,
  shifts,
  todayStr,
}: {
  staff: Staff
  days: Date[]
  shifts: Shift[]
  todayStr: string
}) {
  const role = ROLE_META[staff.role]
  return (
    <>
      <div className="bg-background flex items-center gap-2 px-3 py-2">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white",
            staff.avatarColor
          )}
        >
          {staff.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-bold">{staff.name}</div>
          <div
            className={cn(
              "inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold",
              role.bg,
              role.text
            )}
          >
            {role.label}
          </div>
        </div>
      </div>
      {days.map((d) => {
        const dStr = d.toISOString().slice(0, 10)
        const shift = shifts.find((x) => x.date === dStr)
        const isToday = dStr === todayStr
        return (
          <div
            key={dStr}
            className={cn(
              "flex min-h-[60px] items-stretch p-1",
              isToday ? "bg-blue-50/30" : "bg-background"
            )}
          >
            {shift ? (
              <ShiftBlock shift={shift} />
            ) : (
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-[10px] text-slate-400 hover:border-blue-400 hover:text-blue-600"
              >
                <Plus className="size-3" />
              </button>
            )}
          </div>
        )
      })}
    </>
  )
}

function ShiftBlock({ shift }: { shift: Shift }) {
  const bg =
    shift.status === "clocked_in"
      ? "bg-emerald-100 border-emerald-400 text-emerald-800"
      : shift.status === "completed"
        ? "bg-slate-100 border-slate-300 text-slate-600"
        : shift.status === "absent"
          ? "bg-rose-100 border-rose-400 text-rose-700"
          : "bg-blue-100 border-blue-400 text-blue-800"
  const statusLabel =
    shift.status === "clocked_in"
      ? "Đang làm"
      : shift.status === "completed"
        ? "Xong"
        : shift.status === "absent"
          ? "Vắng"
          : "Đã lên"
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-0.5 rounded-lg border-l-4 px-2 py-1.5 text-[11px]",
        bg
      )}
    >
      <div className="font-black tabular-nums">
        {shift.startTime}–{shift.endTime}
      </div>
      <div className="font-semibold opacity-80">{statusLabel}</div>
    </div>
  )
}

function RoleChip({
  label,
  active,
  onClick,
  count,
}: {
  label: string
  active: boolean
  onClick: () => void
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-colors",
        active
          ? "border-blue-500 bg-blue-500 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 text-[10px]",
          active ? "bg-white/20" : "bg-slate-100"
        )}
      >
        {count}
      </span>
    </button>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users
  label: string
  value: string
  tone: string
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border p-3", tone)}>
      <div className="flex size-10 items-center justify-center rounded-xl bg-white/80">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
          {label}
        </span>
        <span className="text-lg font-black tabular-nums">{value}</span>
      </div>
    </div>
  )
}
