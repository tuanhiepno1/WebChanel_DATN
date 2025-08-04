import axiosAdmin from "@adminApi/axiosAdmin";

// Lấy tất cả đơn hàng
export const fetchAllOrders = async () => {
  const res = await axiosAdmin.get("/orders");
  return res.data.orders;
};

// Lấy chi tiết đơn hàng theo ID
export const fetchOrderById = async (id_order) => {
  const res = await axiosAdmin.get(`/orders/${id_order}`);
  return res.data.order;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id_order, status) => {
  const res = await axiosAdmin.put(`/orders/${id_order}/status`, { status });
  return res.data;
};