import axios from "axios";
import { serverApi } from "../../lib/config";

export type VetAppointmentStatus =
  | "PAUSE"
  | "ACTIVE"
  | "ACCEPTED"
  | "COMPLETED"
  | "CANCELLED"
  | "DELETE";

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
  originalServicePrice: number;
  status: VetAppointmentStatus;
  serviceStatus: VetAppointmentStatus;
  createdAt: string;
  updatedAt: string;
  adminNote?: string;
}

export interface VetAppointmentInput {
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
}

const VET_STORAGE_KEY = "vetAppointments";
const VET_PUBLIC_API_BASE = `${serverApi}/pet-service`;
const VET_CREATE_URL = `${VET_PUBLIC_API_BASE}/create`;
const SERVICE_PRICES: Record<string, number> = {
  HOME_TO_HOME: 40,
  CLINIC_TO_CLINIC: 25,
  ONLINE_CONSULTATION: 15,
  GROOMING: 30,
};

function dateKey(input: string | Date): string {
  if (!input) return "";
  if (input instanceof Date) return input.toISOString().split("T")[0];

  const value = String(input);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toISOString().split("T")[0];
}

function normalizeServiceDate(input: any, fallback?: string): string {
  const value = String(input ?? "").trim();
  const fallbackValue = String(fallback ?? "").trim();

  if (!value || /^0+$/.test(value)) return fallbackValue;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);

  return date.toISOString().split("T")[0];
}

