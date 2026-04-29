# Kopag POS Mobile — Luồng & State Machine (cho Android dev)

- **Version:** 0.1.0 (2026-04-17)
- **Mục tiêu:** tài liệu này KHÔNG tả UI (đã có ở [`pos-android-screens.md`](./pos-android-screens.md)). Tài liệu này mô tả **flow giữa các màn, state machine, data passing, offline behavior, hardware integration** — để Android dev chuyển sang code nhanh.
- **Target stack đề xuất:** Jetpack Compose + Hilt + Apollo Kotlin + Room + WorkManager + OkHttp
- **Related:**
  - UI spec: [`pos-android-screens.md`](./pos-android-screens.md)
  - API: [`schema.graphql`](./schema.graphql) + [`api-spec.md`](./api-spec.md)
  - Web preview: [`src/pages/mobile/`](../src/pages/mobile/) — mở `http://localhost:5173/mobile` để xem UI mẫu

---

## 0. Tech stack khuyến nghị

| Layer | Library | Lý do |
|---|---|---|
| UI | **Jetpack Compose** + Material3 | Declarative, reuse logic waiter/KDS |
| DI | **Hilt** | Google chuẩn, scope rõ |
| GraphQL | **Apollo Kotlin 4+** | Codegen from `schema.graphql`, support normalized cache + WS subscription |
| Local DB | **Room** | Offline queue, menu cache, pending mutations |
| Background | **WorkManager** | Retry sync, printer queue |
| Navigation | **Navigation-Compose** (type-safe routes) | Safe args, back-stack quản lý tốt |
| Network | **OkHttp** + **okio** | HTTP base cho Apollo + raw socket ESC/POS |
| Printer | **escpos-coffee** (Java) hoặc custom ByteBuffer → Socket | ESC/POS qua WiFi port 9100 |
| QR | **ZXing Android Embedded** (nếu cần scan) | Guest không cần (waiter không scan) |
| Push | **Firebase FCM** | Escalation noti, cross-terminal announce |
| Biometric / PIN | **BiometricPrompt** + custom PIN composable | Ưu tiên PIN (shared device) |
| Crash/Log | **Sentry** | Offline buffering built-in |
| JSON | **kotlinx.serialization** | Reuse DTO from Apollo |

---

## 1. Navigation graph

### 1.1. Route table

```kotlin
sealed class Route(val path: String) {
    object Splash          : Route("splash")
    object Login           : Route("login")                    // full email/password fallback
    object PinLock         : Route("pin-lock")                 // re-auth per shift / idle
    object Home            : Route("home")                     // tables + orders tabs
    data class TableDetail(val id: String) : Route("table/{id}")
    data class Menu(val orderId: String)   : Route("menu?orderId={orderId}")
    object ModifierSheet   : Route("modifier")                 // bottom sheet, not a full route
    data class Cart(val orderId: String)   : Route("cart?orderId={orderId}")
    data class BillPreview(val orderId: String) : Route("bill?orderId={orderId}")
    data class Split(val orderId: String)  : Route("bill/split?orderId={orderId}")
    data class Payment(val orderId: String): Route("payment?orderId={orderId}")
    data class CashPay(val orderId: String, val amount: Long) : Route("pay/cash?orderId={orderId}&amt={amount}")
    data class QrPay(val intentId: String) : Route("pay/qr?intent={intentId}")
    data class PaymentSuccess(val billId: String) : Route("pay/success?billId={billId}")
    object History         : Route("history")
    object Settings        : Route("settings")
    object Notifications   : Route("notifications")
    object Reservation     : Route("reservation")              // terminal activation
}
```

### 1.2. Graph (who → where)

