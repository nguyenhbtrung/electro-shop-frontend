import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import ProductCard from "../../../components/products/ProductCard";
import Footer from "../../../components/Footer";
import { GetDiscountedProduct, GetProductsByUser } from "../../../services/productService";

// Mẫu dữ liệu sản phẩm khuyến mãi (5 sản phẩm)
const promotionProducts = [
    {
        id: 1,
        name: "Sản phẩm khuyến mãi 1",
        images: [
            "https://via.placeholder.com/300x300?text=Promo+Product+1+-+Image+1",
            "https://via.placeholder.com/300x300?text=Promo+Product+1+-+Image+2",
        ],
        originalPrice: 500000,
        discountedPrice: 400000,
        discountType: "Percentage",
        discountValue: 20,
        rating: 4.5,
    },
    {
        id: 2,
        name: "Sản phẩm khuyến mãi 2",
        images: [
            "https://via.placeholder.com/300x300?text=Promo+Product+2+-+Image+1",
            "https://via.placeholder.com/300x300?text=Promo+Product+2+-+Image+2",
        ],
        originalPrice: 600000,
        discountedPrice: 480000,
        discountType: "Flat Amount",
        discountValue: 120000,
        rating: 4.0,
    },
    {
        id: 3,
        name: "Sản phẩm khuyến mãi 3",
        images: [
            "https://via.placeholder.com/300x300?text=Promo+Product+3+-+Image+1",
            "https://via.placeholder.com/300x300?text=Promo+Product+3+-+Image+2",
        ],
        originalPrice: 700000,
        discountedPrice: 595000,
        discountType: "Percentage",
        discountValue: 15,
        rating: 4.2,
    },
    {
        id: 4,
        name: "Sản phẩm khuyến mãi 4",
        images: [
            "https://via.placeholder.com/300x300?text=Promo+Product+4+-+Image+1",
            "https://via.placeholder.com/300x300?text=Promo+Product+4+-+Image+2",
        ],
        originalPrice: 800000,
        discountedPrice: 680000,
        discountType: "Flat Amount",
        discountValue: 120000,
        rating: 3.8,
    },
    {
        id: 5,
        name: "Sản phẩm khuyến mãi 5",
        images: [
            "https://via.placeholder.com/300x300?text=Promo+Product+5+-+Image+1",
            "https://via.placeholder.com/300x300?text=Promo+Product+5+-+Image+2",
        ],
        originalPrice: 900000,
        discountedPrice: 765000,
        discountType: "Percentage",
        discountValue: 15,
        rating: 4.7,
    },
];

const HomePage = () => {
    const [discountProducts, setDiscountProduct] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    useEffect(() => {
        const GetDiscountedProductsList = async () => {
            const res = await GetDiscountedProduct();
            if (res?.status === 200 && res?.data) {
                console.log("check discounted: ", res.data)
                setDiscountProduct(res?.data);
            }
        }

        const GetBestSellingsList = async () => {
            const res = await GetProductsByUser();
            if (res?.status === 200 && res?.data) {
                setBestSellingProducts(res?.data);
            }
        }

        GetDiscountedProductsList();
        GetBestSellingsList();
    }, []);

    return (
        <>
            <Container sx={{ py: 4 }}>
                {/* Khu vực Banner Quảng Cáo */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{
                        display: "flex",
                        gap: 2,
                        width: "100%",
                        height: "300px" // Chiều cao tổng thể của khu vực banner
                    }}>
                        {/* Banner lớn bên trái */}
                        <Paper
                            elevation={3}
                            sx={{
                                flex: 2,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundImage: "url(https://t3.ftcdn.net/jpg/04/65/46/52/240_F_465465254_1pN9MGrA831idD6zIBL7q8rnZZpUCQTy.jpg)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                cursor: "pointer",
                                "&:hover": {
                                    opacity: 0.9
                                }
                            }}
                        >
                            {/* <Typography variant="h4" color="white" sx={{ textShadow: "1px 1px 2px black" }}>
                                Khuyến Mãi Đặc Biệt
                            </Typography> */}
                        </Paper>

                        {/* Hai banner nhỏ bên phải xếp dọc */}
                        <Box sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            height: "100%"
                        }}>
                            {/* Banner nhỏ trên */}
                            <Paper
                                elevation={3}
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundImage: "url(https://theme.hstatic.net/1000288298/1001020793/14/banner_top_1_img_large.jpg?v=1421)",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    cursor: "pointer",
                                    "&:hover": {
                                        opacity: 0.9
                                    }
                                }}
                            >
                                {/* <Typography variant="h6" color="white" sx={{ textShadow: "1px 1px 2px black" }}>
                                    Sản Phẩm Mới
                                </Typography> */}
                            </Paper>

                            {/* Banner nhỏ dưới */}
                            <Paper
                                elevation={3}
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundImage: "url(https://theme.hstatic.net/1000288298/1001020793/14/banner_top_3_img_large.jpg?v=1421)",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    cursor: "pointer",
                                    "&:hover": {
                                        opacity: 0.9
                                    }
                                }}
                            >
                                {/* <Typography variant="h6" color="white" sx={{ textShadow: "1px 1px 2px black" }}>
                                    Giảm Giá Cuối Tuần
                                </Typography> */}
                            </Paper>
                        </Box>
                    </Box>
                </Box>

                {/* Hàng sản phẩm khuyến mãi */}
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Sản phẩm khuyến mãi
                </Typography>
                {discountProducts?.length > 0 && (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)", // 5 sản phẩm trên 1 hàng
                            gap: 2,
                            mb: 4,
                        }}
                    >
                        {discountProducts?.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </Box>
                )}


                {/* Hàng sản phẩm bán chạy */}
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Sản phẩm bán chạy
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: 2,
                    }}
                >
                    {bestSellingProducts.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </Box>
            </Container>

            {/* Footer sẽ xuất hiện ngay sau nội dung trang */}
            <Footer />
        </>
    );
};

export default HomePage;