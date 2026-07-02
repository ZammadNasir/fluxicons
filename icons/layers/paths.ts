import type { IconPaths } from "@/lib/animation-spec";

export const layersPaths = {
  base: {
    type: "path",
    d: "M4 14 12 18 20 14 12 10 4 14Z",
  },
  middle: {
    type: "path",
    d: "M6 10 12 13 18 10 12 7 6 10Z",
  },
  top: {
    type: "path",
    d: "M8 6 12 8 16 6 12 4 8 6Z",
  },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
