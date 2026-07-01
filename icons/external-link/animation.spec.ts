import type { AnimationSpec } from "@/lib/animation-spec";

const externalLinkSpec: AnimationSpec = {
  elements: {
    box: {
      id: "external-link-box",
      description: "The square representing the destination window.",
    },
    arrow: {
      id: "external-link-arrow",
      description: "The arrow leaving the square.",
    },
    arrowHead: {
      id: "external-link-arrow-head",
      description: "The arrow head pointing outward.",
    },
  },

  sequences: {
    trigger: [
      // Arrow moves to the top-right
      {
        element: "arrow",
        property: "translateX",
        values: [0, 1.5, 0],
        duration: 0.4,
        ease: "easeInOut",
      },
      {
        element: "arrow",
        property: "translateY",
        values: [0, -1.5, 0],
        duration: 0.4,
        ease: "easeInOut",
      },

      // Arrow head follows
      {
        element: "arrowHead",
        property: "translateX",
        values: [0, 1.5, 0],
        duration: 0.4,
        ease: "easeInOut",
      },
      {
        element: "arrowHead",
        property: "translateY",
        values: [0, -1.5, 0],
        duration: 0.4,
        ease: "easeInOut",
      },
    ],
  },

  defaultTrigger: "hover",
};

export default externalLinkSpec;
