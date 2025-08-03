import axiosAdmin from "@adminApi/axiosAdmin"; // Đường dẫn tùy theo cấu trúc dự án của bạn

// 1. Lấy danh sách tất cả voucher
export const fetchVouchers = async () => {
  const response = await axiosAdmin.get('/vouchers');
  console.log("Vouchers API response:", response.data);
  return response.data.vouchers;
};

// 2. Tạo mới một voucher
export const createVoucher = async (voucherData) => {
  const response = await axiosAdmin.post('/vouchers', voucherData);
  return response.data;
};

// 3. Cập nhật voucher theo ID
export const updateVoucher = async (id_voucher, voucherData) => {
  const response = await axiosAdmin.put(`/vouchers/${id_voucher}`, voucherData);
  return response.data;
};

// 4. Xóa voucher theo ID
export const deleteVoucher = async (id_voucher) => {
  const response = await axiosAdmin.delete(`/vouchers/${id_voucher}`);
  return response.data;
};
