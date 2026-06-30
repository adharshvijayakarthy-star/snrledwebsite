"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/animations/animated-background";

function SuccessContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id") || "SNRLED-00000";

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="relative mb-8">
        <motion.div
          aria-hidden
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.3, opacity: [0, 0.45, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 rounded-full bg-success/20"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success/20 teal-glow"
        >
          <Check className="h-12 w-12 text-success" strokeWidth={2} />
        </motion.div>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        Access requested
      </p>
      <h1 className="text-center text-4xl font-bold text-highlight md:text-5xl">
        Payment received.
      </h1>
      <p className="mt-5 max-w-md text-center leading-7 text-silver">
        We&apos;ll verify your registration and DM you the venue details.
      </p>

      <GlassCard className="mt-10 w-full max-w-md text-center">
        <p className="text-xs uppercase tracking-widest text-silver">Reference ID</p>
        <p className="mt-2 text-3xl font-bold text-accent">{registrationId}</p>
      </GlassCard>

      <div className="mt-6">
        <Badge variant="warning">Pending Verification</Badge>
      </div>

      <GlassCard className="mt-10 w-full max-w-md">
        <h3 className="font-semibold text-highlight">Next Steps</h3>
        <ol className="mt-4 space-y-3 text-sm text-silver">
          <li>1. Payment proof is reviewed.</li>
          <li>2. Your registration is approved.</li>
          <li>3. Venue details arrive by Instagram DM.</li>
        </ol>
      </GlassCard>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link href="/">
          <Button size="lg">Return Home</Button>
        </Link>
        <a href="https://instagram.com/snrled" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="lg">
            Instagram
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <AnimatedBackground />
      <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
        <SuccessContent />
      </Suspense>
    </>
  );
}
