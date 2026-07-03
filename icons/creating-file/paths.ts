import type { IconPaths } from "@/lib/animation-spec";

export const creatingFilePaths = {
  file: {
    type: "path",
    d: "M8 3h6l5 5v13H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z",
  },
  fold: {
    type: "path",
    d: "M10 11l1-.8 1.2 1.4 1-.9 1.2 1",
  },
  lineTop: {
    type: "path",
    d: "M10 11l1-.7 1.1 1.2 1-.8 1.2.9H16",
  },
  lineMiddle: {
    type: "path",
    d: "M10 14l.9-.5 1.2 1.5 1-.9 1.1.6H15",
  },
  lineBottom: {
    type: "path",
    d: "M10 17l1-.6 1 1 1.1-.7 1.1.8H16",
  },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
