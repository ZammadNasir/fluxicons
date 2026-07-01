#!/usr/bin/env node
"use strict";

// cli/index.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_node_readline = require("node:readline");

// icons/badge-check/paths.ts
var badgeCheckPaths = {
  badge: { type: "circle", cx: 12, cy: 12, r: 9 },
  check: { type: "path", d: "M8 12.5l2.5 2.5L16 9" }
};

// icons/badge-check/animation.spec.ts
var badgeCheckSpec = {
  elements: {
    badge: { id: "badge", description: "The badge disc that flips in 3D." },
    check: { id: "badge-check-check", description: "The checkmark that draws on." }
  },
  sequences: {
    // The disc flips a full turn around the Y axis (coin flip). The checkmark
    // flips with it AND draws itself on — so its path sits inside a 3D wrapper
    // (preserve-3d) while also running a pathLength draw.
    trigger: [
      {
        element: "badge",
        property: "rotateY",
        values: [0, 360],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      },
      {
        element: "check",
        property: "rotateY",
        values: [0, 360],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      },
      {
        element: "check",
        property: "pathLength",
        from: 0,
        to: 1,
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut"
      }
    ]
  },
  defaultTrigger: "hover",
  perspective: 600
};
var animation_spec_default = badgeCheckSpec;

// icons/badge-check/metadata.ts
var metadata = {
  name: "BadgeCheck",
  slug: "badge-check",
  category: "Status",
  tags: ["badge", "check", "verified", "flip", "3d", "success"],
  featured: false,
  description: "A badge that flips to reveal a checkmark drawing on.",
  animationDescription: "The disc flips a full turn in 3D while the checkmark draws itself on."
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
    // card flips forward as one rigid surface (3D rotation around the X axis).
    trigger: [
      {
        element: "card",
        property: "rotateX",
        values: [0, 180, 360],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      },
      {
        element: "line",
        property: "rotateX",
        values: [0, 180, 360],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "hover",
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
  animationDescription: "The card rotates a full turn around its horizontal axis (a 3D flip)."
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
  defaultTrigger: "hover"
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
  defaultTrigger: "hover",
  perspective: 500
};
var animation_spec_default7 = doorSpec;

// icons/door/metadata.ts
var metadata7 = {
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
  // Arrow shaft + head as a single two-subpath stroke.
  arrow: { type: "path", d: "M12 3v12 M7 10l5 5 5-5" },
  baseline: { type: "path", d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }
};

// icons/download/animation.spec.ts
var downloadSpec = {
  elements: {
    arrow: { id: "download-arrow", description: "Download arrow" },
    baseline: { id: "download-baseline", description: "Baseline" }
  },
  sequences: {
    trigger: [
      {
        element: "arrow",
        property: "translateY",
        values: [0, 3, 0],
        duration: 0.4,
        ease: "easeInOut"
      },
      {
        element: "baseline",
        property: "opacity",
        values: [1, 0.3, 1],
        duration: 0.4,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default8 = downloadSpec;

// icons/download/metadata.ts
var metadata8 = {
  name: "Download",
  slug: "download",
  category: "Interface",
  tags: ["download", "save", "import", "arrow", "export"],
  featured: false,
  description: "A download arrow with a baseline tray.",
  animationDescription: "The arrow dips down and bounces back while the baseline pulses."
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
var animation_spec_default9 = heartSpec;

// icons/heart/metadata.ts
var metadata9 = {
  name: "Heart",
  slug: "heart",
  category: "Social",
  tags: ["heart", "like", "love", "favorite", "save"],
  featured: true,
  description: "A heart for likes, favorites, and saves.",
  animationDescription: "A springy heartbeat pulse while the stroke briefly thickens."
};

// icons/loader/paths.ts
var loaderPaths = {
  arc: { type: "path", d: "M21 12a9 9 0 1 1-6.219-8.56" }
};

// icons/loader/animation.spec.ts
var loaderSpec = {
  elements: {
    arc: { id: "loader-arc", description: "Spinning arc" }
  },
  sequences: {
    continuous: [
      {
        element: "arc",
        property: "rotate",
        from: 0,
        to: 360,
        duration: 1,
        ease: "linear",
        repeat: true,
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "autoplay",
  alwaysLoop: true
};
var animation_spec_default10 = loaderSpec;

// icons/loader/metadata.ts
var metadata10 = {
  name: "Loader",
  slug: "loader",
  category: "Status",
  tags: ["loader", "loading", "spinner", "progress", "wait"],
  featured: true,
  description: "A spinner for loading and pending states.",
  animationDescription: "Continuously rotates; hovering doubles the spin speed."
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
var animation_spec_default11 = searchSpec;

// icons/search/metadata.ts
var metadata11 = {
  name: "Search",
  slug: "search",
  category: "Interface",
  tags: ["search", "find", "magnifier", "lookup", "explore"],
  featured: false,
  description: "A magnifying glass for search and discovery.",
  animationDescription: "The lens pulses, then the whole glass jiggles left-right once."
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
var animation_spec_default12 = userSpec;

// icons/user/metadata.ts
var metadata12 = {
  name: "User",
  slug: "user",
  category: "Uncategorized",
  tags: [],
  featured: false,
  description: "TODO: one-line description for User.",
  animationDescription: "TODO: describe what the animation does."
};

// lib/icon-sources.generated.ts
var ICON_SOURCES = {
  "badge-check": { paths: badgeCheckPaths, spec: animation_spec_default, metadata },
  "ball": { paths: ballPaths, spec: animation_spec_default2, metadata: metadata2 },
  "bell": { paths: bellPaths, spec: animation_spec_default3, metadata: metadata3 },
  "card-flip": { paths: cardFlipPaths, spec: animation_spec_default4, metadata: metadata4 },
  "check": { paths: checkPaths, spec: animation_spec_default5, metadata: metadata5 },
  "clock": { paths: clockPaths, spec: animation_spec_default6, metadata: metadata6 },
  "door": { paths: doorPaths, spec: animation_spec_default7, metadata: metadata7 },
  "download": { paths: downloadPaths, spec: animation_spec_default8, metadata: metadata8 },
  "heart": { paths: heartPaths, spec: animation_spec_default9, metadata: metadata9 },
  "loader": { paths: loaderPaths, spec: animation_spec_default10, metadata: metadata10 },
  "search": { paths: searchPaths, spec: animation_spec_default11, metadata: metadata11 },
  "user": { paths: userPaths, spec: animation_spec_default12, metadata: metadata12 }
};

// lib/icon-sources.ts
function getIconSource(slug) {
  return ICON_SOURCES[slug];
}
function listIconSlugs() {
  return Object.keys(ICON_SOURCES).sort();
}

// lib/utils.ts
function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
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
function distributePercentages(count) {
  if (count <= 1) return [0];
  return Array.from(
    { length: count },
    (_, i) => roundTo(i / (count - 1) * 100, 2)
  );
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
function renderSvgElement(data, attrs, selfClose = true) {
  const end = selfClose ? " />" : ">";
  switch (data.type) {
    case "path":
      return `<path${attrs} d="${data.d}"${end}`;
    case "circle":
      return `<circle${attrs} cx="${data.cx}" cy="${data.cy}" r="${data.r}"${end}`;
    case "line":
      return `<line${attrs} x1="${data.x1}" y1="${data.y1}" x2="${data.x2}" y2="${data.y2}"${end}`;
    case "polyline":
      return `<polyline${attrs} points="${data.points}"${end}`;
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
  trigger?: "hover" | "click" | "inView" | "autoplay" | "none";
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

// lib/generators/vue.ts
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
function cssFrameValue(step, value) {
  switch (step.property) {
    case "rotate":
      return `transform: rotate(${value}deg);`;
    case "rotateX":
      return `transform: rotateX(${value}deg);`;
    case "rotateY":
      return `transform: rotateY(${value}deg);`;
    case "scale":
      return `transform: scale(${value});`;
    case "scaleX":
      return `transform: scaleX(${value});`;
    case "scaleY":
      return `transform: scaleY(${value});`;
    case "translateX":
      return `transform: translateX(${value}px);`;
    case "translateY":
      return `transform: translateY(${value}px);`;
    case "opacity":
      return `opacity: ${value};`;
    case "strokeWidth":
      return `stroke-width: ${value};`;
    case "pathLength":
      return `stroke-dashoffset: ${1 - value};`;
  }
}
function buildStepCss(step, className, preserve3D) {
  const values = stepValues(step);
  const percents = distributePercentages(values.length);
  const frames = values.map((v, i) => `  ${percents[i]}% { ${cssFrameValue(step, v)} }`).join("\n");
  const origin = step.origin ?? DEFAULT_ORIGIN;
  const isTransform = TRANSFORM_PROPS2.has(step.property);
  const isDraw = step.property === "pathLength";
  const lines = [
    isTransform ? "  transform-box: view-box;" : null,
    isTransform ? `  transform-origin: ${origin.x}px ${origin.y}px;` : null,
    // Keep the 3D rendering context alive down the wrapper chain so the SVG
    // root's perspective reaches nested 3D rotations.
    isTransform && preserve3D ? "  transform-style: preserve-3d;" : null,
    isDraw ? "  stroke-dasharray: 1;" : null,
    `  animation-name: ${className};`,
    "  animation-fill-mode: forwards;",
    `  animation-timing-function: ${cssEasing(step.ease)};`
  ].filter(Boolean);
  const keyframes = `@keyframes ${className} {
${frames}
}`;
  const classBlock = `.${className} {
${lines.join("\n")}
}`;
  return `${keyframes}

${classBlock}`;
}
function vueStepStyleBinding(step, alwaysLoop) {
  return `:style="stepStyle(${step.duration}, ${step.delay ?? 0}, ${alwaysLoop})"`;
}
function renderVueElement(elementKey, paths, spec, cssBlocks) {
  const data = paths[elementKey];
  const id = spec.elements[elementKey]?.id ?? elementKey;
  const preserve3D = uses3DTransform(spec);
  const steps = [
    ...(spec.sequences.trigger ?? []).filter((s) => s.element === elementKey).map((step) => ({ step, alwaysLoop: Boolean(step.repeat) })),
    ...(spec.sequences.continuous ?? []).filter((s) => s.element === elementKey).map((step) => ({ step, alwaysLoop: true }))
  ];
  const draw = steps.find((s) => s.step.property === "pathLength");
  let shapeAttrs = ` id="${id}"`;
  if (draw) {
    const className = `flux-${id}-draw`;
    cssBlocks.push(buildStepCss(draw.step, className, preserve3D));
    shapeAttrs += ` pathLength="1" :class="{ '${className}': isAnimating }" ${vueStepStyleBinding(draw.step, draw.alwaysLoop)}`;
  }
  let markup = renderSvgElement(data, shapeAttrs);
  for (const { step, alwaysLoop } of steps.filter(
    (s) => s.step.property !== "pathLength"
  )) {
    const className = `flux-${id}-${step.property.toLowerCase()}`;
    cssBlocks.push(buildStepCss(step, className, preserve3D));
    markup = `<g :class="{ '${className}': isAnimating }" ${vueStepStyleBinding(step, alwaysLoop)}>
        ${markup.split("\n").join("\n        ")}
      </g>`;
  }
  return markup;
}
var VUE_PROPS_BLOCK = `interface Props {
  size?:        number
  color?:       string
  strokeWidth?: number
  trigger?:     'hover' | 'click' | 'inView' | 'autoplay' | 'none'
  speed?:       number
  loop?:        boolean
  delay?:       number
}`;
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
    const loop = p.loop ?? DEFAULT_ICON_PROPS.loop;
    const delay = p.delay ?? DEFAULT_ICON_PROPS.delay;
    const continuous = isContinuous(spec);
    const is3D = uses3DTransform(spec);
    const cssBlocks = [];
    const body = Object.keys(paths).map((key) => renderVueElement(key, paths, spec, cssBlocks)).join("\n      ");
    const perspectiveAttr = is3D ? `
    style="perspective: ${perspectiveFor(spec)}px"` : "";
    const autoStart = continuous || trigger === "autoplay";
    const styleBlock = cssBlocks.length > 0 ? `

<style scoped>
${cssBlocks.join("\n\n")}
</style>` : "";
    const code = `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

${VUE_PROPS_BLOCK}

const props = withDefaults(defineProps<Props>(), {
  size:        ${size},
  color:       '${color}',
  strokeWidth: ${strokeWidth},
  trigger:     '${trigger}',
  speed:       ${speed},
  loop:        ${loop},
  delay:       ${delay},
})

const rootRef = ref<SVGSVGElement | null>(null)
const isAnimating = ref(${autoStart ? "true" : "false"})

/**
 * Inline timing for one animation step, reacting to the speed/delay/loop props.
 * \`alwaysLoop\` is true for continuous/repeating steps that must loop no matter
 * what the \`loop\` prop is.
 */
function stepStyle(duration: number, stepDelay: number, alwaysLoop: boolean) {
  return {
    animationDuration: \`\${duration / props.speed}s\`,
    animationDelay: \`\${(stepDelay + props.delay) / props.speed}s\`,
    animationIterationCount: alwaysLoop || props.loop ? 'infinite' : '1',
  }
}

function play() {
  // Restart the CSS animation: drop the class, let the browser paint at least
  // one frame without it (a single rAF isn't enough \u2014 Vue's DOM flush and the
  // re-add can coalesce into the same frame), then re-add it.
  isAnimating.value = false
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isAnimating.value = true
    })
  })
}

function handleClick() {
  if (props.trigger === 'click') play()
}

function handleEnter() {
  if (props.trigger === 'hover') play()
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (props.trigger === 'autoplay'${continuous ? " || true" : ""}) play()

  if (props.trigger === 'inView' && rootRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play()
          observer?.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(rootRef.value)
  }
})

onUnmounted(() => observer?.disconnect())
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
    @mouseenter="handleEnter"
    @click="handleClick"
  >
      ${body}
  </svg>
</template>${styleBlock}
`;
    const importStatement = `import ${name} from '@/components/icons/${name}.vue';`;
    const usageSnippet = `<${name} />`;
    return {
      code,
      fileExtension: "vue",
      importStatement,
      usageSnippet,
      dependencies: "none \u2014 uses CSS animations only"
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
var VERSION = true ? "0.1.0-beta.5" : "0.0.0";
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
var FLUX_ICONS_DIR = "flux-icons";
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
    else if (a.startsWith("-")) fail(`Unknown option "${a}". Run \`fluxicons --help\`.`);
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
${bold("FluxIcons")} ${dim(`v${VERSION}`)} \u2014 animated icons for every framework

${bold("Usage")}
  ${cyan("npx @zammadnasir/fluxicons add <icon...> [options]")}

${bold("Commands")}
  ${cyan("add <icon...>")}   Add one or more icons to your project
  ${cyan("list")}            List every available icon

${bold("Options")}
  ${cyan("-f, --framework")}   react | vue ${dim("(prompts if omitted)")}
  ${cyan("-o, --out")}         Output directory ${dim("(default: <components>/flux-icons, auto-detected)")}
  ${cyan("    --force")}       Overwrite existing files
  ${cyan("-h, --help")}        Show this help
  ${cyan("-v, --version")}     Show the version

${bold("Examples")}
  ${dim("$")} npx @zammadnasir/fluxicons add bell
  ${dim("$")} npx @zammadnasir/fluxicons add clock heart --framework vue
  ${dim("$")} npx @zammadnasir/fluxicons add download --out src/icons
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
${dim("Add one with:")} npx @zammadnasir/fluxicons add ${slugs[0]}
`);
}
async function add(args) {
  if (args.icons.length === 0) {
    fail("No icon specified. Try `fluxicons add bell` or `fluxicons list`.");
  }
  const framework = args.framework ?? await promptFramework();
  const generator = getIconGenerator(framework);
  if (!generator) {
    fail(`Unknown framework "${framework}".`);
  }
  const outDir = resolveOutputDir(args.outDir);
  let written = 0;
  let depsNote = "";
  for (const name of args.icons) {
    const slug = slugify(name);
    const source = getIconSource(slug);
    if (!source) {
      console.error(
        red(`\u2717 Unknown icon "${name}".`) + dim(" Run `fluxicons list` to see what's available.")
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
      fail(`Unknown command "${args.command}". Run \`fluxicons --help\`.`);
  }
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
