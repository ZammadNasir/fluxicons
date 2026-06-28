import type React from "react";

import { metadata as clock } from "@/icons/clock/metadata";
import { metadata as heart } from "@/icons/heart/metadata";
import { metadata as bell } from "@/icons/bell/metadata";
import { metadata as check } from "@/icons/check/metadata";
import { metadata as search } from "@/icons/search/metadata";
import { metadata as loader } from "@/icons/loader/metadata";
import { metadata as download } from "@/icons/download/metadata";

/**
 * What event starts an icon's animation.
 * - `hover`: plays while the parent is hovered
 * - `click`: plays once per click (and via keyboard when focusable)
 * - `inView`: plays once when the icon scrolls into view
 * - `autoplay`: loops continuously
 * - `none`: static, no animation
 */
export type AnimationTrigger =
  | "hover"
  | "click"
  | "inView"
  | "autoplay"
  | "none";

/** The complete, shared prop contract every FluxIcon implements. */
export interface IconProps {
  // Visual
  /** Pixel size of the square icon. Default: 24. */
  size?: number;
  /** Stroke color. Default: "currentColor". */
  color?: string;
  /** Stroke width. Default: 1.5. */
  strokeWidth?: number;

  // Animation
  /** What starts the animation. Default: "hover". */
  trigger?: AnimationTrigger;
  /** Speed multiplier applied to durations (range 0.1–3). Default: 1. */
  speed?: number;
  /** Whether the animation repeats. Default: false. */
  loop?: boolean;
  /** Delay in seconds before the animation starts. Default: 0. */
  delay?: number;

  // Callbacks
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;

  // Standard HTML
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

/** SEO/registry metadata describing a single icon. */
export interface IconMetadata {
  /** Display name, e.g. "Clock". */
  name: string;
  /** URL slug, e.g. "clock". */
  slug: string;
  /** Top-level category, e.g. "Time". */
  category: string;
  /** Search tags. */
  tags: string[];
  /** Whether the icon is featured on the landing page. */
  featured: boolean;
  /** One-line description for SEO/docs. */
  description: string;
  /** Describes what the animation does. */
  animationDescription: string;
}

/**
 * Static registry of all icon metadata, keyed by slug.
 * This and `ICON_IMPORTS` are the ONLY places icons are referenced by name —
 * all consuming code goes through the typed utilities below.
 */
export const ICON_REGISTRY: Record<string, IconMetadata> = {
  clock,
  heart,
  bell,
  check,
  search,
  loader,
  download,
};

/**
 * Lazy component loaders keyed by slug. Each icon is split into its own chunk
 * so consumers never bundle the whole library at once.
 */
const ICON_IMPORTS: Record<
  string,
  () => Promise<{ default: React.ComponentType<IconProps> }>
> = {
  clock: () => import("@/icons/clock"),
  heart: () => import("@/icons/heart"),
  bell: () => import("@/icons/bell"),
  check: () => import("@/icons/check"),
  search: () => import("@/icons/search"),
  loader: () => import("@/icons/loader"),
  download: () => import("@/icons/download"),
};

/** Every icon's metadata, sorted alphabetically by name. */
export function getAllIcons(): IconMetadata[] {
  return Object.values(ICON_REGISTRY).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/** Icons belonging to a given category (case-insensitive). */
export function getIconsByCategory(category: string): IconMetadata[] {
  const target = category.toLowerCase();
  return getAllIcons().filter((icon) => icon.category.toLowerCase() === target);
}

/** Only the icons flagged as featured. */
export function getFeaturedIcons(): IconMetadata[] {
  return getAllIcons().filter((icon) => icon.featured);
}

/** Fuzzy search across name, slug, tags, and category. */
export function searchIcons(query: string): IconMetadata[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllIcons();
  return getAllIcons().filter((icon) => {
    const haystack = [
      icon.name,
      icon.slug,
      icon.category,
      ...icon.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** Every unique category, alphabetically sorted. */
export function getAllCategories(): string[] {
  const set = new Set(getAllIcons().map((icon) => icon.category));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Metadata for a single icon, or undefined if the slug is unknown. */
export function getIconMetadata(slug: string): IconMetadata | undefined {
  return ICON_REGISTRY[slug];
}

/**
 * Dynamically import an icon component by slug for Next.js code-splitting.
 * @throws if the slug is not registered.
 */
export async function getIconComponent(
  slug: string,
): Promise<React.ComponentType<IconProps>> {
  const loader = ICON_IMPORTS[slug];
  if (!loader) {
    throw new Error(`Unknown icon slug: "${slug}"`);
  }
  const mod = await loader();
  return mod.default;
}

/** Whether a slug exists in the registry. */
export function hasIcon(slug: string): boolean {
  return slug in ICON_REGISTRY;
}
