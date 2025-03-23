import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { createVoucher } from "../../../services/voucherService";
import { useNavigate } from 'react-router-dom';

const CreateVoucherPage = () => {
    const navigate = useNavigate();

    const [voucherData, setVoucherData] = useState({
        voucherCode: '',
        voucherName: '',
        voucherType: '',
        discountValue: 0,
        maxDiscount: 0,
        minOrderValue: 0,
        startDate: '',
        endDate: '',
    });
    
    // Đặt giá trị mặc định cho ngày bắt đầu và kết thúc là hôm nay
    useEffect(() => {
        const today = new Date();
        today.setHours(today.getHours() + 7);
        const formattedDate = today.toISOString().slice(0, 16); // Lấy ngày hiện tại dạng 'YYYY-MM-DDTHH:MM'
        setVoucherData((prev) => ({
            ...prev,
            startDate: formattedDate,
            endDate: formattedDate,
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVoucherData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateVoucher = async () => {
        try {
            await createVoucher(voucherData); // Gọi API tạo mã giảm giá
            alert('Mã giảm giá đã được tạo thành công!');
            navigate('/admin/vouchers'); // Chuyển hướng đến trang danh sách mã giảm giá
        } catch (err) {
            console.error('Lỗi khi tạo mã giảm giá:', err);
            alert('Không thể tạo mã giảm giá. Vui lòng thử lại.');
        }
    };

    return (
        <Box sx={{ maxWidth: '800px', margin: '32px auto' }}>
            {/* Nút quay lại */}
            <Button
                variant="outlined"
                sx={{
                    marginBottom: '16px',
                    color: 'black',
                    borderColor: 'black',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        borderColor: 'black',
                    },
                }}
                onClick={() => navigate('/admin/vouchers')} // Quay lại trang danh sách mã giảm giá
            >
                Quay lại
            </Button>

            <Typography variant='h5' sx={{ marginBottom: '16px', textAlign: 'center' }}>
                Tạo mã giảm giá mới
            </Typography>
            <TextField
                label="Mã giảm giá"
                name="voucherCode"
                value={voucherData.voucherCode}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: '16px' }}
            />
            <TextField
                label="Tên mã giảm giá"
                name="voucherName"
                value={voucherData.voucherName}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: '16px' }}
            />
            {/* Sử dụng Select cho loại mã giảm giá */}
            <FormControl fullWidth sx={{ marginBottom: '16px' }}>
                <InputLabel>Loại mã giảm giá</InputLabel>
                <Select
                    label="Loại mã giảm giá"
                    name="voucherType"
                    value={voucherData.voucherType}
                    onChange={handleChange}
                >
                    <MenuItem value="Fixed">Fixed</MenuItem>
                    <MenuItem value="Percentage">Percentage</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Giá trị giảm giá"
                name="discountValue"
                value={voucherData.discountValue}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: '16px' }}
            />
            <TextField
                label="Giá trị giảm giá tối đa"
                name="maxDiscount"
                value={voucherData.maxDiscount}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: '16px' }}
            />
            <TextField
                label="Yêu cầu giá trị đơn hàng tối thiểu"
                name="minOrderValue"
                value={voucherData.minOrderValue}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: '16px' }}
            />
            <TextField
                label="Ngày bắt đầu"
                name="startDate"
                type="datetime-local"
                value={voucherData.startDate}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: '16px' }}
            />
            <TextField
                label="Ngày hết hạn"
                name="endDate"
                type="datetime-local"
                value={voucherData.endDate}
                onChange={handleChange}
                fullWidth
                sx={{ marginBottom: '16px' }}
            />
            <Button
                variant="outlined"
                sx={{ marginTop: '16px' }}
                onClick={handleCreateVoucher}
            >
                Tạo mã giảm giá
            </Button>
        </Box>
    );
};

export default CreateVoucherPage;
