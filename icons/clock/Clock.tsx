"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const HAND_ORIGIN = { transformBox: "view-box", transformOrigin: "12px 12px" } as const;

/**
 * Clock — circular face with two hands.
 * Animation: both hands sweep a full rotation, the minute hand twice as fast
 * as the hour hand, pivoting around the face center (12,12).
 */
const Clock = forwardRef<SVGSVGElement, IconProps>(
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
      "aria-label": ariaLabel = "Clock icon",
    },
    ref,
  ) => {
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });
    const repeat = loop ? Infinity : 0;

    const hourHand: Variants = {
      normal: { rotate: 0 },
      animate: {
        rotate: 360,
        transition: { duration: 2 / speed, ease: EASE, delay, repeat },
      },
    };
    const minuteHand: Variants = {
      normal: { rotate: 0 },
      animate: {
        rotate: 720,
        transition: { duration: 2 / speed, ease: EASE, delay, repeat },
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
        <circle id="clock-face" cx="12" cy="12" r="9" />
        <motion.line
          id="clock-minute-hand"
          x1="12"
          y1="12"
          x2="12"
          y2="7.5"
          variants={minuteHand}
          style={HAND_ORIGIN}
        />
        <motion.line
          id="clock-hour-hand"
          x1="12"
          y1="12"
          x2="14.5"
          y2="12"
          variants={hourHand}
          style={HAND_ORIGIN}
        />
      </motion.svg>
    );
  },
);

Clock.displayName = "Clock";
export default Clock;
