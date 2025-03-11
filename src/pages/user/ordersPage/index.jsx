import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const OrdersPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang theo dõi các đơn hàng</div>
    );
};

export default OrdersPage;