import { z } from "zod";

export const personalDetailsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  instagram: z
    .string()
    .min(1, "Instagram username is required")
    .max(30, "Username is too long")
    .regex(/^[a-zA-Z0-9._]+$/, "Invalid Instagram username"),
});

export const registrationDetailsSchema = z.object({
  gender: z.enum(["stag", "doe"]),
  peopleCount: z.number().min(1).max(10),
});

export const fullRegistrationSchema = personalDetailsSchema.merge(
  registrationDetailsSchema
);

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const eventSettingsSchema = z.object({
  event_name: z.string().min(1),
  tagline: z.string(),
  description: z.string(),
  event_date: z.string(),
  event_time: z.string(),
  countdown_date: z.string(),
  registration_limit: z.number().min(1),
  phase_switch_limit: z.number().min(1),
  current_phase: z.enum(["early_bird", "phase1", "phase2", "walkin"]),
  venue_hidden: z.boolean(),
  venue_address: z.string(),
  google_maps: z.string(),
  upi_placeholder: z.string(),
  qr_image: z.string(),
  registration_open: z.boolean(),
});

export type PersonalDetailsInput = z.infer<typeof personalDetailsSchema>;
export type RegistrationDetailsInput = z.infer<typeof registrationDetailsSchema>;
export type FullRegistrationInput = z.infer<typeof fullRegistrationSchema>;
