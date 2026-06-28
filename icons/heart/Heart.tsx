"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import { heartPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const ORIGIN = { transformBox: "view-box", transformOrigin: "12px 12px" } as const;

/**
 * Heart — a single stroked heart path.
 * Animation: a springy pulse (scale up + slight overshoot) while the stroke
 * briefly thickens, like a heartbeat.
 */
const Heart = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = "hover",
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Heart icon",
    },
    ref,
  ) => {
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });

    const beat: Variants = {
      normal: { scale: 1, strokeWidth },
      animate: {
        scale: [1, 1.18, 0.96, 1.04, 1],
        strokeWidth: [strokeWidth, strokeWidth * 1.6, strokeWidth],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.4 / speed : 0,
        },
      },
    };

    return (
      <motion.svg
        ref={mergedRef}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-label={ariaLabel}
        focusable={trigger === "click" ? undefined : false}
        initial="normal"
        animate={controls}
        {...rootProps}
      >
        <motion.path
          id="heart-shape"
          d={heartPaths.heart.d}
          variants={beat}
          style={ORIGIN}
        />
      </motion.svg>
    );
  },
);

Heart.displayName = "Heart";
export default Heart;
