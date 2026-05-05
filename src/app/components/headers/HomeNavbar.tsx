import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import "../../../css/homeNavbar.css";

export function HomeNavbar(): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <nav className="home-navbar">
      <div className="navbar-content">
        {/* --- Logo --- */}
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">
            <img
              src="/icons/PetFoodLogo.svg"
              alt="PetFood Logo"
              className="brand-logo"
            />
          </div>
        </NavLink>

        {/* --- Links --- */}
        <ul className={`navbar-links${menuOpen ? " open" : ""}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Product
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Help
            </NavLink>
          </li>
        </ul>

        {/* --- Actions --- */}
        <div className="navbar-actions">
          <button className="cart-btn" aria-label="Cart">
            <ShoppingCartIcon sx={{ color: "white", fontSize: 20 }} />
          </button>

          <button className="login-btn">
            <PersonIcon sx={{ fontSize: 18 }} />
            Login
          </button>
        </div>

        {/* --- Hamburger --- */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
