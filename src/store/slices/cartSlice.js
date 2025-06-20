import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    const stored = localStorage.getItem(`cart_user_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const saveToLocalStorage = (items) => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    localStorage.setItem(`cart_user_${userId}`, JSON.stringify(items));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: getInitialCart(),
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveToLocalStorage(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveToLocalStorage(state.items);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        saveToLocalStorage(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      saveToLocalStorage(state.items);
    },
    loadCartFromUser(state, action) {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCartFromUser,
} = cartSlice.actions;

export default cartSlice.reducer;
