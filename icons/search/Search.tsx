"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import searchSpec from "./animation.spec";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const LENS_ORIGIN = { transformBox: "view-box", transformOrigin: "11px 11px" } as const;

/**
 * Search — a magnifying glass.
 * Animation: the lens pulses, then the whole glass jiggles left-right once,
 * as if scanning.
 */
const Search = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = searchSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Search icon",
    },
    ref,
  ) => {
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });
    const repeat = loop ? Infinity : 0;
    const repeatDelay = loop ? 0.6 / speed : 0;

    const jiggle: Variants = {
      normal: { x: 0 },
      animate: {
        x: [0, -2.5, 2.5, -1.5, 1.5, 0],
        transition: {
          duration: 0.5 / speed,
          ease: EASE,
          delay: delay + 0.2 / speed,
          repeat,
          repeatDelay: repeatDelay + 0.25 / speed,
        },
      },
      hold: {
        x: [0, -2.5, 2.5, -1.5, 1.5, -1],
        transition: {
          duration: 0.5 / speed,
          ease: EASE,
          delay: delay + 0.2 / speed,
          repeat: 0,
        },
      },
    };

    const lens: Variants = {
      normal: { scale: 1 },
      animate: {
        scale: [1, 1.18, 1],
        transition: {
          duration: 0.3 / speed,
          ease: EASE,
          delay,
          repeat,
          repeatDelay: repeatDelay + 0.45 / speed,
        },
      },
      hold: {
        scale: [1, 1.18, 1.05],
        transition: {
          duration: 0.3 / speed,
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
        <motion.g variants={jiggle}>
          <motion.circle
            id="search-lens"
            cx="11"
            cy="11"
            r="7"
            variants={lens}
            style={LENS_ORIGIN}
          />
          <line id="search-handle" x1="21" y1="21" x2="16.65" y2="16.65" />
        </motion.g>
      </motion.svg>
    );
  },
);

Search.displayName = "Search";
export default Search;
