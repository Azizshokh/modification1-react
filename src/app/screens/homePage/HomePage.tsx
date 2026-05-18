import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EcoIcon from "@mui/icons-material/Grass";
import SecurityIcon from "@mui/icons-material/Security";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircleIcon from "@mui/icons-material/Circle";
import PetsIcon from "@mui/icons-material/Pets";

import AuthenticationModal from "../../components/auth";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/home/homePage.css";

export function HomePage(): React.JSX.Element {
  const navigate = useNavigate();
  const { authMember } = useGlobals();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);

  const handleSignupOpen = () => setSignupOpen(true);
  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);
  const handleSwitchToLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };
  const handleSwitchToSignup = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };
  const handleOrderNow = () => navigate("/products");

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

          <Stack
            direction="row"
            className={authMember ? "hero-btns hero-btns--auth" : "hero-btns"}
          >
            <Button
              className="btn-order"
              sx={{ background: "#1b6b4a", color: "#fff" }}
              onClick={handleOrderNow}
            >
              Order Now
            </Button>

            {!authMember ? (
              <Button
                className="btn-signup-outline"
                startIcon={<PetsIcon sx={{ fontSize: 18 }} />}
                onClick={handleSignupOpen}
              >
                Sign Up
              </Button>
            ) : null}
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

      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleSignupClose={handleSignupClose}
        handleLoginClose={handleLoginClose}
        onSwitchToLogin={handleSwitchToLogin}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </Box>
  );
}
