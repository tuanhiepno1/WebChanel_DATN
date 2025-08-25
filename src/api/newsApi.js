
import axiosClient from "@api/axiosClient";

export const fetchArticles = async () => {
  try {
    const { data } = await axiosClient.get("/articles");
    return data?.articles || [];
  } catch (err) {
    console.error("Lỗi lấy danh sách bài viết:", err);
    throw err;
  }
};
