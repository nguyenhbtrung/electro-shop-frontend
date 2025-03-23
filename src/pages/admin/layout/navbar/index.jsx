import {
  Box,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../../theme";
import { useContext, useState } from "react";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "../../../../App";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate()

  // State để quản lý vị trí và trạng thái của dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Mở menu khi click vào nút Person
  const handlePersonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Đóng menu

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
      {/* Phần bên trái: Menu và Search */}
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
        <Box
          display="flex"
          alignItems="center"
          bgcolor={colors.primary[400]}
          borderRadius="3px"
          sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
        >
          <InputBase placeholder="Search" sx={{ ml: 2, flex: 1 }} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchOutlined />
          </IconButton>
        </Box>
      </Box>

      {/* Phần bên phải: Các icon điều khiển */}
      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>
        <IconButton>
          <NotificationsOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>
        <IconButton onClick={handlePersonClick}>
          <PersonOutlined />
        </IconButton>
        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => navigate("/")}>Trang người dùng</MenuItem>
          <MenuItem onClick={() => navigate("/profile")}>Hồ sơ</MenuItem>
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
