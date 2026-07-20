"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 18;
    const y = (clientY - (rect.top + rect.height / 2)) / 18;
    setMouse({ x, y });
  };

  return (
    <motion.section
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setMouse({ x: 0, y: 0 });
      }}
      style={{
        transform: hover
          ? `translate3d(${mouse.x}px, ${mouse.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-950 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)]",
        containerClassName,
      )}
    >
      {/* Radial highlight following cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          background: `radial-gradient(600px circle at ${
            mouse.x * 18 + 300
          }px ${mouse.y * 18 + 200}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      {/* Grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
      <motion.div
        style={{
          transform: hover
            ? `translate3d(${-mouse.x}px, ${-mouse.y}px, 0)`
            : "translate3d(0px, 0px, 0)",
          transition: "transform 0.15s ease-out",
        }}
        className={cn("relative h-full", className)}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};