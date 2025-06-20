import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "@api/userApi";
import { clearCart, loadCartFromUser } from "@redux/cartSlice";

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

      // Lưu token và userId
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginAndLoadCart = (credentials) => async (dispatch) => {
  const result = await dispatch(login(credentials));
  if (login.fulfilled.match(result)) {
    const userId = result.payload.user.id;
    const cartData = JSON.parse(localStorage.getItem(`cart_user_${userId}`)) || [];
    dispatch(loadCartFromUser(cartData));
  }
  return result;
};

export const logoutAndClearCart = () => (dispatch) => {
  dispatch(logout());        // ✅ gọi logout từ authSlice
  dispatch(clearCart());     // ✅ gọi xóa cart từ cartSlice
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
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
  },
  extraReducers: (builder) => {
    builder
      // Đăng ký
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

      // Đăng nhập
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

