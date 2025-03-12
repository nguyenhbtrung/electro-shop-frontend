import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Grid,
    Paper,
    Checkbox,
    IconButton,
    Divider,
    Box,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Avatar,
    List
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { GetDiscountedProducts } from '../../services/discountService';

const ApplyDiscountDialog = ({ open, onClose, discountInfo, onSave }) => {
    // State cho danh sách sản phẩm
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectAll, setSelectAll] = useState(false);

    // State cho phân trang
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // State cho filters
    const [priceFilter, setPriceFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [openFilters, setOpenFilters] = useState(false);

    // Mock data cho demo - trong thực tế bạn sẽ lấy từ API
    useEffect(() => {
        if (!discountInfo?.discountId || !open) {
            return;
        }
        console.log("check");

        const GetDiscountedProductData = async () => {
            const res = await GetDiscountedProducts(discountInfo?.discountId);
            if (res?.status === 200 && res?.data) {
                setProducts(res?.data?.products);
                setFilteredProducts(res?.data?.products);
                // Giả sử có sản phẩm đã được chọn trước đó
                if (res?.data?.selectedProductIds) {
                    const preSelectedProducts = res?.data?.products?.filter(product =>
                        res?.data?.selectedProductIds.includes(product.id)
                    );
                    setSelectedProducts(preSelectedProducts);
                }
            }
        }

        GetDiscountedProductData();
    }, [discountInfo, open]);

    // Xử lý tìm kiếm
    useEffect(() => {
        let result = [...products];

        // Áp dụng tìm kiếm
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.id.toString().includes(searchQuery)
            );
        }

        // Áp dụng các bộ lọc nếu có
        if (priceFilter) {
            switch (priceFilter) {
                case 'low':
                    result = result.filter(product => product.price < 5000000);
                    break;
                case 'medium':
                    result = result.filter(product => product.price >= 5000000 && product.price <= 15000000);
                    break;
                case 'high':
                    result = result.filter(product => product.price > 15000000);
                    break;
                default:
                    break;
            }
        }

        if (stockFilter) {
            switch (stockFilter) {
                case 'low':
                    result = result.filter(product => product.stock < 10);
                    break;
                case 'medium':
                    result = result.filter(product => product.stock >= 10 && product.stock <= 30);
                    break;
                case 'high':
                    result = result.filter(product => product.stock > 30);
                    break;
                default:
                    break;
            }
        }

        if (brandFilter) {
            result = result.filter(product => product.brand === brandFilter);
        }

        setFilteredProducts(result);
    }, [searchQuery, priceFilter, stockFilter, brandFilter, products]);

    // Xử lý chuyển trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Xử lý chọn sản phẩm
    const handleSelectProduct = (product) => {
        const isSelected = selectedProducts.some(p => p.id === product.id);

        if (isSelected) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
            setSelectAll(false);
        } else {
            setSelectedProducts([...selectedProducts, product]);

            // Kiểm tra nếu đã chọn tất cả sản phẩm thì đánh dấu checkbox "chọn tất cả"
            if (selectedProducts.length + 1 === filteredProducts.length) {
                setSelectAll(true);
            }
        }
    };

    // Xử lý chọn tất cả sản phẩm
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        if (newSelectAll) {
            // Lấy tất cả sản phẩm từ danh sách đã lọc
            const currentPageProducts = filteredProducts.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            );

            // Thêm các sản phẩm chưa được chọn
            const newSelectedProducts = [...selectedProducts];

            currentPageProducts.forEach(product => {
                if (!selectedProducts.some(p => p.id === product.id)) {
                    newSelectedProducts.push(product);
                }
            });

            setSelectedProducts(newSelectedProducts);
        } else {
            // Loại bỏ các sản phẩm trong trang hiện tại khỏi danh sách đã chọn
            const currentPageProducts = filteredProducts.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            );

            const newSelectedProducts = selectedProducts.filter(
                product => !currentPageProducts.some(p => p.id === product.id)
            );

            setSelectedProducts(newSelectedProducts);
        }
    };

    // Xử lý xóa sản phẩm đã chọn
    const handleRemoveSelected = (product) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
        setSelectAll(false);
    };

    // Xử lý lưu các sản phẩm đã chọn
    const handleSave = () => {
        onSave(selectedProducts);
        onClose();
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Kiểm tra nếu sản phẩm đã được chọn
    const isSelected = (productId) => {
        return selectedProducts.some(p => p.id === productId);
    };

    // Component cho phần bộ lọc
    const FilterComponent = () => (
        <Box sx={{ p: 2, display: openFilters ? 'block' : 'none' }}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Giá</InputLabel>
                        <Select
                            value={priceFilter}
                            label="Giá"
                            onChange={(e) => setPriceFilter(e.target.value)}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="low">Dưới 5 triệu</MenuItem>
                            <MenuItem value="medium">5 - 15 triệu</MenuItem>
                            <MenuItem value="high">Trên 15 triệu</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Tồn kho</InputLabel>
                        <Select
                            value={stockFilter}
                            label="Tồn kho"
                            onChange={(e) => setStockFilter(e.target.value)}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="low">Dưới 10</MenuItem>
                            <MenuItem value="medium">10 - 30</MenuItem>
                            <MenuItem value="high">Trên 30</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Thương hiệu</InputLabel>
                        <Select
                            value={brandFilter}
                            label="Thương hiệu"
                            onChange={(e) => setBrandFilter(e.target.value)}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            {Array.from(new Set(products?.map(p => p.brand))).map(brand => (
                                <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );

    // Kiểm tra trạng thái "chọn tất cả" cho trang hiện tại
    useEffect(() => {
        const currentPageProducts = filteredProducts.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );

        const allSelected = currentPageProducts.length > 0 &&
            currentPageProducts.every(product =>
                selectedProducts.some(p => p.id === product.id)
            );

        setSelectAll(allSelected);
    }, [page, rowsPerPage, filteredProducts, selectedProducts]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Chọn sản phẩm áp dụng khuyến mãi</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Thông tin khuyến mãi */}
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Thông tin khuyến mãi:</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="body2">- Tên: {discountInfo?.name}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2">
                                - Loại: {discountInfo?.discountType === 'Percentage' ? 'Phần trăm' : 'Số tiền cố định'}
                                ({discountInfo?.discountType === 'Percentage' ? `${discountInfo?.discountValue}%` : formatPrice(discountInfo?.discountValue)})
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2">
                                - Thời gian: {new Date(discountInfo?.startDate).toLocaleDateString('vi-VN')} - {new Date(discountInfo?.endDate).toLocaleDateString('vi-VN')}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tìm kiếm và bộ lọc */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                        placeholder="Tìm kiếm sản phẩm..."
                        variant="outlined"
                        size="small"
                        sx={{ width: '50%' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        startIcon={<FilterListIcon />}
                        variant={openFilters ? "contained" : "outlined"}
                        onClick={() => setOpenFilters(!openFilters)}
                    >
                        Bộ lọc
                    </Button>
                </Box>

                {/* Bộ lọc */}
                <FilterComponent />

                {/* Danh sách sản phẩm */}
                <Grid container spacing={2}>
                    {/* Danh sách sản phẩm bên trái */}
                    <Grid item xs={8}>
                        <Paper sx={{ height: 400, overflow: 'auto' }}>
                            <TableContainer>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                    color="primary"
                                                    indeterminate={
                                                        selectedProducts?.length > 0 &&
                                                        selectedProducts?.length < filteredProducts?.slice(
                                                            page * rowsPerPage,
                                                            page * rowsPerPage + rowsPerPage
                                                        ).length
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>Ảnh</TableCell>
                                            <TableCell>Mã</TableCell>
                                            <TableCell>Tên sản phẩm</TableCell>
                                            <TableCell>Giá</TableCell>
                                            <TableCell>Tồn kho</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredProducts
                                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            ?.map((product) => {
                                                const selected = isSelected(product.id);

                                                return (
                                                    <TableRow
                                                        key={product.id}
                                                        onClick={() => handleSelectProduct(product)}
                                                        hover
                                                        selected={selected}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={selected}
                                                                onChange={() => { }}
                                                                color="primary"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Avatar
                                                                src={product.image}
                                                                variant="rounded"
                                                                sx={{ width: 40, height: 40 }}
                                                                alt={product.name}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{product.id}</TableCell>
                                                        <TableCell>{product.name}</TableCell>
                                                        <TableCell>{formatPrice(product.price)}</TableCell>
                                                        <TableCell>Tồn: {product.stock}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={filteredProducts?.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                                labelRowsPerPage="Hiển thị:"
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
                            />
                        </Paper>
                    </Grid>

                    {/* Danh sách đã chọn bên phải */}
                    <Grid item xs={4}>
                        <Paper sx={{ height: 400, overflow: 'auto', p: 1 }}>
                            <Typography variant="subtitle2" sx={{ p: 1 }}>Danh sách đã chọn</Typography>
                            <Divider />
                            {selectedProducts?.length === 0 ? (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Chưa có sản phẩm nào được chọn
                                    </Typography>
                                </Box>
                            ) : (
                                <List>
                                    {selectedProducts?.map((product) => (
                                        <Box
                                            key={product.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                borderBottom: '1px solid #eee',
                                                '&:last-child': { borderBottom: 'none' }
                                            }}
                                        >
                                            <Avatar
                                                src={product.image}
                                                variant="rounded"
                                                sx={{ width: 30, height: 30, mr: 1 }}
                                                alt={product.name}
                                            />
                                            <Box sx={{ ml: 1, flexGrow: 1 }}>
                                                <Typography variant="body2" noWrap>{product.id} | {product.name}</Typography>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveSelected(product);
                                                }}
                                                sx={{ p: 0.5 }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="body2">
                        Tổng số sản phẩm đã chọn: {selectedProducts?.length}
                    </Typography>
                </Box>
                <Box>
                    <Button onClick={onClose} sx={{ mr: 1 }}>Hủy</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                    >
                        Xác nhận
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ApplyDiscountDialog;