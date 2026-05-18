import { createSelector } from "@reduxjs/toolkit";
import { AppRootState } from "../../../lib/types/screen";

const selectProductsPage = (state: AppRootState) => state.productsPage;

export const retrieveMarket = createSelector(
    selectProductsPage,
    (productsPage) => productsPage.market
);

export const retrieveChosenProduct = createSelector(
    selectProductsPage,
    (productsPage) => productsPage.chosenProduct
);

export const retrieveProducts = createSelector(
    selectProductsPage,
    (productsPage) => productsPage.products
);
