import type { IconPaths } from "@/lib/animation-spec";

export const clockPaths = {
  face: { type: "circle", cx: 12, cy: 12, r: 9 },
  minuteHand: { type: "line", x1: 12, y1: 12, x2: 12, y2: 7.5 },
  hourHand: { type: "line", x1: 12, y1: 12, x2: 14.5, y2: 12 },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
