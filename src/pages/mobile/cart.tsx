import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Ban,
  Combine,
  MoreHorizontal,
  Plus,
  Replace,
  StickyNote,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { MergeTablesSheet } from "@/components/mobile/merge-tables-sheet"
import { MobileHeader } from "@/components/mobile/mobile-header"
import { MoveTableSheet } from "@/components/mobile/move-table-sheet"
import { StatusChip } from "@/components/mobile/status-chip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { MENU_ITEMS } from "@/mocks/menu"
import { TABLES } from "@/mocks/tables"

type Section = "sent" | "new"
type Line = {
  id: string
  menuItemId: string
  qty: number
  note?: string
  status?: "pending" | "preparing" | "ready"
  section: Section
}

const INITIAL_LINES: Line[] = [
  {
    id: "l-1",
    menuItemId: "m-1",
    qty: 2,
    note: "Medium · không hành",
    status: "preparing",
    section: "sent",
  },
  {
    id: "l-2",
    menuItemId: "m-3",
    qty: 1,
    status: "ready",
    section: "sent",
  },
  { id: "l-3", menuItemId: "m-16", qty: 1, note: "Well done", section: "new" },
  { id: "l-4", menuItemId: "m-28", qty: 2, section: "new" },
]

const TAX_RATE = 0.1

export function MobileCartPage() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [mergeOpen, setMergeOpen] = useState(false)
  const [currentTableName, setCurrentTableName] = useState("A3")
  const [mergedTables, setMergedTables] = useState<string[]>([])

  const sent = lines.filter((l) => l.section === "sent")
  const newLines = lines.filter((l) => l.section === "new")

  const subtotal = lines.reduce((sum, l) => {
    const item = MENU_ITEMS.find((m) => m.id === l.menuItemId)
    return sum + (item?.price ?? 0) * l.qty
  }, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const removeLine = (id: string) =>
    setLines((prev) => prev.filter((l) => l.id !== id))

  const sendToKitchen = () => {
    setLines((prev) =>
      prev.map((l) =>
        l.section === "new"
          ? { ...l, section: "sent", status: "pending" }
          : l
      )
    )
  }

  const canCheckout = sent.length > 0
  const canSend = newLines.length > 0

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <MobileHeader
        title="Đơn #1234"
        subtitle={`Bàn ${currentTableName}${mergedTables.length > 0 ? ` + ${mergedTables.join(", ")}` : ""} · Cheryl Arema`}
        right={
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Thêm hành động"
            className="flex size-9 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <MoreHorizontal className="size-5" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-48">
        {sent.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Đã gửi bếp ({sent.length})
            </h3>
            <div className="flex flex-col gap-2">
              {sent.map((l) => (
                <CartLine key={l.id} line={l} readonly />
              ))}
            </div>
          </section>
        ) : null}

        {newLines.length > 0 ? (
          <section>
            <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-blue-600">
              Chưa gửi ({newLines.length})
            </h3>
            <div className="flex flex-col gap-2">
              {newLines.map((l) => (
                <CartLine
                  key={l.id}
                  line={l}
                  onRemove={() => removeLine(l.id)}
                />
              ))}
            </div>
          </section>
        ) : null}

        <button
          type="button"
          onClick={() => navigate("/mobile/menu")}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white py-3.5 text-sm font-semibold text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
        >
          <Plus className="size-4" />
          Thêm món
        </button>
      </div>

      <div className="absolute right-0 bottom-0 left-0 border-t bg-white">
        <div className="space-y-1.5 px-4 py-3 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Tạm tính</span>
            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Thuế (10%)</span>
            <span className="tabular-nums">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between border-t pt-1.5 text-base font-bold">
            <span>Tổng</span>
            <span className="tabular-nums text-emerald-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          <Button
            onClick={sendToKitchen}
            disabled={!canSend}
            className={cn(
              "h-12 rounded-full text-sm font-bold shadow-none",
              canSend
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-slate-100 text-slate-400"
            )}
          >
            Gửi bếp {canSend ? `(${newLines.length})` : ""}
          </Button>
          <Button
            onClick={() => navigate("/mobile/bill")}
            disabled={!canCheckout}
            className={cn(
              "h-12 rounded-full text-sm font-bold shadow-none",
              canCheckout
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-100 text-slate-400"
            )}
          >
            Thanh toán
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <ActionMenu
          onClose={() => setMenuOpen(false)}
          onMove={() => {
            setMenuOpen(false)
            setMoveOpen(true)
          }}
          onMerge={() => {
            setMenuOpen(false)
            setMergeOpen(true)
          }}
          onEditNote={() => {
            setMenuOpen(false)
            toast.info("Sẽ mở dialog ghi chú đơn")
          }}
          onCancel={() => {
            setMenuOpen(false)
            toast.warning("Huỷ đơn — cần PIN supervisor")
          }}
        />
      ) : null}

      <MoveTableSheet
        open={moveOpen}
        currentTableName={currentTableName}
        onClose={() => setMoveOpen(false)}
        onConfirm={(destId, reason) => {
          const dest = TABLES.find((t) => t.id === destId)
          if (dest) {
            setCurrentTableName(dest.name)
            toast.success(
              `Đã chuyển đơn sang Bàn ${dest.name}${reason ? ` (${reason})` : ""}`
            )
          }
          setMoveOpen(false)
        }}
      />

      <MergeTablesSheet
        open={mergeOpen}
        primaryTableName={currentTableName}
        onClose={() => setMergeOpen(false)}
        onConfirm={(ids) => {
          const names = ids
            .map((id) => TABLES.find((t) => t.id === id)?.name)
            .filter((n): n is string => !!n)
          setMergedTables(names)
          toast.success(
            `Đã ghép bàn ${currentTableName} + ${names.join(", ")}`
          )
          setMergeOpen(false)
        }}
      />
    </div>
  )
}

