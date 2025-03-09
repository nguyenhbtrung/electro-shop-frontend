// HomePage.js
import React from "react";
import { Container, Box, Typography } from "@mui/material";
import ProductCard from "../../../components/products/ProductCard";
import Footer from "../../../components/Footer";

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

// Mẫu dữ liệu sản phẩm bán chạy (5 sản phẩm)
const bestSellingProducts = [
    {
        id: 6,
        name: "Sản phẩm bán chạy 1",
        images: [
            "https://via.placeholder.com/300x300?text=BestSeller+Product+1+-+Image+1",
            "https://via.placeholder.com/300x300?text=BestSeller+Product+1+-+Image+2",
        ],
        originalPrice: 550000,
        discountedPrice: 500000,
        discountType: "Percentage",
        discountValue: 9,
        rating: 4.6,
    },
    {
        id: 7,
        name: "Sản phẩm bán chạy 2",
        images: [
            "https://via.placeholder.com/300x300?text=BestSeller+Product+2+-+Image+1",
            "https://via.placeholder.com/300x300?text=BestSeller+Product+2+-+Image+2",
        ],
        originalPrice: 620000,
        discountedPrice: 580000,
        discountType: "Flat Amount",
        discountValue: 40000,
        rating: 4.8,
    },
    {
        id: 8,
        name: "Sản phẩm bán chạy 3",
        images: [
            "https://via.placeholder.com/300x300?text=BestSeller+Product+3+-+Image+1",
            "https://via.placeholder.com/300x300?text=BestSeller+Product+3+-+Image+2",
        ],
        originalPrice: 750000,
        discountedPrice: 700000,
        discountType: "Percentage",
        discountValue: 7,
        rating: 4.3,
    },
    {
        id: 9,
        name: "Sản phẩm bán chạy 4",
        images: [
            "https://via.placeholder.com/300x300?text=BestSeller+Product+4+-+Image+1",
            "https://via.placeholder.com/300x300?text=BestSeller+Product+4+-+Image+2",
        ],
        originalPrice: 820000,
        discountedPrice: 780000,
        discountType: "Flat Amount",
        discountValue: 40000,
        rating: 4.4,
    },
    {
        id: 10,
        name: "Sản phẩm bán chạy 5",
        images: [
            "https://via.placeholder.com/300x300?text=BestSeller+Product+5+-+Image+1",
            "https://via.placeholder.com/300x300?text=BestSeller+Product+5+-+Image+2",
        ],
        originalPrice: 950000,
        discountedPrice: 900000,
        discountType: "Percentage",
        discountValue: 5,
        rating: 4.9,
    },
];

const HomePage = () => {
    return (
        <>
            <Container sx={{ py: 4 }}>
                {/* Hàng sản phẩm khuyến mãi */}
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Sản phẩm khuyến mãi
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)", // 5 sản phẩm trên 1 hàng
                        gap: 2,
                        mb: 4,
                    }}
                >
                    {promotionProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Box>

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
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Box>
            </Container>

            {/* Footer sẽ xuất hiện ngay sau nội dung trang */}
            <Footer />
        </>
    );
};

export default HomePage;
