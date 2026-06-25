import  { useEffect, useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import Footer from "../../../components/Footer";
import { GetDiscountedProduct, GetProductsByUser } from "../../../services/productService";
import ProductList from "../../../components/products/ProductList";
import BannerSection from "../../../components/banners/BannerSection";

const HomePage = () => {
    const [discountProducts, setDiscountProduct] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

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

        GetDiscountedProductsList();
        GetBestSellingsList();
    }, []);  

    return (
        <>
            <Container sx={{ py: {xs: 2, sm: 4} }}>
                {/* Khu vực Banner Quảng Cáo */}
                <BannerSection />

                {/* Hàng sản phẩm khuyến mãi */}
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", fontSize: "1.5rem" }}>
                    Sản phẩm khuyến mãi
                </Typography>

                <ProductList products={discountProducts} />

                <Box sx={{mb: 4}} />

                {/* Hàng sản phẩm bán chạy */}
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", fontSize: "1.5rem" }}>
                    Sản phẩm bán chạy
                </Typography>

                <ProductList products={bestSellingProducts} /> 
                
            </Container>

            {/* Footer sẽ xuất hiện ngay sau nội dung trang */}
            <Footer />
        </>
    );
};

export default HomePage;
