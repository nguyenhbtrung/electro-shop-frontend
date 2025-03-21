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
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
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
      setNewFiles([]);
      setRemovedImageIds([]);
    }
  }, [open, productId]);
  const handleRemoveExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.productImageId !== imageId));
    setRemovedImageIds((prev) => [...prev, imageId]);
  };
  const handleRemoveNewFile = (previewUrl) => {
    setNewFiles((prev) => prev.filter((f) => f.previewUrl !== previewUrl));
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  const handleSaveChanges = async () => {
    const postPromises = [];
    if (newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach((fileObj) => {
        formData.append('Images', fileObj.file);
      });
      postPromises.push(CreateProductImage(productId, formData));
    }

    const deletePromises = removedImageIds.map((imageId) => DeleteProductImage(imageId));

    try {
      const results = await Promise.all([...postPromises, ...deletePromises]);
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
