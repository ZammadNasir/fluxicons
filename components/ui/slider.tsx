"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  "aria-label"?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Accessible single-value slider. A native range input (visually hidden but
 * fully interactive) drives a custom-styled track, fill, and thumb so keyboard
 * and screen-reader behavior come for free.
 */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  className,
  disabled,
  "aria-label": ariaLabel,
}: SliderProps) {
  const id = useId();
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative h-5 w-full select-none", className)}>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
      {/* Track */}
      <div className="pointer-events-none absolute top-1/2 left-0 h-1.5 w-full -translate-y-1/2 rounded-full bg-background-muted" />
      {/* Fill */}
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-brand"
        style={{ width: `${percent}%` }}
      />
      {/* Thumb */}
      <div
        className={cn(
          "pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-background shadow-sm transition-transform",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          "peer-hover:scale-110 peer-active:scale-95",
        )}
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}
