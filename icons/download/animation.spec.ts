import type { AnimationSpec } from "@/lib/animation-spec";

const downloadSpec: AnimationSpec = {
  elements: {
    shaft: { id: "download-shaft", description: "Download arrow shaft" },
    arrowhead: { id: "download-arrowhead", description: "Download arrowhead" },
    tray: { id: "download-tray", description: "Download tray" },
  },
  sequences: {
    trigger: [
      {
        element: "shaft",
        property: "translateY",
        values: [0, 3, 0],
        duration: 0.55,
        ease: "easeInOut",
      },
      {
        element: "arrowhead",
        property: "translateY",
        values: [0, 3, 0],
        duration: 0.55,
        ease: "easeInOut",
      },
      {
        element: "tray",
        property: "scaleX",
        values: [1, 1.08, 1],
        duration: 0.25,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "hoverHold",
};

export default downloadSpec;
