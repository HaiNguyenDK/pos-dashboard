/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, UploadCloud, X } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { MENU_CATEGORIES } from "@/mocks/menu"
import type { MenuItem } from "@/types"

type Props = {
  className?: string
  product: MenuItem | null
  onClear: () => void
}

const EMPTY_FORM = {
  category: "",
  unitPrice: "",
  productName: "",
  code: "",
  stock: "0",
}

function productCode(id: string) {
  const num = parseInt(id.replace("m-", ""), 10) || 0
  return String(12340 + num).padStart(5, "0")
}

function productToForm(p: MenuItem) {
  return {
    category: p.categoryId,
    unitPrice: p.price.toString(),
    productName: p.name,
    code: productCode(p.id),
    stock: p.available.toString(),
  }
}

export function AddProductPanel({ className, product, onClear }: Props) {
  const { t } = useTranslation()
  const [form, setForm] = useState(EMPTY_FORM)
  const isEditing = product !== null

  useEffect(() => {
    setForm(product ? productToForm(product) : EMPTY_FORM)
  }, [product])

  const reset = () => {
    if (isEditing) {
      onClear()
    } else {
      setForm(EMPTY_FORM)
    }
  }

  const save = () => {
    if (!form.productName.trim()) {
      toast.error(t("add_product_panel.name_required"))
      return
    }
    if (isEditing) {
      toast.success(t("add_product_panel.product_updated"), {
        description: form.productName,
      })
      onClear()
    } else {
      toast.success(t("add_product_panel.product_saved"), {
        description: form.productName,
      })
      setForm(EMPTY_FORM)
    }
  }

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <aside className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-bold">
            {isEditing
              ? t("add_product_panel.title_edit")
              : t("add_product_panel.title_add")}
          </h2>
          {isEditing ? (
            <p className="text-muted-foreground text-xs">
              {t("add_product_panel.editing_info", { code: form.code })}
            </p>
          ) : null}
        </div>
        {isEditing ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={t("add_product_panel.close_edit_aria")}
            className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <UploadBox />

      <div className="border-t" />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold">
            {t("add_product_panel.category_label")}
          </Label>
          <Select
            value={form.category}
            onValueChange={(v) => update("category", v)}
          >
            <SelectTrigger className="rounded-xl data-[size=default]:h-11 w-full">
              <SelectValue placeholder={t("add_product_panel.category_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {MENU_CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold">
            {t("add_product_panel.unit_price_label")}
          </Label>
          <div className="relative">
            <Input
              type="text"
              inputMode="decimal"
              placeholder={t("add_product_panel.unit_price_placeholder")}
              value={form.unitPrice}
              onChange={(e) => update("unitPrice", e.target.value)}
              className="h-11 rounded-xl pr-9"
            />
            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="product-name" className="text-sm font-semibold">
          {t("add_product_panel.product_name_label")}
        </Label>
        <Input
          id="product-name"
          placeholder={t("add_product_panel.product_name_placeholder")}
          value={form.productName}
          onChange={(e) => update("productName", e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="code-product" className="text-sm font-semibold">
          {t("add_product_panel.code_label")}
        </Label>
        <Input
          id="code-product"
          placeholder={t("add_product_panel.code_placeholder")}
          value={form.code}
          onChange={(e) => update("code", e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="stock" className="text-sm font-semibold">
          {t("add_product_panel.stock_label")}
        </Label>
        <div className="relative">
          <Input
            id="stock"
            type="number"
            min={0}
            placeholder={t("add_product_panel.stock_placeholder")}
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            className="h-11 rounded-xl pr-9"
          />
          <ChevronRight className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={reset}
          className="h-11 rounded-full font-medium"
        >
          {isEditing ? t("common.cancel") : t("common.reset")}
        </Button>
        <Button
          type="button"
          onClick={save}
          className={cn(
            "h-11 rounded-full bg-blue-600 font-semibold text-white shadow-none",
            "hover:bg-blue-700 focus-visible:ring-blue-600"
          )}
        >
          {isEditing ? t("common.update") : t("common.save")}
        </Button>
      </div>
    </aside>
  )
}

function UploadBox() {
  const { t } = useTranslation()
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold">
        {t("add_product_panel.image_label")}
      </Label>
      <label
        className={cn(
          "group border-input flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-background transition-colors",
          "hover:border-blue-500 hover:bg-blue-50/40"
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
        <UploadCloud className="size-6 text-blue-500 group-hover:text-blue-600" />
        <span className="text-muted-foreground text-sm">
          {fileName ?? t("add_product_panel.image_placeholder")}
        </span>
      </label>
    </div>
  )
}
