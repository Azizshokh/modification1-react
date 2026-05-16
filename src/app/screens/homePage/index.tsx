import React, { useEffect } from "react";
import { HomePage } from "./HomePage";
import OurServices from "./OurServices";
import NewProducts from "./NewProducts";
import AboutUs from "./AboutUs";
import ActiveUsers from "./ActiveUsers";
import PopularProducts from "./PopularProducts";
import Events from "./Events";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setPopularProducts } from "./slice";
import { retrievePopularProducts } from "./selector";
import { Product } from "../../../lib/types/product";

/*** Redux slice & Selector ***/
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
});
const popularProductsRetriever = createSelector(
  retrievePopularProducts,
  (popularProducts) => ({ popularProducts }),
);

export default function HomeScreen(): React.JSX.Element {
  const { setPopularProducts } = actionDispatch(useDispatch());
  const popularProducts = useSelector(retrievePopularProducts);
  // Selector: Store => Data

  useEffect(() => {
    // Backend server data requset => Data
    // Slice: Data => Store
  }, []);

  return (
    <div className="homePage">
      <HomePage />
      <OurServices />
      <PopularProducts />
      <NewProducts />
      <AboutUs />
      <ActiveUsers />
      <Events />
    </div>
  );
}
