import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GetOrderByUser, CancelOrder, RePay } from "../../services/orderService";

const OrderItem = ({ item }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
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
        onClick={() => handleNavigate(`/product/${item.productId}`)}
        style={{ cursor: "pointer", width: "80px", height: "80px", objectFit: "cover" }}
      />
      <Box sx={{ flex: 1, marginLeft: "16px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">{item.productName || "Sản phẩm không có tên"}</Typography>
          <Button
            variant="text"
            color="primary"
            sx={{ opacity: 0.5, fontSize: "0.8rem" }}
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
};

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

const getPaymentStatusLabel = (paymentStatus) => {
  switch (paymentStatus) {
    case "pending":
      return "Chờ thanh toán";
    case "paid":
      return "Đã thanh toán";
    case "refund":
      return "Hoàn tiền";
    default:
      return "Đã hủy";
  }
};

const getPaymentMethodLabel = (paymentMethod) => {
  switch (paymentMethod) {
    case "cod":
      return "Tiền mặt";
    case "vnpay":
      return "Chuyển khoản";
    default:
      return "Đã hủy";
  }
};

const ViewUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({ type: "all", value: "all" });

  const handleFilterClick = (filterItem) => {
    if (filterItem.type === "payment") {
      setSelectedFilter({ type: "payment", value: filterItem.value });
    } else {
      setSelectedFilter({ type: "status", value: filterItem.value });
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await GetOrderByUser();
        setOrders(response.data);
      } catch (err) {
        setError("Không thể lấy dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      try {
        await CancelOrder(orderId);
        alert("Đơn hàng đã được hủy thành công!");

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      } catch (err) {
        console.error("Lỗi khi hủy đơn hàng:", err);
        alert("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
      }
    }
  };

  const handleRePay = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn thanh toán lại đơn hàng này không?")) {
      try {
        const response = await RePay(orderId);

        console.log("API Response:", response);
        if (response?.data?.paymentUrl) {
          window.open(response.data.paymentUrl, "_blank");
        } else {
          throw new Error("Không tìm thấy URL thanh toán.");
        }
      } catch (err) {
        console.error("Lỗi khi tái thanh toán đơn hàng:", err);
        alert(err.message || "Không thể tái thanh toán đơn hàng. Vui lòng thử lại sau.");
      }
    }
  };

  if (loading) return <Typography>Đang tải dữ liệu đơn hàng...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const filteredOrders =
    selectedFilter.type === "payment"
      ? orders.filter(order => order.paymentStatus === selectedFilter.value)
      : selectedFilter.value === "all"
        ? orders
        : orders.filter(order => order.status === selectedFilter.value);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "nowrap",
          justifyContent: "center",
          overflowX: "auto",
        }}
      >
        {[
          { label: "Tất cả", value: "all", type: "status" },
          { label: "Đang chuẩn bị", value: "pending", type: "status" },
          { label: "Đã hoàn thành", value: "successed", type: "status" },
          { label: "Đang vận chuyển", value: "shipping", type: "status" },
          { label: "Trả hàng", value: "return", type: "status" },
          { label: "Đã hủy", value: "cancelled", type: "status" },
          { label: "Chờ thanh toán", value: "pending", type: "payment" },
          { label: "Đã thanh toán", value: "paid", type: "payment" },
        ].map((filterItem) => (
          <Button
            key={filterItem.value}
            variant={
              (selectedFilter.type === filterItem.type && selectedFilter.value === filterItem.value)
                ? "contained"
                : "outlined"
            }
            onClick={() => handleFilterClick(filterItem)}
            sx={{
              fontSize: "0.7rem",
              fontWeight: "bold",
              backgroundColor:
                selectedFilter.type === filterItem.type && selectedFilter.value === filterItem.value
                  ? "#1976d2" // Màu xanh khi được chọn
                  : "#fff", // Nền trắng khi không được chọn
              color:
                selectedFilter.type === filterItem.type && selectedFilter.value === filterItem.value
                  ? "#fff"
                  : "#1976d2",
              border: "1px solid #1976d2",
              "&:hover": {
                backgroundColor: "#1565c0", // Màu xanh đậm hơn khi hover
                color: "#fff",
              },
            }}
          >
            {filterItem.label}
          </Button>
        ))}
      </Box>

      {filteredOrders.length === 0 ? (
        <Typography sx={{ fontSize: "1.2rem", textAlign: "center", margin: "20px 0" }}>
          Không có đơn hàng nào phù hợp!
        </Typography>
      ) : (
        filteredOrders.map((order) => (
          <Box
            key={order.orderId}
            sx={{
              borderRadius: "8px",
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              position: "relative"
            }}
          >
            <Box sx={{ position: "absolute", top: "16px", right: "16px", textAlign: "right" }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color:
                    order.status === "pending"
                      ? "orange"
                      : order.status === "successed"
                        ? "green"
                        : order.status === "shipping"
                          ? "blue"
                          : order.status === "return"
                            ? "red"
                            : "gray",
                }}
              >
                {getStatusLabel(order.status)}
              </Typography>

              <Typography sx={{ color: "gray", fontStyle: "italic" }}>
                Tình trạng thanh toán: {getPaymentStatusLabel(order.paymentStatus)}
              </Typography>

              <Typography sx={{ color: "gray", fontStyle: "italic" }}>
                Phương thức thanh toán: {getPaymentMethodLabel(order.paymentMethod)}
              </Typography>
            </Box>

            <Typography sx={{ marginBottom: "8px" }}>
              Người nhận: {order.fullName}
            </Typography>
            <Typography sx={{ marginBottom: "8px" }}>
              Địa chỉ: {order.address}
            </Typography>
            <Typography sx={{ marginBottom: "8px" }}>
              Ngày đặt: {new Date(order.timeStamp).toLocaleDateString("en-GB")}
            </Typography>
            <Box sx={{ marginBottom: "16px" }}>
              {order.orderItems.map((item) => (
                <OrderItem key={item.orderItemId} item={item} />
              ))}
            </Box>
            <Typography sx={{ marginBottom: "8px", fontWeight: "bold" }}>
              Tổng tiền: {order.total.toLocaleString()} đ
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCancelOrder(order.orderId)}
                disabled={order.status === "cancelled" || order.status === "successed"}
              >
                Hủy đơn hàng
              </Button>
              {order.paymentMethod === "vnpay" && order.paymentStatus === "pending" ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRePay(order.orderId)}
                >
                  Thanh toán lại
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate(`/returns/request/${order.orderId}`)}
                  disabled={order.status !== "successed"}
                >
                  Trả hàng
                </Button>
              )}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};
