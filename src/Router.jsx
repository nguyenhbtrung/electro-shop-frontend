import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
  User,
} from "./pages/admin";
import ManageProduct from "./pages/admin/products";
import ManageCategory from "./pages/admin/categories";
import ManageRating from "./pages/admin/ratings";
import ManageOrder from "./pages/admin/orders";
import ManageReturn from "./pages/admin/returns";
import ManageDiscount from "./pages/admin/discounts";
import ManageVoucher from "./pages/admin/vouchers";
import ManageBanner from "./pages/admin/banners";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<App />}>
          <Route path="" element={<Dashboard />} />
          <Route path="users" element={<User />} />
          <Route path="products" element={<ManageProduct />} />
          <Route path="categories" element={<ManageCategory />} />
          <Route path="ratings" element={<ManageRating />} />
          <Route path="orders" element={<ManageOrder />} />
          <Route path="returns" element={<ManageReturn />} />
          <Route path="discounts" element={<ManageDiscount />} />
          <Route path="vouchers" element={<ManageVoucher />} />
          <Route path="banners" element={<ManageBanner />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="form" element={<Form />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="bar" element={<Bar />} />
          <Route path="pie" element={<Pie />} />
          <Route path="stream" element={<Stream />} />
          <Route path="line" element={<Line />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="geography" element={<Geography />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
//
