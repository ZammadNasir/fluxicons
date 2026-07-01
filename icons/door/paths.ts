import type { IconPaths } from "@/lib/animation-spec";

export const doorPaths = {
  frame: {
    type: "path",
    d: "M5 21V3h14v18",
  },

  panel: {
    type: "path",
    d: "M7 4h10v16H7z",
  },

  knob: {
    type: "circle",
    cx: 14.5,
    cy: 12,
    r: 0.8,
  },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
