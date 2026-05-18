import { createSlice } from "@reduxjs/toolkit";
import { ProductsPageState } from "../../../lib/types/screen";

const initialState: ProductsPageState = {
    market: null,
    chosenProduct: null,
    products: [],
}

const productsPageSlice = createSlice({
    name: "productsPage",
    initialState,
    reducers: {
        setMarket: (state, action) => {
            state.market = action.payload;
        },
        setChosenProduct: (state, action) => {
            state.chosenProduct = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
    },
});

export const { setMarket, setChosenProduct, setProducts } = productsPageSlice.actions;

const ProductPageReducer = productsPageSlice.reducer;
export default ProductPageReducer;