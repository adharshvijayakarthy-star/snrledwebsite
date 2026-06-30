"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const PARTICLE_COUNT_DESKTOP = 18;
const PARTICLE_COUNT_MOBILE = 8;

export function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 5) % 100}%`,
        top: `${(i * 23 + 10) % 100}%`,
        duration: 4 + (i % 3),
        delay: i * 0.3,
      })),
    [particleCount]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#050505]" />

      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute inset-0 opacity-45 will-change-[background]"
            animate={{
              background: [
                "radial-gradient(ellipse at 18% 48%, rgba(62,231,229,0.09) 0%, transparent 44%)",
                "radial-gradient(ellipse at 82% 42%, rgba(216,216,216,0.055) 0%, transparent 42%)",
                "radial-gradient(ellipse at 50% 82%, rgba(62,231,229,0.08) 0%, transparent 46%)",
                "radial-gradient(ellipse at 18% 48%, rgba(62,231,229,0.09) 0%, transparent 44%)",
              ],
            }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="absolute inset-x-[-20%] top-[-18%] h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_62%)] opacity-30 blur-3xl"
            animate={{ x: ["-4%", "4%", "-4%"], opacity: [0.18, 0.32, 0.18] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.018] to-transparent" />

          <motion.div
            className="water-reflection absolute bottom-[-10%] left-[-10%] right-[-10%] h-2/3 will-change-transform"
            animate={{ x: [0, 48], y: [0, -12, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute h-0.5 w-0.5 rounded-full bg-accent/35 will-change-transform"
              style={{ left: particle.left, top: particle.top }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_96%)] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.72)_100%)]" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
