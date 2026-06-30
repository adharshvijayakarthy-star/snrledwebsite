"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label.toLowerCase().replace(/\s/g, "-");
    const hasValue = props.value !== undefined && String(props.value).length > 0;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "peer w-full rounded-2xl glass px-4 pb-3 pt-6 text-highlight placeholder-transparent transition-all duration-[250ms] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:shadow-[0_0_20px_rgba(62,231,229,0.15)] disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-danger/50 ring-2 ring-danger/30 animate-shake",
            success && "border-success/50 ring-2 ring-success/30",
            className
          )}
          placeholder={label}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-4 text-silver transition-all duration-[250ms]",
            focused || hasValue || props.defaultValue
              ? "top-2 text-xs text-accent"
              : "top-1/2 -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </label>
        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