```
              Splash
                ↓ (config ok + refreshToken ok)
              PinLock ←─── (idle 2' auto) ─── from anywhere
                ↓ PIN ok
              Home
               ├─→ TableDetail(id) ──→ Menu(orderId) ←→ ModifierSheet
               │                           ↓ (1+ item)
               │                         Cart(orderId) ←── addItems ──
               │                           ↓ "Thanh toán"
               │                         BillPreview(orderId)
               │                           ↓ "Chia bill"
               │                         Split(orderId) ── (tạo N SplitBill)
               │                           ↓ "Chọn phương thức"
               │                         Payment(orderId)
               │                           ├─→ CashPay → Success
               │                           ├─→ QrPay(intentId) → Success (auto)
               │                           └─→ card SDK → Success
               │                                               ↓
               │                                        Home (clear context)
               ├─→ OrderDetail (tap đơn đang chạy) ──→ Cart / Bill
               ├─→ History
               ├─→ Settings
               └─→ Notifications
```

### 1.3. Back-stack rules

| Từ | Action | Back-stack behavior |
|---|---|---|
| PaymentSuccess → Home | "Xong" button | `popUpTo(Home) { inclusive = false }` — clear order flow, không cho back |
| QrPay → Payment | User manual back | Poll intent tiếp background, nếu SUCCESS hiện toast "Đã nhận tiền cho đơn cũ" |
| PinLock | Idle timeout from any screen | KHÔNG lưu stack cũ, sau unlock về Home |
| Splash | Cold start | Replace, không cho back |
| BillPreview → Cart | Back | Giữ bill state; nếu user đã split và back → huỷ split (confirm dialog) |

---

## 2. App bootstrap & auth flow

### 2.1. Cold start sequence

```
[App.onCreate]
  ↓
[SplashViewModel]
  1. Load SharedPreferences:
       • terminalId (device đã register)
       • refreshToken (encrypted)
       • lastUserId
       • cachedMenuVersion
  2. Check mandatory config:
       IF terminalId = null → navigate to Reservation (activation code flow)
       IF refreshToken = null → navigate to Login
       ELSE: try refreshSession() (timeout 3s)
          ok   → navigate to PinLock
          fail → navigate to Login
  3. Trong background:
       • Subscribe FCM topic "terminal.{terminalId}"
       • Start WorkManager sync job (if pending mutations)
       • Prefetch menu if cache > 1h old
```

### 2.2. Reservation (terminal activation) — one-time

```
Reservation Screen
  User nhập activation code 6-digit (từ dashboard admin)
  → mutation registerTerminal(code)
      → trả terminalId + cert + apiBaseUrl
  Lưu vào EncryptedSharedPreferences
  Navigate → Login
```

### 2.3. PinLock flow

```
PinLockViewModel
  State: enteringPin / verifying / error(attempts) / locked
  
  On keypad input:
    append digit → if length == 6 → submit
  
  On submit:
    1. Try verify offline first:
         hashedPin = Argon2id(pin, salt=terminalId)
         match với cache local từ last successful login
         IF match AND refreshToken unexpired → navigate Home
    2. ELSE online verify:
         mutation verifyPin(terminalId, pin) → { accessToken, viewer }
         Save viewer + cache hashedPin
         Navigate Home
    3. IF fail 3 lần → delay 10s trước nhập tiếp
    4. IF fail 5 lần → Lock state (gửi event lên server, yêu cầu supervisor)
```

### 2.4. Auto-lock trigger

```kotlin
// ActivityLifecycleCallback hoặc DisposableEffect ở Compose root
val idleTimer = remember { CountDownLatch(2 * 60 * 1000) }

LaunchedEffect(Unit) {
    snapshotFlow { lastUserInteraction.value }
        .debounce(2.minutes)
        .collect {
            navController.navigate(Route.PinLock.path) {
                popUpTo(0)  // clear everything
            }
        }
}
```

Intercept `onTouchEvent` ở root để reset timer.

---

## 3. Order lifecycle — happy path

### 3.1. State machine tổng

