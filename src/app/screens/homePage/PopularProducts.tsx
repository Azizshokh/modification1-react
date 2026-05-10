import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PetsIcon from "@mui/icons-material/Pets";
import "./../../../css/home/popularProducts.css";

// ─── Types ───────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  views: number;
  description: string;
  image: string;
}

// ─── Mock data ────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Royal Canin",
    views: 37,
    description: "Premium dry food for medium adult dogs...",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
  },
  {
    id: 2,
    name: "Whiskas Tuna",
    views: 29,
    description: "Tender tuna chunks in jelly for cats...",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
  },
  {
    id: 3,
    name: "Pedigree Snack",
    views: 21,
    description: "Crunchy dental treats for healthy teeth...",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
  },
  {
    id: 4,
    name: "Pedigree Snack",
    views: 21,
    description: "Crunchy dental treats for healthy teeth...",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
  },
];

// ─── Product Card ─────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <Box className="pop-card">
      {/* Full-bleed image */}
      <Box
        className="pop-card__image"
        style={{
          backgroundImage: imgError ? undefined : `url(${product.image})`,
        }}
        onError={() => setImgError(true)}
      >
        {imgError && <Box className="pop-card__fallback">🐾</Box>}
      </Box>

      {/* Gradient overlay: name + views + like */}
      <Box className="pop-card__overlay">
        <Box className="pop-card__info-row">
          <span className="pop-card__name">{product.name}</span>
          <Box className="pop-card__overlay-right">
            <span className="pop-card__views">
              <VisibilityIcon className="pop-card__eye-icon" />
              {product.views}
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
        <span className="pop-card__desc-text">{product.description}</span>
      </Box>
    </Box>
  );
}

// ─── Main section ─────────────────────────────────────────────────
export default function PopularProducts(): React.JSX.Element {
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
            {PRODUCTS.length !== 0 ? (
              PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
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
