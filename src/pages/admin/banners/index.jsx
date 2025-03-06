import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const Banner = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý banner</div>
    );
};

export default Banner;