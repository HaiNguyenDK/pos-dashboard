import { useMemo, useState } from "react"
import {
  AlertTriangle,
  ChefHat,
  Clock,
  Mail,
  Package,
  Phone,
  Plus,
  Search,
  Star,
  Timer,
  TrendingDown,
  TrendingUp,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import {
  INGREDIENTS,
  RECIPES,
  calcRecipeCost,
  type Ingredient,
  type Recipe,
} from "@/mocks/inventory"
import { MENU_ITEMS } from "@/mocks/menu"
import { SUPPLIERS, type Supplier } from "@/mocks/reviews"

type Tab = "ingredients" | "recipes" | "suppliers"

export function InventoryPage() {
  const [tab, setTab] = useState<Tab>("ingredients")
  const [query, setQuery] = useState("")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kho nguyên liệu</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản lý nguyên liệu thô và công thức chế biến · tự trừ kho theo đơn
          </p>
        </div>

        <div className="relative ml-auto w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            placeholder={
              tab === "ingredients" ? "Tìm nguyên liệu" : "Tìm món hoặc công thức"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-full pl-10"
          />
        </div>

        <Button className="h-11 rounded-full bg-blue-600 px-5 text-white hover:bg-blue-700 shadow-none">
          <Plus className="mr-2 size-4" />
          {tab === "ingredients"
            ? "Nhập kho"
            : tab === "recipes"
              ? "Tạo công thức"
              : "Thêm NCC"}
        </Button>
      </div>

      <div className="bg-muted flex w-fit rounded-full p-1">
        <button
          type="button"
          onClick={() => setTab("ingredients")}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
            tab === "ingredients"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Package className="size-4" />
          Nguyên liệu ({INGREDIENTS.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("recipes")}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
            tab === "recipes"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ChefHat className="size-4" />
          Công thức ({RECIPES.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("suppliers")}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
            tab === "suppliers"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Truck className="size-4" />
          Nhà cung cấp ({SUPPLIERS.length})
        </button>
      </div>

      {tab === "ingredients" ? (
        <IngredientsView query={query} />
      ) : tab === "recipes" ? (
        <RecipesView query={query} />
      ) : (
        <SuppliersView query={query} />
      )}
    </div>
  )
}

function SuppliersView({ query }: { query: string }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SUPPLIERS.filter((s) =>
      q
        ? s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.contactPerson.toLowerCase().includes(q)
        : true
    )
  }, [query])

  const totalSpent = SUPPLIERS.reduce((s, x) => s + x.totalSpent, 0)
  const avgLead =
    SUPPLIERS.reduce((s, x) => s + x.leadTimeDays, 0) / SUPPLIERS.length
  const topByRating = [...SUPPLIERS].sort((a, b) => b.rating - a.rating)[0]

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          icon={Truck}
          label="Tổng NCC"
          value={String(SUPPLIERS.length)}
          tone="bg-blue-50 text-blue-700 border-blue-200"
        />
        <StatCard
          icon={Clock}
          label="Lead time TB"
          value={`${avgLead.toFixed(1)} ngày`}
          tone="bg-amber-50 text-amber-700 border-amber-200"
        />
        <StatCard
          icon={TrendingUp}
          label="Tổng chi NCC"
          value={formatCurrency(totalSpent)}
          tone="bg-emerald-50 text-emerald-700 border-emerald-200"
        />
        <StatCard
          icon={Star}
          label="Top rating"
          value={topByRating ? topByRating.name : "—"}
          tone="bg-violet-50 text-violet-700 border-violet-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((sp) => (
          <SupplierCard key={sp.id} supplier={sp} />
        ))}
        {filtered.length === 0 ? (
          <div className="text-muted-foreground col-span-full rounded-2xl border bg-background px-6 py-10 text-center text-sm">
            Không có nhà cung cấp nào khớp
          </div>
        ) : null}
      </div>
    </>
  )
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const daysSinceLast = Math.floor(
    (Date.now() - new Date(supplier.lastOrderAt).getTime()) / (24 * 3600 * 1000)
  )
  const needsReorder = daysSinceLast > 7
  return (
    <article className="flex flex-col gap-3 rounded-2xl border bg-background p-4">
      <header className="flex items-start justify-between gap-2">
        <div>
          <div className="font-bold text-slate-900">{supplier.name}</div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            {supplier.category}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {supplier.rating.toFixed(1)}
        </span>
      </header>

      <div className="flex flex-col gap-1 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Phone className="size-3 text-slate-400" />
          <span>
            {supplier.phone} ·{" "}
            <span className="font-semibold">{supplier.contactPerson}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail className="size-3 text-slate-400" />
          <span className="truncate">{supplier.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-lg bg-slate-50 px-2 py-1.5">
          <div className="text-[9px] font-semibold uppercase text-slate-500">
            Lead time
          </div>
          <div className="text-sm font-black tabular-nums">
            {supplier.leadTimeDays}d
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 px-2 py-1.5">
          <div className="text-[9px] font-semibold uppercase text-slate-500">
            NL đang dùng
          </div>
          <div className="text-sm font-black tabular-nums">
            {supplier.activeIngredients}
          </div>
        </div>
        <div className="rounded-lg bg-emerald-50 px-2 py-1.5">
          <div className="text-[9px] font-semibold uppercase text-emerald-700">
            Tổng chi
          </div>
          <div className="text-sm font-black tabular-nums text-emerald-700">
            {formatCurrency(supplier.totalSpent)}
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t pt-2 text-[11px]">
        <span
          className={cn(
            "inline-flex items-center gap-1",
            needsReorder ? "text-amber-600" : "text-slate-500"
          )}
        >
          <Clock className="size-3" />
          Nhập gần nhất: {daysSinceLast}d
        </span>
        <button
          type="button"
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-bold",
            needsReorder
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          )}
        >
          {needsReorder ? "Đặt hàng lại" : "Chi tiết"}
        </button>
      </footer>
    </article>
  )
}

