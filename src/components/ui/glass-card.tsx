import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({
  className,
  children,
  hover = false,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass premium-outline rounded-[20px] p-6 transition-all duration-[450ms]",
        hover &&
          "hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065] hover:shadow-[0_22px_70px_rgba(0,0,0,0.38)]",
        glow && "teal-glow border-accent/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
