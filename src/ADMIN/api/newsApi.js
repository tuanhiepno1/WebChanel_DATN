import axiosAdmin from "@adminApi/axiosAdmin";

export const fetchAdminArticles = async () => {
  try {
    const { data } = await axiosAdmin.get("/articles");
    return data?.articles || [];
  } catch (err) {
    console.error("Lấy danh sách bài viết lỗi:", err);
    throw err;
  }
};

export const createAdminArticle = async (
  { id_user, title, content, status, image },
  onUploadProgress
) => {
  const fd = new FormData();
  fd.append("id_user", String(id_user));
  fd.append("title", title);
  fd.append("content", content);
  fd.append("status", status);
  fd.append("image", image); 

  try {
    const { data } = await axiosAdmin.post("/articles", fd, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return data?.article || data; 
  } catch (err) {
    console.error("createAdminArticle error:", err?.response?.data || err);
    throw err;
  }
};

export const updateAdminArticle = async (
  id_articles,
  { title, content, status, image },
  onUploadProgress
) => {
  const fd = new FormData();
  if (title !== undefined) fd.append("title", title);
  if (content !== undefined) fd.append("content", content);
  if (status !== undefined) fd.append("status", status);
  if (image) fd.append("image", image);

  try {
    const { data } = await axiosAdmin.post(`/articles/${id_articles}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return data?.article || data;
  } catch (err) {
    console.error("updateAdminArticle error:", err?.response?.data || err);
    throw err; 
  }
};

export const deleteAdminArticle = async (id_articles) => {
  try {
    const { data } = await axiosAdmin.delete(`/articles/${id_articles}`);
    return data;
  } catch (err) {
    // Fallback cho server không hỗ trợ DELETE trực tiếp (405)
    if (err?.response?.status === 405) {
      const fd = new FormData();
      fd.append("_method", "DELETE");
      const { data } = await axiosAdmin.post(`/articles/${id_articles}`, fd);
      return data;
    }
    console.error("deleteAdminArticle error:", err?.response?.data || err);
    throw err;
  }
};
