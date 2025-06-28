import axiosAdmin from "@adminApi/axiosAdmin";

export const fetchAdminCategories = async () => {
  const response = await axiosAdmin.get("/categories");
  return response.data.categories;
};

export const fetchAdminSubcategories = async () => {
  try {
    const res = await axiosAdmin.get("/subcategories");
    return res.data.data; // trả về mảng danh mục con
  } catch (err) {
    console.error("Lỗi khi lấy danh mục con:", err);
    return [];
  }
};

export const createAdminCategory = async (payload) => {
  try {
    const formData = new FormData();

    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const status = payload.status === "active" ? "active" : "inactive";

    if (!name) {
      throw new Error("Tên danh mục không được để trống");
    }

    formData.append("category_name", name);
    formData.append("status", status);

    if (payload.category_image instanceof File) {
      formData.append("category_image", payload.category_image);
    }

    console.log("FormData gửi đi:");
    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    const res = await axiosAdmin.post("/createcategories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error("Lỗi validate từ server:", err.response?.data);
    console.error("Lỗi khi thêm danh mục:", err);
    throw err;
  }
};




export const updateAdminCategory = async (id_category, payload) => {
  try {
    const formData = new FormData();

    // ✅ Chỉ append nếu tồn tại
    if (payload.category_name) {
      formData.append("category_name", payload.category_name);
    }

    if (payload.status) {
      formData.append("status", payload.status);
    }

    if (payload.category_image instanceof File) {
      formData.append("category_image", payload.category_image);
    }

    console.log("Payload gửi đi (formData):");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    const response = await axiosAdmin.post(
      `/categories/${id_category}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi validate từ server:", error.response?.data);
    console.error("Lỗi khi cập nhật danh mục:", error);
    throw error;
  }
};

export const createAdminSubcategory = async (payload) => {
  try {
    const res = await axiosAdmin.post("/createsubcategories", payload);
    return res.data;
  } catch (err) {
    console.error("Lỗi tạo danh mục con:", err);
    throw err;
  }
};

export const updateAdminSubcategory = async (id_subcategory, payload) => {
  try {
    const res = await axiosAdmin.put(
      `/subcategories/${id_subcategory}`,
      payload
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi cập nhật danh mục con:", err);
    throw err;
  }
};
