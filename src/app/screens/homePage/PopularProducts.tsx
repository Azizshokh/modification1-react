import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PetsIcon from "@mui/icons-material/Pets";
import "./../../../css/home/popularProducts.css";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

const popularProductsRetriever = createSelector(
  retrievePopularProducts,
  (popularProducts) => ({ popularProducts }),
);

// ─── Main section ─────────────────────────────────────────────────
export default function PopularProducts(): React.JSX.Element {
  const { popularProducts } = useSelector(popularProductsRetriever);

  return (
    <div className="popular-products-frame">
      <Container>
        <Stack className="popular-section">
          <Box className="category-title">
            <PetsIcon className="category-title__pets-icon" />
            Popular Products
            <PetsIcon className="category-title__pets-icon" />
          </Box>
          <Stack className="cards-frame">
            {popularProducts.length !== 0 ? (
              popularProducts.map((ele: Product) => (
                <ProductCard key={ele._id} product={ele} />
              ))
            ) : (
              <Box className="no-data-box">
                <span className="no-data-box__icon">🐾</span>
                <span className="no-data-box__text">
                  Popular products are not available!!!
                </span>
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);

  const imagePath = `${serverApi}/${product.productImages[0]}`;

  return (
    <Box className="pop-card">
      {/* Full-bleed image */}
      <Box
        className="pop-card__image"
        style={{
          backgroundImage: imgError ? undefined : `url(${imagePath})`,
        }}
      >
        <img
          src={imagePath}
          alt={product.productName}
          style={{ display: "none" }}
          onError={() => setImgError(true)}
        />
        {imgError && <Box className="pop-card__fallback">🐾</Box>}
      </Box>

      {/* Gradient overlay: name + views + like */}
      <Box className="pop-card__overlay">
        <Box className="pop-card__info-row">
          <span className="pop-card__name">{product.productName}</span>
          <Box className="pop-card__overlay-right">
            <span className="pop-card__views">
              <VisibilityIcon className="pop-card__eye-icon" />
              {product.productViews}
            </span>
            <Box
              component="button"
              className={`pop-card__like-btn${liked ? " pop-card__like-btn--active" : ""}`}
              onClick={() => setLiked((v) => !v)}
              aria-label="Like"
            >
              {liked ? (
                <FavoriteIcon className="pop-card__like-icon pop-card__like-icon--filled" />
              ) : (
                <FavoriteBorderIcon className="pop-card__like-icon" />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Description strip */}
      <Box className="pop-card__desc-strip">
        <DescriptionOutlinedIcon className="pop-card__desc-icon" />
        <span className="pop-card__desc-text">{product.productDesc}</span>
      </Box>
    </Box>
  );
}
