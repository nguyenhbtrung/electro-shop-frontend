import { useTheme, Paper, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { formatNumberValue, formatPrice } from "../../utils/formatValue";

const DiscountPaper = ({ discountType, discountValue }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const getPaperStyle = (type) => {
        if (type === "Percentage") {
            return { backgroundColor: colors.red[500] || "#FF0000", color: "#d0d1d5" };
        }
        if (type === "Flat Amount") {
            return { backgroundColor: colors.orange || "#FFA500", color: "#292929" };
        }
        return {};
    };

    const getPaperContent = (type, value) => {
        if (type === "Percentage") {
            return `-${formatNumberValue(value)}%`;
        }
        if (type === "Flat Amount") {
            return `-${formatPrice(value)}`;
        }
        return value;
    };

    return (
        <Paper
            elevation={3}
            sx={{
                ...getPaperStyle(discountType),
                borderRadius: "5px",
                padding: "5px 5px",
                display: "inline-block",
                minWidth: "60px",
                textAlign: "center",
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {getPaperContent(discountType, discountValue)}
            </Typography>
        </Paper>
    );
};

export default DiscountPaper;