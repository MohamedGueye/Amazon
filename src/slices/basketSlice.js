import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    // Actions
    addToBasket: (state, action) => {
      // This is update what's currently in the basket
      // Payload contains the product that we passed in Product.js
      state.items = [...state.items, action.payload]
    },
    removeFromBasket: (state, action) => {
      // Go to through the list of items that were dispatched to the global store and find the id
      const index = state.items.findIndex((basketItem) => basketItem.id === action.payload.id)

      let newBasket = [...state.items];

      if (index >= 0){
        // Item exist in the basket. It is removed splicing it
        newBasket.splice(index, 1);
      } else {
        console.warn(`Can't remove product (id: ${action.payload.id}) as its not in the basket`);
      }

      state.items = newBasket;
    },
  },
});

// This will allows us to use the actions in the application
export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;

// Selector for total - Reduce ES6 Function is used to calculate it
// We're iterating through the list in the basket 
// We set a total variable to 0
// We're adding each item price to that total variable
export const selectTotal = (state) => state.basket.items.reduce((total, item) => total + item.price , 0);

export default basketSlice.reducer;
