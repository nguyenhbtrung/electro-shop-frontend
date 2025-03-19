import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Stack,
    Paper,
    Grid,
    Button,
    Divider,
    Pagination,
} from '@mui/material';
import { GetUserReturnHistory } from '../../../services/returnService';
import { useNavigate } from 'react-router-dom';
import { convertToLocaleDateString } from '../../../utils/formatDatetime';
import { MapMethod, MapStatus } from '../../../utils/returnHelper';

const ReturnHistoryPage = () => {
    const [returns, setReturns] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 3;
    const navigate = useNavigate();

    useEffect(() => {
        const GetReturns = async () => {
            const res = await GetUserReturnHistory();
            if (res?.status === 200 && res?.data) {
                setReturns(res?.data);
            } else {
                alert('Có lỗi xảy ra');
            }
        };

        GetReturns();
    }, []);

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
                    padding: '4px 8px',
                };
            case 'Đang xử lý hoàn trả':
                return {
                    color: 'orange',
                    backgroundColor: '#fff3e0',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: '1px solid orange',
                    borderRadius: '4px',
                    padding: '4px 8px',
                };
            case 'Hoàn tất':
                return {
                    color: 'green',
                    backgroundColor: '#e8f5e9',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: '1px solid green',
                    borderRadius: '4px',
                    padding: '4px 8px',
                };
            case 'Chờ xử lý':
                return {
                    color: 'blue',
                    backgroundColor: '#e3f2fd',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: '1px solid blue',
                    borderRadius: '4px',
                    padding: '4px 8px',
                };
            case 'Từ chối':
                return {
                    color: 'red',
                    backgroundColor: '#ffebee',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: '1px solid red',
                    borderRadius: '4px',
                    padding: '4px 8px',
                };
            case 'Đã huỷ bỏ':
                return {
                    color: 'gray',
                    backgroundColor: '#f1f1f1',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: '1px solid gray',
                    borderRadius: '4px',
                    padding: '4px 8px',
                };
            default:
                return {
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                };
        }
    };

    // Tính số trang cần hiển thị dựa vào số bản ghi và itemsPerPage
    const totalPages = Math.ceil(returns.length / itemsPerPage);

    // Lấy phần dữ liệu của trang hiện tại
    const currentReturns = returns.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Hàm xử lý chuyển trang
    const handleChangePage = (event, value) => {
        setPage(value);
        // Nếu có gọi API để load thêm dữ liệu, thực hiện ở đây.
    };

    return (
        <Container sx={{ py: 4 }}>
            {/* Tiêu đề trang */}
            <Box mb={4}>
                <Typography variant="h4" align="center" fontWeight="bold">
                    LỊCH SỬ HOÀN TRẢ
                </Typography>
            </Box>

            {/* Danh sách các yêu cầu return, hiển thị cho trang hiện tại */}
            <Stack spacing={3}>
                {currentReturns.map((returnItem) => (
                    <Paper key={returnItem.returnId} variant="outlined" sx={{ p: 2 }}>
                        {/* Phần thông tin trên */}
                        <Grid container spacing={2}>
                            {/* Cột trái: Thông tin yêu cầu */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    Mã Yêu Cầu: {returnItem.returnId}
                                </Typography>
                                <Typography variant="body2">
                                    Ngày gửi: {convertToLocaleDateString(returnItem.timeStamp)}
                                </Typography>
                                <Typography variant="body2">
                                    Phương thức xử lý: {MapMethod(returnItem.returnMethod)}
                                </Typography>
                            </Grid>

                            {/* Cột phải: Danh sách sản phẩm hoàn trả (chỉ hiển thị tên và số lượng) */}
                            <Grid item xs={12} md={6}>
                                {returnItem.returnProducts &&
                                    returnItem.returnProducts.length > 0 && (
                                        <Box>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                                mb={1}
                                            >
                                                Sản phẩm hoàn trả:
                                            </Typography>
                                            <Stack spacing={1}>
                                                {returnItem.returnProducts
                                                    .slice(0, 3)
                                                    .map((product) => (
                                                        <Box
                                                            key={product.productId}
                                                            sx={{
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px',
                                                                p: 1,
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
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
                                                            mt: 1,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontWeight: 'bold', color: '#777' }}
                                                        >
                                                            +{returnItem.returnProducts.length - 3}{' '}
                                                            sản phẩm khác
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
                                <Button onClick={() => navigate(`/returns/detail/${returnItem.returnId}`)} variant="contained" color="secondary">
                                    Xem chi tiết
                                </Button>
                            </Grid>
                            <Grid item>
                                <Box sx={getStatusStyle(MapStatus(returnItem.status))}>
                                    <Typography variant="body1">
                                        {MapStatus(returnItem.status)}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Stack>

            {/* Phân trang */}
            <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                    count={totalPages}
                    page={page}
                    variant="outlined"
                    shape="rounded"
                    onChange={handleChangePage}
                />
            </Box>
        </Container>
    );
};

export default ReturnHistoryPage;
