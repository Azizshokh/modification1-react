import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import homePageReducer from "./screens/homePage/slice";
import ProductPageReducer from "./screens/productsPage/slice";
import OrdersPageReducer from "./screens/ordersPage/slice";

export const store = configureStore({
  reducer: {
    homePage: homePageReducer,
    productsPage: ProductPageReducer,
    ordersPage: OrdersPageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
