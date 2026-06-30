"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "@/components/ui/brand-logo";

interface LoadingScreenProps {
  onComplete: () => void;
  logoUrl: string;
}

export function LoadingScreen({ onComplete, logoUrl }: LoadingScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-x-[-20%] top-1/2 h-40 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(62,231,229,0.14),transparent_64%)] blur-3xl"
        animate={{ opacity: [0.14, 0.34, 0.14], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="chrome-shine relative"
      >
        <BrandLogo src={logoUrl} size="loading" priority />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-xs uppercase tracking-[0.22em] text-silver/60"
      >
        Invite only
      </motion.p>

      <div className="absolute bottom-16 left-1/2 w-48 -translate-x-1/2 md:w-64">
        <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-accent teal-glow"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={onComplete}
          />
        </div>
      </div>
    </motion.div>
  );
}
