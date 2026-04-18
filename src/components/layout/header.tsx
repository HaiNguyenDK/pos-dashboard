import { Bell, Search } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type HeaderProps = {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="bg-background/80 sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6 backdrop-blur">
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate text-lg font-semibold leading-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground truncate text-xs">{description}</p>
        ) : null}
      </div>

      <div className="relative hidden w-72 md:block">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input placeholder="Search..." className="pl-9" />
      </div>

      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="size-5" />
      </Button>

      <Avatar className="size-9">
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </header>
  )
}
