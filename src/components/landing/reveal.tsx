import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  amount?: number;
  once?: boolean;
  as?: "div" | "section" | "span" | "li";
}

/**
 * Scroll-triggered reveal. GPU-safe (transform + opacity only),
 * respects prefers-reduced-motion, uses a natural easing curve.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  amount = 0.2,
  once = true,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const from = reduce ? { opacity: 1 } : { opacity: 0, ...offset[direction] };
  const to = { opacity: 1, x: 0, y: 0 };

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      className={className}
      initial={from}
      whileInView={to}
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  gap?: number;
  delayChildren?: number;
  amount?: number;
  once?: boolean;
}

const staggerParent: Variants = {
  hidden: {},
  show: (custom: { gap: number; delay: number }) => ({
    transition: {
      staggerChildren: custom.gap,
      delayChildren: custom.delay,
    },
  }),
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Stagger container — wrap a grid, mark each direct child with
 * <StaggerItem>. Children reveal one after another as the group enters view.
 */
export function Stagger({
  children,
  className,
  gap = 0.06,
  delayChildren = 0.05,
  amount = 0.15,
  once = true,
}: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      custom={{ gap, delay: delayChildren }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}
