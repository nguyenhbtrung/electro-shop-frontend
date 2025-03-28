import React, { useEffect, useState } from 'react';
import { Box, Typography, Rating, IconButton, useTheme, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetRatingByProductId, DeleteRating, UpdateRating } from '../../services/ratingService';
import UpdateRatingDialog from '../ratings/UpdateRating';
import NewRating from '../ratings/NewRating'; // Import NewRating component

const ProductRatings = ({ productId, isAdmin }) => {
    const [ratings, setRatings] = useState([]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [currentUserName, setCurrentUserName] = useState(null);
    const [showNewRatingForm, setShowNewRatingForm] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        // Chỉ chạy ở client, khi component đã được mount
        const storedUserName = localStorage.getItem('userName');
        setCurrentUserName(storedUserName);
    }, []);

    useEffect(() => {
        if (currentUserName) {
            fetchRatings();
        }
    }, [currentUserName, productId]);

    const fetchRatings = async () => {
        try {
            const res = await GetRatingByProductId(productId);
            if (res?.data) {
                const sortedRatings = res.data.sort((a, b) => {
                    if (a.userName === currentUserName) return -1;
                    if (b.userName === currentUserName) return 1;
                    return 0;
                });
                console.log("Sorted Ratings: ", sortedRatings);
                setRatings(sortedRatings);
            }
        } catch (error) {
            console.error("Error fetching product ratings:", error);
        }
    };

    const handleEdit = (rating) => {
        if (rating.userName !== currentUserName) {
            alert("Bạn chỉ có thể chỉnh sửa đánh giá của chính mình!");
            return;
        }
        setSelectedRating(rating);
        setOpenEditDialog(true);
    };

    const handleDelete = async (rating) => {
        if (rating.userName !== currentUserName && !isAdmin) {
            alert("Bạn chỉ có thể xóa đánh giá của chính mình!");
            return;
        }
        if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
            try {
                const res = await DeleteRating(rating.productId);
                if (res?.status === 200 || res?.status === 204) {
                    alert("Xóa đánh giá thành công!");
                    fetchRatings(); // Refetch ratings after successful delete
                } else {
                    console.log(">>>Error deleting rating:", res);
                }
            } catch (error) {
                console.log(">>>Error deleting rating:", error);
            }
        }
    };

    const handleEditDialogSubmit = async (updatedRating) => {
        try {
            console.log("Updated Rating: ", updatedRating);
            const res = await UpdateRating(productId, updatedRating);
            if (res?.status === 200) {
                alert("Cập nhật đánh giá thành công!");
                fetchRatings(); // Refetch ratings after successful update
                setOpenEditDialog(false);
            } else {
                console.log(">>>Error updating rating:", res);
            }
        } catch (error) {
            console.log(">>>Error updating rating:", error);
        }
    };

    //Lấy điểm đánh giá trung bình
    const averageRatingScore = ratings.length > 0
        ? ratings.reduce((acc, rating) => acc + rating.ratingScore, 0) / ratings.length
        : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // dàn đều 2 bên
                mt: 4,
                mb: 2
            }}>
                {/* Bên trái: Tiêu đề, điểm trung bình, số lượng đánh giá */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                        Đánh giá sản phẩm:
                    </Typography>
                    {/* Hiển thị điểm đánh giá trung bình */}
                    <Rating
                        value={averageRatingScore}
                        readOnly
                        precision={0.5}
                        sx={{ ml: 2 }}
                    />
                    {/* Tổng số đánh giá */}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                        ({ratings.length} đánh giá)
                    </Typography>
                </Box>

                {/* Bên phải: Nút "Tạo đánh giá" */}
                <Button
                    variant="contained" color="secondary"
                    onClick={() => setShowNewRatingForm(true)}
                >
                    Tạo đánh giá
                </Button>
            </Box>
            {/* Hiển thị form tạo đánh giá nếu showNewRatingForm = true */}
            <NewRating
                productId={productId}
                onSuccess={() => {
                    // Khi đánh giá thành công => đóng form + refetch
                    fetchRatings();
                    setShowNewRatingForm(false);
                }}
                open={showNewRatingForm}
                onClose={() => setShowNewRatingForm(false)}
            />
            {ratings.length > 0 ? (
                ratings.map((rating, index) => (
                    <Box key={`${rating.ratingId}-${index}`} sx={{ backgroundColor: '#fff', mb: 2, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                {rating.userName}
                                <Box component="span" sx={{ mx: 1 }}></Box>
                                <Rating value={rating.ratingScore} readOnly precision={0.5} />
                            </Typography>
                            <Box>
                                <IconButton onClick={() => handleEdit(rating)} sx={{ color: theme.palette.primary.main }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(rating)} sx={{ color: theme.palette.error.main }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        <Typography variant="h6" color='gray'>
                            {new Date(rating.timeStamp).toLocaleDateString('vi-VN')}
                        </Typography>
                        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                            {rating.ratingContent}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Chưa có đánh giá nào.</Typography>
            )}
            <UpdateRatingDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                onSubmit={handleEditDialogSubmit}
                rating={selectedRating}
                productId={productId}
            />
        </Box>
    );
};

export default ProductRatings;