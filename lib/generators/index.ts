import type { GeneratorInterface, IconGenerator } from "./types";
import { reactUsage, reactGenerator } from "./react";
import { vueUsage, vueGenerator } from "./vue";
import { reactNativeUsage, reactNativeGenerator } from "./react-native";
import { flutterUsage, flutterGenerator } from "./flutter";

/**
 * Usage-snippet generators powering the playground code panel, in tab order.
 * Each emits a short, reactive snippet for the current playground state.
 */
export const GENERATORS: GeneratorInterface[] = [
  reactUsage,
  vueUsage,
  reactNativeUsage,
  flutterUsage,
];

/**
 * Full-source generators powering the CLI, keyed by framework. Each reads an
 * icon's framework-agnostic {@link import("@/lib/animation-spec").AnimationSpec}
 * and emits a complete, native component file.
 */
export const ICON_GENERATORS: Record<string, IconGenerator> = {
  react: reactGenerator,
  vue: vueGenerator,
  "react-native": reactNativeGenerator,
  flutter: flutterGenerator,
};

/** Resolve a full-source generator by framework name. */
export function getIconGenerator(framework: string): IconGenerator | undefined {
  return ICON_GENERATORS[framework];
}

export type {
  GeneratorInput,
  GeneratorOutput,
  GeneratorInterface,
  GeneratorConfig,
  GeneratedFile,
  IconGenerator,
} from "./types";
export { generateReactCode, reactUsage, reactGenerator } from "./react";
export { generateVueCode, vueUsage, vueGenerator } from "./vue";
export {
  generateReactNativeCode,
  reactNativeUsage,
  reactNativeGenerator,
} from "./react-native";
export { generateFlutterCode, flutterUsage, flutterGenerator } from "./flutter";
