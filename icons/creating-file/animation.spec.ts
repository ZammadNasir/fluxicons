import type { AnimationSpec } from "@/lib/animation-spec";

const creatingFileSpec: AnimationSpec = {
  elements: {
    file: {
      id: "creating-file-file",
      description: "Document outline",
    },
    fold: {
      id: "creating-file-fold",
      description: "Folded page corner",
    },
    lineTop: {
      id: "creating-file-lineTop",
      description: "Top content line",
    },
    lineMiddle: {
      id: "creating-file-lineMiddle",
      description: "Middle content line",
    },
    lineBottom: {
      id: "creating-file-lineBottom",
      description: "Bottom content line",
    },
  },
  sequences: {
    trigger: [
      {
        element: "lineTop",
        property: "opacity",
        values: [0.3, 1, 0.3],
        duration: 0.35,
        ease: "easeInOut",
      },
      {
        element: "lineMiddle",
        property: "opacity",
        values: [0.3, 1, 0.3],
        duration: 0.35,
        delay: 0.12,
        ease: "easeInOut",
      },
      {
        element: "lineBottom",
        property: "opacity",
        values: [0.3, 1, 0.3],
        duration: 0.35,
        delay: 0.24,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "inView",
  defaultLoop: true,
};

export default creatingFileSpec;
