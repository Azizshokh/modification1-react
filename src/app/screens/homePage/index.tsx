import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import EcoIcon from "@mui/icons-material/Grass";
import SecurityIcon from "@mui/icons-material/Security";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircleIcon from "@mui/icons-material/Circle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RateReviewIcon from "@mui/icons-material/RateReview";

import "../../../css/homePage.css";

export function HomePage(): React.JSX.Element {
  return (
    <Box className="homepage">
      {/* HERO */}
      <Box className="hero-section">
        {/* LEFT */}
        <Box className="hero-left">
          <Typography variant="h1" className="hero-title">
            The Power of <br />
            Healthy <span className="hero-red">Pet Food</span>
          </Typography>

          <Typography className="hero-desc">
            Balanced nutrition for a happy, healthy life. <br />
            High-quality ingredients to keep your pets <br />
            strong, energetic, and full of joy.
          </Typography>

          <Stack direction="row" className="hero-btns">
            <Button
              variant="contained"
              sx={{ background: "#1b6b4a", color: "#fff" }}
            >
              Order Now
            </Button>

            <Button variant="outlined" sx={{ border: "2px solid #ccc" }}>
              Sign Up
            </Button>
          </Stack>

          {/* BADGES */}
          <Stack direction="row" className="trust-badges">
            <Box className="badge">
              <span className="badge-icon bg-green">
                <EcoIcon sx={{ color: "white", fontSize: 16 }} />
              </span>
              <Box>
                <strong>100% Natural</strong>
                <span>No artificial additives</span>
              </Box>
            </Box>

            <Box className="badge">
              <span className="badge-icon bg-red">
                <SecurityIcon sx={{ color: "white", fontSize: 16 }} />
              </span>
              <Box>
                <strong>Healthy & Safe</strong>
                <span>Vet approved formula</span>
              </Box>
            </Box>

            <Box className="badge">
              <span className="badge-icon bg-yellow">
                <FavoriteIcon sx={{ color: "white", fontSize: 16 }} />
              </span>
              <Box>
                <strong>Happy Pets</strong>
                <span>For a better life</span>
              </Box>
            </Box>
          </Stack>

          {/* PROMO */}
          <Box className="promo-ticket">
            <Box className="promo-ticket-left">
              <Typography>Savor the Savings</Typography>
              <Typography>on Your Pet's</Typography>
              <Typography>
                <strong>Favorite Food!</strong>
              </Typography>
            </Box>

            <Box className="promo-ticket-divider">
              <span className="notch top" />
              <span className="notch bottom" />
            </Box>

            <Box className="promo-ticket-right">
              <span className="promo-pct">15%</span>
              <span className="promo-off">OFF</span>
            </Box>

            <Box className="promo-bowl">
              <img src="/icons/PetFoodLogo.svg" alt="PetFood bowl" />
            </Box>
          </Box>
        </Box>

        {/* RIGHT */}
        <Box className="hero-right">
          <Box className="float-tag tag-protein">
            <CircleIcon sx={{ color: "white", fontSize: 14 }} />
            High Protein
          </Box>

          <Box className="float-tag tag-natural">
            <EcoIcon sx={{ color: "white", fontSize: 14 }} />
            Natural Ingredients
          </Box>

          <Box className="float-tag tag-vet">
            <SecurityIcon sx={{ color: "white", fontSize: 14 }} />
            Vet Approved
          </Box>

          <Box className="hero-img-bg">
            <img
              src="/img/PetFoodBackground.png"
              alt="Pet Food"
              className="hero-main-img"
            />
          </Box>
        </Box>
      </Box>

      {/* FEATURES (sizda bu yerda svg yo‘q edi — o‘zgartirmadim) */}
      <Box className="feature-row">
        <Stack className="feature-item">
          <span className="feature-emoji" style={{ background: "#17a48a" }}>
            <img
              src="/icons/delivery.png"
              alt="Delivery"
              width={22}
              height={22}
            />
          </span>
          <Box>
            <strong>Fast Delivery</strong>
            <span>Quick and safe delivery at your door</span>
          </Box>
        </Stack>

        <Stack className="feature-item">
          <span className="feature-emoji" style={{ background: "#e05c2a" }}>
            <img
              src="/icons/nearestplace.png"
              alt="Nearest place"
              width={22}
              height={22}
            />
          </span>
          <Box>
            <strong>Nearest Place</strong>
            <span>Find pet food near you easily</span>
          </Box>
        </Stack>

        <Stack className="feature-item">
          <span className="feature-emoji" style={{ background: "#e07c2a" }}>
            <CalendarMonthIcon sx={{ color: "white", fontSize: 22 }} />
          </span>
          <Box>
            <strong>Book Your Order</strong>
            <span>Schedule your order in advance</span>
          </Box>
        </Stack>

        <Stack className="feature-item">
          <span className="feature-emoji" style={{ background: "#e0a82a" }}>
            <RateReviewIcon sx={{ color: "white", fontSize: 22 }} />
          </span>
          <Box>
            <strong>Customer Review</strong>
            <span>See what pet parents are saying</span>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
