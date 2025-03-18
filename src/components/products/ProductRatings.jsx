import React, { useEffect, useState } from 'react';
import { Box, Typography, Rating, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GetRatingByProductId } from '../../services/ratingService';

const ProductRatings = ({ productId }) => {
    const [ratings, setRatings] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await GetRatingByProductId(productId);
                if (res?.data) {
                    setRatings(res.data);
                }
            } catch (error) {
                console.error("Error fetching product ratings:", error);
            }
        };

        fetchRatings();
    }, [productId]);

    const handleMenuOpen = (event, rating) => {
        setAnchorEl(event.currentTarget);
        setSelectedRating(rating);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRating(null);
    };

    const UpdateRating = () => {
        // Implement delete functionality here
        handleMenuClose();
    };

    const DeleteRating = () => {
        // Implement delete functionality here
        handleMenuClose();
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Đánh giá sản phẩm
            </Typography>
            {ratings.length > 0 ? (
                ratings.map((rating) => (
                    <Box key={rating.ratingId} sx={{ mb: 2, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {rating.userId}
                                <Box component="span" sx={{ mx: 1 }}></Box>
                                <Rating value={rating.ratingScore} readOnly precision={0.5} sx={{ color: 'orange' }} />
                            </Typography>
                            <IconButton onClick={(event) => handleMenuOpen(event, rating)}>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h6" sx={{ color: 'gray' }}>
                            {new Date(rating.dateTime).toLocaleDateString('vi-VN')}
                        </Typography>
                        <Typography variant="h6">
                            {rating.ratingContent}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Chưa có đánh giá nào.</Typography>
            )}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={UpdateRating}>Chỉnh sửa</MenuItem>
                <MenuItem onClick={DeleteRating}>Xóa</MenuItem>
            </Menu>
        </Box>
    );
};

export default ProductRatings;