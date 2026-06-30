"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";

const experiences = [
  {
    title: "Private Current",
    description: "Low light. Open water. A room that knows why it is there.",
    badge: "Atmosphere",
  },
  {
    title: "Smoked Glass",
    description: "Chrome edges, quiet service, and enough shadow to feel hidden.",
    badge: "Design",
  },
  {
    title: "Curated Crowd",
    description: "Verified entries keep the night tight, social, and intentional.",
    badge: "Access",
  },
  {
    title: "After Confirmation",
    description: "The address stays private until your registration is approved.",
    badge: "Reveal",
  },
];

interface ExperienceSectionProps {
  heroImageUrl: string;
  galleryImageUrls: string[];
}

export function ExperienceSection({
  heroImageUrl,
  galleryImageUrls,
}: ExperienceSectionProps) {
  const items = experiences.map((e, i) => ({
    ...e,
    image: galleryImageUrls[i] ?? heroImageUrl,
  }));

  return (
    <section id="experience" className="section-padding relative px-6">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="The feeling"
          title="Scroll deeper into the night."
          subtitle="A restrained preview of the atmosphere. The real address stays off the page."
          align="center"
        />

        <div className="snap-gallery -mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-4 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group relative min-w-[82vw] snap-center overflow-hidden rounded-[28px] glass chrome-border sm:min-w-[520px] lg:min-w-[560px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/88 via-[#050505]/28 to-transparent" />
                <div className="water-reflection absolute inset-x-0 bottom-0 h-2/3 opacity-30" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  {item.badge}
                </p>
                <h3 className="text-2xl font-bold text-highlight md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-silver md:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
