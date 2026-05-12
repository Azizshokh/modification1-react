import React, { useState } from "react";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import PetsIcon from "@mui/icons-material/Pets";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import VideocamIcon from "@mui/icons-material/Videocam";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteOutlineIcon from "@mui/icons-material/DeleteForever";
import PaymentIcon from "@mui/icons-material/Payment";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import "../../../css/orders/orders.css";

/* ── Types ── */
type OrderStatus = "PAUSE" | "PROCESS" | "FINISH";
type ServiceStatus = "BOOKED" | "ACCEPTED" | "COMPLETED";
type ServiceType =
  | "HOME_VISIT"
  | "CLINIC"
  | "ONLINE"
  | "GROOMING"
  | "VACCINATION";

interface Order {
  id: string;
  product: string;
  category: string;
  qty: number;
  unitPrice: number;
  address: string;
  date: string;
  status: OrderStatus;
}

interface ServiceBooking {
  id: string;
  serviceType: ServiceType;
  petName: string;
  petType: string;
  petEmoji: string;
  date: string;
  time: string;
  provider: string;
  location: string;
  note?: string;
  status: ServiceStatus;
}

/* ── Mock Data ── */
const ORDERS: Order[] = [
  {
    id: "ORD-001",
    product: "Royal Canin Adult Dog Food",
    category: "Dog Food",
    qty: 2,
    unitPrice: 48000,
    address: "Toshkent, Chilonzor 5-uy",
    date: "2026-05-13",
    status: "PAUSE",
  },
  {
    id: "ORD-002",
    product: "Whiskas Cat Treats Premium",
    category: "Cat Treats",
    qty: 3,
    unitPrice: 18500,
    address: "Toshkent, Yunusobod 12",
    date: "2026-05-12",
    status: "PAUSE",
  },
  {
    id: "ORD-003",
    product: "Hill's Science Diet Puppy",
    category: "Dog Food",
    qty: 1,
    unitPrice: 62000,
    address: "Toshkent, Mirzo Ulugbek",
    date: "2026-05-11",
    status: "PROCESS",
  },
  {
    id: "ORD-004",
    product: "Pedigree Adult Chicken & Rice",
    category: "Dog Food",
    qty: 2,
    unitPrice: 34000,
    address: "Toshkent, Sergeli 8-mavze",
    date: "2026-05-10",
    status: "PROCESS",
  },
  {
    id: "ORD-005",
    product: "Purina Pro Plan Sensitive",
    category: "Dog Food",
    qty: 1,
    unitPrice: 55000,
    address: "Toshkent, Shayxontohur",
    date: "2026-05-08",
    status: "FINISH",
  },
  {
    id: "ORD-006",
    product: "Orijen Six Fish Cat Food",
    category: "Cat Food",
    qty: 1,
    unitPrice: 78000,
    address: "Toshkent, Uchtepa 3",
    date: "2026-05-05",
    status: "FINISH",
  },
  {
    id: "ORD-007",
    product: "Acana Meadowland Cat Food",
    category: "Cat Food",
    qty: 2,
    unitPrice: 42000,
    address: "Toshkent, Olmazor 16",
    date: "2026-05-01",
    status: "FINISH",
  },
];

