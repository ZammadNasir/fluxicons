"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import { downloadPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/**
 * Download — a downward arrow over a baseline tray.
 * Animation: the arrow dips down and bounces back while the baseline pulses.
 */
const Download = forwardRef<SVGSVGElement, IconProps>(
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
      "aria-label": ariaLabel = "Download icon",
    },
    ref,
  ) => {
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });
    const repeat = loop ? Infinity : 0;
    const repeatDelay = loop ? 0.5 / speed : 0;

    const arrow: Variants = {
      normal: { y: 0 },
      animate: {
        y: [0, 4, -1, 0],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay,
          repeat,
          repeatDelay,
        },
      },
      hold: {
        y: [0, 4, -1, 2],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay,
          repeat: 0,
        },
      },
    };

    const baseline: Variants = {
      normal: { opacity: 1 },
      animate: {
        opacity: [1, 0.35, 1],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay,
          repeat,
          repeatDelay,
        },
      },
      hold: {
        opacity: [1, 0.35, 0.8],
        transition: {
          duration: 0.6 / speed,
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
        <motion.g id="download-arrow" variants={arrow}>
          <path d={downloadPaths.arrow.d} />
        </motion.g>
        <motion.path
          id="download-baseline"
          d={downloadPaths.baseline.d}
          variants={baseline}
        />
      </motion.svg>
    );
  },
);

Download.displayName = "Download";
export default Download;
