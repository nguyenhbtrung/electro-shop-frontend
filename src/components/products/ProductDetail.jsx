// ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Tooltip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { GetProduct } from '../../services/productService';
import { formatPrice } from '../../utils/formatValue';

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetProduct(productId)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (!product) {
    return <Typography>Product not found.</Typography>;
  }

  const handleNextImage = () => {
    if (product.productImages && product.productImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.productImages.length);
    }
  };

  const handlePrevImage = () => {
    if (product.productImages && product.productImages.length > 0) {
      setCurrentImageIndex((prev) =>
        (prev - 1 + product.productImages.length) % product.productImages.length
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Tên sản phẩm */}
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>

      {/* Thông tin sản phẩm */}
      <Typography variant="body1" gutterBottom>
        {product.info}
      </Typography>

      {/* Khung ảnh sản phẩm với nút chuyển ảnh nếu có nhiều ảnh */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 500,
          height: 500,
          mb: 2,
          border: '1px solid #ccc',
          borderRadius: 2,
        }}
      >
        {product.productImages && product.productImages.length > 0 && (
          <>
            <Box
              component="img"
              src={product.productImages[currentImageIndex].imageUrl}
              alt={product.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
            {product.productImages.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 0,
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </>
            )}
          </>
        )}
      </Box>

      {/* Giá và discount */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {formatPrice(product.discountedPrice)}
        </Typography>
        {product.discountValue > 0 && (
          <Typography
            variant="body2"
            sx={{ textDecoration: 'line-through', color: 'gray' }}
          >
            {formatPrice(product.originalPrice)}
          </Typography>
        )}
        <Box sx={{ mt: 1 }}>
          {product.discountValue > 0 ? (
            <Typography variant="body1" sx={{ color: 'red' }}>
              {product.discountType}: {product.discountValue}
            </Typography>
          ) : (
            <Typography variant="body1">No discount available</Typography>
          )}
        </Box>
      </Box>

      {/* Attribute (chỉ hiển thị các thông tin cần thiết) */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Attributes
        </Typography>
        {product.productAttributeDetail && product.productAttributeDetail.length > 0 ? (
          product.productAttributeDetail.map((attr) => (
            <Box
              key={attr.attributeDetailId}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              <Typography variant="body2">
                {attr.productAttributeName}: {attr.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Modifier: {attr.priceModifier}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No attributes available.</Typography>
        )}
      </Box>

      {/* Brand thông tin */}
      {product.brand && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Brand</Typography>
          <Typography variant="body2">{product.brand.brandName}</Typography>
        </Box>
      )}

      {/* Placeholder cho các phần khác (như đặt hàng, thêm vào giỏ) */}
      <Button variant="contained" color="primary">
        Add to Cart
      </Button>
    </Box>
  );
};

export default ProductDetail;
