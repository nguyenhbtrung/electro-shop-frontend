import React, { useEffect, useState } from 'react';
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
import { GetReturnDetailById } from '../../../services/returnService';
import { useNavigate, useParams } from 'react-router-dom';
import { convertToLocaleDateString } from '../../../utils/formatDatetime';

import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CancelIcon from "@mui/icons-material/Cancel";
import { Timelapse } from '@mui/icons-material';



const StepperComponent = ({ returnHistories }) => {
    // Định nghĩa thứ tự trạng thái và ánh xạ nhãn của mỗi bước
    const stepOrder = ["pending", "approved", "processing", "completed"];
    const stepMapping = {
        pending: { label: "Chờ xử lý" },
        approved: { label: "Đã phê duyệt" },
        processing: { label: "Đang xử lý" },
        completed: { label: "Hoàn tất" },
        rejected: { label: "Từ chối" },
    };
    let hasRejected = false;

    // Hàm chuyển đổi dữ liệu lịch sử thành mảng steps cho Stepper
    const buildSteps = (histories) => {
        // Sắp xếp các bản ghi theo thời gian thay đổi (tăng dần)
        const sortedHistory = [...(histories || [])].sort(
            (a, b) => new Date(a.changedAt) - new Date(b.changedAt)
        );

        hasRejected = sortedHistory.some((record) => record.status === "rejected");
        if (hasRejected) {
            return buildStepsRejected(sortedHistory);
        }

        // Khởi tạo mảng steps với label, date rỗng và trạng thái mặc định là "pending"
        const steps = stepOrder.map((status) => ({
            label: stepMapping[status].label,
            date: "",
            status: "pending", // status: "pending", "current" hay "completed"
        }));

        // Gán ngày cho bước tương ứng nếu có bản ghi trong history
        sortedHistory.forEach((rec) => {
            const idx = stepOrder.indexOf(rec.status);
            if (idx !== -1) {
                // Format ngày theo định dạng locale Việt Nam: dd/MM/yyyy
                steps[idx].date = new Date(rec.changedAt).toLocaleDateString("vi-VN");
            }
        });

        // Xác định bước hiện tại dựa trên bản ghi lịch sử mới nhất
        if (sortedHistory.length > 0) {
            const latestStatus = sortedHistory[sortedHistory.length - 1].status;
            const currentStepIndex = stepOrder.indexOf(latestStatus);
            steps.forEach((step, idx) => {
                if (idx < currentStepIndex) {
                    step.status = "completed";
                } else if (idx === currentStepIndex) {
                    step.status = "current";
                } else {
                    step.status = "pending";
                }
            });
        } else {
            // Nếu chưa có bản ghi nào, đặt bước đầu tiên là current
            steps[0].status = "current";
        }

        return steps;
    };

    const buildStepsRejected = (sortedHistory) => {
        // Nếu có rejected, ta muốn dừng process ngay khi rejected xuất hiện.
        // Lấy vị trí xuất hiện đầu tiên của rejection.
        const firstRejectIndex = sortedHistory.findIndex((record) => record.status === "rejected");
        let steps = [];

        // Những bước trước đó (nếu có) sẽ được xác định là đã hoàn thành.
        // Ví dụ: nếu rejected xảy ra sau bước 1, ta lấy record đầu tiên cho bước "Chờ xử lý".
        // Sau đó thêm bước "Bị từ chối" với ngày từ bản ghi rejected.
        // Ở đây ta giả sử quy trình ban đầu được dự kiến là: pending -> approved -> processing -> completed.
        // Nhưng nếu rejection xảy ra, ta hiển thị theo quy trình:
        // [pending] => completed, sau đó [rejected] => current.

        // Sử dụng các record cho đến (nhưng không bao gồm) rejected
        // (Nếu rejection xảy ra ngay từ record đầu tiên thì processOrder.slice(0,0) trả về mảng rỗng).
        const previousRecords = sortedHistory.slice(0, firstRejectIndex);
        previousRecords.forEach((record, idx) => {
            // Tìm trạng thái trong processOrder (nếu record.status không nằm trong processOrder, bỏ qua)
            if (stepOrder.includes(record.status)) {
                steps.push({
                    label: stepMapping[record.status].label,
                    date: new Date(record.changedAt).toLocaleDateString("vi-VN"),
                    status: "completed",
                });
            }
        });

        // Thêm bước rejected từ record rejected
        steps.push({
            label: stepMapping["rejected"].label,
            date: new Date(sortedHistory[firstRejectIndex].changedAt).toLocaleDateString("vi-VN"),
            status: "rejected", // Trạng thái final
        });
        return steps;
    };

    const stepsData = buildSteps(returnHistories);

    // Xác định activeStep cho component Stepper (index của bước hiện tại)
    const isProcessCompleted =
        Array.isArray(returnHistories) &&
        returnHistories.length > 0 &&
        returnHistories[returnHistories.length - 1].status === "completed";

    const activeStep = isProcessCompleted
        ? stepsData.length
        : stepsData.findIndex((step) => step.status === "current" || step.status === "rejected");

    const CustomConnector = styled(StepConnector)(({ theme }) => ({
        // Mặc định (chưa active/hoàn thành)
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.grey[400],
            borderTopWidth: 2,
            borderRadius: 1,
        },
        // Khi bước đang active
        [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
            borderColor: hasRejected ? theme.palette.error.main : theme.palette.success.main,
        },
        // Khi bước đã hoàn thành
        [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.success.main,
        },
    }));

    // Custom Step Icon dựa theo trạng thái bước
    const CustomStepIcon = (props) => {
        const { icon, active, completed } = props;

        const stepIndex = Number(icon) - 1;
        const stepData = stepsData[stepIndex];
        // Nếu trạng thái của bước là rejected, hiển thị icon hủy
        if (stepData.status === "rejected") {
            return <CancelIcon color="error" />;
        }

        let iconNode = <RadioButtonUncheckedIcon color="disabled" />;
        if (completed) {
            iconNode = <CheckCircleIcon color="success" />;
        } else if (active) {
            iconNode = (
                <Box
                    sx={{
                        border: "2px solid",
                        borderColor: "warning.main",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Timelapse sx={{ color: "warning.main" }} />
                </Box>
            );
        }
        return iconNode;
    };


    return (
        <Stepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />}>
            {stepsData.map((step, index) => (
                <Step key={index}>
                    <StepLabel slots={{ stepIcon: CustomStepIcon }}>
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
    );
};

const ReturnTrackingPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { returnId } = useParams();
    const [returnData, setReturnData] = useState({});
    const navigate = useNavigate();
    const [steps, setSteps] = useState([
        { label: "Chờ xử lý", date: "20/10/2023", status: "completed" },
        { label: "Đã phê duyệt", date: "21/10/2023", status: "completed" },
        { label: "Đang xử lý", date: "22/10/2023", status: "current" },
        { label: "Hoàn tất", date: "Dự kiến: 25/10/2023", status: "pending" },
    ]);
    // Dữ liệu cho tiến trình hoàn trả
    // const steps = [
    //     { label: "Chờ xử lý", date: "20/10/2023", status: "completed" },
    //     { label: "Đã phê duyệt", date: "21/10/2023", status: "completed" },
    //     { label: "Đang xử lý", date: "22/10/2023", status: "current" },
    //     { label: "Hoàn tất", date: "Dự kiến: 25/10/2023", status: "pending" },
    // ];

    // Dữ liệu sản phẩm hoàn trả – mỗi sản phẩm ứng với 1 đơn hàng
    const returnProducts = [
        {
            productId: 1,
            name: "Laptop HP",
            returnQuantity: 1,
            image: "https://via.placeholder.com/100",
        },
        {
            productId: 2,
            name: "PC Dell Inspiron",
            returnQuantity: 2,
            image: "https://via.placeholder.com/100",
        },
        {
            productId: 3,
            name: "Chuột Logitech",
            returnQuantity: 1,
            image: "https://via.placeholder.com/100",
        },
    ];

    useEffect(() => {
        const GetReturnDetail = async () => {
            const res = await GetReturnDetailById(returnId);
            if (res?.status === 200 && res?.data) {
                console.log("check r detail", res?.data);
                setReturnData(res?.data);
            }
            else {
                console.log("check err", res?.data);
            }
        };

        GetReturnDetail();
    }, []);

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
        return 'Không xác định'
    }



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
                        onClick={() => navigate(`/order/${returnData?.orderId}`)}
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
                                <strong>Mã yêu cầu:</strong> RETURNID-{returnId}
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
                    {/* <Stepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />}>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel slots={{ stepIcon: CustomStepIcon }}>
                                    <Typography variant="body1" align="center">
                                        {step.label}
                                    </Typography>
                                    <Typography variant="caption" align="center" display="block">
                                        {step.date} {step.status === "current" && "(Hiện tại)"}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper> */}
                    <StepperComponent returnHistories={returnData?.returnHistories} />

                </Paper>

                {/* Danh sách sản phẩm hoàn trả */}
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom align="center">
                        SẢN PHẨM HOÀN TRẢ - MỖI SẢN PHẨM LÀ 1 HÀNG
                    </Typography>
                    {returnProducts.map((product) => (
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
