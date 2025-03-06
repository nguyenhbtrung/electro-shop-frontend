import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const Order = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý đơn hàng</div>
    );
};

export default Order;