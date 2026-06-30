"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";

interface FinalCTASectionProps {
  logoUrl: string;
  onRegister: () => void;
}

export function FinalCTASection({ logoUrl, onRegister }: FinalCTASectionProps) {
  return (
    <section className="section-padding relative overflow-hidden px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.025] to-[#050505]" />
      <div className="water-reflection absolute inset-x-0 bottom-0 h-64" />
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <BrandLogo src={logoUrl} size="cta" className="mb-8 opacity-45" />
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Final access
        </p>
        <h2 className="text-3xl font-bold text-highlight md:text-5xl">
          Earn your place inside.
        </h2>
        <p className="mt-5 max-w-md leading-7 text-silver">
          Secure the current phase before access moves forward.
        </p>
        <Button size="lg" className="mt-10 teal-glow-strong" onClick={onRegister}>
          Secure Your Spot
        </Button>
      </motion.div>
    </section>
  );
}
