import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "@api/userApi";
import { clearCart, fetchCart } from "@redux/cartSlice";

// Đăng ký
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await registerUser(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Đăng nhập + load cart
export const loginAndLoadCart = (credentials) => async (dispatch) => {
  const result = await dispatch(login(credentials));
  if (login.fulfilled.match(result)) {
    const userId = result.payload.user.id;
    await dispatch(fetchCart(userId));
  }
  return result;
};

// Logout + clear cart
export const logoutAndClearCart = () => (dispatch) => {
  dispatch(logout());
  dispatch(clearCart());
};

// Lấy user từ localStorage (chạy khi app khởi động)
export const restoreUserFromLocalStorage = () => (dispatch) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (userData && token) {
      const id = userData.id || userData.id_user;
      const user = { ...userData, id };

      dispatch(restoreUser({ user, token }));
      dispatch(fetchCart(id));
    }
  } catch (err) {
    console.error("⚠️ Lỗi khi restore user:", err);
  }
};

const userFromStorage = localStorage.getItem("user");
const tokenFromStorage = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
     token: tokenFromStorage || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
    },
    updateUserInfo: (state, action) => {
      const updatedUser = {
        ...state.user,
        ...action.payload,
      };

      if (updatedUser.image && !updatedUser.image.startsWith("http")) {
        updatedUser.image = `${import.meta.env.VITE_ASSET_BASE_URL}${
          updatedUser.image
        }`;
      }

      state.user = updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
    restoreUser: (state, action) => {
      const user = {
        ...action.payload.user,
        id: action.payload.user.id_user, // ✅ Thêm dòng này
      };
      state.user = user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        const user = {
          ...action.payload.user,
          id: action.payload.user.id_user, // ✅ Thêm dòng này
        };
        state.user = user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateUserInfo, restoreUser } = authSlice.actions;
export default authSlice.reducer;
