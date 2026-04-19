export type KdsStation = "grill" | "cold" | "bar" | "dessert"
export type KdsTicketStatus = "pending" | "preparing" | "ready"

export type KdsItem = {
  id: string
  name: string
  emoji: string
  quantity: number
  modifiers: string[]
  note?: string
  urgent?: boolean
  voided?: boolean
  prepDone?: boolean
}

export type KdsTicket = {
  id: string
  code: string
  orderId: string
  tableName?: string
  customerName: string
  mode: "dine-in" | "take-away"
  station: KdsStation
  status: KdsTicketStatus
  items: KdsItem[]
  orderNote?: string
  waiterName: string
  createdAt: string
  startedAt?: string
}

const now = Date.now()
const minAgo = (m: number) => new Date(now - m * 60 * 1000).toISOString()

export const KDS_TICKETS: KdsTicket[] = [
  {
    id: "kt-1",
    code: "1234",
    orderId: "o-1",
    tableName: "A3",
    customerName: "Cheryl Arema",
    mode: "dine-in",
    station: "grill",
    status: "preparing",
    waiterName: "Rijal",
    createdAt: minAgo(3),
    startedAt: minAgo(2),
    orderNote: "Khách dị ứng hành",
    items: [
      {
        id: "i-1",
        name: "Eggs Benedict",
        emoji: "🍳",
        quantity: 2,
        modifiers: ["Medium", "Không cay"],
        note: "KHÔNG HÀNH (khách dị ứng)",
        urgent: true,
      },
      {
        id: "i-2",
        name: "Beef Burger",
        emoji: "🍔",
        quantity: 1,
        modifiers: ["Well done", "Thêm phô mai"],
      },
    ],
  },
  {
    id: "kt-2",
    code: "1235",
    orderId: "o-2",
    tableName: "B2",
    customerName: "Vinicius Bayu",
    mode: "dine-in",
    station: "grill",
    status: "preparing",
    waiterName: "Rijal",
    createdAt: minAgo(5),
    startedAt: minAgo(4),
    items: [
      {
        id: "i-3",
        name: "Beef Burger",
        emoji: "🍔",
        quantity: 1,
        modifiers: ["Well done"],
      },
      {
        id: "i-4",
        name: "Grilled Salmon",
        emoji: "🐟",
        quantity: 2,
        modifiers: ["Medium rare"],
        note: "Salmon riêng biệt",
      },
    ],
  },
  {
    id: "kt-3",
    code: "1236",
    orderId: "o-3",
    tableName: "A5",
    customerName: "Kylian Rex",
    mode: "dine-in",
    station: "grill",
    status: "preparing",
    waiterName: "Mia",
    createdAt: minAgo(9),
    startedAt: minAgo(8),
    items: [
      {
        id: "i-5",
        name: "Crispy Dory Sambal",
        emoji: "🍤",
        quantity: 1,
        modifiers: ["Hot sauce"],
      },
      {
        id: "i-6",
        name: "Blackpaper Chicken",
        emoji: "🍗",
        quantity: 2,
        modifiers: ["Extra spicy"],
      },
    ],
  },
  {
    id: "kt-4",
    code: "1237",
    orderId: "o-4",
    customerName: "Ed Berni",
    mode: "take-away",
    station: "dessert",
    status: "pending",
    waiterName: "Rijal",
    createdAt: minAgo(1),
    items: [
      {
        id: "i-7",
        name: "Brownie",
        emoji: "🍫",
        quantity: 3,
        modifiers: [],
      },
    ],
  },
  {
    id: "kt-5",
    code: "1238",
    orderId: "o-5",
    tableName: "C1",
    customerName: "Lena Pham",
    mode: "dine-in",
    station: "grill",
    status: "preparing",
    waiterName: "Mia",
    createdAt: minAgo(16),
    startedAt: minAgo(15),
    items: [
      {
        id: "i-8",
        name: "Alfredo",
        emoji: "🍝",
        quantity: 1,
        modifiers: ["No onion"],
      },
    ],
  },
  {
    id: "kt-6",
    code: "1239",
    orderId: "o-6",
    tableName: "B4",
    customerName: "Mia Tanaka",
    mode: "dine-in",
    station: "cold",
    status: "preparing",
    waiterName: "Rijal",
    createdAt: minAgo(4),
    startedAt: minAgo(3),
    items: [
      {
        id: "i-9",
        name: "Caesar Salad",
        emoji: "🥗",
        quantity: 1,
        modifiers: ["Extra parmesan"],
      },
      {
        id: "i-10",
        name: "Tuna Tartare",
        emoji: "🐟",
        quantity: 1,
        modifiers: [],
      },
    ],
  },
  {
    id: "kt-7",
    code: "1240",
    orderId: "o-7",
    tableName: "A1",
    customerName: "Rijal Arudam",
    mode: "dine-in",
    station: "bar",
    status: "pending",
    waiterName: "Rijal",
    createdAt: minAgo(1),
    items: [
      {
        id: "i-11",
        name: "Fresh Lemonade",
        emoji: "🍋",
        quantity: 2,
        modifiers: ["Less ice"],
      },
      {
        id: "i-12",
        name: "Cappuccino",
        emoji: "☕",
        quantity: 2,
        modifiers: ["Less sugar"],
      },
    ],
  },
  {
    id: "kt-8",
    code: "1241",
    orderId: "o-8",
    tableName: "C3",
    customerName: "Ed Berni",
    mode: "dine-in",
    station: "bar",
    status: "preparing",
    waiterName: "Mia",
    createdAt: minAgo(6),
    startedAt: minAgo(5),
    items: [
      {
        id: "i-13",
        name: "Iced Americano",
        emoji: "☕",
        quantity: 1,
        modifiers: ["Extra shot"],
      },
      {
        id: "i-14",
        name: "Green Tea",
        emoji: "🍵",
        quantity: 2,
      modifiers: ["Hot"],
      },
    ],
  },
  {
    id: "kt-9",
    code: "1242",
    orderId: "o-9",
    tableName: "A2",
    customerName: "Cheryl Arema",
    mode: "dine-in",
    station: "cold",
    status: "pending",
    waiterName: "Rijal",
    createdAt: minAgo(1),
    items: [
      {
        id: "i-15",
        name: "Bruschetta",
        emoji: "🍞",
        quantity: 1,
        modifiers: [],
      },
    ],
  },
  {
    id: "kt-10",
    code: "1243",
    orderId: "o-10",
    tableName: "B3",
    customerName: "Kylian Rex",
    mode: "dine-in",
    station: "dessert",
    status: "preparing",
    waiterName: "Mia",
    createdAt: minAgo(7),
    startedAt: minAgo(6),
    items: [
      {
        id: "i-16",
        name: "Cheesecake",
        emoji: "🍰",
        quantity: 2,
        modifiers: [],
      },
      {
        id: "i-17",
        name: "Tiramisu",
        emoji: "🍮",
        quantity: 1,
        modifiers: [],
      },
    ],
  },
]

export const STATIONS: {
  id: KdsStation
  label: string
  icon: string
  accent: string
  location: string
}[] = [
  {
    id: "grill",
    label: "Grill",
    icon: "🔥",
    accent: "bg-amber-500/20 text-amber-300",
    location: "Bếp nóng",
  },
  {
    id: "cold",
    label: "Cold",
    icon: "❄️",
    accent: "bg-cyan-500/20 text-cyan-300",
    location: "Salad / Lạnh",
  },
  {
    id: "bar",
    label: "Bar",
    icon: "🍺",
    accent: "bg-violet-500/20 text-violet-300",
    location: "Pha chế",
  },
  {
    id: "dessert",
    label: "Dessert",
    icon: "🍰",
    accent: "bg-rose-500/20 text-rose-300",
    location: "Tráng miệng",
  },
]

export const UNAVAILABLE_ITEMS = [
  {
    id: "u-1",
    name: "Grilled Salmon",
    emoji: "🐟",
    until: "end_of_shift" as const,
    reason: "Hết nguyên liệu",
  },
  {
    id: "u-2",
    name: "Alfredo",
    emoji: "🍝",
    until: "end_of_day" as const,
    reason: "Đầu bếp chính nghỉ",
  },
]
