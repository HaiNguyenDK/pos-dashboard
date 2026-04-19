import { useMemo, useState } from "react"
import {
  AlertOctagon,
  MessageSquareReply,
  Search,
  Star,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  REVIEWS,
  SOURCE_META,
  type Review,
  type ReviewSource,
} from "@/mocks/reviews"

type Filter = "all" | "unreplied" | "critical" | "positive"

export function ReviewsPage() {
  const [filter, setFilter] = useState<Filter>("unreplied")
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all")
  const [sourceFilter, setSourceFilter] = useState<ReviewSource | "all">("all")
  const [query, setQuery] = useState("")
  const [reviews, setReviews] = useState<Review[]>(REVIEWS)
  const [selectedId, setSelectedId] = useState<string>(REVIEWS[0]?.id ?? "")
  const [reply, setReply] = useState("")

  const stats = useMemo(() => {
    const total = reviews.length
    const avg = total
      ? reviews.reduce((s, r) => s + r.rating, 0) / total
      : 0
    const critical = reviews.filter((r) => r.rating <= 2).length
    const unreplied = reviews.filter((r) => !r.staffReply).length
    const replyRate = total
      ? Math.round(((total - unreplied) / total) * 100)
      : 0
    return { total, avg, critical, unreplied, replyRate }
  }, [reviews])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reviews
      .filter((r) => {
        if (filter === "unreplied" && r.staffReply) return false
        if (filter === "critical" && r.rating > 2) return false
        if (filter === "positive" && r.rating < 4) return false
        if (ratingFilter !== "all" && r.rating !== ratingFilter) return false
        if (sourceFilter !== "all" && r.source !== sourceFilter) return false
        if (q) {
          return (
            r.customerName.toLowerCase().includes(q) ||
            r.comment.toLowerCase().includes(q) ||
            r.tags.some((t) => t.toLowerCase().includes(q))
          )
        }
        return true
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }, [reviews, filter, ratingFilter, sourceFilter, query])

  const selected = reviews.find((r) => r.id === selectedId) ?? filtered[0]

  const submitReply = () => {
    if (!selected || !reply.trim()) return
    setReviews((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              staffReply: reply.trim(),
              staffRepliedAt: new Date().toISOString(),
              staffRepliedByName: "Manager",
            }
          : r
      )
    )
    setReply("")
    toast.success("Đã gửi phản hồi đến khách")
  }

  const distribution = useMemo(() => {
    const d = [0, 0, 0, 0, 0]
    for (const r of reviews) d[r.rating - 1]++
    return d
  }, [reviews])

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_440px] xl:items-start">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Đánh giá khách hàng</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Phản hồi khách ngay · báo vấn đề nóng cho quản lý
            </p>
          </div>

          <div className="relative ml-auto w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              placeholder="Tìm đánh giá, tag, tên khách"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 rounded-full pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <OverviewCard
            label="Đánh giá TB"
            value={stats.avg.toFixed(1)}
            suffix="/5"
            icon={Star}
            tone="bg-amber-50 text-amber-700 border-amber-200"
          />
          <OverviewCard
            label="Tổng"
            value={String(stats.total)}
            icon={TrendingUp}
            tone="bg-blue-50 text-blue-700 border-blue-200"
          />
          <OverviewCard
            label="Chờ phản hồi"
            value={String(stats.unreplied)}
            icon={MessageSquareReply}
            tone="bg-violet-50 text-violet-700 border-violet-200"
          />
          <OverviewCard
            label="Cần xử lý gấp"
            value={String(stats.critical)}
            icon={AlertOctagon}
            tone="bg-rose-50 text-rose-700 border-rose-200"
          />
        </div>

        <div className="bg-background flex items-center gap-4 rounded-2xl border p-4">
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            <div className="text-3xl font-black tabular-nums">
              {stats.avg.toFixed(1)}
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "size-4",
                    n <= Math.round(stats.avg)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  )}
                />
              ))}
            </div>
            <div className="text-[11px] text-slate-500">{stats.total} đánh giá</div>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((n) => {
              const count = distribution[n - 1]
              const pct = stats.total ? (count / stats.total) * 100 : 0
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRatingFilter(n)}
                  className={cn(
                    "flex w-full items-center gap-2 text-xs hover:bg-slate-50 rounded-md px-1",
                    ratingFilter === n && "bg-blue-50"
                  )}
                >
                  <span className="flex w-6 items-center gap-0.5 font-semibold">
                    {n}
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        n >= 4
                          ? "bg-emerald-500"
                          : n === 3
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right tabular-nums text-slate-500">
                    {count}
                  </span>
                </button>
              )
            })}
            {ratingFilter !== "all" ? (
              <button
                type="button"
                onClick={() => setRatingFilter("all")}
                className="text-[10px] text-slate-500 underline underline-offset-2"
              >
                Bỏ filter rating
              </button>
            ) : null}
          </div>
          <div className="shrink-0 rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Tỉ lệ phản hồi
            </div>
            <div className="text-2xl font-black tabular-nums text-emerald-600">
              {stats.replyRate}%
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-muted flex rounded-full p-1">
            {(
              [
                { id: "unreplied" as const, label: `Chờ trả lời (${stats.unreplied})` },
                { id: "critical" as const, label: `Cần xử lý (${stats.critical})` },
                { id: "positive" as const, label: "Tích cực (4–5⭐)" },
                { id: "all" as const, label: "Tất cả" },
              ]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  filter === t.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex flex-wrap gap-1.5">
            <SourceChip
              label="Mọi nguồn"
              active={sourceFilter === "all"}
              onClick={() => setSourceFilter("all")}
            />
            {(Object.keys(SOURCE_META) as ReviewSource[]).map((src) => (
              <SourceChip
                key={src}
                label={`${SOURCE_META[src].icon} ${SOURCE_META[src].label}`}
                active={sourceFilter === src}
                onClick={() => setSourceFilter(src)}
              />
            ))}
          </div>
        </div>

        <div className="bg-background rounded-2xl border">
          {filtered.length === 0 ? (
            <div className="text-muted-foreground px-6 py-12 text-center text-sm">
              Không có đánh giá nào khớp
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((r) => (
                <ReviewRow
                  key={r.id}
                  review={r}
                  active={selected?.id === r.id}
                  onClick={() => setSelectedId(r.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <aside className="bg-background flex flex-col gap-4 rounded-2xl border p-5 xl:sticky xl:top-20">
        {selected ? (
          <ReviewDetail
            review={selected}
            reply={reply}
            setReply={setReply}
            onSubmit={submitReply}
          />
        ) : (
          <div className="text-muted-foreground py-10 text-center text-sm">
            Chọn 1 đánh giá để xem chi tiết
          </div>
        )}
      </aside>
    </div>
  )
}

function ReviewRow({
  review,
  active,
  onClick,
}: {
  review: Review
  active?: boolean
  onClick: () => void
}) {
  const source = SOURCE_META[review.source]
  const ago = Math.round(
    (Date.now() - new Date(review.createdAt).getTime()) / 3600000
  )
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-start gap-3 p-4 text-left transition-colors",
          active ? "bg-blue-50/70" : "hover:bg-muted/30"
        )}
      >
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-black text-white",
            review.avatarColor
          )}
        >
          {review.customerInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold">{review.customerName}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "size-3.5",
                    n <= review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  )}
                />
              ))}
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                source.color
              )}
            >
              {source.icon} {source.label}
            </span>
            {review.tableName ? (
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                Bàn {review.tableName}
              </span>
            ) : null}
            {!review.staffReply ? (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                Chờ trả lời
              </span>
            ) : null}
          </div>
          {review.comment ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-700">
              {review.comment}
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-400 italic">
              (Không có nhận xét)
            </p>
          )}
          {review.tags.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {review.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <span className="shrink-0 text-[10px] text-slate-400">
          {ago < 24 ? `${ago}h trước` : `${Math.floor(ago / 24)}d trước`}
        </span>
      </button>
    </li>
  )
}

