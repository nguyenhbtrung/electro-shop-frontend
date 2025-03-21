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

const UpdateRatingDialog = ({ open, onClose, onSubmit, rating, productId }) => {
    const [ratingScore, setRatingScore] = useState(1);
    const [ratingContent, setRatingContent] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (rating) {
            setRatingScore(rating.ratingScore);
            setRatingContent(rating.ratingContent);
        }
    }, [rating]);

    const handleSubmit = async () => {
        if (ratingScore < 1 || ratingScore > 5) {
            setError("Điểm đánh giá phải từ 1 đến 5.");
            return;
        }

        const trimmedContent = ratingContent.trim();
        if (!trimmedContent) {
            setError("Nội dung đánh giá không được để trống.");
            return;
        }

        // Chuẩn bị DTO cho rating
        const updatedRating = {
            ratingScore: ratingScore,
            ratingContent: trimmedContent,
            status: null, // Ensure status is always null
            timeStamp: new Date().toISOString() // Ensure timeStamp is included
        };

        try {
            onSubmit(updatedRating);
            setError("");
        } catch (error) {
            setError("Có lỗi xảy ra khi cập nhật đánh giá.");
        }
    };

    const handleCancel = () => {
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Cập nhật đánh giá</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Điểm đánh giá"
                            fullWidth
                            type="number"
                            value={ratingScore}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10) || 1;
                                setRatingScore(Math.max(1, Math.min(5, value)));
                            }}
                            error={!!error}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Nội dung đánh giá"
                            fullWidth
                            type="string"
                            value={ratingContent}
                            onChange={(e) => setRatingContent(e.target.value)}
                        />
                        {error && <p style={{ color: "red" }}>{error}</p>}
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

export default UpdateRatingDialog;
