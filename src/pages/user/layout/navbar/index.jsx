import {
    Box,
    IconButton,
    InputBase,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useContext } from "react";
import {
    DarkModeOutlined,
    LightModeOutlined,
    MenuOutlined,
    NotificationsOutlined,
    PersonOutlined,
    SearchOutlined,
    SettingsOutlined,
} from "@mui/icons-material";
import { ColorModeContext, tokens } from "../../../../theme";
import { ToggledContext } from "../../AppUser";
import logo from "../../../../assets/images/logo.png";

const Navbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const { toggled, setToggled } = useContext(ToggledContext);
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const colors = tokens(theme.palette.mode);
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
        >
            <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                    sx={{ display: `${isMdDevices ? "flex" : "flex"}` }}
                    onClick={() => setToggled(!toggled)}
                >
                    <MenuOutlined />
                </IconButton>
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
                    sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
                >
                    Argon
                </Typography>
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

            <Box>
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
                <IconButton>
                    <SettingsOutlined />
                </IconButton>
                <IconButton>
                    <PersonOutlined />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Navbar;
