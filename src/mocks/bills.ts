import type { Bill, OrderLine, PaymentMethod } from "@/types"

const LINE_SETS: OrderLine[][] = [
  [
    { menuItemId: "m-9", name: "Crispy Dory Sambal Matah", price: 50.5, quantity: 1 },
    { menuItemId: "m-12", name: "Spicy Tuna Nachos", price: 42.5, quantity: 2 },
    { menuItemId: "m-20", name: "Brownie", price: 38, quantity: 3 },
  ],
  [
    { menuItemId: "m-16", name: "Beef Burger", price: 95, quantity: 2 },
    { menuItemId: "m-28", name: "Fresh Lemonade", price: 24, quantity: 2 },
  ],
  [
    { menuItemId: "m-13", name: "Alfredo", price: 101.5, quantity: 1 },
    { menuItemId: "m-19", name: "Cheesecake", price: 48, quantity: 2 },
    { menuItemId: "m-26", name: "Cappuccino", price: 28, quantity: 2 },
  ],
  [
    { menuItemId: "m-17", name: "Grilled Salmon", price: 120, quantity: 1 },
    { menuItemId: "m-18", name: "Tiramisu", price: 45, quantity: 2 },
  ],
]

const CUSTOMERS = [
  "Cheryl Arema",
  "Vinicius Bayu",
  "Kylian Rex",
  "Rijal Arudam",
  "Ed Berni",
  "Mia Tanaka",
  "Lena Pham",
  "Jonah Pratama",
  "Hoang Nguyen",
  "Alicia Moreno",
]

const TABLE_PAIRS = [
  { code: "10A", name: "Table 3" },
  { code: "03B", name: "Table 5" },
  { code: "07A", name: "Table 2" },
  { code: "12C", name: "Table 8" },
  { code: "05B", name: "Table 4" },
  { code: "15A", name: "Table 6" },
  { code: "09C", name: "Table 1" },
]

const METHODS: PaymentMethod[] = ["cash", "card", "qr", "ewallet"]

function buildBills(count: number): Bill[] {
  const bills: Bill[] = []
  for (let i = 0; i < count; i++) {
    const items = LINE_SETS[i % LINE_SETS.length]
    const customer = CUSTOMERS[i % CUSTOMERS.length]
    const table = TABLE_PAIRS[i % TABLE_PAIRS.length]
    const method = METHODS[i % METHODS.length]
    const subtotal = items.reduce((s, x) => s + x.price * x.quantity, 0)
    const tax = Math.round(subtotal * 10) / 100
    const total = subtotal + tax
    const code = (12532 - i).toString()
    const hourOffset = i * 15
    const paidAt = new Date(
      Date.UTC(2024, 1, 22, 10, hourOffset % 1440)
    ).toISOString()
    bills.push({
      id: `b-${i + 1}`,
      code,
      orderId: `o-h-${i + 1}`,
      customerName: customer,
      tableName: table.name,
      tableCode: table.code,
      items,
      subtotal,
      tax,
      total,
      paymentMethod: method,
      paidAt,
    })
  }
  return bills
}

export const BILLS: Bill[] = buildBills(42)
