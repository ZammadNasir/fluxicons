"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import { cardFlipPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const ORIGIN = {
  transformBox: "view-box",
  transformOrigin: "12px 12px",
} as const;

/**
 * CardFlip — a card that flips forward.
 * Animation: a 3D `rotateX` full turn around the card's horizontal axis,
 * rendered with perspective so it reads as depth rather than a vertical squash.
 */
const CardFlip = forwardRef<SVGSVGElement, IconProps>(
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
      "aria-label": ariaLabel = "CardFlip icon",
    },
    ref,
  ) => {
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });

    const flip: Variants = {
      normal: { rotateX: 0 },
      animate: {
        rotateX: [0, 180, 360],
        transition: {
          duration: 0.7 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
        },
      },
      hold: {
        rotateX: [0, 180, 360],
        transition: {
          duration: 0.7 / speed,
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
        style={{ ...style, perspective: "500px" }}
        aria-label={ariaLabel}
        focusable={trigger === "click" ? undefined : false}
        initial="normal"
        animate={controls}
        {...rootProps}
      >
        <motion.g variants={flip} style={ORIGIN}>
          <path id="card" d={cardFlipPaths.card.d} />
          <path id="card-line" d={cardFlipPaths.line.d} />
        </motion.g>
      </motion.svg>
    );
  },
);

CardFlip.displayName = "CardFlip";
export default CardFlip;