const SERVICES: ServiceBooking[] = [
  {
    id: "SVC-001",
    serviceType: "CLINIC",
    petName: "Rex",
    petType: "Dog",
    petEmoji: "🐕",
    date: "2026-05-20",
    time: "10:00",
    provider: "Dr. Aliyev — VetCare Clinic",
    location: "Toshkent, Mirzo Ulugbek 22",
    status: "BOOKED",
  },
  {
    id: "SVC-002",
    serviceType: "GROOMING",
    petName: "Mimi",
    petType: "Cat",
    petEmoji: "🐱",
    date: "2026-05-22",
    time: "14:00",
    provider: "PetCare Grooming Salon",
    location: "Toshkent, Chilonzor 8",
    note: "Long coat, gentle trim needed",
    status: "BOOKED",
  },
  {
    id: "SVC-003",
    serviceType: "VACCINATION",
    petName: "Buddy",
    petType: "Dog",
    petEmoji: "🐶",
    date: "2026-05-15",
    time: "11:00",
    provider: "VetPlus Clinic — Dr. Karimov",
    location: "Toshkent, Yunusobod 5",
    status: "ACCEPTED",
  },
  {
    id: "SVC-004",
    serviceType: "HOME_VISIT",
    petName: "Luna",
    petType: "Cat",
    petEmoji: "🐈",
    date: "2026-05-16",
    time: "09:00",
    provider: "Dr. Rashidova (Home Visit)",
    location: "Toshkent, Shayxontohur 11",
    note: "Post-surgery follow-up",
    status: "ACCEPTED",
  },
  {
    id: "SVC-005",
    serviceType: "ONLINE",
    petName: "Tweety",
    petType: "Bird",
    petEmoji: "🦜",
    date: "2026-05-10",
    time: "15:00",
    provider: "Dr. Yusupov — Online Consult",
    location: "Online Session",
    status: "COMPLETED",
  },
  {
    id: "SVC-006",
    serviceType: "GROOMING",
    petName: "Max",
    petType: "Dog",
    petEmoji: "🐕",
    date: "2026-05-08",
    time: "13:00",
    provider: "PetCare Grooming Salon",
    location: "Toshkent, Chilonzor 8",
    status: "COMPLETED",
  },
  {
    id: "SVC-007",
    serviceType: "VACCINATION",
    petName: "Whiskers",
    petType: "Cat",
    petEmoji: "🐱",
    date: "2026-05-05",
    time: "10:00",
    provider: "City Vet Clinic — Dr. Nazarov",
    location: "Toshkent, Uchtepa 5",
    status: "COMPLETED",
  },
];

/* ── Helpers ── */
function svcIcon(type: ServiceType) {
  const props = { className: "op-svc-icon" };
  switch (type) {
    case "HOME_VISIT":
      return <HomeWorkIcon {...props} />;
    case "CLINIC":
      return <MedicalServicesIcon {...props} />;
    case "ONLINE":
      return <VideocamIcon {...props} />;
    case "GROOMING":
      return <ContentCutIcon {...props} />;
    case "VACCINATION":
      return <LocalHospitalIcon {...props} />;
  }
}

