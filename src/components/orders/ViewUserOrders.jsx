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
      src={item.productImage}
      alt={item.productName}
      style={{ width: "80px", height: "80px", objectFit: "cover" }}
    />
    <Box sx={{ flex: 1, marginLeft: "16px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <Typography variant="h6">{item.productName || "Sản phẩm không có tên"}</Typography>
        <Button
          variant="text"
          color="primary"
          sx={{ opacity: 0.5, fornSize: "0.8rem" }}
          href={`/product/${item.productId}`}
        >
          Đánh giá
        </Button>
      </Box>
      <Typography color="text.secondary">
        Giá: {item.price.toLocaleString()} đ x {item.quantity}
      </Typography>
    </Box>
  </Box>
);

const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Đang chuẩn bị";
    case "successed":
      return "Đã hoàn thành";
    case "shipping":
      return "Đang vận chuyển";
    case "return":
      return "Trả hàng";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

const ViewUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await GetOrderByUser();
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
        <Typography sx={{ fontSize: "1.2rem", textAlign: "center", margin: "20px 0" }}>
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
              position: "relative"
            }}
          >
            <Typography
              sx={{
                position: "absolute",
                top: "16px",
                right: "16px",
                fontWeight: "bold",
                color: order.status === "pending" ? "orange" : order.status === "successed" ? "green" : order.status === "shipping" ? "blue" : order.status === "return" ? "red" : "gray"
              }}
            >
              {getStatusLabel(order.status)}
            </Typography>
            <Typography sx={{ marginBottom: "8px" }}>
              Người nhận: {order.fullName}
            </Typography>
            <Typography sx={{ marginBottom: "8px" }}>
              Địa chỉ: {order.address}
            </Typography>
            <Typography sx={{ marginBottom: "8px" }}>
              Ngày đặt: {new Date(order.timeStamp).toLocaleDateString()}
            </Typography>
            <Box sx={{ marginBottom: "16px" }}>
              {order.orderItems.map((item) => (
                <OrderItem key={item.orderItemId} item={item} />
              ))}
            </Box>
            <Typography sx={{ marginBottom: "8px", fontWeight: "bold" }}>
              Tổng tiền: {order.total.toLocaleString()} đ
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ position: "absolute", bottom: "8px", right: "8px" }}
              href={`/return/${order.orderId}`}
            >
              Trả hàng
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ViewUserOrders;
