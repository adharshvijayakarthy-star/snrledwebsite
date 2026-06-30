"use client";

import { motion } from "framer-motion";
import { Wine, UtensilsCrossed, Target, Waves } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Wine,
    title: "Open Pour",
    description: "Unlimited jungle juice, served with restraint.",
  },
  {
    icon: UtensilsCrossed,
    title: "Night Menu",
    description: "Food on-site, paced for the evening.",
  },
  {
    icon: Target,
    title: "Pool Play",
    description: "Challenges and moments built into the night.",
  },
  {
    icon: Waves,
    title: "Water Access",
    description: "Night swimming under low cyan light.",
  },
];

const pills = ["200 Capacity", "Invite Only", "Venue Revealed After Confirmation", "Coimbatore"];

export function WhatsInsideSection({ city }: { city: string }) {
  const displayPills = pills.map((p) => (p === "Coimbatore" ? city : p));

  return (
    <section id="inside" className="section-padding relative px-6">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Inside access"
          title="Everything included. Nothing overexplained."
          subtitle="The details are simple on purpose. The atmosphere does the rest."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
            >
              <GlassCard hover className="h-full p-7">
                <div className="mb-8 flex items-center justify-between">
                  <feature.icon className="h-7 w-7 text-accent" strokeWidth={1.4} />
                  <span className="font-mono text-xs text-silver/45">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-highlight">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-silver">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {displayPills.map((pill) => (
            <Badge key={pill} variant="muted">
              {pill}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
