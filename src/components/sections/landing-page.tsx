"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { EventConfig } from "@/types";
import { AnimatedBackground } from "@/components/animations/animated-background";
import { LoadingScreen } from "@/components/animations/loading-screen";
import { Navigation } from "@/components/navigation/main-nav";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { WhatsInsideSection } from "@/components/sections/whats-inside-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { LocationSection } from "@/components/sections/location-section";
import { FAQSection } from "@/components/sections/faq-section";
import { FinalCTASection } from "@/components/sections/final-cta-section";
import { Footer } from "@/components/sections/footer";
import { CursorGlow } from "@/components/animations/cursor-glow";

const RegistrationWizard = dynamic(
  () =>
    import("@/components/forms/registration-wizard").then(
      (mod) => mod.RegistrationWizard
    ),
  { ssr: false }
);

interface LandingPageProps {
  config: EventConfig;
}

export function LandingPage({ config }: LandingPageProps) {
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const openRegistration = useCallback(() => {
    setShowRegistration(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeRegistration = useCallback(() => {
    setShowRegistration(false);
    document.body.style.overflow = "";
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingScreen
            onComplete={handleLoadingComplete}
            logoUrl={config.logoUrl}
          />
        )}
      </AnimatePresence>

      <AnimatedBackground />
      <CursorGlow />
      <Navigation logoUrl={config.logoUrl} onRegister={openRegistration} />

      <main className="relative z-10">
        <HeroSection config={config} onRegister={openRegistration} />
        <AboutSection heroImageUrl={config.heroImageUrl} />
        <WhatsInsideSection city={config.city} />
        <ExperienceSection
          heroImageUrl={config.heroImageUrl}
          galleryImageUrls={config.galleryImageUrls}
        />
        <PricingSection config={config} onRegister={openRegistration} />
        <LocationSection city={config.city} />
        <FAQSection />
        <FinalCTASection logoUrl={config.logoUrl} onRegister={openRegistration} />
        <Footer logoUrl={config.logoUrl} instagramUrl={config.instagramUrl} />
      </main>

      <AnimatePresence>
        {showRegistration && (
          <RegistrationWizard config={config} onClose={closeRegistration} />
        )}
      </AnimatePresence>
    </>
  );
}
