"use client";

import { forwardRef, useState } from "react";
import { motion } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { loaderPaths } from "./paths";

const ORIGIN = { transformBox: "view-box", transformOrigin: "12px 12px" } as const;
const BASE_DURATION = 1; // seconds per rotation at speed = 1

/**
 * Loader — a spinning arc.
 * This icon ignores `trigger` and always spins; hovering doubles its speed.
 */
const Loader = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      // `trigger` and `loop` are intentionally ignored: the loader always spins.
      speed = 1,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Loader icon",
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState(false);
    const effectiveSpeed = speed * (hovered ? 2 : 1);

    return (
      <motion.svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ ...ORIGIN, ...style }}
        role="img"
        aria-label={ariaLabel}
        focusable={false}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ rotate: 360 }}
        transition={{
          duration: BASE_DURATION / effectiveSpeed,
          ease: "linear",
          repeat: Infinity,
          delay,
        }}
        onAnimationStart={onAnimationStart}
        onAnimationComplete={onAnimationComplete}
      >
        <path id="loader-arc" d={loaderPaths.arc.d} />
      </motion.svg>
    );
  },
);

Loader.displayName = "Loader";
export default Loader;
