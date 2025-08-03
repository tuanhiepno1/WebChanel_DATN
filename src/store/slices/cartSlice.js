import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToCartAPI,
  getCartByUserAPI,
  updateCartItemAPI,
  deleteCartItemAPI,
} from "@api/cartApi";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId, { rejectWithValue }) => {
  try {
    const response = await getCartByUserAPI(userId); 
    
    const items = response.data.data || [];
    return items.map((item) => ({
      ...item,
      id: item.id_product,
    }));
  } catch (err) {
    console.error("❌ CART ERROR:", err);
    return rejectWithValue(err.message);
  }
});



export const addToCart = createAsyncThunk("cart/addToCart", async ({ userId, product }) => {
  await addToCartAPI(userId, { id_product: product.id, quantity: 1 });
  return { ...product, quantity: 1 };
});

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ userId, id, quantity }) => {
    await updateCartItemAPI(userId, { id_product: id, quantity });
    return { id, quantity };
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, id }) => {
    await deleteCartItemAPI(userId, { id_product: id });
    return id;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existing = state.items.find((item) => item.id === action.payload.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const item = state.items.find((item) => item.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
