import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Combines `clsx` semantics with `tailwind-merge` de-duplication.
 *
 * @example cn("px-2", isActive && "px-4") // -> "px-4"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Constrain a number to the inclusive range [min, max].
 *
 * @param value - The value to clamp.
 * @param min - Lower bound.
 * @param max - Upper bound.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round a number to a fixed number of decimal places, dropping trailing zeros.
 *
 * @param value - The value to round.
 * @param decimals - Maximum decimal places (default 2).
 * @example roundTo(1.5000, 2) // -> 1.5
 */
export function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Snap a value to the nearest multiple of `step`, then clamp to [min, max].
 *
 * @param value - The raw value.
 * @param step - Step granularity.
 * @param min - Lower bound.
 * @param max - Upper bound.
 */
export function snapToStep(
  value: number,
  step: number,
  min: number,
  max: number,
): number {
  const snapped = Math.round((value - min) / step) * step + min;
  return clamp(roundTo(snapped, 4), min, max);
}

/**
 * Convert an arbitrary string into a URL-safe, lowercase slug.
 *
 * @example slugify("Arrow Right") // -> "arrow-right"
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert a name into PascalCase (used for icon component names).
 *
 * @example toPascalCase("arrow-right") // -> "ArrowRight"
 */
export function toPascalCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Create a debounced version of `fn` that delays invocation until `wait`ms
 * have elapsed since the last call. Useful for search inputs and code regen.
 *
 * @param fn - The function to debounce.
 * @param wait - Delay in milliseconds.
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}
