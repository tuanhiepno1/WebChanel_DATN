import axiosClient from "@api/axiosClient";


export const getCartByUserAPI = (userId) => {
  return axiosClient.get(`/cart/${userId}`);
};

export const addToCartAPI = (userId, data) => {
  return axiosClient.post(`/addtocart/${userId}`, data);
};

export const updateCartItemAPI = (userId, data) => {
  return axiosClient.put(`/updatecart/${userId}`, data);
};

export const deleteCartItemAPI = (userId, data) => {
  return axiosClient.delete(`/deletecartproduct/${userId}`, { data });
};

export const checkoutAPI = (userId, data) => {
  return axiosClient.post(`/checkout/${userId}`, data);
};

export const fetchVouchers = async () => {
  try {
    const response = await axiosClient.get("/vouchers");
    return response.data.vouchers || [];
  } catch (error) {
    console.error("Lỗi khi fetch vouchers:", error);
    return [];
  }
};