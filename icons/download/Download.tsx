"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import downloadSpec from "./animation.spec";
import { downloadPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const CENTER = {
  transformBox: "view-box",
  transformOrigin: "12px 12px",
} as const;

/**
 * Download — downward arrow above a tray.
 * Animation: the arrow drops into the tray, which compresses slightly before both settle.
 */
const Download = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = downloadSpec.defaultTrigger,
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
    const {
      ref: mergedRef,
      controls,
      rootProps,
    } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });

    const arrow: Variants = {
      normal: { y: 0 },
      animate: {
        y: [0, 3, 0],
        transition: {
          duration: 0.55 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        y: [0, 3],
        transition: {
          duration: 0.55 / speed,
          ease: EASE,
          delay,
          repeat: 0,
        },
      },
    };

    const tray: Variants = {
      normal: { scaleX: 1 },
      animate: {
        scaleX: [1, 1.08, 1],
        transition: {
          duration: 0.25 / speed,
          ease: EASE,
          delay: delay + 0.3 / speed,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.8 / speed : 0,
        },
      },
      hold: {
        scaleX: [1, 1.08],
        transition: {
          duration: 0.25 / speed,
          ease: EASE,
          delay: delay + 0.3 / speed,
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
        <motion.path
          id="download-shaft"
          d={downloadPaths.shaft.d}
          variants={arrow}
        />
        <motion.path
          id="download-arrowhead"
          d={downloadPaths.arrowhead.d}
          variants={arrow}
        />
        <motion.path
          id="download-tray"
          d={downloadPaths.tray.d}
          variants={tray}
          style={CENTER}
        />
      </motion.svg>
    );
  },
);

Download.displayName = "Download";
export default Download;
