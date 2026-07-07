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
  retrieveProcessOrders,
  retrievePausedOrders,
} from "./selector";
import {
  deleteVetAppointment,
  readVetAppointments,
  syncVetAppointmentsFromAdmin,
  VetAppointment,
} from "../../services/vetSlotStore";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PetsIcon from "@mui/icons-material/Pets";
import "../../../css/orders/orders.css";

const PAGE_LIMIT = 50;
const SERVICE_PRICES: Record<string, number> = {
  HOME_TO_HOME: 40,
  CLINIC_TO_CLINIC: 25,
  ONLINE_CONSULTATION: 15,
  GROOMING: 30,
};
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

function vetStatusLabel(status: VetAppointment["status"]): string {
  switch (status) {
    case "ACTIVE":
    case "PAUSE":
      return "Awaiting Admin";
    case "ACCEPTED":
      return "Accepted";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
    case "DELETE":
      return "Cancelled";
    default:
      return "Awaiting Admin";
  }
}

function vetStatusIcon(status: VetAppointment["status"]): React.ReactNode {
  switch (status) {
    case "ACCEPTED":
      return <CheckCircleIcon sx={{ fontSize: 12 }} />;
    case "COMPLETED":
      return <DoneAllIcon sx={{ fontSize: 12 }} />;
    case "CANCELLED":
    case "DELETE":
      return <DeleteOutlineIcon sx={{ fontSize: 12 }} />;
    default:
      return <HourglassEmptyIcon sx={{ fontSize: 12 }} />;
  }
}

function vetDisplayPrice(appointment: VetAppointment): number {
  if (appointment.status === "COMPLETED") return 0;

  return (
    appointment.originalServicePrice ||
    appointment.servicePrice ||
    SERVICE_PRICES[appointment.serviceType] ||
    0
  );
}

