import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      // action.payload = newItem
      console.log(action.payload);

      state.cart.push(action.payload);
    },
    removeItem(state, action) {
      // action.payload = itemId
      console.log(action.payload);

      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    clearCart(state) {
      // No need for Payload
      state.cart = [];
    },
    incrementItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decrementItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      if (item.quantity === 0) cartSlice.caseReducers.removeItem(state, action);
    },
  },
});

export const {
  addItem,
  removeItem,
  clearCart,
  incrementItemQuantity,
  decrementItemQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getTotalItemsInCart = (state) =>
  state.cart.cart.reduce((acc, item) => acc + item.quantity, 0);

export const getTotalCartValue = (state) =>
  state.cart.cart.reduce((acc, item) => acc + item.totalPrice, 0);

export const getCart = (state) => state.cart.cart;

export const getCurrentQuantityByID = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
