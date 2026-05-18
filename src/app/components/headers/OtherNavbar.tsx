import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { NavLink } from "react-router-dom";

import AuthenticationModal, { useLogout } from "../auth";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import Basket from "./Basket";
import type { CartItem } from "../../../lib/types/search";
import "../../../css/otherNavbar.css";

interface OtherNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export function OtherNavbar({
  cartItems,
  onAdd,
  onRemove,
  onDelete,
  onDeleteAll,
}: OtherNavbarProps): React.JSX.Element {
  const { authMember } = useGlobals();
  const logout = useLogout();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const userMenuOpen = Boolean(userMenuAnchor);

  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const handleSwitchToLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };
  const handleSwitchToSignup = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleLogout = () => {
    setUserMenuAnchor(null);
    logout();
  };

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
              onAdd={onAdd}
              onRemove={onRemove}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
            />

            {!authMember ? (
              <Button
                className="login-btn"
                startIcon={<PersonIcon sx={{ fontSize: 18 }} />}
                sx={{ textTransform: "none" }}
                onClick={handleLoginOpen}
              >
                Login
              </Button>
            ) : (
              <>
                <IconButton
                  className="user-btn"
                  aria-label="User profile"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen ? "true" : undefined}
                  onClick={handleUserMenuOpen}
                >
                  <Avatar
                    className="user-avatar"
                    alt={authMember.memberNick}
                    src={
                      authMember.memberImage
                        ? `${serverApi}/${authMember.memberImage}`
                        : undefined
                    }
                    sx={{ width: 36, height: 36, bgcolor: "transparent" }}
                  >
                    <PersonIcon sx={{ color: "white", fontSize: 20 }} />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={userMenuOpen}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  slotProps={{ paper: { className: "user-menu-paper" } }}
                >
                  <MenuItem className="user-menu-logout" onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: "#e05c2a" }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Container>

        <AuthenticationModal
          signupOpen={signupOpen}
          loginOpen={loginOpen}
          handleSignupClose={handleSignupClose}
          handleLoginClose={handleLoginClose}
          onSwitchToLogin={handleSwitchToLogin}
          onSwitchToSignup={handleSwitchToSignup}
        />
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
