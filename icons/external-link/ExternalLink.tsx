import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import { externalLinkPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const ORIGIN = {
  transformBox: "view-box",
  transformOrigin: "12px 12px",
} as const;

const ExternalLink = forwardRef<SVGSVGElement, IconProps>(
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
      "aria-label": ariaLabel = "External Link icon",
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

    const box: Variants = {
      normal: {},
      animate: {},
    };

    const arrow: Variants = {
      normal: {
        x: 0,
        y: 0,
      },
      animate: {
        x: [0, 1.5, 0],
        y: [0, -1.5, 0],
        transition: {
          duration: 0.4 / speed,
          ease: EASE,
          delay,
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
        style={style}
        aria-label={ariaLabel}
        focusable={trigger === "click" ? undefined : false}
        initial="normal"
        animate={controls}
        {...rootProps}
      >
        <motion.path
          id="external-link-box"
          d={externalLinkPaths.box.d}
          variants={box}
        />

        <motion.path
          id="external-link-arrow"
          d={externalLinkPaths.arrow.d}
          variants={arrow}
          style={ORIGIN}
        />

        <motion.path
          id="external-link-arrow-head"
          d={externalLinkPaths.arrowHead.d}
          variants={arrow}
          style={ORIGIN}
        />
      </motion.svg>
    );
  },
);

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
