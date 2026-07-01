import type { IconPaths } from "@/lib/animation-spec";

export const cardFlipPaths = {
  // Rounded card outline spanning x:4–20, y:6–18.
  card: {
    type: "path",
    d: "M6 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
  },
  // A line of "content" across the middle of the card.
  line: { type: "path", d: "M8 12h8" },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
