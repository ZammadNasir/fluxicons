"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  "aria-label"?: string;
  className?: string;
}

/**
 * Radio-style segmented control with an animated active-pill indicator.
 * Implemented as a radiogroup for keyboard + screen-reader support.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  const layoutId = useId();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-full items-center gap-1 rounded-lg border border-border bg-background-subtle p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "relative flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none",
              active ? "text-foreground" : "text-foreground-muted hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={`segmented-${layoutId}`}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-0 rounded-md bg-background shadow-sm"
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
