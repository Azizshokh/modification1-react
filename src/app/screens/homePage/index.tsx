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
import { setNewProducts, setPopularProducts, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";

/*** Redux slice & Selector ***/
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
  setNewProducts: (data: Product[]) => dispatch(setNewProducts(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export default function HomeScreen(): React.JSX.Element {
  const { setPopularProducts, setNewProducts, setTopUsers } =
    actionDispatch(useDispatch());
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

    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "createdAt",
      })
      .then((data) => {
        setNewProducts(data);
      })
      .catch((err) => {
        console.log("Error fetching new products: ", err);
      });

    const memberService = new MemberService();
    memberService
      .getTopUsers()
      .then((data) => {
        setTopUsers(data);
      })
      .catch((err) => {
        console.log("Error fetching top users: ", err);
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
