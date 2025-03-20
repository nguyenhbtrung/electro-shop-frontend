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
import { UpdateRating } from "../../services/ratingService"; // Adjust the path as necessary

const UpdateRatingDialog = ({ open, onClose, onSubmit, rating, productId }) => {
    const [ratingScore, setRatingScore] = useState(0);
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
            score: ratingScore,
            content: trimmedContent,
        };

        try {
            await UpdateRating(productId, updatedRating);
            onSubmit(updatedRating);
            setRatingScore(0);
            setRatingContent("");
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
            <DialogTitle>Cập nhật đánh giá</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Điểm đánh giá"
                            fullWidth
                            type="number"
                            value={ratingScore}
                            onChange={(e) => setRatingScore(Math.max(1, Math.min(5, Number(e.target.value))))}
                            error={!!error}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Nội dung đánh giá"
                            fullWidth
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
