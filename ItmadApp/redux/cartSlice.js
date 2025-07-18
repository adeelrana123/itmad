import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
  addToCart: (state, action) => {
  const item = action.payload;

  const existing = state.items.find(
    i => i.id === item.id && i.variantKey === item.variantKey
  );

  if (existing) {
    existing.quantity += item.count; 
  } else {
    state.items.push({ ...item, quantity: item.count }); 
  }
},


 incrementQuantity: (state, action) => {
  const item = state.items.find(
    i => i.id === action.payload || i.variantKey === action.payload
  );
  if (item) item.quantity += 1;
},
decrementQuantity: (state, action) => {
  const item = state.items.find(
    i => i.id === action.payload || i.variantKey === action.payload
  );
  if (item && item.quantity > 1) item.quantity -= 1;
},



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