```
       [NONE] ──── user tap table ────→ [CREATING]
         ↑                                    ↓
         │                          mutation createOrder
         │                                    ↓
         │                              [OPEN_EMPTY]
         │                                    ↓
         │                          user adds items (local)
         │                                    ↓
         │                              [OPEN_DRAFT]
         │                                    ↓
         │                          "Gửi bếp"
         │                                    ↓
         │                          mutation addOrderItems
         │                          → subscription ticketCreated
         │                                    ↓
         │                              [IN_KITCHEN]
         │                          (nhận ticketUpdated liên tục)
         │                                    ↓
         │                          "Thanh toán" → BillPreview
         │                                    ↓
         │                              [AWAITING_PAYMENT]
         │                                    ↓
         │                          CashPay / QrPay / Card
         │                                    ↓
         │                          mutation checkoutOrder
         │                                    ↓
         │                              [PAID]
         │                                    ↓
         │                          "Xong" → clear
         └────────────────────────── [NONE]
```

### 3.2. Create order — từ Home

```kotlin
// HomeViewModel
fun onTableClick(table: Table) {
    if (table.status == OCCUPIED) {
        // bàn đã có order → mở cart của order đó
        val existingOrderId = table.currentOrderId ?: return
        navigator.navigate(Route.Cart(existingOrderId))
    } else {
        navigator.navigate(Route.TableDetail(table.id))
    }
}

// TableDetailViewModel
fun startOrder(customerName: String, guests: Int, mode: ServiceMode) {
    viewModelScope.launch {
        val result = apollo.mutation(CreateOrderMutation(
            tableId = table.id,
            customerName = customerName,
            mode = mode,
        )).execute()
        
        result.data?.createOrder?.let { order ->
            // cache order vào Room để offline view
            orderDao.upsert(order.toEntity())
            // navigate Menu với orderId
            navigator.navigate(Route.Menu(order.id))
        }
    }
}
```

### 3.3. Add items — "cart pending" trước khi gửi bếp

**Quan trọng:** items mới thêm KHÔNG gửi BE ngay. Local state cho đến khi waiter bấm "Gửi bếp".

```kotlin
// CartViewModel
private val _pendingItems = MutableStateFlow<List<PendingItem>>(emptyList())
val pendingItems = _pendingItems.asStateFlow()

// Khi waiter ở màn Menu tap món → thêm vào pending
fun addPendingItem(menuItem: MenuItem, modifiers: List<String>, note: String?) {
    _pendingItems.update { it + PendingItem(menuItem, modifiers, note) }
}

// Khi tap "Gửi bếp"
fun sendToKitchen() {
    viewModelScope.launch {
        val items = _pendingItems.value.map { it.toInput() }
        
        apollo.mutation(AddOrderItemsMutation(orderId, items)).execute()
        
        // Clear pending, rely on subscription để update "sent" section
        _pendingItems.value = emptyList()
        
        // Auto print kitchen ticket
        printerService.printKitchen(order, items)
    }
}
```

### 3.4. Receive kitchen status update (realtime)

```kotlin
// Subscribe ngay khi order được mở
val ticketUpdates: Flow<Ticket> = apollo
    .subscription(TicketUpdatedSubscription(orderId))
    .toFlow()
    .map { it.data?.ticketUpdated?.toDomain() }
    .filterNotNull()

// Trong CartViewModel
ticketUpdates.collect { ticket ->
    when (ticket.status) {
        READY -> {
            notificationService.showReady(ticket)
            playSound(R.raw.chime)
            vibrator.vibrate(doublePulse)
        }
        PREPARING -> updateItemBadge(ticket)
        VOIDED -> showToast("Bàn ${order.tableName} huỷ món ${ticket.itemName}")
    }
}
```

### 3.5. Checkout flow

