import type { AnimationSpec, IconPaths } from "@/lib/animation-spec";

import { clockPaths } from "@/icons/clock/paths";
import clockSpec from "@/icons/clock/animation.spec";
import { bellPaths } from "@/icons/bell/paths";
import bellSpec from "@/icons/bell/animation.spec";
import { heartPaths } from "@/icons/heart/paths";
import heartSpec from "@/icons/heart/animation.spec";
import { checkPaths } from "@/icons/check/paths";
import checkSpec from "@/icons/check/animation.spec";
import { searchPaths } from "@/icons/search/paths";
import searchSpec from "@/icons/search/animation.spec";
import { loaderPaths } from "@/icons/loader/paths";
import loaderSpec from "@/icons/loader/animation.spec";
import { downloadPaths } from "@/icons/download/paths";
import downloadSpec from "@/icons/download/animation.spec";

/** The framework-agnostic source of one icon: geometry + animation spec. */
export interface IconSource {
  paths: IconPaths;
  spec: AnimationSpec;
}

/**
 * Static registry of every icon's framework-agnostic source. Generators read
 * from here to emit native components for any framework.
 */
export const ICON_SOURCES: Record<string, IconSource> = {
  clock: { paths: clockPaths, spec: clockSpec },
  bell: { paths: bellPaths, spec: bellSpec },
  heart: { paths: heartPaths, spec: heartSpec },
  check: { paths: checkPaths, spec: checkSpec },
  search: { paths: searchPaths, spec: searchSpec },
  loader: { paths: loaderPaths, spec: loaderSpec },
  download: { paths: downloadPaths, spec: downloadSpec },
};

/** Look up an icon's source by slug, or `undefined` if unknown. */
export function getIconSource(slug: string): IconSource | undefined {
  return ICON_SOURCES[slug];
}
