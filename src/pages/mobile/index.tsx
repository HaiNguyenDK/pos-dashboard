import { Link } from "react-router-dom"
import {
  Banknote,
  Bell,
  CreditCard,
  FileText,
  History,
  Home,
  ListOrdered,
  LogIn,
  QrCode,
  Receipt,
  Settings,
  ShoppingBag,
  Table2,
  UtensilsCrossed,
} from "lucide-react"

import { cn } from "@/lib/utils"

type ScreenCard = {
  no: string
  title: string
  subtitle: string
  to: string
  icon: typeof Home
  accent: string
}

const SCREENS: ScreenCard[] = [
  {
    no: "1",
    title: "PIN Login",
    subtitle: "Đăng nhập bằng mã PIN 6 số",
    to: "/mobile/pin-login",
    icon: LogIn,
    accent: "bg-indigo-50 text-indigo-600",
  },
  {
    no: "2",
    title: "Home",
    subtitle: "Bàn + đơn đang chạy",
    to: "/mobile/home",
    icon: Home,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    no: "3",
    title: "Table Detail",
    subtitle: "Tạo/tiếp tục đơn tại bàn",
    to: "/mobile/table/t-03",
    icon: Table2,
    accent: "bg-sky-50 text-sky-600",
  },
  {
    no: "4",
    title: "Menu Browser",
    subtitle: "Duyệt menu + modifier sheet",
    to: "/mobile/menu",
    icon: UtensilsCrossed,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    no: "6",
    title: "Cart Review",
    subtitle: "Giỏ hàng + gửi bếp",
    to: "/mobile/cart",
    icon: ShoppingBag,
    accent: "bg-violet-50 text-violet-600",
  },
  {
    no: "7",
    title: "Bill Preview",
    subtitle: "Xem bill, discount, tip, split",
    to: "/mobile/bill",
    icon: FileText,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    no: "8",
    title: "Payment Picker",
    subtitle: "Chọn phương thức thanh toán",
    to: "/mobile/payment",
    icon: CreditCard,
    accent: "bg-cyan-50 text-cyan-600",
  },
  {
    no: "9",
    title: "Cash Keypad",
    subtitle: "Nhập tiền khách, tính thối",
    to: "/mobile/pay/cash",
    icon: Banknote,
    accent: "bg-lime-50 text-lime-600",
  },
  {
    no: "10",
    title: "QR Fullscreen",
    subtitle: "VietQR động, poll trạng thái",
    to: "/mobile/pay/qr",
    icon: QrCode,
    accent: "bg-slate-100 text-slate-700",
  },
  {
    no: "11",
    title: "Payment Success",
    subtitle: "Xác nhận + in/gửi bill",
    to: "/mobile/pay/success",
    icon: Receipt,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    no: "12",
    title: "Order History",
    subtitle: "Xem lại đơn cũ, reprint",
    to: "/mobile/history",
    icon: History,
    accent: "bg-orange-50 text-orange-600",
  },
  {
    no: "13",
    title: "Settings",
    subtitle: "Máy in, ngôn ngữ, tài khoản",
    to: "/mobile/settings",
    icon: Settings,
    accent: "bg-slate-100 text-slate-700",
  },
  {
    no: "14",
    title: "Notifications",
    subtitle: "Thông báo từ bếp",
    to: "/mobile/notifications",
    icon: Bell,
    accent: "bg-rose-50 text-rose-600",
  },
]

export function MobileIndexPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600">
          <ListOrdered className="size-3.5" />
          Kopag POS · Screens preview
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          12 màn hình POS Android
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tap vào từng thẻ để xem UI preview. Kéo qua điện thoại thật hoặc mở
          trình duyệt desktop để screenshot.
        </p>
      </div>

      <div className="flex-1 space-y-2 px-3 pb-10">
        {SCREENS.map((s) => (
          <Link
            key={s.no}
            to={s.to}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-transparent bg-white p-3 shadow-sm transition-all",
              "hover:border-blue-200 hover:shadow-md active:scale-[0.99]"
            )}
          >
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl",
                s.accent
              )}
            >
              <s.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  #{s.no}
                </span>
                <span className="truncate text-[15px] font-bold text-slate-900">
                  {s.title}
                </span>
              </div>
              <div className="mt-0.5 truncate text-xs text-slate-500">
                {s.subtitle}
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-blue-600">→</span>
          </Link>
        ))}
      </div>

      <footer className="border-t bg-white/80 px-5 py-3 text-[11px] text-slate-500 backdrop-blur">
        Reference cho UI Android. Data: mock. Spec:{" "}
        <code className="rounded bg-slate-100 px-1 text-[10px] text-slate-700">
          docs/pos-android-screens.md
        </code>
      </footer>
    </div>
  )
}