```
BillPreview
  User chỉnh discount/tip/voucher (local state)
  ↓ "Chia bill" (optional) → Split
  ↓ "Chọn phương thức" → Payment

Payment
  User chọn phương thức:
    ├─ CASH → CashPay
    ├─ QR   → mutation createPaymentIntent → QrPay(intentId)
    ├─ CARD → BLE card reader SDK
    └─ SPLIT (partial) → lặp payment cho đến khi đủ

CashPay
  Input số tiền bằng numpad → confirm
  → mutation checkoutOrder(orderId, CASH, cashReceived)
  → PaymentSuccess(billId)

QrPay
  Hiện QR (từ paymentIntent.qrData)
  Subscribe paymentIntentStatus(intentId):
    PENDING → loop
    SUCCESS → navigate PaymentSuccess
    FAILED  → dialog "Thanh toán thất bại, thử lại?"
    EXPIRED → dialog "QR hết hạn, tạo mới?"
  
  Nếu user manual back:
    subscription vẫn chạy background (5 phút)
    Nếu paid sau đó → local noti "Đơn #1234 đã thanh toán"

PaymentSuccess
  Hiện check animation, print options
  "In bill" → PrinterService.printBill(billId)
  "Email/SMS" → mutation sendReceipt(billId, channel, recipient)
  "Xong" → Home
```

---

## 4. State machines quan trọng

### 4.1. Order status

```
     CREATE    ADD_ITEMS    SEND_KITCHEN    ALL_READY       CHECKOUT
NONE ──────→ DRAFT ────→ DRAFT ───────→ IN_KITCHEN ─────→ READY ─────→ PAID
              ↑ ↓                         ↓                   ↓
          (edit lines)                VOIDED(partial)   refund? → VOIDED
```

### 4.2. Payment intent (for QR)

```
     create()       bank confirm     
NONE ──────→ PENDING ─────────────→ SUCCESS (auto navigate)
                ↓                          ↓
            user cancel              server webhook
                ↓                          ↓
            VOIDED                   (idempotent: nếu đã PAID
                                      thì callback thứ 2 bỏ qua)
            ↓
          expiry 5'
            ↓
          EXPIRED
```

### 4.3. Sync state (per mutation)

```
     enqueue       retry success
LOCAL ──────→ QUEUED ────────────→ SYNCED
                ↓                       ↓
            retry fail             delete from queue
                ↓
            BACKOFF (2s, 4s, 8s, max 60s)
                ↓ (max 30 attempts)
            STALE → alert user
```

---

## 5. Realtime subscriptions — channel design

| Screen active | Subscribe | Unsubscribe |
|---|---|---|
| Home | `orderUpdated`, `tableUpdated` | onPause/leaveScreen |
| Cart (orderId) | `ticketUpdated(orderId)`, `orderUpdated(id=orderId)` | Leave screen |
| BillPreview | `orderUpdated(id=orderId)` | Leave |
| QrPay (intentId) | `paymentIntentUpdated(intentId)` | **keep alive 5'** dù user back |
| Notifications drawer | `notificationReceived` | Always-on (app-scoped) |
| Settings | — | — |

**Cảnh báo:** Apollo Kotlin WebSocket default reconnect khi mất mạng 30s. Override nếu cần:

```kotlin
val apolloClient = ApolloClient.Builder()
    .httpServerUrl("https://api.kopag.vn/graphql")
    .subscriptionNetworkTransport(
        WebSocketNetworkTransport.Builder()
            .serverUrl("wss://api.kopag.vn/graphql")
            .reopenWhen { throwable, attempt ->
                delay(min(1000 * (1L shl attempt), 60_000))  // exponential
                true
            }
            .build()
    )
    .build()
```

---

## 6. Offline behavior — bắt buộc

### 6.1. Principle

- **Read**: serve từ Room cache trước, gọi network để refresh
- **Write**: optimistic UI ngay, queue mutation vào Room, sync khi online
- **Payment**: QR **require online**, CASH **được phép offline** với local bill code

### 6.2. Room schema cho queue

```kotlin
@Entity
data class PendingMutation(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val orderId: String?,
    val type: MutationType,         // CREATE_ORDER, ADD_ITEMS, CHECKOUT, ...
    val payloadJson: String,        // kotlinx.serialization
    val attemptCount: Int = 0,
    val nextRetryAt: Long,          // epoch ms
    val createdAt: Long = System.currentTimeMillis(),
    val status: SyncStatus = QUEUED,
)

enum class MutationType { CREATE_ORDER, ADD_ITEMS, UPDATE_LINE, CHECKOUT, SPLIT, MOVE_TABLE, ... }
enum class SyncStatus { QUEUED, SYNCING, SYNCED, STALE }
```

