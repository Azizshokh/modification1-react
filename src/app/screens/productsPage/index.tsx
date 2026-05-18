import React from "react";
import { Route, Routes } from "react-router-dom";
import ChosenProduct from "./ChosenProduct";
import Products from "./Products";
import type { CartItem } from "../../../lib/types/search";

interface ProductsPageProps {
  onAdd: (input: CartItem) => void;
}

export default function ProductsPage({ onAdd }: ProductsPageProps) {
  return (
    <div className={"products-page"}>
      <Routes>
        <Route path=":productId" element={<ChosenProduct onAdd={onAdd} />} />
        <Route path="" element={<Products onAdd={onAdd} />} />
      </Routes>
    </div>
  );
}
