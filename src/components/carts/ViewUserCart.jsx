// src/components/carts/ViewUserCart.jsx
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate để điều hướng
import { DeleteCartItem, EditCartItemQuantity } from "../../services/CartService";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
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
                src={
                    item.productImage
                }
                alt={item.productName}
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <Box sx={{ flex: 1, marginLeft: "16px" }}>
                <Typography variant="h6">{item.productName}</Typography>
                <Typography color="text.secondary">
                    {item.price.toLocaleString()} đ
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                    size="small"
                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        minWidth: "40px",
                        border: "none",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                        },
                    }}
                >
                    -
                </Button>
                <Typography sx={{ margin: "0 12px" }}>{item.quantity}</Typography>
                <Button
                    size="small"
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        minWidth: "40px",
                        border: "none",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                        },
                    }}
                >
                    +
                </Button>
            </Box>
            <Button color="error" onClick={() => onRemove(item.productId)}>
                Xóa
            </Button>
        </Box>
    );
};

const ViewUserCart = ({ cartItems, setCartItems }) => {
    const navigate = useNavigate(); // Hook để điều hướng

    const removeItem = async (productId) => {
        try {
            await DeleteCartItem(productId);
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.productId !== productId)
            );
            console.log(`Đã xóa sản phẩm có ID: ${productId}`);
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;

        try {
            await EditCartItemQuantity(productId, quantity);
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.productId === productId ? { ...item, quantity } : item
                )
            );
            console.log(`Đã cập nhật số lượng sản phẩm có ID: ${productId}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
        }
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <Box>
            {/* Nút quay lại */}
            <Button
                variant="outlined"
                sx={{ marginBottom: "16px" }}
                onClick={() => navigate("/")}
            >
                Trang chủ
            </Button>

            <Typography variant="h5" sx={{ fontSize: "1.2rem", marginBottom: "16px" }}>
                Giỏ hàng của bạn
            </Typography>

            {cartItems.length === 0 ? (
                <Typography
                    sx={{
                        fontSize: "1.2rem",
                        textAlign: "center",
                        margin: "20px 0",
                    }}
                >
                    Giỏ hàng trống, xin hãy thêm sản phẩm vào giỏ
                </Typography>
            ) : (
                cartItems.map((item) => (
                    <CartItem
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                    />
                ))
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
                <Typography variant="h6">Tổng tiền:</Typography>
                <Typography color="primary" variant="h6">
                    {totalPrice.toLocaleString()} đ
                </Typography>
            </Box>

            <Button
                variant="contained"
                color="success"
                fullWidth
                disabled={cartItems.length === 0}
                sx={{ marginTop: "16px" }}
            >
                Thanh toán
            </Button>
        </Box>
    );
};

export default ViewUserCart;
