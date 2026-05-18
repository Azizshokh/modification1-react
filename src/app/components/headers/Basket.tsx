import React, { useState } from "react";
import {
  Badge,
  Button,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import type { CartItem } from "../../../lib/types/search";
import { serverApi } from "../../../lib/config";
import "../../../css/home/basket.css";

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
  onAdd,
  onRemove,
  onDelete,
}: {
  item: CartItem;
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
}) {
  return (
    <div className="basket-item">
      <div className="basket-item-thumb">
        <img
          src={`${serverApi}/${item.image}`}
          alt={item.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
      </div>

      <div className="basket-item-info">
        <Typography className="basket-item-name">{item.name}</Typography>
        <Typography className="basket-item-price">
          ${item.price.toFixed(2)} x {item.quantity}
        </Typography>
      </div>

      <QtyControl
        qty={item.quantity}
        onIncrease={() => onAdd(item)}
        onDecrease={() => onRemove(item)}
      />

      <IconButton
        size="small"
        className="basket-item-remove"
        onClick={() => onDelete(item)}
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

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

// ─── Main Basket component ───────────────────────────────────────
export default function Basket({
  cartItems,
  onAdd,
  onRemove,
  onDelete,
  onDeleteAll,
}: BasketProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const FREE_DELIVERY = 100;
  const DELIVERY_FEE = 5;
  const isFreeDelivery = subtotal >= FREE_DELIVERY;
  const deliveryCost = isFreeDelivery ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryCost;

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
                  onClick={onDeleteAll}
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
                  key={item._id}
                  item={item}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onDelete={onDelete}
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
                {isFreeDelivery ? (
                  <Typography className="basket-summary-free">Free</Typography>
                ) : (
                  <Typography className="basket-summary-delivery-cost">
                    +${DELIVERY_FEE.toFixed(2)}
                  </Typography>
                )}
              </div>
              {!isFreeDelivery && (
                <div className="basket-delivery-hint">
                  <span className="basket-delivery-hint-icon"></span>
                  <span>
                    Add{" "}
                    <strong>${(FREE_DELIVERY - subtotal).toFixed(2)}</strong>{" "}
                    more for free delivery
                  </span>
                </div>
              )}
              {isFreeDelivery && (
                <div className="basket-delivery-hint basket-delivery-hint--free">
                  <span className="basket-delivery-hint-icon"></span>
                  <span>
                    You've unlocked <strong>free delivery!</strong>
                  </span>
                </div>
              )}
              <div className="basket-total-row">
                <Typography className="basket-total-label">Total</Typography>
                <Typography className="basket-total-value">
                  ${total.toFixed(2)}
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
