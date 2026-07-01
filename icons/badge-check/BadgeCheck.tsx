"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import { badgeCheckPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const ORIGIN = {
  transformBox: "view-box",
  transformOrigin: "12px 12px",
} as const;

/**
 * BadgeCheck — a badge that flips to reveal a checkmark.
 * Animation: a 3D `rotateY` flip on the whole badge (with perspective) combined
 * with a `pathLength` draw on the checkmark — the draw runs inside the 3D
 * (preserve-3d) context.
 */
const BadgeCheck = forwardRef<SVGSVGElement, IconProps>(
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
      "aria-label": ariaLabel = "BadgeCheck icon",
    },
    ref,
  ) => {
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });

    const flip: Variants = {
      normal: { rotateY: 0 },
      animate: {
        rotateY: [0, 360],
        transition: {
          duration: 0.8 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
        },
      },
    };

    const draw: Variants = {
      normal: { pathLength: 1 },
      animate: {
        pathLength: [0, 1],
        transition: {
          duration: 0.5 / speed,
          ease: "easeOut",
          delay: delay + 0.3 / speed,
          repeat: loop ? Infinity : 0,
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
        style={{ ...style, perspective: "600px" }}
        aria-label={ariaLabel}
        focusable={trigger === "click" ? undefined : false}
        initial="normal"
        animate={controls}
        {...rootProps}
      >
        <motion.g variants={flip} style={ORIGIN}>
          <circle
            id="badge"
            cx={badgeCheckPaths.badge.cx}
            cy={badgeCheckPaths.badge.cy}
            r={badgeCheckPaths.badge.r}
          />
          <motion.path id="badge-check-check" d={badgeCheckPaths.check.d} variants={draw} />
        </motion.g>
      </motion.svg>
    );
  },
);

BadgeCheck.displayName = "BadgeCheck";
export default BadgeCheck;
