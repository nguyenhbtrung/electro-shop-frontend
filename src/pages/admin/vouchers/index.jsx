import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getVouchers, deleteVoucher } from "../../services/voucherService";

const VoucherPage = () => {
    const navigate = useNavigate();

    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    // Xử lý xóa mã giảm giá
    const handleDeleteVoucher = async (voucherId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này không?')) {
            try {
                await deleteVoucher(voucherId);
                alert('Mã giảm giá đã được xóa thành công!');
                setVouchers((prevVouchers) => prevVouchers.filter((v) => v.id !== voucherId));
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
            <Button
                variant='outlined'
                sx={{ marginBottom: '16px' }}
                onClick={() => navigate('/')}
            >
                Trang chủ
            </Button>
            <Typography variant='h5' sx={{ marginBottom: '16px', textAlign: 'center' }}>
                Danh sách mã giảm giá
            </Typography>
            {vouchers.length === 0 ? (
                <Typography sx={{ fontSize: '1.2rem', textAlign: 'center', margin: '20px 0' }}>
                    Không có mã giảm giá nào!
                </Typography>
            ) : (
                vouchers.map((voucher) => (
                    <Box
                        key={voucher.id}
                        sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            padding: '16px',
                        }}
                    >
                        <Typography variant="h6">{voucher.code}</Typography>
                        <Typography>Mô tả: {voucher.description}</Typography>
                        <Typography>Giảm giá: {voucher.discount}%</Typography>
                        <Typography>Ngày hết hạn: {new Date(voucher.expiryDate).toLocaleDateString('en-GB')}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteVoucher(voucher.id)}
                            >
                                Xóa
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate(`/admin/vouchers/edit/${voucher.id}`)}
                            >
                                Chỉnh sửa
                            </Button>
                        </Box>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default VoucherPage;
