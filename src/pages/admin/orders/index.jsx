import React, { useState, useEffect } from "react";
import { Select, Box, Typography, Button, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GetAllOrder, UpdateOrderStatus, DeleteOrder } from "../../../services/orderService";

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

const getPaymentStatusLabel = (paymentStatus) => {
    switch (paymentStatus) {
        case "pending":
            return "Chờ thanh toán";
        case "paid":
            return "Đã thanh toán";
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

const ViewAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedStatus, setSelectedStatus] = useState({});

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await GetAllOrder();
                setOrders(response.data);
                console.log("Response Data:", response.data);
            } catch (err) {
                setError("Không thể lấy dữ liệu đơn hàng.");
                console.error("Lỗi khi gọi API:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        setSelectedStatus((prev) => ({
            ...prev,
            [orderId]: newStatus,
        }));
    };

    const handleUpdateOrderStatus = async (orderId) => {
        const currentStatus = selectedStatus[orderId];

        try {
            await UpdateOrderStatus(orderId, currentStatus);
            alert("Cập nhật trạng thái đơn hàng thành công!");
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderId === orderId ? { ...order, status: currentStatus } : order
                )
            );
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
            alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) {
            try {
                await DeleteOrder(orderId);
                alert("Đơn hàng đã được xóa thành công!");

                const response = await GetAllOrder();
                setOrders(response.data);
            } catch (err) {
                console.error("Lỗi khi xóa đơn hàng:", err);
                alert("Không thể xóa đơn hàng. Vui lòng thử lại sau.");
            }
        }
    };
    

    if (loading) return <Typography>Đang tải dữ liệu đơn hàng...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ maxWidth: "800px", margin: "32px auto" }}>
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
                        <Box sx={{ position: "absolute", top: "16px", right: "16px", textAlign: "right" }}>
                            <Select
                                value={selectedStatus[order.orderId] || order.status}
                                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                size="small"
                                sx={{
                                    fontWeight: "bold",
                                    minWidth: "150px",
                                    backgroundColor: "#fff",
                                }}
                            >
                                <MenuItem value="pending">Đang chuẩn bị</MenuItem>
                                <MenuItem value="shipping">Đang giao hàng</MenuItem>
                                <MenuItem value="successed">Đã hoàn thành</MenuItem>
                                <MenuItem value="cancelled">Đã hủy</MenuItem>
                                <MenuItem value="return">Trả hàng</MenuItem>
                            </Select>

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
                                onClick={() => handleDeleteOrder(order.orderId)}
                            >
                                Xóa đơn hàng
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleUpdateOrderStatus(order.orderId)}
                            >
                                Cập nhật trạng thái đơn hàng
                            </Button>
                        </Box>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default ViewAllOrders;
