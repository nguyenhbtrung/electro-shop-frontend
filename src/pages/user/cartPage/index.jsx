// src/pages/user/cartPage/index.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { GetUserCart } from "../../../services/CartService";
import ViewUserCart from "../../../components/carts/ViewUserCart";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await GetUserCart();
        console.log("Dữ liệu giỏ hàng:", response.data); // Kiểm tra dữ liệu nhận về từ API
        setCartItems(response.data);
      } catch (err) {
        setError("Không thể lấy dữ liệu giỏ hàng.");
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  if (loading) return <Typography>Đang tải dữ liệu giỏ hàng...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: "800px", margin: "32px auto" }}>
      <ViewUserCart cartItems={cartItems} setCartItems={setCartItems} />
    </Box>
  );
};

export default CartPage;
