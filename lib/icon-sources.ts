import type { AnimationSpec, IconPaths } from "@/lib/animation-spec";
import type { IconMetadata } from "@/lib/icon-registry";
import { ICON_SOURCES } from "./icon-sources.generated";

/** The framework-agnostic source of one icon: geometry, spec, and metadata. */
export interface IconSource {
  paths: IconPaths;
  spec: AnimationSpec;
  metadata: IconMetadata;
}

/**
 * Static registry of every icon's framework-agnostic source. Generators (and
 * the CLI) read from here to emit native components for any framework.
 *
 * The actual entries live in `icon-sources.generated.ts`, regenerated from the
 * filesystem by `scripts/generate-registry.ts`. That file imports only pure
 * data — never the React components — so it can be bundled into the CLI without
 * pulling in React or Motion.
 */
export { ICON_SOURCES };

/** Look up an icon's source by slug, or `undefined` if unknown. */
export function getIconSource(slug: string): IconSource | undefined {
  return ICON_SOURCES[slug];
}

/** Every available icon slug, alphabetically sorted. */
export function listIconSlugs(): string[] {
  return Object.keys(ICON_SOURCES).sort();
}
