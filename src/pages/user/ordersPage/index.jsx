import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ViewUserOrders from "../../../components/orders/ViewUserOrders";

const OrderPage = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ maxWidth: "800px", margin: "32px auto" }}>
      <Button
        variant="outlined"
        sx={{ marginBottom: "16px" }}
        onClick={() => navigate("/")}
      >
        Trang chủ
      </Button>
      <Typography variant="h5" sx={{ marginBottom: "16px", textAlign: "center" }}>
        Danh sách đơn hàng của bạn
      </Typography>
      <ViewUserOrders />
    </Box>
  );
};

export default OrderPage;
