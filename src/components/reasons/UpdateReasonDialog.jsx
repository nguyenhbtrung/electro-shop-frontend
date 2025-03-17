import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
} from "@mui/material";

const UpdateReasonDialog = ({ open, onClose, onSubmit, reason }) => {
    const [reasonName, setReasonName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (reason) {
            setReasonName(reason.name);
        }
    }, [reason]);

    const handleSubmit = () => {
        if (reasonName.trim() === "") {
            setError("Vui lòng nhập nội dung lý do hoàn trả.");
            return;
        }
        // Chuẩn bị DTO cho reason
        const updatedReason = {
            name: reasonName.trim(),
        };

        onSubmit(updatedReason);

        setReasonName("");
        setError("");
    };

    const handleCancel = () => {
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
            <DialogTitle>Cập nhật lý do hoàn trả</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nội dung lý do hoàn trả"
                            fullWidth
                            value={reasonName}
                            onChange={(e) => setReasonName(e.target.value)}
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
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateReasonDialog;
