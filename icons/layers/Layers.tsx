"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import layersSpec from "./animation.spec";
import { layersPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/**
 * Layers — stacked sheets that lift apart in a clean depth reveal.
 * Animation: layers separate vertically with increasing height and slight scale, then restack smoothly.
 */
const Layers = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = layersSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Layers icon",
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

    const base: Variants = {
      normal: { y: 0, scale: 1 },
      animate: {
        y: [0, 0, 0],
        scale: [1, 1, 1],
        transition: {
          duration: 0.7 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.6 / speed : 0,
        },
      },
      hold: {
        y: [0],
        scale: [1],
        transition: {
          duration: 0.7 / speed,
          ease: EASE,
          delay,
        },
      },
    };

    const middle: Variants = {
      normal: { y: 0, scale: 1 },
      animate: {
        y: [0, -4, 0],
        scale: [1, 1.03, 1],
        transition: {
          duration: 0.7 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.6 / speed : 0,
        },
      },
      hold: {
        y: [0, -4],
        scale: [1, 1.03],
        transition: {
          duration: 0.7 / speed,
          ease: EASE,
          delay,
        },
      },
    };

    const top: Variants = {
      normal: { y: 0, scale: 1 },
      animate: {
        y: [0, -8, 0],
        scale: [1, 1.06, 1],
        transition: {
          duration: 0.7 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.6 / speed : 0,
        },
      },
      hold: {
        y: [0, -8],
        scale: [1, 1.06],
        transition: {
          duration: 0.7 / speed,
          ease: EASE,
          delay,
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
        <motion.g id="layers-base" variants={base}>
          <path d={layersPaths.base.d} />
        </motion.g>

        <motion.g id="layers-middle" variants={middle}>
          <path d={layersPaths.middle.d} />
        </motion.g>

        <motion.g id="layers-top" variants={top}>
          <path d={layersPaths.top.d} />
        </motion.g>
      </motion.svg>
    );
  },
);

Layers.displayName = "Layers";
export default Layers;
