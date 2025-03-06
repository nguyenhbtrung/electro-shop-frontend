import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const Voucher = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý voucher</div>
    );
};

export default Voucher;