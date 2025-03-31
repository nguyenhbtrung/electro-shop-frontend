import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Typography,
    Button,
    IconButton,
    Box,
    Divider,
    Link,
    Stack,
    styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { GetProduct } from '../../services/productService';
import { AddToCart } from '../../services/CartService';
import { ProductPricing } from '../../services/attributeService';
import { useNavigate } from 'react-router-dom';

// Styled components
const StrikethroughText = styled(Typography)({
    textDecoration: 'line-through',
    color: '#666',
    marginRight: 8,
});

const DiscountText = styled(Typography)({
    color: '#e53935',
    fontWeight: 'bold',
});

const SavingsText = styled(Typography)({
    color: '#2e7d32',
    marginLeft: 8,
});

const QuantityButton = styled(IconButton)({
    border: '1px solid #ddd',
    borderRadius: 4,
});

const QuantityInput = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    border: '1px solid #ddd',
    borderRadius: 4,
    margin: '0 8px',
});

const ActionButton = styled(Button)(({ primary }) => ({
    padding: '10px 16px',
    fontWeight: 'bold',
    textTransform: 'none',
    ...(primary && {
        backgroundColor: '#f57c00',
        '&:hover': {
            backgroundColor: '#ef6c00',
        },
    }),
}));

const MainImageContainer = styled(Box)({
    position: 'relative',
    height: 350,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
});

const MainImage = styled('img')({
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
});

const ThumbnailContainer = styled(Box)({
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    padding: '8px 0',
    '&::-webkit-scrollbar': {
        height: 6,
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: 3,
    },
});

const Thumbnail = styled(Box)(({ active }) => ({
    width: 60,
    height: 60,
    border: `2px solid ${active ? '#1976d2' : 'transparent'}`,
    borderRadius: 4,
    cursor: 'pointer',
    overflow: 'hidden',
    flexShrink: 0,
    transition: 'all 0.2s ease',
    '&:hover': {
        borderColor: active ? '#1976d2' : '#ccc',
    },
}));

const ThumbnailImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const NavigationButton = styled(IconButton)({
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    zIndex: 1,
});

const ZoomButton = styled(IconButton)({
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    zIndex: 1,
});

const ImageModal = styled(Dialog)({
    '& .MuiDialog-paper': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'hidden',
    },
});

const ModalImageContainer = styled(Box)({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    width: '100%',
    height: '100%',
    padding: 16,
});

const ModalImage = styled('img')({
    maxHeight: '90vh',
    maxWidth: '90vw',
    objectFit: 'contain',
});

const CloseModalButton = styled(IconButton)({
    position: 'absolute',
    top: 8,
    right: 8,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
});

// New styled component for attribute options
const AttributeOption = styled(Box)(({ selected }) => ({
    cursor: 'pointer',
    padding: '8px 12px',
    border: selected ? '2px solid #1976d2' : '1px solid #ccc',
    backgroundColor: selected ? '#e3f2fd' : 'transparent',
    borderRadius: 4,
    transition: 'all 0.2s ease',
    minWidth: '60px',
    textAlign: 'center',
    marginRight: 8,
    marginBottom: 8,
}));

