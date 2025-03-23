import React, { useContext, useState } from "react";
import { Box, IconButton, Typography, useTheme, Divider } from "@mui/material";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import {
  MenuOutlined,
  HomeOutlined,
  ChevronRightOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
} from "@mui/icons-material";
import logo from "../../../../assets/images/logo.png";
import Item from "./Item";
import { ToggledContext } from "../../AppUser";
import { tokens } from "../../../../theme";

const SideBar = ({ categories, brands }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State lưu trữ danh sách category cha đang mở rộng
  const [expandedCategories, setExpandedCategories] = useState({});

  // Hàm toggle hiển thị category con cho category cha
  const handleToggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Hàm render danh mục cha và danh mục con (ẩn child ban đầu)
  const renderCategories = () => {
    if (!categories || categories.length === 0) {
      return (
        <Typography sx={{ m: "15px 20px" }}>Loading...</Typography>
      );
    }
    return categories.map((category) => (
      <Box key={category.categoryId} mb={2}>
        {/* Danh mục cha */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            m: "15px 20px 5px 20px",
            cursor: category.childs && category.childs.length > 0 ? "pointer" : "default",
          }}
          onClick={() => {
            if (category.childs && category.childs.length > 0) {
              handleToggleCategory(category.categoryId);
            }
          }}
        >
          <Typography variant="h6" color={colors.gray[300]}>
            {!collapsed && category.name}
          </Typography>
          {category.childs && category.childs.length > 0 && !collapsed && (
            expandedCategories[category.categoryId] ? (
              <ExpandLessOutlined fontSize="small" sx={{ color: colors.gray[300] }} />
            ) : (
              <ExpandMoreOutlined fontSize="small" sx={{ color: colors.gray[300] }} />
            )
          )}
        </Box>
        {/* Danh sách con: chỉ hiển thị khi được mở rộng */}
        {expandedCategories[category.categoryId] && category.childs && (
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
            {category.childs.map((child) => (
              <Item
                key={child.categoryId}
                title={child.name}
                path={`/categories/${child.categoryId}`}
                colors={colors}
                icon={<ChevronRightOutlined fontSize="small" />}
              />
            ))}
          </Menu>
        )}
      </Box>
    ));
  };

  // Hàm render danh sách thương hiệu (không thay đổi)
  const renderBrands = () => {
    if (!brands || brands.length === 0) {
      return (
        <Typography sx={{ m: "15px 20px" }}>
          Loading brands...
        </Typography>
      );
    }
    return (
      <Box>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed && "Thương hiệu"}
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
          {brands.map((brand) => (
            <Item
              key={brand.brandId}
              title={brand.brandName}
              path={`/brands/${brand.brandId}`} // Giả sử route là /brands/:brandId
              colors={colors}
              icon={<ChevronRightOutlined fontSize="small" />}
            />
          ))}
        </Menu>
      </Box>
    );
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
        {/* Menu tĩnh, ví dụ: Trang chủ */}
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

        {/* Render danh mục từ dữ liệu API (chỉ hiển thị danh mục cha, mở rộng khi click) */}
        {renderCategories()}

        {/* Gạch ngăn cách danh mục & thương hiệu */}
        {!collapsed && (
          <Divider
            sx={{
              borderColor: colors.gray[600],
              mx: 2,
              my: 1,
            }}
          />
        )}

        {/* Render thương hiệu từ dữ liệu API */}
        {renderBrands()}
      </Box>
    </Sidebar>
  );
};

export default SideBar;
