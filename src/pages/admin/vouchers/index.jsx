import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getVouchers, updateVoucher, deleteVoucher } from "../../../services/voucherService";

const VoucherPage = () => {
    const navigate = useNavigate();

    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingVoucher, setEditingVoucher] = useState(null); // State để lưu voucher đang chỉnh sửa
    const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa

    // Lấy danh sách mã giảm giá
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await getVouchers();
                setVouchers(response.data);
            } catch (err) {
                setError('Không thể lấy dữ liệu mã giảm giá.');
                console.error('Lỗi khi gọi API:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, []);

    // Xử lý chỉnh sửa mã giảm giá
    const handleEditVoucher = (voucher) => {
        setEditingVoucher({ ...voucher }); // Tạo một bản sao của voucher để chỉnh sửa
        setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    };

    // Xử lý cập nhật mã giảm giá
    const handleSaveVoucher = async () => {
        try {
            await updateVoucher(editingVoucher.voucherId, editingVoucher); // Gọi API cập nhật
            alert('Mã giảm giá đã được cập nhật thành công!');
            setIsEditing(false); // Đặt lại chế độ sau khi lưu
            setVouchers((prevVouchers) =>
                prevVouchers.map((voucher) =>
                    voucher.voucherId === editingVoucher.voucherId ? editingVoucher : voucher
                )
            );
        } catch (err) {
            console.error('Lỗi khi cập nhật mã giảm giá:', err);
            alert('Không thể cập nhật mã giảm giá. Vui lòng thử lại sau.');
        }
    };

    // Xử lý thay đổi thông tin mã giảm giá
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingVoucher((prevVoucher) => ({
            ...prevVoucher,
            [name]: value,
        }));
    };

    // Xử lý xóa mã giảm giá
    const handleDeleteVoucher = async (voucherId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này không?')) {
            try {
                await deleteVoucher(voucherId);
                alert('Mã giảm giá đã được xóa thành công!');
                setVouchers((prevVouchers) => prevVouchers.filter((v) => v.voucherId !== voucherId));
            } catch (err) {
                console.error('Lỗi khi xóa mã giảm giá:', err);
                alert('Không thể xóa mã giảm giá. Vui lòng thử lại sau.');
            }
        }
    };

    if (loading) return <Typography>Đang tải dữ liệu mã giảm giá...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ maxWidth: '800px', margin: '32px auto' }}>
            <Typography variant='h5' sx={{ marginBottom: '16px', textAlign: 'center' }}>
                Danh sách mã giảm giá
            </Typography>
            <Button
                variant="outlined"
                sx={{
                    marginBottom: '16px',
                    alignSelf: 'flex-start',
                    color: 'green',
                    borderColor: 'green',
                    backgroundColor: 'transparent',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        borderColor: 'green',
                    },
                }}
                onClick={() => navigate('/admin/vouchers/create')}
            >
                Tạo mã giảm giá
            </Button>
            {vouchers.length === 0 ? (
                <Typography sx={{ fontSize: '1.2rem', textAlign: 'center', margin: '20px 0' }}>
                    Không có mã giảm giá nào!
                </Typography>
            ) : (
                vouchers.map((voucher) => (
                    <Box
                        key={voucher.voucherId}
                        sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            padding: '16px',
                            position: 'relative', // Để có thể căn vị trí của trạng thái voucher
                        }}
                    >
                        {/* Trạng thái voucher và Mã giảm giá sẽ bị ẩn khi chỉnh sửa */}
                        {!isEditing || editingVoucher.voucherId !== voucher.voucherId ? (
                            <>
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        backgroundColor: voucher.voucherStatus === 'active' ? 'green' : 'gray',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {voucher.voucherStatus === 'active' ? 'Khả dụng' : 'Không khả dụng'}
                                </Typography>

                                <Typography variant="h6">Mã giảm giá: {voucher.voucherCode}</Typography>
                            </>
                        ) : null}

                        {/* Chỉnh sửa mã giảm giá */}
                        {isEditing && editingVoucher.voucherId === voucher.voucherId ? (
                            <>
                                <TextField
                                    label="Mã giảm giá"
                                    name="voucherCode"
                                    value={editingVoucher.voucherCode}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginBottom: '16px' }}
                                />
                                <TextField
                                    label="Tên mã giảm giá"
                                    name="voucherName"
                                    value={editingVoucher.voucherName}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginBottom: '16px' }}
                                />
                                <FormControl fullWidth sx={{ marginBottom: '16px' }}>
                                    <InputLabel>Loại mã giảm giá</InputLabel>
                                    <Select
                                        label="Loại mã giảm giá"
                                        name="voucherType"
                                        value={editingVoucher.voucherType}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Fixed">Fixed</MenuItem>
                                        <MenuItem value="Percentage">Percentage</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Giá trị giảm giá"
                                    name="discountValue"
                                    value={editingVoucher.discountValue}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginBottom: '16px' }}
                                />
                                <TextField
                                    label="Giá trị giảm giá tối đa"
                                    name="maxDiscount"
                                    value={editingVoucher.maxDiscount}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginBottom: '16px' }}
                                />
                                <TextField
                                    label="Yêu cầu đơn hàng tối thiểu"
                                    name="minOrderValue"
                                    value={editingVoucher.minOrderValue}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginBottom: '16px' }}
                                />
                                <TextField
                                    label="Ngày bắt đầu"
                                    name="startDate"
                                    type="datetime-local"
                                    value={new Date(editingVoucher.startDate).toISOString().slice(0, 16)}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginBottom: '16px' }}
                                />
                                <TextField
                                    label="Ngày hết hạn"
                                    name="endDate"
                                    type="datetime-local"
                                    value={new Date(editingVoucher.endDate).toISOString().slice(0, 16)}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginBottom: '16px' }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '8px' }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleSaveVoucher}
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Hủy
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography>Mô tả: {voucher.voucherName}</Typography>
                                <Typography>
                                    Giảm giá: {voucher.voucherType === 'Percentage'
                                        ? `${voucher.discountValue}%`
                                        : `${voucher.discountValue.toLocaleString()} VND`}
                                </Typography>
                                <Typography>Giảm giá tối đa: {voucher.maxDiscount.toLocaleString()} VND</Typography>
                                <Typography>Yêu cầu giá trị đơn hàng tối thiểu: {voucher.minOrderValue.toLocaleString()} VND</Typography>
                                <Typography>
                                    Ngày bắt đầu: {new Date(voucher.startDate).toLocaleDateString('en-GB')}
                                </Typography>
                                <Typography>
                                    Ngày hết hạn: {new Date(voucher.endDate).toLocaleDateString('en-GB')}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '8px' }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteVoucher(voucher.voucherId)}
                                    >
                                        Xóa
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        sx={{
                                            color: 'black',
                                            backgroundColor: 'transparent',
                                            borderColor: 'black',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                                borderColor: 'black',
                                            },
                                        }}
                                        onClick={() => handleEditVoucher(voucher)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                ))
            )}
        </Box>
    );
};

export default VoucherPage;
