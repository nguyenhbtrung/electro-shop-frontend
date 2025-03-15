import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import { GetProduct } from "../../services/productService";

const EditProductImagesDialog = ({ open, onClose, productId }) => {
  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    if (open && productId) {
      setLoading(true);
      GetProduct(productId)
        .then((res) => {
          // Giả sử API trả về thông tin sản phẩm có trường productImages là danh sách ảnh
          if (res?.data?.productImages) {
            setProductImages(res.data.productImages);
          }
        })
        .catch((err) => {
          console.error("Error fetching product details:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, productId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chỉnh sửa ảnh sản phẩm</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : productImages.length > 0 ? (
          <Grid container spacing={2}>
            {productImages.map((img) => (
              <Grid item xs={6} sm={4} md={3} key={img.productImageId}>
                <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    image={img.imageUrl}
                    alt={`Ảnh sản phẩm ${img.productImageId}`}
                    sx={{ height: 140, objectFit: "cover" }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">
            Không tìm thấy ảnh nào cho sản phẩm này.
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

export default EditProductImagesDialog;
