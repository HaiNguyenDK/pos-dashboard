import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/app-shell"
import { AuthLayout } from "@/components/layout/auth-layout"
import { ResetLayout } from "@/components/layout/reset-layout"
import { GuestShell } from "@/components/guest/guest-shell"
import { KdsShell } from "@/components/kds/kds-shell"
import { MobileShell } from "@/components/mobile/mobile-shell"
import { ForgotPasswordPage } from "@/pages/auth/forgot-password"
import { LoginPage } from "@/pages/auth/login"
import { NewPasswordPage } from "@/pages/auth/new-password"
import { RegisterPage } from "@/pages/auth/register"
import { VerifyOtpPage } from "@/pages/auth/verify-otp"
import { WelcomePage } from "@/pages/auth/welcome"
import { DashboardPage } from "@/pages/dashboard"
import { OrdersPage } from "@/pages/orders"
import { HistoryPage } from "@/pages/history"
import { BillsPage } from "@/pages/bills"
import { ProductsPage } from "@/pages/products"
import { ProfilePage } from "@/pages/profile"
import { QueuePage } from "@/pages/queue"
import { BookingsPage } from "@/pages/bookings"
import { InventoryPage } from "@/pages/inventory"
import { HrPage } from "@/pages/hr"
import { ReviewsPage } from "@/pages/reviews"
import { SelectTablePage } from "@/pages/select-table"
import { NotFoundPage } from "@/pages/not-found"
import { MobileIndexPage } from "@/pages/mobile"
import { MobilePinLoginPage } from "@/pages/mobile/pin-login"
import { MobileHomePage } from "@/pages/mobile/home"
import { MobileTableDetailPage } from "@/pages/mobile/table-detail"
import { MobileMenuPage } from "@/pages/mobile/menu"
import { MobileCartPage } from "@/pages/mobile/cart"
import { MobileBillPreviewPage } from "@/pages/mobile/bill-preview"
import { MobileBillSplitPage } from "@/pages/mobile/bill-split"
import { MobilePaymentPage } from "@/pages/mobile/payment"
import { MobileCashPayPage } from "@/pages/mobile/cash-pay"
import { MobileQrPayPage } from "@/pages/mobile/qr-pay"
import { MobilePaymentSuccessPage } from "@/pages/mobile/payment-success"
import { MobileHistoryPage } from "@/pages/mobile/history"
import { MobileSettingsPage } from "@/pages/mobile/settings"
import { MobileNotificationsPage } from "@/pages/mobile/notifications"
import { GuestWelcomePage } from "@/pages/guest/welcome"
import { GuestMenuPage } from "@/pages/guest/menu"
import { GuestCartPage } from "@/pages/guest/cart"
import { GuestPayPage } from "@/pages/guest/pay"
import { GuestSuccessPage } from "@/pages/guest/success"
import { KdsStationPickerPage } from "@/pages/kds"
import { KdsGridPage } from "@/pages/kds/grid"
import { KdsTicketDetailPage } from "@/pages/kds/ticket-detail"
import { KdsSettingsPage } from "@/pages/kds/settings"
import { KdsExpoPage } from "@/pages/kds/expo"
import { KdsAllDayPage } from "@/pages/kds/all-day"
import { PosProvider } from "@/store/pos-context"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ResetLayout />}>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/forgot-password/verify" element={<VerifyOtpPage />} />
          <Route path="/forgot-password/new" element={<NewPasswordPage />} />
          <Route path="/forgot-password/welcome" element={<WelcomePage />} />
        </Route>

        <Route
          element={
            <PosProvider>
              <AppShell />
            </PosProvider>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/select-table" element={<SelectTablePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/hr" element={<HrPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Route>

        <Route element={<MobileShell />}>
          <Route path="/mobile" element={<MobileIndexPage />} />
          <Route path="/mobile/pin-login" element={<MobilePinLoginPage />} />
          <Route path="/mobile/home" element={<MobileHomePage />} />
          <Route path="/mobile/table/:id" element={<MobileTableDetailPage />} />
          <Route path="/mobile/menu" element={<MobileMenuPage />} />
          <Route path="/mobile/cart" element={<MobileCartPage />} />
          <Route path="/mobile/bill" element={<MobileBillPreviewPage />} />
          <Route path="/mobile/bill/split" element={<MobileBillSplitPage />} />
          <Route path="/mobile/payment" element={<MobilePaymentPage />} />
          <Route path="/mobile/pay/cash" element={<MobileCashPayPage />} />
          <Route path="/mobile/pay/qr" element={<MobileQrPayPage />} />
          <Route path="/mobile/pay/success" element={<MobilePaymentSuccessPage />} />
          <Route path="/mobile/history" element={<MobileHistoryPage />} />
          <Route path="/mobile/settings" element={<MobileSettingsPage />} />
          <Route path="/mobile/notifications" element={<MobileNotificationsPage />} />
        </Route>

        <Route element={<GuestShell />}>
          <Route path="/guest/:tableId" element={<GuestWelcomePage />} />
          <Route path="/guest/:tableId/menu" element={<GuestMenuPage />} />
          <Route path="/guest/:tableId/cart" element={<GuestCartPage />} />
          <Route path="/guest/:tableId/pay" element={<GuestPayPage />} />
          <Route path="/guest/:tableId/success" element={<GuestSuccessPage />} />
        </Route>

        <Route element={<KdsShell />}>
          <Route path="/kds" element={<KdsStationPickerPage />} />
          <Route path="/kds/grid" element={<KdsGridPage />} />
          <Route path="/kds/ticket/:id" element={<KdsTicketDetailPage />} />
          <Route path="/kds/settings" element={<KdsSettingsPage />} />
          <Route path="/kds/expo" element={<KdsExpoPage />} />
          <Route path="/kds/all-day" element={<KdsAllDayPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
