# Kopag POS Dashboard — GraphQL API Spec

- **Version:** 0.1.0
- **Ngày:** 2026-04-17
- **Trạng thái:** Đề xuất từ FE → BE (chờ review)
- **Schema SDL:** [`schema.graphql`](./schema.graphql)

Tài liệu này mô tả **hợp đồng API** mà frontend (Kopag POS Dashboard) cần
để triển khai đầy đủ các màn hình hiện có. Mục tiêu là để BE đối chiếu,
điều chỉnh, và thống nhất trước khi implement.

---

## 1. Quy ước chung

### 1.1. Endpoint & transport
- **HTTP:** `POST /graphql` — GraphQL-over-HTTP.
- **WebSocket:** `wss://.../graphql` — dùng protocol `graphql-transport-ws`
  cho các subscription real-time (cập nhật order/table/notification).
- **File upload:** spec `graphql-multipart-request` (scalar `Upload`).

### 1.2. Xác thực
- Dùng **JWT bearer token** gửi qua header `Authorization: Bearer <accessToken>`.
- `accessToken` hết hạn ~15 phút → FE gọi `refreshSession(refreshToken)` để xoay.
- `refreshToken` hết hạn ~30 ngày và xoay mỗi lần refresh (rolling).
- FE lưu cả hai trong `localStorage`/cookie `httpOnly` tùy option bảo mật
  mà BE chọn.

### 1.3. Error model
Tất cả mutation có khả năng fail theo input người dùng trả về **`OperationResult`**
chứa `errors: [UserError!]!` thay vì throw GraphQL error — FE map 1-1 vào
toast hoặc field-level error. Các lỗi hệ thống (500, unauthenticated, auth
expired) dùng GraphQL errors chuẩn với `extensions.code`:

| `extensions.code` | Khi nào | FE xử lý |
|---|---|---|
| `UNAUTHENTICATED` | Token thiếu/sai/hết hạn | Redirect `/login` |
| `FORBIDDEN` | Không đủ quyền | Toast + giữ nguyên trang |
| `NOT_FOUND` | ID không tồn tại | Hiện empty state |
| `VALIDATION_FAILED` | Body sai format (hiếm, fallback) | Toast lỗi hệ thống |
| `CONFLICT` | Vd. table đã occupied | Toast, refetch |
| `RATE_LIMITED` | Quá nhiều request | Toast retry |
| `INTERNAL_ERROR` | Lỗi server | Toast retry |

### 1.4. Pagination
- **Cursor-based (Relay)** cho các list lớn: `{ edges, pageInfo, totalCount }`.
- FE dùng `totalCount + pageInfo` để hiển thị bộ pagination dạng số trang
  (ví dụ `Page 1 of 40` trong Transaction/Report) — client tính
  `totalPages = ceil(totalCount / pageSize)`.
- Server giới hạn `first <= 100`.

### 1.5. Money & dates
- **Decimal scalar** (string-encoded, 2 chữ số thập phân): `"157.00"`.
  Tránh dùng `Float` để không mất chính xác số tiền.
- **DateTime scalar** (ISO-8601 UTC): `"2026-04-17T10:20:00Z"`. FE tự
  format theo timezone của user hoặc `restaurant.timezone`.
- **Date scalar** (ISO-8601 date): `"2026-04-17"` — dùng cho `DateRangeInput`.

### 1.6. Caching gợi ý
- Tất cả entity chính (`Order`, `Bill`, `MenuItem`, `InventoryTransaction`,
  `DiningTable`, `Notification`) implement `Node` → FE cache bằng
  Apollo/urql normalized store.
- Mutation trả về entity mới để FE tự merge (không cần refetch list).

---

## 2. Map màn hình FE → operations

### 2.1. Auth (`/login`, `/register`, `/forgot-password/*`)

| FE action | Operation |
|---|---|
| Login | `mutation login(input)` → `LoginResult` (union) |
| Register | `mutation register(input)` → `LoginResult` |
| Quên mật khẩu — nhập email | `mutation forgotPassword(input)` |
| Nhập OTP | `mutation verifyOtp(input)` → trả `resetToken` qua `OperationResult.errors=[]`<br>*(BE có thể đổi sang trả token qua field riêng — xem ghi chú §3.1)* |
| Đặt mật khẩu mới | `mutation resetPassword(input)` |
| Refresh token | `mutation refreshSession(refreshToken)` |
| Logout | `mutation logout` |
| Fetch user hiện tại | `query viewer` |

