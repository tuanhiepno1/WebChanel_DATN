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
    const res = await axiosClient.post('/reset-password', data); // data = { email, password }
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đặt lại mật khẩu thất bại');
  }
};
