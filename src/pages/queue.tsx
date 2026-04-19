import { useMemo, useState } from "react"
import {
  Bell,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Users,
  X,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  QUEUE_ENTRIES,
  type QueueEntry,
  type QueueStatus,
} from "@/mocks/queue"

const TAB_META: {
  id: "waiting" | "notified" | "seated" | "cancelled"
  label: string
  filter: QueueStatus[]
}[] = [
  { id: "waiting", label: "Đang chờ", filter: ["waiting"] },
  { id: "notified", label: "Đã gọi", filter: ["notified"] },
  { id: "seated", label: "Đã xếp bàn", filter: ["seated"] },
  { id: "cancelled", label: "Đã huỷ / No-show", filter: ["cancelled", "no_show"] },
]

const STATUS_STYLE: Record<
  QueueStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  waiting: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Đang chờ" },
  notified: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "Đã gọi" },
  seated: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Đã xếp bàn" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500", label: "Đã huỷ" },
  no_show: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", label: "Không đến" },
}

function minutesFrom(iso: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000))
}

export function QueuePage() {
  const [tab, setTab] = useState<(typeof TAB_META)[number]["id"]>("waiting")
  const [query, setQuery] = useState("")
  const [entries, setEntries] = useState<QueueEntry[]>(QUEUE_ENTRIES)
  const [selectedId, setSelectedId] = useState<string>(QUEUE_ENTRIES[0]?.id ?? "")
  const [addOpen, setAddOpen] = useState(false)

  const counts = useMemo(() => {
    const m: Record<string, number> = {}
    for (const t of TAB_META) {
      m[t.id] = entries.filter((e) => t.filter.includes(e.status)).length
    }
    return m
  }, [entries])

  const filtered = useMemo(() => {
    const active = TAB_META.find((t) => t.id === tab)!
    const q = query.trim().toLowerCase()
    return entries
      .filter((e) => active.filter.includes(e.status))
      .filter((e) =>
        q
          ? e.customerName.toLowerCase().includes(q) ||
            e.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
            e.code.toLowerCase().includes(q)
          : true
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
  }, [entries, tab, query])

  const selected = entries.find((e) => e.id === selectedId) ?? filtered[0]

  const notify = (id: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: "notified",
              notifiedAt: new Date().toISOString(),
              smsCount: e.smsCount + 1,
            }
          : e
      )
    )
    toast.success("Đã gửi SMS gọi khách")
  }

  const seat = (id: string, tableName: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: "seated",
              seatedAt: new Date().toISOString(),
              seatedTableName: tableName,
            }
          : e
      )
    )
    toast.success(`Đã xếp ${tableName}`)
  }

  const cancel = (id: string, reason: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "cancelled" } : e
      )
    )
    toast.info(`Đã huỷ${reason ? ` — ${reason}` : ""}`)
  }

  const addEntry = (data: {
    name: string
    phone: string
    partySize: number
    zone?: string
    note?: string
  }) => {
    const entry: QueueEntry = {
      id: `q-${Date.now()}`,
      code: `Q-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`,
      customerName: data.name,
      phone: data.phone,
      partySize: data.partySize,
      preferredZone: (data.zone as "A" | "B" | "C" | "any") || "any",
      note: data.note,
      status: "waiting",
      estimatedMinutes: 15 + data.partySize * 2,
      createdAt: new Date().toISOString(),
      smsCount: 0,
    }
    setEntries((prev) => [entry, ...prev])
    setSelectedId(entry.id)
    setTab("waiting")
    setAddOpen(false)
    toast.success(`Đã thêm ${data.name} vào hàng đợi (${entry.code})`)
  }

  const avgWait = useMemo(() => {
    const waiting = entries.filter((e) => e.status === "waiting")
    if (waiting.length === 0) return 0
    return Math.round(
      waiting.reduce((s, e) => s + e.estimatedMinutes, 0) / waiting.length
    )
  }, [entries])

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Hàng đợi khách</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {counts["waiting"]} nhóm đang chờ · Thời gian chờ TB ~{avgWait} phút
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
              "h-11 rounded-full bg-blue-600 px-5 text-white hover:bg-blue-700 shadow-none",
              "focus-visible:ring-blue-600"
            )}
          >
            <Plus className="mr-2 size-4" />
            Thêm khách chờ
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {TAB_META.map((t) => {
            const active = tab === t.id
            const count = counts[t.id] ?? 0
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all",
                  active
                    ? "border-blue-500 bg-blue-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    active ? "text-blue-700" : "text-slate-500"
                  )}
                >
                  {t.label}
                </span>
                <span
                  className={cn(
                    "text-2xl font-black tabular-nums",
                    active ? "text-blue-700" : "text-slate-900"
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="bg-background rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Khách</th>
                <th className="px-3 py-3 text-left font-medium">SL</th>
                <th className="px-3 py-3 text-left font-medium">Khu</th>
                <th className="px-3 py-3 text-left font-medium">Chờ</th>
                <th className="px-3 py-3 text-left font-medium">ETA</th>
                <th className="px-3 py-3 text-left font-medium">SMS</th>
                <th className="px-5 py-3 text-right font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-muted-foreground px-6 py-10 text-center"
                  >
                    Không có khách nào
                  </td>
                </tr>
              ) : (
                filtered.map((e) => {
                  const isSelected = selected?.id === e.id
                  const waitMin = minutesFrom(e.createdAt)
                  const isOverdue = waitMin > e.estimatedMinutes && e.status === "waiting"
                  return (
                    <tr
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected ? "bg-blue-50/70" : "hover:bg-muted/30"
                      )}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            {e.code}
                          </span>
                        </div>
                        <div className="font-bold">{e.customerName}</div>
                        <div className="text-muted-foreground text-xs">
                          {e.phone}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold">
                          <Users className="size-3" />
                          {e.partySize}
                        </span>
                      </td>
                      <td className="text-muted-foreground px-3 py-3 text-xs">
                        {e.preferredZone && e.preferredZone !== "any"
                          ? `Zone ${e.preferredZone}`
                          : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold tabular-nums",
                            isOverdue
                              ? "bg-rose-50 text-rose-600"
                              : "bg-slate-100 text-slate-700"
                          )}
                        >
                          <Clock className="size-3" />
                          {waitMin}'
                        </span>
                      </td>
                      <td className="text-muted-foreground px-3 py-3 text-xs tabular-nums">
                        ~{e.estimatedMinutes}'
                      </td>
                      <td className="text-muted-foreground px-3 py-3 text-xs tabular-nums">
                        {e.smsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-blue-600">
                            <MessageSquare className="size-3" />
                            {e.smsCount}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold",
                            STATUS_STYLE[e.status].bg,
                            STATUS_STYLE[e.status].text
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              STATUS_STYLE[e.status].dot
                            )}
                          />
                          {e.seatedTableName
                            ? `${STATUS_STYLE[e.status].label} · ${e.seatedTableName}`
                            : STATUS_STYLE[e.status].label}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="bg-background flex flex-col gap-4 rounded-2xl border p-5 xl:sticky xl:top-20">
        {selected ? (
          <>
            <header className="flex items-start justify-between gap-2">
              <div>
                <div className="text-muted-foreground font-mono text-xs">
                  {selected.code}
                </div>
                <h3 className="mt-0.5 text-lg font-bold">
                  {selected.customerName}
                </h3>
                <div className="text-muted-foreground text-sm">
                  {selected.phone}
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
                  STATUS_STYLE[selected.status].bg,
                  STATUS_STYLE[selected.status].text
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    STATUS_STYLE[selected.status].dot
                  )}
                />
                {STATUS_STYLE[selected.status].label}
              </span>
            </header>

            <div className="grid grid-cols-3 gap-2">
              <Stat icon={Users} label="Số người" value={String(selected.partySize)} />
              <Stat
                icon={Clock}
                label="Đã chờ"
                value={`${minutesFrom(selected.createdAt)}'`}
              />
              <Stat
                icon={MapPin}
                label="Khu"
                value={
                  selected.preferredZone && selected.preferredZone !== "any"
                    ? `Zone ${selected.preferredZone}`
                    : "Bất kỳ"
                }
              />
            </div>

            {selected.note ? (
              <div className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-amber-200">
                <b>Ghi chú:</b> {selected.note}
              </div>
            ) : null}

            {selected.status === "waiting" || selected.status === "notified" ? (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => notify(selected.id)}
                  className="h-11 rounded-full bg-blue-50 text-blue-700 shadow-none hover:bg-blue-100"
                >
                  <Bell className="mr-2 size-4" />
                  Gửi SMS gọi khách
                </Button>
                <SeatRow
                  onSeat={(tableName) => seat(selected.id, tableName)}
                />
                <Button
                  onClick={() => cancel(selected.id, "Khách đổi ý")}
                  variant="outline"
                  className="h-11 rounded-full text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <XCircle className="mr-2 size-4" />
                  Huỷ / No-show
                </Button>
              </div>
            ) : selected.status === "seated" ? (
              <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                  <MapPin className="size-4" />
                  Đã xếp {selected.seatedTableName}
                </div>
                <div className="mt-1 text-xs text-emerald-700">
                  Tổng thời gian chờ: {minutesFrom(selected.createdAt)} phút
                </div>
              </div>
            ) : null}

            <div className="mt-2 border-t pt-3 text-xs">
              <div className="text-muted-foreground font-semibold uppercase tracking-wide">
                Timeline
              </div>
              <ul className="mt-2 space-y-1.5">
                <TimelineItem
                  label="Vào hàng đợi"
                  time={selected.createdAt}
                  done
                />
                <TimelineItem
                  label={`Gửi SMS gọi khách (${selected.smsCount})`}
                  time={selected.notifiedAt}
                  done={!!selected.notifiedAt}
                />
                <TimelineItem
                  label={
                    selected.seatedTableName
                      ? `Xếp bàn ${selected.seatedTableName}`
                      : "Xếp bàn"
                  }
                  time={selected.seatedAt}
                  done={!!selected.seatedAt}
                />
              </ul>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground py-10 text-center text-sm">
            Chọn một khách bên trái để xem chi tiết.
          </div>
        )}
      </aside>

      <AddQueueDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onConfirm={addEntry}
      />
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-slate-50 px-3 py-2.5">
      <div className="text-muted-foreground flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
        <Icon className="size-3" />
        {label}
      </div>
      <div className="text-base font-bold tabular-nums">{value}</div>
    </div>
  )
}