### 2.2. Top-nav + notifications (chung cho mọi trang `AppShell`)
- Avatar + profile dropdown: `query viewer`.
- Chuông thông báo: `query notifications(unreadOnly: true)` + subscription
  `notificationReceived`.
- Badge đỏ: lấy `NotificationConnection.unreadCount`.

### 2.3. Dashboard (`/dashboard`)
- 4 stat card (Total sale/order/revenue/cancelled):
  `query analyticsOverview(dateRange)`.
- Biểu đồ Sales area chart: `query salesSeries(dateRange)`.
- Donut Income: `query incomeBreakdown(dateRange)`.
- Bảng Transactions (3 dòng gần đây): `query recentTransactions(limit: 3)`.
- Trending menu: `query trendingMenu(dateRange, limit: 5)`.

### 2.4. Select table (`/select-table`)
- `query tables(filter: { zones, statuses })` — render theo zone.
- Click table → `mutation updateTableStatus` (OCCUPIED) + navigate `/orders`.
- Realtime: subscription `tableUpdated`.

### 2.5. Orders (`/orders`)
- Left panel (menu): `query menuCategories` + `query menuItems(filter, sort)`.
- Right panel (cart): state FE, submit bằng `mutation createOrder(input)`.
- Danh sách order đang chạy (strip trên): `query orders(filter: { statuses: [PENDING, PREPARING, READY] })`.
- Đổi trạng thái từ drawer: `mutation updateOrderStatus`.
- Thêm món/đổi ghi chú: `mutation addOrderItems`, `mutation updateOrderLine`.
- Huỷ: `mutation cancelOrder(id, reason)`.
- Subscription `orderUpdated` để sync giữa nhiều máy POS.

### 2.6. History (`/history`)
- `query history(page, filter: { search, kinds, dateFrom, dateTo })`.
- Click entry → detail panel đọc từ `order` hoặc `bill` trong entry.

### 2.7. Bills (`/bills`)
- `query bills(page, filter, sort)`.
- Drawer thanh toán: `mutation checkoutOrder(input)` → tạo `Bill` + trả
  `receiptUrl` (PDF pre-signed).
- Void bill: `mutation voidBill(id, reason)` — chỉ OWNER/MANAGER.

### 2.8. Products management (`/products`)
- List: `query menuItems(page, filter, sort)`.
- Tạo: `mutation createMenuItem` (có upload ảnh).
- Sửa: `mutation updateMenuItem`.
- Xoá: `mutation deleteMenuItem`.
- Nhập/xuất kho nhanh: `mutation adjustMenuItemStock(id, delta)`.

### 2.9. Profile

#### Tab Analytics
Giống Dashboard nhưng scope theo `viewer` (owner) → dùng cùng các query
ở §2.3 với `dateRange` mặc định `LAST_30_DAYS`.

#### Tab Account Setting
- Form Profile Setting: `mutation updateProfile(input)`.
- Form Update Password: `mutation updatePassword(input)`.

#### Tab Report
- Bảng + filter theo `Daily/Weekly/Monthly`:
  `query report(page, filter: { granularity, dateRange, paymentMethods })`.
- Nút `Download`: `mutation requestExport(input: { kind: REPORT, format: CSV, ... })`
  → trả `ExportJob`. FE poll qua `query exportJob(id)` hoặc subscription
  `exportJobUpdated` cho tới khi `status = READY` rồi mở `downloadUrl`.

#### Tab Transaction (màn hình vừa build)
- Bảng: `query inventoryTransactions(page, filter, sort)`.
- `+ Add product`: `mutation createInventoryTransaction(input)`.
- Nút Edit trong cột Action: `mutation updateInventoryTransaction(input)`.
- Menu `...` (more): gồm Delete → `mutation deleteInventoryTransaction(id)`.
- Nút `Download`: `mutation requestExport(input: { kind: TRANSACTIONS, ... })`.

---

## 3. Ghi chú thiết kế & open questions

### 3.1. Reset password flow
Hiện spec trả `resetToken` "qua `OperationResult` không có errors" cho gọn —
**đề xuất BE**: tách thành `VerifyOtpResult = VerifyOtpSuccess | AuthError`
với `VerifyOtpSuccess { resetToken: String! }`. Thuận tiện hơn cho FE.

### 3.2. Transaction vs Menu item
Màn hình Transaction hiện dùng `product: MenuItem!`. Nếu BE mô hình hoá
**nguyên liệu thô** (Tomato, Egg, Meat...) tách khỏi **món bán**
(Kopag Benedict, Caesar Salad...), hãy đổi thành entity riêng
`RawProduct` và chỉnh field `product` tương ứng. FE chỉ cần: `id`, `name`,
`imageUrl`/`emoji`/`imageGradient`.

