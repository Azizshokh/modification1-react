import React, { useState } from "react";
import { Box, Button, Container } from "@mui/material";
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
import "../../../css/veterinary/veterinary.css";

/* ── Service pricing (USD) ── */
const SERVICE_PRICES: Record<string, number> = {
  HOME_TO_HOME: 40,
  CLINIC_VISIT: 25,
  ONLINE_CONSULT: 15,
  GROOMING: 30,
  VACCINATION: 20,
};

export interface VetAppointment {
  _id: string;
  memberId: string;
  memberNick: string;
  petName: string;
  petType: string;
  serviceType: string;
  serviceLocation: string;
  serviceAddress: string;
  serviceDate: string;
  serviceTime: string;
  specialNote: string;
  servicePrice: number;
  status: "PAUSE" | "PROCESS" | "FINISH" | "DELETE";
  createdAt: string;
}

const VET_STORAGE_KEY = "vetAppointments";

export function readVetAppointments(): VetAppointment[] {
  try {
    const raw = localStorage.getItem(VET_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeVetAppointments(list: VetAppointment[]): void {
  localStorage.setItem(VET_STORAGE_KEY, JSON.stringify(list));
}

/* ── Static Data ── */
const PET_TYPES = [
  { value: "DOG", label: "Dog" },
  { value: "CAT", label: "Cat" },
  { value: "BIRD", label: "Bird" },
  { value: "FISH", label: "Fish" },
];

const SERVICE_TYPES = [
  { value: "HOME_TO_HOME", label: "Home to Home" },
  { value: "CLINIC_VISIT", label: "Clinic Visit" },
  { value: "ONLINE_CONSULT", label: "Online Consultation" },
  { value: "GROOMING", label: "Grooming" },
  { value: "VACCINATION", label: "Vaccination" },
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

// Simulated booked slots — in production these come from backend per selected date
const BOOKED_SLOTS: Record<string, string[]> = {
  // example: slots booked by other users for a specific date
  [new Date().toISOString().split("T")[0]]: ["10:00", "13:00", "15:00"],
};

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

export default function VeterinaryPage() {
  const [form, setForm] = useState<VetFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<VetAppointment | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const { authMember, setOrderBuilder } = useGlobals();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePetType = (value: string) => {
    setForm((prev) => ({ ...prev, petType: value }));
  };

  const handleTimeSlot = (slot: string) => {
    const booked = BOOKED_SLOTS[form.serviceDate] ?? [];
    if (booked.includes(slot)) return;
    setForm((prev) => ({ ...prev, serviceTime: slot }));
  };

  const isBooked = (slot: string): boolean => {
    return (BOOKED_SLOTS[form.serviceDate] ?? []).includes(slot);
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

      const appointment: VetAppointment = {
        _id: `vet_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
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
        status: "PAUSE",
        createdAt: new Date().toISOString(),
      };

      const existing = readVetAppointments();
      writeVetAppointments([appointment, ...existing]);

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

                <div className="vet-done-badge">
                  <ScheduleIcon sx={{ fontSize: 14 }} />
                  Awaiting admin confirmation
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
                      {confirmedAppointment.serviceDate} ·{" "}
                      {confirmedAppointment.serviceTime}
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
                      ${confirmedAppointment.servicePrice}
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
                      <input
                        className="vet-input"
                        type="date"
                        name="serviceDate"
                        value={form.serviceDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="vet-row">
                    <div className="vet-field full">
                      <label className="vet-label">
                        Service Time <span className="vet-required">*</span>
                      </label>
                      <div className="vet-time-slots">
                        {TIME_SLOTS.map((slot) => {
                          const booked = isBooked(slot);
                          const selected = form.serviceTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              className={`vet-time-slot${
                                booked ? " booked" : ""
                              }${selected ? " active" : ""}`}
                              onClick={() => handleTimeSlot(slot)}
                              disabled={booked}
                              title={booked ? "Already booked" : slot}
                            >
                              {slot}
                              {booked && (
                                <span className="vet-slot-tag">Busy</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
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
