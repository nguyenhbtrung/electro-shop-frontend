import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    CardMedia,
    useTheme,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { tokens } from '../../../theme';
import { GetReturnDetailById } from '../../../services/returnService';
import { useNavigate, useParams } from 'react-router-dom';
import { convertToLocaleDateString } from '../../../utils/formatDatetime';
import ReturnStepper from '../../../components/returns/ReturnStepper';
import { ErrorOutline } from '@mui/icons-material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'; // Icon thành công
import { ChatContext } from '../AppUser';

const ReturnDetailPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { returnId } = useParams();
    const [returnData, setReturnData] = useState({});
    const { setOpenChat, setHasNewMessage } = useContext(ChatContext);
    const navigate = useNavigate();

    useEffect(() => {
        const GetReturnDetail = async () => {
            const res = await GetReturnDetailById(returnId);
            if (res?.status === 200 && res?.data) {
                console.log("check r detail", res?.data);
                setReturnData(res?.data);
            } else {
                console.log("check err", res?.data);
            }
        };

        GetReturnDetail();
    }, [returnId]);

    const GetReturnMethod = () => {
        if (returnData?.returnMethod === 'refund') {
            return 'Hoàn tiền';
        }
        if (returnData?.returnMethod === 'exchange') {
            return 'Đổi sản phẩm';
        }
        if (returnData?.returnMethod === 'repair') {
            return 'Sửa chữa';
        }
        return 'Không xác định';
    };

    // Kiểm tra nếu status không phải "rejected" và không phải "canceled"
    const isSuccessStatus =
        returnData?.status !== 'rejected' && returnData?.status !== 'canceled';

    return (
        <Container maxWidth="md">
            <Box my={4}>
                {/* Tiêu đề trang */}
                <Typography variant="h4" align="center" gutterBottom>
                    Chi tiết yêu cầu hoàn trả
                </Typography>

                {/* Nút Xem Đơn Hàng Liên Quan ở khung trên cùng */}
                <Box display="flex" justifyContent="flex-start" mb={2}>
                    <Button
                        variant="text"
                        color={colors.primary[400]}
                        disableRipple
                        disableFocusRipple
                        startIcon={<ReceiptIcon />}
                        onClick={() => navigate(`/orders`)}
                        sx={{
                            "&:hover": {
                                backgroundColor: "transparent",
                                color:
                                    theme.palette.mode === "dark"
                                        ? colors.blueAccent[400]
                                        : colors.blueAccent[700],
                            },
                            textDecoration: "underline",
                            textTransform: "none",
                        }}
                    >
                        Xem Đơn Hàng
                    </Button>
                </Box>

                {/* Thông tin đơn hàng */}
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>Mã yêu cầu:</strong> {returnId}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>Ngày gửi:</strong> {convertToLocaleDateString(returnData?.createdAt)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Phương thức xử lý:</strong> {GetReturnMethod()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tiến trình hoàn trả ngang sử dụng Stepper */}
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom align="center">
                        Tiến trình
                    </Typography>
                    <ReturnStepper returnHistories={returnData?.returnHistories} />

                    {returnData?.adminComment && (
                        <Box
                            sx={{
                                borderLeft: "4px solid",
                                borderColor: isSuccessStatus ? "success.main" : "error.main",
                                pl: 2,
                                mt: 2,
                            }}
                        >
                            {/* Dòng tiêu đề có icon */}
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                {isSuccessStatus ? (
                                    <CheckCircleOutline sx={{ color: "success.main", mr: 1 }} />
                                ) : (
                                    <ErrorOutline sx={{ color: "error.main", mr: 1 }} />
                                )}
                                <Typography variant="body2" whiteSpace="pre-line">
                                    <strong>Ghi chú:</strong>
                                </Typography>
                            </Box>
                            <Typography variant="body2" whiteSpace="pre-line">
                                {returnData.adminComment}
                            </Typography>
                        </Box>
                    )}
                </Paper>

                {/* Danh sách sản phẩm hoàn trả */}
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom align="center">
                        Sản phẩm hoàn trả
                    </Typography>
                    {returnData?.returnProducts?.map((product) => (
                        <Paper key={product.productId} variant="outlined" sx={{ p: 2, mb: 1 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={3}>
                                    <CardMedia
                                        component="img"
                                        image={product.image}
                                        alt={product.name}
                                        sx={{ width: 80, height: 80, objectFit: "cover" }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{product.name}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body1">
                                        Số lượng: {product.returnQuantity}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Paper>

                {/* Phần ghi chú với nút Liên Hệ Hỗ Trợ */}
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>Ghi chú:</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        - Nếu yêu cầu được phê duyệt, vui lòng chuẩn bị sản phẩm theo hướng dẫn để đóng gói gửi hàng.
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        - Trong trường hợp có thắc mắc, hãy liên hệ với bộ phận hỗ trợ qua Chat hoặc Hotline.
                    </Typography>
                    <Box display="flex" justifyContent="flex-start" mt={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setOpenChat(true);
                                setHasNewMessage(false); // Xóa thông báo nếu có
                            }}
                        >
                            Liên Hệ Hỗ Trợ
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ReturnDetailPage;
