import React from "react";
import { Box, Button, Container, IconButton, Stack } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { NavLink } from "react-router-dom";

import "../../../css/homeNavbar.css";

export function HomeNavbar(): React.JSX.Element {
  const getNavLinkClassName = ({ isActive }: { isActive: boolean }): string =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <Box component="nav" className="home-navbar">
      <Container className="navbar-content">
        {/* BRAND */}
        <NavLink to="/" className="navbar-brand">
          <Box className="brand-icon">
            <img
              src="/icons/PetFoodLogo.svg"
              alt="PetFood Logo"
              className="brand-logo"
            />
          </Box>
        </NavLink>

        {/* LINKS */}
        <Stack component="ul" direction="row" className="navbar-links">
          <Box component="li">
            <NavLink to="/" className={getNavLinkClassName}>
              Home
            </NavLink>
          </Box>

          <Box component="li">
            <NavLink to="/products" className={getNavLinkClassName}>
              Product
            </NavLink>
          </Box>

          <Box component="li">
            <NavLink to="/help" className={getNavLinkClassName}>
              Help
            </NavLink>
          </Box>
        </Stack>

        {/* ACTIONS */}
        <Stack className="navbar-actions" direction="row">
          <IconButton className="cart-btn" aria-label="Cart">
            <ShoppingCartIcon sx={{ color: "white", fontSize: 20 }} />
          </IconButton>

          <Button
            className="login-btn"
            startIcon={<PersonIcon sx={{ fontSize: 18 }} />}
            sx={{ textTransform: "none" }}
          >
            Login
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
