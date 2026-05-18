import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
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
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import type { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useNavigate } from "react-router-dom";

import "./../../../css/product/product.css";
import "./../../../css/product/nearestPlace.css";
import { CartItem } from "../../../lib/types/search";

/** Redux **/
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ContactCard({ icon, label, value }: ContactCardProps) {
  return (
    <Box className={"contact-card"}>
      <Box className={"contact-icon-wrap"}>{icon}</Box>
      <Box className={"contact-info"}>
        <span className={"contact-label"}>{label}</span>
        <span className={"contact-value"}>{value}</span>
      </Box>
    </Box>
  );
}

const CATEGORIES = [
  { label: "All", value: null },
  { label: "Dogs", value: ProductCollection.DOG },
  { label: "Cats", value: ProductCollection.CAT },
  { label: "Birds", value: ProductCollection.BIRD },
  { label: "Fish", value: ProductCollection.FISH },
  { label: "Gadgets", value: ProductCollection.GADGETS },
];

const SORT_OPTIONS = [
  {
    key: "createdAt",
    label: "NEW",
    icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} />,
  },
  {
    key: "productPrice",
    label: "PRICE",
    icon: <AttachMoneyIcon sx={{ fontSize: 14 }} />,
  },
  {
    key: "productViews",
    label: "VIEWS",
    icon: <TrendingUpIcon sx={{ fontSize: 14 }} />,
  },
];

const PAGE_LENGTHS = 8;

interface ProductPageProps {
  onAdd: (input: CartItem) => void;
}

