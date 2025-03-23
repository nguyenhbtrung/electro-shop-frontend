import React, { useState, useContext } from "react";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    useMediaQuery,
    useTheme,
    Button,
    Menu,
    MenuItem,
    Divider,
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
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Search } from "../../../../services/filterProductService";

const Navbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const colorMode = useContext(ColorModeContext);
    const { toggled, setToggled } = useContext(ToggledContext);
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const openProfileMenu = Boolean(anchorEl);

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
        if (!isLoggedIn) {
            navigate("/login");
        } else {
            navigate("/cart");
        }
    };

    const handleProfileClick = () => {
        if (!isLoggedIn) {
            navigate("/login");
        } else {
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

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
            {/* Phần bên trái: menu, logo, tiêu đề và tìm kiếm */}
            <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                    sx={{ display: `${isMdDevices ? "flex" : "flex"}` }}
                    onClick={() => setToggled(!toggled)}
                >
                    <MenuOutlined />
                </IconButton>
                <IconButton onClick={() => navigate("/")} disableRipple disableFocusRipple>
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

            {/* Phần bên phải: các icon */}
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={handleCartClick}>
                    <ShoppingCartOutlined />
                </IconButton>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
                </IconButton>
                <IconButton>
                    <NotificationsOutlined />
                </IconButton>

                {isLoggedIn ? (
                    <>
                        <IconButton onClick={handleProfileMenuOpen}>
                            <PersonOutlined />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={openProfileMenu}
                            onClose={handleProfileMenuClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleProfileClick();
                                    handleProfileMenuClose();
                                }}
                            >
                                Hồ sơ
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleOrdersClick();
                                    handleProfileMenuClose();
                                }}
                            >
                                Đơn Hàng
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleHistoryClick();
                                    handleProfileMenuClose();
                                }}
                            >
                                Lịch Sử Duyệt Sản Phẩm
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleReturnsClick();
                                    handleProfileMenuClose();
                                }}
                            >
                                Hoàn Trả
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={() => {
                                    handleLogout();
                                    handleProfileMenuClose();
                                }}
                            >
                                Đăng Xuất
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button variant="text" color={colors.primary[400]} onClick={handleLogin}>
                        Đăng nhập
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Navbar;
