#!/usr/bin/env node
"use strict";

// cli/index.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_node_readline = require("node:readline");

// icons/badge-check/paths.ts
var badgeCheckPaths = {
  badge: {
    type: "path",
    d: "M12 3l2.1 1.2 2.4-.3 1.2 2.1 2.1 1.2-.3 2.4L21 12l-1.2 2.1.3 2.4-2.1 1.2-1.2 2.1-2.4-.3L12 21l-2.1-1.2-2.4.3-1.2-2.1-2.1-1.2.3-2.4L3 12l1.2-2.1-.3-2.4 2.1-1.2 1.2-2.1 2.4.3L12 3"
  },
  check: {
    type: "path",
    d: "M9 12.5l2 2 4-4"
  }
};

// icons/badge-check/animation.spec.ts
var badgeCheckSpec = {
  elements: {
    badge: { id: "badge-check-badge", description: "Award badge" },
    check: { id: "badge-check-check", description: "Verification checkmark" }
  },
  sequences: {
    trigger: [
      {
        element: "badge",
        property: "scale",
        values: [1, 1.08, 0.98, 1],
        duration: 0.5,
        ease: "easeInOut"
      },
      {
        element: "check",
        property: "pathLength",
        values: [0, 1],
        duration: 0.4,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default = badgeCheckSpec;

// icons/badge-check/metadata.ts
var metadata = {
  name: "BadgeCheck",
  slug: "badge-check",
  category: "Status",
  tags: ["badge", "check", "verified", "verification", "approved", "success"],
  featured: false,
  description: "An award badge with a verification checkmark.",
  animationDescription: "The badge gently pops while the checkmark draws itself into place."
};

// icons/ball/paths.ts
var ballPaths = {
  // A ball resting just above the ground line; bottom sits at y=15.
  ball: { type: "circle", cx: 12, cy: 9, r: 6 },
  ground: { type: "line", x1: 4, y1: 19, x2: 20, y2: 19 }
};

// icons/ball/animation.spec.ts
var ballSpec = {
  elements: {
    ball: { id: "ball", description: "The ball that squashes and stretches." },
    ground: { id: "ground", description: "The static ground line." }
  },
  sequences: {
    // Non-uniform scale around the ball's base (12,15): it widens + flattens on
    // impact, then stretches tall before settling. No perspective involved.
    trigger: [
      {
        element: "ball",
        property: "scaleY",
        values: [1, 0.78, 1.08, 1],
        duration: 0.55,
        ease: "easeOut",
        origin: { x: 12, y: 15 }
      },
      {
        element: "ball",
        property: "scaleX",
        values: [1, 1.22, 0.96, 1],
        duration: 0.55,
        ease: "easeOut",
        origin: { x: 12, y: 15 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default2 = ballSpec;

// icons/ball/metadata.ts
var metadata2 = {
  name: "Ball",
  slug: "ball",
  category: "Objects",
  tags: ["ball", "bounce", "squash", "stretch", "scale", "physics"],
  featured: false,
  description: "A ball that squashes and stretches above a ground line.",
  animationDescription: "The ball flattens and widens on impact, then stretches tall before settling."
};

// icons/bell/paths.ts
var bellPaths = {
  body: { type: "path", d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" },
  clapper: { type: "path", d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" }
};

// icons/bell/animation.spec.ts
var bellSpec = {
  elements: {
    body: { id: "bell-body", description: "Bell body" },
    clapper: { id: "bell-clapper", description: "Bell clapper" }
  },
  sequences: {
    // The whole bell rocks around its top mount, so body AND clapper rotate
    // together around the same pivot (matching the React <g> wrapper).
    trigger: [
      {
        element: "body",
        property: "rotate",
        values: [0, -12, 12, -9, 9, -5, 0],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 3 }
      },
      {
        element: "clapper",
        property: "rotate",
        values: [0, -12, 12, -9, 9, -5, 0],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 3 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default3 = bellSpec;

// icons/bell/metadata.ts
var metadata3 = {
  name: "Bell",
  slug: "bell",
  category: "Notification",
  tags: ["bell", "notification", "alert", "ring", "alarm"],
  featured: true,
  description: "A notification bell with a swinging ring.",
  animationDescription: "The bell rocks back and forth around its top mount, settling to center."
};

// icons/card-flip/paths.ts
var cardFlipPaths = {
  // Rounded card outline spanning x:4–20, y:6–18.
  card: {
    type: "path",
    d: "M6 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
  },
  // A line of "content" across the middle of the card.
  line: { type: "path", d: "M8 12h8" }
};

// icons/card-flip/animation.spec.ts
var cardFlipSpec = {
  elements: {
    card: { id: "card", description: "The card body." },
    line: { id: "card-line", description: "The content line on the card." }
  },
  sequences: {
    // Both elements rotate identically around the card's center, so the whole
    // card flips to its back as one rigid surface (3D rotation around the X
    // axis). A half-turn (0→180) so hoverHold can hold the flipped face.
    trigger: [
      {
        element: "card",
        property: "rotateX",
        values: [0, 180],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      },
      {
        element: "line",
        property: "rotateX",
        values: [0, 180],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "hoverHold",
  perspective: 500
};
var animation_spec_default4 = cardFlipSpec;

// icons/card-flip/metadata.ts
var metadata4 = {
  name: "CardFlip",
  slug: "card-flip",
  category: "Objects",
  tags: ["card", "flip", "rotate", "3d", "reveal"],
  featured: false,
  description: "A card that flips forward to reveal its other side.",
  animationDescription: "The card flips to its back around its horizontal axis (a 3D half-turn), holding the flipped face while hovered."
};

// icons/check/paths.ts
var checkPaths = {
  checkmark: { type: "path", d: "M5 12.5l4.5 4.5L19 7" }
};

// icons/check/animation.spec.ts
var checkSpec = {
  elements: {
    checkmark: { id: "check-path", description: "Checkmark path" }
  },
  sequences: {
    trigger: [
      {
        element: "checkmark",
        property: "pathLength",
        from: 0,
        to: 1,
        duration: 0.4,
        ease: "easeOut"
      }
    ],
    mount: [
      {
        element: "checkmark",
        property: "pathLength",
        from: 0,
        to: 1,
        duration: 0.4,
        ease: "easeOut"
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default5 = checkSpec;

// icons/check/metadata.ts
var metadata5 = {
  name: "Check",
  slug: "check",
  category: "Status",
  tags: ["check", "done", "success", "confirm", "tick", "complete"],
  featured: true,
  description: "A checkmark for success and confirmation states.",
  animationDescription: "The stroke draws itself from the bottom-left up to the top-right."
};

// icons/clock/paths.ts
var clockPaths = {
  face: { type: "circle", cx: 12, cy: 12, r: 9 },
  minuteHand: { type: "line", x1: 12, y1: 12, x2: 12, y2: 7.5 },
  hourHand: { type: "line", x1: 12, y1: 12, x2: 14.5, y2: 12 }
};

// icons/clock/animation.spec.ts
var clockSpec = {
  elements: {
    hourHand: { id: "clock-hour-hand", description: "Hour hand" },
    minuteHand: { id: "clock-minute-hand", description: "Minute hand" }
  },
  sequences: {
    trigger: [
      {
        element: "minuteHand",
        property: "rotate",
        values: [0, 360],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      },
      {
        element: "hourHand",
        property: "rotate",
        values: [0, 30],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "hoverHold"
};
var animation_spec_default6 = clockSpec;

// icons/clock/metadata.ts
var metadata6 = {
  name: "Clock",
  slug: "clock",
  category: "Time",
  tags: ["time", "watch", "schedule", "clock", "hour", "alarm"],
  featured: true,
  description: "A clock face with sweeping hour and minute hands.",
  animationDescription: "Both hands sweep a full rotation, the minute hand faster than the hour hand."
};

// icons/creating-file/paths.ts
var creatingFilePaths = {
  file: {
    type: "path",
    d: "M8 3h6l5 5v13H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
  },
  fold: {
    type: "path",
    d: "M10 11l1-.8 1.2 1.4 1-.9 1.2 1"
  },
  lineTop: {
    type: "path",
    d: "M10 11l1-.7 1.1 1.2 1-.8 1.2.9H16"
  },
  lineMiddle: {
    type: "path",
    d: "M10 14l.9-.5 1.2 1.5 1-.9 1.1.6H15"
  },
  lineBottom: {
    type: "path",
    d: "M10 17l1-.6 1 1 1.1-.7 1.1.8H16"
  }
};

// icons/creating-file/animation.spec.ts
var creatingFileSpec = {
  elements: {
    file: {
      id: "creating-file-file",
      description: "Document outline"
    },
    fold: {
      id: "creating-file-fold",
      description: "Folded page corner"
    },
    lineTop: {
      id: "creating-file-lineTop",
      description: "Top content line"
    },
    lineMiddle: {
      id: "creating-file-lineMiddle",
      description: "Middle content line"
    },
    lineBottom: {
      id: "creating-file-lineBottom",
      description: "Bottom content line"
    }
  },
  sequences: {
    trigger: [
      {
        element: "lineTop",
        property: "opacity",
        values: [0.3, 1, 0.3],
        duration: 0.35,
        ease: "easeInOut"
      },
      {
        element: "lineMiddle",
        property: "opacity",
        values: [0.3, 1, 0.3],
        duration: 0.35,
        delay: 0.12,
        ease: "easeInOut"
      },
      {
        element: "lineBottom",
        property: "opacity",
        values: [0.3, 1, 0.3],
        duration: 0.35,
        delay: 0.24,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "inView",
  defaultLoop: true
};
var animation_spec_default7 = creatingFileSpec;

// icons/creating-file/metadata.ts
var metadata7 = {
  name: "CreatingFile",
  slug: "creating-file",
  category: "AI",
  tags: ["file", "document", "create", "writing", "generation", "ai", "text"],
  featured: false,
  description: "A document icon with animated content lines representing AI-generated text.",
  animationDescription: "The document stays still while its text lines softly pulse one after another, suggesting content being generated."
};

// icons/door/paths.ts
var doorPaths = {
  frame: {
    type: "path",
    d: "M5 21V3h14v18"
  },
  panel: {
    type: "path",
    d: "M7 4h10v16H7z"
  },
  knob: {
    type: "circle",
    cx: 14.5,
    cy: 12,
    r: 0.8
  }
};

// icons/door/animation.spec.ts
var doorSpec = {
  elements: {
    panel: {
      id: "door-panel",
      description: "The door swings open in 3D around its left hinge."
    }
  },
  sequences: {
    trigger: [
      {
        element: "panel",
        property: "rotateY",
        values: [0, -55, 0],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 7, y: 12 }
        // left edge (hinge)
      },
      {
        element: "panel",
        property: "scaleX",
        values: [1, 0.85, 1],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 7, y: 12 }
        // foreshorten toward the hinge as it swings
      }
    ]
  },
  defaultTrigger: "hoverHold",
  perspective: 500
};
var animation_spec_default8 = doorSpec;

// icons/door/metadata.ts
var metadata8 = {
  name: "Door",
  slug: "door",
  category: "Objects",
  tags: ["door", "entrance", "home", "open", "exit", "room"],
  featured: false,
  description: "A simple door icon with a hinged panel and handle.",
  animationDescription: "The door panel swings open from its hinge and returns to the closed position."
};

// icons/download/paths.ts
var downloadPaths = {
  shaft: { type: "path", d: "M12 3v11" },
  arrowhead: { type: "path", d: "m8 10 4 4 4-4" },
  tray: { type: "path", d: "M4 19h16" }
};

// icons/download/animation.spec.ts
var downloadSpec = {
  elements: {
    shaft: { id: "download-shaft", description: "Download arrow shaft" },
    arrowhead: { id: "download-arrowhead", description: "Download arrowhead" },
    tray: { id: "download-tray", description: "Download tray" }
  },
  sequences: {
    trigger: [
      {
        element: "shaft",
        property: "translateY",
        values: [0, 3, 0],
        duration: 0.55,
        ease: "easeInOut"
      },
      {
        element: "arrowhead",
        property: "translateY",
        values: [0, 3, 0],
        duration: 0.55,
        ease: "easeInOut"
      },
      {
        element: "tray",
        property: "scaleX",
        values: [1, 1.08, 1],
        duration: 0.25,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hoverHold"
};
var animation_spec_default9 = downloadSpec;

// icons/download/metadata.ts
var metadata9 = {
  name: "Download",
  slug: "download",
  category: "Actions",
  tags: ["download", "save", "arrow", "file", "import"],
  featured: false,
  description: "A downward arrow landing into a download tray.",
  animationDescription: "The arrow drops into the tray, which compresses slightly before both settle."
};

// icons/external-link/paths.ts
var externalLinkPaths = {
  box: {
    type: "path",
    d: "M13 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
  },
  arrow: {
    type: "path",
    d: "M10 14L20 4"
  },
  arrowHead: {
    type: "path",
    d: "M15 4h5v5"
  }
};

// icons/external-link/animation.spec.ts
var externalLinkSpec = {
  elements: {
    box: {
      id: "external-link-box",
      description: "The square representing the destination window."
    },
    arrow: {
      id: "external-link-arrow",
      description: "The arrow leaving the square."
    },
    arrowHead: {
      id: "external-link-arrow-head",
      description: "The arrow head pointing outward."
    }
  },
  sequences: {
    trigger: [
      // Arrow moves to the top-right
      {
        element: "arrow",
        property: "translateX",
        values: [0, 1.5, 0],
        duration: 0.4,
        ease: "easeInOut"
      },
      {
        element: "arrow",
        property: "translateY",
        values: [0, -1.5, 0],
        duration: 0.4,
        ease: "easeInOut"
      },
      // Arrow head follows
      {
        element: "arrowHead",
        property: "translateX",
        values: [0, 1.5, 0],
        duration: 0.4,
        ease: "easeInOut"
      },
      {
        element: "arrowHead",
        property: "translateY",
        values: [0, -1.5, 0],
        duration: 0.4,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hoverHold"
};
var animation_spec_default10 = externalLinkSpec;

// icons/external-link/metadata.ts
var metadata10 = {
  name: "ExternalLink",
  slug: "external-link",
  category: "Uncategorized",
  tags: [],
  featured: false,
  description: "TODO: one-line description for ExternalLink.",
  animationDescription: "TODO: describe what the animation does."
};

// icons/eye/paths.ts
var eyePaths = {
  outline: {
    type: "path",
    d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
  },
  pupil: { type: "circle", cx: 12, cy: 12, r: 2.5 },
  upperLid: { type: "path", d: "M2 12s3.5-7 10-7 10 7 10 7" }
};

// icons/eye/animation.spec.ts
var eyeSpec = {
  elements: {
    outline: { id: "eye-outline", description: "Eye outline" },
    pupil: { id: "eye-pupil", description: "Eye pupil" },
    upperLid: { id: "eye-upperLid", description: "Upper eyelid blink motion" }
  },
  sequences: {
    // The upper lid lowers down over the eye to roughly the centre and back.
    // Round-trip values (0 → 7 → 0): `hoverHold` trims the return frame to hold
    // the lid half-closed (lifting on leave), while `hover`/`click`/`inView`
    // play the full drop-and-lift as a one-shot half-blink.
    trigger: [
      {
        element: "upperLid",
        property: "translateY",
        values: [0, 7, 0],
        duration: 0.4,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hoverHold"
};
var animation_spec_default11 = eyeSpec;

// icons/eye/metadata.ts
var metadata11 = {
  name: "Eye",
  slug: "eye",
  category: "Visibility",
  tags: ["eye", "vision", "view", "watch", "visibility", "blink"],
  featured: false,
  description: "An eye icon whose lid lowers halfway.",
  animationDescription: "The upper eyelid lowers over the eye and holds it half-closed while hovered, lifting back up on leave."
};

// icons/heart/paths.ts
var heartPaths = {
  heart: {
    type: "path",
    d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"
  }
};

// icons/heart/animation.spec.ts
var heartSpec = {
  elements: {
    heart: { id: "heart-shape", description: "Heart shape" }
  },
  sequences: {
    trigger: [
      {
        element: "heart",
        property: "scale",
        values: [1, 1.2, 0.95, 1.1, 1],
        duration: 0.5,
        ease: "spring",
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default12 = heartSpec;

// icons/heart/metadata.ts
var metadata12 = {
  name: "Heart",
  slug: "heart",
  category: "Social",
  tags: ["heart", "like", "love", "favorite", "save"],
  featured: true,
  description: "A heart for likes, favorites, and saves.",
  animationDescription: "A springy heartbeat pulse while the stroke briefly thickens."
};

// icons/help/paths.ts
var helpPaths = {
  circle: { type: "path", d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20" },
  question: {
    type: "path",
    d: "M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.9.8-1.8 1.3-1.8 2.8"
  },
  dot: { type: "path", d: "M12 17h.01" }
};

// icons/help/animation.spec.ts
var helpSpec = {
  elements: {
    question: { id: "help-question", description: "Question mark" },
    dot: { id: "help-dot", description: "Question mark dot" },
    circle: { id: "help-circle", description: "Outer circle" }
  },
  sequences: {
    trigger: [
      {
        element: "question",
        property: "scale",
        values: [1, 1.12, 0.96, 1.06, 1],
        duration: 0.55,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      },
      {
        element: "dot",
        property: "translateY",
        values: [0, -1.5, 0],
        duration: 0.55,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default13 = helpSpec;

// icons/help/metadata.ts
var metadata13 = {
  name: "Help",
  slug: "help",
  category: "Interface",
  tags: ["help", "question", "support", "faq", "info", "assist"],
  featured: false,
  description: "A circled question mark representing help or support.",
  animationDescription: "The question mark gently pops while its dot bounces upward before settling."
};

// icons/layers/paths.ts
var layersPaths = {
  base: {
    type: "path",
    d: "M4 14 12 18 20 14 12 10 4 14Z"
  },
  middle: {
    type: "path",
    d: "M6 10 12 13 18 10 12 7 6 10Z"
  },
  top: {
    type: "path",
    d: "M8 6 12 8 16 6 12 4 8 6Z"
  }
};

// icons/layers/animation.spec.ts
var layersSpec = {
  elements: {
    base: { id: "layers-base", description: "Bottom layer" },
    middle: { id: "layers-middle", description: "Middle layer" },
    top: { id: "layers-top", description: "Top layer" }
  },
  sequences: {
    trigger: [
      {
        element: "base",
        property: "translateY",
        values: [0, 0, 0],
        duration: 0.7,
        ease: "easeInOut"
      },
      {
        element: "middle",
        property: "translateY",
        values: [0, -4, 0],
        duration: 0.7,
        ease: "easeInOut"
      },
      {
        element: "top",
        property: "translateY",
        values: [0, -8, 0],
        duration: 0.7,
        ease: "easeInOut"
      },
      {
        element: "middle",
        property: "scale",
        values: [1, 1.03, 1],
        duration: 0.7,
        ease: "easeInOut"
      },
      {
        element: "top",
        property: "scale",
        values: [1, 1.06, 1],
        duration: 0.7,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default14 = layersSpec;

// icons/layers/metadata.ts
var metadata14 = {
  name: "Layers",
  slug: "layers",
  category: "Interface",
  tags: ["layers", "stack", "sheets", "depth", "arrangement", "structure"],
  featured: false,
  description: "A stacked set of layers representing hierarchy or composition.",
  animationDescription: "The layers subtly separate vertically, with the top layers lifting slightly before re-stacking."
};

// icons/refresh/paths.ts
var refreshPaths = {
  arc: {
    type: "path",
    d: "M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"
  }
};

// icons/refresh/animation.spec.ts
var refreshSpec = {
  elements: {
    arc: { id: "refresh-arc", description: "Circular refresh arrow" }
  },
  sequences: {
    trigger: [
      {
        element: "arc",
        property: "rotate",
        values: [0, 120, 240, 360],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default15 = refreshSpec;

// icons/refresh/metadata.ts
var metadata15 = {
  name: "Refresh",
  slug: "refresh",
  category: "Interface",
  tags: ["refresh", "reload", "sync", "update", "rotate"],
  featured: false,
  description: "A circular refresh arrow.",
  animationDescription: "The refresh arrow spins one full turn around the center."
};

// icons/search/paths.ts
var searchPaths = {
  lens: { type: "circle", cx: 11, cy: 11, r: 7 },
  handle: { type: "line", x1: 21, y1: 21, x2: 16.65, y2: 16.65 }
};

// icons/search/animation.spec.ts
var searchSpec = {
  elements: {
    lens: { id: "search-lens", description: "Search lens circle" },
    handle: { id: "search-handle", description: "Search handle line" }
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
        origin: { x: 11, y: 11 }
      },
      // Then the whole glass jiggles left-right: the same translateX is applied
      // to both the lens and the handle so they move as one (the React <g>).
      {
        element: "lens",
        property: "translateX",
        values: [0, -2.5, 2.5, -1.5, 1.5, 0],
        duration: 0.5,
        delay: 0.2,
        ease: "easeInOut"
      },
      {
        element: "handle",
        property: "translateX",
        values: [0, -2.5, 2.5, -1.5, 1.5, 0],
        duration: 0.5,
        delay: 0.2,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default16 = searchSpec;

// icons/search/metadata.ts
var metadata16 = {
  name: "Search",
  slug: "search",
  category: "Interface",
  tags: ["search", "find", "magnifier", "lookup", "explore"],
  featured: false,
  description: "A magnifying glass for search and discovery.",
  animationDescription: "The lens pulses, then the whole glass jiggles left-right once."
};

// icons/signal/paths.ts
var signalPaths = {
  bar1: { type: "path", d: "M4 18v2" },
  bar2: { type: "path", d: "M9 14v6" },
  bar3: { type: "path", d: "M14 10v10" },
  bar4: { type: "path", d: "M19 6v14" }
};

// icons/signal/animation.spec.ts
var signalSpec = {
  elements: {
    bar1: { id: "signal-bar1", description: "Signal bar 1 (shortest)" },
    bar2: { id: "signal-bar2", description: "Signal bar 2" },
    bar3: { id: "signal-bar3", description: "Signal bar 3" },
    bar4: { id: "signal-bar4", description: "Signal bar 4 (tallest)" }
  },
  sequences: {
    trigger: [
      {
        element: "bar1",
        property: "scaleY",
        values: [1, 0.4, 1],
        duration: 0.4,
        ease: "easeInOut",
        origin: { x: 4, y: 20 }
      },
      {
        element: "bar2",
        property: "scaleY",
        values: [1, 0.4, 1],
        duration: 0.5,
        ease: "easeInOut",
        origin: { x: 9, y: 20 }
      },
      {
        element: "bar3",
        property: "scaleY",
        values: [1, 0.4, 1],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 14, y: 20 }
      },
      {
        element: "bar4",
        property: "scaleY",
        values: [1, 0.4, 1],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 19, y: 20 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default17 = signalSpec;

// icons/signal/metadata.ts
var metadata17 = {
  name: "Signal",
  slug: "signal",
  category: "Communication",
  tags: ["signal", "network", "cellular", "strength", "connection", "wifi"],
  featured: false,
  description: "Four ascending signal-strength bars.",
  animationDescription: "The bars compress and spring back in a staggered cascade, like a pulse sweeping across the signal."
};

// icons/user/paths.ts
var userPaths = {
  shape: {
    type: "path",
    d: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6Z"
  }
};

// icons/user/animation.spec.ts
var userSpec = {
  elements: {
    shape: { id: "user-shape", description: "The user silhouette." }
  },
  sequences: {
    // A gentle pop with a side-to-side wobble (scale + rotate around center),
    // matching the React component.
    trigger: [
      {
        element: "shape",
        property: "scale",
        values: [1, 1.08, 1],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      },
      {
        element: "shape",
        property: "rotate",
        values: [0, -3, 3, 0],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default18 = userSpec;

// icons/user/metadata.ts
var metadata18 = {
  name: "User",
  slug: "user",
  category: "Uncategorized",
  tags: [],
  featured: false,
  description: "TODO: one-line description for User.",
  animationDescription: "TODO: describe what the animation does."
};

// icons/wifi/paths.ts
var wifiPaths = {
  outer: { type: "path", d: "M5 13a11 11 0 0 1 14 0" },
  middle: { type: "path", d: "M8.5 16.5a6 6 0 0 1 7 0" },
  inner: { type: "path", d: "M12 20h.01" }
};

// icons/wifi/animation.spec.ts
var wifiSpec = {
  elements: {
    outer: { id: "wifi-outer", description: "Outer wifi signal arc" },
    middle: { id: "wifi-middle", description: "Middle wifi signal arc" },
    inner: { id: "wifi-inner", description: "Wifi signal dot" }
  },
  sequences: {
    trigger: [
      {
        element: "inner",
        property: "opacity",
        values: [1, 0, 1],
        duration: 0.6,
        ease: "easeInOut"
      },
      {
        element: "middle",
        property: "pathLength",
        values: [1, 0, 1],
        duration: 0.6,
        ease: "easeInOut"
      },
      {
        element: "outer",
        property: "pathLength",
        values: [1, 0, 1],
        duration: 0.6,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default19 = wifiSpec;

// icons/wifi/metadata.ts
var metadata19 = {
  name: "Wifi",
  slug: "wifi",
  category: "Connectivity",
  tags: ["wifi", "wireless", "signal", "network", "connection"],
  featured: false,
  description: "A wireless connection icon with animated signal bars.",
  animationDescription: "The wifi bars fill in and disappear in sequence, creating a signal pulse effect."
};

// lib/icon-sources.generated.ts
var ICON_SOURCES = {
  "badge-check": { paths: badgeCheckPaths, spec: animation_spec_default, metadata },
  "ball": { paths: ballPaths, spec: animation_spec_default2, metadata: metadata2 },
  "bell": { paths: bellPaths, spec: animation_spec_default3, metadata: metadata3 },
  "card-flip": { paths: cardFlipPaths, spec: animation_spec_default4, metadata: metadata4 },
  "check": { paths: checkPaths, spec: animation_spec_default5, metadata: metadata5 },
  "clock": { paths: clockPaths, spec: animation_spec_default6, metadata: metadata6 },
  "creating-file": { paths: creatingFilePaths, spec: animation_spec_default7, metadata: metadata7 },
  "door": { paths: doorPaths, spec: animation_spec_default8, metadata: metadata8 },
  "download": { paths: downloadPaths, spec: animation_spec_default9, metadata: metadata9 },
  "external-link": { paths: externalLinkPaths, spec: animation_spec_default10, metadata: metadata10 },
  "eye": { paths: eyePaths, spec: animation_spec_default11, metadata: metadata11 },
  "heart": { paths: heartPaths, spec: animation_spec_default12, metadata: metadata12 },
  "help": { paths: helpPaths, spec: animation_spec_default13, metadata: metadata13 },
  "layers": { paths: layersPaths, spec: animation_spec_default14, metadata: metadata14 },
  "refresh": { paths: refreshPaths, spec: animation_spec_default15, metadata: metadata15 },
  "search": { paths: searchPaths, spec: animation_spec_default16, metadata: metadata16 },
  "signal": { paths: signalPaths, spec: animation_spec_default17, metadata: metadata17 },
  "user": { paths: userPaths, spec: animation_spec_default18, metadata: metadata18 },
  "wifi": { paths: wifiPaths, spec: animation_spec_default19, metadata: metadata19 }
};

// lib/icon-sources.ts
function getIconSource(slug) {
  return ICON_SOURCES[slug];
}
function listIconSlugs() {
  return Object.keys(ICON_SOURCES).sort();
}

// lib/utils.ts
function slugify(input) {
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function toPascalCase(input) {
  return input.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
}

// lib/generators/types.ts
var DEFAULT_ICON_PROPS = {
  size: 24,
  color: "currentColor",
  strokeWidth: 1.5,
  trigger: "hover",
  speed: 1,
  loop: false,
  delay: 0
};
var DEFAULT_IMPORT_PATH = "@/components/icons";

// lib/generators/shared.ts
function componentName(slug) {
  return toPascalCase(slug);
}
var DEFAULT_ORIGIN = { x: 12, y: 12 };
function stepValues(step) {
  if (step.values && step.values.length > 0) return step.values;
  return [step.from ?? 0, step.to ?? 0];
}
function allSteps(spec) {
  return [
    ...spec.sequences.trigger ?? [],
    ...spec.sequences.continuous ?? [],
    ...spec.sequences.mount ?? []
  ];
}
function isContinuous(spec) {
  return (spec.sequences.continuous?.length ?? 0) > 0;
}
var ROTATE_3D_PROPS = /* @__PURE__ */ new Set(["rotateX", "rotateY"]);
function uses3DTransform(spec) {
  return allSteps(spec).some((s) => ROTATE_3D_PROPS.has(s.property));
}
function perspectiveFor(spec) {
  return spec.perspective ?? 500;
}
function cssEasing(ease) {
  switch (ease) {
    case "linear":
      return "linear";
    case "easeIn":
      return "ease-in";
    case "easeOut":
      return "ease-out";
    case "easeInOut":
      return "ease-in-out";
    case "spring":
      return "cubic-bezier(0.34, 1.56, 0.64, 1)";
    case "bounce":
      return "cubic-bezier(0.22, 1.2, 0.36, 1)";
  }
}
function framerEasing(ease) {
  switch (ease) {
    case "spring":
    case "bounce":
      return `[0.34, 1.56, 0.64, 1]`;
    case "easeIn":
      return `"easeIn"`;
    case "easeOut":
      return `"easeOut"`;
    case "easeInOut":
      return `"easeInOut"`;
    case "linear":
      return `"linear"`;
  }
}

// lib/generators/react.ts
var FRAMER_PROP = {
  rotate: "rotate",
  rotateX: "rotateX",
  rotateY: "rotateY",
  scale: "scale",
  scaleX: "scaleX",
  scaleY: "scaleY",
  translateX: "x",
  translateY: "y",
  opacity: "opacity",
  pathLength: "pathLength",
  strokeWidth: "strokeWidth"
};
var TRANSFORM_PROPS = /* @__PURE__ */ new Set([
  "rotate",
  "rotateX",
  "rotateY",
  "scale",
  "scaleX",
  "scaleY",
  "translateX",
  "translateY"
]);
function restValue(step) {
  if (step.property === "pathLength") return step.to ?? 1;
  return stepValues(step)[0];
}
function animateTarget(step) {
  const values = stepValues(step);
  return `[${values.join(", ")}]`;
}
function buildVariants(elementKey, steps, continuous) {
  const rest = [];
  const active = [];
  const transitions = [];
  for (const step of steps) {
    const prop = FRAMER_PROP[step.property];
    rest.push(`${prop}: ${restValue(step)}`);
    active.push(`${prop}: ${animateTarget(step)}`);
    const repeat = continuous || step.repeat ? "Infinity" : "0";
    const delay = step.delay ? `, delay: ${step.delay} / speed` : "";
    transitions.push(
      `${prop}: { duration: ${step.duration} / speed, ease: ${framerEasing(step.ease)}, repeat: ${repeat}${delay} }`
    );
  }
  return `  const ${elementKey}Variants: Variants = {
    rest: { ${rest.join(", ")} },
    active: {
      ${active.join(",\n      ")},
      transition: { ${transitions.join(", ")} },
    },
  };`;
}
function originStyle(steps) {
  const transform = steps.find((s) => TRANSFORM_PROPS.has(s.property));
  if (!transform) return "";
  const o = transform.origin ?? DEFAULT_ORIGIN;
  return ` style={{ transformBox: "view-box", transformOrigin: "${o.x}px ${o.y}px" } as React.CSSProperties}`;
}
function motionElement(data, id, variantsVar, style) {
  const tag = data.type;
  const motionTag = variantsVar ? `motion.${tag}` : tag;
  const variants = variantsVar ? ` variants={${variantsVar}}${style}` : "";
  const geom = data.type === "path" ? `d="${data.d}"` : data.type === "circle" ? `cx={${data.cx}} cy={${data.cy}} r={${data.r}}` : data.type === "line" ? `x1={${data.x1}} y1={${data.y1}} x2={${data.x2}} y2={${data.y2}}` : `points="${data.points}"`;
  return `        <${motionTag} id="${id}" ${geom}${variants} />`;
}
var reactGenerator = {
  framework: "react",
  displayName: "React",
  fileExtension: "tsx",
  generate(spec, paths, meta, config) {
    const name = componentName(meta.slug);
    const p = config?.props ?? {};
    const size = p.size ?? DEFAULT_ICON_PROPS.size;
    const color = p.color ?? "currentColor";
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const trigger = p.trigger ?? spec.defaultTrigger;
    const speed = p.speed ?? DEFAULT_ICON_PROPS.speed;
    const continuous = isContinuous(spec);
    const is3D = uses3DTransform(spec);
    const animSteps = [
      ...spec.sequences.trigger ?? [],
      ...spec.sequences.continuous ?? []
    ];
    const variantDecls = [];
    const elementMarkup = Object.keys(paths).map((key) => {
      const data = paths[key];
      const id = spec.elements[key]?.id ?? key;
      const steps = animSteps.filter((s) => s.element === key);
      if (steps.length === 0) return motionElement(data, id, null, "");
      variantDecls.push(buildVariants(key, steps, continuous));
      return motionElement(data, id, `${key}Variants`, originStyle(steps));
    });
    const autoActive = continuous || trigger === "autoplay";
    const animateExpr = autoActive ? '"active"' : 'trigger === "click" && clicked ? "active" : "rest"';
    const perspectiveStyle = is3D ? `
      style={{ perspective: "${perspectiveFor(spec)}px" }}` : "";
    const code = `"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";

interface ${name}Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
  trigger?: "hover" | "hoverHold" | "click" | "inView" | "autoplay" | "none";
  speed?: number;
}

/** ${meta.name} \u2014 ${meta.animationDescription} */
export default function ${name}({
  size = ${size},
  color = "${color}",
  strokeWidth = ${strokeWidth},
  trigger = "${trigger}",
  speed = ${speed},
}: ${name}Props) {
  const [clicked, setClicked] = useState(false);

${variantDecls.join("\n\n")}

  const animateState = ${animateExpr};

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="${meta.name} icon"${perspectiveStyle}
      initial="rest"
      animate={animateState}
      whileHover={trigger === "hover" ? "active" : undefined}
      whileInView={trigger === "inView" ? "active" : undefined}
      viewport={trigger === "inView" ? { once: true } : undefined}
      onClick={() => trigger === "click" && setClicked((c) => !c)}
    >
${elementMarkup.join("\n")}
    </motion.svg>
  );
}
`;
    const importPath = config?.importPath ?? DEFAULT_IMPORT_PATH;
    return {
      code,
      fileExtension: "tsx",
      importStatement: `import ${name} from "${importPath}/${name}";`,
      usageSnippet: `<${name} />`,
      dependencies: "npm install motion"
    };
  }
};

// lib/runtime/compile.ts
var TRANSFORM_PROPS2 = /* @__PURE__ */ new Set([
  "rotate",
  "rotateX",
  "rotateY",
  "scale",
  "scaleX",
  "scaleY",
  "translateX",
  "translateY"
]);
function transformValue(property, v) {
  switch (property) {
    case "rotate":
      return `rotate(${v}deg)`;
    case "rotateX":
      return `rotateX(${v}deg)`;
    case "rotateY":
      return `rotateY(${v}deg)`;
    case "scale":
      return `scale(${v})`;
    case "scaleX":
      return `scaleX(${v})`;
    case "scaleY":
      return `scaleY(${v})`;
    case "translateX":
      return `translateX(${v}px)`;
    case "translateY":
      return `translateY(${v}px)`;
    default:
      return "";
  }
}
function keyframeFor(property, v) {
  if (TRANSFORM_PROPS2.has(property)) return { transform: transformValue(property, v) };
  if (property === "opacity") return { opacity: v };
  if (property === "strokeWidth") return { strokeWidth: v };
  if (property === "pathLength") return { strokeDashoffset: 1 - v };
  return {};
}
function buildKeyframes(step) {
  const values = stepValues(step);
  const roundTrip = values.length > 1 && values[0] === values[values.length - 1];
  const holdValues = roundTrip ? values.slice(0, -1) : values;
  return {
    active: values.map((v) => keyframeFor(step.property, v)),
    hold: holdValues.map((v) => keyframeFor(step.property, v))
  };
}
function groupStyle(step, is3D) {
  const origin = step.origin ?? DEFAULT_ORIGIN;
  const style = {
    "transform-box": "view-box",
    "transform-origin": `${origin.x}px ${origin.y}px`
  };
  if (is3D) style["transform-style"] = "preserve-3d";
  return style;
}
function compileSpec(spec, paths) {
  const continuous = isContinuous(spec);
  const is3D = uses3DTransform(spec);
  const animations = [];
  const elements = [];
  for (const elementKey of Object.keys(paths)) {
    const id = spec.elements[elementKey]?.id ?? elementKey;
    const steps = [
      ...(spec.sequences.trigger ?? []).filter((s) => s.element === elementKey).map((step) => ({ step, alwaysLoop: Boolean(step.repeat) })),
      ...(spec.sequences.continuous ?? []).filter((s) => s.element === elementKey).map((step) => ({ step, alwaysLoop: true }))
    ];
    const draw = steps.find((s) => s.step.property === "pathLength");
    let node = {
      kind: "shape",
      data: paths[elementKey],
      id,
      drawKey: draw ? `${id}-draw` : void 0
    };
    if (draw) {
      const kf = buildKeyframes(draw.step);
      animations.push({
        key: `${id}-draw`,
        active: kf.active,
        hold: kf.hold,
        duration: draw.step.duration,
        delay: draw.step.delay ?? 0,
        easing: cssEasing(draw.step.ease),
        alwaysLoop: draw.alwaysLoop
      });
    }
    for (const { step, alwaysLoop } of steps.filter(
      (s) => s.step.property !== "pathLength"
    )) {
      const key = `${id}-${step.property.toLowerCase()}`;
      const kf = buildKeyframes(step);
      animations.push({
        key,
        active: kf.active,
        hold: kf.hold,
        duration: step.duration,
        delay: step.delay ?? 0,
        easing: cssEasing(step.ease),
        alwaysLoop
      });
      node = { kind: "group", key, style: groupStyle(step, is3D), child: node };
    }
    elements.push(node);
  }
  return {
    elements,
    animations,
    continuous,
    is3D,
    perspective: is3D ? perspectiveFor(spec) : null
  };
}

// lib/generators/runtime-template.generated.ts
var FLUX_RUNTIME_TS = '/**\n * Rehover animation runtime \u2014 framework-agnostic, dependency-free, and safe to\n * copy into your project. Every generated icon (Vue/Svelte/Angular/Astro) ships\n * its SVG markup with `data-flux` targets plus a compiled `plan`, then calls\n * `animateIcon(root, plan, props)` from here. All trigger behavior lives in this\n * one file, so it is identical across frameworks.\n *\n * This file has no imports on purpose: it is emitted verbatim next to your icons\n * (as `flux-runtime.ts`) so nothing has to be installed. Tweak it freely.\n */\n\n/** What event starts an icon\'s animation. */\nexport type AnimationTrigger =\n  | "hover"\n  | "hoverHold"\n  | "click"\n  | "inView"\n  | "autoplay"\n  | "none";\n\n/** One element\'s compiled animation, keyed by its `data-flux` target. */\nexport interface StepAnimation {\n  /** Matches the `data-flux` attribute on the element this animates. */\n  key: string;\n  /** Full keyframes (round-trip or destination) for hover/click/inView/autoplay. */\n  active: Keyframe[];\n  /** Rest \u2192 peak keyframes for `hoverHold` (the return is the reverse of this). */\n  hold: Keyframe[];\n  /** Base duration in seconds (before the `speed` prop divides it). */\n  duration: number;\n  /** Base delay in seconds (before `speed`; the `delay` prop is added at runtime). */\n  delay: number;\n  /** CSS timing-function string. */\n  easing: string;\n  /** Loops regardless of the `loop` prop (continuous/`repeat` steps). */\n  alwaysLoop: boolean;\n}\n\n/** What the runtime needs from a compiled plan. */\nexport interface RuntimePlan {\n  /** Per-element animations. */\n  animations: StepAnimation[];\n  /** Whether the icon autostarts (continuous specs). */\n  continuous: boolean;\n}\n\n/** The runtime-tunable props that map to the icon\'s public API. */\nexport interface IconRuntimeProps {\n  trigger: AnimationTrigger;\n  speed: number;\n  loop: boolean;\n  delay: number;\n}\n\n/** Handle returned by {@link animateIcon} for prop updates and teardown. */\nexport interface IconController {\n  /** Re-wire for new props (e.g. the playground changing `trigger`). */\n  update(props: IconRuntimeProps): void;\n  /** Remove all listeners/observers and cancel running animations. */\n  destroy(): void;\n}\n\ntype Variant = "active" | "hold";\n\ninterface Bound {\n  anim: StepAnimation;\n  el: Element;\n}\n\n/** Attach the animation runtime to an already-rendered icon root. */\nexport function animateIcon(\n  root: SVGSVGElement,\n  plan: RuntimePlan,\n  initialProps: IconRuntimeProps,\n): IconController {\n  let props = initialProps;\n\n  // Resolve each animation\'s DOM target once.\n  const bound: Bound[] = [];\n  for (const anim of plan.animations) {\n    const el = root.querySelector(`[data-flux="${anim.key}"]`);\n    if (el) bound.push({ anim, el });\n  }\n\n  // The currently-playing Animation per target (for restart/reverse).\n  const current = new Map<string, Animation>();\n  const cleanups: Array<() => void> = [];\n  let observer: IntersectionObserver | null = null;\n\n  function makeAnimation(b: Bound, variant: Variant): Animation {\n    const { anim } = b;\n    const keyframes = variant === "hold" ? anim.hold : anim.active;\n    const loops = variant === "active" && (anim.alwaysLoop || props.loop);\n    return b.el.animate(keyframes, {\n      duration: (anim.duration / props.speed) * 1000,\n      delay: ((anim.delay + props.delay) / props.speed) * 1000,\n      easing: anim.easing,\n      fill: "forwards",\n      iterations: loops ? Infinity : 1,\n    });\n  }\n\n  /** (Re)start a variant on every target, cancelling any in-flight run. */\n  function play(variant: Variant): void {\n    for (const b of bound) {\n      current.get(b.anim.key)?.cancel();\n      current.set(b.anim.key, makeAnimation(b, variant));\n    }\n  }\n\n  /** Reverse the held pose back to rest (smooth, from the current position). */\n  function reverseToRest(): void {\n    for (const b of bound) {\n      const running = current.get(b.anim.key);\n      if (running) running.reverse();\n    }\n  }\n\n  function on(type: string, handler: EventListener): void {\n    root.addEventListener(type, handler);\n    cleanups.push(() => root.removeEventListener(type, handler));\n  }\n\n  /** Tear down listeners/observers and stop animations (keeps final pose). */\n  function teardown(): void {\n    for (const c of cleanups) c();\n    cleanups.length = 0;\n    observer?.disconnect();\n    observer = null;\n  }\n\n  function setup(): void {\n    teardown();\n\n    // Accessibility reflects interactivity and stays in sync with `trigger`.\n    if (props.trigger === "click") {\n      root.setAttribute("role", "button");\n      root.setAttribute("tabindex", "0");\n    } else {\n      root.setAttribute("role", "img");\n      root.removeAttribute("tabindex");\n    }\n\n    // Continuous specs and autoplay start immediately.\n    if (plan.continuous || props.trigger === "autoplay") play("active");\n\n    switch (props.trigger) {\n      case "hover":\n        on("mouseenter", () => play("active"));\n        on("focus", () => play("active"));\n        break;\n      case "hoverHold":\n        on("mouseenter", () => play("hold"));\n        on("mouseleave", () => reverseToRest());\n        on("focus", () => play("hold"));\n        on("blur", () => reverseToRest());\n        break;\n      case "click":\n        on("click", () => play("active"));\n        on("keydown", (e) => {\n          const key = (e as KeyboardEvent).key;\n          if (key === "Enter" || key === " ") {\n            e.preventDefault();\n            play("active");\n          }\n        });\n        break;\n      case "inView":\n        observer = new IntersectionObserver(\n          (entries) => {\n            if (entries.some((entry) => entry.isIntersecting)) {\n              play("active");\n              observer?.disconnect();\n              observer = null;\n            }\n          },\n          { threshold: 0.5 },\n        );\n        observer.observe(root);\n        break;\n    }\n  }\n\n  setup();\n\n  return {\n    update(next: IconRuntimeProps) {\n      props = next;\n      // Reset every target to rest before re-wiring for the new props.\n      for (const a of current.values()) a.cancel();\n      current.clear();\n      setup();\n    },\n    destroy() {\n      teardown();\n      for (const a of current.values()) a.cancel();\n      current.clear();\n    },\n  };\n}\n';

// lib/generators/vue.ts
var RUNTIME_FILENAME = "rehover-runtime";
function styleAttr(style) {
  const s = Object.entries(style).map(([k, v]) => `${k}: ${v}`).join("; ");
  return s ? ` style="${s}"` : "";
}
function shapeMarkup(node) {
  const draw = node.drawKey ? ` data-flux="${node.drawKey}" pathLength="1" style="stroke-dasharray: 1"` : "";
  const d = node.data;
  switch (d.type) {
    case "path":
      return `<path id="${node.id}" d="${d.d}"${draw} />`;
    case "circle":
      return `<circle id="${node.id}" cx="${d.cx}" cy="${d.cy}" r="${d.r}"${draw} />`;
    case "line":
      return `<line id="${node.id}" x1="${d.x1}" y1="${d.y1}" x2="${d.x2}" y2="${d.y2}"${draw} />`;
    case "polyline":
      return `<polyline id="${node.id}" points="${d.points}"${draw} />`;
  }
}
function nodeMarkup(node, indent) {
  if (node.kind === "shape") return shapeMarkup(node);
  const child = nodeMarkup(node.child, `${indent}  `);
  return `<g data-flux="${node.key}"${styleAttr(node.style)}>
${indent}  ${child}
${indent}</g>`;
}
var vueGenerator = {
  framework: "vue",
  displayName: "Vue 3",
  fileExtension: "vue",
  generate(spec, paths, meta, config) {
    const name = componentName(meta.slug);
    const p = config?.props ?? {};
    const size = p.size ?? DEFAULT_ICON_PROPS.size;
    const color = p.color === "currentColor" || !p.color ? "currentColor" : p.color;
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const trigger = p.trigger ?? spec.defaultTrigger;
    const speed = p.speed ?? DEFAULT_ICON_PROPS.speed;
    const loop = p.loop ?? spec.defaultLoop ?? DEFAULT_ICON_PROPS.loop;
    const delay = p.delay ?? DEFAULT_ICON_PROPS.delay;
    const runtimeImport = `./${RUNTIME_FILENAME}`;
    const plan = compileSpec(spec, paths);
    const body = plan.elements.map((el) => nodeMarkup(el, "      ")).join("\n      ");
    const perspectiveAttr = plan.perspective != null ? `
    style="perspective: ${plan.perspective}px"` : "";
    const runtimePlan = JSON.stringify(
      { continuous: plan.continuous, animations: plan.animations },
      null,
      2
    );
    const code = `<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { animateIcon, type RuntimePlan } from '${runtimeImport}'

interface Props {
  size?:        number
  color?:       string
  strokeWidth?: number
  trigger?:     'hover' | 'hoverHold' | 'click' | 'inView' | 'autoplay' | 'none'
  speed?:       number
  loop?:        boolean
  delay?:       number
}

const props = withDefaults(defineProps<Props>(), {
  size:        ${size},
  color:       '${color}',
  strokeWidth: ${strokeWidth},
  trigger:     '${trigger}',
  speed:       ${speed},
  loop:        ${loop},
  delay:       ${delay},
})

// Keyframes + timing compiled from the icon's animation spec. Identical across
// every framework because they come from the one shared compiler.
const plan: RuntimePlan = ${runtimePlan}

const rootRef = ref<SVGSVGElement | null>(null)
let controller: ReturnType<typeof animateIcon> | null = null

function runtimeProps() {
  return {
    trigger: props.trigger,
    speed: props.speed,
    loop: props.loop,
    delay: props.delay,
  }
}

onMounted(() => {
  if (rootRef.value) controller = animateIcon(rootRef.value, plan, runtimeProps())
})

// Re-wire when an animation-affecting prop changes (e.g. the playground).
watch(
  () => [props.trigger, props.speed, props.loop, props.delay],
  () => controller?.update(runtimeProps()),
)

onUnmounted(() => controller?.destroy())
</script>

<template>
  <svg
    ref="rootRef"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    aria-label="${meta.name} icon"${perspectiveAttr}
  >
      ${body}
  </svg>
</template>
`;
    return {
      code,
      fileExtension: "vue",
      importStatement: `import ${name} from '@/components/icons/${name}.vue';`,
      usageSnippet: `<${name} />`,
      dependencies: "none \u2014 self-contained (no npm install)",
      runtime: { filename: `${RUNTIME_FILENAME}.ts`, code: FLUX_RUNTIME_TS }
    };
  }
};

// lib/generators/index.ts
var ICON_GENERATORS = {
  react: reactGenerator,
  vue: vueGenerator
};
function getIconGenerator(framework) {
  return ICON_GENERATORS[framework];
}

// cli/index.ts
var VERSION = true ? "0.1.0-beta.8" : "0.0.0";
var supportsColor = process.stdout.isTTY && process.env.NO_COLOR === void 0;
var paint = (code, s) => supportsColor ? `\x1B[${code}m${s}\x1B[0m` : s;
var green = (s) => paint("32", s);
var red = (s) => paint("31", s);
var cyan = (s) => paint("36", s);
var yellow = (s) => paint("33", s);
var dim = (s) => paint("2", s);
var bold = (s) => paint("1", s);
function fail(message) {
  console.error(red(`\u2717 ${message}`));
  process.exit(1);
}
function resolveFramework(input) {
  const key = input.trim().toLowerCase();
  const aliases = {
    react: "react",
    next: "react",
    "next.js": "react",
    nextjs: "react",
    vue: "vue",
    vue3: "vue"
  };
  return aliases[key];
}
var FLUX_ICONS_DIR = "rehover";
function detectComponentsDir() {
  const candidates = [
    (0, import_node_path.join)("src", "components"),
    "components",
    (0, import_node_path.join)("app", "components"),
    (0, import_node_path.join)("src", "app", "components")
  ];
  for (const candidate of candidates) {
    if ((0, import_node_fs.existsSync)((0, import_node_path.join)(process.cwd(), candidate))) return candidate;
  }
  return (0, import_node_fs.existsSync)((0, import_node_path.join)(process.cwd(), "src")) ? (0, import_node_path.join)("src", "components") : "components";
}
function resolveOutputDir(outDir) {
  return outDir ?? (0, import_node_path.join)(detectComponentsDir(), FLUX_ICONS_DIR);
}
function outputPath(slug, ext, dir) {
  const fileBase = toPascalCase(slug);
  return (0, import_node_path.join)(process.cwd(), dir, `${fileBase}.${ext}`);
}
function ask(question) {
  const rl = (0, import_node_readline.createInterface)({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}
async function promptFramework() {
  const keys = Object.keys(ICON_GENERATORS);
  if (!process.stdin.isTTY) return keys[0];
  console.log(`
${bold("Which framework?")}`);
  keys.forEach((key, i) => {
    console.log(`  ${cyan(String(i + 1))}) ${ICON_GENERATORS[key].displayName}`);
  });
  const answer = await ask(`
${dim(`Select [1-${keys.length}, default 1]:`)} `);
  if (answer === "") return keys[0];
  const num = Number(answer);
  if (Number.isInteger(num) && num >= 1 && num <= keys.length) {
    return keys[num - 1];
  }
  const resolved = resolveFramework(answer);
  if (resolved && keys.includes(resolved)) return resolved;
  console.log(
    yellow(`Unrecognized choice \u2014 defaulting to ${ICON_GENERATORS[keys[0]].displayName}.`)
  );
  return keys[0];
}
function rel(absPath) {
  return absPath.replace(`${process.cwd()}\\`, "").replace(`${process.cwd()}/`, "").replace(/\\/g, "/");
}
function parseArgs(argv) {
  const args = {
    icons: [],
    force: false,
    help: false,
    version: false
  };
  let frameworkRaw;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--version" || a === "-v") args.version = true;
    else if (a === "--force") args.force = true;
    else if (a === "--framework" || a === "-f") frameworkRaw = argv[++i] ?? "";
    else if (a.startsWith("--framework=")) frameworkRaw = a.slice("--framework=".length);
    else if (a === "--out" || a === "-o") args.outDir = argv[++i];
    else if (a.startsWith("--out=")) args.outDir = a.slice("--out=".length);
    else if (a.startsWith("-")) fail(`Unknown option "${a}". Run \`rehover --help\`.`);
    else if (!args.command) args.command = a;
    else args.icons.push(a);
  }
  if (frameworkRaw !== void 0) {
    const resolved = resolveFramework(frameworkRaw);
    if (!resolved) {
      fail(
        `Unknown framework "${frameworkRaw}". Available: ${Object.keys(ICON_GENERATORS).join(", ")}.`
      );
    }
    args.framework = resolved;
  }
  return args;
}
function printHelp() {
  console.log(`
${bold("Rehover")} ${dim(`v${VERSION}`)} \u2014 animated icons for every framework

${bold("Usage")}
  ${cyan("npx @rehover/icons add <icon...> [options]")}

${bold("Commands")}
  ${cyan("add <icon...>")}   Add one or more icons to your project
  ${cyan("list")}            List every available icon

${bold("Options")}
  ${cyan("-f, --framework")}   react | vue ${dim("(prompts if omitted)")}
  ${cyan("-o, --out")}         Output directory ${dim("(default: <components>/rehover, auto-detected)")}
  ${cyan("    --force")}       Overwrite existing files
  ${cyan("-h, --help")}        Show this help
  ${cyan("-v, --version")}     Show the version

${bold("Examples")}
  ${dim("$")} npx @rehover/icons add bell
  ${dim("$")} npx @rehover/icons add clock heart --framework vue
  ${dim("$")} npx @rehover/icons add download --out src/icons
`);
}
function printList() {
  const slugs = listIconSlugs();
  console.log(`
${bold(`${slugs.length} icons available`)}
`);
  for (const slug of slugs) {
    const meta = ICON_SOURCES[slug].metadata;
    console.log(`  ${cyan(slug.padEnd(12))} ${dim(meta.description)}`);
  }
  console.log(`
${dim("Add one with:")} npx @rehover/icons add ${slugs[0]}
`);
}
async function add(args) {
  if (args.icons.length === 0) {
    fail("No icon specified. Try `rehover add bell` or `rehover list`.");
  }
  const framework = args.framework ?? await promptFramework();
  const generator = getIconGenerator(framework);
  if (!generator) {
    fail(`Unknown framework "${framework}".`);
  }
  const outDir = resolveOutputDir(args.outDir);
  let written = 0;
  let depsNote = "";
  const runtimesWritten = /* @__PURE__ */ new Set();
  for (const name of args.icons) {
    const slug = slugify(name);
    const source = getIconSource(slug);
    if (!source) {
      console.error(
        red(`\u2717 Unknown icon "${name}".`) + dim(" Run `rehover list` to see what's available.")
      );
      continue;
    }
    const output = generator.generate(source.spec, source.paths, source.metadata);
    const dest = outputPath(slug, output.fileExtension, outDir);
    if ((0, import_node_fs.existsSync)(dest) && !args.force) {
      console.log(
        yellow(`\u2022 Skipped ${rel(dest)}`) + dim(" (already exists \u2014 use --force to overwrite)")
      );
      continue;
    }
    (0, import_node_fs.mkdirSync)((0, import_node_path.dirname)(dest), { recursive: true });
    (0, import_node_fs.writeFileSync)(dest, output.code);
    console.log(green(`\u2713 ${rel(dest)}`) + dim(`  (${generator.displayName})`));
    written++;
    depsNote = output.dependencies;
    if (output.runtime && !runtimesWritten.has(output.runtime.filename)) {
      runtimesWritten.add(output.runtime.filename);
      const runtimeDest = (0, import_node_path.join)(process.cwd(), outDir, output.runtime.filename);
      if (!(0, import_node_fs.existsSync)(runtimeDest)) {
        (0, import_node_fs.mkdirSync)((0, import_node_path.dirname)(runtimeDest), { recursive: true });
        (0, import_node_fs.writeFileSync)(runtimeDest, output.runtime.code);
        console.log(green(`\u2713 ${rel(runtimeDest)}`) + dim("  (shared runtime)"));
      }
    }
  }
  if (written > 0) {
    console.log();
    console.log(dim("Dependencies: ") + depsNote);
    console.log(dim("Done.") + ` Added ${written} icon${written === 1 ? "" : "s"}.`);
  }
}
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.version) {
    console.log(VERSION);
    return;
  }
  if (args.help || !args.command) {
    printHelp();
    return;
  }
  switch (args.command) {
    case "add":
      await add(args);
      break;
    case "list":
    case "ls":
      printList();
      break;
    default:
      fail(`Unknown command "${args.command}". Run \`rehover --help\`.`);
  }
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
