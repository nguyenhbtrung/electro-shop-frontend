import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CancelIcon from "@mui/icons-material/Cancel";
import { Timelapse } from '@mui/icons-material';



const ReturnStepper = ({ returnHistories }) => {
    // Định nghĩa thứ tự trạng thái và ánh xạ nhãn của mỗi bước
    const stepOrder = ["pending", "approved", "processing", "completed"];
    const stepMapping = {
        pending: { label: "Chờ xử lý" },
        approved: { label: "Phê duyệt" },
        processing: { label: "Xử lý hoàn trả" },
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

export default ReturnStepper;