import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ManageVoucher = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang quản lý voucher</div>
    );
};

export default ManageVoucher;