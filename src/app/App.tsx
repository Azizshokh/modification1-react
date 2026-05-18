import React, { useState } from "react";
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
import { CartItem } from "../lib/types/search";

function App(): React.JSX.Element {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const cartJson = localStorage.getItem("cartData");
    return cartJson ? JSON.parse(cartJson) : [];
  });

  /** HANDLERS **/

  const onAdd = (input: CartItem) => {
    const exist: any = cartItems.find(
      (item: CartItem) => item._id === input._id,
    );

    if (exist) {
      const cartUpdate = cartItems.map((item: CartItem) =>
        item._id === input._id
          ? { ...exist, quantity: exist.quantity + 1 }
          : item,
      );
      setCartItems(cartUpdate);
      localStorage.setItem("cartData", JSON.stringify(cartUpdate));
    } else {
      const cartUpdate = [...cartItems, { ...input }];
      setCartItems(cartUpdate);
      localStorage.setItem("cartData", JSON.stringify(cartUpdate));
    }
  };

  const onRemove = (_id: string) => {
    const cartUpdate = cartItems.filter((item) => item._id !== _id);
    setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
  };

  const onIncrease = (_id: string) => {
    const cartUpdate = cartItems.map((item) =>
      item._id === _id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
  };

  const onDecrease = (_id: string) => {
    const cartUpdate = cartItems
      .map((item) =>
        item._id === _id ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);
    setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
  };

  const onClearAll = () => {
    setCartItems([]);
    localStorage.removeItem("cartData");
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      {isHomePage ? (
        <HomeNavbar
          cartItems={cartItems}
          onRemove={onRemove}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onClearAll={onClearAll}
        />
      ) : (
        <OtherNavbar
          cartItems={cartItems}
          onRemove={onRemove}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onClearAll={onClearAll}
        />
      )}

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/products/*" element={<ProductsPage onAdd={onAdd} />} />
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
