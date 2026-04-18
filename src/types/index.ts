export type MenuCategory = {
  id: string
  name: string
}

export type MenuItem = {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  available: number
  sold: number
  emoji: string
  imageGradient: string
}

export type TableStatus = "available" | "occupied" | "reserved"
export type TableSize = "small" | "large"

export type DiningTable = {
  id: string
  name: string
  seats: number
  status: TableStatus
  size: TableSize
  zone: string
}

export type Customer = {
  id: string
  name: string
  phone?: string
}

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled"

export type PaymentMethod = "cash" | "card" | "qr" | "ewallet"

export type ServiceMode = "dine-in" | "take-away"

export type OrderLine = {
  menuItemId: string
  name: string
  price: number
  quantity: number
  note?: string
}

export type Order = {
  id: string
  code: string
  customerId?: string
  customerName: string
  tableId?: string
  tableName?: string
  items: OrderLine[]
  subtotal: number
  tax: number
  total: number
  status: OrderStatus
  mode: ServiceMode
  createdAt: string
  updatedAt: string
}

export type Bill = {
  id: string
  code: string
  orderId: string
  customerName: string
  tableName?: string
  tableCode?: string
  items: OrderLine[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  paidAt: string
}
