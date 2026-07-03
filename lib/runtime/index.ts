/**
 * The framework-agnostic Rehover runtime. Every framework wrapper renders its
 * own SVG markup (with `data-flux` targets) and calls {@link animateIcon} to
 * drive it, so trigger behavior and keyframes are defined exactly once here.
 */
export { compileSpec } from "./compile";
export type {
  AnimationPlan,
  RenderNode,
  RenderGroup,
  RenderShape,
  StepAnimation,
} from "./compile";
export { animateIcon } from "./animate-icon";
export type {
  IconController,
  IconRuntimeProps,
  RuntimePlan,
} from "./animate-icon";
