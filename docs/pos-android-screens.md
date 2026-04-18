# Kopag POS Android — UI Screen Spec

- **Version:** 0.1.0 (2026-04-17)
- **Target device:** Android 8+ handheld (5.5"–7" phone) hoặc tablet 8"–10"
- **User:** nhân viên phục vụ (waiter) — di chuyển trong quán, tablet dùng chung nhiều ca
- **Core flows:** Chọn bàn / đơn → Thêm món → Gửi bếp → Thanh toán → In/gửi hóa đơn
- **Related docs:**
  - Data model: [`schema.graphql`](./schema.graphql)
  - API conventions: [`api-spec.md`](./api-spec.md)

---

## 0. Tài liệu này dùng như thế nào?

Mỗi section từ §4 đến §15 là **1 màn hình độc lập**, có thể copy-paste nguyên khối làm prompt cho AI sinh UI (v0, Lovable, Galileo, Cursor…). Các section §1–§3 là context chung, **luôn đính kèm khi prompt bất kỳ màn nào**.

Template prompt gợi ý:

> Build an Android screen using [Jetpack Compose / React Native] based on this spec.
> Use tokens from §1 and navigation conventions from §2.
>
> [Paste section của màn cần build]
>
> Return a single file with the screen component + any sub-components it owns.

---

## 1. Design tokens & quy ước

### 1.1. Màu (reuse từ dashboard web)

| Role | Hex | Dùng ở |
|---|---|---|
| Primary | `#2563EB` | Buttons, active states, links |
| Primary hover/press | `#1D4ED8` | Pressed |
| Primary soft | `#EFF6FF` | Badge bg, info bg |
| Success | `#059669` | Total price, "Paid" |
| Warning | `#F59E0B` | Pending, low stock |
| Danger | `#EF4444` | Void, cancel, errors |
| Neutral 900 | `#0F172A` | Heading text |
| Neutral 600 | `#475569` | Body text |
| Neutral 400 | `#94A3B8` | Placeholder, subtle |
| Neutral 100 | `#F1F5F9` | Card bg, dividers |
| Background | `#FFFFFF` | Main bg (light) |

**Table/order status colors** (đồng bộ dashboard):

| Status | Bg | Fg |
|---|---|---|
| Available (bàn trống) | `#EFF6FF` | `#2563EB` |
| Occupied (đang dùng) | `#ECFDF5` | `#059669` |
| Reserved (đã đặt) | `#FEF2F2` | `#EF4444` |
| Pending (đơn chờ) | `#FEF3C7` | `#B45309` |
| Preparing | `#F3E8FF` | `#7E22CE` |
| Ready | `#D1FAE5` | `#047857` |
| Completed | `#DBEAFE` | `#1D4ED8` |
| Cancelled | `#FEE2E2` | `#B91C1C` |

### 1.2. Typography

- Font: **Geist** (đã dùng ở dashboard) — fallback system
- Scale:
  - Display: 32sp / 700 / −0.5 tracking
  - H1: 24sp / 700
  - H2: 20sp / 600
  - Body large: 16sp / 500
  - Body: 14sp / 400
  - Caption: 12sp / 500

### 1.3. Spacing & radius

- Spacing unit: **4dp**, scale 4/8/12/16/20/24/32/40
- Radius: 8 (input), 12 (card), 16 (sheet), 24 (button pill), 999 (badge)
- Tap target tối thiểu **48dp × 48dp** (Google Material) — kể cả nút phụ

### 1.4. Motion

- Page transition 200ms ease-out
- Bottom sheet 250ms ease-out-cubic
- Modal fade 150ms
- Toast/snackbar auto-dismiss 3s (success), 5s (error)

### 1.5. Ngôn ngữ

Reuse keys i18n từ `src/locales/{en,vi}.json` của dashboard (đã có namespace `cart`, `order_detail`, `bills`, v.v.). Chuyển đổi EN/VI trong Settings. Mặc định theo locale máy → fallback VI.

### 1.6. Hardware giả định

- Android 8+ (API 26), target API 34
- WiFi + optional 4G
- **Không có** barcode scanner, không có két tiền, không có card reader built-in
- **Có thể pair**: WiFi thermal printer (ESC/POS qua port 9100) + BLE card reader (SumUp/VNPAY/MoMo SDK) + BLE receipt printer (tùy cấu hình)
- Camera rear để quét QR (nếu cần — hiếm trong flow waiter)

---

## 2. Navigation map

