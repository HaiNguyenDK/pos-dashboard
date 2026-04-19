export type Ingredient = {
  id: string
  name: string
  emoji: string
  unit: string          // g, ml, pcs, kg, l
  stock: number
  reorderPoint: number
  costPerUnit: number   // USD per unit
  supplier: string
  lastRestockedAt: string
}

export type RecipeLine = {
  ingredientId: string
  quantity: number
}

export type Recipe = {
  menuItemId: string    // refers to MENU_ITEMS
  lines: RecipeLine[]
  laborMinutes: number
  yields: number        // portions per batch
}

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 86400000).toISOString()

export const INGREDIENTS: Ingredient[] = [
  {
    id: "ing-beef",
    name: "Thịt bò",
    emoji: "🥩",
    unit: "g",
    stock: 8200,
    reorderPoint: 3000,
    costPerUnit: 0.018,
    supplier: "Bò Tơ Phú Mỹ",
    lastRestockedAt: daysAgo(1),
  },
  {
    id: "ing-chicken",
    name: "Thịt gà",
    emoji: "🍗",
    unit: "g",
    stock: 4200,
    reorderPoint: 3000,
    costPerUnit: 0.012,
    supplier: "CP Group",
    lastRestockedAt: daysAgo(2),
  },
  {
    id: "ing-fish",
    name: "Cá dory",
    emoji: "🐟",
    unit: "g",
    stock: 1800,
    reorderPoint: 2000,
    costPerUnit: 0.022,
    supplier: "Thuỷ sản Sài Gòn",
    lastRestockedAt: daysAgo(3),
  },
  {
    id: "ing-egg",
    name: "Trứng gà",
    emoji: "🥚",
    unit: "pcs",
    stock: 240,
    reorderPoint: 120,
    costPerUnit: 0.12,
    supplier: "Ba Huân",
    lastRestockedAt: daysAgo(1),
  },
  {
    id: "ing-cheese",
    name: "Phô mai cheddar",
    emoji: "🧀",
    unit: "g",
    stock: 2800,
    reorderPoint: 1500,
    costPerUnit: 0.035,
    supplier: "Vinamilk",
    lastRestockedAt: daysAgo(4),
  },
  {
    id: "ing-bread",
    name: "Bánh mì burger",
    emoji: "🍞",
    unit: "pcs",
    stock: 85,
    reorderPoint: 50,
    costPerUnit: 0.4,
    supplier: "Bánh Tươi Kinh Đô",
    lastRestockedAt: daysAgo(0),
  },
  {
    id: "ing-lettuce",
    name: "Rau xà lách",
    emoji: "🥬",
    unit: "g",
    stock: 1200,
    reorderPoint: 500,
    costPerUnit: 0.008,
    supplier: "Nông trại Đà Lạt",
    lastRestockedAt: daysAgo(1),
  },
  {
    id: "ing-tomato",
    name: "Cà chua",
    emoji: "🍅",
    unit: "g",
    stock: 380,
    reorderPoint: 500,
    costPerUnit: 0.006,
    supplier: "Chợ đầu mối Thủ Đức",
    lastRestockedAt: daysAgo(2),
  },
  {
    id: "ing-onion",
    name: "Hành tây",
    emoji: "🧅",
    unit: "g",
    stock: 2500,
    reorderPoint: 1000,
    costPerUnit: 0.004,
    supplier: "Chợ đầu mối Thủ Đức",
    lastRestockedAt: daysAgo(3),
  },
  {
    id: "ing-milk",
    name: "Sữa tươi",
    emoji: "🥛",
    unit: "ml",
    stock: 12000,
    reorderPoint: 5000,
    costPerUnit: 0.0015,
    supplier: "Vinamilk",
    lastRestockedAt: daysAgo(2),
  },
  {
    id: "ing-coffee",
    name: "Cà phê hạt",
    emoji: "☕",
    unit: "g",
    stock: 3200,
    reorderPoint: 1500,
    costPerUnit: 0.028,
    supplier: "Trung Nguyên",
    lastRestockedAt: daysAgo(5),
  },
  {
    id: "ing-lemon",
    name: "Chanh tươi",
    emoji: "🍋",
    unit: "pcs",
    stock: 45,
    reorderPoint: 30,
    costPerUnit: 0.08,
    supplier: "Chợ đầu mối Thủ Đức",
    lastRestockedAt: daysAgo(1),
  },
  {
    id: "ing-sugar",
    name: "Đường",
    emoji: "🍬",
    unit: "g",
    stock: 18000,
    reorderPoint: 5000,
    costPerUnit: 0.0008,
    supplier: "Biên Hoà",
    lastRestockedAt: daysAgo(10),
  },
  {
    id: "ing-chocolate",
    name: "Chocolate dark",
    emoji: "🍫",
    unit: "g",
    stock: 650,
    reorderPoint: 800,
    costPerUnit: 0.04,
    supplier: "Belcolade",
    lastRestockedAt: daysAgo(7),
  },
]

export const RECIPES: Recipe[] = [
  {
    menuItemId: "m-1",    // Kopag Benedict
    laborMinutes: 8,
    yields: 1,
    lines: [
      { ingredientId: "ing-egg", quantity: 2 },
      { ingredientId: "ing-bread", quantity: 1 },
      { ingredientId: "ing-cheese", quantity: 30 },
      { ingredientId: "ing-lettuce", quantity: 20 },
    ],
  },
  {
    menuItemId: "m-16",   // Beef Burger
    laborMinutes: 12,
    yields: 1,
    lines: [
      { ingredientId: "ing-beef", quantity: 150 },
      { ingredientId: "ing-bread", quantity: 1 },
      { ingredientId: "ing-cheese", quantity: 30 },
      { ingredientId: "ing-lettuce", quantity: 15 },
      { ingredientId: "ing-tomato", quantity: 30 },
      { ingredientId: "ing-onion", quantity: 15 },
    ],
  },
  {
    menuItemId: "m-9",    // Crispy Dory Sambal
    laborMinutes: 15,
    yields: 1,
    lines: [
      { ingredientId: "ing-fish", quantity: 180 },
      { ingredientId: "ing-lettuce", quantity: 30 },
      { ingredientId: "ing-tomato", quantity: 20 },
    ],
  },
  {
    menuItemId: "m-15",   // Blackpaper Chicken
    laborMinutes: 14,
    yields: 1,
    lines: [
      { ingredientId: "ing-chicken", quantity: 220 },
      { ingredientId: "ing-onion", quantity: 20 },
    ],
  },
  {
    menuItemId: "m-26",   // Cappuccino
    laborMinutes: 4,
    yields: 1,
    lines: [
      { ingredientId: "ing-coffee", quantity: 18 },
      { ingredientId: "ing-milk", quantity: 120 },
      { ingredientId: "ing-sugar", quantity: 5 },
    ],
  },
  {
    menuItemId: "m-28",   // Fresh Lemonade
    laborMinutes: 3,
    yields: 1,
    lines: [
      { ingredientId: "ing-lemon", quantity: 2 },
      { ingredientId: "ing-sugar", quantity: 15 },
    ],
  },
  {
    menuItemId: "m-20",   // Brownie
    laborMinutes: 5,
    yields: 1,
    lines: [
      { ingredientId: "ing-chocolate", quantity: 40 },
      { ingredientId: "ing-egg", quantity: 1 },
      { ingredientId: "ing-sugar", quantity: 25 },
    ],
  },
]

export function calcRecipeCost(recipe: Recipe) {
  return recipe.lines.reduce((sum, l) => {
    const ing = INGREDIENTS.find((i) => i.id === l.ingredientId)
    return sum + (ing?.costPerUnit ?? 0) * l.quantity
  }, 0)
}
