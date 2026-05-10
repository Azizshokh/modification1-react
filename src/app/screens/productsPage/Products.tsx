import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import "./../../../css/product/product.css";
import "./../../../css/index.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  tag?: "New" | "Sale" | "Popular";
  image: string;
  weight: string;
}

// ─── Hardcoded Products ───────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Salmon & Rice Bowl",
    price: 55000,
    rating: 4.8,
    reviews: 124,
    category: "Dogs",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1.5 kg",
  },
  {
    id: 2,
    name: "Chicken & Veggie Mix",
    price: 45000,
    rating: 4.5,
    reviews: 89,
    category: "Dogs",
    tag: "New",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "2 kg",
  },
  {
    id: 3,
    name: "Tuna Delight for Cats",
    price: 38000,
    rating: 4.9,
    reviews: 210,
    category: "Dogs",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "800 g",
  },
  {
    id: 4,
    name: "Beef Stew Premium",
    price: 62000,
    rating: 4.6,
    reviews: 67,
    category: "Dogs",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1.2 kg",
  },
  {
    id: 5,
    name: "Kitten Starter Pack",
    price: 29000,
    rating: 4.7,
    reviews: 155,
    category: "Dogs",
    tag: "Sale",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "500 g",
  },
  {
    id: 6,
    name: "Parrot Seed Blend",
    price: 22000,
    rating: 4.4,
    reviews: 43,
    category: "Dogs",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1 kg",
  },
  {
    id: 7,
    name: "Rabbit Garden Mix",
    price: 18000,
    rating: 4.3,
    reviews: 38,
    category: "Dogs",
    tag: "New",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1.5 kg",
  },
  {
    id: 8,
    name: "Grain-Free Adult Dog",
    price: 72000,
    rating: 5.0,
    reviews: 312,
    category: "Dogs",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "3 kg",
  },
];

const CATEGORIES = ["Dogs", "Cats", "Birds", "Fish", "Gadgets"];

const TAG_COLORS: Record<string, string> = {
  New: "#4ade80",
  Sale: "#f87171",
  Popular: "#fb923c",
};

// ─── Component ────────────────────────────────────────────────────────────────

const Product: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [cart, setCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const selectedCategory = CATEGORIES[activeCategory];
  const filteredProducts =
    selectedCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 1200);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const formatPrice = (price: number) => price.toLocaleString("uz-UZ") + " $";

  return (
    <Box className="product-page">
      {/* ── Header ── */}
      <Box className="product-header">
        <Typography className="product-title" variant="h4">
          Pet<span>Food</span> Menu
        </Typography>
        <Typography className="product-subtitle">
          Healthy and delicious — for your pets
        </Typography>
      </Box>

      {/* ── Category Tabs ── */}
      <Box className="tabs-wrapper">
        <Tabs
          value={activeCategory}
          onChange={(_, v) => setActiveCategory(v)}
          variant="scrollable"
          scrollButtons="auto"
          className="category-tabs"
          sx={{ "& .MuiTabs-indicator": { display: "none" } }}
        >
          {CATEGORIES.map((cat, i) => (
            <Tab
              key={cat}
              label={cat}
              className={`category-tab ${activeCategory === i ? "active-tab" : ""}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* ── Product Grid ── */}
      <Box className="product-grid-wrapper">
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
          }}
        >
          {filteredProducts.map((product) => (
            <Box key={product.id}>
              <Card
                className={`product-card ${addedToCart === product.id ? "bounce" : ""}`}
                elevation={0}
              >
                {/* Tag Chip */}
                {product.tag && (
                  <Chip
                    label={product.tag}
                    size="small"
                    className="product-tag"
                    style={{ background: TAG_COLORS[product.tag] }}
                  />
                )}

                {/* Favorite Button */}
                <Tooltip title="Add to favorites" placement="top">
                  <IconButton
                    className="fav-btn"
                    size="small"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    {favorites.includes(product.id) ? (
                      <FavoriteIcon fontSize="small" className="fav-active" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>

                {/* Image */}
                <Box className="product-image-wrapper">
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </Box>

                {/* Content */}
                <CardContent className="product-content">
                  <Typography className="product-name" variant="h6">
                    {product.name}
                  </Typography>

                  <Box className="product-meta">
                    <Typography className="product-weight">
                      ⚖️ {product.weight}
                    </Typography>
                    <Box className="rating-row">
                      <Rating
                        value={product.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                        className="product-rating"
                      />
                      <Typography className="review-count">
                        ({product.reviews})
                      </Typography>
                    </Box>
                  </Box>

                  <Typography className="product-price">
                    {formatPrice(product.price)}
                  </Typography>
                </CardContent>

                {/* Actions */}
                <CardActions className="product-actions">
                  <Button
                    variant="contained"
                    className={`order-btn ${addedToCart === product.id ? "added" : ""}`}
                    fullWidth
                    onClick={() => handleAddToCart(product.id)}
                    disableElevation
                  >
                    {addedToCart === product.id ? "✓ Added!" : "Order Now"}
                  </Button>
                  <Tooltip title="View product" placement="top">
                    <IconButton className="view-btn" size="small">
                      <RemoveRedEyeIcon
                        fontSize="small"
                        sx={{ color: "#FF4033" }}
                      />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Box>
          ))}

          {filteredProducts.length === 0 && (
            <Box className="no-data-box__text">
              <Typography>Products are not available!!!</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Product;
