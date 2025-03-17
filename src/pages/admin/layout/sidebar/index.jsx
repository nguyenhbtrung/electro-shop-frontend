/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
} from "@mui/icons-material";
import avatar from "../../../../assets/images/avatar.png";
import logo from "../../../../assets/images/logo.png";
import Item from "./Item";
import { ToggledContext } from "../../../../App";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
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
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
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
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          <Avatar
            alt="avatar"
            src={"https://avatars.githubusercontent.com/u/133494882?v=4"}
            sx={{ width: "100px", height: "100px" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              Tony Sonrk
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              Admin
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
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
            title="Dashboard"
            path="/admin"
            colors={colors}
            icon={<DashboardOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Người dùng" : " "}
        </Typography>{" "}
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
            title="Người dùng"
            path="/admin/users"
            colors={colors}
            icon={<PeopleAltOutlined />}
          />

        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Sản phẩm" : " "}
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
          <Item
            title="Sản phẩm"
            path="/admin/products"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Danh mục"
            path="/admin/categories"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Nhãn hàng"
            path="/admin/brands"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Đánh giá"
            path="/admin/ratings"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Nhập hàng"
            path="/admin/stockimports"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Nhà cung cấp"
            path="/admin/suppliers"
            colors={colors}
            icon={<ContactsOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Đơn hàng" : " "}
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
          <Item
            title="Đơn hàng"
            path="/admin/orders"
            colors={colors}
            icon={<ContactsOutlined />}
          />
        </Menu>

        <Typography
          variant="h"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Hoàn trả" : " "}
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
          <Item
            title="Lý do hoàn trả"
            path="/admin/reasons"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Đơn hàng hoàn trả"
            path="/admin/returns"
            colors={colors}
            icon={<ContactsOutlined />}
          />
        </Menu>


        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Khuyến mãi" : " "}
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
          <Item
            title="Giảm giá"
            path="/admin/discounts"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Voucher"
            path="/admin/vouchers"
            colors={colors}
            icon={<ContactsOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Khác" : " "}
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
          <Item
            title="Banner"
            path="/admin/banners"
            colors={colors}
            icon={<ContactsOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Template" : " "}
        </Typography>{" "}
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
            title="Contacts Information"
            path="/admin/contacts"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Invoices Balances"
            path="/admin/invoices"
            colors={colors}
            icon={<ReceiptOutlined />}
          />

          <Item
            title="Profile Form"
            path="/admin/form"
            colors={colors}
            icon={<PersonOutlined />}
          />
          <Item
            title="Calendar"
            path="/admin/calendar"
            colors={colors}
            icon={<CalendarTodayOutlined />}
          />
          <Item
            title="FAQ Page"
            path="/admin/faq"
            colors={colors}
            icon={<HelpOutlineOutlined />}
          />

          <Item
            title="Bar Chart"
            path="/admin/bar"
            colors={colors}
            icon={<BarChartOutlined />}
          />
          <Item
            title="Pie Chart"
            path="/admin/pie"
            colors={colors}
            icon={<DonutLargeOutlined />}
          />
          <Item
            title="Line Chart"
            path="/admin/line"
            colors={colors}
            icon={<TimelineOutlined />}
          />
          <Item
            title="Geography Chart"
            path="/admin/geography"
            colors={colors}
            icon={<MapOutlined />}
          />
          <Item
            title="Stream Chart"
            path="/admin/stream"
            colors={colors}
            icon={<WavesOutlined />}
          />
        </Menu>

      </Box>
    </Sidebar>
  );
};

export default SideBar;
