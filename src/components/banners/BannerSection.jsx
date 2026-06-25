import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import { GetAllBanners } from "../../services/BannerService";

import "swiper/css";
import "swiper/css/pagination";

const BannerSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [banners, setBanners] = useState([]);
    // const [swiper, setSwiper] = useState(null);

    const fallbackBannerLeftUrl =
        "https://t3.ftcdn.net/jpg/04/65/46/52/240_F_465465254_1pN9MGrA831idD6zIBL7q8rnZZpUCQTy.jpg";

    const fallbackBannerTopRightUrl =
        "https://theme.hstatic.net/1000288298/1001020793/14/banner_top_1_img_large.jpg?v=1421";

    const fallbackBannerBottomRightUrl =
        "https://theme.hstatic.net/1000288298/1001020793/14/banner_top_3_img_large.jpg?v=1421";

    useEffect(() => {
        const getBannersData = async () => {
            const res = await GetAllBanners();

            if (res?.status === 200 && res?.data) {
                setBanners(res.data);
            }
        };

        getBannersData();
    }, []);

    const bannerLeft = banners.find((b) => b.position === 0);
    const bannerTopRight = banners.find((b) => b.position === 1);
    const bannerBottomRight = banners.find((b) => b.position === 2);

    const mobileSlides = [
        {
            ...bannerLeft,
            imageUrl: bannerLeft?.imageUrl || fallbackBannerLeftUrl,
        },
        {
            ...bannerTopRight,
            imageUrl:
                bannerTopRight?.imageUrl || fallbackBannerTopRightUrl,
        },
        {
            ...bannerBottomRight,
            imageUrl:
                bannerBottomRight?.imageUrl ||
                fallbackBannerBottomRightUrl,
        },
    ];

    // =====================
    // MOBILE
    // =====================
    if (isMobile) {
        return (
            <Box
                sx={{
                    position: "relative",
                    mb: 4,
                }}
            >
                {/* <IconButton
                    onClick={() => swiper?.slidePrev()}
                    sx={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        bgcolor: "background.paper",
                        boxShadow: 2,

                        "&:hover": {
                            bgcolor: "background.paper",
                        },
                    }}
                >
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>

                <IconButton
                    onClick={() => swiper?.slideNext()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        bgcolor: "background.paper",
                        boxShadow: 2,

                        "&:hover": {
                            bgcolor: "background.paper",
                        },
                    }}
                >
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton> */}

                <Swiper
                    modules={[Autoplay, Pagination]}
                    // onSwiper={setSwiper}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    loop
                    slidesPerView={1}
                >
                    {mobileSlides.map((banner, index) => (
                        <SwiperSlide key={index}>
                            <Paper
                                component="a"
                                href={banner?.link || "#"}
                                target="_blank"
                                elevation={3}
                                sx={{
                                    position: "relative",
                                    overflow: "hidden",
                                    aspectRatio: "16 / 4",
                                    borderRadius: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={banner.imageUrl}
                                    alt={banner?.title || "Banner"}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />

                                {banner?.title && (
                                    <Typography
                                        variant="h6"
                                        color="white"
                                        sx={{
                                            position: "absolute",
                                            left: 16,
                                            bottom: 16,
                                            textShadow:
                                                "1px 1px 4px rgba(0,0,0,.7)",
                                        }}
                                    >
                                        {banner.title}
                                    </Typography>
                                )}
                            </Paper>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
        );
    }

    // =====================
    // DESKTOP
    // =====================
    return (
        <Box sx={{ mb: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    width: "100%",
                    aspectRatio: "16 / 4",
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
                        overflow: "hidden",
                        borderRadius: 2,
                    }}
                >
                    <Box
                        component="img"
                        src={
                            bannerLeft?.imageUrl ||
                            fallbackBannerLeftUrl
                        }
                        alt={bannerLeft?.title || "Banner"}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform .3s ease",
                        }}
                    />
                </Paper>

                {/* 2 banner bên phải */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Paper
                        component="a"
                        href={bannerTopRight?.link || "#"}
                        target="_blank"
                        elevation={3}
                        sx={{
                            flex: 1,
                            overflow: "hidden",
                            borderRadius: 2,
                            position: "relative",
                        }}
                    >
                        <Box
                            component="img"
                            src={
                                bannerTopRight?.imageUrl ||
                                fallbackBannerTopRightUrl
                            }
                            alt={bannerTopRight?.title || "Banner"}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />

                        {bannerTopRight?.title && (
                            <Typography
                                variant="h6"
                                color="white"
                                sx={{
                                    position: "absolute",
                                    left: 16,
                                    bottom: 16,
                                    textShadow:
                                        "1px 1px 4px rgba(0,0,0,.7)",
                                }}
                            >
                                {bannerTopRight.title}
                            </Typography>
                        )}
                    </Paper>

                    <Paper
                        component="a"
                        href={bannerBottomRight?.link || "#"}
                        target="_blank"
                        elevation={3}
                        sx={{
                            flex: 1,
                            overflow: "hidden",
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            component="img"
                            src={
                                bannerBottomRight?.imageUrl ||
                                fallbackBannerBottomRightUrl
                            }
                            alt={bannerBottomRight?.title || "Banner"}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default BannerSection;