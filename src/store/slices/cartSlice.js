import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (!existing) {
        state.items.push({ ...action.payload, quantity: 1 });
      } else {
        existing.quantity += 1;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
