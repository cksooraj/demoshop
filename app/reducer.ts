import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemType } from "../pages/index";
export interface CartState {
	cartItems: CartItemType[];
}

const initialState: CartState = {
	cartItems: [] as CartItemType[],
};

export const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		setCartItemsData: (state, action: PayloadAction<CartItemType[]>) => {
			state.cartItems = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setCartItemsData } = cartSlice.actions;

export default cartSlice.reducer;
