import { useTheme, Paper, Typography } from "@mui/material";
import { tokens } from "../../theme";

const DiscountPaper = ({ discountType, discountValue }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const getPaperStyle = (type) => {
        if (type === "Percentage") {
            return { backgroundColor: colors.orange || "#FFA500" };
        }
        if (type === "Flat Amount") {
            return { backgroundColor: colors.red || "#FF0000" };
        }
        return {};
    };

    const getPaperContent = (type, value) => {
        if (type === "Percentage") {
            return `-${value}%`;
        }
        if (type === "Flat Amount") {
            return `-${value}đ`;
        }
        return value;
    };

    return (
        <Paper
            elevation={3}
            sx={{
                ...getPaperStyle(discountType),
                borderRadius: "5px",
                padding: "5px 10px",
                display: "inline-block",
                minWidth: "60px",
                textAlign: "center",
            }}
        >
            <Typography variant="body2" sx={{ color: "#fff", fontWeight: "bold" }}>
                {getPaperContent(discountType, discountValue)}
            </Typography>
        </Paper>
    );
};

export default DiscountPaper;