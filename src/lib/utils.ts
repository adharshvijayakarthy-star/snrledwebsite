import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatRegistrationId(num: number): string {
  return `SNRLED-${String(num).padStart(5, "0")}`;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

export function normalizeInstagram(username: string): string {
  return username.replace(/^@+/, "").trim().toLowerCase();
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>'"]/g, "")
    .trim();
}

export function generateFileName(registrationId: string, ext: string): string {
  const cleanExt = ext.replace(".", "").toLowerCase();
  return `payment_${registrationId}.${cleanExt}`;
}
