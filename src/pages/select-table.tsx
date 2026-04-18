import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"

import { TableOrderDialog } from "@/components/pos/table-order-dialog"
import { TableVisual } from "@/components/pos/table-visual"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { TABLES } from "@/mocks/tables"
import { usePos } from "@/store/pos-context"
import type { DiningTable, TableStatus } from "@/types"

const ZONES = ["A", "B", "C"] as const

type Filter = "all" | TableStatus

const FILTER_KEYS: Record<Filter, string> = {
  all: "select_table.filter_all",
  available: "select_table.filter_available",
  reserved: "select_table.filter_reserved",
  occupied: "select_table.filter_occupied",
}

export function SelectTablePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { tables: selectedTableNames, setReservation } = usePos()
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")
  const [dialogTable, setDialogTable] = useState<DiningTable | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TABLES.filter((t) => {
      if (filter !== "all" && t.status !== filter) return false
      if (q && !t.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [filter, query])

  const byZone = useMemo(() => {
    const map = new Map<string, typeof TABLES>()
    for (const zone of ZONES) map.set(zone, [])
    for (const table of filtered) map.get(table.zone)?.push(table)
    return map
  }, [filtered])

  const handleSelect = (tableId: string) => {
    const table = TABLES.find((t) => t.id === tableId)
    if (!table || table.status !== "available") return
    setDialogTable(table)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-semibold">{t("select_table.title")}</h1>

        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
          <LegendDot color="bg-blue-500" label={t("select_table.legend_available")} />
          <LegendDot color="bg-red-500" label={t("select_table.legend_reserved")} />
          <LegendDot color="bg-emerald-500" label={t("select_table.legend_occupied")} />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as Filter)}
          >
            <SelectTrigger className="min-w-37.5 rounded-xl data-[size=default]:h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FILTER_KEYS) as Filter[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {t(FILTER_KEYS[key])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-56 md:w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder={t("common.search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 rounded-xl pl-9"
            />
          </div>
        </div>
      </div>

      <div className="bg-background rounded-2xl border p-6 md:p-8">
        <div className="flex flex-col gap-10">
          {ZONES.map((zone) => {
            const tables = byZone.get(zone) ?? []
            return (
              <div key={zone} className="flex items-center gap-6">
                <div className="flex min-h-36 flex-1 items-center justify-around gap-4 overflow-x-auto">
                  {tables.length === 0 ? (
                    <span className="text-muted-foreground text-sm">
                      {t("select_table.no_tables")}
                    </span>
                  ) : (
                    tables.map((t) => (
                      <TableVisual
                        key={t.id}
                        table={t}
                        selected={selectedTableNames.includes(t.name)}
                        onSelect={() => handleSelect(t.id)}
                        disabled={t.status !== "available"}
                      />
                    ))
                  )}
                </div>
                <div className="text-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-2xl border-2 text-3xl font-bold">
                  {zone}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <TableOrderDialog
        open={dialogTable !== null}
        onOpenChange={(open) => {
          if (!open) setDialogTable(null)
        }}
        initialTable={dialogTable}
        onConfirm={(data) => {
          setReservation({
            tables: data.tables,
            orderType: data.orderType,
            time: data.time,
            date: data.date,
          })
          setDialogTable(null)
          navigate("/dashboard")
        }}
      />
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-2.5 rounded-full", color)} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
