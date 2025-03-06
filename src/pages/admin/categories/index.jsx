import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ManageCategory = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý danh mục sản phẩm</div>
    );
};

export default ManageCategory;