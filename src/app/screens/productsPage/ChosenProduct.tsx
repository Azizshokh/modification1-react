import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Rating,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "./../../../css/product/chosenProduct.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  descriptionExtra: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  tag?: "New" | "Sale" | "Popular";
  weight: string;
  category: string;
  images: string[];
}

// ─── Hardcoded Product ────────────────────────────────────────────────────────

const PRODUCT: ProductDetail = {
  id: 1,
  name: "Chicken Caesar Salad",
  description:
    "Chicken Caesar Salad is a popular and well-balanced dish that combines fresh and flavourful ingredients to create a satisfying meal. It typically features grilled or roasted chicken breast, served over a bed of crisp romaine lettuce, topped with shaved parmesan cheese, golden garlic croutons, and classic Caesar dressing made from olive oil, egg yolk, lemon juice, anchovies, garlic, and mustard.",
  descriptionExtra:
    "This salad is known for its rich, creamy, and tangy flavour profile with a perfect balance of textures – the juiciness of the chicken, the crunch of fresh lettuce and croutons, and the smoothness of the dressing. Some versions may include extras like boiled eggs, bacon bits, or avocado for added taste and nutrition.",
  price: 75,
  oldPrice: 96,
  rating: 4.5,
  reviews: 218,
  tag: "Popular",
  weight: "400 g",
  category: "Cats",
  images: [
    "/img/products/Cat_LP_DryFood_8.jpg",
    "/img/products/Cat_LP_DryFood_8.jpg",
    "/img/products/Cat_LP_DryFood_8.jpg",
    "/img/products/Cat_LP_DryFood_8.jpg",
  ],
};

const TAG_COLORS: Record<string, string> = {
  New: "#4ade80",
  Sale: "#f87171",
  Popular: "#fb923c",
};

// ─── Component ────────────────────────────────────────────────────────────────

const ChosenProduct: React.FC = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [orderedNow, setOrderedNow] = useState(false);

  const product = PRODUCT;

  const handleOrder = () => {
    setOrderedNow(true);
    setTimeout(() => setOrderedNow(false), 1400);
  };

  const handleCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1400);
  };

  const handleBackToMenu = () => {
    navigate("/products");
  };

  const formatPrice = (p: number) => `$${p}`;

  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100,
  );

  return (
    <Box className="chosen-page">
      {/* ── Back ─────────────────────────────────────────────────────────── */}
      <Box className="chosen-back">
        <IconButton
          className="back-btn"
          size="small"
          onClick={handleBackToMenu}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography className="back-label" onClick={handleBackToMenu}>
          Back to menu
        </Typography>
      </Box>

      {/* ── Main card ────────────────────────────────────────────────────── */}
      <Box className="chosen-card">
        {/* LEFT — images */}
        <Box className="chosen-left">
          {/* Main image */}
          <Box className="main-image-wrapper">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="main-image"
            />
          </Box>

          {/* Thumbnails */}
          <Box className="thumbnails">
            {product.images.map((img, i) => (
              <Box
                key={i}
                className={`thumb-wrapper ${activeImage === i ? "thumb-active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt={`thumb-${i}`} className="thumb-img" />
              </Box>
            ))}
          </Box>
        </Box>

        {/* RIGHT — info */}
        <Box className="chosen-right">
          {/* Top actions */}
          <Box className="chosen-top-actions">
            <Tooltip
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <IconButton
                className={`action-icon-btn ${isFav ? "fav-active-btn" : ""}`}
                size="small"
                onClick={() => setIsFav((v) => !v)}
              >
                {isFav ? (
                  <FavoriteIcon fontSize="small" sx={{ color: "#f43f5e" }} />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton className="action-icon-btn" size="small">
                <ShareOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Category breadcrumb */}
          <Typography className="chosen-category">
            {product.category} / Food
          </Typography>

          {/* Name */}
          <Typography className="chosen-name" variant="h4">
            {product.name}
          </Typography>

          {/* Description */}
          <Typography className="chosen-desc">{product.description}</Typography>
          <Typography className="chosen-desc chosen-desc-extra">
            {product.descriptionExtra}
          </Typography>

          <Divider className="chosen-divider" />

          {/* Quantity + Price row */}
          <Box className="qty-price-row">
            {/* Quantity */}
            <Box className="qty-box">
              <IconButton
                className="qty-btn qty-minus"
                size="small"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography className="qty-value">{quantity}</Typography>
              <IconButton
                className="qty-btn qty-plus"
                size="small"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Price */}
            <Box className="price-block">
              <Typography className="old-price">
                {formatPrice(product.oldPrice * quantity)}
              </Typography>
              <Typography className="current-price">
                {formatPrice(product.price * quantity)}
              </Typography>
              <Box className="price-rating">
                <Rating
                  value={product.rating}
                  precision={0.5}
                  readOnly
                  size="small"
                  className="chosen-rating"
                />
              </Box>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box className="chosen-actions">
            <Button
              variant="contained"
              className={`order-now-btn ${orderedNow ? "ordered" : ""}`}
              onClick={handleOrder}
              disableElevation
            >
              {orderedNow ? "✓ Ordered!" : "Order Now"}
            </Button>
            <Button
              variant="outlined"
              className={`add-cart-btn ${addedToCart ? "carted" : ""}`}
              onClick={handleCart}
              startIcon={
                addedToCart ? undefined : (
                  <ShoppingCartOutlinedIcon fontSize="small" />
                )
              }
              disableElevation
            >
              {addedToCart ? "✓ Added!" : "Add to Card"}
            </Button>
          </Box>

          {/* Badges */}
          <Box className="chosen-badges">
            <Box className="badge-item">
              <LocalShippingOutlinedIcon className="badge-icon" />
              <Typography className="badge-text">Free delivery</Typography>
            </Box>
            <Box className="badge-item">
              <VerifiedOutlinedIcon className="badge-icon" />
              <Typography className="badge-text">Quality guaranteed</Typography>
            </Box>
            <Box className="badge-item">
              <Typography className="badge-weight">
                ⚖️ {product.weight}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChosenProduct;