const ProductsPage: React.FC<ProductPageProps> = ({
  onAdd,
}: ProductPageProps) => {
  const navigate = useNavigate();
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: PAGE_LENGTHS + 1,
    order: "createdAt",
    productCollection: ProductCollection.DOG,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  useEffect(() => {
    const product = new ProductService();
    setProducts([]);
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => sweetErrorHandling(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch });
    }
  }, [searchText]);

  /** HANDLERS **/

  const searchCollectionHandler = (collection: ProductCollection | null) => {
    productSearch.page = 1;
    productSearch.search = "";
    if (collection) {
      productSearch.productCollection = collection;
    } else {
      delete productSearch.productCollection;
    }
    setProductSearch({ ...productSearch });
    setSearchText("");
  };

  const searchOrderHandler = (order: string) => {
    productSearch.page = 1;
    productSearch.order = order;
    setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    productSearch.page = 1;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (_: ChangeEvent<unknown>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseProductHandler = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (id: string) => {
    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 1200);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const formatPrice = (price: number) => price.toLocaleString("uz-UZ") + " $";

  // Derive active tab index from productSearch — always in sync, no separate state needed
  const activeCategory = CATEGORIES.findIndex(
    (c) => c.value === (productSearch.productCollection ?? null),
  );

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
            onChange={(_, v) => searchCollectionHandler(CATEGORIES[v].value)}
            variant="scrollable"
            scrollButtons="auto"
            className="category-tabs"
            sx={{ "& .MuiTabs-indicator": { display: "none" } }}
          >
            {CATEGORIES.map((cat, i) => (
              <Tab
                key={cat.label}
                label={cat.label}
                className={`category-tab ${activeCategory === i ? "active-tab" : ""}`}
              />
            ))}
          </Tabs>
        </Box>

        <Box className="search-box search-box-inline">
          <InputBase
            className="search-input"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchProductHandler()}
            fullWidth
          />
          <Box
            className="search-btn"
            role="button"
            tabIndex={0}
            onClick={searchProductHandler}
          >
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
              className={`sort-btn ${productSearch.order === opt.key ? "sort-active" : ""}`}
              onClick={() => searchOrderHandler(opt.key)}
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
          {Math.min(products.length, PAGE_LENGTHS)} products found
        </Typography>
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
          {products.length !== 0 ? (
            products.slice(0, PAGE_LENGTHS).map((product) => {
              const imagePath = `${serverApi}/${product.productImages[0]}`;
              const volumeLabel =
                product.productCollection === ProductCollection.GADGETS
                  ? product.productSize
                  : product.productWeight >= 1000
                    ? `${product.productWeight / 1000} KG`
                    : `${product.productWeight} GR`;
              return (
                <Box key={product._id}>
                  <Card
                    className={`product-card ${addedToCart === product._id ? "bounce" : ""}`}
                    elevation={0}
                    onClick={() => chooseProductHandler(product._id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Add to favorites" placement="top">
                      <IconButton
                        className="fav-btn"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product._id);
                        }}
                      >
                        {favorites.includes(product._id) ? (
                          <FavoriteIcon
                            fontSize="small"
                            className="fav-active"
                          />
                        ) : (
                          <FavoriteBorderIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Box className="product-image-wrapper">
                      <CardMedia
                        component="img"
                        image={imagePath}
                        alt={product.productName}
                        className="product-image"
                      />
                    </Box>

                    <CardContent className="product-content">
                      <Typography className="product-name" variant="h6">
                        {product.productName}
                      </Typography>

                      <Box className="product-meta">
                        <Typography className="product-weight">
                          ⚖️ {volumeLabel}
                        </Typography>
                        <Box className="rating-row">
                          <RemoveRedEyeIcon
                            sx={{ fontSize: 14, color: "#e67e22" }}
                          />
                          <Typography className="review-count">
                            {product.productViews}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography className="product-price">
                        {formatPrice(product.productPrice)}
                      </Typography>
                    </CardContent>

                    <CardActions className="product-actions">
                      <Button
                        variant="contained"
                        className={`order-btn ${addedToCart === product._id ? "added" : ""}`}
                        fullWidth
                        onClick={(e) => {
                          onAdd({
                            _id: product._id,
                            quantity: 1,
                            name: product.productName,
                            price: product.productPrice,
                            image: product.productImages[0],
                          });
                          e.stopPropagation();
                          handleAddToCart(product._id);
                        }}
                        disableElevation
                      >
                        {addedToCart === product._id ? "✓ Added!" : "Order Now"}
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              );
            })
          ) : (
            <Box className="no-data-box__text">
              <Typography>Products are not available!!!</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box className="pagination-wrapper">
        <Pagination
          count={
            products.length > PAGE_LENGTHS
              ? productSearch.page + 1
              : productSearch.page
          }
          page={productSearch.page}
          onChange={paginationHandler}
          className="pagination"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
        />
      </Box>

      <div className={"nearest-place"}>
        <Container>
          <Stack
            className={"nearest-place-wrap"}
            direction={"column"}
            sx={{ alignItems: "center" }}
          >
            <Box className={"nearest-title-wrap"}>
              <h2 className={"nearest-title"}>Nearest Place</h2>
              <p className={"nearest-subtitle"}>Find our nearest location</p>
            </Box>

            <Stack
              className={"nearest-content"}
              direction={"row"}
              sx={{ alignItems: "stretch" }}
            >
              <Box className={"nearest-map-wrap"}>
                <iframe
                  className={"nearest-map"}
                  src={
                    "https://www.google.com/maps?q=Seoul,+South+Korea&output=embed"
                  }
                  allowFullScreen
                  loading={"lazy"}
                  referrerPolicy={"no-referrer-when-downgrade"}
                />
              </Box>

              <Box className={"nearest-divider"} />

              <Stack
                className={"nearest-contacts"}
                direction={"column"}
                sx={{ justifyContent: "center" }}
              >
                <ContactCard
                  icon={<LocalPhoneIcon className={"contact-svg"} />}
                  label={"Phone:"}
                  value={"+880 123 4567 786"}
                />
                <ContactCard
                  icon={<EmailIcon className={"contact-svg"} />}
                  label={"Email:"}
                  value={"abc@gmail.com"}
                />
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </div>
    </Box>
  );
};

export default ProductsPage;
