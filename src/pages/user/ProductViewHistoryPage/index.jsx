import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ProductViewHistoryPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang lịch sử duyệt sản phẩm</div>
    );
};

export default ProductViewHistoryPage;