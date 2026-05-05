import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";

import CallIcon from "@mui/icons-material/Call";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import "../../../css/footer.css";

export function Footer(): React.JSX.Element {
  return (
    <Box component="footer" className="site-footer">
      <Box className="footer-content">
        {/* --- Brand --- */}
        <Stack className="footer-brand" sx={{ gap: 1.5 }}>
          <img
            src="/icons/PetFoodLogo.svg"
            alt="PetFood"
            className="footer-logo"
          />
          <Typography className="footer-brand-name">PetFood</Typography>
          <Typography variant="body2" className="footer-brand-desc">
            Premium nutrition for your beloved pets. Made with love.
          </Typography>
        </Stack>

        {/* --- Navigation --- */}
        <Stack className="footer-col" sx={{ gap: 1.5 }}>
          <Typography variant="h6" className="footer-col-title">
            Navigation
          </Typography>

          <NavLink to="/" className="footer-link">
            Home
          </NavLink>
          <NavLink to="/products" className="footer-link">
            Products
          </NavLink>
          <NavLink to="/orders" className="footer-link">
            Orders
          </NavLink>
          <NavLink to="/member-page" className="footer-link">
            My Page
          </NavLink>
        </Stack>

        {/* --- Support --- */}
        <Stack className="footer-col" sx={{ gap: 1.5 }}>
          <Typography variant="h6" className="footer-col-title">
            Support
          </Typography>

          <a href="#" className="footer-link">
            FAQ
          </a>

          <a href="#" className="footer-icon-link">
            <CallIcon sx={{ fontSize: 18 }} />
            Contact Us
          </a>

          <a href="#" className="footer-link">
            Shipping Info
          </a>
          <a href="#" className="footer-link">
            Returns
          </a>
        </Stack>

        {/* --- Social --- */}
        <Stack className="footer-col" sx={{ gap: 1.5 }}>
          <Typography variant="h6" className="footer-col-title">
            Follow Us
          </Typography>

          <a href="#" className="footer-icon-link">
            <InstagramIcon sx={{ fontSize: 20 }} />
            Instagram
          </a>

          <a href="#" className="footer-icon-link">
            <FacebookIcon sx={{ fontSize: 20 }} />
            Facebook
          </a>

          <a href="#" className="footer-icon-link">
            <TwitterIcon sx={{ fontSize: 20 }} />
            Twitter
          </a>

          <a href="#" className="footer-icon-link">
            <YouTubeIcon sx={{ fontSize: 20 }} />
            YouTube
          </a>

          <a href="#" className="footer-icon-link">
            <WhatsAppIcon sx={{ fontSize: 20 }} />
            WhatsApp
          </a>
        </Stack>
      </Box>

      {/* --- Bottom --- */}
      <Box className="footer-bottom">
        <Typography variant="body2">
          © {new Date().getFullYear()} PetFood. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
