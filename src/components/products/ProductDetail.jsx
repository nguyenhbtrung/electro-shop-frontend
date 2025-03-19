import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
} from '@mui/material';
import {
  Add,
  Remove,
  ArrowBackIos,
  ArrowForwardIos,
  LocalShipping,
  Replay,
  Security,
  HeadsetMic,
} from '@mui/icons-material';
import { formatPrice } from '../../utils/formatValue';
import { ProductPricing } from '../../services/attributeService';
import GetRatingByProductId from './ProductRatings';

const ProductDetail = ({
  product,
  defaultSelectedAttributes,
  pricingData: initialPricing,
  productId,
}) => {
  // Quản lý ảnh hiện tại, thuộc tính chọn, giá và số lượng
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState(defaultSelectedAttributes);
  const [pricingData, setPricingData] = useState(initialPricing);
  const [quantity, setQuantity] = useState(1);

  // Gom các attribute detail theo nhóm (ví dụ: "Ram", "SSD")
  const attributeGroups = product.productAttributeDetail.reduce((acc, detail) => {
    const groupName = detail.productAttributeName;
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(detail);
    return acc;
  }, {});

  // Chọn thuộc tính
  const handleAttributeChange = (groupName, detailId) => {
    const newSelectedAttributes = { ...selectedAttributes, [groupName]: detailId };
    setSelectedAttributes(newSelectedAttributes);

    // Gọi API tính giá mới
    const selectedIds = Object.values(newSelectedAttributes);
    ProductPricing(productId, selectedIds)
      .then((response) => {
        setPricingData(response.data);
      })
      .catch((error) => {
        console.error('Error calculating price:', error);
      });
  };

  // Tăng/giảm số lượng, không vượt quá stock
  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Điều hướng ảnh
  const handleNextImage = () => {
    if (product.productImages?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.productImages.length);
    }
  };
  const handlePrevImage = () => {
    if (product.productImages?.length > 0) {
      setCurrentImageIndex((prev) =>
        (prev - 1 + product.productImages.length) % product.productImages.length
      );
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <Box sx={{ maxWidth: '1200px', width: '100%' }}>
        <Grid container spacing={3}>
          {/* Cột bên trái: Hình ảnh sản phẩm */}
          <Grid item xs={12} md={4.5} >
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
                backgroundColor: '#f9f9f9',
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
                        <ArrowBackIos />
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
                        <ArrowForwardIos />
                      </IconButton>
                    </>
                  )}
                </>
              ) : (
                <Typography>No image available</Typography>
              )}
            </Box>
          </Grid>

          {/* Cột bên phải: Khung thông tin chính */}
          <Grid item xs={12} md={7.5}>
            <Box
              sx={{
                border: '1px solid #ccc',
                borderRadius: 2,
                p: 2,backgroundColor: '#f9f9f9',
              }}
            >
              {/* Row 1: Tên sản phẩm + tình trạng */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                  {product.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    color: product.stock === 0 ? 'red' : 'green',
                  }}
                >
                  Tình trạng: {product.stock === 0 ? 'Hết hàng' : 'Còn hàng'}
                </Typography>
              </Box>

              {/* Row 2: Giá + Chính sách bán hàng (trên cùng 1 dòng) */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Giá bên trái */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px dashed #ccc',
                      borderRadius: 2,
                      display: 'inline-block',
                      width: '250px',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'red', fontWeight: 'bold' }}>
                      Giá: {formatPrice(pricingData.discountedPrice)}
                    </Typography>
                    {pricingData.discountValue > 0 && (
                      <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
                        {formatPrice(pricingData.originalPrice)}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Chính sách bên phải */}
                <Grid item xs={12} md={4} sx={{ ml: 'auto' }}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid #ccc',
                      borderRadius: 2,
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Chính sách bán hàng
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalShipping color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">Miễn phí giao hàng toàn quốc</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Replay color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">Đổi trả trong 7 ngày</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Security color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">Bảo hành chính hãng 12 tháng</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HeadsetMic color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">Tổng đài hỗ trợ 24/7</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Row 3: Thuộc tính (RAM, SSD, ...) + Số lượng + Nút mua */}
              <Box sx={{ mb: 3,mt: -12 }}>
                {/* Các nhóm thuộc tính */}
                {Object.entries(attributeGroups).map(([groupName, details]) => (
                  <Box sx={{ mb: 2 }} key={groupName}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                      component="div"
                    >
                      {groupName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {details.map((detail) => {
                        const isSelected =
                          selectedAttributes[groupName] === detail.attributeDetailId;
                        return (
                          <Box 
                            key={detail.attributeDetailId}
                            onClick={() =>
                              handleAttributeChange(groupName, detail.attributeDetailId)
                            }
                            sx={{
                              cursor: 'pointer',
                              p: 2,
                              borderRadius: 1,
                              border: isSelected ? '2px solid #1976d2' : '1px solid #ccc',
                              backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                              transition: 'all 0.2s',
                              width: '76px',
                            }}
                          >
                            {detail.value}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                ))}

                {/* Số lượng + Nút Thêm vào giỏ, Mua ngay */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {/* Chọn số lượng */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ mr: 2 }}>
                      Số lượng:
                    </Typography>
                    <IconButton
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      color="primary"
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ mx: 1, minWidth: '30px', textAlign: 'center' }}>
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={handleIncrease}
                      disabled={quantity >= product.stock}
                      color="primary"
                    >
                      <Add />
                    </IconButton>
                  </Box>

                  {/* Nút Thêm vào giỏ và Mua ngay */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="error" disabled={product.stock === 0}>
                      Thêm vào giỏ
                    </Button>
                    <Button variant="contained" color="primary" disabled={product.stock === 0}>
                      Mua ngay
                    </Button>
                  </Box>
                </Box>
              </Box>

            </Box>
          </Grid>
        </Grid>

        {/* Thông tin thương hiệu, danh mục, đã bán (bên dưới) */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px solid #ccc',
            borderRadius: 2,
            backgroundColor: '#fff',
          }}
        >
          <Typography variant="h7" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
            Mô tả sản phẩm:
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Thương hiệu: {product.brand?.brandName || 'Không xác định'}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Danh mục:{' '}
            {product.categories && product.categories.length > 0
              ? product.categories.map((cat) => cat.name).join(', ')
              : 'Chưa phân loại'}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Đã bán: {product.unitsSold} sản phẩm
          </Typography>
        </Box>

        {/* Hiển thị đánh giá (nếu cần) */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <GetRatingByProductId productId={productId} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetail;