function IngredientsView({ query }: { query: string }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return INGREDIENTS.filter((i) =>
      q ? i.name.toLowerCase().includes(q) : true
    )
  }, [query])

  const lowStock = INGREDIENTS.filter((i) => i.stock < i.reorderPoint)
  const totalValue = INGREDIENTS.reduce(
    (s, i) => s + i.stock * i.costPerUnit,
    0
  )
  const totalItems = INGREDIENTS.length

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          icon={Package}
          label="Tổng loại"
          value={String(totalItems)}
          tone="bg-blue-50 text-blue-700 border-blue-200"
        />
        <StatCard
          icon={AlertTriangle}
          label="Sắp hết"
          value={String(lowStock.length)}
          tone="bg-rose-50 text-rose-700 border-rose-200"
        />
        <StatCard
          icon={TrendingUp}
          label="Giá trị tồn kho"
          value={formatCurrency(totalValue)}
          tone="bg-emerald-50 text-emerald-700 border-emerald-200"
        />
        <StatCard
          icon={Truck}
          label="NCC liên kết"
          value={String(new Set(INGREDIENTS.map((i) => i.supplier)).size)}
          tone="bg-violet-50 text-violet-700 border-violet-200"
        />
      </div>

      <div className="bg-background rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Nguyên liệu</th>
              <th className="px-3 py-3 text-right font-medium">Tồn kho</th>
              <th className="px-3 py-3 text-right font-medium">Reorder</th>
              <th className="px-3 py-3 text-right font-medium">Giá / đơn vị</th>
              <th className="px-3 py-3 text-right font-medium">Tổng giá trị</th>
              <th className="px-3 py-3 text-left font-medium">Nhà cung cấp</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-muted-foreground px-5 py-10 text-center"
                >
                  Không có nguyên liệu nào
                </td>
              </tr>
            ) : (
              filtered.map((ing) => (
                <IngredientRow key={ing.id} ing={ing} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

function IngredientRow({ ing }: { ing: Ingredient }) {
  const percent = Math.min(
    100,
    Math.round((ing.stock / (ing.reorderPoint * 3)) * 100)
  )
  const low = ing.stock < ing.reorderPoint
  const critical = ing.stock < ing.reorderPoint * 0.5

  return (
    <tr className="hover:bg-muted/30">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-slate-50 text-xl">
            {ing.emoji}
          </div>
          <div>
            <div className="font-bold text-slate-900">{ing.name}</div>
            <div className="text-muted-foreground text-[11px]">
              Nhập lần cuối:{" "}
              {new Date(ing.lastRestockedAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-right">
        <div
          className={cn(
            "inline-flex flex-col items-end font-bold tabular-nums",
            critical ? "text-rose-600" : low ? "text-amber-600" : "text-slate-900"
          )}
        >
          <span>
            {ing.stock.toLocaleString()}{" "}
            <span className="text-xs font-normal opacity-70">{ing.unit}</span>
          </span>
          <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full",
                critical
                  ? "bg-rose-500"
                  : low
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-500">
        {ing.reorderPoint.toLocaleString()} {ing.unit}
      </td>
      <td className="px-3 py-3 text-right font-medium tabular-nums">
        {formatCurrency(ing.costPerUnit)}
      </td>
      <td className="px-3 py-3 text-right font-bold text-emerald-700 tabular-nums">
        {formatCurrency(ing.stock * ing.costPerUnit)}
      </td>
      <td className="px-3 py-3 text-xs text-slate-500">{ing.supplier}</td>
      <td className="px-5 py-3 text-right">
        {low ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 hover:bg-rose-200"
          >
            <AlertTriangle className="size-3" />
            Nhập thêm
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            Chi tiết
          </button>
        )}
      </td>
    </tr>
  )
}

function RecipesView({ query }: { query: string }) {
  const [selectedId, setSelectedId] = useState<string>(
    RECIPES[0]?.menuItemId ?? ""
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RECIPES.filter((r) => {
      const item = MENU_ITEMS.find((m) => m.id === r.menuItemId)
      return q ? item?.name.toLowerCase().includes(q) : true
    })
  }, [query])

  const selected = filtered.find((r) => r.menuItemId === selectedId) ?? filtered[0]

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="bg-background rounded-2xl border">
        <div className="bg-muted/40 px-5 py-3">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Công thức ({filtered.length})
          </div>
        </div>
        <div className="divide-y">
          {filtered.map((r) => {
            const item = MENU_ITEMS.find((m) => m.id === r.menuItemId)
            if (!item) return null
            const cost = calcRecipeCost(r)
            const margin = ((item.price - cost) / item.price) * 100
            const active = selected?.menuItemId === r.menuItemId
            return (
              <button
                key={r.menuItemId}
                type="button"
                onClick={() => setSelectedId(r.menuItemId)}
                className={cn(
                  "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors",
                  active ? "bg-blue-50/70" : "hover:bg-muted/30"
                )}
              >
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundImage: item.imageGradient }}
                >
                  {item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-bold">
                      {item.name}
                    </span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {r.lines.length} NL
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Timer className="size-3" />
                      {r.laborMinutes}' chế biến
                    </span>
                    <span>·</span>
                    <span>
                      Giá bán{" "}
                      <b className="text-slate-900 tabular-nums">
                        {formatCurrency(item.price)}
                      </b>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase text-slate-400">
                    COGS
                  </div>
                  <div className="font-bold tabular-nums text-slate-900">
                    {formatCurrency(cost)}
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-end gap-0.5 text-[10px] font-bold",
                      margin > 60
                        ? "text-emerald-600"
                        : margin > 30
                          ? "text-amber-600"
                          : "text-rose-600"
                    )}
                  >
                    {margin > 0 ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {margin.toFixed(0)}% biên
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <aside className="bg-background flex flex-col gap-4 rounded-2xl border p-5 lg:sticky lg:top-20">
        {selected ? (
          <RecipeDetail recipe={selected} />
        ) : (
          <div className="text-muted-foreground py-10 text-center text-sm">
            Chọn 1 công thức để xem chi tiết
          </div>
        )}
      </aside>
    </div>
  )
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const item = MENU_ITEMS.find((m) => m.id === recipe.menuItemId)
  if (!item) return null
  const cost = calcRecipeCost(recipe)
  const margin = ((item.price - cost) / item.price) * 100

  return (
    <>
      <header className="flex items-start gap-3">
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-4xl"
          style={{ backgroundImage: item.imageGradient }}
        >
          {item.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
          <div className="mt-0.5 text-xs text-slate-500">
            Yield {recipe.yields} phần · {recipe.laborMinutes}' chế biến
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-bold">
            <span className="text-slate-500">Giá bán</span>
            <span className="text-slate-900 tabular-nums">
              {formatCurrency(item.price)}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="COGS" value={formatCurrency(cost)} tone="slate" />
        <MiniStat
          label="Lợi nhuận"
          value={formatCurrency(item.price - cost)}
          tone="emerald"
        />
        <MiniStat
          label="Biên lợi"
          value={`${margin.toFixed(0)}%`}
          tone={margin > 60 ? "emerald" : margin > 30 ? "amber" : "rose"}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Nguyên liệu ({recipe.lines.length})
          </h4>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
          >
            <Plus className="size-3" />
            Thêm NL
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {recipe.lines.map((l) => {
            const ing = INGREDIENTS.find((i) => i.id === l.ingredientId)
            if (!ing) return null
            const lineCost = ing.costPerUnit * l.quantity
            return (
              <div
                key={l.ingredientId}
                className="flex items-center gap-3 rounded-xl border bg-slate-50 px-3 py-2"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-white text-lg ring-1 ring-slate-200">
                  {ing.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{ing.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {formatCurrency(ing.costPerUnit)}/{ing.unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black tabular-nums">
                    {l.quantity}
                    <span className="ml-1 text-xs font-normal text-slate-500">
                      {ing.unit}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-700 tabular-nums">
                    = {formatCurrency(lineCost)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-900">
        <b>Auto-deduct:</b> mỗi phần bán đi trừ kho đúng theo công thức này.
      </div>
    </>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Package
  label: string
  value: string
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
        <span className="text-xl font-black tabular-nums">{value}</span>
      </div>
    </div>
  )
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "slate" | "emerald" | "amber" | "rose"
}) {
  const bg = {
    slate: "bg-slate-50 text-slate-900",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  }[tone]
  return (
    <div className={cn("rounded-xl p-3 text-center", bg)}>
      <div className="text-[10px] font-semibold uppercase opacity-70">
        {label}
      </div>
      <div className="mt-0.5 text-base font-black tabular-nums">{value}</div>
    </div>
  )
}
