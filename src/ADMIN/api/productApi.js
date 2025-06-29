import axiosAdmin from "@adminApi/axiosAdmin";

export const fetchAdminProducts = async () => {
  try {
    const res = await axiosAdmin.get("/products");
    return res.data.data; 
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm:", err);
    throw err;
  }
};

export const createAdminProduct = async (formData) => {
  try {
    const res = await axiosAdmin.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm:", err.response?.data?.errors);
    console.error("Lỗi khi thêm sản phẩm:", err);
    throw err;
  }
};

export const updateAdminProduct = async (id_product, formData) => {
  try {
    const res = await axiosAdmin.post(`/products/${id_product}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi cập nhật sản phẩm:", err.response?.data?.errors);
    throw err;
  }
};

export const deleteAdminProduct = async (id_product) => {
  return await axiosAdmin.delete(`/products/${id_product}`);
};