function ActionMenu({
  onClose,
  onMove,
  onMerge,
  onEditNote,
  onCancel,
}: {
  onClose: () => void
  onMove: () => void
  onMerge: () => void
  onEditNote: () => void
  onCancel: () => void
}) {
  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full rounded-t-3xl bg-white pb-6 shadow-xl">
        <div className="mx-auto mt-2 mb-3 h-1 w-10 rounded-full bg-slate-300" />
        <div className="flex items-center justify-between border-b px-5 pb-3">
          <div className="text-base font-bold text-slate-900">Hành động</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex size-9 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="divide-y">
          <ActionRow icon={StickyNote} label="Sửa ghi chú đơn" onClick={onEditNote} />
          <ActionRow
            icon={Replace}
            label="Chuyển bàn"
            desc="Đổi sang bàn khác cho khách"
            onClick={onMove}
          />
          <ActionRow
            icon={Combine}
            label="Ghép bàn"
            desc="Thêm bàn phụ cho nhóm đông"
            onClick={onMerge}
          />
          <ActionRow
            icon={Ban}
            label="Huỷ đơn"
            desc="Cần PIN supervisor"
            onClick={onCancel}
            danger
          />
        </div>
      </div>
    </div>
  )
}

function ActionRow({
  icon: Icon,
  label,
  desc,
  onClick,
  danger,
}: {
  icon: typeof Ban
  label: string
  desc?: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50"
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-xl",
          danger ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700"
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "text-sm font-bold",
            danger ? "text-rose-600" : "text-slate-900"
          )}
        >
          {label}
        </div>
        {desc ? (
          <div className="text-[11px] text-slate-500">{desc}</div>
        ) : null}
      </div>
    </button>
  )
}

function CartLine({
  line,
  readonly,
  onRemove,
}: {
  line: Line
  readonly?: boolean
  onRemove?: () => void
}) {
  const item = MENU_ITEMS.find((m) => m.id === line.menuItemId)
  if (!item) return null
  return (
    <div className="flex gap-3 rounded-2xl border bg-white p-3">
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-xl text-2xl"
        style={{ backgroundImage: item.imageGradient }}
        aria-hidden="true"
      >
        {item.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-900">
              {item.name}
            </div>
            {line.note ? (
              <div className="mt-0.5 text-[11px] text-blue-600">{line.note}</div>
            ) : null}
          </div>
          <span className="shrink-0 text-sm font-bold tabular-nums text-slate-900">
            {formatCurrency(item.price * line.qty)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              ×{line.qty}
            </span>
            {line.status ? <StatusChip status={line.status} /> : null}
          </div>
          {!readonly && onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              aria-label="Xoá"
              className="flex size-8 items-center justify-center rounded-full text-rose-500 active:bg-rose-50"
            >
              <Trash2 className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
