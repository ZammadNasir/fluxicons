"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { AnimationSpec, IconPaths } from "@/lib/animation-spec";
import type { IconProps } from "@/lib/icon-registry";
import { compileSpec, type RenderNode, type RenderShape } from "../compile";
import { animateIcon } from "../animate-icon";

/**
 * The one React renderer behind every FluxIcon. It compiles the spec into a
 * framework-agnostic plan, renders the SVG markup with `data-flux` targets, and
 * hands the root to the shared runtime. Each icon component is then a ~5-line
 * wrapper — no per-icon animation code to drift.
 */
export interface FluxIconProps extends IconProps {
  /** Display name, used for the default `aria-label`. */
  name: string;
  paths: IconPaths;
  spec: AnimationSpec;
}

/** kebab-case CSS keys → camelCase for a React style object. */
function toReactStyle(style: Record<string, string>): CSSProperties {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(style)) {
    out[k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = v;
  }
  return out as CSSProperties;
}

function renderShape(node: RenderShape): ReactNode {
  const draw = node.drawKey
    ? { "data-flux": node.drawKey, pathLength: 1, style: { strokeDasharray: 1 } }
    : {};
  const d = node.data;
  switch (d.type) {
    case "path":
      return <path id={node.id} d={d.d} {...draw} />;
    case "circle":
      return <circle id={node.id} cx={d.cx} cy={d.cy} r={d.r} {...draw} />;
    case "line":
      return <line id={node.id} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} {...draw} />;
    case "polyline":
      return <polyline id={node.id} points={d.points} {...draw} />;
  }
}

function renderNode(node: RenderNode): ReactNode {
  if (node.kind === "shape") return renderShape(node);
  return (
    <g data-flux={node.key} style={toReactStyle(node.style)}>
      {renderNode(node.child)}
    </g>
  );
}

export const FluxIcon = forwardRef<SVGSVGElement, FluxIconProps>(function FluxIcon(
  {
    name,
    paths,
    spec,
    size = 24,
    color = "currentColor",
    strokeWidth = 1.5,
    trigger = spec.defaultTrigger,
    speed = 1,
    loop = spec.defaultLoop ?? false,
    delay = 0,
    className,
    style,
    "aria-label": ariaLabel,
  },
  ref,
) {
  const plan = useMemo(() => compileSpec(spec, paths), [spec, paths]);
  const innerRef = useRef<SVGSVGElement | null>(null);

  const setRef = useCallback(
    (node: SVGSVGElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const controller = animateIcon(el, plan, { trigger, speed, loop, delay });
    return () => controller.destroy();
  }, [plan, trigger, speed, loop, delay]);

  const rootStyle: CSSProperties = {
    ...style,
    ...(plan.perspective != null ? { perspective: `${plan.perspective}px` } : {}),
  };

  return (
    <svg
      ref={setRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel ?? `${name} icon`}
      className={className}
      style={rootStyle}
    >
      {plan.elements.map((el, i) => (
        <g key={i}>{renderNode(el)}</g>
      ))}
    </svg>
  );
});

FluxIcon.displayName = "FluxIcon";
