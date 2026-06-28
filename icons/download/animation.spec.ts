import type { AnimationSpec } from "@/lib/animation-spec";

const downloadSpec: AnimationSpec = {
  elements: {
    arrow: { id: "download-arrow", description: "Download arrow" },
    baseline: { id: "download-baseline", description: "Baseline" },
  },
  sequences: {
    trigger: [
      {
        element: "arrow",
        property: "translateY",
        values: [0, 3, 0],
        duration: 0.4,
        ease: "easeInOut",
      },
      {
        element: "baseline",
        property: "opacity",
        values: [1, 0.3, 1],
        duration: 0.4,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "hover",
};

export default downloadSpec;
