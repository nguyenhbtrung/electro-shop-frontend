// Map trạng thái từ tiếng Anh sang tiếng Việt
export const MapStatus = (status) => {
    switch (status) {
        case 'pending':
            return 'Chờ xử lý';
        case 'approved':
            return 'Đã phê duyệt';
        case 'processing':
            return 'Đang xử lý hoàn trả';
        case 'completed':
            return 'Hoàn tất';
        case 'rejected':
            return 'Từ chối';
        default:
            return status;
    }
};

// Map phương thức trả hàng sang tiếng Việt
export const MapMethod = (method) => {
    switch (method) {
        case 'exchange':
            return 'Đổi hàng';
        case 'repair':
            return 'Sửa chữa';
        case 'refund':
            return 'Hoàn tiền';
        default:
            return method;
    }
};