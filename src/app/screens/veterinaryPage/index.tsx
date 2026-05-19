import React, { useEffect, useState } from "react";
import { Button, Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import PetsIcon from "@mui/icons-material/Pets";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ScheduleIcon from "@mui/icons-material/Schedule";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VideocamIcon from "@mui/icons-material/Videocam";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";
import {
  createVetAppointment,
  getBookedVetSlots,
  readVetAppointments,
  startVetAppointmentStatusSync,
  subscribeVetAppointments,
} from "../../services/vetSlotStore";
import type { VetAppointment } from "../../services/vetSlotStore";
import "../../../css/veterinary/veterinary.css";

/* ── Service pricing (USD) ── */
const SERVICE_PRICES: Record<string, number> = {
  HOME_TO_HOME: 40,
  CLINIC_TO_CLINIC: 25,
  ONLINE_CONSULTATION: 15,
  GROOMING: 30,
};

export type { VetAppointment } from "../../services/vetSlotStore";
export { readVetAppointments, writeVetAppointments } from "../../services/vetSlotStore";

/* ── Static Data ── */
const PET_TYPES = [
  { value: "DOG", label: "Dog" },
  { value: "CAT", label: "Cat" },
  { value: "BIRD", label: "Bird" },
  { value: "FISH", label: "Fish" },
  { value: "RABBIT", label: "Rabbit" },
  { value: "OTHER", label: "Other" },
];

const SERVICE_TYPES = [
  { value: "HOME_TO_HOME", label: "Home to Home" },
  { value: "CLINIC_TO_CLINIC", label: "Clinic to Clinic" },
  { value: "ONLINE_CONSULTATION", label: "Online Consultation" },
  { value: "GROOMING", label: "Grooming" },
];

const SERVICE_LOCATIONS = [
  { value: "HOME", label: "Home" },
  { value: "CLINIC", label: "Clinic" },
  { value: "ONLINE", label: "Online" },
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const WEEKEND_TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00"];

interface VetFormData {
  petName: string;
  petType: string;
  serviceType: string;
  serviceLocation: string;
  serviceAddress: string;
  serviceDate: string;
  serviceTime: string;
  specialNote: string;
}

const initialForm: VetFormData = {
  petName: "",
  petType: "",
  serviceType: "",
  serviceLocation: "",
  serviceAddress: "",
  serviceDate: "",
  serviceTime: "",
  specialNote: "",
};

function vetStatusText(status: VetAppointment["status"]): string {
  switch (status) {
    case "ACTIVE":
    case "PAUSE":
      return "Awaiting admin confirmation";
    case "ACCEPTED":
      return "Accepted by admin";
    case "COMPLETED":
      return "Appointment completed";
    case "CANCELLED":
    case "DELETE":
      return "Appointment cancelled";
    default:
      return "Awaiting admin confirmation";
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

function getTodayInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWeekendDate(dateValue: string): boolean {
  if (!dateValue) return false;
  const day = new Date(`${dateValue}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

function isPastSlot(dateValue: string, slot: string): boolean {
  if (dateValue !== getTodayInputValue()) return false;

  const [hours, minutes] = slot.split(":").map(Number);
  const slotDate = new Date();
  slotDate.setHours(hours, minutes, 0, 0);

  const minimumBookTime = new Date();
  minimumBookTime.setMinutes(minimumBookTime.getMinutes() + 30);

  return slotDate <= minimumBookTime;
}

export default function VeterinaryPage() {
  const [form, setForm] = useState<VetFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<VetAppointment | null>(null);
  const [storeVersion, setStoreVersion] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const { authMember, setOrderBuilder } = useGlobals();

  useEffect(() => {
    return subscribeVetAppointments(() => {
      setStoreVersion((version) => version + 1);
      setOrderBuilder(new Date());
    });
  }, [setOrderBuilder]);

  useEffect(() => {
    if (!authMember) return;

    return startVetAppointmentStatusSync(authMember._id, () => {
      setStoreVersion((version) => version + 1);
      setOrderBuilder(new Date());
    });
  }, [authMember, setOrderBuilder]);

  const confirmedAppointmentId = confirmedAppointment?._id;

  useEffect(() => {
    if (!confirmedAppointmentId) return;
    const latest = readVetAppointments().find(
      (appointment) => appointment._id === confirmedAppointmentId,
    );
    if (latest) setConfirmedAppointment(latest);
  }, [confirmedAppointmentId, storeVersion]);

  const bookedSlots = getBookedVetSlots(form.serviceDate);
  const availableSlots = isWeekendDate(form.serviceDate)
    ? WEEKEND_TIME_SLOTS
    : TIME_SLOTS;
  const slotStats = availableSlots.reduce(
    (stats, slot) => {
      if (bookedSlots.includes(slot)) return { ...stats, booked: stats.booked + 1 };
      if (isPastSlot(form.serviceDate, slot)) {
        return { ...stats, unavailable: stats.unavailable + 1 };
      }
      return { ...stats, open: stats.open + 1 };
    },
    { open: 0, booked: 0, unavailable: 0 },
  );

  useEffect(() => {
    if (!form.serviceTime) return;

    const selectedSlotInvalid =
      !availableSlots.includes(form.serviceTime) ||
      bookedSlots.includes(form.serviceTime) ||
      isPastSlot(form.serviceDate, form.serviceTime);

    if (selectedSlotInvalid) {
      setForm((prev) => ({ ...prev, serviceTime: "" }));
    }
  }, [availableSlots, bookedSlots, form.serviceDate, form.serviceTime]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const nextValue =
      name === "serviceType" && value === "ONLINE_CONSULTATION"
        ? {
            serviceType: value,
            serviceLocation: "ONLINE",
            serviceAddress: "Online consultation",
          }
        : name === "serviceType" && value === "HOME_TO_HOME"
          ? { serviceType: value, serviceLocation: "HOME" }
          : name === "serviceType" && value
            ? { serviceType: value, serviceLocation: "CLINIC" }
            : { [name]: value };

    setForm((prev) => ({
      ...prev,
      ...nextValue,
      ...(name === "serviceDate" ? { serviceTime: "" } : {}),
    }));
  };

  const handlePetType = (value: string) => {
    setForm((prev) => ({ ...prev, petType: value }));
  };

  const handleTimeSlot = (slot: string) => {
    if (bookedSlots.includes(slot)) return;
    if (isPastSlot(form.serviceDate, slot)) return;
    setForm((prev) => ({ ...prev, serviceTime: slot }));
  };

  const isBooked = (slot: string): boolean => {
    return bookedSlots.includes(slot);
  };

  const slotTitle = (slot: string): string => {
    if (!form.serviceDate) return "Choose a service date first";
    if (isPastSlot(form.serviceDate, slot)) return "This time has passed";
    if (isBooked(slot)) return "Already booked";
    return `Available at ${slot}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!authMember) {
        throw new Error(Messages.error2);
      }
      if (
        !form.petName ||
        !form.petType ||
        !form.serviceType ||
        !form.serviceLocation ||
        !form.serviceAddress ||
        !form.serviceDate ||
        !form.serviceTime
      ) {
        throw new Error(Messages.error3);
      }

      setSubmitting(true);

      const appointment = await createVetAppointment({
        memberId: authMember._id,
        memberNick: authMember.memberNick,
        petName: form.petName,
        petType: form.petType,
        serviceType: form.serviceType,
        serviceLocation: form.serviceLocation,
        serviceAddress: form.serviceAddress,
        serviceDate: form.serviceDate,
        serviceTime: form.serviceTime,
        specialNote: form.specialNote,
        servicePrice: SERVICE_PRICES[form.serviceType] ?? 0,
      });

      setSubmitted(true);
      setConfirmedAppointment(appointment);
      setForm(initialForm);
      setOrderBuilder(new Date());

      await sweetTopSmallSuccessAlert(
        "Appointment requested! Awaiting admin confirmation…",
        2200,
      );
    } catch (err) {
      await sweetErrorHandling(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vet-page">
      {/* ── Hero ── */}
      <div className="vet-hero">
        <div className="vet-hero-badge">
          <PetsIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.9)" }} />
          Professional Pet Care
        </div>
        <Typography className="vet-hero-title">
          Veterinary Services 🐾
        </Typography>
        <Typography className="vet-hero-subtitle">
          Book a vet appointment for your furry friend — fast, easy and reliable
        </Typography>
        <div className="vet-features">
          <div className="vet-feature-card">
            <HomeWorkIcon
              sx={{ fontSize: 20, color: "rgba(255,255,255,0.9)" }}
            />
            <span>Home Visits</span>
          </div>
          <div className="vet-feature-card">
            <VerifiedUserIcon
              sx={{ fontSize: 20, color: "rgba(255,255,255,0.9)" }}
            />
            <span>Certified Vets</span>
          </div>
          <div className="vet-feature-card">
            <EventAvailableIcon
              sx={{ fontSize: 20, color: "rgba(255,255,255,0.9)" }}
            />
            <span>Same-Day Booking</span>
          </div>
        </div>
      </div>

      <Container className="vet-container">
        <div className="vet-layout">
          {/* ── LEFT: Booking Form OR Confirmation ── */}
          <div className="vet-form-col">
            {submitted && confirmedAppointment ? (
              <div className="vet-done-card">
                <div className="vet-done-icon">
                  <CheckCircleOutlinedIcon sx={{ fontSize: 56 }} />
                </div>
                <h2 className="vet-done-title">Appointment Requested! 🐾</h2>
                <p className="vet-done-subtitle">
                  Your booking has been received and is awaiting admin
                  confirmation.
                </p>

                <div
                  className={`vet-done-badge ${confirmedAppointment.status.toLowerCase()}`}
                >
                  <ScheduleIcon sx={{ fontSize: 14 }} />
                  {vetStatusText(confirmedAppointment.status)}
                </div>

                <div className="vet-done-summary">
                  <div className="vet-done-row">
                    <span className="vet-done-key">
                      <PetsIcon sx={{ fontSize: 15, opacity: 0.7 }} />
                      Pet
                    </span>
                    <span className="vet-done-val">
                      {confirmedAppointment.petName} (
                      {confirmedAppointment.petType})
                    </span>
                  </div>
                  <div className="vet-done-row">
                    <span className="vet-done-key">
                      <MedicalServicesIcon
                        sx={{ fontSize: 15, opacity: 0.7 }}
                      />
                      Service
                    </span>
                    <span className="vet-done-val">
                      {confirmedAppointment.serviceType.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="vet-done-row">
                    <span className="vet-done-key">
                      <LocationOnIcon sx={{ fontSize: 15, opacity: 0.7 }} />
                      Location
                    </span>
                    <span className="vet-done-val">
                      {confirmedAppointment.serviceLocation} ·{" "}
                      {confirmedAppointment.serviceAddress}
                    </span>
                  </div>
                  <div className="vet-done-row">
                    <span className="vet-done-key">
                      <CalendarMonthIcon sx={{ fontSize: 15, opacity: 0.7 }} />
                      Date &amp; Time
                    </span>
                    <span className="vet-done-val">
                      {formatVetDateTime(confirmedAppointment) ||
                        "Schedule pending"}
                    </span>
                  </div>
                  {confirmedAppointment.specialNote && (
                    <div className="vet-done-row">
                      <span className="vet-done-key">
                        <NoteAltIcon sx={{ fontSize: 15, opacity: 0.7 }} />
                        Note
                      </span>
                      <span className="vet-done-val">
                        {confirmedAppointment.specialNote}
                      </span>
                    </div>
                  )}
                  <div className="vet-done-row total">
                    <span className="vet-done-key">Service Fee</span>
                    <span className="vet-done-val price">
                      ${vetDisplayPrice(confirmedAppointment)}
                    </span>
                  </div>
                </div>

                <div className="vet-done-actions">
                  <Button
                    className="vet-done-btn secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setConfirmedAppointment(null);
                    }}
                  >
                    Book Another Appointment
                  </Button>
                  <Button
                    className="vet-done-btn secondary"
                    onClick={() => navigate("/orders")}
                  >
                    View Status
                  </Button>
                </div>

                <p className="vet-done-footnote">
                  Reference ID: <code>{confirmedAppointment._id}</code>
                </p>
              </div>
            ) : (
              <div className="vet-card">
                <div className="vet-card-header">
                  <CalendarMonthIcon
                    sx={{ fontSize: 28, color: "var(--vet-green)" }}
                  />
                  <div className="vet-card-header-text">
                    <h2>Book an Appointment</h2>
                    <p>Fill in the details below to schedule your visit</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* ─── Pet Info ─── */}
                  <div className="vet-section-heading">
                    <PetsIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                    Pet Information
                  </div>

                  {/* Pet Name */}
                  <div className="vet-row">
                    <div className="vet-field full">
                      <label className="vet-label">
                        Pet Name <span className="vet-required">*</span>
                      </label>
                      <input
                        className="vet-input"
                        type="text"
                        name="petName"
                        placeholder="e.g. Buddy"
                        value={form.petName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Pet Type Chips */}
                  <div className="vet-row">
                    <div className="vet-field full">
                      <label className="vet-label">
                        Pet Type <span className="vet-required">*</span>
                      </label>
                      <div className="vet-pet-chips">
                        {PET_TYPES.map((pt) => (
                          <button
                            key={pt.value}
                            type="button"
                            className={`vet-pet-chip ${form.petType === pt.value ? "active" : ""}`}
                            onClick={() => handlePetType(pt.value)}
                          >
                            {pt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ─── Service Details ─── */}
                  <div className="vet-section-heading">
                    <MedicalServicesIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                    Service Details
                  </div>

                  <div className="vet-row">
                    {/* Service Type */}
                    <div className="vet-field">
                      <label className="vet-label">
                        Service Type <span className="vet-required">*</span>
                      </label>
                      <div className="vet-select-wrap">
                        <select
                          className="vet-select"
                          name="serviceType"
                          value={form.serviceType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">— Select —</option>
                          {SERVICE_TYPES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Service Location */}
                    <div className="vet-field">
                      <label className="vet-label">
                        Service Location <span className="vet-required">*</span>
                      </label>
                      <div className="vet-select-wrap">
                        <select
                          className="vet-select"
                          name="serviceLocation"
                          value={form.serviceLocation}
                          onChange={handleChange}
                          required
                        >
                          <option value="">— Select —</option>
                          {SERVICE_LOCATIONS.map((l) => (
                            <option key={l.value} value={l.value}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Service Address */}
                  <div className="vet-row">
                    <div className="vet-field full">
                      <label className="vet-label">
                        Service Address <span className="vet-required">*</span>
                      </label>
                      <input
                        className="vet-input"
                        type="text"
                        name="serviceAddress"
                        placeholder="e.g. Toshkent, Chilonzor 5-uy, 12-xonadon"
                        value={form.serviceAddress}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* ─── Schedule ─── */}
                  <div className="vet-section-heading">
                    <ScheduleIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                    Schedule
                  </div>

                  <div className="vet-row">
                    {/* Date */}
                    <div className="vet-field">
                      <label className="vet-label">
                        Service Date <span className="vet-required">*</span>
                      </label>
                      <div className="vet-date-wrap">
                        <CalendarMonthIcon className="vet-date-icon" />
                        <input
                          className="vet-input vet-date-input"
                          type="date"
                          name="serviceDate"
                          value={form.serviceDate}
                          onChange={handleChange}
                          min={getTodayInputValue()}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="vet-row">
                    <div className="vet-field full">
                      <label className="vet-label">
                        Service Time <span className="vet-required">*</span>
                      </label>
                      <div className="vet-slot-toolbar">
                        <span className="vet-slot-summary">
                          {form.serviceDate
                            ? `${slotStats.open} open slots`
                            : "Choose a date to see slots"}
                        </span>
                        <span className="vet-slot-legend open">Open</span>
                        <span className="vet-slot-legend selected">
                          Selected
                        </span>
                        <span className="vet-slot-legend booked">Busy</span>
                      </div>
                      <div className="vet-time-slots">
                        {availableSlots.map((slot) => {
                          const booked = isBooked(slot);
                          const past = isPastSlot(form.serviceDate, slot);
                          const selected = form.serviceTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              className={`vet-time-slot${
                                booked ? " booked" : ""
                              }${past ? " past" : ""
                              }${selected ? " active" : ""}`}
                              onClick={() => handleTimeSlot(slot)}
                              disabled={!form.serviceDate || booked || past}
                              title={slotTitle(slot)}
                            >
                              <span className="vet-slot-time">{slot}</span>
                              {booked && (
                                <span className="vet-slot-tag">Busy</span>
                              )}
                              {past && !booked && (
                                <span className="vet-slot-tag muted">Past</span>
                              )}
                              {selected && (
                                <span className="vet-slot-tag selected">
                                  Selected
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {form.serviceDate && slotStats.open === 0 && (
                        <p className="vet-slot-help">
                          All slots are unavailable for this date. Please choose
                          another date.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ─── Additional ─── */}
                  <div className="vet-section-heading">
                    <NoteAltIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                    Additional Notes
                  </div>

                  <div className="vet-row">
                    <div className="vet-field full">
                      <label className="vet-label">Special Note</label>
                      <textarea
                        className="vet-textarea"
                        name="specialNote"
                        placeholder="e.g. Darvoza 2-qavat, allergies, special requests…"
                        value={form.specialNote}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="vet-submit-row">
                    <Button
                      type="submit"
                      variant="contained"
                      className="vet-submit-btn"
                      disableElevation
                      disabled={submitting}
                    >
                      {submitting
                        ? "Sending request…"
                        : authMember
                          ? "Book Appointment 🐾"
                          : "Login to Book Appointment"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ── RIGHT: Info Column ── */}
          <div className="vet-info-col">
            {/* Services */}
            <div className="vet-info-card">
              <div className="vet-info-title">
                <MedicalServicesIcon
                  sx={{ fontSize: 20, color: "var(--vet-green)" }}
                />
                Our Services
              </div>
              <div className="vet-service-list">
                <div className="vet-service-item">
                  <HomeWorkIcon
                    sx={{ fontSize: 20, color: "var(--vet-green)" }}
                  />
                  <div className="vet-service-item-text">
                    <strong>Home to Home</strong>
                    <p>Vet visits your pet at home — stress-free care</p>
                  </div>
                </div>
                <div className="vet-service-item">
                  <LocalHospitalIcon
                    sx={{ fontSize: 20, color: "var(--vet-green)" }}
                  />
                  <div className="vet-service-item-text">
                    <strong>Clinic Visit</strong>
                    <p>Full diagnostic and treatment at our clinic</p>
                  </div>
                </div>
                <div className="vet-service-item">
                  <VideocamIcon
                    sx={{ fontSize: 20, color: "var(--vet-green)" }}
                  />
                  <div className="vet-service-item-text">
                    <strong>Online Consultation</strong>
                    <p>Video call with a certified vet from anywhere</p>
                  </div>
                </div>
                <div className="vet-service-item">
                  <ContentCutIcon
                    sx={{ fontSize: 20, color: "var(--vet-green)" }}
                  />
                  <div className="vet-service-item-text">
                    <strong>Grooming & Vaccination</strong>
                    <p>Regular grooming and vaccine schedules</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="vet-info-card">
              <div className="vet-info-title">
                <AccessTimeIcon
                  sx={{ fontSize: 20, color: "var(--vet-green)" }}
                />
                Working Hours
              </div>
              <div className="vet-hours-grid">
                {[
                  { day: "Monday – Friday", time: "08:00 – 19:00" },
                  { day: "Saturday", time: "09:00 – 17:00" },
                  { day: "Sunday", time: "10:00 – 14:00" },
                ].map((h) => (
                  <div className="vet-hours-row" key={h.day}>
                    <span className="vet-hours-day">{h.day}</span>
                    <span className="vet-hours-time">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="vet-contact-strip">
              <div className="vet-contact-item">
                <PhoneIcon
                  sx={{ fontSize: 18, color: "rgba(255,255,255,0.9)" }}
                />
                <span>+998 90 123 45 67</span>
              </div>
              <div className="vet-contact-item">
                <EmailIcon
                  sx={{ fontSize: 18, color: "rgba(255,255,255,0.9)" }}
                />
                <span>vet@petfood.uz</span>
              </div>
              <div className="vet-contact-item">
                <LocationOnIcon
                  sx={{ fontSize: 18, color: "rgba(255,255,255,0.9)" }}
                />
                <span>Toshkent, Yunusobod 7</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
