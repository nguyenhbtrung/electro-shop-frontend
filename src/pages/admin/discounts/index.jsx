import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ManageDiscount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý giảm giá</div>
    );
};

export default ManageDiscount;