### 3.3. "Quality ( In Kgs)"
Cột hiển thị dạng `used/total` (ví dụ `25/100`). Spec hiện dùng
`quantityUsed` + `quantityTotal` + `unit`. Cần BE xác nhận ngữ nghĩa:
- Nếu là **stock còn / tổng nhập**: đổi tên cho rõ (`remaining`/`capacity`).
- Nếu là **đã dùng / tổng**: giữ nguyên.

### 3.4. Real-time
Subscription là optional nhưng khuyến nghị mạnh cho môi trường POS
(nhiều máy cashier/kitchen). Nếu BE chưa sẵn WebSocket, FE có thể
fallback polling 5s cho `orders` + 10s cho `tables`.

### 3.5. Export jobs
Tách khỏi query đồng bộ vì export PDF/CSV có thể lâu (>2s). Job lifecycle:
`PENDING → PROCESSING → READY (downloadUrl) | FAILED`. `downloadUrl`
hết hạn sau `expiresAt` (khuyến nghị 15 phút).

### 3.6. Rate limit & cost
- Đề xuất rate limit theo viewer: 100 req/phút cho query, 30 req/phút
  cho mutation.
- BE nên áp dụng `query complexity` để chặn query lồng quá sâu
  (`trendingMenu.item.category.items`...).

### 3.7. Permissions ma trận

| Operation | OWNER | MANAGER | CASHIER | WAITER |
|---|---|---|---|---|
| analytics*, report, exports | ✅ | ✅ | ❌ | ❌ |
| menu CRUD | ✅ | ✅ | ❌ | ❌ |
| inventory transactions | ✅ | ✅ | ❌ | ❌ |
| orders create/update | ✅ | ✅ | ✅ | ✅ |
| checkout / voidBill | ✅ | ✅ | ✅ | ❌ |
| tables update | ✅ | ✅ | ✅ | ✅ |
| updateProfile / updatePassword | ✅ (self) | ✅ (self) | ✅ (self) | ✅ (self) |

---

## 4. Ví dụ request/response

### 4.1. Login
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    __typename
    ... on AuthSession {
      accessToken
      refreshToken
      expiresAt
      viewer { id name email role avatarUrl restaurant { id name timezone } }
    }
    ... on AuthError { code message }
  }
}
```

### 4.2. Inventory transactions list (tab Transaction, page 1)
```graphql
query Transactions($page: ConnectionArgs, $filter: InventoryTransactionFilter, $sort: InventoryTransactionSort) {
  inventoryTransactions(page: $page, filter: $filter, sort: $sort) {
    totalCount
    pageInfo { hasNextPage endCursor }
    edges {
      node {
        id
        productName
        product { id emoji imageGradient imageUrl }
        quantityUsed
        quantityTotal
        unit
        totalPrice
        occurredAt
      }
    }
  }
}
```

Variables:
```json
{
  "page": { "first": 7 },
  "filter": { "search": "" },
  "sort": { "field": "OCCURRED_AT", "direction": "DESC" }
}
```

### 4.3. Checkout order
```graphql
mutation Checkout($input: CheckoutOrderInput!) {
  checkoutOrder(input: $input) {
    id code total paymentMethod paidAt receiptUrl
    order { id status }
  }
}
```

### 4.4. Request export (Transaction download)
```graphql
mutation RequestExport($input: RequestExportInput!) {
  requestExport(input: $input) { id status downloadUrl expiresAt }
}
```
Variables:
```json
{
  "input": {
    "kind": "TRANSACTIONS",
    "format": "CSV",
    "dateRange": { "preset": "LAST_30_DAYS" }
  }
}
```

---

## 5. Checklist trước khi BE implement

- [ ] Xác nhận scalar `Decimal`/`DateTime` library dùng chung (graphql-scalars).
- [ ] Chốt mô hình RawProduct vs MenuItem cho Transaction (§3.2).
- [ ] Chốt ngữ nghĩa `quantityUsed`/`quantityTotal` (§3.3).
- [ ] Chốt có dùng Subscription không (§3.4).
- [ ] Chốt flow resetToken (§3.1).
- [ ] Thống nhất permission matrix (§3.7).
- [ ] Quyết định storage cho ảnh `avatar`/`menuItem.image` (S3 + presigned url).
- [ ] Thống nhất error codes (§1.3).
