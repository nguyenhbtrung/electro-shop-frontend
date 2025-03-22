// src/components/orders/ViewUserOrders.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { GetOrderByUser } from "../../services/orderService";

const OrderItem = ({ item }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: "1px solid #ccc",
      padding: "16px",
      marginBottom: "16px",
      borderRadius: "8px",
    }}
  >
    <img
      src={item.productImage || "https://via.placeholder.com/80"}
      alt={item.productName}
      style={{ width: "80px", height: "80px", objectFit: "cover" }}
    />
    <Box sx={{ flex: 1, marginLeft: "16px" }}>
      <Typography variant="h6">{item.productName || "Sản phẩm không có tên"}</Typography>
      <Typography color="text.secondary">
        Giá: {item.price.toLocaleString()} đ x {item.quantity}
      </Typography>
    </Box>
  </Box>
);

const ViewUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await GetOrderByUser();
        console.log("Dữ liệu đơn hàng:", response.data);
        setOrders(response.data);
      } catch (err) {
        setError("Không thể lấy dữ liệu đơn hàng.");
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  if (loading) return <Typography>Đang tải dữ liệu đơn hàng...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {orders.length === 0 ? (
        <Typography
          sx={{ fontSize: "1.2rem", textAlign: "center", margin: "20px 0" }}
        >
          Bạn chưa có đơn hàng nào!
        </Typography>
      ) : (
        orders.map((order) => (
          <Box
            key={order.orderId}
            sx={{
              border: "1px solid #000",
              borderRadius: "8px",
              marginBottom: "24px",
              padding: "16px",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "12px" }}>
              Mã đơn hàng: {order.orderId}
            </Typography>
            <Typography sx={{ marginBottom: "8px" }}>
              Trạng thái: {order.status}
            </Typography>
            <Typography sx={{ marginBottom: "8px" }}>
              Tổng tiền: {order.total.toLocaleString()} đ
            </Typography>
            <Typography sx={{ marginBottom: "8px" }}>
              Ngày đặt: {new Date(order.timeStamp).toLocaleDateString()}
            </Typography>
            <Box sx={{ marginBottom: "16px" }}>
              {order.orderItems.map((item) => (
                <OrderItem key={item.orderItemId} item={item} />
              ))}
            </Box>
            <Button variant="outlined" color="primary">
              Xem chi tiết
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ViewUserOrders;
