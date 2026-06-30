"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  success?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "glass chrome-border teal-glow chrome-shine text-highlight hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_0_34px_rgba(62,231,229,0.28)]",
  secondary:
    "bg-transparent chrome-border text-chrome hover:-translate-y-0.5 hover:bg-white/5 hover:text-highlight",
  danger: "bg-danger/20 border border-danger/40 text-danger hover:bg-danger/30",
  success:
    "bg-gradient-to-r from-accent/25 to-accent/10 border border-accent/45 text-accent teal-glow hover:-translate-y-0.5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs min-h-[40px]",
  md: "px-6 py-3 text-sm min-h-[48px]",
  lg: "px-8 py-4 text-sm min-h-[56px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      success,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-[18px] font-semibold uppercase tracking-[0.12em] transition-all duration-[250ms] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
          variants[variant],
          sizes[size],
          success && "border-success/50 text-success",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            Processing...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
