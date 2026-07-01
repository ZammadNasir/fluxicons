import type { IconPaths } from "@/lib/animation-spec";

export const externalLinkPaths = {
  box: {
    type: "path",
    d: "M13 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6",
  },
  arrow: {
    type: "path",
    d: "M10 14L20 4",
  },
  arrowHead: {
    type: "path",
    d: "M15 4h5v5",
  },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
