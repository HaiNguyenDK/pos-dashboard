import type { MenuCategory } from "@/types"
import { cn } from "@/lib/utils"

type Props = {
  categories: MenuCategory[]
  value: string
  onChange: (id: string) => void
}

export function MenuCategoryTabs({ categories, value, onChange }: Props) {
  return (
    <div
      role="tablist"
      className="bg-muted flex w-full items-center gap-1 rounded-full p-1"
    >
      {categories.map((cat) => {
        const active = cat.id === value
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(cat.id)}
            className={cn(
              "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
