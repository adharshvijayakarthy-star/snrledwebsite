"use client";

import { motion } from "framer-motion";
import { Lock, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface LocationSectionProps {
  city: string;
}

export function LocationSection({ city }: LocationSectionProps) {
  return (
    <section id="location" className="section-padding relative px-6">
      <div className="mx-auto max-w-[860px]">
        <SectionHeader
          eyebrow="Location"
          title="Hidden until you are confirmed."
          subtitle="The address is deliberately withheld. Approved registrations receive the venue through Instagram DM."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <GlassCard className="relative overflow-hidden p-8 text-center md:p-10">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full glass chrome-border teal-glow">
              <Lock className="h-10 w-10 text-chrome" strokeWidth={1.35} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Location hidden
            </p>
            <h3 className="mt-4 text-3xl font-bold text-highlight md:text-5xl">
              Undisclosed.
            </h3>
            <p className="mx-auto mt-5 max-w-md leading-7 text-silver">
              The venue is revealed only after your payment proof is verified.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Badge>{city}</Badge>
              <Badge variant="muted">DM reveal</Badge>
              <Badge variant="muted">No public map</Badge>
            </div>
            <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-3 rounded-[20px] bg-white/[0.035] px-5 py-4 text-left">
              <MapPin className="h-5 w-5 flex-shrink-0 text-accent" strokeWidth={1.5} />
              <p className="text-sm leading-6 text-silver">
                Exact address appears after confirmation. Keep your Instagram reachable.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
