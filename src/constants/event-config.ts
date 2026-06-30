import type { EventConfig } from "@/types";
import { formatEventDateLabel } from "@/lib/format-event-date";

/** Default event configuration - overridden by Supabase event_settings when available */
export const defaultEventConfig: EventConfig = {
  eventName: "SNRLED",
  tagline: "If you know, you know.",
  description: "The city's most exclusive pool experience.",
  headline: "The city's most exclusive pool experience.",
  subheadline: "If you know, you know.",
  eventDate: "2026-07-17",
  eventTime: "18:00",
  eventDateLabel: formatEventDateLabel("2026-07-17", "18:00"),
  countdownDate: "2026-07-17T18:00:00+05:30",
  city: "Coimbatore",
  registrationLimit: 200,
  phaseSwitchLimit: 60,
  currentPhase: "phase1",
  currentRegistrationCount: 0,
  maxPeoplePerRegistration: 5,
  registrationOpen: true,
  venueHidden: true,
  venueAddress: "Venue details revealed after confirmation",
  googleMapsLink: "#",
  upiId: "snrled@upi",
  qrImageUrl: "/placeholders/qr-placeholder.svg",
  logoUrl: "/branding/logo.jpg",
  heroImageUrl: "/gallery/snrled-party-05.jpeg",
  galleryImageUrls: [
    "/gallery/snrled-party-05.jpeg",
    "/gallery/snrled-party-01.jpeg",
    "/gallery/snrled-party-02.jpeg",
    "/gallery/snrled-party-03.jpeg",
    "/gallery/snrled-party-04.jpeg",
  ],
  instagramUrl: "https://instagram.com/snrled",
  pricing: {
    early_bird: { stag: 1500, doe: 1000, enabled: false, label: "Early Bird" },
    phase1: { stag: 1900, doe: 1400, enabled: true, label: "Phase 1" },
    phase2: { stag: 2400, doe: 1900, enabled: false, label: "Phase 2" },
    walkin: { stag: 3000, doe: 2000, enabled: false, label: "Walk-In" },
  },
};