function svcLabel(type: ServiceType): string {
  const map: Record<ServiceType, string> = {
    HOME_VISIT: "Home Visit",
    CLINIC: "Clinic Visit",
    ONLINE: "Online Consult",
    GROOMING: "Grooming",
    VACCINATION: "Vaccination",
  };
  return map[type];
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtPrice(n: number): string {
  return n.toLocaleString() + " so'm";
}

/* ── Component ── */
export function OrdersPage(): React.JSX.Element {
  const [orderTab, setOrderTab] = useState<OrderStatus>("PAUSE");
  const [serviceTab, setServiceTab] = useState<ServiceStatus>("BOOKED");

  const filteredOrders = ORDERS.filter((o) => o.status === orderTab);
  const filteredServices = SERVICES.filter((s) => s.status === serviceTab);

  const orderCounts = {
    PAUSE: ORDERS.filter((o) => o.status === "PAUSE").length,
    PROCESS: ORDERS.filter((o) => o.status === "PROCESS").length,
    FINISH: ORDERS.filter((o) => o.status === "FINISH").length,
  };
  const serviceCounts = {
    BOOKED: SERVICES.filter((s) => s.status === "BOOKED").length,
    ACCEPTED: SERVICES.filter((s) => s.status === "ACCEPTED").length,
    COMPLETED: SERVICES.filter((s) => s.status === "COMPLETED").length,
  };

  return (
    <div className="op-page">
      {/* ── Hero ── */}
      <div className="op-hero">
        <div className="op-hero-badge">
          <ShoppingBagIcon sx={{ fontSize: 14 }} />
          My Account
        </div>
        <h1 className="op-hero-title">Orders &amp; Bookings</h1>
        <p className="op-hero-sub">
          Track your pet food orders and service appointments in one place.
        </p>
      </div>

      <Container maxWidth="lg" className="op-content">
        {/* ══════════════════════════════════════════
            SECTION 1 — MY ORDERS
        ══════════════════════════════════════════ */}
        <div className="op-section">
          <div className="op-section-header">
            <div className="op-section-icon-wrap orange">
              <ShoppingBagIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <Typography className="op-section-title">My Orders</Typography>
              <Typography className="op-section-sub">
                {ORDERS.length} total orders — food &amp; products
              </Typography>
            </div>
          </div>

          {/* Tabs */}
          <div className="op-tabs">
            {(
              [
                {
                  key: "PAUSE",
                  label: "Paused",
                  icon: <HourglassEmptyIcon sx={{ fontSize: 15 }} />,
                },
                {
                  key: "PROCESS",
                  label: "In Process",
                  icon: <LocalShippingIcon sx={{ fontSize: 15 }} />,
                },
                {
                  key: "FINISH",
                  label: "Finished",
                  icon: <DoneAllIcon sx={{ fontSize: 15 }} />,
                },
              ] as const
            ).map(({ key, label, icon }) => (
              <button
                key={key}
                className={`op-tab-btn${orderTab === key ? " active orange" : ""}`}
                onClick={() => setOrderTab(key)}
              >
                {icon}
                {label}
                <span className="op-tab-count">{orderCounts[key]}</span>
              </button>
            ))}
          </div>

          {/* Cards */}
          {filteredOrders.length === 0 ? (
            <div className="op-empty">
              <ShoppingBagIcon className="op-empty-icon" />
              <p>No orders in this status.</p>
            </div>
          ) : (
            <div className="op-cards">
              {filteredOrders.map((order) => (
                <div key={order.id} className="op-order-card">
                  <div className="op-order-icon-wrap">
                    <ShoppingBagIcon sx={{ fontSize: 26 }} />
                  </div>

                  <div className="op-order-body">
                    <div className="op-order-top">
                      <div>
                        <p className="op-order-name">{order.product}</p>
                        <p className="op-order-cat">{order.category}</p>
                      </div>
                      <span
                        className={`op-status-badge ${order.status.toLowerCase()}`}
                      >
                        {order.status === "PAUSE" && (
                          <HourglassEmptyIcon sx={{ fontSize: 12 }} />
                        )}
                        {order.status === "PROCESS" && (
                          <LocalShippingIcon sx={{ fontSize: 12 }} />
                        )}
                        {order.status === "FINISH" && (
                          <CheckCircleIcon sx={{ fontSize: 12 }} />
                        )}
                        {order.status === "PAUSE"
                          ? "Paused"
                          : order.status === "PROCESS"
                            ? "In Process"
                            : "Finished"}
                      </span>
                    </div>

                    <div className="op-order-meta">
                      <span className="op-meta-item qty">
                        {order.qty} × {fmtPrice(order.unitPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="op-order-right">
                    <p className="op-order-total">
                      {fmtPrice(order.qty * order.unitPrice)}
                    </p>
                    <div className="op-order-actions">
                      {order.status === "PAUSE" && (
                        <button className="op-action-btn pay">
                          <PaymentIcon sx={{ fontSize: 14 }} /> Pay Now
                        </button>
                      )}
                      {order.status === "PAUSE" && (
                        <button className="op-action-btn cancel">
                          <DeleteOutlineIcon sx={{ fontSize: 14 }} /> Cancel
                        </button>
                      )}
                      {order.status === "PROCESS" && (
                        <button className="op-action-btn track">
                          <LocalShippingIcon sx={{ fontSize: 14 }} /> Track
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            SECTION 2 — PET SERVICE BOOKINGS
        ══════════════════════════════════════════ */}
        <div className="op-section">
          <div className="op-section-header">
            <div className="op-section-icon-wrap green">
              <PetsIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <Typography className="op-section-title green">
                Pet Service Bookings
              </Typography>
              <Typography className="op-section-sub">
                {SERVICES.length} total bookings — vet &amp; grooming
                appointments
              </Typography>
            </div>
          </div>

          {/* Tabs */}
          <div className="op-tabs">
            {(
              [
                {
                  key: "BOOKED",
                  label: "Booked",
                  icon: <EventAvailableIcon sx={{ fontSize: 15 }} />,
                },
                {
                  key: "ACCEPTED",
                  label: "Accepted",
                  icon: <CheckCircleIcon sx={{ fontSize: 15 }} />,
                },
                {
                  key: "COMPLETED",
                  label: "Completed",
                  icon: <DoneAllIcon sx={{ fontSize: 15 }} />,
                },
              ] as const
            ).map(({ key, label, icon }) => (
              <button
                key={key}
                className={`op-tab-btn${serviceTab === key ? " active green" : ""}`}
                onClick={() => setServiceTab(key)}
              >
                {icon}
                {label}
                <span className="op-tab-count">{serviceCounts[key]}</span>
              </button>
            ))}
          </div>

          {/* Cards */}
          {filteredServices.length === 0 ? (
            <div className="op-empty green">
              <PetsIcon className="op-empty-icon" />
              <p>No service bookings in this status.</p>
            </div>
          ) : (
            <div className="op-cards">
              {filteredServices.map((svc) => (
                <div key={svc.id} className="op-svc-card">
                  <div className="op-svc-icon-wrap">
                    {svcIcon(svc.serviceType)}
                  </div>

                  <div className="op-svc-body">
                    <div className="op-svc-top">
                      <div>
                        <p className="op-svc-name">
                          {svcLabel(svc.serviceType)}
                        </p>
                        <p className="op-svc-pet">
                          {svc.petEmoji} {svc.petName}{" "}
                          <span className="op-svc-pet-type">
                            ({svc.petType})
                          </span>
                        </p>
                      </div>
                      <span
                        className={`op-status-badge ${svc.status.toLowerCase()}`}
                      >
                        {svc.status === "BOOKED" && (
                          <EventAvailableIcon sx={{ fontSize: 12 }} />
                        )}
                        {svc.status === "ACCEPTED" && (
                          <CheckCircleIcon sx={{ fontSize: 12 }} />
                        )}
                        {svc.status === "COMPLETED" && (
                          <DoneAllIcon sx={{ fontSize: 12 }} />
                        )}
                        {svc.status === "BOOKED"
                          ? "Booked"
                          : svc.status === "ACCEPTED"
                            ? "Accepted"
                            : "Completed"}
                      </span>
                    </div>

                    <div className="op-svc-meta">
                      <span className="op-meta-item">
                        <CalendarTodayIcon sx={{ fontSize: 12 }} />
                        {fmtDate(svc.date)}
                      </span>
                      <span className="op-meta-item">
                        <AccessTimeIcon sx={{ fontSize: 12 }} />
                        {svc.time}
                      </span>
                      <span className="op-meta-item">
                        <LocationOnIcon sx={{ fontSize: 12 }} />
                        {svc.location}
                      </span>
                    </div>
                  </div>

                  <div className="op-svc-actions">
                    {svc.status === "BOOKED" && (
                      <button className="op-action-btn cancel">
                        <DeleteOutlineIcon sx={{ fontSize: 14 }} /> Cancel
                      </button>
                    )}
                    {svc.status === "ACCEPTED" && (
                      <button className="op-action-btn track green">
                        <EventAvailableIcon sx={{ fontSize: 14 }} /> Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
