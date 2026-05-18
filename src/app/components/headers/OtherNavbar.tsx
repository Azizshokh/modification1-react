import React from "react";
import { Box, Button, Container, IconButton, Stack } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { NavLink } from "react-router-dom";

import Basket from "./Basket";
import type { CartItem } from "../../../lib/types/search";
import "../../../css/otherNavbar.css";

interface OtherNavbarProps {
  cartItems: CartItem[];
  onRemove: (_id: string) => void;
  onIncrease: (_id: string) => void;
  onDecrease: (_id: string) => void;
  onClearAll: () => void;
}

export function OtherNavbar({
  cartItems,
  onRemove,
  onIncrease,
  onDecrease,
  onClearAll,
}: OtherNavbarProps): React.JSX.Element {
  // Test uchun: true qilsangiz Login o'rniga user icon chiqadi.
  const authMember: boolean | null = true;

  const getNavLinkClassName = ({ isActive }: { isActive: boolean }): string =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <Box className="other-navbar-wrapper">
      <Box component="nav" className="other-navbar">
        <Container className="navbar-content">
          <NavLink to="/" className="navbar-brand">
            <Box className="brand-icon">
              <img
                src="/icons/PetFoodLogo.svg"
                alt="PetFood Logo"
                className="brand-logo"
              />
            </Box>
          </NavLink>

          <Stack component="ul" direction="row" className="navbar-links">
            <Box component="li">
              <NavLink to="/" className={getNavLinkClassName}>
                Home
              </NavLink>
            </Box>

            <Box component="li">
              <NavLink to="/products" className={getNavLinkClassName}>
                Products
              </NavLink>
            </Box>

            {authMember ? (
              <Box component="li">
                <NavLink to="/orders" className={getNavLinkClassName}>
                  Orders
                </NavLink>
              </Box>
            ) : null}

            {authMember ? (
              <Box component="li">
                <NavLink to="/member-page" className={getNavLinkClassName}>
                  My Page
                </NavLink>
              </Box>
            ) : null}

            <Box component="li">
              <NavLink to="/veterinary" className={getNavLinkClassName}>
                Veterinary
              </NavLink>
            </Box>

            <Box component="li">
              <NavLink to="/help" className={getNavLinkClassName}>
                Help
              </NavLink>
            </Box>
          </Stack>

          <Stack className="navbar-actions" direction="row">
            <Basket
              cartItems={cartItems}
              onRemove={onRemove}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onClearAll={onClearAll}
            />

            {!authMember ? (
              <Button
                className="login-btn"
                startIcon={<PersonIcon sx={{ fontSize: 18 }} />}
                sx={{ textTransform: "none" }}
              >
                Login
              </Button>
            ) : (
              <IconButton className="user-btn" aria-label="User profile">
                <PersonIcon sx={{ color: "white", fontSize: 20 }} />
              </IconButton>
            )}
          </Stack>
        </Container>
      </Box>
      <Box
        className="other-navbar-hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/img/OtherNavBack.png)`,
        }}
      />
    </Box>
  );
}
