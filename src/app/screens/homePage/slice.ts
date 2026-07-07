import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";

const initialState: HomePageState = {
    popularProducts: [],
    newProducts: [],
    topUsers: [],
}

const homePageSlice = createSlice({
    name: "homePage",
    initialState,
    reducers: {
        setPopularProducts: (state, action) => {
            state.popularProducts = Array.isArray(action.payload) ? action.payload : [];
        },
        setNewProducts: (state, action) => {
            state.newProducts = Array.isArray(action.payload) ? action.payload : [];
        },
        setTopUsers: (state, action) => {
            state.topUsers = Array.isArray(action.payload) ? action.payload : [];
        }
    }
});

export const { setPopularProducts, setNewProducts, setTopUsers } =
    homePageSlice.actions;

const homePageReducer = homePageSlice.reducer;
export default homePageReducer;
