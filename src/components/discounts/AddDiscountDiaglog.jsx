import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
} from "@mui/material";

const AddDiscountDialog = ({ open, onClose, onSubmit }) => {
    // Khởi tạo state cho các trường input
    const [name, setName] = useState("");
    const [discountType, setDiscountType] = useState("Percentage");
    const [discountValue, setDiscountValue] = useState("");
    // Định dạng ngày theo yyyy-mm-dd
    const getToday = () => new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(getToday());
    const [endDate, setEndDate] = useState(getToday());
    const [error, setError] = useState("");

    const handleSubmit = () => {
        // validate tên chương trình
        if (name.trim() === "") {
            setError("Vui lòng nhập tên chương trình giảm giá.");
            return;
        }
        // validate giá trị giảm giá
        const value = Number(discountValue);
        if (value <= 0) {
            setError("Giá trị giảm giá phải lớn hơn 0.");
            return;
        }
        if (discountType === "Percentage" && value >= 100) {
            setError("Với loại Percentage, giá trị phải nhỏ hơn 100.");
            return;
        }
        // Nếu mọi valid đều hợp lệ, gọi onSubmit truyền dữ liệu mới cho component cha.
        onSubmit({
            name: name.trim(),
            discountType,
            discountValue: value,
            startDate,
            endDate,
        });

        // Reset form và đóng dialog
        setName("");
        setDiscountType("Percentage");
        setDiscountValue("");
        setStartDate(getToday());
        setEndDate(getToday());
        setError("");
        onClose();
    };

    const handleCancel = () => {
        // Reset lỗi và đóng dialog
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
            <DialogTitle>Thêm chương trình giảm giá</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Tên chương trình"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Loại giảm giá"
                            fullWidth
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                        >
                            <MenuItem value="Percentage">Percentage</MenuItem>
                            <MenuItem value="Flat Amount">Flat Amount</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Giá trị giảm giá"
                            fullWidth
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            helperText={
                                discountType === "Percentage"
                                    ? "Giá trị > 0 và nhỏ hơn 100"
                                    : "Giá trị > 0"
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Ngày bắt đầu"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Ngày kết thúc"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Grid>
                    {error && (
                        <Grid item xs={12}>
                            <div style={{ color: "red" }}>{error}</div>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="secondary">
                    Huỷ
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDiscountDialog;
