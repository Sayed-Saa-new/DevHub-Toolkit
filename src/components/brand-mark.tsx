import { cn } from "@/lib/utils";
import logoAsset from "@/assets/devhub-logo.png.asset.json";

/**
 * DevHub brand mark — 3D embossed "D." tile.
 */
export function BrandMark({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <img
      src={logoAsset.url}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={cn("shrink-0 rounded-[22%] select-none", className)}
      draggable={false}
    />
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