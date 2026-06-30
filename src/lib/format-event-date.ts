import { format, parseISO } from "date-fns";

/** Format event date label on the server to avoid hydration mismatches. */
export function formatEventDateLabel(eventDate: string, eventTime: string): string {
  const iso = eventDate.includes("T")
    ? eventDate
    : `${eventDate}T${eventTime || "18:00"}:00+05:30`;

  const date = parseISO(iso);
  const [hours, minutes] = (eventTime || "18:00").split(":").map(Number);
  const hour12 = hours % 12 || 12;
  const meridiem = hours >= 12 ? "PM" : "AM";
  const timeLabel = minutes ? `${hour12}:${String(minutes).padStart(2, "0")} ${meridiem}` : `${hour12} ${meridiem}`;

  return `${format(date, "EEEE")} • ${format(date, "MMMM d")} • ${timeLabel}`;
}