function ReviewDetail({
  review,
  reply,
  setReply,
  onSubmit,
}: {
  review: Review
  reply: string
  setReply: (s: string) => void
  onSubmit: () => void
}) {
  const source = SOURCE_META[review.source]
  const quickTemplates = [
    "Cảm ơn anh/chị! Hẹn gặp lại ạ 🙏",
    "Rất tiếc về trải nghiệm chưa tốt. Quản lý sẽ liên hệ lại ngay.",
    "Chúng tôi sẽ ghi nhận và cải thiện. Cảm ơn anh/chị đã góp ý!",
  ]
  return (
    <>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full text-base font-black text-white",
            review.avatarColor
          )}
        >
          {review.customerInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold">{review.customerName}</div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={cn(
                  "size-4",
                  n <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                )}
              />
            ))}
            <span className="ml-1 text-sm font-black tabular-nums">
              {review.rating}.0
            </span>
          </div>
        </div>
        <span
          className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", source.color)}
        >
          {source.icon} {source.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {review.orderCode ? (
          <span>
            Đơn <b className="text-slate-900">#{review.orderCode}</b>
          </span>
        ) : null}
        {review.tableName ? (
          <span>
            Bàn <b className="text-slate-900">{review.tableName}</b>
          </span>
        ) : null}
        <span>
          {new Date(review.createdAt).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {review.comment ? (
        <blockquote
          className={cn(
            "rounded-xl border-l-4 p-3 text-sm italic",
            review.rating >= 4
              ? "border-emerald-500 bg-emerald-50 text-emerald-900"
              : review.rating >= 3
                ? "border-amber-500 bg-amber-50 text-amber-900"
                : "border-rose-500 bg-rose-50 text-rose-900"
          )}
        >
          "{review.comment}"
        </blockquote>
      ) : (
        <p className="rounded-xl bg-slate-50 p-3 text-sm italic text-slate-500">
          (Không có nhận xét)
        </p>
      )}

      {review.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {review.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
            >
              #{t}
            </span>
          ))}
        </div>
      ) : null}

      {review.staffReply ? (
        <div className="rounded-xl bg-blue-50 p-3 ring-1 ring-blue-200">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-blue-700">
              💬 {review.staffRepliedByName ?? "Staff"}
            </span>
            <span className="text-slate-500">
              {review.staffRepliedAt
                ? new Date(review.staffRepliedAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
          <p className="mt-1 text-sm text-blue-900">{review.staffReply}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Phản hồi của bạn
            </h4>
            {review.rating <= 2 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                <AlertOctagon className="size-3" />
                Ưu tiên cao
              </span>
            ) : null}
          </div>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            placeholder={
              review.rating >= 4
                ? "Cảm ơn khách và mời họ quay lại..."
                : "Xin lỗi khách và đưa ra cam kết cải thiện..."
            }
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-1.5">
            {quickTemplates.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setReply(t)}
                className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200"
              >
                {t.length > 40 ? t.slice(0, 37) + "…" : t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setReply("")}
              variant="outline"
              className="h-11 flex-1 rounded-full"
              disabled={!reply}
            >
              Xoá
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!reply.trim()}
              className="h-11 flex-[2] rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-none"
            >
              <MessageSquareReply className="mr-2 size-4" />
              Gửi phản hồi
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

function OverviewCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  suffix?: string
  icon: typeof Star
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
        <span className="text-xl font-black tabular-nums">
          {value}
          {suffix ? (
            <span className="text-xs font-semibold opacity-70">{suffix}</span>
          ) : null}
        </span>
      </div>
    </div>
  )
}

function SourceChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-[11px] font-bold transition-colors",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      )}
    >
      {label}
    </button>
  )
}
