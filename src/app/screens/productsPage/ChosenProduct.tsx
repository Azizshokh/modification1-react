import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Rating,
  Divider,
  Tooltip,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setChosenProduct } from "./slice";
import { retrieveChosenProduct } from "./selector";
import type { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";

import "./../../../css/product/chosenProduct.css";

/** Redux **/
const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct }),
);

// ─── Component ────────────────────────────────────────────────────────────────

const ChosenProduct: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [orderedNow, setOrderedNow] = useState(false);
  const [ratingValue, setRatingValue] = useState<number | null>(4.5);

  useEffect(() => {
    if (!productId) return;
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));
  }, [productId]);

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

  if (!chosenProduct) return null;

  const weightLabel =
    chosenProduct.productCollection === ProductCollection.GADGETS
      ? chosenProduct.productSize
      : chosenProduct.productWeight >= 1000
        ? `${chosenProduct.productWeight / 1000} KG`
        : `${chosenProduct.productWeight} GR`;

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
              src={`${serverApi}/${chosenProduct.productImages[activeImage]}`}
              alt={chosenProduct.productName}
              className="main-image"
            />
          </Box>

          {/* Thumbnails */}
          <Box className="thumbnails">
            {chosenProduct.productImages.map((img, i) => (
              <Box
                key={i}
                className={`thumb-wrapper ${activeImage === i ? "thumb-active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <img
                  src={`${serverApi}/${img}`}
                  alt={`thumb-${i}`}
                  className="thumb-img"
                />
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
          </Box>

          {/* Category breadcrumb */}
          <Typography className="chosen-category">
            {chosenProduct.productCollection} / Food
          </Typography>

          {/* Name */}
          <Typography className="chosen-name" variant="h4">
            {chosenProduct.productName}
          </Typography>

          {/* Description */}
          <Typography className="chosen-desc">
            {chosenProduct.productDesc
              ? chosenProduct.productDesc
              : "No Description"}
          </Typography>

          <Divider className="chosen-divider" />

          {/* Quantity + Price row */}
          <Box className="qty-price-row">
            {/* Price */}
            <Box className="price-block">
              <Typography className="current-price">
                {formatPrice(chosenProduct.productPrice * quantity)}
              </Typography>
              <Box className="price-rating">
                <Rating
                  value={ratingValue}
                  precision={0.5}
                  size="small"
                  className="chosen-rating"
                  onChange={(_e, newValue) => setRatingValue(newValue)}
                  sx={{ cursor: "pointer" }}
                />
                <Box className="product-view">
                  <RemoveRedEyeIcon sx={{ fontSize: 14, mr: "4px" }} />
                  <Typography variant="caption">
                    {chosenProduct.productViews}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box className="chosen-actions">
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
              {addedToCart ? "✓ Added!" : "Add to Cart"}
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
              <Typography className="badge-weight">⚖️ {weightLabel}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChosenProduct;
