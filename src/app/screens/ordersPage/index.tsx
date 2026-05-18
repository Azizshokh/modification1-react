import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DeleteOutlineIcon from "@mui/icons-material/DeleteForever";
import PaymentIcon from "@mui/icons-material/Payment";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoginIcon from "@mui/icons-material/Login";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import type { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { setFinishedOrders, setPausedOrders, setProcessOrders } from "./slice";
import {
  retrieveFinishedOrders,
  retrievePausedOrders,
  retrieveProcessOrders,
} from "./selector";
import "../../../css/orders/orders.css";

const PAGE_LIMIT = 50;
type OrderTabStatus =
  | OrderStatus.PAUSE
  | OrderStatus.PROCESS
  | OrderStatus.FINISH;

function isEmptyOrdersError(err: any): boolean {
  const status = err?.response?.status;
  const message = String(
    err?.response?.data?.message ?? err?.message ?? "",
  ).toLowerCase();

  return status === 404 || message.includes("no data");
}

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

const ordersRetriever = createSelector(
  retrievePausedOrders,
  retrieveProcessOrders,
  retrieveFinishedOrders,
  (pausedOrders, processOrders, finishedOrders) => ({
    pausedOrders,
    processOrders,
    finishedOrders,
  }),
);

const ORDER_TABS = [
  {
    key: OrderStatus.PAUSE,
    label: "Payment Pending",
    icon: <HourglassEmptyIcon sx={{ fontSize: 15 }} />,
  },
  {
    key: OrderStatus.PROCESS,
    label: "In Delivery",
    icon: <LocalShippingIcon sx={{ fontSize: 15 }} />,
  },
  {
    key: OrderStatus.FINISH,
    label: "Completed",
    icon: <DoneAllIcon sx={{ fontSize: 15 }} />,
  },
] as const;

function fmtPrice(price: number): string {
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PAUSE:
      return "Payment Pending";
    case OrderStatus.PROCESS:
      return "In Delivery";
    case OrderStatus.FINISH:
      return "Completed";
    case OrderStatus.DELETE:
      return "Cancelled";
    default:
      return status;
  }
}

function statusIcon(status: OrderStatus): React.ReactNode {
  switch (status) {
    case OrderStatus.PAUSE:
      return <HourglassEmptyIcon sx={{ fontSize: 12 }} />;
    case OrderStatus.PROCESS:
      return <LocalShippingIcon sx={{ fontSize: 12 }} />;
    case OrderStatus.FINISH:
      return <CheckCircleIcon sx={{ fontSize: 12 }} />;
    default:
      return <DeleteOutlineIcon sx={{ fontSize: 12 }} />;
  }
}

function getProductData(order: Order): Product[] {
  return Array.isArray(order.productData) ? order.productData : [];
}

function productById(order: Order): Map<string, Product> {
  return new Map(
    getProductData(order).map((product) => [product._id, product]),
  );
}

function getOrderItems(order: Order): OrderItem[] {
  return Array.isArray(order.orderItems) ? order.orderItems : [];
}

function productForItem(
  item: OrderItem,
  products: Map<string, Product>,
): Product | undefined {
  const productId =
    typeof item.productId === "string"
      ? item.productId
      : (item.productId as any)?._id;
  return productId ? products.get(productId) : undefined;
}

