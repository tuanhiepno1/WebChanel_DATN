import axiosAdmin from "@adminApi/axiosAdmin";

export const fetchAdminReviews = async () => {
try {
const { data } = await axiosAdmin.get("/reviews");
return data?.reviews || [];
} catch (err) {
console.error("Lấy danh sách đánh giá lỗi:", err);
throw err;
}
};  