import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { HelpCircle, UserPlus } from "lucide-react"

import { PinDots, PinKeypad } from "@/components/mobile/pin-keypad"
import { cn } from "@/lib/utils"

const PIN_LENGTH = 6
const CORRECT_PIN = "123456"

export function MobilePinLoginPage() {
  const navigate = useNavigate()
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const handleKey = (k: string) => {
    if (verifying) return
    if (error) setError(false)
    if (pin.length < PIN_LENGTH) {
      const next = pin + k
      setPin(next)
      if (next.length === PIN_LENGTH) {
        verify(next)
      }
    }
  }

  const handleBackspace = () => {
    if (verifying) return
    setError(false)
    setPin((prev) => prev.slice(0, -1))
  }

  const verify = (value: string) => {
    setVerifying(true)
    setTimeout(() => {
      if (value === CORRECT_PIN) {
        navigate("/mobile/home")
      } else {
        setError(true)
        setPin("")
        setAttempts((a) => a + 1)
      }
      setVerifying(false)
    }, 400)
  }

  const remaining = Math.max(0, 5 - attempts)

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-6 pb-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30">
          <span className="text-2xl font-black text-white">K</span>
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
          Kopag POS
        </h1>
        <p className="mt-1 text-sm text-slate-500">Nhập mã PIN để tiếp tục</p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <div
            className={cn(
              "transition-transform",
              error && "animate-[shake_0.5s_ease-in-out]"
            )}
          >
            <PinDots length={PIN_LENGTH} value={pin} />
          </div>
          <div className="h-5 text-[12px] font-medium">
            {error ? (
              <span className="text-rose-500">
                PIN sai. Còn {remaining} lần thử
              </span>
            ) : verifying ? (
              <span className="text-slate-400">Đang xác thực…</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="pb-5">
        <PinKeypad onKey={handleKey} onBackspace={handleBackspace} disabled={verifying} />

        <div className="mt-6 flex flex-col items-center gap-3 px-8">
          <Link
            to="/mobile/home"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600"
          >
            <UserPlus className="size-4" />
            Đổi tài khoản
          </Link>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-slate-500"
          >
            <HelpCircle className="size-3.5" />
            Quên PIN? Liên hệ quản lý
          </button>
        </div>
      </div>
    </div>
  )
}
