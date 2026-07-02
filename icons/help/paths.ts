import type { IconPaths } from "@/lib/animation-spec";

export const helpPaths = {
  circle: { type: "path", d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20" },
  question: {
    type: "path",
    d: "M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.9.8-1.8 1.3-1.8 2.8",
  },
  dot: { type: "path", d: "M12 17h.01" },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
