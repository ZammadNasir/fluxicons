import type { IconPaths } from "@/lib/animation-spec";

export const badgeCheckPaths = {
  badge: { type: "circle", cx: 12, cy: 12, r: 9 },
  check: { type: "path", d: "M8 12.5l2.5 2.5L16 9" },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
