// ProductCard.js
import React, { useState } from "react";
import {
    Box,
    Typography,
    useTheme,
    Button,
    Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DiscountPaper from "../discounts/DiscountPaper";
import { tokens } from "../../theme";
import AddToCartDialog from "./AddToCartDialog";
import { formatPrice } from "../../utils/formatValue";
import { useNavigate } from 'react-router-dom';
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [openAddToCart, setOpenAddToCart] = useState(false);

    const {
        name,
        images,
        originalPrice,
        discountedPrice,
        discountType,
        discountValue,
        averageRating = 0,
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
                <StarBorderIcon
                    key={`empty-${i}`}
                    sx={{ color: "#FFD700", fontSize: 18 }}
                />
            );
        }
        return stars;
    };

    const handleCloseAddToCart = () => {
        setOpenAddToCart(false);
    };

    return (
        <Box onClick={() => navigate(`/product/${product.productId}`)}
            sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                p: 2,
                backgroundColor: colors.primary[400],
                "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                },
                display: "flex",
                flexDirection: "column",
                height: "100%", // Giúp card có chiều cao đồng nhất khi nằm trong grid
            }}
        >
            {/* Hộp ảnh sản phẩm */}
            <Box
                sx={{
                    width: "100%",
                    height: 0,
                    paddingTop: "100%", // duy trì tỉ lệ vuông
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

            {/* Tên sản phẩm: Giới hạn tối đa 2 dòng, hiển thị full qua Tooltip */}
            <Tooltip title={name}>
                <Typography
                    variant="h6"
                    sx={{
                        height: "50px",               // Chiều cao cố định cho phần tên (có thể điều chỉnh theo mong muốn)
                        lineHeight: "25px",            // Chiều cao dòng (2 dòng nếu mỗi dòng 25px)
                        display: "-webkit-box",
                        WebkitLineClamp: 2,            // Giới hạn 2 dòng
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mb: 1,
                    }}
                >
                    {name}
                </Typography>

            </Tooltip>

            {/* Container chung của 2 hàng giữa */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    height: "64px", // Tổng chiều cao dành cho 2 hàng (có thể điều chỉnh tùy ý)
                    mb: 1,
                }}
            >
                {/* Hàng 1: Nội dung đánh giá và DiscountPaper */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "32px", // Chiều cao cố định cho hàng này
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {renderStars(averageRating)}
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {averageRating.toFixed(1)}
                        </Typography>
                    </Box>
                    {discountValue > 0 ? (
                        <DiscountPaper
                            discountType={discountType}
                            discountValue={discountValue}
                        />
                    ) : (
                        // Placeholder giữ cùng chiều cao khi không có DiscountPaper
                        <Box sx={{ width: "50px", height: "32px" }} />
                    )}
                </Box>

                {/* Hàng 2: Giá sản phẩm */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        height: "32px", // Chiều cao cố định cho hàng này
                    }}
                >
                    {discountedPrice !== originalPrice && (
                        <Typography
                            variant="body2"
                            sx={{
                                textDecoration: "line-through",
                                color: colors.gray[400],
                                whiteSpace: "nowrap",
                            }}
                        >
                            {formatPrice(originalPrice)}
                        </Typography>
                    )}
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: "bold",
                            color:
                                theme.palette.mode === "dark"
                                    ? colors.redAccent[400]
                                    : "#D32F2F",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {formatPrice(discountedPrice)}
                    </Typography>
                </Box>
            </Box>

            {/* Nút Thêm vào giỏ hàng - được đẩy xuống cuối card */}
            <Box sx={{ mt: "auto" }}>
                <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => setOpenAddToCart(true)}
                    fullWidth
                >
                    Thêm vào giỏ hàng
                </Button>
            </Box>

            <AddToCartDialog
                open={openAddToCart}
                onClose={handleCloseAddToCart}
                productId={product.productId}
                discountedPrice={product.discountedPrice}
            />
        </Box>
    );
};

export default ProductCard;
