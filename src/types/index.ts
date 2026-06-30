export type Gender = "stag" | "doe";
export type PricingPhase = "early_bird" | "phase1" | "phase2" | "walkin";
export type PaymentStatus = "pending" | "verified" | "rejected";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type AdminRole = "owner" | "admin" | "moderator";

export interface PricingTier {
  stag: number;
  doe: number;
  enabled: boolean;
  label: string;
}

export interface EventConfig {
  eventName: string;
  tagline: string;
  description: string;
  headline: string;
  subheadline: string;
  eventDate: string;
  eventTime: string;
  eventDateLabel: string;
  countdownDate: string;
  city: string;
  registrationLimit: number;
  phaseSwitchLimit: number;
  currentPhase: PricingPhase;
  currentRegistrationCount: number;
  maxPeoplePerRegistration: number;
  registrationOpen: boolean;
  venueHidden: boolean;
  venueAddress: string;
  googleMapsLink: string;
  upiId: string;
  qrImageUrl: string;
  logoUrl: string;
  heroImageUrl: string;
  galleryImageUrls: string[];
  instagramUrl: string;
  pricing: {
    early_bird: PricingTier;
    phase1: PricingTier;
    phase2: PricingTier;
    walkin: PricingTier;
  };
}

export interface Registration {
  id: string;
  registration_id: string;
  name: string;
  phone: string;
  instagram: string;
  gender: Gender;
  people_count: number;
  pricing_phase: PricingPhase;
  amount: number;
  payment_status: PaymentStatus;
  verification_status: VerificationStatus;
  verification_notes: string | null;
  screenshot_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegistrationFormData {
  name: string;
  phone: string;
  instagram: string;
  gender: Gender;
  peopleCount: number;
  amount: number;
  pricingPhase: PricingPhase;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  display_order: number;
  title: string | null;
  active: boolean;
}

export interface ActivityLog {
  id: string;
  admin_id: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  description: string;
  created_at: string;
}

export interface DashboardStats {
  totalRegistrations: number;
  verified: number;
  pending: number;
  rejected: number;
  maleCount: number;
  femaleCount: number;
  revenue: number;
  currentPhase: PricingPhase;
  remainingUntilPhase2: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}
