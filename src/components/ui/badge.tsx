import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "live" | "muted" | "warning";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest glass chrome-border",
        variant === "live" && "border-accent/40 text-accent teal-glow",
        variant === "muted" && "text-silver opacity-70",
        variant === "warning" && "border-warning/40 text-warning",
        className
      )}
    >
      {children}
    </span>
  );
}
