import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import "./../../../css/home/newProducts.css";

// ─── Types ───────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: number;
  views: number;
  badge: string;
  description: string;
  image: string;
}

// ─── Mock data ────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Orijen Cat Food",
    price: 42,
    views: 54,
    badge: "NEW",
    description:
      "Biologically appropriate dry food made from fresh ingredients.",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
  },
  {
    id: 2,
    name: "Acana Pacifica",
    price: 38,
    views: 41,
    badge: "NEW",
    description: "Ocean fish recipe rich in protein and omega-3 fatty acids.",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
  },
  {
    id: 3,
    name: "Purina Pro Plan",
    price: 29,
    views: 33,
    badge: "HOT",
    description: "Scientifically developed nutrition for cats of all ages.",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
  },
  {
    id: 4,
    name: "Blue Buffalo",
    price: 34,
    views: 27,
    badge: "NEW",
    description:
      "Natural ingredients with no artificial preservatives or colors.",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
  },
];

// ─── Product Card ─────────────────────────────────────────────────
function NewProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <Box className="new-card">
      {/* Badge */}
      <Box
        className={`new-card__badge${product.badge === "HOT" ? " new-card__badge--hot" : ""}`}
      >
        {product.badge}
      </Box>

      {/* Image */}
      <Box
        className="new-card__image"
        style={{
          backgroundImage: imgError ? undefined : `url(${product.image})`,
        }}
        onError={() => setImgError(true)}
      >
        {imgError && <Box className="new-card__fallback">🐾</Box>}
      </Box>

      {/* Overlay: name + views + like */}
      <Box className="new-card__overlay">
        <Box className="new-card__info-row">
          <span className="new-card__name">{product.name}</span>
          <Box className="new-card__overlay-right">
            <span className="new-card__views">
              <VisibilityIcon className="new-card__eye-icon" />
              {product.views}
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

      {/* Description strip */}
      <Box className="new-card__desc-strip">
        <span className="new-card__price">${product.price}</span>
        <span className="new-card__desc-text">{product.description}</span>
      </Box>
    </Box>
  );
}

// ─── Main section ─────────────────────────────────────────────────
export default function NewProducts(): React.JSX.Element {
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
            {PRODUCTS.length !== 0 ? (
              PRODUCTS.map((product) => (
                <NewProductCard key={product.id} product={product} />
              ))
            ) : (
              <Box className="no-data-box">
                <span className="no-data-box__icon">🐾</span>
                <span className="no-data-box__text">
                  New products are not available!
                </span>
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
