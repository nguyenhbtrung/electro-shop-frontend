import React from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import ProductCard from "../../../components/products/ProductCard";
import Footer from "../../../components/Footer";
import { useState } from "react";

const CheckoutPage = () => {
    return (
      <div className="flex justify-between p-6 bg-gray-100 min-h-screen">
        {/* Thông tin nhận hàng */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold">Thông tin nhận hàng</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <input type="email" placeholder="Email" className="border p-2 rounded" />
            <input type="text" placeholder="Họ và tên" className="border p-2 rounded" />
            <input type="text" placeholder="Số điện thoại" className="border p-2 rounded" />
            <input type="text" placeholder="Tỉnh thành" className="border p-2 rounded" />
            <input type="text" placeholder="Quận huyện" className="border p-2 rounded" />
            <input type="text" placeholder="Phường xã" className="border p-2 rounded" />
            <input type="text" placeholder="Số nhà, tên đường" className="col-span-2 border p-2 rounded" />
            <textarea placeholder="Ghi chú (tùy chọn)" className="col-span-2 border p-2 rounded"></textarea>
          </div>
        </div>
  
        {/* Đơn hàng */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold">Đơn hàng (2 sản phẩm)</h2>
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between py-2">
              <span>Chuột không dây Rapoo M310 Silent</span>
              <span>165.000 đ</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Bàn phím cơ Razer BlackWidow V3</span>
              <span>1.590.000 đ</span>
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between py-2">
              <span className="font-semibold">Tạm tính</span>
              <span>1.755.000 đ</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold">Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Tổng cộng</span>
              <span className="text-green-600">1.755.000 đ</span>
            </div>
          </div>
          <button className="w-full bg-green-600 text-white py-2 mt-4 rounded">ĐẶT HÀNG</button>
        </div>
      </div>
    );
  };
  
  export default CheckoutPage;
  