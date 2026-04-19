import { useState } from "react"
import { ArrowLeft, Ban, Printer, Volume2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { SideRail } from "@/components/kds/side-rail"
import { cn } from "@/lib/utils"
import {
  STATIONS,
  UNAVAILABLE_ITEMS,
  type KdsStation,
} from "@/mocks/kds-tickets"

const MENU_CATEGORIES = [
  { id: "main", label: "Main course" },
  { id: "appetizer", label: "Appetizer" },
  { id: "dessert", label: "Dessert" },
  { id: "beverage", label: "Beverage" },
  { id: "salad", label: "Salad" },
  { id: "soup", label: "Soup" },
]

export function KdsSettingsPage() {
  const navigate = useNavigate()
  const [stationId, setStationId] = useState<KdsStation>("grill")
  const [columns, setColumns] = useState(3)
  const [sort, setSort] = useState<"oldest" | "newest">("oldest")
  const [fontSize, setFontSize] = useState<"m" | "l" | "xl">("l")
  const [warnMin, setWarnMin] = useState(8)
  const [dangerMin, setDangerMin] = useState(15)
  const [escalateOn, setEscalateOn] = useState(true)
  const [escalateMin, setEscalateMin] = useState(20)
  const [sounds, setSounds] = useState({ chime: true, beep: true, voice: false })
  const [autoPrintOnOffline, setAutoPrintOnOffline] = useState(true)
  const [bumpBar, setBumpBar] = useState(true)
  const [cats, setCats] = useState(["main", "appetizer"])
  const station = STATIONS.find((s) => s.id === stationId) ?? STATIONS[0]

  const toggleCat = (id: string) =>
    setCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )

  return (
    <>
      <SideRail currentStation={stationId} />

      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/kds/grid")}
              className="flex size-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <div className="text-lg font-black text-white">
                Cấu hình Station
              </div>
              <div className="text-[11px] text-slate-400">
                👤 Chef Minh (Supervisor) · TERM-KDS-01
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 xl:grid-cols-2">
            <Section title="Hồ sơ station">
              <Field label="Tên">
                <input
                  type="text"
                  defaultValue={station.label + " station"}
                  className={inputClass}
                />
              </Field>
              <Field label="Icon">
                <div className="flex flex-wrap gap-2">
                  {STATIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStationId(s.id)}
                      className={cn(
                        "flex h-12 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors",
                        stationId === s.id
                          ? "border-blue-500 bg-blue-500/10 text-blue-200"
                          : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      <span className="text-lg">{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Vị trí">
                <input
                  type="text"
                  defaultValue={station.location}
                  className={inputClass}
                />
              </Field>
              <Field label="Terminal ID">
                <input
                  readOnly
                  value="TERM-KDS-01"
                  className={cn(inputClass, "font-mono text-slate-500")}
                />
              </Field>
            </Section>

            <Section title="Hiển thị">
              <Field label="Số cột">
                <div className="flex gap-2">
                  {[3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setColumns(n)}
                      className={cn(
                        "h-10 w-14 rounded-lg border text-sm font-bold",
                        columns === n
                          ? "border-blue-500 bg-blue-500/10 text-blue-200"
                          : "border-slate-700 bg-slate-800/50 text-slate-300"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Sắp xếp">
                <div className="flex gap-2">
                  <Pill active={sort === "oldest"} onClick={() => setSort("oldest")}>
                    Cũ nhất trước
                  </Pill>
                  <Pill active={sort === "newest"} onClick={() => setSort("newest")}>
                    Mới nhất trước
                  </Pill>
                </div>
              </Field>
              <Field label="Dark mode">
                <Toggle on={true} onToggle={() => {}} />
              </Field>
              <Field label="Font size">
                <div className="flex gap-2">
                  {(["m", "l", "xl"] as const).map((s) => (
                    <Pill
                      key={s}
                      active={fontSize === s}
                      onClick={() => setFontSize(s)}
                    >
                      {s.toUpperCase()}
                    </Pill>
                  ))}
                </div>
              </Field>
            </Section>

            <Section title="Danh mục món nhận">
              <p className="text-xs text-slate-400">
                Station này sẽ hiển thị ticket của các category đã chọn:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {MENU_CATEGORIES.map((c) => {
                  const on = cats.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCat(c.id)}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
                        on
                          ? "border-blue-500 bg-blue-500/10 text-blue-200"
                          : "border-slate-700 bg-slate-800/50 text-slate-300"
                      )}
                    >
                      {c.label}
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border-2",
                          on
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-slate-600"
                        )}
                      >
                        {on ? "✓" : ""}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Section>

            <Section title="Cảnh báo thời gian">
              <Field label={`Vàng khi: ${warnMin} phút`}>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={warnMin}
                  onChange={(e) => setWarnMin(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </Field>
              <Field label={`Đỏ khi: ${dangerMin} phút`}>
                <input
                  type="range"
                  min={warnMin}
                  max={30}
                  value={dangerMin}
                  onChange={(e) => setDangerMin(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </Field>
              <Field label="Beep khi đỏ (mỗi 30s)">
                <Toggle on={true} onToggle={() => {}} />
              </Field>
              <Field label={`Escalate lên quản lý khi > ${escalateMin} phút`}>
                <div className="flex items-center gap-3">
                  <Toggle on={escalateOn} onToggle={() => setEscalateOn(!escalateOn)} />
                  {escalateOn ? (
                    <input
                      type="number"
                      min={dangerMin}
                      max={60}
                      value={escalateMin}
                      onChange={(e) => setEscalateMin(Number(e.target.value))}
                      className={cn(inputClass, "h-9 w-20")}
                    />
                  ) : null}
                </div>
              </Field>
            </Section>

            <Section title="Âm thanh" icon={Volume2}>
              <Toggle
                on={sounds.chime}
                onToggle={() => setSounds((s) => ({ ...s, chime: !s.chime }))}
                label="Chime khi ticket mới"
              />
              <Toggle
                on={sounds.beep}
                onToggle={() => setSounds((s) => ({ ...s, beep: !s.beep }))}
                label="Beep khi overdue"
              />
              <Toggle
                on={sounds.voice}
                onToggle={() => setSounds((s) => ({ ...s, voice: !s.voice }))}
                label="Voice announce 'Món X cho bàn Y'"
              />
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700"
              >
                🔊 Test sound
              </button>
            </Section>

            <Section title="Printer dự phòng" icon={Printer}>
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-sm font-bold text-emerald-200">
                    Xprinter · 192.168.1.55
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-emerald-300/70">Đã kết nối</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 py-2 text-xs font-bold text-slate-200"
                >
                  Test in phiếu
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 py-2 text-xs font-bold text-slate-200"
                >
                  Đổi printer
                </button>
              </div>
              <Toggle
                on={autoPrintOnOffline}
                onToggle={() => setAutoPrintOnOffline(!autoPrintOnOffline)}
                label="Auto in khi mất mạng"
              />
            </Section>

            <Section title="Bump bar (phím cứng)">
              <Toggle
                on={bumpBar}
                onToggle={() => setBumpBar(!bumpBar)}
                label="Kích hoạt bump bar"
              />
              {bumpBar ? (
                <div className="rounded-lg bg-slate-800/50 p-3 text-xs text-slate-300">
                  <div className="font-bold text-slate-100">Mapping</div>
                  <div className="mt-1">
                    Phím 1–8 → 8 ticket đầu grid (ticket cũ nhất trước)
                  </div>
                  <div className="mt-1">
                    Shortcut Recall:{" "}
                    <kbd className="rounded bg-slate-700 px-1.5 py-0.5 font-mono text-[10px]">
                      0
                    </kbd>
                  </div>
                </div>
              ) : null}
            </Section>

            <Section title={`Món hết (86'd)`} icon={Ban}>
              <div className="flex flex-col gap-2">
                {UNAVAILABLE_ITEMS.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-rose-500/10 text-xl">
                      {u.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-rose-200">
                        🚫 {u.name}
                      </div>
                      <div className="text-[11px] text-rose-300/70">
                        {u.until === "end_of_shift"
                          ? "Hết đến cuối ca"
                          : "Hết cả ngày"}{" "}
                        · {u.reason}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
                    >
                      Khôi phục
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="rounded-lg border-2 border-dashed border-slate-700 py-3 text-sm font-bold text-slate-400 hover:border-slate-600 hover:text-slate-200"
                >
                  + Đánh dấu món hết
                </button>
              </div>
            </Section>
          </div>
        </div>
      </main>
    </>
  )
}

const inputClass =
  "h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500"

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: typeof Volume2
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
        {Icon ? <Icon className="size-3.5 text-slate-400" /> : null}
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-400">{label}</span>
      {children}
    </div>
  )
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
        active
          ? "bg-blue-500 text-white"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      )}
    >
      {children}
    </button>
  )
}

function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean
  onToggle: () => void
  label?: string
}) {
  return (
    <div className="flex items-center justify-between">
      {label ? <span className="text-sm text-slate-200">{label}</span> : null}
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          on ? "bg-blue-500" : "bg-slate-700"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
            on ? "translate-x-0" : "-translate-x-5"
          )}
        />
      </button>
    </div>
  )
}
