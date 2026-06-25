import { useState } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

import "swiper/css";
import "swiper/css/navigation";

const ProductList = ({ products }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    const [swiper, setSwiper] = useState(null);

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const updateNavigationState = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const items =
        products?.length > 0
            ? products
            : Array.from({ length: 5 }, (_, index) => ({
                  productId: index,
                  skeleton: true,
              }));

    // Desktop: Grid
    if (!isMobile) {
        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 2,
                }}
            >
                {items.map((item) =>
                    item.skeleton ? (
                        <ProductCardSkeleton key={item.productId} />
                    ) : (
                        <ProductCard
                            key={item.productId}
                            product={item}
                        />
                    )
                )}
            </Box>
        );
    }

    // Mobile: Carousel
    return (
        <Box sx={{ position: "relative" }}>
            <IconButton
                onClick={() => swiper?.slidePrev()}
                disabled={isBeginning}  
                sx={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    width: 40,
                    height: 40,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: 2,

                    "&:hover": {
                        bgcolor: "grey.100",
                    },
                }}
            >
                <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
                onClick={() => swiper?.slideNext()}
                disabled={isEnd}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    width: 40,
                    height: 40,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: 2,

                    "&:hover": {
                        bgcolor: "grey.100",
                    },
                }}
            >
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>

            <Swiper
                modules={[Navigation, Autoplay]}
                onSwiper={(swiper) => {
                    setSwiper(swiper);
                    updateNavigationState(swiper);
                }}
                onSlideChange={(swiper) => {
                    updateNavigationState(swiper);
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={false}
                spaceBetween={16}
                breakpoints={{
                    0: {
                        slidesPerView: 1.2,
                    },
                    480: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                }}
            >
                {items.map((item) => (
                    <SwiperSlide key={item.productId}>
                        {item.skeleton ? (
                            <ProductCardSkeleton />
                        ) : (
                            <ProductCard product={item} />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default ProductList;