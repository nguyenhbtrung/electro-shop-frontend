import api from "./axios/axios.customize";

export const getVouchers = () => {
  const URL_API = "/api/Voucher/all_voucher";
  return api.get(URL_API);
};

export const deleteVoucher = (voucherId) => {
  const URL_API = `/api/Voucher/${voucherId}`;
  return api.delete(URL_API);
};

export const updateVoucher = (voucherId, voucherData) => {
  const URL_API = `/api/Voucher/${voucherId}`;
  return api.put(URL_API, voucherData);
};

 export const createVoucher = (voucherData) => {
  const URL_API = "/api/Voucher";
  return api.post(URL_API, voucherData);
};
