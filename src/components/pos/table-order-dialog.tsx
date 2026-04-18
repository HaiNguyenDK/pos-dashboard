/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
import { useEffect, useMemo, useState } from "react"
import { CalendarDays, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

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
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { TABLES } from "@/mocks/tables"
import type { OrderType } from "@/store/pos-context"
import type { DiningTable } from "@/types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTable: DiningTable | null
  onConfirm: (data: {
    tables: string[]
    orderType: OrderType
    time?: string
    date?: string
  }) => void
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function startOfWeek(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function TableOrderDialog({
  open,
  onOpenChange,
  initialTable,
  onConfirm,
}: Props) {
  const { t } = useTranslation()
  const [orderType, setOrderType] = useState<OrderType>("running")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [time, setTime] = useState("09.15")
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())

  const orderCode = useMemo(
    () => Math.floor(1000 + Math.random() * 9000).toString(),
    [open]
  )

  useEffect(() => {
    if (!open || !initialTable) return
    const nearby = TABLES.find(
      (t) =>
        t.id !== initialTable.id &&
        t.zone === initialTable.zone &&
        t.status === "available"
    )
    const initialIds = nearby
      ? [nearby.id, initialTable.id]
      : [initialTable.id]
    setSelectedIds(initialIds)
    setOrderType("running")
    setTime("09.15")
    setSelectedDate(new Date())
  }, [open, initialTable])

  const selectedTables = TABLES.filter((t) => selectedIds.includes(t.id))

  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate])
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart)
        d.setDate(weekStart.getDate() + i)
        return d
      }),
    [weekStart]
  )

  const monthLabel = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`

  const toggleTable = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const canSubmit = selectedIds.length > 0

  const handleContinue = () => {
    if (!canSubmit) return
    onConfirm({
      tables: selectedTables.map((t) => t.name),
      orderType,
      time: orderType === "reservation" ? time : undefined,
      date:
        orderType === "reservation" ? selectedDate.toISOString() : undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="pb-3 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-xl font-bold">
                {t("table_dialog.title")}
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                {t("table_dialog.order_number", { code: orderCode })}
              </p>
            </div>
            <Select
              value={orderType}
              onValueChange={(v) => setOrderType(v as OrderType)}
            >
              <SelectTrigger className="min-w-40 rounded-xl data-[size=default]:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="running">
                  {t("table_dialog.order_type_running")}
                </SelectItem>
                <SelectItem value="reservation">
                  {t("table_dialog.order_type_reservation")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold">
            {t("table_dialog.number_table_label")}
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedTables.length === 0 ? (
              <span className="text-muted-foreground text-sm">
                {t("table_dialog.no_tables_selected")}
              </span>
            ) : (
              selectedTables.map((tbl) => (
                <button
                  key={tbl.id}
                  type="button"
                  onClick={() => toggleTable(tbl.id)}
                  className="rounded-xl border-2 border-blue-500 bg-white px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-blue-50"
                >
                  {tbl.name}
                </button>
              ))
            )}
          </div>
        </div>

        {orderType === "reservation" ? (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reservation-time" className="text-sm font-semibold">
                {t("table_dialog.select_time_label")}
              </Label>
              <div className="relative">
                <Input
                  id="reservation-time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="09.15"
                  className="h-11 rounded-xl pr-10"
                />
                <ChevronRight className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">
                  {t("table_dialog.select_date_label")}
                </Label>
                <span className="text-muted-foreground text-sm">{monthLabel}</span>
              </div>
              <div className="flex items-stretch gap-2">
                <div className="bg-muted/40 flex w-12 shrink-0 items-center justify-center rounded-lg border">
                  <CalendarDays className="text-muted-foreground size-5" />
                </div>
                <div className="grid min-w-0 flex-1 grid-cols-7 gap-1.5">
                  {days.map((d) => {
                    const selected = isSameDay(d, selectedDate)
                    return (
                      <button
                        key={d.toISOString()}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        className={cn(
                          "flex flex-col items-center gap-0.5 rounded-lg border py-1.5 text-sm transition-colors",
                          selected
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "hover:bg-muted/60"
                        )}
                      >
                        <span
                          className={cn(
                            "text-xs",
                            selected ? "text-blue-600" : "text-muted-foreground"
                          )}
                        >
                          {WEEKDAYS[d.getDay()]}
                        </span>
                        <span className="font-semibold">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        ) : null}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-full font-medium"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={!canSubmit}
            className={cn(
              "h-11 rounded-full bg-blue-600 font-semibold text-white shadow-none",
              "hover:bg-blue-700 focus-visible:ring-blue-600",
              "disabled:opacity-60"
            )}
          >
            {t("common.continue")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
