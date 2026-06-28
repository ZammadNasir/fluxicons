import type { IconPaths } from "@/lib/animation-spec";

export const downloadPaths = {
  // Arrow shaft + head as a single two-subpath stroke.
  arrow: { type: "path", d: "M12 3v12 M7 10l5 5 5-5" },
  baseline: { type: "path", d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
