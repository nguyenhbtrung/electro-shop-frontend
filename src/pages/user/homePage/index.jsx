// HomePage.js
import React from "react";
import { Container, Box } from "@mui/material";
import ProductCard from "../../../components/products/ProductCard";

// Mẫu dữ liệu sản phẩm (đảm bảo có 5 sản phẩm)
const sampleProducts = [
    {
        id: 1,
        name: "Sản phẩm 1",
        images: [
            "https://product.hstatic.net/1000288298/product/dsc01951_8ecdc5515e384b1b9a3f43033f1ae715_master.jpg",
            "https://product.hstatic.net/1000288298/product/dsc01962_82292de4a5db421192d46d563989e690_master.jpg"
        ],
        originalPrice: 500000,
        discountedPrice: 400000,
        discountType: "Percentage",
        discountValue: 20,
        rating: 4.5,
    },
    {
        id: 2,
        name: "Sản phẩm 2",
        images: [
            "https://via.placeholder.com/300x300?text=Product+2+-+Image+1",
            "https://via.placeholder.com/300x300?text=Product+2+-+Image+2",
        ],
        originalPrice: 600000,
        discountedPrice: 480000,
        discountType: "Flat Amount",
        discountValue: 120000,
        rating: 4.0,
    },
    {
        id: 3,
        name: "Sản phẩm 3",
        images: [
            "https://via.placeholder.com/300x300?text=Product+3+-+Image+1",
            "https://via.placeholder.com/300x300?text=Product+3+-+Image+2",
        ],
        originalPrice: 700000,
        discountedPrice: 595000,
        discountType: "Percentage",
        discountValue: 15,
        rating: 4.2,
    },
    {
        id: 4,
        name: "Sản phẩm 4",
        images: [
            "https://via.placeholder.com/300x300?text=Product+4+-+Image+1",
            "https://via.placeholder.com/300x300?text=Product+4+-+Image+2",
        ],
        originalPrice: 800000,
        discountedPrice: 680000,
        discountType: "Flat Amount",
        discountValue: 120000,
        rating: 3.8,
    },
    {
        id: 5,
        name: "Sản phẩm 5",
        images: [
            "https://via.placeholder.com/300x300?text=Product+5+-+Image+1",
            "https://via.placeholder.com/300x300?text=Product+5+-+Image+2",
        ],
        originalPrice: 900000,
        discountedPrice: 765000,
        discountType: "Percentage",
        discountValue: 15,
        rating: 4.7,
    },
];

const HomePage = () => {
    return (
        <Container sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)", // tạo 5 cột bằng nhau
                    gap: 2, // khoảng cách giữa các sản phẩm
                }}
            >
                {sampleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Box>
        </Container>
    );
};

export default HomePage;
