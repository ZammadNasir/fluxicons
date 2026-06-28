import type { AnimationSpec } from "@/lib/animation-spec";

const searchSpec: AnimationSpec = {
  elements: {
    lens: { id: "search-lens", description: "Search lens circle" },
    handle: { id: "search-handle", description: "Search handle line" },
  },
  sequences: {
    trigger: [
      {
        element: "lens",
        property: "scale",
        values: [1, 1.1, 1],
        duration: 0.2,
        ease: "easeOut",
        origin: { x: 11, y: 11 },
      },
      {
        element: "lens",
        property: "translateX",
        values: [0, -2, 2, -1, 0],
        duration: 0.4,
        delay: 0.15,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "hover",
};

export default searchSpec;
