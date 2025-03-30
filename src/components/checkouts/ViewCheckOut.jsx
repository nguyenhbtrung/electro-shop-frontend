import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import { GetUserInfo, GetAvailableVouchers, GetUserCart, CreateOrder } from "../../services/checkoutService";

const ViewCheckOut = () => {
    const [userInfo, setUserInfo] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("bank");
    const [selectedVoucher, setSelectedVoucher] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = localStorage.getItem("userName");

                const [userResponse, cartResponse, voucherResponse] = await Promise.all([
                    GetUserInfo(username),
                    GetUserCart(username),
                    GetAvailableVouchers(),
                ]);

                setUserInfo(userResponse.data);
                setCartItems(cartResponse.data);
                setVouchers(voucherResponse.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

    const handleOrder = async () => {
        try {
            const response = await CreateOrder(selectedVoucher, paymentMethod);
    
            if (response.status === 200) {
                alert("Đặt hàng thành công!");
    
                if (paymentMethod === "vnpay" && response.data.paymentUrl) {
                    window.open(response.data.paymentUrl, "_blank");
                }
            } else {
                alert("Đặt hàng thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau!");
        }
    };

    const handleVoucherSelect = (voucher) => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (subtotal < voucher.minOrderValue) {
            alert("Đơn hàng không đủ điều kiện áp dụng mã giảm giá.");
            setSelectedVoucher("");
        } else {
            setSelectedVoucher(voucher.voucherCode);
        }
    };

    const calculateTotal = () => {
        let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (selectedVoucher) {
            const voucher = vouchers.find(v => v.voucherCode === selectedVoucher);

            if (voucher) {
                if (voucher.voucherType === "Percentage") {
                    const discountAmount = (subtotal * voucher.discountValue) / 100;
                    subtotal -= Math.min(discountAmount, voucher.maxDiscount);
                } else if (voucher.voucherType === "Fixed") {
                    subtotal -= Math.min(voucher.discountValue, voucher.maxDiscount);
                }
            }
        }

        return subtotal;
    };
    
    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Thông tin nhận hàng</Typography>
            <TextField fullWidth label="Họ và tên" variant="outlined" sx={{ mb: 2 }} value={userInfo.fullName || ""} disabled />
            <TextField fullWidth label="Số điện thoại" variant="outlined" sx={{ mb: 2 }} value={userInfo.phoneNumber || ""} disabled />
            <TextField fullWidth label="Địa chỉ" variant="outlined" sx={{ mb: 2 }} value={userInfo.address || ""} disabled />

            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 4, mb: 2 }}>Phương thức thanh toán</Typography>
            <FormControl component="fieldset">
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <FormControlLabel value="vnpay" control={<Radio />} label="Chuyển khoản qua ngân hàng (VnPay)" />
                    <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi giao hàng (COD)" />
                </RadioGroup>
            </FormControl>

            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 4 }}>Sản phẩm trong giỏ hàng</Typography>
            {cartItems.map((item, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <img src={item.productImage} alt={item.productName} style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16 }} />
                    <Box>
                        <Typography sx={{ fontWeight: "bold" }}>{item.productName}</Typography>
                        <Typography>{item.price.toLocaleString()} đ x {item.quantity}</Typography>
                    </Box>
                </Box>
            ))}

            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 4 }}>Áp dụng mã giảm giá</Typography>
            {vouchers.map((voucher, index) => (
                <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, border: "1px solid #ccc", borderRadius: "8px", margin: "10px auto", padding: "8px 16px" }}>
                    <Typography>{voucher.voucherCode} - {voucher.voucherName}</Typography>
                    <Radio checked={selectedVoucher === voucher.voucherCode} onChange={() => handleVoucherSelect(voucher)} value={voucher.voucherCode} sx={{ ml: "auto" }} />
                </Box>
            ))}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px" }}>
                <Typography>Phí vận chuyển: Miễn phí</Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>Tổng cộng: {calculateTotal().toLocaleString()} đ</Typography>
            </Box>

            <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }} disabled={cartItems.length === 0} onClick={handleOrder}>ĐẶT HÀNG</Button>
        </Box>
    );
};

export default ViewCheckOut;
