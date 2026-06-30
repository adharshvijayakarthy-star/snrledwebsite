"use client";

import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import type { EventConfig } from "@/types";
import { SectionHeader } from "@/components/ui/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { getPhaseLabel } from "@/lib/pricing";

interface PricingSectionProps {
  config: EventConfig;
  onRegister: () => void;
}

export function PricingSection({ config, onRegister }: PricingSectionProps) {
  const phase2Active = config.currentPhase === "phase2";

  const phases = [
    {
      key: "early_bird" as const,
      soldOut: true,
      locked: false,
      highlighted: false,
      note: "Closed",
    },
    {
      key: "phase1" as const,
      soldOut: phase2Active,
      locked: false,
      highlighted: config.currentPhase === "phase1",
      note: phase2Active ? "Sold out" : "Live now",
    },
    {
      key: "phase2" as const,
      soldOut: false,
      locked: !phase2Active,
      highlighted: phase2Active,
      note: phase2Active ? "Live now" : "Coming soon",
    },
    {
      key: "walkin" as const,
      soldOut: false,
      locked: false,
      highlighted: false,
      muted: true,
      note: "Not online",
    },
  ];

  return (
    <section id="pricing" className="section-padding relative px-6">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Phase based access"
          title="Secure the current phase."
          subtitle="The price rises as access tightens. Early Bird is gone. Phase 1 is live."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase, i) => {
            const tier = config.pricing[phase.key];
            const isWalkin = phase.key === "walkin";

            return (
              <motion.div
                key={phase.key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className={phase.highlighted ? "lg:scale-105" : ""}
              >
                <GlassCard
                  glow={phase.highlighted}
                  className={cn(
                    "relative h-full min-h-[320px] overflow-hidden p-7",
                    phase.soldOut && "opacity-55",
                    isWalkin && "opacity-70",
                    phase.highlighted && "bg-white/[0.07]"
                  )}
                >
                  {phase.highlighted && (
                    <motion.div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  {phase.soldOut && (
                    <div className="absolute -right-10 top-6 rotate-45 bg-danger/80 px-12 py-1 text-xs font-bold uppercase text-white">
                      Sold Out
                    </div>
                  )}

                  {phase.locked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050505]/70 px-6 text-center backdrop-blur-sm">
                      <Lock className="mb-3 h-8 w-8 text-silver" />
                      <p className="text-sm font-semibold text-highlight">Coming Soon</p>
                      <p className="mt-2 px-4 text-center text-xs text-silver">
                        Unlocks after Phase 1 sells out.
                      </p>
                    </div>
                  )}

                  <div className={phase.locked ? "blur-sm" : ""}>
                    <div className="flex min-h-9 items-center justify-between gap-3">
                      <h3
                        className={cn(
                          "text-sm font-semibold uppercase tracking-widest text-chrome",
                          phase.soldOut && "line-through decoration-danger/70 decoration-2"
                        )}
                      >
                        {getPhaseLabel(phase.key)}
                      </h3>
                      {phase.highlighted && <Badge variant="live">Live</Badge>}
                      {isWalkin && (
                        <Badge variant="muted">Subject to availability</Badge>
                      )}
                    </div>

                    <p className="mt-5 text-xs uppercase tracking-[0.2em] text-silver/60">
                      {phase.note}
                    </p>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-end justify-between">
                        <span className="text-sm text-silver">Stag</span>
                        <span
                          className={cn(
                            "text-2xl font-bold text-highlight",
                            phase.soldOut && "line-through decoration-danger/70 decoration-2"
                          )}
                        >
                          {formatCurrency(tier.stag)}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-sm text-silver">Doe</span>
                        <span
                          className={cn(
                            "text-2xl font-bold text-highlight",
                            phase.soldOut && "line-through decoration-danger/70 decoration-2"
                          )}
                        >
                          {formatCurrency(tier.doe)}
                        </span>
                      </div>
                    </div>

                    {phase.highlighted && !phase.locked && (
                      <Button className="mt-8 w-full" onClick={onRegister}>
                        Secure Your Spot
                      </Button>
                    )}

                    {phase.soldOut && (
                      <Button className="mt-8 w-full" disabled>
                        Sold Out
                      </Button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Urgency bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 rounded-[20px] glass p-6"
        >
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 text-silver">
              <ShieldCheck className="h-4 w-4 text-accent" strokeWidth={1.5} />
              Access meter
            </span>
            <span className="font-semibold text-accent">50% Reserved</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent/30 via-accent to-accent-hover teal-glow"
              initial={{ width: 0 }}
              whileInView={{ width: "50%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p className="mt-4 text-xs leading-5 text-silver/70">
            Displayed availability reflects public access. Final confirmation happens after payment verification.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
