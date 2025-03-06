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
  Product
} from "./pages/admin";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<App />}>
          <Route path="" element={<Dashboard />} />
          <Route path="users" element={<User />} />
          <Route path="products" element={<Product />} />
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
