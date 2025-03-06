import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ManageProduct = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý sản phẩm</div>
    );
};

export default ManageProduct;