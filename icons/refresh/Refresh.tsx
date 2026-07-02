"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import refreshSpec from "./animation.spec";
import { refreshPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const PIVOT = {
  transformBox: "view-box",
  transformOrigin: "12px 12px",
} as const;

/**
 * Refresh — circular refresh arrow.
 * Animation: the refresh arrow spins one full turn around the center.
 */
const Refresh = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = refreshSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Refresh icon",
    },
    ref,
  ) => {
    const {
      ref: mergedRef,
      controls,
      rootProps,
    } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });

    const spin: Variants = {
      normal: { rotate: 0 },
      animate: {
        rotate: [0, 120, 240, 360],
        transition: {
          duration: 0.8 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        rotate: [0, 120, 240],
        transition: {
          duration: 0.8 / speed,
          ease: EASE,
          delay,
          repeat: 0,
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
        <motion.g variants={spin} style={PIVOT}>
          <path id="refresh-arc" d={refreshPaths.arc.d} />
        </motion.g>
      </motion.svg>
    );
  },
);

Refresh.displayName = "Refresh";
export default Refresh;
