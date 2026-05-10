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
import "./../../../css/index.css";

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
    name: "Beef Stew Premium",
    price: 62000,
    rating: 4.6,
    reviews: 67,
    category: "Dogs",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1.2 kg",
  },
  {
    id: 4,
    name: "Turkey Protein Mix",
    price: 52000,
    rating: 4.7,
    reviews: 167,
    category: "Dogs",
    tag: "Sale",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1.8 kg",
  },
  {
    id: 5,
    name: "Lamb & Oat Formula",
    price: 58000,
    rating: 4.9,
    reviews: 155,
    category: "Dogs",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "2.1 kg",
  },
  {
    id: 6,
    name: "Puppy Starter Kibble",
    price: 41000,
    rating: 4.4,
    reviews: 98,
    category: "Dogs",
    tag: "New",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1 kg",
  },
  {
    id: 7,
    name: "Grain-Free Adult Dog",
    price: 72000,
    rating: 5,
    reviews: 312,
    category: "Dogs",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "3 kg",
  },
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
    id: 9,
    name: "Kitten Starter Pack",
    price: 29000,
    rating: 4.7,
    reviews: 155,
    category: "Cats",
    tag: "Sale",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "500 g",
  },
  {
    id: 10,
    name: "Ocean Tuna Mousse",
    price: 36000,
    rating: 4.8,
    reviews: 102,
    category: "Cats",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "700 g",
  },
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
  {
    id: 18,
    name: "Canary Power Seeds",
    price: 18000,
    rating: 4.2,
    reviews: 29,
    category: "Dogs",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "700 g",
  },
  {
    id: 19,
    name: "Budgie Daily Mix",
    price: 19000,
    rating: 4.3,
    reviews: 35,
    category: "Birds",
    tag: "New",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "800 g",
  },
  {
    id: 20,
    name: "Sunflower Premium",
    price: 21000,
    rating: 4.5,
    reviews: 52,
    category: "Birds",
    tag: "Sale",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "900 g",
  },
  {
    id: 21,
    name: "Cockatiel Smart Feed",
    price: 24000,
    rating: 4.6,
    reviews: 61,
    category: "Birds",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1.2 kg",
  },
  {
    id: 22,
    name: "Lovebird Berry Mix",
    price: 23000,
    rating: 4.1,
    reviews: 26,
    category: "Birds",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "850 g",
  },
  {
    id: 23,
    name: "Finch Fine Grains",
    price: 17000,
    rating: 4,
    reviews: 22,
    category: "Birds",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "650 g",
  },
  {
    id: 24,
    name: "Bird Immune Booster",
    price: 26000,
    rating: 4.4,
    reviews: 39,
    category: "Birds",
    tag: "New",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "750 g",
  },

  // Fish (8)
  {
    id: 25,
    name: "Tropical Flakes",
    price: 15000,
    rating: 4.5,
    reviews: 58,
    category: "Fish",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "120 g",
  },
  {
    id: 26,
    name: "Goldfish Pellets",
    price: 14000,
    rating: 4.2,
    reviews: 41,
    category: "Fish",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "110 g",
  },
  {
    id: 27,
    name: "Color Boost Granules",
    price: 18000,
    rating: 4.6,
    reviews: 47,
    category: "Fish",
    tag: "Sale",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "130 g",
  },
  {
    id: 28,
    name: "Betta Micro Bites",
    price: 16000,
    rating: 4.3,
    reviews: 33,
    category: "Fish",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "90 g",
  },
  {
    id: 29,
    name: "Shrimp Protein Feed",
    price: 20000,
    rating: 4.7,
    reviews: 44,
    category: "Fish",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "140 g",
  },
  {
    id: 30,
    name: "Bottom Feeder Tablets",
    price: 17000,
    rating: 4.1,
    reviews: 28,
    category: "Fish",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "115 g",
  },
  {
    id: 31,
    name: "Algae Control Formula",
    price: 19000,
    rating: 4.4,
    reviews: 31,
    category: "Fish",
    tag: "New",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "125 g",
  },
  {
    id: 32,
    name: "Marine Reef Nutrition",
    price: 22000,
    rating: 4.8,
    reviews: 36,
    category: "Fish",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "150 g",
  },

  // Gadgets (8)
  {
    id: 33,
    name: "Smart Auto Feeder",
    price: 189000,
    rating: 4.6,
    reviews: 74,
    category: "Gadgets",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1.9 kg",
  },
  {
    id: 34,
    name: "Water Fountain Mini",
    price: 149000,
    rating: 4.4,
    reviews: 52,
    category: "Gadgets",
    tag: "Sale",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "1.3 kg",
  },
  {
    id: 35,
    name: "Pet Camera Lite",
    price: 229000,
    rating: 4.7,
    reviews: 68,
    category: "Gadgets",
    tag: "New",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "900 g",
  },
  {
    id: 36,
    name: "LED Night Collar",
    price: 49000,
    rating: 4.2,
    reviews: 40,
    category: "Gadgets",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "220 g",
  },
  {
    id: 37,
    name: "Activity Tracker Tag",
    price: 89000,
    rating: 4.3,
    reviews: 37,
    category: "Gadgets",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "180 g",
  },
  {
    id: 38,
    name: "Portable Treat Dispenser",
    price: 69000,
    rating: 4.1,
    reviews: 29,
    category: "Gadgets",
    tag: "Sale",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "350 g",
  },
  {
    id: 39,
    name: "Pet Hair Vacuum Brush",
    price: 99000,
    rating: 4.5,
    reviews: 33,
    category: "Gadgets",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "600 g",
  },
  {
    id: 40,
    name: "Smart Bowl Scale",
    price: 79000,
    rating: 4.2,
    reviews: 25,
    category: "Gadgets",
    tag: "Popular",
    image: "/img/products/Cat_LP_DryFood_8.jpg",
    weight: "500 g",
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
          Pet<span>Food</span> Menu
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
