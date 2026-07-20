import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const sizes = {
  sm: "h-8 px-4 text-sm gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-11 px-6 text-[15px] gap-2",
};

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(function PremiumButton(
  { variant = "primary", size = "lg", leftIcon, rightIcon, className, children, ...props },
  ref,
) {
  const isPrimary = variant === "primary";
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full font-medium tracking-tight",
        "transition-[transform,box-shadow,background,border-color] duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.98] will-change-transform",
        sizes[size],
        isPrimary
          ? [
              "text-background",
              "bg-[linear-gradient(180deg,oklch(1_0_0)_0%,oklch(0.92_0_0)_100%)]",
              "shadow-[0_1px_0_0_oklch(1_0_0/_60%)_inset,0_-1px_0_0_oklch(0_0_0/_15%)_inset,0_10px_24px_-8px_oklch(0_0_0/_45%),0_2px_6px_-2px_oklch(0_0_0/_35%)]",
              "hover:shadow-[0_1px_0_0_oklch(1_0_0/_70%)_inset,0_-1px_0_0_oklch(0_0_0/_20%)_inset,0_16px_32px_-10px_oklch(0_0_0/_55%),0_4px_10px_-2px_oklch(0_0_0/_40%)]",
              "hover:-translate-y-[1px]",
            ]
          : [
              "text-foreground/90 hover:text-foreground",
              "bg-[linear-gradient(180deg,oklch(0.22_0_0/_60%),oklch(0.16_0_0/_60%))]",
              "border border-border/80 backdrop-blur-xl",
              "shadow-[0_1px_0_0_oklch(1_0_0/_6%)_inset,0_8px_20px_-10px_oklch(0_0_0/_50%)]",
              "hover:border-foreground/30 hover:-translate-y-[1px]",
            ],
        className,
      )}
    >
      {/* top highlight */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-3 top-0 h-px rounded-full",
          isPrimary ? "bg-white/70" : "bg-white/10",
        )}
      />
      {/* shimmer sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span
          className={cn(
            "absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 transition-transform duration-[900ms] ease-out",
            "group-hover:translate-x-[420%]",
            isPrimary
              ? "bg-gradient-to-r from-transparent via-white/60 to-transparent"
              : "bg-gradient-to-r from-transparent via-white/15 to-transparent",
          )}
        />
      </span>
      {leftIcon && (
        <span className="relative z-10 inline-flex transition-transform duration-300 group-hover:-translate-x-[1px]">
          {leftIcon}
        </span>
      )}
      <span className="relative z-10">{children}</span>
      {rightIcon && (
        <span className="relative z-10 inline-flex transition-transform duration-300 group-hover:translate-x-[2px]">
          {rightIcon}
        </span>
      )}
    </button>
  );
});