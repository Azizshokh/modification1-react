import React, { useEffect } from "react";
import { HomePage } from "./HomePage";
import OurServices from "./OurServices";
import NewProducts from "./NewProducts";
import AboutUs from "./AboutUs";
import ActiveUsers from "./ActiveUsers";
import PopularProducts from "./PopularProducts";
import Events from "./Events";

export default function HomeScreen(): React.JSX.Element {
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
