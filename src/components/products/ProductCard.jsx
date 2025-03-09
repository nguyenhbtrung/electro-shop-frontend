// ProductCard.js
import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DiscountPaper from "../discounts/DiscountPaper";
import { tokens } from "../../theme";

const ProductCard = ({ product }) => {
    // product object mong đợi có các thuộc tính:
    // name: string
    // images: array string (ví dụ: ["url_ảnh_1", "url_ảnh_2"])
    // originalPrice: number
    // discountedPrice: number
    // discountType: string ("Percentage" hoặc "Flat Amount")
    // discountValue: number
    // rating: number (ví dụ 4.5)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const {
        name,
        images,
        originalPrice,
        discountedPrice,
        discountType,
        discountValue,
        rating,
    } = product;

    const [isHovered, setIsHovered] = useState(false);

    const visibleImage = isHovered && images[1] ? images[1] : images[0];

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        let stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <StarIcon key={`full-${i}`} sx={{ color: "#FFD700", fontSize: 18 }} />
            );
        }
        if (halfStar) {
            stars.push(
                <StarHalfIcon key="half" sx={{ color: "#FFD700", fontSize: 18 }} />
            );
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <StarBorderIcon key={`empty-${i}`} sx={{ color: "#FFD700", fontSize: 18 }} />
            );
        }
        return stars;
    };

    return (
        <Box
            sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                p: 2,
                backgroundColor: colors.primary[400],
                "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                },
            }}
        >
            {/* Hộp ảnh sản phẩm */}
            <Box
                sx={{
                    width: "100%",
                    height: 0,
                    paddingTop: "100%", // tỉ lệ khối vuông
                    position: "relative",
                    mb: 1,
                    cursor: "pointer",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Box
                    component="img"
                    src={visibleImage}
                    alt={name}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>

            {/* Tên sản phẩm */}
            <Typography variant="h6" gutterBottom noWrap >
                {name}
            </Typography>

            {/* Giá sản phẩm: Giá gốc (có đường gạch ngang) & Giá giảm kèm DiscountPaper */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography
                    variant="body2"
                    sx={{ textDecoration: "line-through", color: colors.gray[400] }}
                >
                    {originalPrice.toLocaleString()}đ
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: theme.palette.mode === "dark" ? colors.redAccent[400] : "#D32F2F" }}>
                    {discountedPrice.toLocaleString()}đ
                </Typography>
                <DiscountPaper discountType={discountType} discountValue={discountValue} />
            </Box>

            {/* Hiển thị đánh giá: sao và giá trị rating */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
                {renderStars(rating)}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {rating.toFixed(1)}
                </Typography>
            </Box>
        </Box>
    );
};

export default ProductCard;
