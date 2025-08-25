import axiosAdmin from "@adminApi/axiosAdmin"; // Đường dẫn tùy theo cấu trúc dự án của bạn


export const fetchVouchers = async () => {
  const response = await axiosAdmin.get('/vouchers');
  console.log("Vouchers API response:", response.data);
  return response.data.vouchers;
};


export const createVoucher = async (voucherData) => {
  const response = await axiosAdmin.post('/vouchers', voucherData);
  return response.data;
};


export const updateVoucher = async (id_voucher, voucherData) => {
  const response = await axiosAdmin.put(`/vouchers/${id_voucher}`, voucherData);
  return response.data;
};


export const deleteVoucher = async (id_voucher) => {
  const response = await axiosAdmin.delete(`/vouchers/${id_voucher}`);
  return response.data;
};
