import { useEffect, useState } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import { AnimatePresence } from "motion/react"
import Home from "./pages/public/Home"
import Login from "./pages/public/Login"
import Register from "./pages/public/Register"
import ForgotPassword from "./pages/public/ForgotPassword"
import ResetPassword from "./pages/public/ResetPassword"
import Shop from "./pages/public/Shop"
import ProductDetails from "./pages/public/ProductDetails"
import Account from "./pages/customer/Account"
import Checkout from "./pages/customer/Checkout"
import OrderConfirmation from "./pages/customer/OrderConfirmation"
import MyOrders from "./pages/customer/MyOrders"
import OrderDetails from "./pages/customer/OrderDetails"
import PaymentPending from "./pages/customer/PaymentPending"
import AdminDashboard from "./pages/admin/AdminDashboard"
import LoadingScreen from "./components/LoadingScreen"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AdminPayments from "./pages/admin/AdminPayments"
import AdminOrders from "./pages/admin/AdminOrders"
import AdminOrderDetails from "./pages/admin/AdminOrderDetails"
import AdminCancellationRequests from "./pages/admin/AdminCancellationRequests"
import AdminReturnRequests from "./pages/admin/AdminReturnRequests"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminInventory from "./pages/admin/AdminInventory"
import AdminReports from "./pages/admin/AdminReports"

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1700)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* CUSTOMER */}
          <Route
            path="/account"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Account />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/:orderId"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <PaymentPending />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPayments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cancellations"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCancellationRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/returns"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReturnRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminInventory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
