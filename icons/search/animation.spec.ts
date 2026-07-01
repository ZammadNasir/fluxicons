import type { AnimationSpec } from "@/lib/animation-spec";

const searchSpec: AnimationSpec = {
  elements: {
    lens: { id: "search-lens", description: "Search lens circle" },
    handle: { id: "search-handle", description: "Search handle line" },
  },
  sequences: {
    trigger: [
      // The lens pulses first. (Listed before translateX so it becomes the
      // inner wrapper, leaving the shared jiggle as the outermost transform.)
      {
        element: "lens",
        property: "scale",
        values: [1, 1.18, 1],
        duration: 0.3,
        ease: "easeOut",
        origin: { x: 11, y: 11 },
      },
      // Then the whole glass jiggles left-right: the same translateX is applied
      // to both the lens and the handle so they move as one (the React <g>).
      {
        element: "lens",
        property: "translateX",
        values: [0, -2.5, 2.5, -1.5, 1.5, 0],
        duration: 0.5,
        delay: 0.2,
        ease: "easeInOut",
      },
      {
        element: "handle",
        property: "translateX",
        values: [0, -2.5, 2.5, -1.5, 1.5, 0],
        duration: 0.5,
        delay: 0.2,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "hover",
};

export default searchSpec;
