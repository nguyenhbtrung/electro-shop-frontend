import * as React from 'react';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { tokens } from '../../theme';

const RejectReturnDialog = ({
    open,
    onClose,
    dialogTitle = "TỪ CHỐI YÊU CẦU HOÀN TRẢ",
    dialogContent = "Vui lòng nhập lý do từ chối yêu cầu:"
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // State để lưu thông tin nhập liệu và trạng thái error
    const [reason, setReason] = useState("");
    const [error, setError] = useState(false);

    // Khi gửi từ chối thì trả về dữ liệu nhập (nếu đã nhập lý do hợp lệ)
    const handleSubmit = () => {
        if (!reason || reason.trim() === "") {
            setError(true);
            return;
        }
        onClose({ confirmed: true, reason });
        setReason("");
        setError(false);
    };

    // Khi hủy dialog
    const handleCancel = () => {
        onClose({ confirmed: false });
        setReason("");
        setError(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby="reject-refund-dialog-title"
            aria-describedby="reject-refund-dialog-description"
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    minWidth: '500px',
                    maxWidth: '700px',
                },
            }}
        >
            <DialogTitle
                id="reject-refund-dialog-title"
                sx={{ fontSize: '1.2rem', color: colors.greenAccent[500], textAlign: 'center' }}
            >
                {dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="reject-refund-dialog-description"
                    sx={{ fontSize: '1.2rem', marginBottom: '1rem' }}
                >
                    {dialogContent}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Lý do"
                    placeholder="Nhập lý do từ chối"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={reason}
                    onChange={(e) => {
                        setReason(e.target.value);
                        // Xóa error khi người dùng nhập dữ liệu hợp lệ
                        if (error && e.target.value.trim() !== "") {
                            setError(false);
                        }
                    }}
                    error={error}
                    helperText={error ? "Lý do không được để trống" : ""}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', paddingBottom: '1rem' }}>
                <Button
                    sx={{ fontSize: '1.1rem', color: colors.greenAccent[500], textTransform: 'none' }}
                    onClick={handleSubmit}
                    autoFocus
                >
                    Gửi từ chối
                </Button>
                <Button
                    sx={{ fontSize: '1.1rem', color: colors.red[500], textTransform: 'none' }}
                    onClick={handleCancel}
                >
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RejectReturnDialog;
