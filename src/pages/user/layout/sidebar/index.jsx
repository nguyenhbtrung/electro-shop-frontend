import React, { useContext, useState } from "react";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
    DashboardOutlined,
    ContactsOutlined,
    PeopleAltOutlined,
    MenuOutlined,
    HomeOutlined,
    SubdirectoryArrowRightOutlined,
    ChevronRightOutlined,
} from "@mui/icons-material";
import logo from "../../../../assets/images/logo.png";
import Item from "./Item";
import { ToggledContext } from "../../AppUser";
import { tokens } from "../../../../theme";

const SideBar = ({ categories }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { toggled, setToggled } = useContext(ToggledContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Hàm render danh mục và các mục con
    const renderCategories = () => {
        // Nếu categories chưa có dữ liệu, hiển thị Loading
        if (!categories || categories.length === 0) {
            return <Typography sx={{ m: "15px 20px" }}>Loading...</Typography>;
        }
        return categories.map((category) => (
            <Box key={category.categoryId} mb={2}>
                <Typography
                    variant="h6"
                    color={colors.gray[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                >
                    {!collapsed && category.name}
                </Typography>
                <Menu
                    menuItemStyles={{
                        button: {
                            ":hover": {
                                color: "#868dfb",
                                background: "transparent",
                                transition: ".4s ease",
                            },
                        },
                    }}
                >
                    {category.childs &&
                        category.childs.map((child) => (
                            <Item
                                key={child.categoryId}
                                title={child.name}
                                path={`/admin/categories/${child.categoryId}`}
                                colors={colors}
                                icon={<ChevronRightOutlined fontSize="small" />}
                            />
                        ))}
                </Menu>
            </Box>
        ));
    };

    return (
        <Sidebar
            backgroundColor={colors.primary[400]}
            rootStyles={{
                border: 0,
                height: "100%",
            }}
            onBackdropClick={() => setToggled(false)}
            toggled={toggled}
            breakPoint="xxl"
        >
            <Menu
                menuItemStyles={{
                    button: { ":hover": { background: "transparent" } },
                }}
            >
                <MenuItem
                    rootStyles={{
                        margin: "10px 0 20px 0",
                        color: colors.gray[100],
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {!collapsed && (
                            <Box
                                display="flex"
                                alignItems="center"
                                gap="12px"
                                sx={{ transition: ".3s ease" }}
                            >
                                <img
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "8px",
                                    }}
                                    src={logo}
                                    alt="Argon"
                                />
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    textTransform="capitalize"
                                    color={colors.greenAccent[500]}
                                >
                                    Argon
                                </Typography>
                            </Box>
                        )}
                        <IconButton onClick={() => setToggled(false)}>
                            <MenuOutlined />
                        </IconButton>
                    </Box>
                </MenuItem>
            </Menu>

            <Box mb={5} pl={collapsed ? undefined : "5%"}>
                {/* Các menu tĩnh khác */}
                <Menu
                    menuItemStyles={{
                        button: {
                            ":hover": {
                                color: "#868dfb",
                                background: "transparent",
                                transition: ".4s ease",
                            },
                        },
                    }}
                >
                    <Item
                        title="Trang chủ"
                        path="/"
                        colors={colors}
                        icon={<HomeOutlined />}
                    />
                </Menu>
                {/* ... Các mục khác */}

                {/* Hiển thị danh mục từ dữ liệu API */}
                {renderCategories()}
            </Box>
        </Sidebar>
    );
};

export default SideBar;