function formatVetDateTime(appointment: VetAppointment): string {
  const date = String(appointment.serviceDate ?? "").trim();
  const time = String(appointment.serviceTime ?? "").trim();
  const displayDate = date && !/^0+$/.test(date) ? date : "";
  const displayTime = time && !/^0+$/.test(time) ? time : "";

  return [displayDate, displayTime].filter(Boolean).join(" · ");
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
  const safePausedOrders = useMemo(
    () => (Array.isArray(pausedOrders) ? pausedOrders : []),
    [pausedOrders],
  );
  const safeProcessOrders = useMemo(
    () => (Array.isArray(processOrders) ? processOrders : []),
    [processOrders],
  );
  const safeFinishedOrders = useMemo(
    () => (Array.isArray(finishedOrders) ? finishedOrders : []),
    [finishedOrders],
  );

  const [orderTab, setOrderTab] = useState<OrderTabStatus>(OrderStatus.PAUSE);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [vetAppointments, setVetAppointments] = useState<VetAppointment[]>([]);
  const [vetStatusRefreshing, setVetStatusRefreshing] = useState(false);

  const refreshVetAppointments = useCallback(() => {
    if (!authMember) {
      setVetAppointments([]);
      return;
    }
    const mine = readVetAppointments().filter(
      (a) => a.memberId === authMember._id,
    );
    setVetAppointments(mine);
  }, [authMember]);

  const activeVetAppointments = vetAppointments;

  const ordersByStatus = useMemo<Record<OrderTabStatus, Order[]>>(
    () => ({
      [OrderStatus.PAUSE]: safePausedOrders,
      [OrderStatus.PROCESS]: safeProcessOrders,
      [OrderStatus.FINISH]: safeFinishedOrders,
    }),
    [safeFinishedOrders, safePausedOrders, safeProcessOrders],
  );

  const activeOrders = ordersByStatus[orderTab];
  const totalOrders =
    safePausedOrders.length + safeProcessOrders.length + safeFinishedOrders.length;

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
    if (!authMember) {
      refreshVetAppointments();
      return;
    }

    syncVetAppointmentsFromAdmin(authMember._id)
      .then(refreshVetAppointments)
      .catch(sweetErrorHandling);
  }, [authMember, loadOrders, orderBuilder, refreshVetAppointments]);

  const cancelVetAppointment = async (appointmentId: string) => {
    const confirmed = window.confirm(
      "Cancel this veterinary appointment request?",
    );
    if (!confirmed) return;
    try {
      await deleteVetAppointment(appointmentId);
      refreshVetAppointments();
      await sweetTopSmallSuccessAlert("Appointment cancelled");
    } catch (err) {
      await sweetErrorHandling(err);
    }
  };

  const refreshVetStatusFromBackend = async () => {
    if (!authMember || vetStatusRefreshing) return;

    setVetStatusRefreshing(true);
    try {
      await syncVetAppointmentsFromAdmin(authMember._id);
      refreshVetAppointments();
      await sweetTopSmallSuccessAlert("Veterinary status refreshed", 1200);
    } catch (err) {
      await sweetErrorHandling(err);
    } finally {
      setVetStatusRefreshing(false);
    }
  };

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

        {/* ── Veterinary Appointments — separate section ── */}
        {authMember && (
          <div className="op-section op-vet-card-section">
            <div className="op-section-header">
              <div className="op-section-icon-wrap green">
                <MedicalServicesIcon sx={{ fontSize: 22 }} />
              </div>
              <div>
                <Typography className="op-section-title">
                  Veterinary Appointments
                </Typography>
                <Typography className="op-section-sub">
                  {activeVetAppointments.length > 0
                    ? `${activeVetAppointments.length} appointment${activeVetAppointments.length === 1 ? "" : "s"}; refresh to check admin status`
                    : "No vet appointments"}
                </Typography>
              </div>
              <button
                className="op-refresh-btn"
                type="button"
                onClick={refreshVetStatusFromBackend}
                disabled={vetStatusRefreshing}
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
                {vetStatusRefreshing ? "Refreshing..." : "Refresh status"}
              </button>
            </div>

            {activeVetAppointments.length === 0 ? (
              <div className="op-empty">
                <PetsIcon className="op-empty-icon" />
                <p>You have no veterinary appointment requests.</p>
              </div>
            ) : (
              <div className="op-cards">
                {activeVetAppointments.map((a) => (
                  <div key={a._id} className="op-order-card op-vet-card">
                    <div className="op-order-main">
                      <div className="op-order-icon-wrap vet">
                        <PetsIcon sx={{ fontSize: 26 }} />
                      </div>

                      <div className="op-order-body">
                        <div className="op-order-top">
                          <div>
                            <p className="op-order-name">
                              {a.serviceType.replace(/_/g, " ")} — {a.petName}
                            </p>
                          </div>
                          <span
                            className={`op-status-badge vet-${a.status.toLowerCase()}`}
                          >
                            {vetStatusIcon(a.status)}
                            {vetStatusLabel(a.status)}
                          </span>
                        </div>

                        <div className="op-order-meta">
                          <span className="op-meta-item">Pet: {a.petType}</span>
                          <span className="op-meta-item">
                            {a.serviceLocation}
                          </span>
                          <span className="op-meta-item">
                            <CalendarTodayIcon sx={{ fontSize: 12 }} />
                            {formatVetDateTime(a) || "Schedule pending"}
                          </span>
                        </div>

                        {a.serviceAddress && (
                          <p className="op-vet-address">{a.serviceAddress}</p>
                        )}
                        {a.specialNote && (
                          <p className="op-vet-note">Note: {a.specialNote}</p>
                        )}
                      </div>

                      <div className="op-order-right">
                        <p className="op-order-total">
                          {fmtPrice(vetDisplayPrice(a))}
                        </p>
                        {["PAUSE", "ACTIVE"].includes(a.status) && (
                          <div className="op-order-actions">
                            <button
                              className="op-action-btn cancel"
                              type="button"
                              onClick={() => cancelVetAppointment(a._id)}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
