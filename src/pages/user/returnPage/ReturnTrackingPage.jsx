import React from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    CardMedia,
    Stepper,
    Step,
    StepLabel,
    useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { tokens } from '../../../theme';

const ReturnTrackingPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // Dữ liệu cho tiến trình hoàn trả
    const steps = [
        { label: "Chờ xử lý", date: "20/10/2023", status: "completed" },
        { label: "Đã phê duyệt", date: "21/10/2023", status: "completed" },
        { label: "Đang xử lý", date: "22/10/2023", status: "current" },
        { label: "Hoàn tất", date: "Dự kiến: 25/10/2023", status: "pending" },
    ];

    // Xác định activeStep dựa vào bước hiện tại
    const activeStep = steps.findIndex((step) => step.status === "current");

    // Dữ liệu sản phẩm hoàn trả – mỗi sản phẩm ứng với 1 đơn hàng
    const products = [
        {
            id: 1,
            name: "Laptop HP",
            quantity: 1,
            image: "https://via.placeholder.com/100",
        },
        {
            id: 2,
            name: "PC Dell Inspiron",
            quantity: 2,
            image: "https://via.placeholder.com/100",
        },
        {
            id: 3,
            name: "Chuột Logitech",
            quantity: 1,
            image: "https://via.placeholder.com/100",
        },
    ];

    // Custom Step Icon dựa theo trạng thái bước
    const CustomStepIcon = (props) => {
        const { icon } = props;
        const stepIndex = Number(icon) - 1;
        const stepData = steps[stepIndex];

        if (stepData.status === "completed") {
            return <CheckCircleIcon color="success" />;
        } else if (stepData.status === "current") {
            return (
                <Box
                    sx={{
                        border: "2px solid",
                        borderColor: "primary.main",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="caption">{'[>]'}</Typography>
                </Box>
            );
        } else {
            return <RadioButtonUncheckedIcon color="disabled" />;
        }
    };

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
                        sx={{
                            "&:hover": {
                                backgroundColor: "transparent",
                                color: theme.palette.mode === "dark" ? colors.blueAccent[400] : colors.blueAccent[700]
                            },
                            textDecoration: "underline",
                            textTransform: "none"
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
                                <strong>Mã yêu cầu:</strong> RETURN#12345
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>Ngày gửi:</strong> 20/10/2023
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Phương thức xử lý:</strong> Hoàn tiền
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tiến trình hoàn trả ngang sử dụng Stepper */}
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom align="center">
                        TIẾN TRÌNH HOÀN TRẢ
                    </Typography>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel StepIconComponent={CustomStepIcon}>
                                    <Typography variant="body1" align="center">
                                        {step.label}
                                    </Typography>
                                    <Typography variant="caption" align="center" display="block">
                                        {step.date} {step.status === "current" && "(Hiện tại)"}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Paper>

                {/* Danh sách sản phẩm hoàn trả */}
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom align="center">
                        SẢN PHẨM HOÀN TRẢ - MỖI SẢN PHẨM LÀ 1 HÀNG
                    </Typography>
                    {products.map((product) => (
                        <Paper key={product.id} variant="outlined" sx={{ p: 2, mb: 1 }}>
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
                                        Số lượng: {product.quantity}
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
                            variant="outlined"
                            color={colors.primary[400]}
                        >
                            Liên Hệ Hỗ Trợ
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ReturnTrackingPage;
