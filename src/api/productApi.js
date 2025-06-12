import axios from "axios";

const API_BASE = "http://localhost:3001";  // Đổi thành URL backend của bạn

// Nước hoa
export const fetchPerfumes = async () => {
  const response = await axios.get(`${API_BASE}/perfumes`);
  return response.data;
};

export const fetchPerfumeCategories = async () => {
  const response = await axios.get(`${API_BASE}/perfumeCategories`);
  return response.data;
};