import React, { useState, useEffect } from "react";
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

const UpdateDiscountDialog = ({ open, onClose, onSubmit, discount }) => {
    const getToday = () => new Date().toISOString().split("T")[0];

    const [name, setName] = useState(discount ? discount.name : "");
    const [discountType, setDiscountType] = useState(discount ? discount.discountType : "Percentage");
    const [discountValue, setDiscountValue] = useState(discount ? discount.discountValue : "");
    const [startDate, setStartDate] = useState(discount ? discount.startDate : getToday());
    const [endDate, setEndDate] = useState(discount ? discount.endDate : getToday());
    const [error, setError] = useState("");

    // Khi discount prop thay đổi, cập nhật lại state cho form
    useEffect(() => {
        if (discount) {
            setName(discount.name || "");
            setDiscountType(discount.discountType || "Percentage");
            setDiscountValue(discount.discountValue || "");
            setStartDate(discount.startDate || getToday());
            setEndDate(discount.endDate || getToday());
        }
    }, [discount]);

    const handleSubmit = () => {
        // Validate tên chương trình
        if (name.trim() === "") {
            setError("Vui lòng nhập tên chương trình giảm giá.");
            return;
        }
        // Validate giá trị giảm giá
        const value = Number(discountValue);
        if (value <= 0) {
            setError("Giá trị giảm giá phải lớn hơn 0.");
            return;
        }
        if (discountType === "Percentage" && value >= 100) {
            setError("Với loại Percentage, giá trị phải nhỏ hơn 100.");
            return;
        }
        // Gọi onSubmit với dữ liệu cập nhật, có thể giữ lại các thuộc tính khác (như discountId)
        onSubmit({
            ...discount,
            name: name.trim(),
            discountType,
            discountValue: value,
            startDate,
            endDate,
        });
        // Reset lỗi và đóng dialog
        setError("");
        onClose();
    };

    const handleCancel = () => {
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
            <DialogTitle>Cập nhật chương trình giảm giá</DialogTitle>
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
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateDiscountDialog;
