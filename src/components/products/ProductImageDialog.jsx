import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { GetProduct } from '../../services/productService';
import { UpdateProductImage } from '../../services/productImgService';
import { UploadImage } from '../../services/imageService';

const EditProductImagesDialog = ({ open, onClose, productId }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open && productId) {
      setLoading(true);
      GetProduct(productId)
        .then((res) => {
          if (res?.data?.productImages) {
            setImages(res.data.productImages);
          } else {
            setImages([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching product details:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, productId]);

  // Xóa ảnh khỏi danh sách theo productImageId
  const handleRemoveImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.productImageId !== imageId));
  };

  // Khi nhấn nút "Thêm ảnh", kích hoạt file input ẩn
  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý khi chọn file ảnh, upload ảnh để lấy URL và thêm vào danh sách
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('File', file);
    try {
      const res = await UploadImage(formData);
      if (res?.status === 200 && res?.data?.imageUrl) {
        // Tạo đối tượng ảnh mới. Nếu backend tạo id riêng, bạn có thể để id rỗng hoặc tạm thời.
        const newImage = {
          // Dùng Date.now() làm id tạm thời; khi cập nhật, backend sẽ xử lý theo logic riêng.
          productImageId: Date.now(),
          imageUrl: res.data.imageUrl,
        };
        setImages((prev) => [...prev, newImage]);
      } else {
        console.error('Có lỗi xảy ra khi upload ảnh.');
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  // Lưu thay đổi danh sách ảnh bằng cách gọi API update
  const handleSaveChanges = async () => {
    // Giả sử API UpdateProductImage nhận đối tượng có thuộc tính productImages là mảng các ảnh
    const data = {
      productImages: images.map((img) => ({ imageUrl: img.imageUrl })),
    };
    try {
      const res = await UpdateProductImage(productId, data);
      if (res?.status === 200) {
        alert('Cập nhật ảnh thành công!');
        onClose();
      } else {
        alert('Có lỗi xảy ra khi cập nhật ảnh!');
      }
    } catch (err) {
      console.error('Error updating product images:', err);
      alert('Có lỗi xảy ra khi cập nhật ảnh!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chỉnh sửa ảnh sản phẩm</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {images.length === 0 ? (
              <Typography variant="body1">Không có ảnh nào.</Typography>
            ) : (
              <Grid container spacing={2}>
                {images.map((img) => (
                  <Grid item xs={6} sm={4} md={3} key={img.productImageId}>
                    <Card sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={img.imageUrl}
                        alt="Ảnh sản phẩm"
                        sx={{ height: 140, objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          backgroundColor: 'rgba(255,255,255,0.7)',
                        }}
                        onClick={() => handleRemoveImage(img.productImageId)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box mt={2}>
              <Button
                variant="contained"
                startIcon={<AddPhotoAlternateIcon />}
                onClick={handleAddImageClick}
              >
                Thêm ảnh
              </Button>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button onClick={handleSaveChanges} variant="contained" color="primary">
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductImagesDialog;