```
                    ┌──────────────────────┐
                    │ 0. Splash / Launcher │
                    └──────────┬───────────┘
                               │ (auto)
                    ┌──────────▼───────────┐
                    │  1. PIN Login/Lock   │ ◄─── idle 2' / manual lock
                    └──────────┬───────────┘
                               │ PIN ok
                    ┌──────────▼───────────┐
                    │  2. Home (tabs)      │ ◄─── Logout từ Settings
                    │  • Tables            │
                    │  • Running orders    │
                    └─────┬───────────┬────┘
                          │           │
               (tap bàn) ▼           ▼ (tap đơn)
            ┌─────────────────┐  ┌─────────────────────┐
            │ 3. Table Detail │  │ 6. Order Cart Review│
            │   - tạo/tiếp    │  │   - edit / gửi bếp  │
            └────────┬────────┘  └──────┬──────┬──────┘
                     │                  │      │
                     │ "Thêm món"       │      │ "Thanh toán"
                     ▼                  │      ▼
            ┌─────────────────┐         │  ┌────────────────────┐
            │ 4. Menu Browser │◄────────┘  │ 7. Bill Preview    │
            └────────┬────────┘            └────────┬───────────┘
                     │ tap món                      │
                     ▼                              ▼
            ┌─────────────────┐            ┌────────────────────┐
            │ 5. Modifier     │            │ 8. Payment Method  │
            │    Bottom Sheet │            └────────┬───────────┘
            └────────┬────────┘                     │
                     │ "Thêm vào đơn"               ├──── cash ──► 9. Cash Keypad
                     ▼                              ├──── qr   ──► 10. QR Fullscreen
            ┌─────────────────┐                     └──── card ──► (SDK của nhà cung cấp)
            │ 6. Cart Review  │◄────────────────────────── (về 6)
            └─────────────────┘                              │
                                                             ▼
                                                  ┌─────────────────────┐
                                                  │ 11. Payment Success │
                                                  │   (print/email)     │
                                                  └──────────┬──────────┘
                                                             │ "Xong"
                                                             ▼
                                                         (2. Home)

    Side screens: 12. Order History · 13. Settings · 14. Notifications drawer
```

Navigation lib gợi ý:
- Compose: **Navigation-Compose** với type-safe routes
- RN/Expo: **Expo Router** (file-based)

---

## 3. Shared components (dùng ở nhiều màn)

Tên dùng chung trong spec, implement 1 lần:

| Component | Mô tả | Xuất hiện ở màn |
|---|---|---|
| `PinKeypad` | 0–9 keypad 3×4 + backspace; hiện dots cho PIN | 1, 9 |
| `TableCard` | Thẻ bàn: tên bàn, seats, status color, optional "current order" | 2, 3 |
| `OrderCard` | Thẻ đơn: customer, table, items count, status chip, mode | 2, 12 |
| `MenuItemCard` | Thẻ món: ảnh/emoji, tên, giá, available/sold, qty control | 4 |
| `CartLineRow` | Dòng món trong cart: ảnh, tên + note + modifier, qty, price | 6, 7 |
| `StatusChip` | Pill màu theo status (bảng §1.1) | 2, 3, 6, 12 |
| `QtyControl` | `−  n  +` nút tròn | 4, 5, 6 |
| `PriceSummary` | Block subtotal / tax / discount / tip / **Total** | 6, 7, 9, 11 |
| `SupervisorPinDialog` | Modal nhập PIN supervisor khi void/discount/refund | 6, 7, 12 |
| `PrinterPickerSheet` | Chọn printer từ list đã cấu hình | 11, 13 |
| `TopBar` | App bar với back/title/right action | mọi màn ngoài 0, 1 |
| `ConnectivityBanner` | Banner vàng "Offline — đơn sẽ sync khi online" | top toàn app khi mất mạng |

---

## 4. Screen #0 — Splash / Launcher

**Mục đích:** Khởi động app, check device registration + session token.

**Layout:**
- Center: logo Kopag, tagline "POS for waiters"
- Progress indicator linear ở dưới (không xoay tròn)
- Footer: version number + terminal ID

**Logic khi mở:**
1. Load config từ `SharedPreferences` / `AsyncStorage`: `terminalId`, `refreshToken`, `lastUserId`
2. Nếu chưa có `terminalId` → điều hướng tới **Terminal Registration** (màn phụ, nhập mã kích hoạt từ dashboard)
3. Nếu có `refreshToken` → gọi `refreshSession` → điều hướng **1. PIN Login** (không về Home vì cần xác thực lại user)
4. Nếu refresh fail → điều hướng **Full Login** (email/password — chỉ dùng khi mất PIN)

**Thời gian tối đa:** 2s; sau đó dù chưa xong cũng chuyển sang màn tiếp + retry nền.

---

## 5. Screen #1 — PIN Login / Lock Screen

**Mục đích:** Nhân viên đổi ca, mở khoá máy — **không dùng email/password mỗi lần**.

**Entry:**
- Từ Splash (khi có refreshToken hợp lệ)
- Khi máy idle 2 phút (auto-lock)
- Khi user tap "Lock" ở Settings

