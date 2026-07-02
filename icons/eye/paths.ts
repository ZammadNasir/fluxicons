import type { IconPaths } from "@/lib/animation-spec";

export const eyePaths = {
  outline: {
    type: "path",
    d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z",
  },
  pupil: { type: "circle", cx: 12, cy: 12, r: 2.5 },
  upperLid: { type: "path", d: "M2 12s3.5-7 10-7 10 7 10 7" },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
