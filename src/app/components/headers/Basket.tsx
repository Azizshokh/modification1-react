import React, { useState } from "react";
import { Badge, Button, IconButton, Menu, Stack, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import "../../../css/basket.css";

// ─── Types ───────────────────────────────────────────────────────
interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

// ─── Initial cart data ───────────────────────────────────────────
const INITIAL_ITEMS: CartItem[] = [
  { id: 1, name: "Royal Canin Medium", price: 24.99, qty: 2, emoji: "🐾" },
  { id: 2, name: "Pedigree Snacks", price: 8.5, qty: 1, emoji: "🦴" },
  { id: 3, name: "Whiskas Cat Food", price: 12.0, qty: 1, emoji: "🐱" },
];

// ─── Sub-components ──────────────────────────────────────────────

function QtyControl({
  qty,
  onIncrease,
  onDecrease,
}: {
  qty: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="basket-qty-control">
      <button
        className="basket-qty-btn"
        onClick={onDecrease}
        aria-label="decrease quantity"
      >
        <RemoveIcon />
      </button>
      <span className="basket-qty-value">{qty}</span>
      <button
        className="basket-qty-btn"
        onClick={onIncrease}
        aria-label="increase quantity"
      >
        <AddIcon />
      </button>
    </div>
  );
}

function BasketItem({
  item,
  onRemove,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onRemove: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
}) {
  return (
    <div className="basket-item">
      <div className="basket-item-thumb">{item.emoji}</div>

      <div className="basket-item-info">
        <Typography className="basket-item-name">{item.name}</Typography>
        <Typography className="basket-item-price">
          ${item.price.toFixed(2)} x {item.qty}
        </Typography>
      </div>

      <QtyControl
        qty={item.qty}
        onIncrease={() => onIncrease(item.id)}
        onDecrease={() => onDecrease(item.id)}
      />

      <IconButton
        size="small"
        className="basket-item-remove"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
      >
        <CancelIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="basket-empty">
      <div className="basket-empty-icon">
        <ShoppingCartIcon />
      </div>
      <Typography className="basket-empty-title">
        Your basket is empty
      </Typography>
      <Typography className="basket-empty-desc">
        Add some tasty food for your pet!
      </Typography>
    </div>
  );
}

// ─── Main Basket component ───────────────────────────────────────
export default function Basket() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_ITEMS);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleRemove = (id: number) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const handleClearAll = () => setCartItems([]);

  const handleIncrease = (id: number) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );

  const handleDecrease = (id: number) =>
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0),
    );

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    <div>
      <IconButton
        className="basket-cart-btn"
        aria-label="shopping cart"
        id="basket-button"
        aria-controls={open ? "basket-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
      >
        <Badge badgeContent={totalItems}>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="basket-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            className: "basket-menu-paper",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack>
          <div className="basket-header">
            <div className="basket-header-title">
              <ShoppingCartIcon />
              <Typography className="basket-header-title-text">
                My Basket
              </Typography>
            </div>
            <div className="basket-header-right">
              <span className="basket-count-badge">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
              {cartItems.length > 0 && (
                <button
                  className="basket-clear-btn"
                  onClick={handleClearAll}
                  aria-label="Clear all items"
                >
                  <DeleteOutlineIcon />
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="basket-items-list">
            {cartItems.length === 0 ? (
              <EmptyState />
            ) : (
              cartItems.map((item) => (
                <BasketItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="basket-summary">
              <div className="basket-summary-row">
                <Typography className="basket-summary-label">
                  Subtotal
                </Typography>
                <Typography className="basket-summary-value">
                  ${subtotal.toFixed(2)}
                </Typography>
              </div>
              <div className="basket-summary-row">
                <Typography className="basket-summary-label">
                  Delivery
                </Typography>
                <Typography className="basket-summary-free">Free</Typography>
              </div>
              <div className="basket-total-row">
                <Typography className="basket-total-label">Total</Typography>
                <Typography className="basket-total-value">
                  ${subtotal.toFixed(2)}
                </Typography>
              </div>
              <Button
                fullWidth
                className="basket-order-btn"
                startIcon={<ShoppingCartIcon />}
                onClick={handleClose}
              >
                Place Order
              </Button>
            </div>
          )}
        </Stack>
      </Menu>
    </div>
  );
}
