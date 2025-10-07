import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import ProductCard from "../../../components/products/ProductCard";
import Footer from "../../../components/Footer";
import { GetDiscountedProduct, GetProductsByUser } from "../../../services/productService";
import { GetAllBanners } from "../../../services/BannerService";
import ProductCardSkeleton from "../../../components/products/ProductCardSkeleton";

const HomePage = () => {
    // Các state đã có cho sản phẩm:
    const [discountProducts, setDiscountProduct] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    // Thêm state cho banner:
    const [banners, setBanners] = useState([]);

    // Định nghĩa fallback URL (các URL cũ)
    const fallbackBannerLeftUrl =
        "https://t3.ftcdn.net/jpg/04/65/46/52/240_F_465465254_1pN9MGrA831idD6zIBL7q8rnZZpUCQTy.jpg";
    const fallbackBannerTopRightUrl =
        "https://theme.hstatic.net/1000288298/1001020793/14/banner_top_1_img_large.jpg?v=1421";
    const fallbackBannerBottomRightUrl =
        "https://theme.hstatic.net/1000288298/1001020793/14/banner_top_3_img_large.jpg?v=1421";

    useEffect(() => {
        const GetDiscountedProductsList = async () => {
            const res = await GetDiscountedProduct();
            if (res?.status === 200 && res?.data) {
                setDiscountProduct(res.data);
            }
        };

        const GetBestSellingsList = async () => {
            const res = await GetProductsByUser();
            if (res?.status === 200 && res?.data) {
                setBestSellingProducts(res.data);
            }
        };

        const GetBannersData = async () => {
            const res = await GetAllBanners();
            if (res?.status === 200 && res?.data) {
                console.log(">>> check banner:", res.data);
                setBanners(res.data);
            }
        };

        GetDiscountedProductsList();
        GetBestSellingsList();
        GetBannersData();
    }, []);

    // Tách dữ liệu banner theo vị trí:
    const bannerLeft = banners.find((b) => b.position === 0);
    const bannerTopRight = banners.find((b) => b.position === 1);
    const bannerBottomRight = banners.find((b) => b.position === 2);

    return (
        <>
            <Container sx={{ py: 4 }}>
                {/* Khu vực Banner Quảng Cáo */}
                <Box sx={{ mb: 4 }}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            width: "100%",
                            height: "300px", // Chiều cao tổng thể của khu vực banner
                        }}
                    >
                        {/* Banner lớn bên trái */}
                        <Paper
                            component="a"
                            href={bannerLeft?.link || "#"}
                            target="_blank"
                            elevation={3}
                            sx={{
                                flex: 2,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundImage: `url(${(bannerLeft && bannerLeft.imageUrl) || fallbackBannerLeftUrl
                                    })`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                cursor: "pointer",
                                "&:hover": {
                                    opacity: 0.9,
                                },
                            }}
                        >
                            {/* Nội dung banner nếu cần */}
                        </Paper>

                        {/* Hai banner nhỏ bên phải xếp dọc */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                height: "100%",
                            }}
                        >
                            {/* Banner nhỏ trên */}
                            <Paper
                                component="a"
                                href={bannerTopRight?.link || "#"}
                                target="_blank"
                                elevation={3}
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundImage: `url(${(bannerTopRight && bannerTopRight.imageUrl) ||
                                        fallbackBannerTopRightUrl
                                        })`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    cursor: "pointer",
                                    "&:hover": {
                                        opacity: 0.9,
                                    },
                                }}
                            >
                                {bannerTopRight?.title && (
                                    <Typography
                                        variant="h6"
                                        color="white"
                                        sx={{ textShadow: "1px 1px 2px black" }}
                                    >
                                        {bannerTopRight.title}
                                    </Typography>
                                )}
                            </Paper>

                            {/* Banner nhỏ dưới */}
                            <Paper
                                component="a"
                                href={bannerBottomRight?.link || "#"}
                                target="_blank"
                                elevation={3}
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundImage: `url(${(bannerBottomRight && bannerBottomRight.imageUrl) ||
                                        fallbackBannerBottomRightUrl
                                        })`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    cursor: "pointer",
                                    "&:hover": {
                                        opacity: 0.9,
                                    },
                                }}
                            ></Paper>
                        </Box>
                    </Box>
                </Box>

                {/* Hàng sản phẩm khuyến mãi */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
                    >
                        Sản phẩm khuyến mãi
                    </Typography>

                    {import.meta.env.VITE_APP_ENV === "production" && !discountProducts?.length && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                        >
                            (Có thể cần chờ lên tới 50s để tải sản phẩm lần đầu do máy chủ tạm ngưng)
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)", // 5 sản phẩm trên 1 hàng
                        gap: 2,
                        mb: 4,
                    }}
                >

                    {discountProducts?.length > 0
                        ? discountProducts.map(product => <ProductCard key={product.productId} product={product} />)
                        : Array.from(new Array(5)).map((_, index) => <ProductCardSkeleton key={index} />)}
                </Box>

                {/* Hàng sản phẩm bán chạy */}
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", fontSize: "1.5rem" }}>
                    Sản phẩm bán chạy
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: 2,
                    }}
                >
                    {bestSellingProducts?.length > 0
                        ? bestSellingProducts.map(product => <ProductCard key={product.productId} product={product} />)
                        : Array.from(new Array(5)).map((_, index) => <ProductCardSkeleton key={index} />)}
                </Box>
            </Container>

            {/* Footer sẽ xuất hiện ngay sau nội dung trang */}
            <Footer />
        </>
    );
};

export default HomePage;