**Layout:**
```
┌──────────────────────────────┐
│           [Kopag logo]        │
│                               │
│        Nhập mã PIN             │
│                               │
│       ● ● ● ● ○ ○              │  ← 6 dots, filled theo ký tự nhập
│                               │
│    ┌───┐ ┌───┐ ┌───┐          │
│    │ 1 │ │ 2 │ │ 3 │          │
│    └───┘ └───┘ └───┘          │
│    ┌───┐ ┌───┐ ┌───┐          │  ← PinKeypad 3x4
│    │ 4 │ │ 5 │ │ 6 │          │
│    └───┘ └───┘ └───┘          │
│    ┌───┐ ┌───┐ ┌───┐          │
│    │ 7 │ │ 8 │ │ 9 │          │
│    └───┘ └───┘ └───┘          │
│        ┌───┐ ┌───┐            │
│        │ 0 │ │ ⌫ │            │
│        └───┘ └───┘            │
│                               │
│    "Đổi tài khoản" (link)      │
│     Quên PIN?  (link)          │
└──────────────────────────────┘
```

**States:**
- **idle** — dots rỗng
- **entering** — 1..5 dots filled
- **verifying** — shimmer, keypad disabled
- **error** — dots rung (shake animation), text đỏ "PIN sai. Còn {{n}} lần thử"
- **locked** — sau 5 lần sai: "Máy bị khoá, liên hệ quản lý" + nút "Gọi hỗ trợ"

**Actions:**
- Gõ đủ 6 số → auto submit → gọi mutation giả định `verifyPin(terminalId, pin)` → trả `{ viewer, accessToken }`
- "Đổi tài khoản" → logout hoàn toàn → về Full Login
- "Quên PIN?" → dialog "Yêu cầu quản lý reset trên dashboard web"

**Edge cases:**
- Offline: verify bằng hash PIN đã cache local (bcrypt). Nếu device chưa sync người dùng → báo lỗi "Cần kết nối mạng lần đầu"
- 3 lần sai → delay 10s trước khi cho nhập lại
- 5 lần sai → auto-lock, ghi log gửi lên server khi online

**Next nav:** Home (màn 2)

---

## 6. Screen #2 — Home (Tables + Running orders)

**Mục đích:** Điểm xuất phát của mọi công việc. Nhân viên chọn bàn cần phục vụ hoặc chọn đơn đang chạy.

**Layout:**
```
┌──────────────────────────────┐
│ [Hi, Rijal] 🔔3   👤 Settings │  ← TopBar với greeting + bell + avatar
├──────────────────────────────┤
│ [ Bàn ] [ Đơn đang chạy (7) ] │  ← Tab bar (segmented)
├──────────────────────────────┤
│ 🔍 Tìm bàn / khách             │  ← Search (sticky)
├──────────────────────────────┤
│ Filter: Tất cả ▼   Zone A ▼   │  ← 2 chip dropdowns
├──────────────────────────────┤
│  Zone A                       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │  ← Grid 2 cột (phone) / 3 (tablet)
│  │ A1 │ │ A2 │ │ A3 │ │ A4 │  │    TableCard
│  │ 🟢 │ │ 🔵 │ │ 🟢 │ │ 🔴 │  │
│  └────┘ └────┘ └────┘ └────┘  │
│                               │
│  Zone B                       │
│  ... (tương tự)               │
└──────────────────────────────┘
```

**Tab "Bàn":**
- Group theo zone (A, B, C)
- `TableCard` hiện: tên bàn, số chỗ ngồi, status color dot, nếu có đơn đang chạy hiện "n món • {{total}}"
- Tap → màn 3 (Table Detail)

**Tab "Đơn đang chạy":**
- List order status ∈ `pending | preparing | ready | served` (không hiện completed/cancelled)
- Filter phụ: "Của tôi" / "Tất cả"
- `OrderCard` hiện: code, customer name, table, items count, status chip, thời gian mở
- Tap → màn 6 (Cart Review)

**FAB:** nút tròn "+" góc dưới phải → **"Take-away" order** (không cần chọn bàn)

**States:**
- Loading: shimmer 6 TableCard giả
- Empty tab Đơn: illustration + "Chưa có đơn nào. Chọn bàn ở tab bên cạnh để bắt đầu"
- Offline: `ConnectivityBanner` trên cùng

**Realtime:**
- Subscribe `tableUpdated` + `orderUpdated` → auto refresh card tương ứng
- Badge đỏ trên tab "Đơn đang chạy" khi có đơn `ready` mới

**Pull-to-refresh:** refresh cả 2 tab

---

## 7. Screen #3 — Table Detail

**Mục đích:** Sau khi tap 1 bàn ở Home. Nếu bàn **trống** → tạo đơn mới. Nếu bàn **đang có đơn** → shortcut mở đơn đó.

**Layout (bàn trống):**
```
┌──────────────────────────────┐
│ ←  Bàn A3 (4 chỗ · Zone A)   │
├──────────────────────────────┤
│                               │
│       [status: Available]     │
│                               │
│   Nhập thông tin đơn mới      │
│                               │
│   Tên khách                   │
│   [_____________________]     │
│                               │
│   Số người                    │
│   [ − ] 2 [ + ]               │
│                               │
│   Ghi chú                     │
│   [_____________________]     │
│                               │
│   Mode:  ( Dine-in )  Take-away│
│                               │
│                               │
│  [ Bắt đầu order ──────────▶] │  ← Primary button, full width
└──────────────────────────────┘
```

