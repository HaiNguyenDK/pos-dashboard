import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

import { CartPanel } from "@/components/pos/cart-panel"
import { DashboardAlertStrip } from "@/components/pos/dashboard-alert-strip"
import { MenuCard } from "@/components/pos/menu-card"
import { MenuCategoryTabs } from "@/components/pos/menu-category-tabs"
import { OrderListStrip } from "@/components/pos/order-list-strip"
import { OrderPaymentDrawer } from "@/components/pos/order-payment-drawer"
import { MENU_CATEGORIES, MENU_ITEMS } from "@/mocks/menu"
import { ORDERS } from "@/mocks/orders"
import { usePos } from "@/store/pos-context"

export function DashboardPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    cart,
    customerName,
    tables,
    note,
    mode,
    setCustomerName,
    setNote,
    setMode,
    incrementItem,
    decrementItem,
    clearOrder,
  } = usePos()

  const [categoryId, setCategoryId] = useState(MENU_CATEGORIES[1].id)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentOrderCode] = useState(() =>
    Math.floor(10000 + Math.random() * 90000).toString()
  )

  const filteredItems = useMemo(
    () => MENU_ITEMS.filter((i) => i.categoryId === categoryId),
    [categoryId]
  )

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const item = MENU_ITEMS.find((m) => m.id === id)
          return item ? { item, quantity: qty } : null
        })
        .filter(
          (l): l is { item: (typeof MENU_ITEMS)[number]; quantity: number } =>
            l !== null
        ),
    [cart]
  )

  const subtotal = cartLines.reduce(
    (sum, l) => sum + l.item.price * l.quantity,
    0
  )
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleProcess = () => {
    if (cartLines.length === 0) return
    setPaymentOpen(true)
  }

  const handlePaymentConfirm = (method: string, amount: number) => {
    toast.success(t("dashboard.payment_received"), {
      description: t("dashboard.payment_description", {
        method: method.toUpperCase(),
        amount: amount.toFixed(2),
        customer: customerName || "Guest",
      }),
    })
    setPaymentOpen(false)
    clearOrder()
  }

  return (
    <div className="grid min-h-[calc(100svh-6rem)] grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="flex min-w-0 flex-col gap-6">
        <DashboardAlertStrip />

        <OrderListStrip
          orders={ORDERS}
          onSeeAll={() => navigate("/orders")}
        />

        <MenuCategoryTabs
          categories={MENU_CATEGORIES}
          value={categoryId}
          onChange={setCategoryId}
        />

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("dashboard.menu_heading")}</h2>
            <span className="text-muted-foreground text-sm">
              {t("common.showing_items", { count: filteredItems.length })}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                quantity={cart[item.id] ?? 0}
                onIncrement={() => incrementItem(item.id)}
                onDecrement={() => decrementItem(item.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <CartPanel
        mode={mode}
        onModeChange={setMode}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        tables={tables}
        onSelectTable={() => navigate("/select-table")}
        note={note}
        onNoteChange={(next) => {
          setNote(next)
          if (next.trim()) toast.success(t("dashboard.note_added"))
        }}
        lines={cartLines}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onProcess={handleProcess}
      />

      <OrderPaymentDrawer
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        orderCode={paymentOrderCode}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  )
}
