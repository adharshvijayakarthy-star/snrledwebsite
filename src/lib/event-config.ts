import { createClient } from "@supabase/supabase-js";
import type { EventConfig } from "@/types";
import { defaultEventConfig } from "@/constants/event-config";
import { getActivePhase } from "@/lib/pricing";
import { formatEventDateLabel } from "@/lib/format-event-date";

function mapDbToConfig(
  row: Record<string, unknown>,
  galleryImageUrls: string[] = defaultEventConfig.galleryImageUrls
): EventConfig {
  const count = (row.current_registration_count as number) ?? 0;
  const switchLimit = (row.phase_switch_limit as number) ?? 60;
  const dbPhase = row.current_phase as EventConfig["currentPhase"];

  return {
    eventName: (row.event_name as string) ?? defaultEventConfig.eventName,
    tagline: (row.tagline as string) ?? defaultEventConfig.tagline,
    description: (row.description as string) ?? defaultEventConfig.description,
    headline: (row.description as string) ?? defaultEventConfig.headline,
    subheadline: (row.tagline as string) ?? defaultEventConfig.subheadline,
    eventDate: (row.event_date as string) ?? defaultEventConfig.eventDate,
    eventTime: (row.event_time as string) ?? defaultEventConfig.eventTime,
    eventDateLabel: formatEventDateLabel(
      (row.event_date as string) ?? defaultEventConfig.eventDate,
      (row.event_time as string) ?? defaultEventConfig.eventTime
    ),
    countdownDate: (row.countdown_date as string) ?? defaultEventConfig.countdownDate,
    city: (row.city as string) ?? defaultEventConfig.city,
    registrationLimit: (row.registration_limit as number) ?? defaultEventConfig.registrationLimit,
    phaseSwitchLimit: switchLimit,
    currentPhase: getActivePhase(count, switchLimit, dbPhase),
    currentRegistrationCount: count,
    maxPeoplePerRegistration: (row.max_people_per_registration as number) ?? 5,
    registrationOpen: (row.registration_open as boolean) ?? true,
    venueHidden: (row.venue_hidden as boolean) ?? true,
    venueAddress: (row.venue_address as string) ?? defaultEventConfig.venueAddress,
    googleMapsLink: (row.google_maps as string) ?? defaultEventConfig.googleMapsLink,
    upiId: (row.upi_placeholder as string) ?? defaultEventConfig.upiId,
    qrImageUrl: (() => {
      const rawQr = row.qr_image as string | undefined;
      if (!rawQr || rawQr.includes("qr-placeholder")) {
        return defaultEventConfig.qrImageUrl;
      }
      return rawQr;
    })(),
    logoUrl: (row.logo_url as string) ?? defaultEventConfig.logoUrl,
    heroImageUrl: (row.hero_image_url as string) ?? defaultEventConfig.heroImageUrl,
    galleryImageUrls,
    instagramUrl: (row.instagram_url as string) ?? defaultEventConfig.instagramUrl,
    pricing: {
      early_bird: {
        stag: (row.early_bird_stag as number) ?? 1500,
        doe: (row.early_bird_doe as number) ?? 1000,
        enabled: false,
        label: "Early Bird",
      },
      phase1: {
        stag: (row.phase1_stag as number) ?? 1900,
        doe: (row.phase1_doe as number) ?? 1400,
        enabled: true,
        label: "Phase 1",
      },
      phase2: {
        stag: (row.phase2_stag as number) ?? 2400,
        doe: (row.phase2_doe as number) ?? 1900,
        enabled: getActivePhase(count, switchLimit) === "phase2",
        label: "Phase 2",
      },
      walkin: {
        stag: (row.walkin_stag as number) ?? 3000,
        doe: (row.walkin_doe as number) ?? 2000,
        enabled: false,
        label: "Walk-In",
      },
    },
  };
}

export async function getEventConfig(): Promise<EventConfig> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (!process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    return defaultEventConfig;
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const [{ data, error }, { data: gallery }] = await Promise.all([
      supabase
        .from("event_settings")
        .select("*")
        .eq("event_active", true)
        .single(),
      supabase
        .from("gallery_images")
        .select("image_url")
        .eq("active", true)
        .order("display_order", { ascending: true }),
    ]);

    if (error || !data) return defaultEventConfig;
    const galleryImageUrls =
      gallery?.map((image) => image.image_url).filter(Boolean) ??
      defaultEventConfig.galleryImageUrls;
    return mapDbToConfig(data, galleryImageUrls);
  } catch {
    return defaultEventConfig;
  }
}

export function getPublicEventConfig(config: EventConfig) {
  const { venueAddress, googleMapsLink, ...publicConfig } = config;
  return {
    ...publicConfig,
    venueAddress: config.venueHidden ? "Undisclosed" : venueAddress,
    googleMapsLink: config.venueHidden ? null : googleMapsLink,
  };
}