function productImageUrl(product?: Product): string | null {
  const image = product?.productImages?.[0];
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${serverApi}/${image}`.replace(/([^:]\/)\/+/g, "$1");
}

function orderTitle(order: Order): string {
  const products = productById(order);
  const productData = getProductData(order);
  const orderItems = getOrderItems(order);
  const firstItem = orderItems[0];
  const firstProduct = firstItem
    ? (productForItem(firstItem, products) ?? productData[0])
    : productData[0];
  const firstName = firstProduct?.productName ?? "PetFood order";
  const restCount = Math.max(orderItems.length - 1, 0);

  return restCount > 0 ? `${firstName} + ${restCount} more` : firstName;
}

export function OrdersPage(): React.JSX.Element {
  const { authMember, orderBuilder } = useGlobals();
  const dispatch = useDispatch();
  const { setPausedOrders, setProcessOrders, setFinishedOrders } = useMemo(
    () => actionDispatch(dispatch),
    [dispatch],
  );
  const { pausedOrders, processOrders, finishedOrders } =
    useSelector(ordersRetriever);

  const [orderTab, setOrderTab] = useState<OrderTabStatus>(OrderStatus.PAUSE);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const ordersByStatus = useMemo<Record<OrderTabStatus, Order[]>>(
    () => ({
      [OrderStatus.PAUSE]: pausedOrders,
      [OrderStatus.PROCESS]: processOrders,
      [OrderStatus.FINISH]: finishedOrders,
    }),
    [finishedOrders, pausedOrders, processOrders],
  );

  const activeOrders = ordersByStatus[orderTab];
  const totalOrders =
    pausedOrders.length + processOrders.length + finishedOrders.length;

  const commitOrdersToSlice = useCallback(
    (paused: Order[], process: Order[], finished: Order[]) => {
      setPausedOrders(paused);
      setProcessOrders(process);
      setFinishedOrders(finished);

      const activeCounts = {
        [OrderStatus.PAUSE]: paused.length,
        [OrderStatus.PROCESS]: process.length,
        [OrderStatus.FINISH]: finished.length,
      };

      if (activeCounts[orderTab] === 0) {
        if (paused.length > 0) setOrderTab(OrderStatus.PAUSE);
        else if (process.length > 0) setOrderTab(OrderStatus.PROCESS);
        else if (finished.length > 0) setOrderTab(OrderStatus.FINISH);
      }
    },
    [orderTab, setFinishedOrders, setPausedOrders, setProcessOrders],
  );

  const loadOrders = useCallback(async () => {
    if (!authMember) {
      setPausedOrders([]);
      setProcessOrders([]);
      setFinishedOrders([]);
      return;
    }

    setLoading(true);
    try {
      const orderService = new OrderService();
      const getOrdersByStatus = (orderStatus: OrderStatus) =>
        orderService
          .getMyOrders({
            page: 1,
            limit: PAGE_LIMIT,
            orderStatus,
          })
          .catch((err) => {
            if (isEmptyOrdersError(err)) return [] as Order[];
            throw err;
          });

      const [paused, process, finished] = await Promise.all([
        getOrdersByStatus(OrderStatus.PAUSE),
        getOrdersByStatus(OrderStatus.PROCESS),
        getOrdersByStatus(OrderStatus.FINISH),
      ]);

      commitOrdersToSlice(paused, process, finished);
    } catch (err) {
      await sweetErrorHandling(err);
    } finally {
      setLoading(false);
    }
  }, [
    authMember,
    commitOrdersToSlice,
    setFinishedOrders,
    setPausedOrders,
    setProcessOrders,
  ]);

  useEffect(() => {
    loadOrders().then();
  }, [authMember, loadOrders, orderBuilder]);

  const updateOrderStatus = async (
    orderId: string,
    nextStatus: OrderStatus,
  ) => {
    if (nextStatus === OrderStatus.DELETE) {
      const confirmed = window.confirm(
        "Cancel this order? This action cannot be undone.",
      );
      if (!confirmed) return;
    }

    setUpdatingOrderId(orderId);
    try {
      const orderService = new OrderService();
      await orderService.updateOrder({ orderId, orderStatus: nextStatus });
      await loadOrders();
      await sweetTopSmallSuccessAlert(
        nextStatus === OrderStatus.DELETE
          ? "Order cancelled"
          : "Order status updated",
      );
    } catch (err) {
      await sweetErrorHandling(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="op-page">
      <div className="op-hero">
        <div className="op-hero-badge">
          <ShoppingBagIcon sx={{ fontSize: 14 }} />
          My Account
        </div>
        <h1 className="op-hero-title">My Orders</h1>
        <p className="op-hero-sub">
          Track payment, delivery, and completed PetFood purchases from your
          real account history.
        </p>
      </div>

      <Container maxWidth="lg" className="op-content">
        <div className="op-section">
          <div className="op-section-header">
            <div className="op-section-icon-wrap orange">
              <ShoppingBagIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <Typography className="op-section-title">
                Order History
              </Typography>
              <Typography className="op-section-sub">
                {authMember
                  ? `${totalOrders} active orders for ${authMember.memberNick}`
                  : "Login to see your real order history"}
              </Typography>
            </div>
            <button
              className="op-refresh-btn"
              type="button"
              onClick={() => loadOrders()}
              disabled={!authMember || loading}
              aria-label="Refresh orders"
            >
              <RefreshIcon sx={{ fontSize: 16 }} />
              Refresh
            </button>
          </div>

          <div className="op-tabs">
            {ORDER_TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                className={`op-tab-btn${orderTab === key ? " active orange" : ""}`}
                onClick={() => setOrderTab(key)}
                type="button"
              >
                {icon}
                {label}
                <span className="op-tab-count">
                  {ordersByStatus[key].length}
                </span>
              </button>
            ))}
          </div>

          {!authMember ? (
            <div className="op-empty">
              <LoginIcon className="op-empty-icon" />
              <p>Please login first to manage your orders.</p>
            </div>
          ) : loading ? (
            <div className="op-empty">
              <Inventory2Icon className="op-empty-icon op-spin" />
              <p>Loading your orders...</p>
            </div>
          ) : activeOrders.length === 0 ? (
            <div className="op-empty">
              <ShoppingBagIcon className="op-empty-icon" />
              <p>No orders in this status.</p>
            </div>
          ) : (
            <div className="op-cards">
              {activeOrders.map((order) => {
                const products = productById(order);
                const productData = getProductData(order);
                const orderItems = getOrderItems(order);
                const isUpdating = updatingOrderId === order._id;

                return (
                  <div key={order._id} className="op-order-card">
                    <div className="op-order-main">
                      <div className="op-order-icon-wrap">
                        <ShoppingBagIcon sx={{ fontSize: 26 }} />
                      </div>

                      <div className="op-order-body">
                        <div className="op-order-top">
                          <div>
                            <p className="op-order-name">{orderTitle(order)}</p>
                          </div>
                          <span
                            className={`op-status-badge ${order.orderStatus.toLowerCase()}`}
                          >
                            {statusIcon(order.orderStatus)}
                            {statusLabel(order.orderStatus)}
                          </span>
                        </div>

                        <div className="op-order-meta">
                          <span className="op-meta-item qty">
                            {orderItems.reduce(
                              (sum, item) => sum + item.itemQuantity,
                              0,
                            )}{" "}
                            items
                          </span>
                          <span className="op-meta-item">
                            Delivery {fmtPrice(order.orderDelivery)}
                          </span>
                        </div>
                      </div>

                      <div className="op-order-right">
                        <p className="op-order-total">
                          {fmtPrice(order.orderTotal)}
                        </p>
                        <div className="op-order-actions">
                          {order.orderStatus === OrderStatus.PAUSE && (
                            <>
                              <button
                                className="op-action-btn pay"
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    OrderStatus.PROCESS,
                                  )
                                }
                              >
                                <PaymentIcon sx={{ fontSize: 14 }} />
                                Pay Now
                              </button>
                              <button
                                className="op-action-btn cancel"
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    OrderStatus.DELETE,
                                  )
                                }
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                                Cancel
                              </button>
                            </>
                          )}
                          {order.orderStatus === OrderStatus.PROCESS && (
                            <button
                              className="op-action-btn track"
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                updateOrderStatus(order._id, OrderStatus.FINISH)
                              }
                            >
                              <CheckCircleIcon sx={{ fontSize: 14 }} />
                              Received
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="op-order-products-scroll">
                      {orderItems.length === 0 ? (
                        <div className="op-product-line empty">
                          <div className="op-product-thumb">
                            <ShoppingBagIcon sx={{ fontSize: 20 }} />
                          </div>
                          <div className="op-product-info">
                            <p className="op-product-name">
                              Product details unavailable
                            </p>
                            <p className="op-product-meta">
                              This order has no product items.
                            </p>
                          </div>
                        </div>
                      ) : (
                        orderItems.map((item, index) => {
                          const product =
                            productForItem(item, products) ??
                            productData[index];
                          const image = productImageUrl(product);
                          const lineTotal = item.itemPrice * item.itemQuantity;

                          return (
                            <div
                              key={item._id ?? `${order._id}-${index}`}
                              className="op-product-line"
                            >
                              <div className="op-product-thumb">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product?.productName ?? "Product"}
                                  />
                                ) : (
                                  <ShoppingBagIcon sx={{ fontSize: 20 }} />
                                )}
                              </div>
                              <div className="op-product-info">
                                <p className="op-product-name">
                                  {product?.productName ?? "Product"}
                                </p>
                                <p className="op-product-meta">
                                  Qty {item.itemQuantity} x{" "}
                                  {fmtPrice(item.itemPrice)}
                                </p>
                              </div>
                              <p className="op-product-total">
                                {fmtPrice(lineTotal)}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
