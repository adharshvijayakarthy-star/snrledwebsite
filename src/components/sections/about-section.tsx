"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";

interface AboutSectionProps {
  heroImageUrl: string;
}

export function AboutSection({ heroImageUrl }: AboutSectionProps) {
  return (
    <section id="about" className="section-padding relative px-6">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeader
            align="left"
            eyebrow="Curated access"
            title="Not another pool party."
            subtitle="SNRLED is built around scarcity, atmosphere, and a crowd that feels intentionally chosen."
            className="mb-8"
          />
          <div className="space-y-4 text-silver md:text-lg">
            <p>No public address.</p>
            <p>No casual entry.</p>
            <p>No inflated noise.</p>
            <p className="pt-4 text-highlight">Just one night, carefully held back.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Badge variant="muted">Verified registrations</Badge>
            <Badge variant="muted">Limited access</Badge>
            <Badge variant="muted">DM reveal</Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="group relative overflow-hidden rounded-[28px] glass chrome-border"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={heroImageUrl}
              alt="SNRLED pool experience"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/86 via-[#050505]/18 to-transparent" />
            <div className="water-reflection absolute inset-x-0 bottom-0 h-1/2" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                Venue hidden
              </p>
              <p className="mt-2 text-xl font-semibold text-highlight">
                Unlocked after confirmation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
