"use client";

import { forwardRef } from "react";
import type { IconProps } from "@/lib/icon-registry";
import { FluxIcon } from "@/lib/runtime/react/flux-icon";
import creatingFileSpec from "./animation.spec";
import { creatingFilePaths } from "./paths";

/**
 * CreatingFile — a document with animated content lines.
 * Animation: the document remains still while its content lines softly pulse in sequence, suggesting AI-generated text.
 */
const CreatingFile = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <FluxIcon
    ref={ref}
    name="CreatingFile"
    paths={creatingFilePaths}
    spec={creatingFileSpec}
    speed={0.5}
    {...props}
  />
));

CreatingFile.displayName = "CreatingFile";
export default CreatingFile;
