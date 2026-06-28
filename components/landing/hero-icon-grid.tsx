"use client";

import { motion } from "motion/react";
import { IconRenderer } from "@/components/playground/icon-renderer";
import { getAllIcons } from "@/lib/icon-registry";

/**
 * The hero's floating panel: a grid of icons that animate on a staggered
 * autoplay loop, so the panel feels alive on first paint.
 */
export function HeroIconGrid() {
  // Up to 8 icons (4×2), featured first.
  const icons = getAllIcons()
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      className="rounded-2xl border border-border bg-background-subtle/60 p-4 shadow-float backdrop-blur-sm"
    >
      <div className="grid grid-cols-4 gap-3">
        {icons.map((icon, i) => (
          <div
            key={icon.slug}
            className="flex aspect-square items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:border-brand/40 hover:text-brand"
          >
            <IconRenderer
              slug={icon.slug}
              size={28}
              trigger="autoplay"
              loop
              speed={0.9}
              delay={i * 0.25}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
