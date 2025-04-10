import React, { useState, useEffect } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { formatPrice } from '../../utils/formatValue';
import { ProductPricing } from '../../services/attributeService';
import GetRatingByProductId from './ProductRatings';
import Footer from '../Footer';
import DiscountPaper from "../discounts/DiscountPaper";
import ProductCard from "./ProductCard";
import { RecommendProduct } from '../../services/productService';
import AddToCartDialog from "./AddToCartDialog";
import { AddToCart } from '../../services/CartService';

const ProductDetail = ({
  product,
  defaultSelectedAttributes,
  pricingData: initialPricing,
  productId,
}) => {
  // State của trang chi tiết sản phẩm
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState(defaultSelectedAttributes);
  const [pricingData, setPricingData] = useState(initialPricing);
  const [quantity, setQuantity] = useState(1);
  const [openAddToCart, setOpenAddToCart] = useState(false);
  const navigate = useNavigate();

  const handleCloseAddToCart = () => {
    setOpenAddToCart(false);
  };

  const handleAddToCart = async () => {
    if (quantity > product.stock) {
      alert("Sản phẩm không đủ tồn kho");
      return;
    }

    // Include selected attribute IDs with the cart request
    // const selectedAttributeIds = Object.values(selectedAttributes);

    // const res = await AddToCart(product.id, quantity, selectedAttributeIds);
    const res = await AddToCart(productId, quantity);
    if (res?.status === 200 && res?.data) {
      // onClose();
      console.log(">>>check add to cart:", res?.data);
      alert("Thêm vào giỏ hàng thành công");
    }
    else {
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  }

  // State để lưu danh sách sản phẩm được gợi ý
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Call API gợi ý sản phẩm khi productId thay đổi
  useEffect(() => {
    RecommendProduct(productId)
      .then((response) => {
        setRecommendedProducts(response.data);
      })
      .catch((error) => console.error("Error fetching recommendations:", error));
  }, [productId]);

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
      .then((response) => setPricingData(response.data))
      .catch((error) => console.error('Error calculating price:', error));
  };

  // Tăng/giảm số lượng
  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity((prev) => prev + 1);
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Điều hướng ảnh
  const handleNextImage = () => {
    if (product.productImages?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.productImages.length);
    }
  };
  const handlePrevImage = () => {
    if (product.productImages?.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.productImages.length) % product.productImages.length
      );
    }
  };

  // Chọn thumbnail
  const handleThumbnailClick = (index) => setCurrentImageIndex(index);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Box sx={{ maxWidth: '1200px', width: '100%', position: 'relative' }}>
          {/* Hiển thị DiscountPaper ở góc trái đè lên ảnh sản phẩm */}
          {product.discountValue > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 1,
                transform: 'scale(1.2)',
              }}
            >
              <DiscountPaper discountType={product.discountType} discountValue={product.discountValue} />
            </Box>
          )}
          {/* Khối chứa ảnh và thông tin sản phẩm */}
          <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, backgroundColor: '#f9f9f9' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Phần ảnh */}
              <Box>
                <Box
                  sx={{
                    borderRadius: 2,
                    height: '300px',
                    width: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#fff',
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
                          transition: 'all 0.3s ease-in-out',
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
                    // Nếu không có ảnh, hiển thị Box trống có kích thước như ảnh
                    <Box sx={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
                  )}
                </Box>
                {product.productImages && product.productImages.length > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1, flexWrap: 'wrap' }}>
                    {product.productImages.map((img, index) => (
                      <Box
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        sx={{
                          cursor: 'pointer',
                          width: 60,
                          height: 60,
                          border: currentImageIndex === index ? '2px solid #1976d2' : '1px solid #ccc',
                          borderRadius: 2,
                          overflow: 'hidden',
                          opacity: currentImageIndex === index ? 1 : 0.7,
                          transition: 'all 0.2s',
                        }}
                      >
                        <Box
                          component="img"
                          src={img.imageUrl}
                          alt={`Thumbnail ${index}`}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Phần thông tin sản phẩm */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mx: 'auto', color: '#000' }}>
                <Box sx={{ mb: 2, height: '20%' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, color: product.stock === 0 ? 'red' : 'green' }}>
                    Tình trạng: {product.stock === 0 ? 'Hết hàng' : 'Còn hàng'}
                  </Typography>
                </Box>

                {/* Giá và chính sách bán hàng */}
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px dashed #ccc',
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      width: '60%',
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

                    {/* Thuộc tính, số lượng & nút mua */}
                    <Box sx={{ mt: 2 }}>
                      {Object.keys(attributeGroups).length > 0 && (
                        <>
                          {Object.entries(attributeGroups).map(([groupName, details]) => (
                            <Box key={groupName} sx={{ mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {groupName}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {details.map((detail) => {
                                  const isSelected = selectedAttributes[groupName] === detail.attributeDetailId;
                                  return (
                                    <Box
                                      key={detail.attributeDetailId}
                                      onClick={() => handleAttributeChange(groupName, detail.attributeDetailId)}
                                      sx={{
                                        cursor: 'pointer',
                                        p: 2,
                                        border: isSelected ? '2px solid #1976d2' : '1px solid #ccc',
                                        backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                                        transition: 'all 0.2s',
                                        minWidth: '60px',
                                        textAlign: 'center',
                                      }}
                                    >
                                      {detail.value}
                                    </Box>
                                  );
                                })}
                              </Box>
                            </Box>
                          ))}
                        </>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#000' }}>
                          <Typography variant="subtitle1" sx={{ mr: 2 }}>
                            Số lượng:
                          </Typography>
                          <IconButton onClick={handleDecrease} disabled={quantity <= 1} color="primary">
                            <Remove />
                          </IconButton>
                          <Typography sx={{ mx: 1, minWidth: '30px', textAlign: 'center' }}>{quantity}</Typography>
                          <IconButton onClick={handleIncrease} disabled={quantity >= product.stock} color="primary">
                            <Add />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<ShoppingCartIcon />}
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện nổi bọt lên thẻ cha
                            // setOpenAddToCart(true);
                            handleAddToCart();
                          }}
                        >
                          Thêm vào giỏ hàng
                        </Button>
                        <AddToCartDialog
                          open={openAddToCart}
                          onClose={handleCloseAddToCart}
                          productId={product.productId}
                          discountedPrice={product.discountedPrice}
                        />
                        <Button onClick={handleBuyNow} variant="contained" color="primary" disabled={product.stock === 0}>
                          Mua ngay
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  {/* Chính sách bán hàng */}
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid #ccc',
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      width: '40%',
                      height: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        height: '60%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#000' }}>
                        Chính sách bán hàng
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#000' }}>
                        <LocalShipping color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">Miễn phí giao hàng toàn quốc</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#000' }}>
                        <Replay color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">Đổi trả trong 7 ngày</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#000' }}>
                        <Security color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">Bảo hành chính hãng 12 tháng</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#000' }}>
                        <HeadsetMic color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">Tổng đài hỗ trợ 24/7</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ height: '40%' }}>
                      <Box
                        component="img"
                        src="https://theme.hstatic.net/1000288298/1001020793/14/product_banner.jpg?v=1422"
                        sx={{
                          width: '100%',
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Phần mô tả sản phẩm bổ sung */}
          <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#fff' }}>
            <Typography variant="h7" sx={{ fontWeight: 'bold', fontSize: '2rem', color: '#000' }}>
              Mô tả sản phẩm:
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1, color: '#000' }}>
              Thương hiệu:{' '}
              {product.brand ? (
                <Link to={`/brands/${product.brand.brandId}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                  {product.brand.brandName}
                </Link>
              ) : (
                'Không xác định'
              )}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1, color: '#000' }}>
              Danh mục:{' '}
              {product.categories && product.categories.length > 0 ? (
                product.categories.map((cat, index) => (
                  <React.Fragment key={cat.categoryId}>
                    <Link to={`/categories/${cat.categoryId}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                      {cat.name}
                    </Link>
                    {index < product.categories.length - 1 && ', '}
                  </React.Fragment>
                ))
              ) : (
                'Chưa phân loại'
              )}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1, color: '#000' }}>
              Đã bán: {product.unitsSold} sản phẩm
            </Typography>
            {/* Thêm thông tin bổ sung từ product.info */}
            {product.info && (
              <Typography variant="body1" sx={{ mt: 2, color: '#000' }}>
                {product.info}
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 4 }}>
            <GetRatingByProductId productId={productId} />
          </Box>

          {/* Phần gợi ý sản phẩm */}
          {recommendedProducts.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                Các sản phẩm tương tự
              </Typography>
              <Grid container spacing={2}>
                {recommendedProducts.map((prod) => {
                  // Nếu không có trường "images", chuyển đổi từ "productImages"
                  const productForCard = {
                    ...prod,
                    images:
                      prod.images ||
                      (prod.productImages
                        ? prod.productImages.map((pi) => pi.imageUrl)
                        : []),
                  };
                  return (
                    <Grid item xs={12} sm={6} md={3} key={prod.productId}>
                      <ProductCard product={productForCard} />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default ProductDetail;