import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";

interface FooterProps {
  logoUrl: string;
  instagramUrl: string;
}

export function Footer({ logoUrl, instagramUrl }: FooterProps) {
  return (
    <footer className="relative bg-[#050505] px-6 py-12">
      <div className="luxury-divider absolute left-1/2 top-0 w-[min(960px,calc(100%-48px))] -translate-x-1/2" />
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 md:flex-row md:justify-between">
        <BrandLogo src={logoUrl} size="footer" className="opacity-80" />
        <div className="flex flex-wrap justify-center gap-6 text-sm text-silver">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-highlight"
          >
            Instagram
          </a>
          <Link href="/privacy" className="transition-colors hover:text-highlight">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-highlight">
            Terms
          </Link>
          <Link href="/refund" className="transition-colors hover:text-highlight">
            Refund Policy
          </Link>
        </div>
        <p className="text-xs text-silver/60">SNRLED 2026</p>
      </div>
    </footer>
  );
}
