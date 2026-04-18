import { useTranslation } from "react-i18next"

import type { MenuItem } from "@/types"
import { QtyControl } from "./qty-control"

type Props = {
  item: MenuItem
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

export function MenuCard({ item, quantity, onIncrement, onDecrement }: Props) {
  const { t } = useTranslation()
  const [dollars, cents] = item.price.toFixed(2).split(".")
  return (
    <article className="bg-background flex flex-col gap-4 rounded-2xl border p-4 shadow-sm">
      <div className="flex gap-3">
        <div
          className="flex size-20 shrink-0 items-center justify-center rounded-xl text-3xl"
          style={{ backgroundImage: item.imageGradient }}
          aria-hidden="true"
        >
          {item.emoji}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
            {item.name}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
            {item.description}
          </p>
          <div className="text-muted-foreground mt-auto text-xs">
            {t("menu_card.available", { count: item.available })}{" "}
            <span className="mx-1">•</span>
            {t("menu_card.sold", { count: item.sold })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-baseline">
          <span className="text-lg font-semibold text-blue-600">$</span>
          <span className="text-2xl font-bold leading-none">{dollars}</span>
          <span className="text-2xl font-bold leading-none">.{cents}</span>
        </div>
        <QtyControl
          value={quantity}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
        />
      </div>
    </article>
  )
}
