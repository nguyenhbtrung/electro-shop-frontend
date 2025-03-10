import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    IconButton,
    CircularProgress,
    Typography,
    useTheme,
    Box,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import axios from "axios";
import { tokens } from "../../theme";
import { GetProductByDiscountId } from "../../services/productService";

const ApplyDiscountDialog = ({
    open,
    onClose,
    promotionId,
    onSave
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && promotionId) {
            fetchProducts();
        }
    }, [open, promotionId]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await GetProductByDiscountId(promotionId, searchQuery);

            console.log(">>check", response.data);

            setAvailableProducts(response.data.available);
            setSelectedProducts(response.data.selected);
            setError(null);
        } catch (err) {
            setError("Không thể tải danh sách sản phẩm");
            console.error("Lỗi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleProduct = (productId) => {
        const currentIndex = selectedProducts.findIndex(p => p.id === productId);
        const newSelected = [...selectedProducts];

        if (currentIndex === -1) {
            const productToAdd = availableProducts.find(p => p.id === productId);
            if (productToAdd) newSelected.push(productToAdd);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelectedProducts(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === availableProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts([...availableProducts]);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post(`/api/promotions/${promotionId}/products`, {
                productIds: selectedProducts.map(p => p.id)
            });
            onSave(selectedProducts.length);
            onClose();
        } catch (err) {
            console.error("Lỗi cập nhật sản phẩm:", err);
            alert("Cập nhật thất bại! Vui lòng thử lại.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ bgcolor: colors.blueAccent[700], color: "white" }}>
                Quản lý sản phẩm áp dụng khuyến mãi
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Tìm kiếm sản phẩm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={5}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Typography variant="h6">Sản phẩm có sẵn</Typography>
                                <Button
                                    size="small"
                                    onClick={handleSelectAll}
                                    sx={{ ml: 1 }}
                                >
                                    Chọn tất cả
                                </Button>
                            </Box>
                            <List dense sx={{ border: `1px solid ${colors.gray[400]}`, borderRadius: 1 }}>
                                {availableProducts?.map((product) => (
                                    <ListItem key={product.id}>
                                        <Checkbox
                                            checked={selectedProducts.some(p => p.id === product.id)}
                                            onChange={() => handleToggleProduct(product.id)}
                                        />
                                        <ListItemText
                                            primary={product.name}
                                            secondary={`SKU: ${product.sku}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>

                        <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton disabled>
                                <SwapHorizIcon fontSize="large" />
                            </IconButton>
                        </Grid>

                        <Grid item xs={5}>
                            <Typography variant="h6" mb={1}>Sản phẩm đã chọn</Typography>
                            <List dense sx={{ border: `1px solid ${colors.gray[400]}`, borderRadius: 1 }}>
                                {selectedProducts?.map((product) => (
                                    <ListItem key={product.id}>
                                        <Checkbox
                                            checked
                                            onChange={() => handleToggleProduct(product.id)}
                                        />
                                        <ListItemText
                                            primary={product.name}
                                            secondary={`SKU: ${product.sku}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Hủy
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApplyDiscountDialog;