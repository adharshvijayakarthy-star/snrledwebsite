"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What happens after payment?",
    a: "We verify your payment manually. Once confirmed, you'll receive venue details via Instagram DM.",
  },
  {
    q: "How will I receive the venue?",
    a: "Venue location is shared exclusively through Instagram DM after verification.",
  },
  {
    q: "Can I get a refund?",
    a: "All registrations are final. No refunds.",
  },
  {
    q: "Can I transfer my registration?",
    a: "Registrations are non-transferable. Each spot is verified individually.",
  },
  {
    q: "What should I bring?",
    a: "Valid ID, swimwear, and your confirmation reference. Details shared upon verification.",
  },
  {
    q: "What is the dress code?",
    a: "Pool party attire. Premium casual. Dress to impress.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative px-6">
      <div className="mx-auto max-w-[720px]">
        <SectionHeader
          eyebrow="Before access"
          title="Questions, answered quietly."
          subtitle="Everything important before you commit. Nothing more than needed."
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="overflow-hidden rounded-[20px] glass">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                aria-expanded={openIndex === i}
              >
                <span className="pr-4 font-medium text-highlight">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 flex-shrink-0 text-silver transition-transform duration-[250ms]",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="px-6 pb-6 leading-7 text-silver">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
