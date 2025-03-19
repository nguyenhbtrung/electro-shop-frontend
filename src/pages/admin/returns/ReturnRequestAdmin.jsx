import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Breadcrumbs,
    Link,
    Card,
    CardContent,
    Grid,
    Avatar,
    useTheme
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { GetReturnDetailByAdmin } from '../../../services/returnService';
import { convertToLocaleDateString } from '../../../utils/formatDatetime';
import { tokens } from '../../../theme';
import { MapMethod, MapStatus } from '../../../utils/returnHelper';
import { ErrorOutline } from '@mui/icons-material';

const ReturnRequestAdmin = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { returnId } = useParams();
    const [returnData, setReturnData] = useState({});
    const [dayDifference, setDayDifference] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const GetReturnData = async () => {
            const res = await GetReturnDetailByAdmin(returnId);
            if (res?.status === 200 && res?.data) {
                setReturnData(res?.data);
                console.log(">>>check res:", res?.data);
                const requestDate = res?.data?.createdAt ? new Date(res?.data.createdAt) : null;
                const orderDate = res?.data?.orderDate ? new Date(res?.data.orderDate) : null;

                if (requestDate && orderDate) {
                    const timeDifference = requestDate.getTime() - orderDate.getTime();
                    setDayDifference(Math.floor(timeDifference / (1000 * 3600 * 24)));
                }
            }
        };
        GetReturnData();
    }, []);

    const StyledStatus = (status) => {
        // Ánh xạ trạng thái (status) sang màu sắc
        const statusColorMap = {
            pending: colors.status[200],
            approved: colors.status[100],
            processing: colors.status[300],
            completed: colors.status[100],
            rejected: colors.status[400],
        };

        // Lấy màu tương ứng với giá trị status (nếu không có thì dùng mặc định)
        const color = statusColorMap[status] || "inherit";

        return (
            <span style={{ color: color, fontWeight: "bold" }}>
                {MapStatus(status)}
            </span>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumb */}
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    component="button"
                    onClick={() => navigate('/admin/returns')}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Quản lý hoàn trả
                </Link>
                <Typography color="text.primary">Chi tiết yêu cầu hoàn trả</Typography>
            </Breadcrumbs>

            {/* Mã yêu cầu hoàn trả */}
            <Typography variant="subtitle1" >
                <strong>Mã yêu cầu :</strong> {returnId}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <strong>Ngày gửi yêu cầu:</strong>{" "}
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    {convertToLocaleDateString(returnData?.createdAt)}
                    {dayDifference > 15 && (
                        <>
                            <ErrorOutline
                                sx={{
                                    color: colors.redAccent[500],
                                    fontSize: '1rem',
                                    mx: 1
                                }}
                            />
                            <Typography
                                component="span"
                                // variant="caption"
                                sx={{
                                    color: colors.redAccent[500],
                                    fontWeight: 500
                                }}
                            >
                                Yêu cầu không hợp lệ (Quá 15 ngày kể từ ngày mua)
                            </Typography>
                        </>
                    )}
                </Box>
            </Typography>

            {/* Tiêu đề trang */}
            {/* <Typography
                variant="h4"
                sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}
            >
                CHI TIẾT YÊU CẦU HOÀN TRẢ
            </Typography> */}

            {/* Thông tin ĐƠN HÀNG */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 1 }}
                    >
                        Thông tin ĐƠN HÀNG
                    </Typography>
                    <Typography variant="body1">
                        <strong>Mã đơn hàng:</strong> {returnData?.orderId}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Ngày mua:</strong> {convertToLocaleDateString(returnData?.orderDate)}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                        <strong>Sản phẩm hoàn trả:</strong>
                    </Typography>
                    <Grid container spacing={2}>
                        {returnData?.returnProducts?.map((product) => (
                            <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item>
                                        <Avatar
                                            variant="square"
                                            src={product?.image}
                                            alt="Laptop HP"
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="body1">{product?.name}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2">
                                            <strong>Số lượng hoàn trả:</strong> {product?.returnQuantity}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* Thông tin KHÁCH HÀNG */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 1 }}
                    >
                        Thông tin KHÁCH HÀNG
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tên:</strong> {returnData?.customerName}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Địa chỉ:</strong> {returnData?.address ?? 'chưa xác định'}
                    </Typography>
                    <Typography variant="body1">
                        <strong>SĐT:</strong> {returnData?.phoneNumber ?? 'chưa xác định'}
                    </Typography>
                </CardContent>
            </Card>

            {/* NỘI DUNG YÊU CẦU HOÀN TRẢ */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 1 }}
                    >
                        NỘI DUNG YÊU CẦU HOÀN TRẢ
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Trạng thái hiện tại:</strong> {StyledStatus(returnData?.status)}
                    </Typography>
                    <Typography variant="body1" >
                        <strong>Lý do hoàn trả:</strong>
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        {returnData?.reason?.split(',')?.map(reason => reason.trim())?.map((reason, index) => (
                            <Typography variant="body2" key={index}>- {reason}</Typography>
                        ))}
                        {/* <Typography variant="body2">• Sai sản phẩm</Typography>
                        <Typography variant="body2">• Lỗi kỹ thuật</Typography>
                        <Typography variant="body2">• Không đúng mô tả</Typography> */}
                    </Box>
                    <Typography variant="body1" >
                        <strong>Mô tả chi tiết:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 2, mb: 2 }}>
                        “{returnData?.detail}”
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Hình ảnh minh chứng:</strong>
                    </Typography>
                    <Grid container spacing={2}>
                        {returnData?.returnImageUrls?.map((url) => (
                            <Grid item>
                                <Avatar
                                    variant="square"
                                    src={url}
                                    alt="IMG"
                                    sx={{ width: 100, height: 100 }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <strong>Phương thức xử lý:</strong> {MapMethod(returnData?.returnMethod)}
                    </Typography>
                </CardContent>
            </Card>

            {/* HÀNH ĐỘNG */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}
            >
                <Box>
                    <Button variant="contained" color="success" sx={{ mr: 2 }}>
                        Phê duyệt
                    </Button>
                    <Button variant="contained" color="error">
                        Từ chối
                    </Button>
                </Box>
                <Button variant="text" color="primary" onClick={() => navigate("/admin/returns")}>
                    Quay lại quản lý hoàn trả
                </Button>
            </Box>
        </Box>
    );
};

export default ReturnRequestAdmin;
