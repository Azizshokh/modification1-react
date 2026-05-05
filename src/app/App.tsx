import React from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./screens/homePage";
import { ProductsPage } from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { OtherNavbar } from "./components/headers/OtherNavbar";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { Footer } from "./components/footer";
import "../css/app.css";

function App() {
  const location = useLocation();
  console.log("Current location:", location.pathname);
  return (
    <>
      {location.pathname === "/" ? <HomeNavbar /> : <OtherNavbar />}
      <Routes>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/member-page" element={<UserPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