### 6.3. Sync worker

```kotlin
@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted ctx: Context,
    @Assisted params: WorkerParameters,
    private val pendingDao: PendingMutationDao,
    private val apollo: ApolloClient,
) : CoroutineWorker(ctx, params) {
    
    override suspend fun doWork(): Result {
        val due = pendingDao.getDue(System.currentTimeMillis())
        
        for (p in due) {
            try {
                pendingDao.update(p.copy(status = SYNCING))
                
                val result = when (p.type) {
                    CREATE_ORDER -> apollo.mutation(...)
                    ADD_ITEMS    -> apollo.mutation(...)
                    CHECKOUT     -> apollo.mutation(...)
                    ...
                }
                
                if (result.data != null) {
                    pendingDao.delete(p.id)
                    // Remap local tempId → server id in related rows
                    idRemapper.apply(p.id, result.data.id)
                } else {
                    throw ApolloException(result.errors.toString())
                }
            } catch (e: Exception) {
                val backoff = (2.0.pow(min(p.attemptCount, 5)) * 1000).toLong()
                pendingDao.update(p.copy(
                    attemptCount = p.attemptCount + 1,
                    nextRetryAt = System.currentTimeMillis() + backoff,
                    status = if (p.attemptCount >= 30) STALE else QUEUED,
                ))
            }
        }
        
        return Result.success()
    }
}
```

### 6.4. ID mapping (temp → server)

Tạo order offline → `tempId = local-${UUID}`. Sau sync, server trả `realId`. Mọi row liên quan (pending items, cart lines) phải remap:

```kotlin
class IdRemapper(private val db: AppDb) {
    suspend fun apply(tempId: String, realId: String) = db.withTransaction {
        db.orderDao().remap(tempId, realId)
        db.pendingMutationDao().remap(tempId, realId)
        db.cartDao().remap(tempId, realId)
    }
}
```

### 6.5. UI indicators

- **Banner top** khi offline: màu amber, "Mất kết nối · N thao tác đang chờ"
- **Badge trên nút cloud** ở Settings: số queue pending
- Trên từng line item: icon đồng hồ nhỏ nếu chưa sync

---

## 7. Hardware integrations

### 7.1. WiFi thermal printer (ESC/POS)

```kotlin
class EscPosPrinter(private val host: String, private val port: Int = 9100) {
    suspend fun printBill(bill: Bill) = withContext(Dispatchers.IO) {
        Socket(host, port).use { socket ->
            socket.soTimeout = 5_000
            val out = socket.getOutputStream()
            
            // Initialize
            out.write(byteArrayOf(0x1B, 0x40))  // ESC @
            
            // Header
            out.write(byteArrayOf(0x1B, 0x61, 0x01))  // center align
            out.write("KOPAG RESTO\n".toByteArray(Charsets.UTF_8))
            out.write(byteArrayOf(0x1B, 0x21, 0x00))  // normal font
            
            // Line items
            for (item in bill.items) {
                out.write(formatItem(item))
            }
            
            // Total
            out.write(formatTotal(bill.total))
            
            // QR cho receipt lookup
            out.write(buildQrCommand(bill.receiptUrl))
            
            // Cut
            out.write(byteArrayOf(0x1D, 0x56, 0x42, 0x00))  // partial cut
            
            out.flush()
        }
    }
}
```

- **Fallback offline**: nếu socket fail, cache bill PDF ở local và queue printer job via WorkManager
- **Vietnamese characters**: codepage CP1258 (Vietnamese Windows) hoặc UTF-8 nếu printer hỗ trợ; Xprinter ESC/POS thường cần `ESC t 16` trước text

### 7.2. BLE card reader (VNPAY / SumUp SDK)

Thường qua native SDK nhà cung cấp. Wrap interface:

