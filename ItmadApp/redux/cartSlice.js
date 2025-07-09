import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // addToCart: (state, action) => {
    //   const existing = state.items.find(i => i.id === action.payload.id);
    //   if (existing) {
    //     existing.quantity += 1;
    //   } else {
    //     state.items.push({ ...action.payload, quantity: 1 });
    //   }
    // },
    addToCart: (state, action) => {
  const item = action.payload;

  const existing = state.items.find(
    i => i.id === item.id && i.variantKey === item.variantKey
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    state.items.push({ ...item, quantity: 1 });
  }
},

    incrementQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    // removeFromCart: (state, action) => {
    //   state.items = state.items.filter(i => i.id !== action.payload);
    // },
   removeFromCart: (state, action) => {
  const variantKeyToRemove = action.payload.variantKey;
  state.items = state.items.filter(item => item.variantKey !== variantKeyToRemove);
},

     clearCart: (state) => {
      state.items = []; // ✅ Clear all cart items
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
   clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
