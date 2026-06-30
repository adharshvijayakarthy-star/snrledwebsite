"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#pricing", label: "Pricing" },
  { href: "#location", label: "Location" },
  { href: "#faq", label: "FAQ" },
];

interface NavigationProps {
  logoUrl: string;
  onRegister: () => void;
}

export function Navigation({ logoUrl, onRegister }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.45 }}
      className={cn(
        "fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-5xl -translate-x-1/2 transition-all duration-[450ms]",
        scrolled ? "top-2" : "top-4"
      )}
    >
      <nav
        className={cn(
          "flex items-center justify-between rounded-[32px] px-3 py-2 transition-all duration-[450ms] md:px-6",
          scrolled ? "glass-strong py-2" : "glass"
        )}
      >
        <Link href="/" className="flex-shrink-0" aria-label="SNRLED home">
          <BrandLogo
            src={logoUrl}
            size="nav"
            className={cn("transition-transform duration-[450ms]", scrolled && "scale-90")}
          />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-wider text-silver transition-colors hover:text-highlight"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onRegister} className="hidden text-xs sm:inline-flex">
            Secure Your Spot
          </Button>
          <Button size="sm" onClick={onRegister} className="text-[10px] sm:hidden">
            Secure
          </Button>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="glass flex h-10 w-10 items-center justify-center rounded-[16px] text-chrome transition-colors hover:text-highlight md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 overflow-hidden rounded-[28px] glass-strong p-2 md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-[20px] px-4 py-3 text-xs uppercase tracking-[0.16em] text-silver transition-colors hover:bg-white/5 hover:text-highlight"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
