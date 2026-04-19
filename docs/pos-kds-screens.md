# Kopag POS — Kitchen Display System (KDS) Screen Spec

- **Version:** 0.1.0 (2026-04-17)
- **Target device:** Tablet 10"–14" landscape, treo tường bếp / quầy bar; hoặc all-in-one kitchen monitor có bump bar
- **User:** đầu bếp / phụ bếp / bartender — tay thường dơ, ướt, mỡ; xem từ khoảng cách 60–120cm
- **Core flows:** Nhận ticket → bắt đầu nấu → báo sẵn sàng (bump) → ticket biến mất
- **Related docs:**
  - Waiter app: [`pos-android-screens.md`](./pos-android-screens.md)
  - Data model: [`schema.graphql`](./schema.graphql)
  - API conventions: [`api-spec.md`](./api-spec.md)

---

## 0. KDS khác gì waiter app?

| Yếu tố | Waiter handheld | KDS bếp |
|---|---|---|
| Orientation | Portrait | **Landscape** (dài theo mặt bếp) |
| Viewing distance | 30cm (trên tay) | 60–120cm (treo tường) |
| Font size | 12–16sp | **18–32sp** (lớn gấp đôi) |
| Theme | Light (pastel) | **Dark default** (chịu ánh sáng bếp, giảm loá) |
| Input method | Touch chính xác | Touch gross + **swipe**, **long-press**, **bump bar** phím cứng |
| Hands condition | Sạch | Dơ / ướt / mỡ → tap targets ≥ **80dp** |
| Network | Có thể offline | **Luôn phải online** — nếu không bếp không biết đơn mới (nhưng vẫn cache khi mất 10s) |
| Multi-user | 1 người/ca | **Nhiều cook cùng xem 1 màn** — bump = broadcast |

Nguyên tắc: tối giản text, tối đa thông tin quan trọng (món + SL + note + thời gian chờ).

---

## 1. Design tokens KDS

### 1.1. Màu — dark theme mặc định

| Role | Hex | Dùng ở |
|---|---|---|
| Bg base | `#0B1220` | Màn chính |
| Bg card | `#1E293B` | Ticket card idle |
| Bg card warm | `#422006` | Ticket cảnh báo (>8 phút) |
| Bg card hot | `#450A0A` | Ticket quá hạn (>15 phút) |
| Text primary | `#F8FAFC` | Tên món |
| Text secondary | `#94A3B8` | Meta, thời gian |
| Accent blue | `#3B82F6` | Primary action |
| Success | `#22C55E` | Bumped, ready |
| Warning | `#F59E0B` | Cảnh báo thời gian |
| Danger | `#EF4444` | Overdue, recall, 86'd |
| Station violet | `#A78BFA` | Station bar |
| Station amber | `#F59E0B` | Station grill |
| Station cyan | `#22D3EE` | Station cold |

### 1.2. Timer color rules (tự động đổi bg card)

| Thời gian từ lúc nhận | Màu | Cảnh báo |
|---|---|---|
| 0–5 phút | Default | — |
| 5–8 phút | Soft amber border | Chú ý |
| 8–12 phút | **Amber bg** (`#422006`) | Gấp |
| 12–15 phút | Amber + pulsing border | Gấp lắm |
| >15 phút | **Red bg** (`#450A0A`) + pulsing | Quá hạn, escalate |

Rule này là **per item**, không phải per ticket — ticket 1 món cháy thì ticket đỏ; bump xong còn món khác thì quay về default.

### 1.3. Typography — lớn hơn mobile 1.5×

- Ticket header (bàn, code): 22sp / 800
- Item name: 20sp / 700
- Modifier / note: 16sp / 500 italic
- Quantity: 24sp / 900 (size lớn vì quan trọng nhất)
- Timer: 18sp / 700 tabular-nums
- Station tag: 12sp / 800 uppercase

### 1.4. Spacing & hit area

- Spacing unit: **8dp** (gấp đôi mobile)
- Card padding: 16dp
- Tap target: **80dp × 80dp** tối thiểu (tay dơ / đeo găng)
- Radius: 12 (card), 24 (pill button), 999 (badge)

### 1.5. Motion

- New ticket slide in from top 300ms + sound
- Bump: fade out scale 0.95 300ms
- Pulsing border: 1.5s ease in-out infinite (chỉ khi warning/danger)

