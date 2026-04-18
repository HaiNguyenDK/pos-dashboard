import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Bell,
  ChevronRight,
  FileWarning,
  Globe,
  Info,
  KeyRound,
  Lock,
  LogOut,
  Printer,
  Smartphone,
  Volume2,
} from "lucide-react"

import { MobileHeader } from "@/components/mobile/mobile-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MobileSettingsPage() {
  const navigate = useNavigate()
  const [lang, setLang] = useState<"vi" | "en">("vi")
  const [notifs, setNotifs] = useState(true)
  const [sound, setSound] = useState(true)
  const [vibrate, setVibrate] = useState(true)

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader title="Cài đặt" />

      <div className="flex-1 overflow-y-auto px-4 py-3 pb-24">
        <Section title="Tài khoản">
          <div className="flex items-center gap-3 p-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-base font-black text-white">
              RJ
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-slate-900">Rijal</div>
              <div className="truncate text-[11px] text-slate-500">
                Waiter · Ca chiều · PIN ●●●●●●
              </div>
            </div>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full hover:bg-slate-100"
            >
              <ChevronRight className="size-4 text-slate-400" />
            </button>
          </div>
          <Divider />
          <Row icon={KeyRound} label="Đổi PIN" onClick={() => {}} />
        </Section>

        <Section title="Máy in">
          <PrinterItem
            name="Máy in quầy chính"
            detail="192.168.1.42 · Bill khách"
            connected
            selected
          />
          <Divider />
          <PrinterItem
            name="Máy in bếp"
            detail="192.168.1.43 · Phiếu bếp"
            connected
          />
          <Divider />
          <PrinterItem
            name="Máy in bar"
            detail="BLE · Pha chế"
            connected={false}
          />
          <Divider />
          <Row icon={Printer} label="Thêm máy in" highlight />
        </Section>

        <Section title="Ngôn ngữ">
          <div className="flex gap-2 p-3">
            {(
              [
                { code: "vi" as const, flag: "🇻🇳", name: "Tiếng Việt" },
                { code: "en" as const, flag: "🇺🇸", name: "English" },
              ]
            ).map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={cn(
                  "flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors",
                  lang === l.code
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white"
                )}
              >
                <span className="text-xl">{l.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{l.name}</div>
                  <div className="text-[10px] uppercase text-slate-500">
                    {l.code}
                  </div>
                </div>
                {lang === l.code ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                    ✓
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Thông báo">
          <Toggle
            icon={Bell}
            label="Bật thông báo"
            desc="Khi món sẵn sàng, đơn mới"
            on={notifs}
            onToggle={() => setNotifs(!notifs)}
          />
          <Divider />
          <Toggle
            icon={Volume2}
            label="Âm thanh"
            desc="Phát chuông khi nhận noti"
            on={sound}
            onToggle={() => setSound(!sound)}
          />
          <Divider />
          <Toggle
            icon={Smartphone}
            label="Rung"
            desc="Rung khi nhận noti"
            on={vibrate}
            onToggle={() => setVibrate(!vibrate)}
          />
        </Section>

        <Section title="Thiết bị">
          <div className="flex flex-col gap-0.5 p-3 text-xs">
            <Meta label="Terminal ID" value="TERM-HCM-001" mono />
            <Meta label="Android" value="13 (API 33)" />
            <Meta label="App version" value="0.1.0 (build 42)" />
            <Meta label="Đã đồng bộ" value="2 phút trước" />
          </div>
          <Divider />
          <Row icon={FileWarning} label="Xem log lỗi" />
          <Divider />
          <Row icon={Info} label="Về Kopag · Điều khoản · Chính sách" />
        </Section>

        <div className="mt-4 flex flex-col gap-2">
          <Button
            onClick={() => navigate("/mobile/pin-login")}
            variant="outline"
            className="h-11 rounded-full border-slate-200 text-sm font-bold"
          >
            <Lock className="mr-2 size-4" />
            Khoá máy
          </Button>
          <Button
            onClick={() => navigate("/mobile/pin-login")}
            className="h-11 rounded-full bg-rose-50 text-sm font-bold text-rose-600 shadow-none hover:bg-rose-100"
          >
            <LogOut className="mr-2 size-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <h3 className="mb-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      <div className="overflow-hidden rounded-2xl border bg-white">
        {children}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="mx-3 border-t border-slate-100" />
}

function Row({
  icon: Icon,
  label,
  onClick,
  highlight,
}: {
  icon: typeof Globe
  label: string
  onClick?: () => void
  highlight?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 p-3 text-left hover:bg-slate-50"
    >
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          highlight ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
        )}
      >
        <Icon className="size-4" />
      </div>
      <span
        className={cn(
          "flex-1 text-sm font-semibold",
          highlight ? "text-blue-600" : "text-slate-900"
        )}
      >
        {label}
      </span>
      <ChevronRight className="size-4 text-slate-400" />
    </button>
  )
}

function Toggle({
  icon: Icon,
  label,
  desc,
  on,
  onToggle,
}: {
  icon: typeof Globe
  label: string
  desc?: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon className="size-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        {desc ? (
          <div className="text-[11px] text-slate-500">{desc}</div>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          on ? "bg-blue-600" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
            on ? "-translate-x-0.5" : "-translate-x-5"
          )}
        />
      </button>
    </div>
  )
}

function PrinterItem({
  name,
  detail,
  connected,
  selected,
}: {
  name: string
  detail: string
  connected: boolean
  selected?: boolean
}) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          connected ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
        )}
      >
        <Printer className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-slate-900">
            {name}
          </span>
          {selected ? (
            <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
              Mặc định
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
          <span
            className={cn(
              "size-1.5 rounded-full",
              connected ? "bg-emerald-500" : "bg-slate-300"
            )}
          />
          <span className="text-slate-500">
            {connected ? "Đã kết nối" : "Chưa kết nối"} · {detail}
          </span>
        </div>
      </div>
      <ChevronRight className="size-4 text-slate-400" />
    </div>
  )
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-slate-500">{label}</span>
      <span
        className={cn("font-semibold text-slate-900", mono && "font-mono text-[11px]")}
      >
        {value}
      </span>
    </div>
  )
}
