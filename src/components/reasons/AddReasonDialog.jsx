import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
} from "@mui/material";

const AddReasonDialog = ({ open, onClose, onSubmit }) => {
    const [reasonName, setName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (reasonName.trim() === "") {
            setError("Vui lòng nhập nội dung lý do hoàn trả.");
            return;
        }
        // Chuẩn bị DTO cho reason
        const newReason = {
            name: reasonName.trim(),
        };

        onSubmit(newReason);

        setName("");
        setError("");
    };

    const handleCancel = () => {
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
            <DialogTitle>Thêm mẫu lý do hoàn trả</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nội dung lý do hoàn trả"
                            fullWidth
                            value={reasonName}
                            onChange={(e) => setName(e.target.value)}
                            error={!!error}
                            helperText={error || "Tối đa 255 ký tự"}
                        />
                    </Grid>
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

export default AddReasonDialog;
