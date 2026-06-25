import { Box, Button, Typography, useTheme } from "@mui/material";
import { HomeOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";

const NotFound = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        px: 3,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 600,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "5rem", md: "8rem" },
            fontWeight: 800,
            color: colors.blueAccent[500],
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h3"
          sx={{
            color: colors.gray[100],
            fontWeight: 600,
            mb: 2,
          }}
        >
          Không tìm thấy trang
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: colors.gray[400],
            mb: 4,
          }}
        >
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </Typography>

        <Button
          variant="contained"
          startIcon={<HomeOutlined />}
          onClick={() => navigate("/")}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: "10px",
            backgroundColor: colors.greenAccent[500],
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: colors.greenAccent[600],
            },
          }}
        >
          Quay lại trang chủ
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;