**Layout (bàn đang có đơn):**
- Cùng TopBar
- Hero card hiện customer name, thời gian mở, items count, subtotal
- 2 nút: **"Xem / Thêm món"** (primary) → màn 6; **"Thanh toán"** (secondary pill) → màn 7

**Actions:**
- Nút primary → `mutation createOrder` → mở màn 4 (Menu Browser) với `orderId` mới
- Bàn reserved → cảnh báo banner vàng "Bàn này đã được đặt trước cho {{time}}"

**Edge cases:**
- Nếu bàn vừa bị waiter khác chiếm (subscription push) → disable nút + toast "Bàn vừa được mở đơn bởi {{name}}" + quay về Home

---

## 8. Screen #4 — Menu Browser

**Mục đích:** Duyệt menu, thêm món vào đơn.

**Layout:**
```
┌──────────────────────────────┐
│ ← Bàn A3 · Đơn #1234    🛒 3  │  ← Cart badge hiện số món đang có
├──────────────────────────────┤
│ 🔍 Tìm món                    │
├──────────────────────────────┤
│ [Favorites][Apps][Main][Des] │  ← Category tabs scrollable
├──────────────────────────────┤
│  ┌───────┐ ┌───────┐          │  ← Grid 2 cột (phone)
│  │ 🍳    │ │ 🍔    │          │    MenuItemCard
│  │Eggs B │ │Burger │          │
│  │$75.50 │ │$95.00 │          │
│  │ 12 av │ │ 8 av  │          │
│  │  [+]  │ │  [+]  │          │
│  └───────┘ └───────┘          │
│  ...                          │
├──────────────────────────────┤
│ [ Xem giỏ (3 món · $184.50) ] │  ← Sticky footer, primary
└──────────────────────────────┘
```

**MenuItemCard:**
- Tap cả card → mở màn 5 (Modifier Sheet)
- Nút `+` góc phải → add 1 với modifier mặc định, không mở sheet (quick add)
- Nếu `available === 0` → overlay "Hết hàng", disable

**Tabs:**
- Đầu tiên: **Favorites** (món được set `isFavorite` trên dashboard, hoặc top bán chạy 30 ngày)
- Sau đó: các category từ `menuCategories` query

**Search:**
- Debounce 300ms, match tên + description
- Ẩn tabs khi search active

**Sticky footer:**
- Chỉ hiện khi cart có ít nhất 1 món
- Tap → màn 6 (Cart Review)

**Edge cases:**
- Offline: load menu từ cache local (đã sync lần mở app đầu tiên) — có badge "Menu cached — {{time}}" ở top nếu cache quá 1h
- Món vừa bị set unavailable (realtime) → gray out ngay

---

## 9. Screen #5 — Modifier Bottom Sheet

**Mục đích:** Chọn size/topping/note khi thêm 1 món. Hiện dưới dạng bottom sheet chiếm 80% màn.

**Layout:**
```
┌──────────────────────────────┐
│            ───                │  ← drag handle
│  Crispy Dory Sambal Matah     │  ← Title bold
│  $50.50                       │  ← price
├──────────────────────────────┤
│ Size * (required)             │
│ ○ Small (+$0)                 │
│ ● Medium (+$0) ◄──            │  ← radio selected
│ ○ Large (+$10)                │
│                               │
│ Độ cay                        │
│ ○ Không cay                   │
│ ● Vừa                          │
│ ○ Rất cay                     │
│                               │
│ Topping (chọn nhiều)          │
│ ☑ Trứng (+$5)                 │
│ ☐ Phô mai (+$8)               │
│ ☐ Thêm rau (+$2)              │
│                               │
│ Ghi chú                       │
│ [_____________________]       │
│ [_____________________]       │
│                               │
│ Số lượng:  [ − ] 1 [ + ]      │
├──────────────────────────────┤
│ [   Thêm vào đơn — $55.50  ] │  ← sticky, cập nhật theo lựa chọn
└──────────────────────────────┘
```

**Logic:**
- Required modifier chưa chọn → disable nút primary
- Giá trong nút update realtime theo lựa chọn + qty
- Khi tap "Thêm vào đơn" → close sheet + toast "Đã thêm 1 Crispy Dory" + update cart badge ở màn 4

**Edge cases:**
- Nếu mở từ Cart (edit existing line), tiêu đề đổi "Sửa món", nút thành "Lưu thay đổi"
- Dismiss bằng swipe down hoặc tap outside → confirm nếu có thay đổi chưa lưu

---

## 10. Screen #6 — Cart Review & Gửi bếp

**Mục đích:** Xem lại đơn, chỉnh sửa, **gửi xuống bếp** (không phải thanh toán).

