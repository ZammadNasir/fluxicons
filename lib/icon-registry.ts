import type React from "react";

import type { AnimationTrigger } from "@/lib/animation-spec";
import { ICON_METADATA, ICON_IMPORTS } from "./icon-manifest.generated";

// Re-exported so existing imports from "@/lib/icon-registry" keep working; the
// type now lives in the framework-agnostic `animation-spec` module so the
// runtime never reaches the React icon manifest.
export type { AnimationTrigger };

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
  /**
   * The trigger that best expresses this icon, mirrored from its
   * `animation.spec.ts`. Injected into the registry by
   * `scripts/generate-registry.ts` — not authored in `metadata.ts`.
   */
  defaultTrigger?: AnimationTrigger;
  /**
   * The icon's default `loop` value, mirrored from its `animation.spec.ts`.
   * Injected by `scripts/generate-registry.ts` — not authored in `metadata.ts`.
   */
  defaultLoop?: boolean;
}

/**
 * Static registry of all icon metadata, keyed by slug. Both this and
 * `ICON_IMPORTS` are generated from the filesystem by
 * `scripts/generate-registry.ts` — add an icon folder and rebuild; no manual
 * edits here. All consuming code goes through the typed utilities below.
 */
export const ICON_REGISTRY: Record<string, IconMetadata> = ICON_METADATA;

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