function normalizeServiceTime(input: any, fallback?: string): string {
  const value = String(input ?? "").trim();
  const fallbackValue = String(fallback ?? "").trim();

  if (!value || /^0+$/.test(value)) return fallbackValue;
  if (/^\d{1,2}:\d{2}$/.test(value)) {
    const [hours, minutes] = value.split(":");
    return `${hours.padStart(2, "0")}:${minutes}`;
  }
  if (/^\d{3,4}$/.test(value)) {
    const padded = value.padStart(4, "0");
    return `${padded.slice(0, 2)}:${padded.slice(2, 4)}`;
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes(),
    ).padStart(2, "0")}`;
  }

  return value;
}

function normalizeServiceType(input: any, fallback?: string): string {
  return String(input ?? fallback ?? "").trim().toUpperCase();
}

function servicePriceForType(serviceType: string): number {
  return SERVICE_PRICES[serviceType] ?? 0;
}

function normalizePrice(input: any, fallback?: number): number {
  const value = Number(input);
  if (Number.isFinite(value) && value > 0) return value;

  return Number(fallback ?? 0);
}

function normalizeStatus(input: any): VetAppointmentStatus {
  const rawStatus = String(
    input?.serviceStatus ??
      input?.status ??
      input?.petServiceStatus ??
      input?.appointmentStatus ??
      input?.process ??
      "PAUSE",
  ).toUpperCase();
  const status = rawStatus.replace(/[\s-]/g, "_");

  if (
    ["PAUSE", "ACTIVE", "ACCEPTED", "COMPLETED", "CANCELLED", "DELETE"].includes(
      status,
    )
  ) {
    return status as VetAppointmentStatus;
  }

  if (["PENDING", "REQUESTED", "WAITING", "NEW"].includes(status)) {
    return "PAUSE";
  }

  if (["CONFIRMED", "APPROVED", "PROCESS", "IN_PROCESS"].includes(status)) {
    return "ACCEPTED";
  }

  if (["DONE", "COMPLETE", "FINISHED", "FINISH"].includes(status)) {
    return "COMPLETED";
  }

  if (["CANCELLED", "CANCELED", "REJECTED", "REMOVED"].includes(status)) {
    return "CANCELLED";
  }

  return "PAUSE";
}

function normalizeAppointment(
  input: any,
  fallback?: VetAppointment,
): VetAppointment | null {
  if (!input || typeof input !== "object") return null;
  const id =
    input._id ??
    input.id ??
    input.petServiceId ??
    input.appointmentId ??
    fallback?._id;
  const memberId =
    input.memberId?._id ??
    input.memberId?.id ??
    input.memberId ??
    input.userId?._id ??
    input.userId?.id ??
    input.userId ??
    input.customerId?._id ??
    input.customerId?.id ??
    input.customerId ??
    input.member?._id ??
    input.member?.id ??
    input.memberData?._id ??
    input.memberData?.id ??
    fallback?.memberId;
  if (!id || !memberId) return null;
  const serviceType = normalizeServiceType(
    input.serviceType ?? input.petServiceType,
    fallback?.serviceType,
  );
  const defaultPrice = servicePriceForType(serviceType);
  const originalServicePrice = normalizePrice(
    input.originalServicePrice ??
      input.servicePrice ??
      input.petServicePrice ??
      input.petServiceFee ??
      input.price,
    fallback?.originalServicePrice || fallback?.servicePrice || defaultPrice,
  );
  const status = normalizeStatus(input);

  return {
    _id: String(id),
    memberId: String(memberId),
    memberNick: String(
      input.memberNick ??
        input.member?.memberNick ??
        input.memberData?.memberNick ??
        fallback?.memberNick ??
        "Member",
    ),
    petName: String(input.petName ?? input.pet?.name ?? fallback?.petName ?? ""),
    petType: String(input.petType ?? input.pet?.type ?? fallback?.petType ?? ""),
    serviceType,
    serviceLocation: String(
      input.serviceLocation ??
        input.petServiceLocation ??
        fallback?.serviceLocation ??
        "",
    ),
    serviceAddress: String(
      input.serviceAddress ?? input.petServiceAddress ?? fallback?.serviceAddress ?? "",
    ),
    serviceDate: normalizeServiceDate(
      input.serviceDate ?? input.petServiceDate,
      fallback?.serviceDate,
    ),
    serviceTime: normalizeServiceTime(
      input.serviceTime ?? input.petServiceTime,
      fallback?.serviceTime,
    ),
    specialNote: String(
      input.specialNote ?? input.petServiceNote ?? fallback?.specialNote ?? "",
    ),
    servicePrice: status === "COMPLETED" ? 0 : originalServicePrice,
    originalServicePrice,
    status,
    serviceStatus: status,
    createdAt: String(input.createdAt ?? fallback?.createdAt ?? new Date().toISOString()),
    updatedAt: String(
      input.updatedAt ??
        input.createdAt ??
        fallback?.updatedAt ??
        new Date().toISOString(),
    ),
    adminNote: input.adminNote ? String(input.adminNote) : fallback?.adminNote,
  };
}

function extractAppointmentResponse(input: any): any {
  if (!input || typeof input !== "object") return input;
  return (
    input.data?.data ??
    input.data?.appointment ??
    input.data?.petService ??
    input.data ??
    input.appointment ??
    input.petService ??
    input.result ??
    input
  );
}

function extractAppointmentList(input: any): any[] {
  const source =
    input?.data?.list ??
    input?.data?.data?.list ??
    input?.data?.data?.appointments ??
    input?.data?.data?.petServices ??
    input?.data?.data ??
    input?.data?.appointments ??
    input?.data?.petServices ??
    input?.data ??
    input?.list ??
    input?.appointments ??
    input?.petServices ??
    input?.result ??
    input;

  return Array.isArray(source) ? source : [];
}

export function readVetAppointments(): VetAppointment[] {
  try {
    const raw = localStorage.getItem(VET_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((appointment) => normalizeAppointment(appointment))
      .filter((appointment): appointment is VetAppointment => Boolean(appointment));
  } catch {
    return [];
  }
}

export function writeVetAppointments(list: VetAppointment[]): void {
  localStorage.setItem(VET_STORAGE_KEY, JSON.stringify(list));
}

function buildCreatePayload(input: VetAppointmentInput) {
  return {
    memberId: input.memberId,
    memberNick: input.memberNick,
    petName: input.petName,
    petType: input.petType,
    serviceType: input.serviceType,
    serviceLocation: input.serviceLocation,
    serviceAddress: input.serviceAddress,
    serviceDate: input.serviceDate,
    serviceTime: input.serviceTime,
    specialNote: input.specialNote,
  };
}

export async function createVetAppointment(
  input: VetAppointmentInput,
): Promise<VetAppointment> {
  const existing = readVetAppointments();
  const hasActiveSlot = existing.some(
    (appointment) =>
      appointment.status !== "DELETE" &&
      dateKey(appointment.serviceDate) === dateKey(input.serviceDate) &&
      appointment.serviceTime === input.serviceTime,
  );

  if (hasActiveSlot) {
    throw new Error("This time slot is already requested. Please choose another time.");
  }

  const result = await axios.post(VET_CREATE_URL, buildCreatePayload(input), {
    withCredentials: true,
  });

  const now = new Date().toISOString();
  const serverAppointment = normalizeAppointment(
    extractAppointmentResponse(result.data),
  );
  if (!serverAppointment) {
    throw new Error("The server returned an invalid veterinary appointment.");
  }
  const appointment: VetAppointment = {
    ...input,
    ...serverAppointment,
    _id: serverAppointment._id,
    status: serverAppointment.status,
    serviceStatus: serverAppointment.serviceStatus,
    servicePrice: input.servicePrice,
    originalServicePrice: input.servicePrice,
    createdAt: serverAppointment.createdAt ?? now,
    updatedAt: serverAppointment.updatedAt ?? now,
  };

  writeVetAppointments([appointment, ...existing]);
  return appointment;
}

export async function syncVetAppointmentsFromAdmin(
  memberId: string,
): Promise<VetAppointment[]> {
  const localAppointments = readVetAppointments();
  const localMineById = new Map(
    localAppointments
      .filter((appointment) => appointment.memberId === memberId)
      .map((appointment) => [appointment._id, appointment]),
  );

  const result = await axios.get(`${VET_PUBLIC_API_BASE}/my`, {
    withCredentials: true,
  });
  const serverAppointments = extractAppointmentList(result.data)
    .map((appointment) => {
      const appointmentId = appointment?._id ?? appointment?.id;
      return normalizeAppointment(
        appointment,
        appointmentId ? localMineById.get(String(appointmentId)) : undefined,
      );
    })
    .filter((appointment): appointment is VetAppointment => Boolean(appointment))
    .filter((appointment) => appointment.memberId === memberId);

  const merged = [
    ...localAppointments.filter((appointment) => appointment.memberId !== memberId),
    ...serverAppointments,
  ];

  if (JSON.stringify(merged) !== JSON.stringify(localAppointments)) {
    writeVetAppointments(merged);
  }

  return serverAppointments;
}

export function updateVetAppointmentStatus(
  appointmentId: string,
  status: VetAppointmentStatus,
  adminNote?: string,
): VetAppointment | null {
  let updatedAppointment: VetAppointment | null = null;
  const updated = readVetAppointments().map((appointment) => {
    if (appointment._id !== appointmentId) return appointment;

    updatedAppointment = {
      ...appointment,
      status,
      serviceStatus: status,
      adminNote: adminNote ?? appointment.adminNote,
      updatedAt: new Date().toISOString(),
    };
    return updatedAppointment;
  });

  writeVetAppointments(updated);
  return updatedAppointment;
}

export async function deleteVetAppointment(appointmentId: string): Promise<void> {
  const appointment = readVetAppointments().find(
    (item) => item._id === appointmentId,
  );
  if (!appointment) return;

  await axios.post(
    `${VET_PUBLIC_API_BASE}/cancel/${appointmentId}`,
    { memberId: appointment.memberId },
    { withCredentials: true },
  );
  writeVetAppointments(
    readVetAppointments().filter((appointment) => appointment._id !== appointmentId),
  );
}

export function getBookedVetSlots(serviceDate: string): string[] {
  if (!serviceDate) return [];

  const selectedDate = dateKey(serviceDate);

  return readVetAppointments()
    .filter(
      (appointment) =>
        !["DELETE", "CANCELLED"].includes(appointment.status) &&
        dateKey(appointment.serviceDate) === selectedDate,
    )
    .map((appointment) => appointment.serviceTime);
}
