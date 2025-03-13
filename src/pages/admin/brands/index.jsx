import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ManageBrand= () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý nhãn hàng sản phẩm</div>
    );
};

export default ManageBrand;