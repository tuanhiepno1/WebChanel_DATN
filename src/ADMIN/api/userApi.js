import axiosAdmin from "@adminApi/axiosAdmin";

export const fetchAdminUsers = async () => {
  try {
    const res = await axiosAdmin.get("/users");
    return res.data?.data || [];
  } catch (err) {
    console.error("Lỗi khi lấy danh sách user:", err);
    return [];
  }
};

export const createAdminUser = async (userData) => {
  const formData = new FormData();

  for (const key in userData) {
    if (userData[key] !== undefined && userData[key] !== null) {
      formData.append(key, userData[key]);
    }
  }

  const res = await axiosAdmin.post("/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const updateAdminUser = async (id, formData) => {
  try {
    const res = await axiosAdmin.post(`/users/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi cập nhật user:", err.response?.data || err);
    throw err;
  }
};

export const deleteAdminUser = async (id_user) => {
  try {
    const response = await axiosAdmin.delete(`/users/${id_user}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xoá user:", error);
    throw error;
  }
};

export const fetchOrderHistoryByUserId = async (id_user) => {
  const res = await axiosAdmin.get(`/order-history/${id_user}`);
  return res.data?.data || [];
};