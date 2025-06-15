import axios from "axios";
import axiosClient from '@api/axiosClient';

const API_BASE = "http://localhost:3001";  // Đổi thành URL backend của bạn

// Nước hoa
export const fetchPerfumes = async () => {
  const response = await axios.get(`${API_BASE}/perfumes`);
  return response.data;
};

export const fetchActiveProductCategories = async () => {
  try {
    const response = await axiosClient.get("/categories");
    return response.data.filter(category => category.status === "active");
  } catch (error) {
    console.error("Lỗi khi lấy danh mục sản phẩm:", error);
    throw error;
  }
};

export const fetchFeaturedProducts = async () => {
  try {
    const response = await axiosClient.get("/featured-products");

    // Kiểm tra nếu dữ liệu đúng là mảng
    const products = Array.isArray(response.data.data)
      ? response.data.data
      : [];

    return products.slice(0, 10); // Lấy 10 sản phẩm đầu tiên
  } catch (error) {
    console.error("Lỗi khi fetch featured products:", error);
    return [];
  }
};

export const fetchNewProducts = async () => {
  try {
    const response = await axiosClient.get("/new-products");
    return response.data.slice(0, 10);
  } catch (error) {
    console.error("Lỗi khi fetch new products:", error);
    return [];
  }
};


