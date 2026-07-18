import { cn } from "@/lib/utils";
import { useId } from "react";

/**
 * DevHub brand mark — bold isometric "D" cube.
 * Pure SVG so it stays crisp at any size and works as favicon source.
 */
export function BrandMark({ className, size = 24 }: { className?: string; size?: number }) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`dh-g-${gid}`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* rounded square container */}
      <rect x="1" y="1" width="30" height="30" rx="8" fill={`url(#dh-g-${gid})`} />
      {/* inner chisel "D" cut-out */}
      <path
        d="M10 9h7.2c4.3 0 7.3 2.9 7.3 7s-3 7-7.3 7H10V9zm3.6 3.4v7.2h3.4c2.3 0 3.9-1.5 3.9-3.6s-1.6-3.6-3.9-3.6h-3.4z"
        fill="hsl(var(--sidebar-background, var(--background)))"
      />
      {/* accent dot */}
      <circle cx="25.5" cy="24" r="1.6" fill="hsl(var(--sidebar-background, var(--background)))" />
    </svg>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <BrandMark size={26} className="text-foreground" />
      <span className="font-semibold tracking-tight text-[15px] leading-none">
        Dev<span className="text-muted-foreground">Hub</span>
      </span>
    </span>
  );
}