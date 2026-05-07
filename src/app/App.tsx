import React from "react";
import { Box } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";

import { HomePage } from "./screens/homePage";
import { ProductsPage } from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { Footer } from "./components/footer";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { OtherNavbar } from "./components/headers/OtherNavbar";

import "../css/app.css";

function App(): React.JSX.Element {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Box className="App">
      {isHomePage ? <HomeNavbar /> : <OtherNavbar />}

      <Routes>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/member-page" element={<UserPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>

      <Footer />
    </Box>
  );
}

export default App;
