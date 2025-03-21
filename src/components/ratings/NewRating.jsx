import React, { useState, useEffect } from "react";
import { CreateRating, GetRatingByProductId } from "../../services/ratingService";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';

const RatingForm = ({ productId, onSuccess, open, onClose }) => {
    // State để kiểm tra user đã mua sản phẩm hay chưa
    const [hasPurchased, setHasPurchased] = useState(false);
    const [loadingCheck, setLoadingCheck] = useState(true);
    const [hasRated, setHasRated] = useState(false);

    // State form đánh giá
    const [ratingScore, setRatingScore] = useState(5);
    const [ratingContent, setRatingContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Kiểm tra xem user đã mua sản phẩm chưa thông qua API
    useEffect(() => {
        async function checkPurchaseStatus() {
            try {
                const response = await axios.get(`/api/Order/user/vieworderbyid/${productId}`);
                if (response.data.status === "Successed") {
                    setHasPurchased(true);
                } else {
                    setHasPurchased(false);
                }
            } catch (error) {
                console.error("Lỗi kiểm tra mua hàng:", error);
                setHasPurchased(false);
            } finally {
                setLoadingCheck(false);
            }
        }
        checkPurchaseStatus();
    }, [productId]);

    // Kiểm tra xem user đã đánh giá sản phẩm chưa
    useEffect(() => {
        async function checkUserRating() {
            try {
                const res = await GetRatingByProductId(productId);
                if (res?.data) {
                    const userRating = res.data.find(rating => rating.userName === localStorage.getItem('userName'));
                    if (userRating) {
                        setHasRated(true);
                    }
                }
            } catch (error) {
                console.error("Lỗi kiểm tra đánh giá của người dùng:", error);
            }
        }
        if (hasPurchased) {
            checkUserRating();
        }
    }, [hasPurchased, productId]);

    // Hàm submit đánh giá
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Kiểm tra xem user đã mua sản phẩm chưa thông qua API
            const purchaseResponse = await axios.get(`/api/Order/user/vieworderbyid/${productId}`);
            if (purchaseResponse.data.status !== "Successed") {
                alert("Bạn chưa mua sản phẩm này, không thể đánh giá!");
                setSubmitting(false);
                return;
            }

            // Kiểm tra xem user đã đánh giá sản phẩm chưa
            const ratingResponse = await GetRatingByProductId(productId);
            if (ratingResponse?.data) {
                const userRating = ratingResponse.data.find(rating => rating.userName === localStorage.getItem('userName'));
                if (userRating) {
                    alert("Bạn chỉ được đánh giá 1 lần!");
                    setSubmitting(false);
                    return;
                }
            }

            const data = {
                productId,
                ratingScore: parseInt(ratingScore),
                ratingContent,
                //timestamp: new Date().toISOString(),
            };
            // Gọi API tạo đánh giá qua ratingService.js
            const res = await CreateRating(data);
            alert("Đánh giá đã được gửi thành công!");
            // Reset form
            setRatingScore(5);
            setRatingContent("");
            onSuccess(); // Gọi hàm onSuccess để thông báo thành công
            onClose(); // Đóng dialog
        } catch (error) {
            console.error("Lỗi tạo đánh giá:", error);
            alert("Có lỗi xảy ra khi gửi đánh giá, vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Tạo đánh giá</DialogTitle>
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
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={submitting}>
                    {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RatingForm;
