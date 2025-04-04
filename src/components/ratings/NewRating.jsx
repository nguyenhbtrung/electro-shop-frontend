import React, { useState, useEffect } from "react";
import { CreateRating, GetRatingByProductId } from "../../services/ratingService";
import { GetOrderByStatus } from "../../services/orderService";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import Rating from '@mui/material/Rating';

const RatingForm = ({ productId, onSuccess, open, onClose }) => {
    // State để kiểm tra user đã mua sản phẩm hay chưa
    const [hasPurchased, setHasPurchased] = useState(false);
    const [hasRated, setHasRated] = useState(false);

    // State form đánh giá
    const [ratingScore, setRatingScore] = useState(5);
    const [ratingContent, setRatingContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Hàm kiểm tra mua hàng, trả về boolean
    const checkPurchaseStatus = async () => {
        try {
            const response = await GetOrderByStatus("successed");
            console.log("Response from GetOrderByStatus:", response);
            const currentUserId = localStorage.getItem('userId');
            console.log("currentUserId: ", currentUserId);

            const orders = response.data;
            const hasPurchasedProduct = orders.some(order =>
                order.status === "successed" && // Chỉ kiểm tra đơn hàng đã thành công
                order.userId === currentUserId && // Chỉ kiểm tra đơn hàng của user hiện tại
                order.orderItems.some(item => item.productId === productId) // Kiểm tra xem đơn hàng có chứa sản phẩm cần đánh giá không
            );
            console.log("hasPurchasedProduct: ", hasPurchasedProduct);
            return hasPurchasedProduct;
        } catch (error) {
            console.error("Lỗi kiểm tra mua hàng:", error);
            return false;
        }
    };

    // Sử dụng useEffect để kiểm tra mua hàng khi productId thay đổi
    useEffect(() => {
        async function fetchPurchaseStatus() {
            const purchased = await checkPurchaseStatus();
            console.log("Purchased status: ", purchased);
            setHasPurchased(purchased);
        }
        fetchPurchaseStatus();
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
            // Kiểm tra lại tình trạng mua hàng ngay trước khi submit
            const purchased = await checkPurchaseStatus();
            console.log("Purchased status before submit: ", purchased);
            if (!purchased) {
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
                userId: localStorage.getItem('userId'),
                userName: localStorage.getItem('userName')
            };

            // Gọi API tạo đánh giá qua ratingService.js
            await CreateRating(data);
            alert("Đánh giá đã được gửi thành công!");
            // Reset form
            setRatingScore(5);
            setRatingContent("");
            onSuccess(); // Thông báo thành công cho component cha
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
                {!hasPurchased && (
                    <p style={{ color: "red" }}>Bạn cần mua sản phẩm này mới có thể đánh giá!</p>
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Rating
                            name="rating"
                            value={ratingScore}
                            onChange={(event, newValue) => {
                                setRatingScore(newValue);
                            }}
                            precision={1}
                            max={5}
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
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={submitting || !hasPurchased}>
                    {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RatingForm;
