import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import "./../../../css/home/newProducts.css";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { ProductCollection } from "../../../lib/enums/product.enum";

/** Redux Slice & Selector **/
const newProductsRetriever = createSelector(
  retrieveNewProducts,
  (newProducts) => ({ newProducts }),
);

// ─── Product Card ─────────────────────────────────────────────────
function NewProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);

  const imagePath = `${serverApi}/${product.productImages[0]}`;
  const volumeLabel =
    product.productCollection === ProductCollection.GADGETS
      ? product.productSize
      : product.productWeight >= 1000
        ? `${product.productWeight / 1000} KG`
        : `${product.productWeight} GR`;

  return (
    <Box className="new-card">
      {/* Diagonal ribbon */}
      <Box className="new-card__ribbon">NEW</Box>

      {/* Image wrapper — inset rounded frame */}
      <Box className="new-card__image-wrap">
        <Box
          className="new-card__image"
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
          {imgError && <Box className="new-card__fallback">🐾</Box>}
        </Box>

        {/* Size badge over image */}
        <Box className="new-card__size-badge">{volumeLabel}</Box>
      </Box>

      {/* Card body */}
      <Box className="new-card__body">
        <span className="new-card__name">{product.productName}</span>

        <Box className="new-card__collection-tag">
          {product.productCollection}
        </Box>

        <Box className="new-card__footer">
          <span className="new-card__price">${product.productPrice}</span>

          <Box className="new-card__footer-right">
            <span className="new-card__views">
              <VisibilityIcon className="new-card__eye-icon" />
              {product.productViews}
            </span>
            <Box
              component="button"
              className={`new-card__like-btn${liked ? " new-card__like-btn--active" : ""}`}
              onClick={() => setLiked((v) => !v)}
              aria-label="Like"
            >
              {liked ? (
                <FavoriteIcon className="new-card__like-icon new-card__like-icon--filled" />
              ) : (
                <FavoriteBorderIcon className="new-card__like-icon" />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main section ─────────────────────────────────────────────────
export default function NewProducts(): React.JSX.Element {
  const { newProducts } = useSelector(newProductsRetriever);

  return (
    <div className="new-products-frame">
      <Container>
        <Stack className="new-products-section">
          <Box className="new-products-title">
            <NewReleasesIcon className="new-products-title__icon" />
            New Products
            <NewReleasesIcon className="new-products-title__icon" />
          </Box>
          <Stack className="new-cards-frame">
            {newProducts.length !== 0 ? (
              newProducts.map((product: Product) => (
                <NewProductCard key={product._id} product={product} />
              ))
            ) : (
              <Box className="no-data-box">
                <span className="no-data-box__icon">🐾</span>
                <span className="no-data-box__text">
                  New products are not available!!!
                </span>
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
