import React from 'react';
import {
    Container,
    Box,
    Typography,
    Stack,
    Paper,
    Grid,
    Button,
    Divider,
    Pagination
} from '@mui/material';

const ReturnHistoryPage = () => {
    // Dữ liệu mẫu cho lịch sử hoàn trả (return) với danh sách sản phẩm hoàn trả
    const returnRequests = [
        {
            returnId: 'RETURN#12345',
            timeStamp: '20/10/2023',
            returnMethod: 'Hoàn tiền',
            status: 'Đã phê duyệt',
            returnProducts: [
                { productId: 'P001', name: 'Sản phẩm A', returnQuantity: 1 },
                { productId: 'P002', name: 'Sản phẩm B', returnQuantity: 2 },
                { productId: 'P006', name: 'Sản phẩm F', returnQuantity: 1 }
            ]
        },
        {
            returnId: 'RETURN#12346',
            timeStamp: '18/10/2023',
            returnMethod: 'Đổi hàng',
            status: 'Đang xử lý',
            returnProducts: [{ productId: 'P003', name: 'Sản phẩm C', returnQuantity: 1 }]
        },
        {
            returnId: 'RETURN#12347',
            timeStamp: '15/10/2023',
            returnMethod: 'Sửa chữa',
            status: 'Hoàn tất',
            returnProducts: [
                { productId: 'P004', name: 'Sản phẩm D', returnQuantity: 3 },
                { productId: 'P005', name: 'Sản phẩm E', returnQuantity: 1 },
                { productId: 'P007', name: 'Sản phẩm G', returnQuantity: 2 },
                { productId: 'P008', name: 'Sản phẩm H', returnQuantity: 1 }
            ]
        }
    ];

    // Hàm xác định kiểu hiển thị cho trạng thái hoàn trả (nổi bật)
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Đã phê duyệt':
                return {
                    color: 'green',
                    backgroundColor: '#e8f5e9',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: '1px solid green',
                    borderRadius: '4px',
                    padding: '4px 8px'
                };
            case 'Đang xử lý':
                return {
                    color: 'orange',
                    backgroundColor: '#fff3e0',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: '1px solid orange',
                    borderRadius: '4px',
                    padding: '4px 8px'
                };
            case 'Hoàn tất':
                return {
                    color: 'blue',
                    backgroundColor: '#e3f2fd',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: '1px solid blue',
                    borderRadius: '4px',
                    padding: '4px 8px'
                };
            default:
                return {
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                };
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            {/* Tiêu đề trang */}
            <Box mb={4}>
                <Typography variant="h4" align="center" fontWeight="bold">
                    LỊCH SỬ HOÀN TRẢ
                </Typography>
            </Box>

            {/* Danh sách các yêu cầu return */}
            <Stack spacing={3}>
                {returnRequests.map((returnItem) => (
                    <Paper key={returnItem.returnId} variant="outlined" sx={{ p: 2 }}>
                        {/* Phần thông tin trên */}
                        <Grid container spacing={2}>
                            {/* Cột trái: Thông tin yêu cầu */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    Mã Yêu Cầu: {returnItem.returnId}
                                </Typography>
                                <Typography variant="body2">
                                    Ngày gửi: {returnItem.timeStamp}
                                </Typography>
                                <Typography variant="body2">
                                    Phương thức xử lý: {returnItem.returnMethod}
                                </Typography>
                            </Grid>

                            {/* Cột phải: Danh sách sản phẩm hoàn trả (chỉ hiển thị tên và số lượng) */}
                            <Grid item xs={12} md={6}>
                                {returnItem.returnProducts && returnItem.returnProducts.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                            Sản phẩm hoàn trả:
                                        </Typography>
                                        <Stack spacing={1}>
                                            {returnItem.returnProducts.slice(0, 3).map((product) => (
                                                <Box
                                                    key={product.productId}
                                                    sx={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        p: 1,
                                                        display: 'flex',
                                                        justifyContent: 'space-between'
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Số lượng: {product.returnQuantity}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            {returnItem.returnProducts.length > 3 && (
                                                <Box
                                                    sx={{
                                                        textAlign: 'center',
                                                        border: '1px dashed #ccc',
                                                        borderRadius: '4px',
                                                        p: 1,
                                                        mt: 1
                                                    }}
                                                >
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#777' }}>
                                                        +{returnItem.returnProducts.length - 3} sản phẩm khác
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>

                        {/* Phần dưới: Nút "Xem chi tiết" và trạng thái */}
                        <Divider sx={{ my: 2 }} />
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Button variant="contained" color="secondary">
                                    Xem chi tiết
                                </Button>
                            </Grid>
                            <Grid item>
                                <Box sx={getStatusStyle(returnItem.status)}>
                                    <Typography variant="body1">
                                        {returnItem.status}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Stack>

            {/* Phân trang */}
            <Box mt={4} display="flex" justifyContent="center">
                <Pagination count={3} variant="outlined" shape="rounded" />
            </Box>
        </Container>
    );
};

export default ReturnHistoryPage;
