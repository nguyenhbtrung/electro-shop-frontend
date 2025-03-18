import React, { useState } from 'react';
import { Box, Typography, Checkbox, Button, IconButton, Grid, Paper, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import the ShoppingCartIcon

// Giả sử dữ liệu sản phẩm lấy từ backend hoặc định nghĩa tạm
const products = [
    { id: 1, name: 'Sản phẩm 1', price: '100.000₫', image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'Sản phẩm 2', price: '150.000₫', image: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Sản phẩm 3', price: '200.000₫', image: 'https://via.placeholder.com/80' },
];

const ManageHistory = () => {
    const [checkedItems, setCheckedItems] = useState(products.map(() => false));
    const [selectAll, setSelectAll] = useState(false);
    // const [histories, setHistories] = useState([]);
    // const [selectedRows, setSelectedRows] = useState([]);

    // const fetchHistories = async () => {
    //     try {
    //         const res = await GetProductViewHistories();
    //         if (res?.data) {
    //             console.log(">>>Histories: ", res.data);
    //             const historiesWithId = res.data.map((history, index) => ({
    //                 ...history,
    //                 historyId: history.historyId || index,
    //             }));
    //             setHistories(historiesWithId);
    //         }
    //     } catch (error) {
    //         console.log(">>>Error fetching histories", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchHistories();
    // }, []);

    // const handleDeleteSelected = async (row) => {
    //     if (window.confirm("Bạn có chắc chắn muốn xóa mục này không?")) {
    //         console.log("Delete history: ", row?.historyId);
    //         try {
    //             const res = await DeleteProductViewHistory(row?.historyId);
    //             if (res?.status === 200 || res?.status === 204) {
    //                 setHistories((prevHistories) =>
    //                     prevHistories.filter((history) => history.historyId !== row.historyId)
    //                 );
    //                 alert("Xóa thành công!");
    //             } else {
    //                 console.log(">>>Error deleting history:", res);
    //             }
    //         } catch (error) {
    //             console.log(">>>Error deleting history:", error);
    //         }
    //     }
    // };

    // const handleDeleteSelectedRows = async () => {
    //     if (window.confirm("Bạn có chắc chắn muốn xóa các mục đã chọn không?")) {
    //         try {
    //             for (const historyId of selectedRows) {
    //                 const res = await DeleteProductViewHistory(historyId);
    //                 if (res?.status !== 200 && res?.status !== 204) {
    //                     console.log(">>>Error deleting rating:", res);
    //                 }
    //             }
    //             setHistories((prevHistories) =>
    //                 prevHistories.filter((history) => !selectedRows.includes(history.historyId))
    //             );
    //             setSelectedRows([]);
    //             alert("Xóa các mục đã chọn thành công!");
    //         } catch (error) {
    //             console.log(">>>Error deleting selected histories:", error);
    //         }
    //     }
    // };

    const handleSelectAllChange = (event) => {
        const checked = event.target.checked;
        setSelectAll(checked);
        setCheckedItems(products.map(() => checked));
    };

    const handleCheckboxChange = (index) => (event) => {
        const checked = event.target.checked;
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = checked;
        setCheckedItems(newCheckedItems);
        setSelectAll(newCheckedItems.every((item) => item));
    };

    return (
        <Box sx={{ p: 2, width: '75%', height: '120vh', mx: 'auto' }}>
            {/* Header */}
            <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom align="center">
                Lịch sử duyệt sản phẩm
            </Typography>

            {/* Thanh lựa chọn: Checkbox "Tất cả" và nút xóa */}
            <Paper sx={{ p: 1, mb: 2 }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Box display="flex" alignItems="center">
                            <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Chọn tất cả</Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <IconButton color="error">
                            <DeleteIcon />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Xóa đã chọn</Typography>
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            {/* Danh sách sản phẩm */}
            {products.map((product, index) => (
                <Paper key={product.id} sx={{ p: 1, mb: 2 }}>
                    <Grid container alignItems="center" spacing={2}>
                        {/* Checkbox sản phẩm */}
                        <Grid item>
                            <Checkbox
                                checked={checkedItems[index]}
                                onChange={handleCheckboxChange(index)}
                            />
                        </Grid>
                        {/* Ảnh sản phẩm */}
                        <Grid item>
                            <Avatar
                                variant="square"
                                src={product.image}
                                alt={product.name}
                                sx={{ width: 120, height: 120 }} // Adjusted size
                            />
                        </Grid>
                        {/* Thông tin sản phẩm */}
                        <Grid item xs>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {product.name}
                            </Typography>
                            <Typography variant="body2">
                                Giá: {product.price}
                            </Typography>
                        </Grid>
                        {/* Nút Thêm vào giỏ hàng */}
                        <Grid item>
                            <Button variant="contained" color="secondary" startIcon={<ShoppingCartIcon />}>
                                THÊM VÀO GIỎ HÀNG
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </Box>
    );
};

export default ManageHistory;
