import React from "react";
import { Box, Container, Typography, Link, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Footer = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: colors.primary[400], // sử dụng màu nền theo token
                color: colors.gray[100], // sử dụng màu chữ theo token để đảm bảo độ tương phản cao
                py: 4,
                px: 2,
                mt: 4,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Mục "Về trang web" */}
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: "250px",
                            mb: 2,
                            "&:not(:last-child)": { mr: 2 }, // thêm margin right cho các mục không phải mục cuối
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Về trang web
                        </Typography>
                        <Typography variant="body2">
                            Trang web của chúng tôi chuyên cung cấp thông tin và sản phẩm chất lượng, giúp
                            bạn dễ dàng tìm kiếm, so sánh và mua sắm những sản phẩm ưng ý. Chúng tôi cam kết
                            đem lại trải nghiệm mua sắm trực tuyến tiện lợi và an toàn.
                        </Typography>
                    </Box>

                    {/* Mục "Thông tin liên hệ" */}
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: "250px",
                            mb: 2,
                            "&:not(:last-child)": { mr: 2 },
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Thông tin liên hệ
                        </Typography>
                        <Typography variant="body2">
                            Địa chỉ: Số 123, Đường ABC, Thành phố XYZ <br />
                            Email:{" "}
                            <Link href="mailto:contact@example.com" color="inherit" underline="hover">
                                contact@example.com
                            </Link>{" "}
                            <br />
                            Điện thoại:{" "}
                            <Link href="tel:+01234567890" color="inherit" underline="hover">
                                (0123) 456-7890
                            </Link>
                        </Typography>
                    </Box>

                    {/* Mục "Chính sách" */}
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: "250px",
                            mb: 2,
                            // Mục cuối không cần margin right
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Chính sách
                        </Typography>
                        <Typography variant="body2">
                            <Link href="#" color="inherit" underline="hover">
                                Chính sách bảo mật
                            </Link>
                            <br />
                            <Link href="#" color="inherit" underline="hover">
                                Chính sách giao hàng
                            </Link>
                            <br />
                            <Link href="#" color="inherit" underline="hover">
                                Điều khoản sử dụng
                            </Link>
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    © {new Date().getFullYear()} Bản quyền.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