function TimelineItem({
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
            ? new Date(time).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      </div>
    </li>
  )
}

function SeatRow({ onSeat }: { onSeat: (tableName: string) => void }) {
  const [tableName, setTableName] = useState("A3")
  return (
    <div className="flex gap-2">
      <Select value={tableName} onValueChange={setTableName}>
        <SelectTrigger className="data-[size=default]:h-11 flex-1 rounded-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {["A1", "A2", "A3", "A4", "B1", "B2", "B3", "C1", "C2"].map((t) => (
            <SelectItem key={t} value={t}>
              Bàn {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => onSeat(tableName)}
        className="h-11 rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-700 shadow-none"
      >
        <ChevronRight className="mr-1 size-4" />
        Xếp bàn
      </Button>
    </div>
  )
}

function AddQueueDialog({
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
    zone?: string
    note?: string
  }) => void
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [partySize, setPartySize] = useState(2)
  const [zone, setZone] = useState("any")
  const [note, setNote] = useState("")

  const submit = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Cần tên và số điện thoại")
      return
    }
    onConfirm({ name, phone, partySize, zone, note })
    setName("")
    setPhone("")
    setPartySize(2)
    setZone("any")
    setNote("")
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center justify-between text-xl font-bold">
            Thêm khách chờ
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

          <div>
            <Label className="mb-1.5 block text-sm font-semibold">Số người</Label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 6, 8, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPartySize(n)}
                  className={cn(
                    "h-10 min-w-10 rounded-full border px-3 text-sm font-bold transition-colors",
                    partySize === n
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600"
                  )}
                >
                  {n === 10 ? "10+" : n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-semibold">
              Ưu tiên khu
            </Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger className="data-[size=default]:h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Bất kỳ</SelectItem>
                <SelectItem value="A">Zone A</SelectItem>
                <SelectItem value="B">Zone B</SelectItem>
                <SelectItem value="C">Zone C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-semibold">
              Ghi chú (tuỳ chọn)
            </Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Vd: ghế trẻ em, gần cửa sổ"
              className="h-11 rounded-xl"
            />
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
              Thêm vào hàng đợi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
