import { useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { Check, Heart, Mail, MessageSquare, Sparkles, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"

const TOTAL = 265.6
const POINTS = 40

export function GuestSuccessPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const tableName = (tableId ?? "a3").replace(/^t-?/i, "").toUpperCase()
  const [searchParams] = useSearchParams()
  const method = searchParams.get("method") ?? "qr"

  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
      {/* Success hero */}
      <div className="flex flex-col items-center gap-3 pt-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30" />
          <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/40">
            <Check className="size-10 text-white" strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          {method === "counter" ? "Đã ghi nhận" : "Cảm ơn bạn! 🎉"}
        </h1>
        <p className="max-w-xs text-sm text-slate-600">
          {method === "counter"
            ? `Nhân viên sẽ tính tiền ${formatCurrency(TOTAL)} tại quầy khi bạn rời bàn ${tableName}.`
            : `Đã nhận thanh toán ${formatCurrency(TOTAL)}. Chúc bạn ngon miệng!`}
        </p>
      </div>

      {/* Points earned */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-4 text-white">
        <div className="flex size-12 items-center justify-center rounded-xl bg-white/20">
          <Sparkles className="size-6" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold opacity-80">
            Điểm tích luỹ
          </div>
          <div className="text-xl font-black tabular-nums">
            +{POINTS} điểm
          </div>
          <div className="text-[10px] opacity-80">
            Nhập SĐT để lưu vào tài khoản thành viên
          </div>
        </div>
      </div>

      {/* Receipt actions */}
      <section className="mt-4">
        <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Nhận hoá đơn
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <ReceiptAction icon={Mail} label="Gửi Email" />
          <ReceiptAction icon={MessageSquare} label="Gửi SMS" />
        </div>
      </section>

      {/* Rating */}
      <section className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-amber-100">
        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Heart className="size-7" fill="currentColor" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              Cảm ơn bạn đã đánh giá!
            </h3>
            <p className="text-xs text-slate-500">
              Phản hồi giúp Kopag phục vụ tốt hơn
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-base font-bold text-slate-900">
              Trải nghiệm của bạn thế nào?
            </h3>
            <p className="text-[11px] text-slate-500">
              Chia sẻ cảm nhận để Kopag cải thiện
            </p>

            <div className="mt-3 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => {
                const fill = (hovered || rating) >= n
                return (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(n)}
                    aria-label={`${n} sao`}
                    className="active:scale-90 transition-transform"
                  >
                    <Star
                      className={cn(
                        "size-10 transition-colors",
                        fill
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      )}
                    />
                  </button>
                )
              })}
            </div>

            {rating > 0 ? (
              <>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder={
                    rating >= 4
                      ? "Bạn thích điều gì nhất? (tuỳ chọn)"
                      : "Chúng tôi có thể cải thiện điều gì?"
                  }
                  className="mt-3 w-full resize-none rounded-xl bg-slate-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="mt-2 h-11 w-full rounded-full bg-slate-900 text-sm font-bold text-white active:scale-[0.98]"
                >
                  Gửi đánh giá
                </button>
              </>
            ) : null}
          </>
        )}
      </section>

      <Link
        to={`/guest/${tableId}/menu`}
        className="mt-5 text-center text-xs text-slate-500 underline underline-offset-2"
      >
        Gọi thêm món
      </Link>
    </div>
  )
}

function ReceiptAction({
  icon: Icon,
  label,
}: {
  icon: typeof Mail
  label: string
}) {
  return (
    <button
      type="button"
      className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-white text-sm font-semibold text-slate-700 ring-1 ring-amber-200 hover:bg-amber-50"
    >
      <Icon className="size-4" />
      {label}
    </button>
  )
}
