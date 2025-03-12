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

    useEffect(() => {
        const GetProductInfo = async () => {
            const res = await GetProduct(productId);
            if (res?.status === 200 && res?.data) {
                console.log(">>>check product:", res?.data);
                const productInfo = {
                    id: res?.data?.productId,
                    name: res?.data?.name,
                    images: res?.data?.productImages?.map(item => item.imageUrl),
                    inStock: res?.data?.stock,
                    originalPrice: res?.data?.price,
                    discountedPrice: discountedPrice,
                    url: '/products/smartphone-xyz-2025'
                };
                setProduct(productInfo);
            }
        };

        GetProductInfo();
    }, []);

    // Calculate savings
    const savings = product.originalPrice - product.discountedPrice;
    const savingsPercentage = Math.round((savings / product.originalPrice) * 100);

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

    // Handle actions
    const handleAddToCart = () => {
        console.log(`Added ${quantity} of ${product?.name} to cart`);
        // Implement your add to cart logic here
        onClose();
    };

    const handleBuyNow = () => {
        console.log(`Buying ${quantity} of ${product?.name} now`);
        // Implement your buy now logic here
        onClose();
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
                                    {product.originalPrice !== product.discountedPrice && (
                                        <StrikethroughText variant="body1">
                                            {formatPrice(product.originalPrice)}
                                        </StrikethroughText>
                                    )}

                                    <DiscountText variant="h6">
                                        {formatPrice(product.discountedPrice)}
                                    </DiscountText>
                                    {product.originalPrice !== product.discountedPrice && (
                                        <SavingsText variant="body2">
                                            Tiết kiệm {savingsPercentage}%
                                        </SavingsText>
                                    )}
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* View Details Link */}
                            <Box sx={{ mb: 2 }}>
                                <Link
                                    href={product.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="primary"
                                    sx={{ textDecoration: 'none' }}
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


function ProductPageTest() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Dữ liệu sản phẩm mẫu
    const productData = {
        id: '123',
        name: 'Smartphone XYZ 2025',
        images: [
            'https://product.hstatic.net/1000288298/product/dsc07158_470fb23e6ff74fd490307cd22d7c342b_master.jpg',
            'https://product.hstatic.net/1000288298/product/dsc07171_03750644895e4bd5a53e6ab29d2f0e7a_master.jpg',
            'https://product.hstatic.net/1000288298/product/dsc07164_ef93aa367e9a42cd91db2733870e321c_master.jpg',
            'https://product.hstatic.net/1000288298/product/dsc07168_339fe0e134bd44afb441426bd5829eb9_master.jpg',
        ],
        inStock: true,
        originalPrice: 5990000,
        discountedPrice: 4790000,
        url: '/products/smartphone-xyz-2025'
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Mua Ngay
            </Button>

            <AddToCartDialog
                open={open}
                onClose={handleClose}
                productId={15}
                discountedPrice={20000000}
            />
        </div>
    );
}

// export default ProductPageTest;