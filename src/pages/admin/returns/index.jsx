import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ManageReturn = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý hoàn trả đơn hàng</div>
    );
};

export default ManageReturn;