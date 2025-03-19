import React from 'react';
import {
    Box,
    Typography,
    Button,
    Breadcrumbs,
    Link,
    Card,
    CardContent,
    Grid,
    Avatar
} from '@mui/material';
import { useParams } from 'react-router-dom';

const ReturnRequestAdmin = () => {
    const { returnId } = useParams();

    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumb */}
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" href="#">
                    Quản lý hoàn trả
                </Link>
                <Typography color="text.primary">Chi tiết yêu cầu hoàn trả</Typography>
            </Breadcrumbs>

            {/* Mã yêu cầu hoàn trả */}
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <strong>Mã yêu cầu :</strong> {returnId}
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
                        <strong>Mã đơn hàng:</strong> ORDER#5678
                    </Typography>
                    <Typography variant="body1">
                        <strong>Ngày mua:</strong> 10/10/2023
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                        <strong>Sản phẩm hoàn trả:</strong>
                    </Typography>
                    <Grid container spacing={2}>
                        {/* Sản phẩm Laptop HP */}
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <Avatar
                                        variant="square"
                                        src="https://via.placeholder.com/60"
                                        alt="Laptop HP"
                                    />
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="body1">Laptop HP</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">
                                        <strong>Số lượng hoàn trả:</strong> 1
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* Sản phẩm PC Dell Inspiron */}
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <Avatar
                                        variant="square"
                                        src="https://via.placeholder.com/60"
                                        alt="PC Dell Inspiron"
                                    />
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="body1">PC Dell Inspiron</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">
                                        <strong>Số lượng hoàn trả:</strong> 2
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* Sản phẩm Chuột Logitech */}
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <Avatar
                                        variant="square"
                                        src="https://via.placeholder.com/60"
                                        alt="Chuột Logitech"
                                    />
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="body1">Chuột Logitech</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">
                                        <strong>Số lượng hoàn trả:</strong> 1
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
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
                        <strong>Tên:</strong> Nguyễn A
                    </Typography>
                    <Typography variant="body1">
                        <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP. HCM
                    </Typography>
                    <Typography variant="body1">
                        <strong>SĐT:</strong> 090xxxxxxx
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
                        <strong>Trạng thái hiện tại:</strong> Đang xử lý
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Lý do hoàn trả:</strong>
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body2">• Sai sản phẩm</Typography>
                        <Typography variant="body2">• Lỗi kỹ thuật</Typography>
                        <Typography variant="body2">• Không đúng mô tả</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Mô tả chi tiết:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        “Mô tả chi tiết về lỗi sản phẩm, bao bì hư hỏng, ghi chú bổ sung…”
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Hình ảnh minh chứng:</strong>
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Avatar
                                variant="square"
                                src="https://via.placeholder.com/100"
                                alt="IMG1"
                                sx={{ width: 100, height: 100 }}
                            />
                        </Grid>
                        <Grid item>
                            <Avatar
                                variant="square"
                                src="https://via.placeholder.com/100"
                                alt="IMG2"
                                sx={{ width: 100, height: 100 }}
                            />
                        </Grid>
                        <Grid item>
                            <Avatar
                                variant="square"
                                src="https://via.placeholder.com/100"
                                alt="IMG3"
                                sx={{ width: 100, height: 100 }}
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <strong>Phương thức xử lý:</strong> Hoàn tiền
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
                <Button variant="text" color="primary">
                    Quay lại Lịch Sử Hoàn Trả
                </Button>
            </Box>
        </Box>
    );
};

export default ReturnRequestAdmin;
