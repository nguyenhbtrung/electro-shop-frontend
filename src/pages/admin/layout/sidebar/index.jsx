/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ChatOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  FormatListBulletedOutlined,
  HelpOutlineOutlined,
  KeyboardReturnOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
  TimelineOutlined,
  WavesOutlined,
} from "@mui/icons-material";
import logo from "../../../../assets/images/logo.png";
import Item from "./Item";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { ToggledContext } from "../../../../App";
import { useEffect } from "react";
import { GetUserProfileData } from "../../../../services/UserService";


const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const getUserData = async () => {
    var response = await GetUserProfileData(localStorage.getItem("userName"));
    if (response.status === 200) {
      setUserName(response.data.userName);
      setAvatar(response.data.avatarImg);
    } else {
      alert("Lỗi khi lấy dữ liệu người dùng!");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

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
                  src="https://yt3.googleusercontent.com/ytc/AIdro_kt-sUf4kFDrZ4iaFcyK4EHwVz-jlvQBwjZSA6hQ9ogPEg=s900-c-k-c0x00ffffff-no-rj"
                  alt="Argon"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  GTG Shop
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
            src={avatar}
            sx={{ width: "100px", height: "100px" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              {userName}
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
          <Item
            title="Chat"
            path="/admin/chats"
            colors={colors}
            icon={<ChatOutlined />}
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
            title="Thuộc tính sản phẩm"
            path="/admin/attributes"
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
            icon={<MoveToInboxIcon />}
          />
          <Item
            title="Nhà cung cấp"
            path="/admin/suppliers"
            colors={colors}
            icon={<LocalShippingIcon />}
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
            icon={<ShoppingCart />}
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
            icon={<FormatListBulletedOutlined />}
          />
          <Item
            title="Đơn hàng hoàn trả"
            path="/admin/returns"
            colors={colors}
            icon={<KeyboardReturnOutlined />}
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