```kotlin
interface CardReaderService {
    suspend fun pair(): CardReader
    suspend fun charge(amount: Decimal, orderId: String): CardChargeResult
}

sealed class CardChargeResult {
    data class Success(val transactionId: String, val authCode: String) : CardChargeResult()
    data class Declined(val reason: String) : CardChargeResult()
    data class Canceled(val byUser: Boolean) : CardChargeResult()
    object DeviceDisconnected : CardChargeResult()
}
```

Màn CardPay sẽ observe Flow<CardChargeStatus> trong khi SDK chạy, hiển thị prompt "Vui lòng đưa thẻ/tap" tới khi done.

### 7.3. Notifications

**FCM topic:**

| Topic | Who subscribes | Purpose |
|---|---|---|
| `terminal.{terminalId}` | Mọi device | System-wide announce (downtime, menu update) |
| `waiter.{userId}` | Waiter đang login | Escalation, assigned orders |
| `kitchen.{stationId}` | KDS device | (Android không xử lý, chỉ reference) |

Local noti (không qua FCM) dùng khi:
- Món ready (từ subscription `ticketUpdated`)
- Sync thành công/thất bại (Settings cloud)
- Customer at table X called staff (từ `staffCalled` subscription)

---

## 8. Implementation checklist — per screen

### 8.1. PIN Login

- [ ] Auto-submit khi đủ 6 số
- [ ] Shake animation khi sai (+ rung nhẹ)
- [ ] Cache last user (tên) cho quick re-login
- [ ] Fallback full Login khi "Đổi tài khoản"
- [ ] Lock sau 5 lần sai + gửi event lên server
- [ ] Biometric secondary (optional): nếu device có FP → offer sau 1 lần nhập PIN

### 8.2. Home

- [ ] Pull-to-refresh reload tables + orders
- [ ] Subscription `tableUpdated` live update status
- [ ] Badge count "ready" orders trên tab
- [ ] FAB "Mang đi" = createOrder với tableId=null
- [ ] Kiosk intent: offline mock tables từ Room cache

### 8.3. Menu Browser

- [ ] Menu cache trong Room, version check từ `menuVersion` query (nhỏ) trước khi refetch full
- [ ] Grid lazy load với placeholder shimmer
- [ ] Modifier sheet: lưu unsaved state khi dismiss (alert)
- [ ] Quick-add button = thêm với modifier default
- [ ] Item unavailable live update từ subscription

### 8.4. Cart Review

- [ ] 2 section: **Đã gửi** (readonly) vs **Chưa gửi** (editable)
- [ ] "Gửi bếp" disable nếu 0 món chưa gửi
- [ ] Swipe-to-delete line chưa gửi
- [ ] Void món đã gửi: dialog + supervisor PIN + reason
- [ ] Auto print kitchen ticket sau "Gửi bếp" thành công

### 8.5. Bill Preview

- [ ] Discount logic: % vs fixed, authorize nếu >15%
- [ ] Voucher: real-time validate (`validateVoucher` query) trước apply
- [ ] Loyalty lookup SĐT: debounce 400ms
- [ ] Service charge auto-add (configurable per restaurant)
- [ ] Split → navigate riêng, giữ context bill-preview trong ViewModel scoped

### 8.6. Payment

- [ ] Method list ẩn card nếu chưa pair reader
- [ ] "Chia nhiều" mở UI chọn 2 methods, loop
- [ ] Polling khi QR: visibility KEEP_SCREEN_ON
- [ ] Success: clear order context, `popUpTo(Home)`, sound + haptic

### 8.7. Settings

- [ ] Printer list: probe connection khi add (test print 1 dòng)
- [ ] Language toggle persists ngay
- [ ] Logout: clear refreshToken + DB + navigate Login
- [ ] About: version info, terminalId (copy-able)

---

## 9. Test scenarios

### 9.1. Happy path

```
1. Open app → Splash → PinLock → Home
2. Tap Table A3 → TableDetail → "Bắt đầu order"
3. Menu → add 3 items
4. Cart → "Gửi bếp" → toast "Đã gửi"
5. Ticket subscription → món ready → noti
6. "Thanh toán" → BillPreview → apply voucher → "Tiền mặt"
7. CashPay → input 400 → confirm
8. Success → print → "Xong" → Home
```

