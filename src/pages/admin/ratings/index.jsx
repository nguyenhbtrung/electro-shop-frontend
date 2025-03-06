import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const Rating = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý đánh giá sản phẩm</div>
    );
};

export default Rating;