**Layout:**
```
┌──────────────────────────────┐
│ ← Đơn #1234 · Bàn A3   [ ⋯ ] │
├──────────────────────────────┤
│ Khách: Cheryl Arema           │
│ Mode: Dine-in · Ghi chú: —    │
├──────────────────────────────┤
│ Đã gửi bếp                    │  ← Section 1 (nếu đã có)
│ ┌─────────────────────────┐  │
│ │ 🍳 Eggs Benedict    x2  │  │
│ │ $75.50 · Medium         │  │
│ │ [Status: preparing]     │  │
│ └─────────────────────────┘  │
│ ...                           │
├──────────────────────────────┤
│ Chưa gửi (2)                  │  ← Section 2 (batch mới)
│ ┌─────────────────────────┐  │
│ │ 🍔 Beef Burger      x1  │  │
│ │ $95.00                  │  │
│ │ Ghi chú: không hành     │  │
│ │ [ Sửa ]  [ Xoá ]        │  │
│ └─────────────────────────┘  │
│ ...                           │
├──────────────────────────────┤
│ Subtotal            $245.50   │
│ Tax (10%)            $24.55   │
│ Total               $270.05   │
├──────────────────────────────┤
│ [ + Thêm món ]                │  ← secondary
│ [ Gửi bếp (2) ─────────────▶] │  ← primary, disabled nếu 0 món mới
│ [ Thanh toán ]                │  ← pill, chỉ enable khi đủ món đã gửi
└──────────────────────────────┘
```

**Interactions:**
- **Đã gửi**: không cho edit trực tiếp. Menu `⋯` → Void (cần supervisor PIN + lý do)
- **Chưa gửi**: vuốt trái để xoá, tap để mở lại Modifier sheet sửa
- Nút "Gửi bếp" → `mutation addOrderItems` → chuyển items chưa gửi sang section "Đã gửi" với status `pending`
- Print kitchen ticket tự động sau khi gửi bếp thành công (nếu config ON)

**Menu `⋯` (top right):**
- Đổi ghi chú đơn
- Chuyển bàn (chọn bàn khác từ floor plan)
- Ghép bàn (thêm bàn phụ vào đơn hiện tại)
- Huỷ đơn (supervisor PIN)
- In phiếu bếp (reprint)

**Edge cases:**
- Offline: "Chưa gửi" vẫn lưu local, "Gửi bếp" → queue. Hiện badge "Sẽ gửi khi online"
- Có món `ready` từ bếp (realtime) → tự đổi chip + phát sound nhẹ + push "Món X đã sẵn sàng"

---

## 11. Screen #7 — Bill Preview (trước thanh toán)

**Mục đích:** Review hoá đơn, áp discount/tip/split trước khi chọn phương thức thanh toán.

**Layout:**
```
┌──────────────────────────────┐
│ ← Hoá đơn · Đơn #1234         │
├──────────────────────────────┤
│ Bàn A3 · 2 khách · Cheryl     │
│ 2026-04-17 14:23              │
├──────────────────────────────┤
│ 2× Eggs Benedict    $151.00   │
│ 1× Beef Burger       $95.00   │
│    + Phô mai (+$8)            │
│ 2× Cappuccino        $56.00   │
├──────────────────────────────┤
│ Subtotal            $310.00   │
│ Tax (10%)            $31.00   │
│ Service charge (5%)  $15.50   │
│ Discount            −$20.00 ⊗ │  ← ⊗ = nút xoá discount
│ Tip                  $30.00 ✎ │  ← ✎ = nút sửa tip
├──────────────────────────────┤
│ TOTAL              $366.50    │  ← Nhấn mạnh, color success
├──────────────────────────────┤
│ [ Áp giảm giá ]               │  ← disabled nếu đã có
│ [ Thêm tip ]                  │
│ [ Chia bill ]                 │
├──────────────────────────────┤
│ [  Chọn phương thức  ─────▶ ] │  ← primary
└──────────────────────────────┘
```

**Action sheets:**

**"Áp giảm giá":**
- Chọn % (5/10/15/20/tuỳ) hoặc số tiền
- Lý do (required nếu >10%)
- **Supervisor PIN** nếu >15%

**"Thêm tip":**
- Chip % (5/10/15/20) hoặc nhập tay
- Không cần authorize

**"Chia bill":**
- **Chia đều** n người → hiện `total / n`
- **Chia theo món** → list món với checkbox, tạo sub-bills → flow mới: thanh toán từng sub-bill xong mới đóng đơn

**Edge cases:**
- Nếu đơn có món status < `ready` → cảnh báo "Còn X món chưa phục vụ, vẫn thanh toán?"
- Nếu có món đã void → không tính vào bill

---

## 12. Screen #8 — Payment Method Picker

**Mục đích:** Chọn cách khách thanh toán. Hiện dưới dạng bottom sheet chiếm 60% màn.

