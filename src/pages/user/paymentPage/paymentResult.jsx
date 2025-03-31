import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, Divider } from '@mui/material';

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    // Lấy các tham số từ query string
    const orderId = params.get('orderId');
    const vnpayTranId = params.get('vnpayTranId');
    const TerminalID = params.get('TerminalID');
    const vnp_Amount = params.get('vnp_Amount');
    const bankCode = params.get('bankCode');
    const vnp_ResponseCode = params.get('vnp_ResponseCode');
    const payDate = params.get('payDate');
    const error = params.get('error');

    // Hàm xử lý điều hướng về trang chủ
    const handleGoHome = () => {
        navigate('/');
    };

    // Hàm xử lý điều hướng đến trang theo dõi đơn hàng.
    // Giả sử đường dẫn là /order-tracking/:orderId, nếu không có orderId sẽ chuyển đến /orders
    const handleTrackOrder = () => {
        navigate('/orders');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Kết Quả Giao Dịch
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {error ? (
                    <Typography variant="body1" color="error">
                        Lỗi: {error}
                    </Typography>
                ) : (
                    <>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Mã đơn hàng:</strong> {orderId}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Mã giao dịch VNPAY:</strong> {vnpayTranId}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Terminal ID:</strong> {TerminalID}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Số tiền:</strong> {vnp_Amount}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Mã ngân hàng:</strong> {bankCode}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Pay Date:</strong> {payDate}
                        </Typography>
                        {vnp_ResponseCode === "00" ? (
                            <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
                                Thanh toán thành công!
                            </Typography>
                        ) : (
                            <Typography variant="h6" sx={{ mt: 2, color: 'red' }}>
                                Thanh toán thất bại. Mã lỗi: {vnp_ResponseCode}
                            </Typography>
                        )}
                    </>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button variant="contained" color="primary" onClick={handleGoHome}>
                        Quay lại trang chủ
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleTrackOrder}>
                        Theo dõi đơn hàng
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default PaymentResult;
