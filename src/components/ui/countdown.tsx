"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInSeconds } from "date-fns";

interface CountdownProps {
  targetDate: string;
  eventLabel?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const PLACEHOLDER: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calculateTimeLeft(targetDate: string): TimeLeft {
  const total = Math.max(0, differenceInSeconds(new Date(targetDate), new Date()));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function CountdownUnit({
  value,
  label,
  mounted,
}: {
  value: number;
  label: string;
  mounted: boolean;
}) {
  const display = mounted ? String(value).padStart(2, "0") : "--";

  return (
    <div className="glass chrome-border flex min-w-[64px] flex-col items-center rounded-2xl px-3 py-4 teal-glow sm:min-w-[76px] md:min-w-[88px] md:px-4 md:py-5">
      {mounted ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-2xl font-bold text-highlight md:text-4xl"
            suppressHydrationWarning
          >
            {display}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="font-mono text-2xl font-bold text-highlight md:text-4xl" aria-hidden>
          {display}
        </span>
      )}
      <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-silver md:text-xs">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ targetDate, eventLabel }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(PLACEHOLDER);

  useEffect(() => {
    const start = window.setTimeout(() => {
      setMounted(true);
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 0);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => {
      window.clearTimeout(start);
      clearInterval(timer);
    };
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center gap-4">
      {eventLabel && (
        <p className="text-sm tracking-wide text-silver md:text-base">{eventLabel}</p>
      )}
      <div className="grid grid-cols-4 gap-2 md:gap-3" aria-live="polite" aria-atomic="true">
        <CountdownUnit value={timeLeft.days} label="Days" mounted={mounted} />
        <CountdownUnit value={timeLeft.hours} label="Hours" mounted={mounted} />
        <CountdownUnit value={timeLeft.minutes} label="Min" mounted={mounted} />
        <CountdownUnit value={timeLeft.seconds} label="Sec" mounted={mounted} />
      </div>
      <p className="text-center text-xs text-silver/70">
        Registrations close when capacity is reached.
      </p>
    </div>
  );
}
