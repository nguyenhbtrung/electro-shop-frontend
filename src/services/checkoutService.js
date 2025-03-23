// src/pages/user/paymentPage/paymentService.js
import api from './axios/axios.customize'

export const GetUserInfo = (userName) => {
  return api.get(`/api/User/user/${userName}`);
};

export const GetAvailableVouchers = () => {
  return api.get("/api/Voucher/available_voucher");
};

export const GetUserCart = (userName) => {
  return api.get(`/api/Cart/user/viewcart`);
};

export const CreateOrder = async (voucherCode, payment) => {
  try {
    const response = await api.post(
      `/api/Order/user/createorder?voucherCode=${voucherCode}&payment=${payment}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};