**Layout:**
```
┌──────────────────────────────┐
│           ───                 │
│    Thanh toán $366.50         │
├──────────────────────────────┤
│ ┌──────────┐  ┌──────────┐    │  ← Grid 2x2 icon card
│ │   💵     │  │   📱     │    │
│ │  Tiền    │  │ VietQR   │    │
│ │  mặt     │  │          │    │
│ └──────────┘  └──────────┘    │
│ ┌──────────┐  ┌──────────┐    │
│ │   💳     │  │   ✂️     │    │
│ │  Thẻ     │  │  Chia     │    │
│ │  EMV     │  │  nhiều   │    │
│ └──────────┘  └──────────┘    │
├──────────────────────────────┤
│ [ Huỷ ]                       │
└──────────────────────────────┘
```

- "Chia nhiều" = partial payment (khách trả 2 phương thức, ví dụ 50% cash + 50% QR)
- Tap 1 option → đóng sheet, mở màn 9/10/card SDK tương ứng
- Nếu card reader chưa pair → disable + link "Cấu hình ở Settings"

---

## 13. Screen #9 — Cash Keypad + tính tiền thối

**Mục đích:** Nhập số tiền khách đưa, tự tính tiền thối.

**Layout:**
```
┌──────────────────────────────┐
│ ← Thanh toán tiền mặt         │
├──────────────────────────────┤
│ Tổng đơn:          $366.50    │
│                               │
│ Khách đưa:                    │
│     $400.00                   │  ← số lớn, align right
│                               │
│ Tiền thối:                    │
│     $33.50       ✓            │  ← color success nếu đủ, danger nếu thiếu
├──────────────────────────────┤
│ Gợi ý: [$400] [$500] [$1000] │  ← Chip quick-fill
├──────────────────────────────┤
│  ┌───┐ ┌───┐ ┌───┐           │
│  │ 1 │ │ 2 │ │ 3 │            │
│  └───┘ └───┘ └───┘           │
│  ┌───┐ ┌───┐ ┌───┐           │
│  │ 4 │ │ 5 │ │ 6 │            │  ← Numpad
│  └───┘ └───┘ └───┘           │
│  ┌───┐ ┌───┐ ┌───┐           │
│  │ 7 │ │ 8 │ │ 9 │            │
│  └───┘ └───┘ └───┘           │
│  ┌───┐ ┌───┐ ┌───┐           │
│  │00 │ │ 0 │ │ ⌫ │           │
│  └───┘ └───┘ └───┘           │
├──────────────────────────────┤
│ [ Xác nhận thanh toán ─────▶] │  ← disabled nếu tiền < total
└──────────────────────────────┘
```

**Logic:**
- Quick-fill chip: round-up gợi ý dựa trên total ($366.50 → $400, $500, $1000)
- Không cho xác nhận nếu thiếu; hiện text đỏ "Thiếu $X"
- Xác nhận → `mutation checkoutOrder` với `paymentMethod: CASH, cashReceived: 400` → màn 11

---

## 14. Screen #10 — VietQR Fullscreen + poll

**Mục đích:** Hiện QR to, khách mở app ngân hàng quét. App tự poll trạng thái, đóng khi đã nhận tiền.

**Layout (portrait, fullscreen):**
```
┌──────────────────────────────┐
│              ✕                │  ← close top right
│                               │
│      Quét QR để thanh toán    │
│                               │
│   ┌─────────────────────┐    │
│   │                     │    │
│   │     [  QR code  ]   │    │
│   │      (320dp)        │    │
│   │                     │    │
│   └─────────────────────┘    │
│                               │
│   Số tiền: $366.50            │
│   Nội dung: KOPAG-1234         │
│                               │
│   ⏳ Đang chờ khách quét...    │
│                               │
│   [ Copy thông tin ]          │
│   [ Đổi phương thức ]         │
└──────────────────────────────┘
```

**Logic:**
- Gọi API tạo QR động (VietQR spec hoặc qua Napas/MoMo/VNPAY gateway)
- Subscribe `paymentIntentUpdated(id)` hoặc poll 2s/lần trong 5 phút
- Khi status = `SUCCESS` → auto chuyển màn 11
- Khi timeout → "QR hết hạn. Tạo lại?"
- Nút "Đổi phương thức" → quay về màn 8 (không void intent, vẫn poll nền; nếu tiền về sau khi đổi → cảnh báo double-charge)

**Edge cases:**
- Không tắt màn hình tự động (keep awake flag)
- Volume up khi `SUCCESS` (sound + haptic feedback)

---

## 15. Screen #11 — Payment Success + In/gửi bill

**Mục đích:** Xác nhận thành công, cho phép in hoặc gửi e-receipt.

**Layout:**
```
┌──────────────────────────────┐
│                               │
│             ✓                 │  ← Lottie checkmark animation
│                               │
│      Thanh toán thành công    │
│                               │
│   $366.50 · Tiền mặt           │
│   Thối: $33.50                │
│   Đơn #1234 · Bàn A3          │
│                               │
├──────────────────────────────┤
│   [ 🖨️  In hoá đơn    ]       │  ← primary
│   [ 📧 Gửi email     ]       │
│   [ 💬 Gửi SMS       ]       │
│   [ 🧾 Xuất HĐĐT     ]       │  ← VN e-invoice TCT
├──────────────────────────────┤
│   [   Xong            ]       │  ← close, về màn 2
└──────────────────────────────┘
```

