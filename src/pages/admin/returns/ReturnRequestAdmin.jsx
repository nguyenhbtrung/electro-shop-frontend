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
    useTheme,
    Modal
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { GetPaymentByOrderId, GetReturnDetailByAdmin, UpdateReturnStatus } from '../../../services/returnService';
import { convertToLocaleDateString } from '../../../utils/formatDatetime';
import { tokens } from '../../../theme';
import { MapMethod, MapStatus } from '../../../utils/returnHelper';
import { ErrorOutline } from '@mui/icons-material';
import CustomConfirmDialog from '../../../components/CustomConfirmDialog';
import InfoDialog from '../../../components/InfoDialog';
import RejectReturnDialog from '../../../components/returns/RejectReturnDialog';
import RefundConfirmDialog from '../../../components/returns/RefundConfirmDialog';

const ReturnRequestAdmin = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { returnId } = useParams();
    const [returnData, setReturnData] = useState({});
    const [dayDifference, setDayDifference] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [info, setInfo] = useState({
        open: false,
        content: ""
    });
    const [openApprove, setOpenApprove] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [openProcess, setOpenProcess] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [openComplete, setOpenComplete] = useState(false);
    const [openRefund, setOpenRefund] = useState(false);
    const [payment, setPayment] = useState({});
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


    const handleOpenModal = (url) => {
        setSelectedImage(url);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const StyledStatus = (status) => {
        // Ánh xạ trạng thái (status) sang màu sắc
        const statusColorMap = {
            pending: colors.status[300],
            approved: colors.status[100],
            processing: colors.status[200],
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

    const handleOpenComplete = () => {
        if (returnData?.returnMethod === "refund") {
            handleRefund();
        } else {
            setOpenComplete(true);
        }
    };

    const handleCloseInfo = () => {
        setInfo({ ...info, open: false });
    };

    const handleCloseApprove = (isConfirm) => {
        setOpenApprove(false);
        if (isConfirm) {
            handleApprove();
        }
    };

    const handleCloseReject = ({ confirmed, reason }) => {
        setOpenReject(false);
        if (confirmed && reason) {
            const adminComment = `Yêu cầu hoàn trả đã bị từ chối.\nLý do:\n${reason}`;
            handleReject(adminComment);
        }
    };

    const handleCloseProcess = (isConfirm) => {
        setOpenProcess(false);
        if (isConfirm) {
            handleProcess();
        }
    };

    const handleCloseCancel = ({ confirmed, reason }) => {
        setOpenCancel(false);
        if (confirmed && reason) {
            const adminComment = `Yêu cầu hoàn trả đã huỷ.\nLý do:\n${reason} \nSản phẩm sẽ được gửi trả lại cho bạn sau 1-2 ngày.`;
            handleCancel(adminComment);
        }
    };

    const handleCloseComplete = (isConfirm) => {
        setOpenComplete(false);
        if (isConfirm) {
            handleComplete();
        }
    };

    const handleCloseRefund = (isConfirm) => {
        setOpenRefund(false);
        if (isConfirm) {
            handleComplete();
        }
    };

    const handleApprove = () => {
        const data = {
            returnStatus: "approved",
            adminComment: "Yêu cầu hoàn trả đã được phê duyệt. Vui lòng gửi sản phẩm tới địa chỉ trung tâm"
        }
        UpdateStatus(data);
    };

    const handleReject = (adminComment) => {
        const data = {
            returnStatus: "rejected",
            adminComment: adminComment
        }
        UpdateStatus(data);
    };

    const handleProcess = () => {
        const data = {
            returnStatus: "processing",
            adminComment: "Yêu cầu hoàn trả đang được xử lý."
        }
        UpdateStatus(data);
    };

    const handleCancel = (adminComment) => {
        const data = {
            returnStatus: "canceled",
            adminComment: adminComment
        }
        UpdateStatus(data);
    };

    const UpdateStatus = async (data) => {
        const res = await UpdateReturnStatus(returnId, data);
        if (res?.status === 200 && res?.data) {
            setInfo({
                content: "Cập nhật trạng thái yêu cầu hoàn trả thành công.",
                open: true
            });
            setReturnData({ ...returnData, status: res?.data?.returnStatus });
        } else {
            setInfo({
                content: "Cập nhật trạng thái yêu cầu hoàn trả không thành công.",
                open: true
            });
        }
    };

    const handleComplete = () => {
        const data = {
            returnStatus: "completed",
            adminComment: "Quy trình hoàn trả đã hoàn tất"
        }
        UpdateStatus(data);
    };

    const handleRefund = async () => {
        const res = await GetPaymentByOrderId(returnData?.orderId);
        console.log("check orderid:", returnData?.orderId);
        if (res?.status === 200 && res?.data) {
            setPayment(res.data);
        }
        setOpenRefund(true);
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
                        {returnData?.returnImageUrls?.map((url, index) => (
                            <Grid
                                item
                                key={index}
                                // Khi nhấn vào item, mở modal với URL tương ứng
                                onClick={() => handleOpenModal(url)}
                                sx={{ cursor: 'pointer' }}  // Thêm hiệu ứng trỏ tay
                            >
                                <Avatar
                                    variant="square"
                                    src={url}
                                    alt="IMG"
                                    sx={{ width: 100, height: 100 }}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Modal hiển thị ảnh mở rộng */}
                    <Modal
                        open={Boolean(selectedImage)}
                        onClose={handleCloseModal}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 2,
                                outline: 'none'
                            }}
                        >
                            {selectedImage && (
                                <img
                                    src={selectedImage}
                                    alt="Expanded view"
                                    style={{ maxWidth: '100%', maxHeight: '80vh' }}
                                />
                            )}
                        </Box>
                    </Modal>
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
                {returnData?.status === "pending" && (
                    <Box>
                        <Button onClick={() => setOpenApprove(true)} variant="contained" color="success" sx={{ mr: 2 }}>
                            Phê duyệt
                        </Button>
                        <Button onClick={() => setOpenReject(true)} variant="contained" color="error">
                            Từ chối
                        </Button>
                    </Box>
                )}
                {returnData?.status === "approved" && (
                    <Box>
                        <Button onClick={() => setOpenProcess(true)} variant="contained" color="warning" sx={{ mr: 2 }}>
                            Xử lý hoàn trả
                        </Button>
                        <Button onClick={() => setOpenCancel(true)} variant="contained" color="gray">
                            Huỷ bỏ
                        </Button>
                    </Box>
                )}
                {returnData?.status === "processing" && (
                    <Box>
                        <Button onClick={handleOpenComplete} variant="contained" color="success" sx={{ mr: 2 }}>
                            Hoàn tất
                        </Button>
                    </Box>
                )}
                <Button variant="text" color="primary" onClick={() => navigate("/admin/returns")}>
                    Quay lại quản lý hoàn trả
                </Button>
            </Box>
            <CustomConfirmDialog
                open={openApprove}
                title="Xác nhận phê duyệt yêu cầu hoàn trả"
                question="Bạn có chắc chắn muốn phê duyệt yêu cầu hoàn trả này không?"
                onClose={handleCloseApprove}
            />
            <RejectReturnDialog
                open={openReject}
                dialogTitle='Từ chối yêu cầu hoàn trả'
                dialogContent='Vui lòng nhập lý do từ chối yêu cầu:'
                onClose={handleCloseReject}
            />
            <CustomConfirmDialog
                open={openProcess}
                title="Xác nhận xử lý hoàn trả"
                question="Bạn có chắc chắn muốn xử lý hoàn trả cho yêu cầu hoàn trả này không?"
                onClose={handleCloseProcess}
            />
            <RejectReturnDialog
                open={openCancel}
                dialogTitle='Huỷ yêu cầu hoàn trả'
                dialogContent='Vui lòng nhập lý do huỷ yêu cầu:'
                onClose={handleCloseCancel}
            />
            <CustomConfirmDialog
                open={openComplete}
                title="Xác nhận hoàn tất quy trình hoàn trả"
                question="Bạn có chắc chắn muốn hoàn tất quy trình hoàn trả không?"
                onClose={handleCloseComplete}
            />
            <InfoDialog
                open={info?.open}
                question={info?.content}
                onClose={handleCloseInfo}
            />
            <RefundConfirmDialog
                open={openRefund}
                onClose={handleCloseRefund}
                payment={payment}
            />
        </Box>
    );
};

export default ReturnRequestAdmin;
