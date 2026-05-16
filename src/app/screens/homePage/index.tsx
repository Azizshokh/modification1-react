import React, { useEffect } from "react";
import { HomePage } from "./HomePage";
import OurServices from "./OurServices";
import NewProducts from "./NewProducts";
import AboutUs from "./AboutUs";
import ActiveUsers from "./ActiveUsers";
import PopularProducts from "./PopularProducts";
import Events from "./Events";

import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPopularProducts } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";

/*** Redux slice & Selector ***/
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
});

export default function HomeScreen(): React.JSX.Element {
  const { setPopularProducts } = actionDispatch(useDispatch());
  // Selector: Store => Data

  useEffect(() => {
    // Backend server data requset => Data
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        productCollection: ProductCollection.CAT,
      })
      .then((data) => {
        setPopularProducts(data);
      })
      .catch((err) => {
        console.log("Error fetching popular products: ", err);
      });
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
