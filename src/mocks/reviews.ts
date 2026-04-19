export type ReviewSource = "qr_guest" | "app" | "google" | "thefork" | "facebook"

export type Review = {
  id: string
  customerName: string
  customerInitials: string
  avatarColor: string
  rating: number
  comment: string
  tags: string[]
  source: ReviewSource
  orderCode?: string
  tableName?: string
  createdAt: string
  staffReply?: string
  staffRepliedAt?: string
  staffRepliedByName?: string
  responseUrgency?: "low" | "medium" | "high"
}

const hAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString()

export const REVIEWS: Review[] = [
  {
    id: "r-1",
    customerName: "Nguyễn Minh Hằng",
    customerInitials: "MH",
    avatarColor: "bg-gradient-to-br from-rose-500 to-pink-600",
    rating: 5,
    comment:
      "Quán rất đẹp, nhân viên thân thiện. Món Eggs Benedict siêu ngon, sẽ quay lại!",
    tags: ["ngon", "phục vụ tốt", "không gian đẹp"],
    source: "qr_guest",
    orderCode: "1234",
    tableName: "A3",
    createdAt: hAgo(2),
    responseUrgency: "low",
  },
  {
    id: "r-2",
    customerName: "Cheryl Arema",
    customerInitials: "CA",
    avatarColor: "bg-gradient-to-br from-blue-500 to-blue-700",
    rating: 5,
    comment: "",
    tags: ["nhanh"],
    source: "qr_guest",
    orderCode: "1232",
    tableName: "B1",
    createdAt: hAgo(5),
    staffReply: "Cảm ơn anh/chị! Hẹn gặp lại ạ 🙏",
    staffRepliedAt: hAgo(4),
    staffRepliedByName: "Manager",
  },
  {
    id: "r-3",
    customerName: "Trần Hải Nam",
    customerInitials: "HN",
    avatarColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    rating: 2,
    comment:
      "Chờ đồ lâu quá, gần 25 phút mới có burger. Nhân viên cũng không báo trước. Món ăn thì ổn.",
    tags: ["chờ lâu", "chưa thân thiện"],
    source: "qr_guest",
    orderCode: "1228",
    tableName: "C2",
    createdAt: hAgo(8),
    responseUrgency: "high",
  },
  {
    id: "r-4",
    customerName: "Lê Quỳnh",
    customerInitials: "LQ",
    avatarColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    rating: 4,
    comment:
      "Đồ uống ngon, cappuccino đúng gu. Chỉ tiếc là điều hoà hơi lạnh thôi.",
    tags: ["ngon", "điều hoà lạnh"],
    source: "google",
    createdAt: hAgo(12),
    responseUrgency: "medium",
  },
  {
    id: "r-5",
    customerName: "Phạm Đức Anh",
    customerInitials: "ĐA",
    avatarColor: "bg-gradient-to-br from-violet-500 to-purple-600",
    rating: 5,
    comment:
      "Nhân viên Rijal phục vụ rất chu đáo. Set menu sinh nhật được chuẩn bị kỹ, bánh đẹp!",
    tags: ["sinh nhật", "Rijal", "chu đáo"],
    source: "app",
    orderCode: "1221",
    tableName: "A5",
    createdAt: hAgo(20),
    staffReply:
      "Cảm ơn anh/chị! Chúc mừng sinh nhật muộn 🎂 Rất vui khi được phục vụ!",
    staffRepliedAt: hAgo(18),
    staffRepliedByName: "Chef Minh",
  },
  {
    id: "r-6",
    customerName: "Hoàng Thu Hà",
    customerInitials: "TH",
    avatarColor: "bg-gradient-to-br from-indigo-500 to-blue-600",
    rating: 3,
    comment:
      "Đồ ăn tạm ổn, nhưng chỗ này hơi ồn vào giờ cao điểm. Có lẽ sẽ quay lại vào giờ vắng.",
    tags: ["ồn"],
    source: "thefork",
    createdAt: hAgo(30),
    responseUrgency: "medium",
  },
  {
    id: "r-7",
    customerName: "Vũ Tuấn",
    customerInitials: "VT",
    avatarColor: "bg-gradient-to-br from-rose-500 to-red-600",
    rating: 1,
    comment:
      "Hoá đơn bị sai, tính thừa 1 món không gọi. Nhân viên có sửa nhưng thái độ không tốt.",
    tags: ["hoá đơn sai", "thái độ kém"],
    source: "google",
    orderCode: "1215",
    createdAt: hAgo(48),
    responseUrgency: "high",
  },
  {
    id: "r-8",
    customerName: "Bùi Thị Mai",
    customerInitials: "BM",
    avatarColor: "bg-gradient-to-br from-pink-500 to-rose-600",
    rating: 5,
    comment: "Tuyệt vời! Bò beefsteak nấu vừa vặn, sốt ngon.",
    tags: ["bò", "sốt ngon"],
    source: "facebook",
    createdAt: hAgo(60),
    staffReply: "Cảm ơn chị đã chia sẻ! Hẹn gặp lại ạ.",
    staffRepliedAt: hAgo(55),
    staffRepliedByName: "Manager",
  },
  {
    id: "r-9",
    customerName: "Đỗ Thanh Sơn",
    customerInitials: "TS",
    avatarColor: "bg-gradient-to-br from-teal-500 to-cyan-600",
    rating: 4,
    comment:
      "Ổn, nhưng wifi hơi yếu ở bàn C. Mong quán nâng cấp wifi.",
    tags: ["wifi yếu"],
    source: "qr_guest",
    tableName: "C3",
    createdAt: hAgo(72),
    responseUrgency: "medium",
  },
]

