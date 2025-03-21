// AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
  ManageUser,
} from "./pages/admin";
import ManageProduct from "./pages/admin/products";
import ManageCategory from "./pages/admin/categories";
import ManageRating from "./pages/admin/ratings";
import ManageOrder from "./pages/admin/orders";
import ManageReturn from "./pages/admin/returns";
import ManageDiscount from "./pages/admin/discounts";
import ManageVoucher from "./pages/admin/vouchers";
import ManageBanner from "./pages/admin/banners";
import ManageReason from "./pages/admin/reasons";
import AppUser from "./pages/user/AppUser";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CategoryPage from "./pages/user/categoryPage";
import HomePage from "./pages/user/homePage";
import AddUserForm from "./pages/admin/users/addUser";
import UpdateUserForm from "./pages/admin/users/updateUser";
import DiscountManagerTest from "./components/discounts/ApplyDiscountNew";
import ProductViewHistoryPage from "./pages/user/ProductViewHistoryPage";
import Cart from "./pages/user/cartPage";
import CheckoutPage from "./pages/user/paymentPage";
import OrdersPage from "./pages/user/ordersPage";
import ReturnsPage from "./pages/user/ReturnsPage";
import ManageBrand from "./pages/admin/brands";
import UploadImageTest from "./components/TestUploadFile";
import ReturnRequestPage from "./pages/user/returnPage/ReturnRequestPage";
import ReturnConfirmationPage from "./pages/user/returnPage/ReturnConfirmationPage";
import UserInfoPage from "./pages/user/userPage/userInfo.jsx";
import ReturnDetailPage from "./pages/user/returnPage/ReturnTrackingPage.jsx";
import ReturnHistoryPage from "./pages/user/returnPage/ReturnHistoryPage.jsx";
import ReturnRequestAdmin from "./pages/admin/returns/ReturnRequestAdmin.jsx";
import ProductDetailWrapper from "./components/products/ProductDetailWapper.jsx";
import ManageSupplier from "./pages/admin/suppliers/supplier.jsx";
import ManageStock from "./pages/admin/stocks/stock.jsx";
import SearchPage from "./pages/user/searchPage/SearchPage.jsx";
import AddStockForm from "./pages/admin/stocks/addStock.jsx";
import AdminChatPage from "./pages/admin/supportCustomer/AdminChatPage.jsx";
import UpdateStockForm from "./pages/admin/stocks/updateStock.jsx";
import ManageChatCustomer from "./pages/admin/supportCustomer/ManageChatCustomer.jsx";
import DetailStock from "./pages/admin/stocks/detailStock.jsx";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppUser />}>
          <Route index element={<HomePage />} />
          <Route path="categories/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailWrapper />} />
          <Route path="history" element={<ProductViewHistoryPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="returns" element={<ReturnHistoryPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="returns/request/:orderId" element={<ReturnRequestPage />} />
          <Route path="returns/confirmation/:returnId" element={<ReturnConfirmationPage />} />
          <Route path="returns/detail/:returnId" element={<ReturnDetailPage />} />
          <Route path="profile" element={<UserInfoPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Giao diện Admin */}
        <Route path="/admin" element={<App />}>
          <Route path="" element={<Dashboard />} />
          <Route path="users" element={<ManageUser />} />
          <Route path="users/add" element={<AddUserForm />} />
          <Route path="users/edit/:userName" element={<UpdateUserForm />} />
          <Route path="products" element={<ManageProduct />} />
          <Route path="categories" element={<ManageCategory />} />
          <Route path="suppliers" element={<ManageSupplier />} />
          <Route path="stockimports" element={<ManageStock />} />
          <Route path="stockimports/detail/:stockImportId" element={<DetailStock />} />
          <Route path="stockimports/add" element={<AddStockForm />} />
          <Route path="stockimports/edit/:stockImportId" element={<UpdateStockForm />} />
          <Route path="ratings" element={<ManageRating />} />
          <Route path="orders" element={<ManageOrder />} />
          <Route path="returns" element={<ManageReturn />} />
          <Route path="returns/detail/:returnId" element={<ReturnRequestAdmin />} />
          <Route path="chats" element={<ManageChatCustomer />} />
          <Route path="chats/:userId/:userName" element={<AdminChatPage />} />
          <Route path="reasons" element={<ManageReason />} />
          <Route path="discounts" element={<ManageDiscount />} />
          <Route path="vouchers" element={<ManageVoucher />} />
          <Route path="banners" element={<ManageBanner />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="form" element={<Form />} />
          <Route path="brands" element={<ManageBrand />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="bar" element={<Bar />} />
          <Route path="pie" element={<Pie />} />
          <Route path="stream" element={<Stream />} />
          <Route path="line" element={<Line />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="geography" element={<Geography />} />
          <Route path="test" element={<UploadImageTest />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
