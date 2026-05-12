import React from "react";
import { Box } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";

import HomeScreen from "./screens/homePage";
import ProductsPage from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { Footer } from "./components/footer";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { OtherNavbar } from "./components/headers/OtherNavbar";
import HelpPage from "./screens/helpPage";
import VeterinaryPage from "./screens/veterinaryPage";

function App(): React.JSX.Element {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Box sx={{ textAlign: "center" }}>
      {isHomePage ? <HomeNavbar /> : <OtherNavbar />}

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/products/*" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/member-page" element={<UserPage />} />
        <Route path="/veterinary" element={<VeterinaryPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>

      <Footer />
    </Box>
  );
}

export default App;