const AddToCartDialog = ({
    open,
    onClose,
    productId,
    discountedPrice,
}) => {
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [zoomOpen, setZoomOpen] = useState(false);
    const [product, setProduct] = useState({});

    // New state for attributes
    const [attributeGroups, setAttributeGroups] = useState({});
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [pricingData, setPricingData] = useState({ originalPrice: 0, discountedPrice: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) {
            return;
        }
        const GetProductInfo = async () => {
            try {
                const res = await GetProduct(productId);
                if (res?.status === 200 && res?.data) {
                    console.log(">>>check product:", res?.data);
                    const productInfo = {
                        id: res?.data?.productId,
                        name: res?.data?.name,
                        images: res?.data?.productImages?.map(item => item.imageUrl),
                        inStock: res?.data?.stock,
                        originalPrice: res?.data?.originalPrice,
                        discountedPrice: discountedPrice,
                        url: '/products/' + res?.data?.productId,
                        productAttributeDetail: res?.data?.productAttributeDetail || []
                    };
                    setProduct(productInfo);

                    // Process attribute groups
                    const groups = {};
                    const defaultSelected = {};

                    if (productInfo.productAttributeDetail && productInfo.productAttributeDetail.length > 0) {
                        productInfo.productAttributeDetail.forEach(detail => {
                            const groupName = detail.productAttributeName;
                            if (!groups[groupName]) {
                                groups[groupName] = [];
                            }
                            groups[groupName].push(detail);

                            // Set first attribute of each group as default
                            if (!defaultSelected[groupName] && detail.attributeDetailId) {
                                defaultSelected[groupName] = detail.attributeDetailId;
                            }
                        });
                    }

                    setAttributeGroups(groups);
                    setSelectedAttributes(defaultSelected);

                    // Calculate initial pricing based on default attributes
                    const selectedIds = Object.values(defaultSelected);
                    if (selectedIds.length > 0) {
                        updatePricing(productInfo.id, selectedIds);
                    } else {
                        setPricingData({
                            originalPrice: productInfo.originalPrice,
                            discountedPrice: productInfo.discountedPrice
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        GetProductInfo();
    }, [open, productId, discountedPrice]);

    // Handle attribute selection
    const handleAttributeChange = (groupName, detailId) => {
        const newSelectedAttributes = { ...selectedAttributes, [groupName]: detailId };
        setSelectedAttributes(newSelectedAttributes);

        // Update pricing based on new selection
        const selectedIds = Object.values(newSelectedAttributes);
        updatePricing(product.id, selectedIds);
    };

    // Get updated pricing from API
    const updatePricing = async (productId, attributeIds) => {
        try {
            const response = await ProductPricing(productId, attributeIds);
            if (response?.status === 200 && response?.data) {
                setPricingData(response.data);
            }
        } catch (error) {
            console.error("Error calculating price:", error);
        }
    };

    // Calculate savings
    const savings = pricingData.originalPrice - pricingData.discountedPrice;
    const savingsPercentage = Math.round((savings / pricingData.originalPrice) * 100);

    // Format price to VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Handle quantity changes
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    // Handle image navigation
    const goToNextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % product?.images?.length);
    };

    const goToPrevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + product?.images?.length) % product?.images?.length);
    };

    const handleThumbnailClick = (index) => {
        setActiveImageIndex(index);
    };

    // Zoom functionality
    const handleZoomOpen = () => {
        setZoomOpen(true);
    };

    const handleZoomClose = () => {
        setZoomOpen(false);
    };

    const handleAddToCart = async () => {
        if (quantity > product.inStock) {
            alert("Sản phẩm không đủ tồn kho");
            return;
        }

        // Include selected attribute IDs with the cart request
        // const selectedAttributeIds = Object.values(selectedAttributes);

        // const res = await AddToCart(product.id, quantity, selectedAttributeIds);
        const res = await AddToCart(product.id, quantity);
        if (res?.status === 200 && res?.data) {
            onClose();
            console.log(">>>check add to cart:", res?.data);
            alert("Thêm vào giỏ hàng thành công");
        }
        else {
            alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
        }
    };

    const handleBuyNow = async () => {
        if (quantity > product.inStock) {
            alert("Sản phẩm không đủ tồn kho");
            return;
        }

        // Include selected attribute IDs with the cart request
        // const selectedAttributeIds = Object.values(selectedAttributes);

        // const res = await AddToCart(product.id, quantity, selectedAttributeIds);
        const res = await AddToCart(product.id, quantity);
        if (res?.status === 200 && res?.data) {
            onClose();
            console.log(">>>check add to cart:", res?.data);
        }
        else {
            alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
        }
        navigate("/cart");
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="div">
                        {product?.name}
                    </Typography>
                    <IconButton aria-label="close" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        {/* Product Image Gallery */}
                        <Grid item xs={12} md={6}>
                            <MainImageContainer>
                                <NavigationButton
                                    sx={{ left: 8 }}
                                    onClick={goToPrevImage}
                                    size="small"
                                >
                                    <ArrowBackIosNewIcon fontSize="small" />
                                </NavigationButton>
                                <MainImage
                                    src={product?.images?.[activeImageIndex]}
                                    alt={`${product?.name} - Hình ${activeImageIndex + 1}`}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                    }}
                                />
                                <NavigationButton
                                    sx={{ right: 8 }}
                                    onClick={goToNextImage}
                                    size="small"
                                >
                                    <ArrowForwardIosIcon fontSize="small" />
                                </NavigationButton>
                                <ZoomButton
                                    onClick={handleZoomOpen}
                                    size="small"
                                >
                                    <ZoomInIcon fontSize="small" />
                                </ZoomButton>
                            </MainImageContainer>

                            <ThumbnailContainer>
                                {product?.images?.map((image, index) => (
                                    <Thumbnail
                                        key={index}
                                        active={index === activeImageIndex}
                                        onClick={() => handleThumbnailClick(index)}
                                    >
                                        <ThumbnailImage
                                            src={image}
                                            alt={`${product.name} - Thumbnail ${index + 1}`}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                                            }}
                                        />
                                    </Thumbnail>
                                ))}
                            </ThumbnailContainer>
                        </Grid>

                        {/* Product Details */}
                        <Grid item xs={12} md={6}>
                            {/* Product Name */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">Tên sản phẩm:</Typography>
                                <Typography variant="body1">{product.name}</Typography>
                            </Box>

                            {/* Stock Status */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">Trạng thái:</Typography>
                                <Typography
                                    variant="body1"
                                    color={product.inStock ? 'success.main' : 'error.main'}
                                >
                                    {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Price */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">Giá:</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    {pricingData.originalPrice !== pricingData.discountedPrice && (
                                        <StrikethroughText variant="body1">
                                            {formatPrice(pricingData.originalPrice)}
                                        </StrikethroughText>
                                    )}

                                    <DiscountText variant="h6">
                                        {formatPrice(pricingData.discountedPrice)}
                                    </DiscountText>

                                    {pricingData.originalPrice !== pricingData.discountedPrice && (
                                        <SavingsText variant="body2">
                                            Tiết kiệm {savingsPercentage}%
                                        </SavingsText>
                                    )}
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Product Attributes */}
                            {Object.keys(attributeGroups).length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">Thuộc tính sản phẩm:</Typography>

                                    {Object.entries(attributeGroups).map(([groupName, details]) => (
                                        <Box key={groupName} sx={{ mt: 2 }}>
                                            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                                                {groupName}:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {details.map((detail) => (
                                                    <AttributeOption
                                                        key={detail.attributeDetailId}
                                                        selected={selectedAttributes[groupName] === detail.attributeDetailId}
                                                        onClick={() => handleAttributeChange(groupName, detail.attributeDetailId)}
                                                    >
                                                        <Typography variant="body2">
                                                            {detail.value}
                                                        </Typography>
                                                    </AttributeOption>
                                                ))}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* View Details Link */}
                            <Box sx={{ mb: 2 }}>
                                <Link
                                    onClick={() => navigate(`/product/${productId}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="primary"
                                    sx={{
                                        // textDecoration: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Typography>Xem chi tiết sản phẩm</Typography>
                                </Link>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Quantity */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                    Số lượng:
                                </Typography>
                                <Stack direction="row" alignItems="center">
                                    <QuantityButton
                                        size="small"
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                    >
                                        <RemoveIcon fontSize="small" />
                                    </QuantityButton>
                                    <QuantityInput>
                                        <Typography>{quantity}</Typography>
                                    </QuantityInput>
                                    <QuantityButton
                                        size="small"
                                        onClick={increaseQuantity}
                                    >
                                        <AddIcon fontSize="small" />
                                    </QuantityButton>
                                </Stack>
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <ActionButton
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                >
                                    Thêm vào giỏ hàng
                                </ActionButton>
                                <ActionButton
                                    variant="contained"
                                    primary
                                    fullWidth
                                    onClick={handleBuyNow}
                                    disabled={!product.inStock}
                                >
                                    Mua ngay
                                </ActionButton>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            {/* Full-size image zoom modal */}
            <ImageModal
                open={zoomOpen}
                onClose={handleZoomClose}
                maxWidth="xl"
                fullWidth
            >
                <ModalImageContainer>
                    <CloseModalButton onClick={handleZoomClose}>
                        <CloseIcon />
                    </CloseModalButton>
                    <NavigationButton
                        sx={{ left: 16 }}
                        onClick={() => {
                            goToPrevImage();
                        }}
                    >
                        <ArrowBackIosNewIcon />
                    </NavigationButton>
                    <ModalImage
                        src={product?.images?.[activeImageIndex]}
                        alt={`${product.name} - Hình ${activeImageIndex + 1}`}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                        }}
                    />
                    <NavigationButton
                        sx={{ right: 16 }}
                        onClick={() => {
                            goToNextImage();
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </NavigationButton>
                </ModalImageContainer>
            </ImageModal>
        </>
    );
};

export default AddToCartDialog;