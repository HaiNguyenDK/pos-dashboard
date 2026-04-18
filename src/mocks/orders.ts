import type { Order, OrderLine, OrderStatus, ServiceMode } from "@/types"

function buildOrder(
  partial: Omit<Order, "subtotal" | "tax" | "total">
): Order {
  const subtotal = partial.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  )
  const tax = Math.round(subtotal * 10) / 100
  const total = subtotal + tax
  return { ...partial, subtotal, tax, total }
}

const LINE_A: OrderLine[] = [
  { menuItemId: "m-9", name: "Crispy Dory Sambal Matah", price: 50.5, quantity: 1, note: "Medium - Not spicy" },
  { menuItemId: "m-12", name: "Spicy Tuna Nachos", price: 42.5, quantity: 2, note: "Medium - Not spicy" },
  { menuItemId: "m-20", name: "Brownie", price: 38, quantity: 3, note: "Medium - Not spicy" },
]

const LINE_B: OrderLine[] = [
  { menuItemId: "m-16", name: "Beef Burger", price: 95, quantity: 2, note: "Well done - Extra cheese" },
  { menuItemId: "m-28", name: "Fresh Lemonade", price: 24, quantity: 2, note: "Less ice" },
]

const LINE_C: OrderLine[] = [
  { menuItemId: "m-13", name: "Alfredo", price: 101.5, quantity: 1, note: "No onion" },
  { menuItemId: "m-19", name: "Cheesecake", price: 48, quantity: 2 },
  { menuItemId: "m-26", name: "Cappuccino", price: 28, quantity: 2, note: "Less sugar" },
]

const LINE_D: OrderLine[] = [
  { menuItemId: "m-10", name: "Dory En Oats", price: 101.5, quantity: 2 },
  { menuItemId: "m-25", name: "Iced Americano", price: 22, quantity: 1, note: "Extra shot" },
]

const LINE_E: OrderLine[] = [
  { menuItemId: "m-17", name: "Grilled Salmon", price: 120, quantity: 1, note: "Medium rare" },
  { menuItemId: "m-18", name: "Tiramisu", price: 45, quantity: 2 },
  { menuItemId: "m-29", name: "Green Tea", price: 20, quantity: 2, note: "Hot" },
]

const LINE_F: OrderLine[] = [
  { menuItemId: "m-15", name: "Blackpaper Chicken", price: 78, quantity: 2, note: "Extra spicy" },
  { menuItemId: "m-30", name: "Sparkling Water", price: 18, quantity: 2 },
]

type Draft = {
  customerName: string
  code: string
  table?: string
  status: OrderStatus
  mode: ServiceMode
  items: OrderLine[]
  createdAt: string
}

const DRAFTS: Draft[] = [
  { customerName: "Cheryl Arema", code: "1234", table: "Table 4A", status: "cancelled", mode: "dine-in", items: LINE_A, createdAt: "2024-07-12T10:20:00" },
  { customerName: "Cheryl Arema", code: "1235", table: "Table 4A", status: "pending", mode: "dine-in", items: LINE_A, createdAt: "2024-07-12T10:20:00" },
  { customerName: "Cheryl Arema", code: "1236", table: "Table 4A", status: "ready", mode: "dine-in", items: LINE_A, createdAt: "2024-07-12T10:20:00" },
  { customerName: "Cheryl Arema", code: "1237", table: "Table 4A", status: "ready", mode: "dine-in", items: LINE_A, createdAt: "2024-07-12T10:20:00" },
  { customerName: "Cheryl Arema", code: "1238", table: "Table 4A", status: "completed", mode: "dine-in", items: LINE_A, createdAt: "2024-07-12T10:20:00" },
  { customerName: "Cheryl Arema", code: "1239", table: "Table 4A", status: "completed", mode: "dine-in", items: LINE_A, createdAt: "2024-07-12T10:20:00" },
  { customerName: "Vinicius Bayu", code: "1240", table: "Table 8B", status: "pending", mode: "dine-in", items: LINE_B, createdAt: "2024-07-12T11:05:00" },
  { customerName: "Vinicius Bayu", code: "1241", table: "Table 8B", status: "ready", mode: "dine-in", items: LINE_B, createdAt: "2024-07-12T11:20:00" },
  { customerName: "Kylian Rex", code: "1242", table: "Table 2C", status: "completed", mode: "dine-in", items: LINE_C, createdAt: "2024-07-12T11:35:00" },
  { customerName: "Kylian Rex", code: "1243", table: "Table 2C", status: "cancelled", mode: "dine-in", items: LINE_C, createdAt: "2024-07-12T11:50:00" },
  { customerName: "Rijal Arudam", code: "1244", table: "Table 2A", status: "completed", mode: "dine-in", items: LINE_D, createdAt: "2024-07-12T12:05:00" },
  { customerName: "Rijal Arudam", code: "1245", table: "Table 2A", status: "ready", mode: "dine-in", items: LINE_D, createdAt: "2024-07-12T12:20:00" },
  { customerName: "Ed Berni", code: "1246", status: "pending", mode: "take-away", items: LINE_E, createdAt: "2024-07-12T12:35:00" },
  { customerName: "Ed Berni", code: "1247", status: "completed", mode: "take-away", items: LINE_E, createdAt: "2024-07-12T12:50:00" },
  { customerName: "Mia Tanaka", code: "1248", status: "ready", mode: "take-away", items: LINE_F, createdAt: "2024-07-12T13:05:00" },
  { customerName: "Mia Tanaka", code: "1249", table: "Table 5A", status: "cancelled", mode: "dine-in", items: LINE_F, createdAt: "2024-07-12T13:20:00" },
  { customerName: "Lena Pham", code: "1250", table: "Table 3B", status: "pending", mode: "dine-in", items: LINE_C, createdAt: "2024-07-12T13:35:00" },
  { customerName: "Lena Pham", code: "1251", status: "completed", mode: "take-away", items: LINE_C, createdAt: "2024-07-12T13:50:00" },
]

export const ORDERS: Order[] = DRAFTS.map((d, idx) =>
  buildOrder({
    id: `o-${idx + 1}`,
    code: d.code,
    customerName: d.customerName,
    tableName: d.table,
    tableId: d.table ? `t-${idx}` : undefined,
    items: d.items,
    status: d.status,
    mode: d.mode,
    createdAt: new Date(d.createdAt).toISOString(),
    updatedAt: new Date(d.createdAt).toISOString(),
  })
)
