// src/pages/user/paymentPage/index.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ViewCheckOut from "../../../components/checkouts/ViewCheckOut";

const PaymentPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: "600px", margin: "32px auto", p: 4, border: "1px solid #ccc", borderRadius: "8px" }}>
      <Button
        variant="outlined"
        sx={{ marginBottom: "16px", border: "none" }}
        onClick={() => navigate("/")}
      >
        Trang chủ
      </Button>
      <Typography variant="h5" sx={{ marginBottom: "16px", textAlign: "center" }}>
        Trang thanh toán
      </Typography>
      <ViewCheckOut />
    </Box>
  );
};

export default PaymentPage;
