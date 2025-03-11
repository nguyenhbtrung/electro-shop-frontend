import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ReturnsPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div>Trang theo dõi các yêu cầu hoàn trả</div>
    );
};

export default ReturnsPage;