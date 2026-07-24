"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * WobbleCard — monochrome, Aceternity-style 3D tilt card.
 * Cursor move gently translates the card; inner content shifts opposite for parallax.
 * Uses a subtle SVG noise texture and a slow radial spotlight for premium depth.
 */
export function WobbleCard({
  children,
  containerClassName,
  className,
}: {
  children: ReactNode;
  containerClassName?: string;
  className?: string;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 18;
    const y = (clientY - (rect.top + rect.height / 2)) / 18;
    setPos({ x, y });
  };

  return (
    <motion.section
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPos({ x: 0, y: 0 });
      }}
      style={{
        transform: hover
          ? `translate3d(${pos.x}px, ${pos.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0,0,0) scale3d(1,1,1)",
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-2xl border border-border bg-card",
        containerClassName,
      )}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx,50%) var(--my,0%), oklch(1 0 0 / 0.06), transparent 60%)",
        }}
      />
      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <motion.div
        style={{
          transform: hover ? `translate3d(${-pos.x}px, ${-pos.y}px, 0)` : "translate3d(0,0,0)",
          transition: "transform 0.15s ease-out",
        }}
        className={cn("relative h-full", className)}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}
