import React, { useEffect, useState } from 'react';
import { Box, Typography, Checkbox, Button, IconButton, Grid, Paper, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { GetProductViewHistories } from '../../../services/historyService';
import { GetAllProduct } from '../../../services/productService'; // đảm bảo hàm này được định nghĩa

const ManageHistory = () => {
    const [histories, setHistories] = useState([]);
    const [products, setProducts] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Hàm lấy dữ liệu lịch sử và danh sách sản phẩm
    const fetchData = async () => {
        try {
            const historiesRes = await GetProductViewHistories();
            const productsRes = await GetAllProduct();

            if (historiesRes?.data) {
                setHistories(historiesRes.data);
                // khởi tạo mảng checked với độ dài bằng số lượng lịch sử
                setCheckedItems(new Array(historiesRes.data.length).fill(false));
            }
            if (productsRes?.data) {
                setProducts(productsRes.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Xử lý chọn tất cả
    const handleSelectAllChange = (event) => {
        const checked = event.target.checked;
        setSelectAll(checked);
        setCheckedItems(new Array(histories.length).fill(checked));
    };

    // Xử lý checkbox từng hàng
    const handleCheckboxChange = (index) => (event) => {
        const checked = event.target.checked;
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = checked;
        setCheckedItems(newCheckedItems);
        setSelectAll(newCheckedItems.every(item => item));
    };

    // Hàm tra cứu thông tin sản phẩm dựa trên productId
    const getProductInfo = (productId) => {
        return products.find(product => product.productId === productId) || {};
    };

    return (
        <Box sx={{ p: 2, width: '75%', minHeight: '100vh', mx: 'auto' }}>
            {/* Header */}
            <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom align="center">
                Lịch sử duyệt sản phẩm
            </Typography>

            {/* Thanh lựa chọn: Checkbox "Chọn tất cả" và nút xóa */}
            <Paper sx={{ p: 1, mb: 2 }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Box display="flex" alignItems="center">
                            <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Chọn tất cả
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <IconButton color="error">
                            <DeleteIcon />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Xóa đã chọn
                            </Typography>
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            {/* Danh sách lịch sử sản phẩm */}
            {histories.map((history, index) => {
                const product = getProductInfo(history.productId);
                return (
                    <Paper key={history.historyId} sx={{ p: 1, mb: 2 }}>
                        <Grid container alignItems="center" spacing={2}>
                            {/* Checkbox của từng hàng */}
                            <Grid item>
                                <Checkbox
                                    checked={checkedItems[index] || false}
                                    onChange={handleCheckboxChange(index)}
                                />
                            </Grid>
                            {/* Ảnh sản phẩm */}
                            <Grid item>
                                <Avatar
                                    variant="square"
                                    src={
                                        product.productImages && product.productImages.length > 0
                                            ? product.productImages[0].imageUrl
                                            : 'https://via.placeholder.com/80'
                                    }
                                    alt={product.name || `Sản phẩm ${history.productId}`}
                                    sx={{ width: 120, height: 120 }}
                                />
                            </Grid>
                            {/* Thông tin sản phẩm */}
                            <Grid item xs>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {product.name || `Sản phẩm ${history.productId}`}
                                </Typography>
                                <Typography variant="body2">
                                    Giá:{' '}
                                    {product.discountedPrice
                                        ? product.discountedPrice.toLocaleString('vi-VN') + '₫'
                                        : 'Chưa cập nhật'}
                                </Typography>
                            </Grid>
                            {/* Nút thêm vào giỏ hàng */}
                            <Grid item>
                                <Button variant="contained" color="secondary" startIcon={<ShoppingCartIcon />}>
                                    THÊM VÀO GIỎ HÀNG
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                );
            })}
        </Box>
    );
};

export default ManageHistory;