export const SOURCE_META: Record<
  ReviewSource,
  { label: string; icon: string; color: string }
> = {
  qr_guest: { label: "QR bàn", icon: "📱", color: "bg-amber-50 text-amber-700" },
  app: { label: "App khách", icon: "📲", color: "bg-blue-50 text-blue-700" },
  google: { label: "Google", icon: "🔍", color: "bg-rose-50 text-rose-700" },
  thefork: { label: "TheFork", icon: "🍴", color: "bg-emerald-50 text-emerald-700" },
  facebook: { label: "Facebook", icon: "👥", color: "bg-indigo-50 text-indigo-700" },
}

export type Supplier = {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  category: string
  leadTimeDays: number
  rating: number
  totalSpent: number
  lastOrderAt: string
  activeIngredients: number
}

export const SUPPLIERS: Supplier[] = [
  {
    id: "sp-1",
    name: "Bò Tơ Phú Mỹ",
    contactPerson: "A. Phú",
    phone: "+84 901 234 001",
    email: "phu@botophumy.vn",
    address: "Tân Bình, TP.HCM",
    category: "Thịt",
    leadTimeDays: 1,
    rating: 4.8,
    totalSpent: 12400,
    lastOrderAt: hAgo(26),
    activeIngredients: 1,
  },
  {
    id: "sp-2",
    name: "Vinamilk",
    contactPerson: "C. Hạnh",
    phone: "+84 912 345 002",
    email: "orders@vinamilk.com.vn",
    address: "Q.1, TP.HCM",
    category: "Sữa · Phô mai",
    leadTimeDays: 2,
    rating: 4.9,
    totalSpent: 8900,
    lastOrderAt: hAgo(48),
    activeIngredients: 2,
  },
  {
    id: "sp-3",
    name: "CP Group",
    contactPerson: "A. Dũng",
    phone: "+84 923 456 003",
    email: "sale@cpgroup.vn",
    address: "Đồng Nai",
    category: "Thịt · Hải sản",
    leadTimeDays: 2,
    rating: 4.6,
    totalSpent: 6500,
    lastOrderAt: hAgo(50),
    activeIngredients: 1,
  },
  {
    id: "sp-4",
    name: "Nông trại Đà Lạt",
    contactPerson: "C. Lan",
    phone: "+84 934 567 004",
    email: "lan@dalatfarm.vn",
    address: "Đà Lạt, Lâm Đồng",
    category: "Rau củ",
    leadTimeDays: 1,
    rating: 4.7,
    totalSpent: 3200,
    lastOrderAt: hAgo(26),
    activeIngredients: 1,
  },
  {
    id: "sp-5",
    name: "Chợ đầu mối Thủ Đức",
    contactPerson: "—",
    phone: "+84 945 678 005",
    email: "—",
    address: "Thủ Đức, TP.HCM",
    category: "Rau củ · Trái cây",
    leadTimeDays: 0,
    rating: 4.2,
    totalSpent: 4100,
    lastOrderAt: hAgo(24),
    activeIngredients: 3,
  },
  {
    id: "sp-6",
    name: "Trung Nguyên",
    contactPerson: "A. Hùng",
    phone: "+84 956 789 006",
    email: "b2b@trungnguyen.com",
    address: "Buôn Ma Thuột",
    category: "Cà phê",
    leadTimeDays: 3,
    rating: 4.9,
    totalSpent: 5800,
    lastOrderAt: hAgo(120),
    activeIngredients: 1,
  },
  {
    id: "sp-7",
    name: "Thuỷ sản Sài Gòn",
    contactPerson: "C. Mai",
    phone: "+84 967 890 007",
    email: "mai@thuysansg.vn",
    address: "Q.7, TP.HCM",
    category: "Hải sản",
    leadTimeDays: 1,
    rating: 4.5,
    totalSpent: 7200,
    lastOrderAt: hAgo(72),
    activeIngredients: 1,
  },
  {
    id: "sp-8",
    name: "Ba Huân",
    contactPerson: "A. Tâm",
    phone: "+84 978 901 008",
    email: "order@bahuan.com",
    address: "Bình Dương",
    category: "Trứng",
    leadTimeDays: 1,
    rating: 4.8,
    totalSpent: 2400,
    lastOrderAt: hAgo(26),
    activeIngredients: 1,
  },
]
