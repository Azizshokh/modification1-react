import { createSlice } from "@reduxjs/toolkit";
import { OrdersPageState } from "../../../lib/types/screen";

const initialState: OrdersPageState = {
  pausedOrders: [],
  processOrders: [],
  finishedOrders: [],
};

const ordersPageSlice = createSlice({
  name: "ordersPage",
  initialState,
  reducers: {
    setPausedOrders: (state, action) => {
      state.pausedOrders = Array.isArray(action.payload) ? action.payload : [];
    },
    setProcessOrders: (state, action) => {
      state.processOrders = Array.isArray(action.payload) ? action.payload : [];
    },
    setFinishedOrders: (state, action) => {
      state.finishedOrders = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { setPausedOrders, setProcessOrders, setFinishedOrders } =
  ordersPageSlice.actions;

export default ordersPageSlice.reducer;