**Actions:**
- **In**: chọn printer (default từ settings, override được) → gửi ESC/POS bytes qua socket 9100
- **Email/SMS**: input dialog → gọi mutation `sendReceipt(billId, channel, recipient)`
- **Xuất HĐĐT**: form MST / tên công ty / địa chỉ / email → gọi provider (VNPT/Viettel/MISA) → trả về mã tra cứu
- **Xong**: clear order context, về Home tab "Bàn"

**Edge cases:**
- In fail (printer offline) → retry button + fallback "Lưu PDF để in sau"
- Offline: HĐĐT queue, in local cache bill trước — hiện "Hoá đơn sẽ được xuất khi online"

---

## 16. Screen #12 — Order History

**Mục đích:** Xem lại đơn cũ, **reprint**, void (có PIN).

**Entry:** từ Settings hoặc từ nút lịch sử ở TopBar Home.

**Layout:**
```
┌──────────────────────────────┐
│ ← Lịch sử đơn                 │
├──────────────────────────────┤
│ 🔍 Tìm theo mã / khách        │
│ Filter: Hôm nay ▼ · Đã TT ▼   │
├──────────────────────────────┤
│ ┌─────────────────────────┐  │
│ │ #1234 · Bàn A3    ✓Paid │  │
│ │ Cheryl · $366.50        │  │
│ │ 14:23 · Tiền mặt         │  │
│ │ [ Chi tiết ] [ 🖨 In lại ] │  │
│ └─────────────────────────┘  │
│ ...                           │
├──────────────────────────────┤
│ Page 1/15         ← 1 2 3 → ▶ │
└──────────────────────────────┘
```

- Tap card → **Bill detail** (màn phụ tương tự bill preview nhưng read-only)
- "In lại" → mở PrinterPickerSheet, in lại bill (log lại vào audit table)
- Menu `⋯` → "Huỷ bill" (supervisor PIN + lý do) → `mutation voidBill`

---

## 17. Screen #13 — Settings

**Mục đích:** Cấu hình terminal và tiện ích.

**Sections:**

1. **Tài khoản**
   - Current user + PIN đổi
   - Logout hoàn toàn (clear refreshToken)

2. **Máy in**
   - List printers đã cấu hình (name, type: bill / kitchen, IP/MAC)
   - Nút "Thêm printer" → form nhập IP, test print
   - Chọn printer mặc định cho: bill khách, phiếu bếp

3. **Thiết bị**
   - Terminal ID (read-only, copy được)
   - Device info (Android version, app version)
   - "Huỷ đăng ký terminal" (confirm kép — cần reactivate code mới đăng nhập được)

4. **Ngôn ngữ**
   - EN / VI radio

5. **Thông báo**
   - Enable push khi món ready
   - Volume (off / low / normal / high)
   - Vibration on/off

6. **Khác**
   - Về Kopag / Điều khoản / Chính sách
   - Xem log lỗi
   - Nút **"Khoá máy"** → về màn 1

---

## 18. Screen #14 — Notifications Drawer

**Mục đích:** Danh sách thông báo — món ready, đơn mới được gán, cảnh báo hệ thống.

**Entry:** tap chuông ở Home TopBar.

**Layout:** side drawer từ phải, chiếm 80% màn.

```
┌──────────────────────────────┐
│ Thông báo            [ ✓ tất ]│  ← mark all read
├──────────────────────────────┤
│ ● Món "Beef Burger" sẵn sàng  │  ← ● = unread
│   Đơn #1234 · 2 phút trước    │
├──────────────────────────────┤
│ ○ Đơn #1235 được gán cho bạn  │
│   5 phút trước                │
├──────────────────────────────┤
│ ○ Bếp tạm dừng món "Alfredo"  │
│   1 giờ trước                 │
└──────────────────────────────┘
```

- Tap noti → điều hướng tới đơn/bill liên quan
- Swipe trái để xoá
- Realtime: subscribe `notificationReceived`

---

## 19. Bonus screens (nên có sau MVP)

- **Terminal Registration** — nhập 6-digit activation code từ dashboard, `registerTerminal` → lưu `terminalId` + cert
- **Full Login** (email + password) — fallback khi quên PIN, dùng hiếm
- **Shift report (X/Z)** — cuối ca, tổng kết doanh thu theo phương thức, chênh lệch két (mặc dù handheld không có két, vẫn có X/Z cho cashier tham chiếu)
- **Customer lookup** (loyalty) — search theo SĐT, gán vào đơn, áp ưu đãi
- **KDS monitor** (nếu thiết bị kiêm KDS) — full screen hiển thị ticket bếp, bump khi xong

---

## 20. Offline behavior — quy tắc chung

