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
import Product from "./pages/admin/products";
import Category from "./pages/admin/categories";
import Rating from "./pages/admin/ratings";
import Order from "./pages/admin/orders";
import Return from "./pages/admin/returns";
import Discount from "./pages/admin/discounts";
import Voucher from "./pages/admin/vouchers";
import Banner from "./pages/admin/banners";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<App />}>
          <Route path="" element={<Dashboard />} />
          <Route path="users" element={<User />} />
          <Route path="products" element={<Product />} />
          <Route path="categories" element={<Category />} />
          <Route path="ratings" element={<Rating />} />
          <Route path="orders" element={<Order />} />
          <Route path="returns" element={<Return />} />
          <Route path="discounts" element={<Discount />} />
          <Route path="vouchers" element={<Voucher />} />
          <Route path="banners" element={<Banner />} />
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
