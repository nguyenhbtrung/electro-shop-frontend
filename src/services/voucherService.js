import api from "./axios/axios.customize";

// Lấy danh sách mã giảm giá
export const getVouchers = () => {
  const URL_API = "/api/Voucher/all_voucher";
  return api.get(URL_API);
};

// Xóa mã giảm giá
export const deleteVoucher = (voucherId) => {
  const URL_API = `/api/Voucher/${voucherId}`;
  return api.delete(URL_API);
};

// Cập nhật mã giảm giá
export const updateVoucher = (voucherId, voucherData) => {
  const URL_API = `/api/Voucher/${voucherId}`;
  return api.put(URL_API, voucherData);
};

// Tạo mã giảm giá mới
export const createVoucher = (voucherData) => {
  const URL_API = "/api/Voucher";
  return api.post(URL_API, voucherData);
};
