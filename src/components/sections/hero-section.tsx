"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { EventConfig } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Countdown } from "@/components/ui/countdown";

interface HeroSectionProps {
  config: EventConfig;
  onRegister: () => void;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
});

export function HeroSection({ config, onRegister }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28">
      <div className="absolute inset-0 z-0">
        <Image
          src={config.heroImageUrl}
          alt=""
          fill
          priority
          className="object-cover opacity-[0.34] saturate-[0.78]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.12),rgba(5,5,5,0.82)_72%,#050505_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/74 via-[#050505]/38 to-[#050505]" />
        <motion.div
          aria-hidden
          className="water-reflection absolute inset-x-0 bottom-0 h-48"
          animate={{ x: [0, 44], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        <motion.div {...fadeUp(0.2)} className="chrome-shine">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <BrandLogo
              src={config.logoUrl}
              alt={config.eventName}
              size="hero"
              priority
            />
          </motion.div>
        </motion.div>

        <motion.h1
          {...fadeUp(0.4)}
          className="chrome-text mt-10 max-w-3xl text-3xl font-bold leading-[1.08] text-highlight md:text-5xl lg:text-6xl"
        >
          {config.headline}
        </motion.h1>

        <motion.p
          {...fadeUp(0.5)}
          className="mt-5 text-sm font-medium uppercase tracking-[0.22em] text-silver md:text-base"
        >
          {config.subheadline}
        </motion.p>

        <motion.div {...fadeUp(0.65)} className="mt-10">
          <Countdown
            targetDate={config.countdownDate}
            eventLabel={config.eventDateLabel}
          />
        </motion.div>

        <motion.div
          {...fadeUp(0.78)}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Badge variant="live">Invite Only</Badge>
          <Badge variant="muted">Venue Hidden</Badge>
          <Badge variant="muted">Phase 1 Live</Badge>
        </motion.div>

        <motion.div {...fadeUp(0.9)} className="mt-10">
          <Button size="lg" onClick={onRegister}>
            Secure Your Spot
          </Button>
        </motion.div>

        <motion.p
          {...fadeUp(1)}
          className="mt-5 max-w-md text-xs leading-6 text-silver/70"
        >
          Venue details unlock after payment confirmation.
        </motion.p>

        <motion.div
          {...fadeUp(1.1)}
          className="mt-14 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="h-8 w-5 rounded-full border border-white/20"
          >
            <motion.div
              animate={{ y: [4, 12, 4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="mx-auto mt-1 h-2 w-0.5 rounded-full bg-accent/60"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="luxury-divider absolute bottom-0 left-1/2 z-10 w-[min(720px,calc(100%-48px))] -translate-x-1/2" />
    </section>
  );
}
