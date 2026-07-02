"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import wifiSpec from "./animation.spec";
import { wifiPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/**
 * Wifi — wireless signal arcs with a connection point.
 * Animation: the wifi signal bars fill in and disappear in sequence before returning.
 */
const Wifi = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = wifiSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Wifi icon",
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

    const outer: Variants = {
      normal: { pathLength: 1 },
      animate: {
        pathLength: [1, 0, 1],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        pathLength: [1, 0],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay,
          repeat: 0,
        },
      },
    };

    const middle: Variants = {
      normal: { pathLength: 1 },
      animate: {
        pathLength: [1, 0, 1],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay: delay + 0.1 / speed,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        pathLength: [1, 0],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay: delay + 0.1 / speed,
          repeat: 0,
        },
      },
    };

    const inner: Variants = {
      normal: { opacity: 1 },
      animate: {
        opacity: [1, 0, 1],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay: delay + 0.2 / speed,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        opacity: [1, 0],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay: delay + 0.2 / speed,
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
        <motion.path id="wifi-outer" d={wifiPaths.outer.d} variants={outer} />
        <motion.path
          id="wifi-middle"
          d={wifiPaths.middle.d}
          variants={middle}
        />
        <motion.path id="wifi-inner" d={wifiPaths.inner.d} variants={inner} />
      </motion.svg>
    );
  },
);

Wifi.displayName = "Wifi";
export default Wifi;