### 1.6. Hardware giả định

- Tablet 10" landscape hoặc màn 15" all-in-one
- Luôn cắm nguồn (không lo pin)
- **Bump bar** (optional): 4–8 phím cứng map tới 4–8 slot ticket đầu tiên trên grid
- Loa ngoài: phát chime khi có ticket mới
- **Không** có keyboard, không có scanner
- Có thể pair với receipt printer dự phòng (in ticket giấy khi mất mạng)

### 1.7. Ngôn ngữ

Reuse i18n keys từ dashboard. Thêm namespace `kds.*` (đề xuất trong §12). Mặc định VI cho bếp VN.

---

## 2. Navigation map

```
                    ┌──────────────────────┐
                    │ 0. Station picker     │ ◄─── first launch / đổi station
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  1. KDS Grid (main)   │
                    │  • All / station tabs │
                    │  • Ticket grid 3–4 col│
                    └─────┬──────────┬──────┘
                          │          │
              (tap ticket)▼          ▼ (settings icon)
                ┌─────────────────┐  ┌───────────────────┐
                │ 2. Ticket Detail│  │ 3. Station Setting│
                │   - items + mod │  │   - print, sound, │
                │   - recall/bump │  │     layout, 86'd  │
                └─────────────────┘  └───────────────────┘

    Side: Expo view (tổng hợp · xem all-day) · Recall overlay · 86'd sheet
```

Nav bar trái dọc (persistent) chứa icon station + settings + expo view; không back button kiểu smartphone vì KDS là standalone display.

---

## 3. Shared components (KDS specific)

| Component | Mô tả | Xuất hiện ở |
|---|---|---|
| `TicketCard` | Thẻ 1 ticket: header + list item + timer + action bar dưới | #1 |
| `TicketItemRow` | 1 món trong ticket: qty × name + modifier + note + checkbox prep | #1, #2 |
| `TimerBadge` | mm:ss từ lúc ticket nhận; auto đổi màu theo §1.2 | mọi card |
| `StationTag` | Chip nhỏ hiện station (🔥 Grill / ❄️ Cold / 🍺 Bar / 🍰 Dessert) | #1, #2 |
| `BumpBar` | Action bar dưới card: `Bắt đầu` / `Bump` / `Recall` | #1, #2 |
| `NewTicketToast` | Toast góc phải trên khi có ticket mới + sound | overlay toàn app |
| `ConnectionIndicator` | Dot xanh/đỏ góc phải trên status bar KDS | overlay |
| `SideRail` | Nav dọc bên trái: logo + station filter + expo + settings + user | mọi màn |
| `UnavailableSheet` | Modal toggle "86" món (đánh dấu hết) | #1, #3 |

---

## 4. Screen #1 — KDS Grid (main board)

**Mục đích:** Màn làm việc chính của cook. Hiển thị **tất cả ticket đang active** ở station của mình. Mỗi ticket là 1 card, bếp đọc → nấu → bump.

