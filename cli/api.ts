/**
 * Public, framework-agnostic API for Rehover. Lets tools generate native
 * icon components programmatically from the declarative animation specs.
 *
 *   import { ICON_GENERATORS, getIconSource } from "@rehover/icons";
 *
 *   const { spec, paths, metadata } = getIconSource("bell")!;
 *   const file = ICON_GENERATORS.vue.generate(spec, paths, metadata);
 *   // file.code → a complete Bell.vue component
 */
export * from "@/lib/animation-spec";
export {
  GENERATORS,
  ICON_GENERATORS,
  getIconGenerator,
  generateReactCode,
  generateVueCode,
  reactGenerator,
  vueGenerator,
} from "@/lib/generators";
export type {
  GeneratorInput,
  GeneratorOutput,
  GeneratorInterface,
  GeneratorConfig,
  GeneratedFile,
  IconGenerator,
} from "@/lib/generators";
export {
  ICON_SOURCES,
  getIconSource,
  listIconSlugs,
  type IconSource,
} from "@/lib/icon-sources";
