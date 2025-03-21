import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";

const ViewCategoryImageDialog = ({ open, onClose, category }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết ảnh danh mục</DialogTitle>
      <DialogContent dividers>
        {category && category.imageUrl ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Box
              component="img"
              src={category.imageUrl}
              alt="Ảnh danh mục"
              sx={{ width: "80%", height: "auto", borderRadius: 2, objectFit: "cover" }}
            />
          </Box>
        ) : (
          <Typography variant="body1" align="center">
            Không có ảnh cho danh mục này.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCategoryImageDialog;