**Layout landscape (10"+ tablet, 1280×800):**

```
┌────────────────────────────────────────────────────────────────────────┐
│ K │  [ Tất cả (12) ] [ 🔥 Grill (4) ] [ ❄️ Cold (3) ] [ 🍺 Bar (5) ]    │ ← Top: station tabs
│   │                                             ┌──────────────┐       │
│ 🔥 │                                             │ 🔔 New ticket│       │
│ ❄️ │                                             │    #1237     │       │ ← Toast overlay khi có noti
│ 🍺 │                                             └──────────────┘       │
│ 🍰 │                                                                     │
│   │ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│ 👁️│ │ Ticket #1234│ │ Ticket #1235│ │ Ticket #1236│ │ Ticket #1237│       │
│   │ │ Bàn A3   3:42│ │ Bàn B2   5:18│ │ Bàn A5   8:04│ │ Take 1:22  │       │
│ 🧾 │ │──────────────│ │──────────────│ │──────────────│ │──────────────│       │
│   │ │ 2× Eggs Ben │ │ 1× Beef Brg  │ │ 1× Dory Sal  │ │ 3× Brownie  │       │
│ ⚙ │ │   Medium    │ │   Well done  │ │   Hot sauce  │ │             │       │
│   │ │ 1× Burger   │ │ 2× Lemonade │ │ 2× Cappuccino│ │ 1× Green Tea │       │
│ RJ │ │   No onion  │ │              │ │              │ │              │       │
│   │ │──────────────│ │──────────────│ │──────────────│ │──────────────│       │
│   │ │ ▶ Start     │ │ ✓ Bump      │ │ ⚠ BUMP NOW  │ │ ▶ Start     │       │
│   │ └────────────┘ └────────────┘ └────────────┘ └────────────┘          │
│   │                                  (amber bg)     (red bg pulsing)     │
│   │                                                                      │
│   │ ┌────────────┐ ┌────────────┐ ...                                    │
│   │ │ Ticket #1238│ │ Ticket #1239│                                       │
│   │ │ ...         │ │ ...         │                                       │
│   │ └────────────┘ └────────────┘                                         │
└────┴─────────────────────────────────────────────────────────────────────┘
  ↑
  SideRail
```

**SideRail (trái, dọc, 64dp rộng):**
- Logo Kopag (chấm nhỏ)
- Station icons (🔥 ❄️ 🍺 🍰) — tap để switch view
- 👁️ Expo view
- 🧾 All-day summary
- ⚙️ Settings
- Avatar user (ai đang login)
- **Connection dot** xanh/đỏ ở dưới cùng

**Top bar:**
- Station tabs ngang — số trong ngoặc là count ticket active
- Right: `🔔 Sound on` toggle + `📶` signal

**Ticket grid:**
- **3 cột** (tablet 10") / **4 cột** (15"+)
- Auto-wrap theo width; scroll dọc nếu nhiều
- Sort: **oldest first** (ticket cũ nhất ở trên-trái) — nguyên tắc FIFO bếp
- Max 12 ticket visible cùng lúc; còn lại scroll

**TicketCard anatomy:**

```
┌─────────────────────────┐
│ 🔥 #1234    Bàn A3      │ ← Station tag · code · bàn
│                   3:42  │ ← Timer (góc phải, lớn)
│─────────────────────────│
│ 2× Eggs Benedict        │ ← Qty lớn (bold) + name
│    🔹 Medium            │ ← Modifier indent
│    📝 Không hành         │ ← Note italic màu xanh
│                         │
│ 1× Beef Burger          │
│    🔹 Well done          │
│    🔹 Extra cheese       │
│─────────────────────────│
│        [ ▶ Bắt đầu ]    │ ← Button full width, 80dp cao
└─────────────────────────┘
```

**Trạng thái ticket (status machine):**

| Status | Bg card | Action button | Màu |
|---|---|---|---|
| `pending` (vừa nhận) | Default `#1E293B` | **▶ Bắt đầu** | Blue |
| `preparing` (đang nấu) | Default + border blue | **✓ Bump (sẵn sàng)** | Emerald |
| `preparing` + >8' | Amber bg | ✓ Bump | Amber |
| `preparing` + >15' | Red bg + pulse | ✓ Bump (NOW!) | Red |
| `ready` (vừa bump, 3s before disappear) | Green fade out | — | — |

**Interactions:**

- **Tap "Bắt đầu"** → status `pending → preparing`, timer bắt đầu đếm xanh, broadcast subscription → waiter app cập nhật
- **Tap "Bump"** → status `preparing → ready`, card fade-out 300ms rồi biến mất, push notification cho waiter phụ trách đơn → "Món X sẵn sàng"
- **Long-press card** → hiện menu: `Recall` / `Xem chi tiết` / `In lại ticket giấy` / `Báo hết món này`
- **Swipe right trên card** (2 ngón): quick bump (shortcut cho cook có kinh nghiệm)
- **Tap 1 item row (không phải button)**: toggle **strikethrough** — visual prep checkbox, không đổi status ticket (để track các món đã làm xong trong ticket nhiều món)
- **Bump bar phím cứng** (nếu có): phím 1–8 map tới 8 ticket đầu tiên trên grid → bump ngay

**Recall overlay:**

Nếu cook lỡ bump nhầm → tap "Recall last" ở top bar (hoặc shortcut phím) → trong **30 giây** sau bump vẫn có thể rollback. Quá 30s thì không recall được nữa (vì có thể khách đã nhận).

```
┌──────────────────────────────────┐
│ ↩ Vừa bump #1235 · Còn 27s       │ ← Toast dưới top bar
│ [ Recall ]                       │
└──────────────────────────────────┘
```

**Edge cases:**

- **Ticket mới đến** khi đang xem: slide in top + chime sound. Tự động sort lại (oldest top-left). Nếu cook đang tap 1 ticket, **không** di chuyển ticket đó — giữ vị trí.
- **Ticket có item bị "86'd"**: item đó gạch đỏ + icon 🚫, cook không thấy phiền
- **Kết nối mất** (>10s): banner top đỏ "Mất kết nối — ticket mới có thể chậm". In backup ra printer giấy.
- **Cùng 1 ticket hiển thị ở 2 station** (ví dụ đồ uống + món chính cùng đơn): chỉ hiện món thuộc station đó trên từng màn; khi cả 2 station bump xong thì status ticket = `ready` toàn bộ.
- **Waiter void món** khi cook đang nấu: card flash đỏ 2 lần + item gạch + toast "Bàn A3 huỷ món X" → cook biết dừng làm.

**Sound:**
- Chime khi ticket mới: 1 tone nhẹ 0.5s
- Escalating beep khi có ticket đạt >15': 3 tone ascending, lặp mỗi 30s đến khi bump

---

## 5. Screen #2 — Ticket Detail

**Mục đích:** Khi cook muốn xem kỹ 1 ticket — đặc biệt ticket nhiều món có note dài, hoặc kiểm tra lịch sử (ai gọi, bàn nào, ghi chú đơn).

**Entry:** Long-press ticket ở Grid → "Xem chi tiết"; hoặc tap vào vùng trống card (không trên button).

**Layout (fullscreen, landscape):**

```
┌────────────────────────────────────────────────────────────┐
│ ← Back                                      🖨 In giấy     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│   🔥 GRILL STATION                          Timer: 8:12     │
│                                                             │
│   Ticket #1234                                              │
│   Bàn A3 · Cheryl Arema · 2 khách                          │
│   Nhận lúc 14:23 · Waiter Rijal                            │
│                                                             │
│   Ghi chú đơn: Khách dị ứng hành, cẩn thận                 │
│                                                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────────────────────────────────────────────┐ │
│   │ 2× Eggs Benedict                            $151.00  │ │
│   │    🔹 Size: Medium                                   │ │
│   │    🔹 Không cay                                       │ │
│   │    📝 KHÔNG HÀNH (khách dị ứng)                      │ │
│   │    [ ☐ Chưa xong   ] [ ✓ Đã xong ]                  │ │
│   └──────────────────────────────────────────────────────┘ │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐ │
│   │ 1× Beef Burger                              $95.00   │ │
│   │    🔹 Well done                                       │ │
│   │    🔹 Thêm phô mai (+$8)                             │ │
│   │    [ ☐ Chưa xong   ] [ ✓ Đã xong ]                  │ │
│   └──────────────────────────────────────────────────────┘ │
│                                                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│   [ ↩ Recall ]          [ 🚫 Báo hết món ]   [ ✓ BUMP ALL ]│
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Đặc điểm:**

- Font lớn hơn Grid 20% (ticket chính mà)
- Mỗi item là 1 card lớn, có 2 button radio-style `Chưa xong` / `Đã xong` — phục vụ trường hợp ticket có 3–5 món, cook nấu xong từng món, trạng thái lưu lại để bartender / cook khác biết cái nào xong.
- Note màu xanh nhạt; note URGENT (allergy / chứa ghi chú dị ứng) → highlight đỏ như ví dụ "KHÔNG HÀNH (khách dị ứng)".
- Nút **BUMP ALL** enable khi **tất cả item `Đã xong`**. Nếu cook chưa tick hết mà vẫn muốn bump → confirmation "Còn 1 món chưa tick — vẫn bump?" (cho phép override).
- **Báo hết món** → modal `UnavailableSheet` (xem §6.5) cho món này — đánh dấu 86'd toàn hệ thống.
- **Recall** chỉ hiện nếu ticket vừa bump trong 30s; ngoài ra disabled.
- **In giấy** → gửi ESC/POS ra printer dự phòng ở góc bếp.

**Edge cases:**
- Nếu station khác (vd Cold) đã bump phần của họ (salad) rồi mà station này (Grill) chưa bump → Ticket Detail chỉ show phần Grill, và có banner xanh nhỏ "Cold đã bump 14:31".
- Ticket void bởi waiter khi đang ở detail → toast đỏ + tự back về Grid sau 3s.

---

## 6. Screen #3 — Station Settings

**Mục đích:** Cấu hình trạm. Chỉ supervisor / manager mới access được (PIN). Cook thường không vào đây.

**Entry:** SideRail → ⚙️ → nhập PIN supervisor (4–6 số).

**Layout (landscape, scrollable):**

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back    Cấu hình station                  👤 Supervisor  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   HỒ SƠ STATION                                              │
│   ┌────────────────────────────────────────────────────────┐│
│   │ Tên:     [ Grill station        ]                      ││
│   │ Icon:    [ 🔥 ]                                        ││
│   │ Vị trí:  [ Bếp nóng             ]                      ││
│   │ Terminal: TERM-KDS-01 (read-only)                      ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
│   DANH MỤC MÓN NHẬN                                          │
│   Station này sẽ hiển thị ticket của các category:           │
│   ┌────────────────────────────────────────────────────────┐│
│   │ ☑ Main course     ☑ Appetizer      ☐ Dessert           ││
│   │ ☐ Beverage         ☐ Salad          ☐ Soup             ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
│   HIỂN THỊ                                                   │
│   ┌────────────────────────────────────────────────────────┐│
│   │ Số cột:      [ 3 ▼ ]   (3–6)                           ││
│   │ Max ticket:  [ 12 ▼ ]  (ticket quá số này → warning)   ││
│   │ Sắp xếp:     [ Cũ nhất trước ▼ ] / Mới nhất trước      ││
│   │ Dark mode:   [ ✓ Bật ]  (auto theo giờ?  [☐])          ││
│   │ Font size:   [ ●━━━━ ] (M · L · XL)                    ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
│   CẢNH BÁO THỜI GIAN                                         │
│   ┌────────────────────────────────────────────────────────┐│
│   │ Vàng khi:  [ 8  ] phút                                 ││
│   │ Đỏ khi:    [ 15 ] phút                                 ││
│   │ Beep khi đỏ:  [ ✓ Mỗi 30s ]                            ││
│   │ Escalate lên quản lý khi > [ 20 ] phút: [ ✓ ]          ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
│   ÂM THANH                                                   │
│   ┌────────────────────────────────────────────────────────┐│
│   │ ☑ Chime khi ticket mới     Volume: [━━●━━]            ││
│   │ ☑ Beep khi overdue                                    ││
│   │ ☑ Voice announce "Món X cho bàn Y"                    ││
│   │                                                        ││
│   │ [ 🔊 Test sound ]                                      ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
│   PRINTER DỰ PHÒNG                                           │
│   ┌────────────────────────────────────────────────────────┐│
│   │ ● Xprinter 192.168.1.55 · Đã kết nối                  ││
│   │ [ Test in phiếu ]                                      ││
│   │ ☑ Auto in khi mất mạng                                ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
│   BUMP BAR (phím cứng)                                       │
│   ┌────────────────────────────────────────────────────────┐│
│   │ ☑ Kích hoạt                                            ││
│   │ Mapping: Phím 1–8 → 8 ticket đầu grid                 ││
│   │ Shortcut Recall: Phím 0                                ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
│   MÓN HẾT (86'd)                                             │
│   ┌────────────────────────────────────────────────────────┐│
│   │ Kopag Benedict                                         ││
│   │   🚫 Hết đến cuối ca   [ Khôi phục ]                   ││
│   │ Grilled Salmon                                         ││
│   │   🚫 Hết cả ngày       [ Khôi phục ]                   ││
│   │                                                        ││
│   │ [ + Đánh dấu món hết ]                                 ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
│   TÀI KHOẢN                                                  │
│   ┌────────────────────────────────────────────────────────┐│
│   │ User hiện tại: Chef Minh (Supervisor)                  ││
│   │ [ Đổi user ]   [ Đăng xuất station ]                  ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 6.5. UnavailableSheet — Báo hết món

Modal centered, sử dụng ở nhiều nơi:

```
┌────────────────────────────────────────────┐
│             Đánh dấu món hết               │
├────────────────────────────────────────────┤
│                                             │
│   🍔 Beef Burger                            │
│                                             │
│   Khoảng thời gian hết:                     │
│   ○ 15 phút (tạm thời)                      │
│   ● Đến cuối ca                             │
│   ○ Cả ngày hôm nay                         │
│   ○ Vô thời hạn (quản lý cần khôi phục)    │
│                                             │
│   Lý do (tuỳ chọn):                         │
│   [ Hết nguyên liệu                    ]    │
│                                             │
│   ⚠️ Hiệu lực ngay lập tức: menu và các    │
│   ticket chứa món này sẽ bị cảnh báo.       │
│                                             │
│   [ Huỷ ]               [ Xác nhận 86 ]    │
└────────────────────────────────────────────┘
```

Khi confirm:
- `mutation markMenuItemUnavailable(itemId, until, reason)` (cần thêm vào schema)
- Broadcast: waiter app màn Menu gray out item ngay
- Các ticket đang active có món này → item gạch đỏ + icon 🚫 + toast ở waiter app "Món X không còn, liên hệ khách"

---

## 7. Bonus screens (sau MVP)

### 7.1. Expo view (màn tổng)

Nếu nhà hàng lớn có **expeditor** (người điều phối giữa bếp nhiều station + serve tới bàn), họ cần 1 màn xem tất cả ticket từ mọi station, với status của từng phần:

```
┌────────────────────────────────────────────────────────────┐
│ EXPO VIEW                              all active · 24     │
├────────────────────────────────────────────────────────────┤
│ Ticket #1234 · Bàn A3 · 5:12                                │
│   🔥 Grill: 2× Eggs Benedict    [ ● preparing ]             │
│   ❄️ Cold: 1× Caesar Salad       [ ✓ ready ]                │
│                                                              │
│ Ticket #1235 · Bàn B2 · 3:45                                │
│   🔥 Grill: 1× Beef Burger       [ ○ pending ]              │
│   🍺 Bar:   2× Lemonade          [ ✓ ready ]                │
│                                                              │
│   ... (scroll)                                              │
│                                                              │
│   [ Expo — serve #1235 (all ready) ]                        │
└────────────────────────────────────────────────────────────┘
```

Expo tap "Serve" → đánh dấu toàn đơn `served` → waiter app push noti "Đơn #1235 ready to serve".

### 7.2. All-day summary

Tổng kết theo món trong ngày — dùng cho kiểm soát inventory real-time:

```
┌────────────────────────────────────────────────────────────┐
│ ALL-DAY SUMMARY · 17/04/2026                                │
├────────────────────────────────────────────────────────────┤
│ Eggs Benedict       42 đã làm · 3 đang nấu · 120 còn      │
│ Beef Burger         28 đã làm · 2 đang nấu · 85 còn       │
│ Caesar Salad        35 đã làm · 0 đang nấu · 65 còn       │
│ Crispy Dory         18 đã làm · 1 đang nấu · 🚫 86'd      │
│ Grilled Salmon      12 đã làm · 0 đang nấu · 8 còn ⚠      │
│ ...                                                         │
└────────────────────────────────────────────────────────────┘
```

Cảnh báo khi stock còn <10 → tap vào row để 86 món đó hoặc thông báo quản lý mua thêm.

### 7.3. Station picker (first launch)

Khi mở KDS lần đầu trên 1 thiết bị mới:

```
┌────────────────────────────────────────────────┐
│       Chọn station cho thiết bị này            │
├────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐  ┌─────────────┐             │
│   │     🔥       │  │     ❄️       │             │
│   │   Grill      │  │   Cold       │             │
│   │  Bếp nóng   │  │  Salad/Lạnh │             │
│   └─────────────┘  └─────────────┘             │
│                                                 │
│   ┌─────────────┐  ┌─────────────┐             │
│   │     🍺       │  │     🍰       │             │
│   │    Bar       │  │   Dessert    │             │
│   │  Pha chế    │  │  Tráng miệng │             │
│   └─────────────┘  └─────────────┘             │
│                                                 │
│   ┌─────────────┐                              │
│   │     👁️       │                              │
│   │    Expo      │                              │
│   │  Điều phối  │                              │
│   └─────────────┘                              │
│                                                 │
│        Nhập PIN supervisor để tiếp tục          │
│            [ _ _ _ _ _ _ ]                      │
└────────────────────────────────────────────────┘
```

Lưu `stationId` vào device config, không hỏi lại trừ khi manual reset ở Settings.

---

## 8. Realtime behavior

| Event | KDS hành động |
|---|---|
| Waiter `addOrderItems` → mutation thành công | Subscribe `ticketCreated` → ticket mới slide in + chime + toast |
| Another cook bump cùng ticket | Card fade out ở cả 2 máy (ai bump trước thắng) |
| Waiter void item trong ticket đang preparing | Item strikethrough đỏ + toast "Bàn A3 huỷ X" |
| Item marked `86'd` từ KDS khác | Menu waiter + ticket detail update ngay |
| Network lost >10s | Banner đỏ + fallback in ticket giấy qua printer local |
| Ticket quá 20' chưa bump | Auto-escalate: subscription `ticketEscalated` → push noti cho quản lý |

Subscriptions cần thêm trong schema:
- `ticketCreated(stationId: ID!)`
- `ticketUpdated(stationId: ID!)` (item toggle, void, bump)
- `ticketEscalated` — chỉ quản lý subscribe

---

## 9. Sound & alerts

| Event | Sound | Volume | Loop |
|---|---|---|---|
| Ticket mới | chime.mp3 (0.5s, bell) | Medium | 1 lần |
| Ticket đạt 8' | soft-beep.mp3 (0.3s) | Low | 1 lần |
| Ticket đạt 15' | urgent-beep.mp3 (1s, 3 tone) | High | mỗi 30s đến khi bump |
| Void item | alert-down.mp3 | Medium | 1 lần |
| Bump thành công | success-short.mp3 | Low | 1 lần |
| Kết nối lại | subtle-ping.mp3 | Low | 1 lần |

Tất cả đặt trong `assets/sounds/`. Volume config ở §6 Station Settings.

---

## 10. Station routing rules

Đề xuất BE field: `MenuItem.stationIds: [ID!]!` — 1 món có thể route tới 1+ station (ví dụ món có burger + fries được tách: burger → Grill, fries → Fryer).

Rules:
- Ticket gồm 3 món: Eggs Benedict (→ Grill), Caesar Salad (→ Cold), Lemonade (→ Bar) → tạo **3 sub-ticket** độc lập, mỗi sub-ticket hiện ở 1 station tương ứng
- Parent ticket bump = khi **tất cả sub-ticket** bump
- Sub-ticket có UUID riêng + parent `orderId` để trace

KDS query filter theo `stationId` sẽ chỉ lấy sub-ticket thuộc station đó.

---

## 11. Edge cases

- [ ] 2 cook cùng tap "Bắt đầu" trên cùng 1 ticket → server idempotent, ai trước thắng, người sau thấy card đã ở status `preparing` (optimistic UI rollback nếu cần)
- [ ] Cook bump nhầm ticket → 30s window để Recall; quá thời gian = phải liên hệ waiter "đơn này chưa xong, đừng mang ra"
- [ ] Power outage / tablet reboot giữa ca → khi khởi động lại, query tất cả ticket active + tự động resume timer từ `createdAt` của ticket (không reset)
- [ ] Mất mạng giữa khi đang nấu → timer vẫn chạy local; khi reconnect, state sync lại, ticket bị bump từ cook khác (hiếm) thì fade out
- [ ] Quá nhiều ticket (>12) → grid scroll, thêm "Có N ticket khác ở dưới" indicator + auto-scroll về top khi ticket mới
- [ ] Ticket có note URGENT (dị ứng) → highlight đỏ, sound khác (alert-medical.mp3), không được miss
- [ ] Khi supervisor đổi `category assignments` giữa ca → ticket đang active vẫn thuộc station cũ cho đến bump; ticket mới sau thay đổi mới route theo rule mới

---

## 12. Extending schema.graphql cho KDS

Đề xuất bổ sung (gửi cho BE):

```graphql
enum Station { GRILL COLD BAR DESSERT EXPO CUSTOM }
enum TicketStatus { PENDING PREPARING READY SERVED VOIDED }

type KitchenTicket implements Node {
  id: ID!
  parentOrder: Order!
  station: Station!
  status: TicketStatus!
  items: [KitchenTicketItem!]!
  createdAt: DateTime!
  startedAt: DateTime
  bumpedAt: DateTime
  bumpedBy: Viewer
  note: String               # note đơn, denormalized
}

type KitchenTicketItem {
  id: ID!
  menuItem: MenuItem!
  name: String!              # snapshot
  quantity: Int!
  modifiers: [String!]!
  note: String
  prepDone: Boolean!         # checkbox ở Ticket Detail
  voided: Boolean!
}

extend type Query {
  kitchenTickets(station: Station!, statuses: [TicketStatus!]): [KitchenTicket!]!
  allDaySummary(station: Station, date: Date): [AllDayRow!]!
}

type AllDayRow {
  menuItem: MenuItem!
  made: Int!
  preparing: Int!
  remaining: Int!
  isUnavailable: Boolean!
}

extend type Mutation {
  startTicket(ticketId: ID!): KitchenTicket!
  bumpTicket(ticketId: ID!): KitchenTicket!
  recallTicket(ticketId: ID!): KitchenTicket!       # trong 30s
  togglePrepDone(itemId: ID!, done: Boolean!): KitchenTicketItem!
  markMenuItemUnavailable(
    itemId: ID!
    until: UnavailableDuration!
    reason: String
  ): MenuItem!
  restoreMenuItem(itemId: ID!): MenuItem!
}

enum UnavailableDuration { FIFTEEN_MIN END_OF_SHIFT END_OF_DAY INDEFINITE }

extend type Subscription {
  ticketCreated(station: Station!): KitchenTicket!
  ticketUpdated(station: Station!): KitchenTicket!
  ticketEscalated: KitchenTicket!                   # cho quản lý
  menuItemUnavailabilityChanged: MenuItem!
}
```

---

## 13. Prompt template cho AI generate UI

```
Role: Senior Android/tablet UI engineer, ~10y, kitchen-grade app experience.

Stack: [Jetpack Compose | React Native | Flutter].

Goal: Build KDS (Kitchen Display System) screen "{{screen name}}".

Device: Landscape tablet 10"–14" (primary) or 15" all-in-one kitchen monitor.
User environment: bếp — high contrast cần thiết, tap target ≥80dp, user có thể đeo găng tay cao su.

Design tokens:
{{paste §1.1 colors (dark theme), §1.2 timer color rules, §1.3 typography, §1.4 spacing}}

Timer & escalation rules:
{{paste §1.2}}

Shared components available:
{{paste §3}}

Navigation:
{{paste §2}}

Screen spec:
{{paste section §N}}

Constraints:
- Dark theme default; auto-switch không áp dụng
- No text input unless critical (Settings only)
- Large touch targets; no hover states
- Realtime via subscription {{ticketCreated, ticketUpdated}}
- Sound alerts per §9
- Handle offline state (banner + fallback print)

Return: single self-contained file with sub-components it owns.
```

---

## 14. Checklist trước khi code KDS

- [ ] Stack: Jetpack Compose / Flutter / RN? (khuyến nghị **Compose** cho tablet Android dedicated; **Flutter** nếu muốn cross-platform iPad)
- [ ] Tablet reference: 10" (1280×800) hay 15" all-in-one? Ảnh hưởng grid 3 vs 4 col
- [ ] Bump bar phím cứng: có dùng không? SDK nào (Epson KBD, generic USB HID)?
- [ ] Printer dự phòng cùng nhà sản xuất với máy in bill? (giảm SKU quản lý)
- [ ] Sound files: ai thu? (hoặc dùng free stock từ Mixkit / Freesound?)
- [ ] Confirm với BE mô hình `KitchenTicket` và station routing ở §10 — có đồng ý tách sub-ticket per station?
- [ ] Max số station cùng lúc? (ảnh hưởng Station Picker layout)
- [ ] Policy `Recall` window — 30s có hợp lý? (có nhà hàng muốn 60s)
- [ ] Escalate khi quá 20': notify ai? (Owner SMS? Dashboard alert? Loa bếp?)
- [ ] Dashboard web có cần màn "KDS overview" (manager xem live ticket mọi station từ xa) không?

Chốt §14 trước khi prompt hoặc code để tránh rework.
