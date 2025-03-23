import api from "./axios/axios.customize";

export const getVouchers = () => {
  const URL_API = "/api/Vouchers/all_voucher";
  return api.get(URL_API);
};

export const deleteVoucher = (voucherId) => {
  const URL_API = `/api/Vouchers/${voucherId}`;
  return api.delete(URL_API);
};