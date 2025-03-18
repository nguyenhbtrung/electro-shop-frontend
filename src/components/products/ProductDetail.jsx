// ProductDetail.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { formatPrice } from '../../utils/formatValue';
import { ProductPricing } from '../../services/attributeService';

const ProductDetail = ({ product, defaultSelectedAttributes, pricingData: initialPricing, productId }) => {
  // Không cần fetch lại product vì đã được truyền từ wrapper
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState(defaultSelectedAttributes);
  const [pricingData, setPricingData] = useState(initialPricing);

  // Gom các attribute detail theo nhóm (ví dụ: "Ram", "SSD")
  const attributeGroups = product.productAttributeDetail.reduce((acc, detail) => {
    const groupName = detail.productAttributeName;
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(detail);
    return acc;
  }, {});

  // Hàm cập nhật khi chọn radio
  const handleAttributeChange = (groupName, detailId) => {
    const newSelectedAttributes = { ...selectedAttributes, [groupName]: detailId };
    setSelectedAttributes(newSelectedAttributes);

    // Lấy mảng các id từ object
    const selectedIds = Object.values(newSelectedAttributes);
    ProductPricing(productId, selectedIds)
      .then(response => {
        setPricingData(response.data);
      })
      .catch(error => {
        console.error("Error calculating price:", error);
      });
  };

  // Điều hướng ảnh (nếu có nhiều ảnh)
  const handleNextImage = () => {
    if (product.productImages && product.productImages.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % product.productImages.length);
    }
  };

  const handlePrevImage = () => {
    if (product.productImages && product.productImages.length > 0) {
      setCurrentImageIndex(prev =>
        (prev - 1 + product.productImages.length) % product.productImages.length
      );
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <Box sx={{ maxWidth: '1200px', width: '100%' }}>
        <Grid container spacing={4}>
          {/* Cột trái: Hộp ảnh sản phẩm */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: '1px solid #ccc',
                borderRadius: 2,
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {product.productImages && product.productImages.length > 0 ? (
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
              ) : (
                <Typography>No image available</Typography>
              )}
            </Box>
          </Grid>

          {/* Cột phải: Thông tin sản phẩm */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              {product.name}
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Tình trạng: 
            </Typography>

            {/* Giá sản phẩm từ API pricing */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ color: 'red', fontWeight: 'bold' }}>
                {formatPrice(pricingData.discountedPrice)}
              </Typography>
              {pricingData.discountValue > 0 && (
                <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
                  {formatPrice(pricingData.originalPrice)}
                </Typography>
              )}
            </Box>

            {/* Các nhóm thuộc tính với radio button */}
            {Object.entries(attributeGroups).map(([groupName, details]) => (
              <Box sx={{ mb: 2 }} key={groupName}>
                <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {groupName}
                </FormLabel>
                <RadioGroup
                  row
                  value={selectedAttributes[groupName] || ''}
                  onChange={(e) => handleAttributeChange(groupName, parseInt(e.target.value))}
                >
                  {details.map(detail => (
                    <FormControlLabel
                      key={detail.attributeDetailId}
                      value={detail.attributeDetailId}
                      control={<Radio />}
                      label={`${detail.value}`}
                    />
                  ))}
                </RadioGroup>
              </Box>
            ))}

            {/* Nút Thêm vào giỏ hàng và Mua ngay */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button variant="contained" color="error">
                Thêm vào giỏ hàng
              </Button>
              <Button variant="contained" color="primary">
                Mua ngay
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetail;
