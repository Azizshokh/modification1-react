import axios from "axios";

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
const VET_STORE_EVENT = "vetAppointments:changed";
const VET_STORE_CHANNEL = "vet-appointments";
const VET_API_BASE = "http://localhost:4001/admin/pet-service";
const VET_PUBLIC_API_BASE = "http://localhost:4001/pet-service";
const VET_CREATE_URL = "http://localhost:4001/admin/pet-service/create";
const VET_STATUS_REFRESH_MS = 2000;
const SERVICE_PRICES: Record<string, number> = {
  HOME_TO_HOME: 40,
  CLINIC_TO_CLINIC: 25,
  ONLINE_CONSULTATION: 15,
  GROOMING: 30,
};

let channel: BroadcastChannel | null = null;

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

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return null;
  }

  if (!channel) channel = new BroadcastChannel(VET_STORE_CHANNEL);
  return channel;
}

function normalizeStatus(input: any): VetAppointmentStatus {
  const rawStatus = String(
    input?.status ??
      input?.serviceStatus ??
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

async function fetchVetAppointmentById(
  appointment: VetAppointment,
): Promise<VetAppointment | null> {
  const endpoints = [
    `${VET_PUBLIC_API_BASE}/${appointment._id}`,
    `${VET_PUBLIC_API_BASE}/detail/${appointment._id}`,
    `${VET_PUBLIC_API_BASE}/get/${appointment._id}`,
    `${VET_API_BASE}/${appointment._id}`,
    `${VET_API_BASE}/detail/${appointment._id}`,
    `${VET_API_BASE}/get/${appointment._id}`,
  ];

  for (const url of endpoints) {
    try {
      const result = await axios.get(url, { withCredentials: true });
      const normalized = normalizeAppointment(
        extractAppointmentResponse(result.data),
        appointment,
      );
      if (normalized) return normalized;
    } catch {
      // Try the next common detail endpoint.
    }
  }

  return null;
}

function notifyVetAppointmentsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VET_STORE_EVENT));
  getChannel()?.postMessage({ type: VET_STORE_EVENT, at: Date.now() });
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
  notifyVetAppointmentsChanged();
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
  const appointment: VetAppointment = {
    ...input,
    ...(serverAppointment ?? {}),
    _id:
      serverAppointment?._id ??
      `vet_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: serverAppointment?.status ?? "PAUSE",
    serviceStatus: serverAppointment?.serviceStatus ?? "PAUSE",
    servicePrice: input.servicePrice,
    originalServicePrice: input.servicePrice,
    createdAt: serverAppointment?.createdAt ?? now,
    updatedAt: serverAppointment?.updatedAt ?? now,
  };

  writeVetAppointments([appointment, ...existing]);
  return appointment;
}

export async function syncVetAppointmentsFromAdmin(
  memberId: string,
): Promise<VetAppointment[]> {
  const localAppointments = readVetAppointments();
  const localMine = localAppointments.filter(
    (appointment) => appointment.memberId === memberId,
  );

  let serverAppointments: VetAppointment[] = [];
  const listUrls = [
    `${VET_PUBLIC_API_BASE}/all`,
    `${VET_PUBLIC_API_BASE}`,
    `${VET_PUBLIC_API_BASE}/my`,
    `${VET_API_BASE}/all`,
    VET_API_BASE,
  ];

  for (const url of listUrls) {
    try {
      const result = await axios.get(url, {
        params: { memberId },
        withCredentials: true,
      });
      const localById = new Map(
        localMine.map((appointment) => [appointment._id, appointment]),
      );

      serverAppointments = extractAppointmentList(result.data)
        .map((appointment) => {
          const appointmentId =
            appointment?._id ??
            appointment?.id ??
            appointment?.petServiceId ??
            appointment?.appointmentId;
          return normalizeAppointment(
            appointment,
            appointmentId ? localById.get(String(appointmentId)) : undefined,
          );
        })
        .filter((appointment): appointment is VetAppointment => Boolean(appointment))
        .filter((appointment) => appointment.memberId === memberId);

      if (serverAppointments.length > 0) break;
    } catch {
      serverAppointments = [];
    }
  }

  const serverById = new Map(
    serverAppointments.map((appointment) => [appointment._id, appointment]),
  );
  const missingLocalMatches = localMine.filter(
    (appointment) => !serverById.has(appointment._id),
  );

  const detailAppointments = (
    await Promise.all(missingLocalMatches.map(fetchVetAppointmentById))
  ).filter((appointment): appointment is VetAppointment => Boolean(appointment));
  const syncedAppointments = [...serverAppointments, ...detailAppointments];

  if (syncedAppointments.length === 0) {
    return localMine;
  }

  const syncedById = new Map(
    syncedAppointments.map((appointment) => [appointment._id, appointment]),
  );
  const merged = [
    ...localAppointments
      .filter((appointment) => appointment.memberId !== memberId)
      .filter((appointment) => !syncedById.has(appointment._id)),
    ...syncedAppointments,
    ...localAppointments.filter(
      (appointment) =>
        appointment.memberId === memberId && !syncedById.has(appointment._id),
    ),
  ];

  if (JSON.stringify(merged) !== JSON.stringify(localAppointments)) {
    writeVetAppointments(merged);
  }

  return syncedAppointments;
}

export function startVetAppointmentStatusSync(
  memberId: string,
  onSynced?: () => void,
  intervalMs: number = VET_STATUS_REFRESH_MS,
): () => void {
  let stopped = false;

  const sync = async () => {
    try {
      await syncVetAppointmentsFromAdmin(memberId);
      if (!stopped) onSynced?.();
    } catch (err) {
      console.info("[vet] status sync skipped:", err);
    }
  };

  sync().then();
  const interval = window.setInterval(sync, intervalMs);

  return () => {
    stopped = true;
    window.clearInterval(interval);
  };
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

export function deleteVetAppointment(appointmentId: string): void {
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

export function subscribeVetAppointments(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === VET_STORAGE_KEY) callback();
  };
  const onLocalChange = () => callback();
  const broadcast = getChannel();
  const onMessage = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener(VET_STORE_EVENT, onLocalChange);
  broadcast?.addEventListener("message", onMessage);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(VET_STORE_EVENT, onLocalChange);
    broadcast?.removeEventListener("message", onMessage);
  };
}
