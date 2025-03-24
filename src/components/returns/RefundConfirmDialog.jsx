import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import { Refund } from '../../services/returnService';

const RefundConfirmDialog = ({ open, onClose, payment }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [refundCompleted, setRefundCompleted] = React.useState(false);
    const [refundLoading, setRefundLoading] = React.useState(false);

    // Xử lý khi nhấn nút "Hoàn tiền"
    const handleRefund = async () => {
        // console.log("check payment:", payment);
        setRefundLoading(true);
        const user = localStorage.getItem("userName") || "admin";
        const data = {
            amount: payment?.amount,
            orderId: payment?.orderId,
            payDate: payment?.payDate,
            user: user,
            transactionType: "02"
        };
        try {
            // if (onExecuteRefund) {
            //     // await onExecuteRefund();
            // }
            const res = await Refund(data);
            if (res?.status === 200 && res?.data) {
                const refundResponse = JSON.parse(res.data.vnpayResponse);
                if (refundResponse.vnp_ResponseCode === "00") {
                    console.log("Giao dịch hoàn tiền thành công:", refundResponse);
                    setRefundCompleted(true);
                } else {
                    alert("Hoàn tiền không thành công");
                    console.error("Hoàn tiền thất bại:", refundResponse.vnp_Message);
                }
            }
        } catch (error) {
            console.error("Lỗi khi thực hiện hoàn tiền:", error);
        } finally {
            setRefundLoading(false);
        }
    };

    // Xử lý đóng hộp thoại
    const handleClose = (confirmed) => {
        // Nếu xác nhận hoàn tất quá trình nhưng chưa hoàn tiền thì không cho phép đóng dialog
        if (confirmed && !refundCompleted) return;
        onClose(confirmed);
        // Reset lại trạng thái khi đóng hộp thoại
        setRefundCompleted(false);
    };

    return (
        <Dialog
            open={open}
            onClose={() => handleClose(false)}
            aria-labelledby="refund-dialog-title"
            aria-describedby="refund-dialog-description"
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    minWidth: '500px',
                    maxWidth: '700px',
                },
            }}
        >
            <DialogTitle id="refund-dialog-title" sx={{ fontSize: '1.2rem', color: colors.greenAccent[500] }}>
                Xác nhận hoàn trả đơn hàng
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="refund-dialog-description" sx={{ fontSize: '1.2rem' }}>
                    Quản trị viên vui lòng thực hiện hoàn tiền cho đơn hàng trước khi xác nhận hoàn tất quy trình hoàn trả.
                </DialogContentText>
                {payment?.paymentMethod !== "vnpay" && (
                    <DialogContentText id="refund-dialog-description" sx={{ fontSize: '1.2rem' }}>
                        Đơn hàng không được thanh toán online qua VNPAY, vui lòng liên hệ khách hàng để xử lý hoàn tiền
                    </DialogContentText>

                )}
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ fontSize: '1.1rem', color: colors.red[500], textTransform: 'none' }}
                    onClick={() => handleClose(false)}
                >
                    Hủy
                </Button>
                <Button
                    sx={{
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        // borderColor: colors.info[500],
                        mr: 1,
                    }}
                    variant="outlined"
                    onClick={handleRefund}
                    disabled={refundCompleted || refundLoading || payment.paymentMethod !== "vnpay"}
                >
                    {refundCompleted ? "Đã hoàn tiền" : refundLoading ? "Đang hoàn tiền..." : "Hoàn tiền"}
                </Button>
                <Button
                    sx={{
                        fontSize: '1.1rem',
                        // color: refundCompleted ? colors.greenAccent[500] : colors.gray[500],
                        textTransform: 'none',
                    }}
                    variant="contained"
                    color={refundCompleted ? 'secondary' : 'error'}
                    onClick={() => handleClose(true)}
                    disabled={!refundCompleted}
                    autoFocus
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RefundConfirmDialog;
