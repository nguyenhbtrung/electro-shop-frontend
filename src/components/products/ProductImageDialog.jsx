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
import { CreateProductImage, DeleteProductImage } from '../../services/productImgService';

const EditProductImagesDialog = ({ open, onClose, productId }) => {
  const [loading, setLoading] = useState(false);
  // Ảnh hiện có trên backend
  const [existingImages, setExistingImages] = useState([]);
  // Các file mới được chọn (chưa upload)
  const [newFiles, setNewFiles] = useState([]); // [{ file, previewUrl }]
  // Lưu ID của ảnh đã bị xóa (để gọi API DELETE khi lưu thay đổi)
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open && productId) {
      setLoading(true);
      GetProduct(productId)
        .then((res) => {
          if (res?.data?.productImages) {
            setExistingImages(res.data.productImages);
          } else {
            setExistingImages([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching product details:', err);
        })
        .finally(() => {
          setLoading(false);
        });
      // Reset các file mới và mảng xóa khi mở dialog
      setNewFiles([]);
      setRemovedImageIds([]);
    }
  }, [open, productId]);

  // Khi nhấn nút "X" trên ảnh đã có, loại bỏ khỏi state và lưu ID vào removedImageIds
  const handleRemoveExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.productImageId !== imageId));
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  // Xóa file mới khỏi state (chỉ ảnh mới chưa upload)
  const handleRemoveNewFile = (previewUrl) => {
    setNewFiles((prev) => prev.filter((f) => f.previewUrl !== previewUrl));
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Khi chọn file, lưu file và tạo preview URL
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const newFileObjects = fileArray.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setNewFiles((prev) => [...prev, ...newFileObjects]);
  };

  // Khi nhấn "Lưu thay đổi", thực hiện gọi API POST cho các ảnh mới và DELETE cho các ảnh bị xóa
  const handleSaveChanges = async () => {
    // Tạo mảng Promise cho việc upload ảnh mới (POST)
    const postPromises = [];
    if (newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach((fileObj) => {
        formData.append('Images', fileObj.file);
      });
      // Gọi API POST để upload các ảnh mới
      postPromises.push(CreateProductImage(productId, formData));
    }

    // Tạo mảng Promise cho việc xóa ảnh (DELETE)
    const deletePromises = removedImageIds.map((imageId) => DeleteProductImage(imageId));

    try {
      // Chạy song song tất cả Promise
      const results = await Promise.all([...postPromises, ...deletePromises]);
      // Nếu đạt đến đây, nghĩa là tất cả API đã trả về thành công
      alert('Bạn đã thay đổi ảnh của sản phẩm thành công');
      onClose();
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
            {existingImages.length === 0 && newFiles.length === 0 ? (
              <Typography variant="body1">Không có ảnh nào.</Typography>
            ) : (
              <Grid container spacing={2}>
                {existingImages.map((img) => (
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
                        onClick={() => handleRemoveExistingImage(img.productImageId)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
                {newFiles.map((fileObj) => (
                  <Grid item xs={6} sm={4} md={3} key={fileObj.previewUrl}>
                    <Card sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={fileObj.previewUrl}
                        alt="Ảnh mới"
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
                        onClick={() => handleRemoveNewFile(fileObj.previewUrl)}
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
                multiple
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
