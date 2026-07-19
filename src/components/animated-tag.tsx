"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Small animated tag chip inspired by vengenceui animated-button.
 * Keeps the existing tag size/typography (10px mono uppercase) and adds
 * a subtle shine sweep across the text + border.
 */
export function AnimatedTag({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "new" | "improvement" | "fix";
}) {
  const variantClass =
    variant === "new"
      ? "border-foreground/60 bg-foreground text-background"
      : variant === "improvement"
        ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
        : variant === "fix"
          ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
          : "border-border bg-muted/30 text-muted-foreground";
  return (
    <span
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider",
        variantClass,
        "[--shine:rgba(0,0,0,.66)] dark:[--shine:rgba(255,255,255,.66)]",
        className,
      )}
    >
      <motion.span
        className="relative z-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
        }}
        initial={{ ["--mask-x" as never]: "100%" } as never}
        animate={{ ["--mask-x" as never]: "-100%" } as never}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
          repeatDelay: 1.8,
        }}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-md p-px"
        style={{
          background:
            "linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
        initial={{ backgroundPosition: "100% 0", opacity: 0 }}
        animate={{ backgroundPosition: ["100% 0", "0% 0"], opacity: [0, 1, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1.8,
        }}
      />
    </span>
  );
}