import {
    Box,
    IconButton,
    InputBase,
    Typography,
    useMediaQuery,
    useTheme,
    Button,
} from "@mui/material";
import {
    DarkModeOutlined,
    LightModeOutlined,
    MenuOutlined,
    NotificationsOutlined,
    PersonOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
} from "@mui/icons-material";
import { ColorModeContext, tokens } from "../../../../theme";
import { ToggledContext } from "../../AppUser";
import logo from "../../../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Search } from "../../../../services/filterProductService";
import React, { useState, useContext } from "react";
const Navbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const { toggled, setToggled } = useContext(ToggledContext);
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const handleLogin = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleOrdersClick = () => {
        navigate("/orders");
    };

    const handleHistoryClick = () => {
        navigate("/history");
    };

    const handleReturnsClick = () => {
        navigate("/returns");
    };

    const handleCartClick = () => {
        navigate("/cart");
    };

    const handleProfileClick = () => {
        if (!isLoggedIn) {
            navigate("/login");
        }
        else {
            navigate("/profile");
        }
    };
    const handleSearch = () => {
        Search(searchTerm)
            .then((response) => {
                navigate("/search", { state: { results: response.data } });
            })
            .catch((error) => {
                console.error(error);
            });
    };
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
            {/* Phần bên trái: menu, logo, title và tìm kiếm */}
            <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                    sx={{ display: `${isMdDevices ? "flex" : "flex"}` }}
                    onClick={() => setToggled(!toggled)}
                >
                    <MenuOutlined />
                </IconButton>
                <IconButton
                    onClick={() => navigate("/")}
                    disableRipple
                    disableFocusRipple
                >
                    <img
                        style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                        src="https://yt3.googleusercontent.com/ytc/AIdro_kt-sUf4kFDrZ4iaFcyK4EHwVz-jlvQBwjZSA6hQ9ogPEg=s900-c-k-c0x00ffffff-no-rj"
                        alt="Argon"
                    />
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        textTransform="capitalize"
                        color={colors.greenAccent[500]}
                        sx={{ display: `${isXsDevices ? "none" : "flex"}`, ml: "10px" }}
                    >
                        GTG SHOP
                    </Typography>
                </IconButton>

                <Box
                    display="flex"
                    alignItems="center"
                    bgcolor={colors.primary[400]}
                    borderRadius="3px"
                    sx={{
                        display: `${isXsDevices ? "none" : "flex"}`,
                        width: "550px",
                    }}
                >
                    <InputBase
                        placeholder="Search"
                        sx={{ ml: 2, flex: 1 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton type="button" sx={{ p: 1 }} onClick={handleSearch}>
                        <SearchOutlined />
                    </IconButton>
                </Box>
            </Box>

            {/* Phần bên phải: các nút và icon */}
            <Box display="flex" alignItems="center" gap={1}>
                {isLoggedIn && (
                    <>
                        <Button onClick={handleOrdersClick} variant="text" color={colors.primary[400]}>
                            Đơn Hàng
                        </Button>
                        <Button onClick={handleHistoryClick} variant="text" color={colors.primary[400]}>
                            Lịch Sử Duyệt Sản Phẩm
                        </Button>
                        <Button onClick={handleReturnsClick} variant="text" color={colors.primary[400]}>
                            Hoàn Trả
                        </Button>
                    </>
                )}
                <IconButton onClick={handleCartClick}>
                    <ShoppingCartOutlined />
                </IconButton>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <LightModeOutlined />
                    ) : (
                        <DarkModeOutlined />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlined />
                </IconButton>
                <IconButton onClick={handleProfileClick}>
                    <PersonOutlined />
                </IconButton>
                {isLoggedIn ? (
                    <Button
                        variant="text"
                        color={colors.primary[400]}
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                ) : (
                    <Button
                        variant="text"
                        color={colors.primary[400]}
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Navbar;
