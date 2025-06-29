import axiosClient from '@api/axiosClient';

// Đăng ký
export const registerUser = async (data) => {
  try {
    const res = await axiosClient.post('/register', {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
};

// Đăng nhập
export const loginUser = async ({ email, password }) => {
  try {
    const res = await axiosClient.post('/login', {
      email,
      password,
    });

    // Lưu token nếu cần
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
    }

    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
};

export const fetchOrderHistoryByUserId = async (id_user) => {
  try {
    const response = await axiosClient.get(`/order-history/${id_user}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
    return [];
  }
};

export const updateUser = async (id, updatedData) => {
  const formData = new FormData();

  formData.append("username", updatedData.username);
  formData.append("email", updatedData.email);
  formData.append("phone", updatedData.phone);
  formData.append("address", updatedData.address);

  if (updatedData.password) {
    formData.append("password", updatedData.password);
  }

  if (updatedData.avatar instanceof File) {
    formData.append("avatar", updatedData.avatar);
  }

  const response = await axiosClient.post(`/users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};



// Gửi email và mã code
export const checkEmailAndSendCode = async (email) => {
  try {
    const res = await axiosClient.post('/check-email-send-code', { email });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gửi mã xác nhận thất bại');
  }
};

// Kiểm tra mã code
export const checkCode = async (data) => {
  try {
    const res = await axiosClient.post('/check-code', data); // data = { email, code }
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Mã xác nhận không đúng');
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (data) => {
  try {
    const res = await axiosClient.post("/reset-password", data); 
    // data = { email, password, confirm_password }
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đặt lại mật khẩu thất bại"
    );
  }
};
