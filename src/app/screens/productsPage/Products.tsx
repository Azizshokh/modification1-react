import React, { useMemo, useState } from "react";
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
  InputBase,
  Pagination,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import "./../../../css/product/product.css";

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

const PRODUCTS: Product[] = [
  // Dogs (8)

  {
    id: 8,
    name: "Chicken Senior Care",
    price: 48000,
    rating: 4.3,
    reviews: 76,
    category: "Dogs",
    tag: "Sale",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1.6 kg",
  },

  // Cats (8)
  {
    id: 11,
    name: "Chicken Pate Deluxe",
    price: 34000,
    rating: 4.6,
    reviews: 88,
    category: "Cats",
    tag: "New",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "650 g",
  },
  {
    id: 12,
    name: "Liver Boost Formula",
    price: 32000,
    rating: 4.4,
    reviews: 64,
    category: "Cats",
    tag: "Sale",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "550 g",
  },
  {
    id: 13,
    name: "Indoor Cat Balance",
    price: 39000,
    rating: 4.5,
    reviews: 91,
    category: "Cats",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "900 g",
  },
  {
    id: 14,
    name: "Hairball Control Mix",
    price: 37000,
    rating: 4.3,
    reviews: 54,
    category: "Cats",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "800 g",
  },
  {
    id: 15,
    name: "Salmon Sterilized Care",
    price: 42000,
    rating: 4.7,
    reviews: 79,
    category: "Cats",
    tag: "New",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1 kg",
  },
  {
    id: 16,
    name: "Multi-Vit Cat Crunch",
    price: 31000,
    rating: 4.2,
    reviews: 48,
    category: "Cats",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "600 g",
  },

  // Birds (8)
  {
    id: 17,
    name: "Parrot Seed Blend",
    price: 22000,
    rating: 4.4,
    reviews: 43,
    category: "Birds",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1 kg",
  },
];

const CATEGORIES = ["All", "Dogs", "Cats", "Birds", "Fish", "Gadgets"];

const TAG_COLORS: Record<string, string> = {
  New: "#4ade80",
  Sale: "#f87171",
  Popular: "#fb923c",
};

const SORT_OPTIONS = [
  { key: "new", label: "NEW", icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} /> },
  {
    key: "price",
    label: "PRICE",
    icon: <AttachMoneyIcon sx={{ fontSize: 14 }} />,
  },
  {
    key: "views",
    label: "VIEWS",
    icon: <TrendingUpIcon sx={{ fontSize: 14 }} />,
  },
];

const ITEMS_PER_PAGE = 8;

const Product: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [cart, setCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const processedProducts = useMemo(() => {
    const category = CATEGORIES[activeCategory];
    let result =
      category === "All"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category);

    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (activeSort === "new") {
      result = [
        ...result.filter((p) => p.tag === "New"),
        ...result.filter((p) => p.tag !== "New"),
      ];
    } else if (activeSort === "price") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (activeSort === "views") {
      result = [...result].sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [activeCategory, searchQuery, activeSort]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = processedProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

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

  const handleSortToggle = (key: string) => {
    setActiveSort((prev) => (prev === key ? null : key));
    setPage(1);
  };

  const handleCategoryChange = (_: React.SyntheticEvent, v: number) => {
    setActiveCategory(v);
    setPage(1);
    setSearchQuery("");
    setActiveSort(null);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, v: number) => {
    setPage(v);
  };

  const formatPrice = (price: number) => price.toLocaleString("uz-UZ") + " $";

  return (
    <Box className="product-page">
      <Box className="product-header">
        <Typography className="product-title" variant="h4">
          Pet<span>Food</span> Products
        </Typography>
        <Typography className="product-subtitle">
          Healthy and delicious — for your pets
        </Typography>
      </Box>

      <Box className="category-search-row">
        <Box className="tabs-wrapper">
          <Tabs
            value={activeCategory}
            onChange={handleCategoryChange}
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

        <Box className="search-box search-box-inline">
          <InputBase
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
            fullWidth
          />
          <Box className="search-btn" role="button" tabIndex={0}>
            <SearchIcon sx={{ fontSize: 16 }} />
            <span>SEARCH</span>
          </Box>
        </Box>
      </Box>

      <Box className="search-sort-wrapper">
        <Box className="sort-buttons">
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              className={`sort-btn ${activeSort === opt.key ? "sort-active" : ""}`}
              onClick={() => handleSortToggle(opt.key)}
              startIcon={opt.icon}
              disableElevation
            >
              {opt.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Box className="results-info">
        <Typography className="results-count">
          {processedProducts.length} products found
        </Typography>
        {activeSort && (
          <Chip
            label={`Sorted: ${activeSort.toUpperCase()}`}
            size="small"
            className="sort-chip"
            onDelete={() => setActiveSort(null)}
          />
        )}
      </Box>

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
          {paginatedProducts.map((product) => (
            <Box key={product.id}>
              <Card
                className={`product-card ${addedToCart === product.id ? "bounce" : ""}`}
                elevation={0}
              >
                {product.tag && (
                  <Chip
                    label={product.tag}
                    size="small"
                    className="product-tag"
                    style={{ background: TAG_COLORS[product.tag] }}
                  />
                )}

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

                <Box className="product-image-wrapper">
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </Box>

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

          {processedProducts.length === 0 && (
            <Box className="no-data-box__text">
              <Typography>Products are not available!!!</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {processedProducts.length > 0 && (
        <Box className="pagination-wrapper">
          <Typography className="pagination-info">
            {(page - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(page * ITEMS_PER_PAGE, processedProducts.length)} of{" "}
            {processedProducts.length}
          </Typography>

          <Pagination
            count={Math.max(totalPages, 1)}
            page={Math.min(page, Math.max(totalPages, 1))}
            onChange={handlePageChange}
            className="pagination"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      )}
    </Box>
  );
};

export default Product;