### 9.2. Critical edge cases

| Scenario | Expected |
|---|---|
| Mất mạng giữa lúc tạo order | Order vào queue, UI hiện "Đang đồng bộ" badge, sau online tự sync |
| 2 waiter cùng tap Table A3 | Race condition — ai gửi `createOrder` trước thắng, người sau thấy bàn đã occupied, toast "Vừa bị chiếm" |
| User nhấn Home trong lúc QR đang poll | Dialog "Có đơn đang thanh toán — thoát?", nếu thoát vẫn poll background |
| Printer offline khi "Gửi bếp" | Vẫn submit mutation, show "In thất bại - retry" snackbar + queue job |
| App killed giữa chừng | Resume với order drafting được load từ Room cart cache |
| Token expired giữa mutation | Apollo auto-refresh, nếu refresh fail → force PinLock |
| Supervisor PIN wrong 3 lần khi void | Hiện dialog "Liên hệ quản lý", disable nút trong 10s |
| Ticket subscription disconnect 30s | Reconnect + re-fetch snapshot để bắt các event đã miss |

### 9.3. Load test recommendations

- **Menu 500 items** — scroll phải smooth, không drop frame
- **50 open orders** — Home list phải load < 1s
- **Offline 2h** — queue 100 mutations, reconnect phải sync hết trong < 30s
- **Subscription flood** — 10 ticket updates/giây, UI phải throttle không drop

---

## 10. Security checklist

- [ ] **EncryptedSharedPreferences** cho refreshToken, pinHash
- [ ] **Certificate pinning** cho API (chặn MITM)
- [ ] Disable screenshot trên Payment screens (`FLAG_SECURE`)
- [ ] Clipboard: không auto-copy số thẻ, số tiền nhạy cảm
- [ ] Obfuscate release build (R8 + ProGuard rules cho Apollo, Room)
- [ ] Log redaction: KHÔNG log card number, PIN, access token
- [ ] Backup disabled (`android:allowBackup="false"`) để tránh leak credential
- [ ] Root detection (optional cho card reader compliance PCI-DSS)

---

## 11. Performance budgets

| Metric | Target |
|---|---|
| Cold start → Home visible | < 2.5s (P50) |
| Menu grid render | < 500ms với 100 items |
| Tap → navigate transition | < 150ms animation |
| Mutation "Gửi bếp" optimistic UI | < 50ms |
| Room query (menu cache) | < 20ms |
| Subscription event → UI update | < 200ms |
| Print bill job completion | < 3s (WiFi printer) |

---

## 12. File structure đề xuất

```
app/
 ├─ src/main/java/vn/kopag/pos/
 │   ├─ App.kt (Hilt Application)
 │   ├─ ui/
 │   │   ├─ theme/            (Material3 + brand tokens)
 │   │   ├─ components/       (PinKeypad, NumericKeypad, StatusChip,
 │   │   │                     TableCard, OrderRow, MenuItemCard,
 │   │   │                     ModifierSheet, MobileHeader, ...)
 │   │   └─ screens/
 │   │       ├─ splash/
 │   │       ├─ auth/         (PinLock, Login, Reservation)
 │   │       ├─ home/
 │   │       ├─ table/        (TableDetail)
 │   │       ├─ menu/
 │   │       ├─ cart/
 │   │       ├─ bill/         (BillPreview, Split)
 │   │       ├─ payment/      (Picker, Cash, Qr, Success)
 │   │       ├─ history/
 │   │       ├─ settings/
 │   │       └─ notifications/
 │   ├─ data/
 │   │   ├─ graphql/          (Apollo queries, mutations, subscriptions)
 │   │   ├─ local/            (Room entities, DAOs, AppDatabase)
 │   │   ├─ repositories/     (OrderRepository, MenuRepository, ...)
 │   │   └─ sync/             (SyncWorker, IdRemapper)
 │   ├─ domain/
 │   │   ├─ model/            (Order, MenuItem, Bill, Table — pure Kotlin)
 │   │   └─ usecase/          (CreateOrder, SendToKitchen, Checkout, ...)
 │   ├─ hardware/
 │   │   ├─ printer/          (EscPosPrinter, PrinterRegistry)
 │   │   └─ card/             (CardReaderService wrapping SDKs)
 │   ├─ di/                   (Hilt modules)
 │   └─ util/
 │       ├─ money/
 │       ├─ datetime/
 │       └─ network/          (ConnectivityObserver)
 ├─ build.gradle.kts
 └─ proguard-rules.pro
```

