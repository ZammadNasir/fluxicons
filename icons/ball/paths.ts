import type { IconPaths } from "@/lib/animation-spec";

export const ballPaths = {
  // A ball resting just above the ground line; bottom sits at y=15.
  ball: { type: "circle", cx: 12, cy: 9, r: 6 },
  ground: { type: "line", x1: 4, y1: 19, x2: 20, y2: 19 },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
