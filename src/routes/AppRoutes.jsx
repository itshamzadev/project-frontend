import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import CategoriesPage from "../pages/categories/CategoriesPage.jsx";
import CustomerDetailsPage from "../pages/customers/CustomerDetailsPage.jsx";
import CustomersPage from "../pages/customers/CustomersPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import ForbiddenPage from "../pages/ForbiddenPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import CreateOrderPage from "../pages/orders/CreateOrderPage.jsx";
import EditOrderPage from "../pages/orders/EditOrderPage.jsx";
import OrderDetailsPage from "../pages/orders/OrderDetailsPage.jsx";
import OrdersPage from "../pages/orders/OrdersPage.jsx";
import ProductsPage from "../pages/products/ProductsPage.jsx";
import ProductDetailsPage from "../pages/products/ProductDetailsPage.jsx";
import InventoryReportPage from "../pages/reports/InventoryReportPage.jsx";
import SalesReportPage from "../pages/reports/SalesReportPage.jsx";
import StockMovementsPage from "../pages/stock/StockMovementsPage.jsx";
import StockReceiptsPage from "../pages/stock/StockReceiptsPage.jsx";
import UsersPage from "../pages/users/UsersPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function RolePage({ roles, children }) {
  return (
    <ProtectedRoute>
      <RoleRoute roles={roles}>
        <DashboardLayout>{children}</DashboardLayout>
      </RoleRoute>
    </ProtectedRoute>
  );
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <DashboardPage />
            </ProtectedPage>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedPage>
              <ProductsPage />
            </ProtectedPage>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedPage>
              <ProductDetailsPage />
            </ProtectedPage>
          }
        />
        <Route
          path="/categories"
          element={
            <RolePage roles={["admin"]}>
              <CategoriesPage />
            </RolePage>
          }
        />
        <Route
          path="/customers"
          element={
            <RolePage roles={["sales", "admin"]}>
              <CustomersPage />
            </RolePage>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <RolePage roles={["sales", "admin"]}>
              <CustomerDetailsPage />
            </RolePage>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedPage>
              <OrdersPage />
            </ProtectedPage>
          }
        />
        <Route
          path="/orders/new"
          element={
            <RolePage roles={["sales", "admin"]}>
              <CreateOrderPage />
            </RolePage>
          }
        />
        <Route
          path="/orders/:id/edit"
          element={
            <RolePage roles={["sales", "admin"]}>
              <EditOrderPage />
            </RolePage>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedPage>
              <OrderDetailsPage />
            </ProtectedPage>
          }
        />
        <Route
          path="/stock-receipts"
          element={
            <RolePage roles={["warehouse", "admin"]}>
              <StockReceiptsPage />
            </RolePage>
          }
        />
        <Route
          path="/stock-movements"
          element={
            <RolePage roles={["warehouse", "admin"]}>
              <StockMovementsPage />
            </RolePage>
          }
        />
        <Route
          path="/reports/sales"
          element={
            <RolePage roles={["admin"]}>
              <SalesReportPage />
            </RolePage>
          }
        />
        <Route
          path="/reports/inventory"
          element={
            <RolePage roles={["admin"]}>
              <InventoryReportPage />
            </RolePage>
          }
        />
        <Route
          path="/users"
          element={
            <RolePage roles={["admin"]}>
              <UsersPage />
            </RolePage>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