---

## 13. Getting started (first 2 tuần)

**Tuần 1:**
- [ ] Project init Compose + Hilt + Apollo
- [ ] Generate Apollo types từ `schema.graphql`
- [ ] Setup navigation + theme (reuse tokens từ `pos-android-screens.md` §1)
- [ ] Build 3 composables cốt lõi: `PinKeypad`, `MenuItemCard`, `TableCard`
- [ ] Hardcode Login/PinLock với mock data

**Tuần 2:**
- [ ] Wire Apollo auth interceptor (JWT)
- [ ] Implement Home screen với mock Repository
- [ ] Room scaffold + 1 entity mẫu (Order)
- [ ] Demo flow: PinLock → Home → TableDetail → Menu (chưa cần BE thật)

Sau đó BE ready → hot-swap mock repositories sang real Apollo calls.

---

## 14. Contact points

| Vấn đề | Who | Artifact |
|---|---|---|
| API schema / mutation chưa đủ | BE lead | [`schema.graphql`](./schema.graphql) — để cập nhật / phát triển |
| UI layout không rõ | Web preview | `/mobile/*` routes trong dashboard project |
| Hardware SDK license | PM | Liên hệ nhà cung cấp (VNPAY, Epson) |
| E-invoice integration | Finance + BE | VNPT / Viettel / MISA contact |

---

## Phụ lục A — Sample code: Apollo setup

```kotlin
// di/NetworkModule.kt
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideApolloClient(
        @ApplicationContext ctx: Context,
        tokenStore: TokenStore,
    ): ApolloClient {
        val cacheFactory = MemoryCacheFactory(maxSizeBytes = 10_000_000)
            .chain(SqlNormalizedCacheFactory(ctx, "apollo.db"))
        
        return ApolloClient.Builder()
            .serverUrl("https://api.kopag.vn/graphql")
            .webSocketServerUrl("wss://api.kopag.vn/graphql")
            .normalizedCache(cacheFactory)
            .addHttpInterceptor(AuthInterceptor(tokenStore))
            .addHttpInterceptor(LoggingInterceptor(HttpLoggingInterceptor.Level.BASIC))
            .webSocketReopenWhen { _, attempt ->
                delay(min(1_000L shl attempt, 60_000))
                true
            }
            .build()
    }
}
```

## Phụ lục B — Sample nav setup

```kotlin
@Composable
fun KopagNavHost(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Route.Splash.path,
    ) {
        composable(Route.Splash.path) { SplashScreen(navController) }
        composable(Route.PinLock.path) { PinLockScreen(navController) }
        composable(Route.Home.path) { HomeScreen(navController) }
        
        composable(
            route = "table/{id}",
            arguments = listOf(navArgument("id") { type = NavType.StringType }),
        ) { entry ->
            TableDetailScreen(
                tableId = entry.arguments!!.getString("id")!!,
                navController = navController,
            )
        }
        
        composable(
            route = "menu?orderId={orderId}",
            arguments = listOf(navArgument("orderId") { type = NavType.StringType }),
        ) { entry ->
            MenuScreen(
                orderId = entry.arguments!!.getString("orderId")!!,
                navController = navController,
            )
        }
        
        // ... rest
    }
}
```

---

**Ưu tiên build:** PinLock → Home → Menu → Cart → Checkout = đủ E2E happy path trong 2 tuần đầu.
