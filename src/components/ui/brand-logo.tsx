import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 1024;

export type BrandLogoSize = "nav" | "hero" | "loading" | "cta" | "footer" | "wizard";

const sizeClasses: Record<BrandLogoSize, string> = {
  nav: "h-7 w-auto",
  hero: "w-48 md:w-64 lg:w-72",
  loading: "w-40 md:w-48",
  cta: "w-28 md:w-32",
  footer: "w-24",
  wizard: "w-28",
};

const sizeHints: Record<BrandLogoSize, string> = {
  nav: "80px",
  hero: "288px",
  loading: "192px",
  cta: "128px",
  footer: "96px",
  wizard: "112px",
};

interface BrandLogoProps {
  src?: string;
  alt?: string;
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  src = "/branding/logo.jpg",
  alt = "SNRLED",
  size = "hero",
  className,
  priority = false,
}: BrandLogoProps) {
  const usesHeight = size === "nav";

  return (
    <Image
      src={src}
      alt={alt}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      sizes={sizeHints[size]}
      className={cn(sizeClasses[size], className)}
      style={usesHeight ? { width: "auto" } : { height: "auto" }}
    />
  );
}
