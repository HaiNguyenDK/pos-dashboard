import { useTranslation } from "react-i18next"

import type { Order } from "@/types"
import { OrderCard } from "./order-card"

type Props = {
  orders: Order[]
  onSeeAll?: () => void
}

export function OrderListStrip({ orders, onSeeAll }: Props) {
  const { t } = useTranslation()
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("order_strip.heading")}</h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          {t("order_strip.see_all")}
        </button>
      </div>
      <div className="-mx-1 overflow-x-auto">
        <div className="flex gap-4 px-1 pb-1">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </section>
  )
}