| Action | Online | Offline | Conflict |
|---|---|---|---|
| View menu | GraphQL query | Cache local | Refresh khi reconnect |
| Create order | Mutation ngay | Queue + optimistic UI | Server ID replace temp ID sau sync |
| Add items | Mutation | Queue | Dựa theo ordering của queue |
| Send to kitchen | In trực tiếp printer | Queue in, báo "Sẽ in khi online printer OK" | In đúp? → ticket có UUID, bếp dedup |
| Payment cash | Mutation checkout | Queue với local bill code `{terminalId}-{seq}` | Rare — nếu dup paidAt server reject, app rollback |
| Payment QR | Cần online (phải gọi gateway) | **Disable** — prompt "Cần mạng để thanh toán QR" | — |

**Indicator:**
- Top banner vàng "Mất kết nối — {{n}} thao tác đang chờ sync"
- Badge số trên nút cloud ở Settings

**Queue storage:**
- Room (Compose) hoặc WatermelonDB (RN)
- Thread sync: retry với exponential backoff (2s → 4s → 8s → max 60s)

---

## 21. Notification & sound

| Event | UI | Sound | Haptic |
|---|---|---|---|
| Món `ready` | Toast + noti | chime.mp3 (1s) | double pulse |
| Đơn mới được gán | Noti drawer | ding.mp3 | single pulse |
| Payment success | Fullscreen check | success.mp3 | strong |
| Payment fail | Dialog | error.mp3 | error vibrate |
| Printer offline | Toast đỏ | — | single |
| Offline → online | Toast xanh | subtle | — |

Sound file đặt trong `res/raw/` (Android) hoặc `assets/sounds/` (RN).

---

## 22. Accessibility checklist

- Tap target ≥ 48dp
- Text contrast ≥ WCAG AA
- TalkBack label cho mọi icon-only button (reuse aria-label keys)
- Tăng font size theo system setting (tối đa 130%)
- Không dùng màu làm cue duy nhất (status chip có cả text)

---

## 23. Edge cases cần cover

- [ ] Waiter A và B cùng chọn bàn A3 → ai gửi createOrder trước thắng, người còn lại toast
- [ ] Mất mạng giữa khi đang tính tiền QR → poll intent khi online lại, tránh double-charge
- [ ] Khách đổi ý, xoá hết món đã gửi bếp → void từng món, printer bếp in "VOIDED" ticket
- [ ] Bill đã in nhưng khách muốn đổi món → void bill (PIN) + tạo đơn mới, bill cũ vẫn lưu audit
- [ ] Máy hết pin trong lúc payment QR đã SUCCESS → reopen app, subscription pick up, báo "Đơn 1234 đã paid, in bill?"
- [ ] Nhiều terminal in cùng 1 printer → queue server-side trên printer hoặc trong app
- [ ] Món bán chạy hết giữa ca → realtime update availability, waiter đang ở màn 4 thấy gray out ngay
- [ ] Supervisor rời quán, không có ai PIN void/discount → cho phép "Ticket pending approval" gửi lên dashboard để owner duyệt từ xa

---

## 24. Prompt template cho AI generate UI

```
Role: Senior Android UI engineer, 10y experience.

Stack: [Jetpack Compose | React Native Expo].

Goal: Build screen "{{screen name}}" for handheld waiter POS app.
Device: Android 8+, phone 5.5"–7" portrait, touch targets ≥48dp.

Design tokens:
{{paste §1.1 colors, §1.2 typography, §1.3 spacing}}

Shared components available (assume already implemented):
{{paste §3 table}}

Navigation: {{paste relevant part of §2}}

Screen spec:
{{paste section §N of the screen}}

Constraints:
- Kotlin-idiomatic (or idiomatic RN)
- No hardcoded strings — use i18n keys from namespace "{{relevant.ns}}"
- Handle loading / empty / error / offline states
- State hoisted to ViewModel (Compose) or Zustand store (RN)
- Comment only non-obvious logic

Return: single self-contained file.
```

---

## 25. Checklist trước khi code

- [ ] Đã thống nhất stack: Compose vs RN?
- [ ] Thống nhất lib network: Apollo Kotlin / urql / Apollo RN?
- [ ] Thống nhất auth: PIN-based, refresh via existing mutation `verifyPin`?
- [ ] Thống nhất printer SDK: `escpos-android` (Kotlin) hoặc `react-native-thermal-receipt-printer`?
- [ ] Thống nhất payment SDK: VNPAY / MoMo / Stripe Terminal?
- [ ] E-invoice provider: VNPT / Viettel / MISA / EasyInvoice?
- [ ] Offline DB: Room / WatermelonDB?
- [ ] Đã extend `schema.graphql` với mutation POS-specific (`verifyPin`, `openShift`, `closeShift`, `sendReceipt`, `registerTerminal`)?

Những ô checkbox ở §25 ảnh hưởng trực tiếp đến code được sinh ra — nên chốt trước khi prompt.
