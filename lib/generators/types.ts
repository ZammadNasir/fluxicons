import type { AnimationSpec, IconPaths } from "@/lib/animation-spec";
import type { AnimationTrigger, IconMetadata } from "@/lib/icon-registry";

/** The customizable state of an icon, fed to every code generator. */
export interface GeneratorInput {
  slug: string;
  size: number;
  color: string;
  strokeWidth: number;
  trigger: AnimationTrigger;
  speed: number;
  loop: boolean;
  delay: number;
  /** Import path for the icon component. Default: "@/components/icons". */
  importPath?: string;
}

/** The result of generating code for a single framework. */
export interface GeneratorOutput {
  /** Full, formatted, copy-ready snippet. */
  code: string;
  /** Just the import statement. */
  importLine: string;
  /** Just the JSX/usage line. */
  jsxLine: string;
}

/**
 * Contract every framework generator implements (React and Vue today; future
 * frameworks must satisfy this same interface).
 */
export interface GeneratorInterface {
  /** Stable id, e.g. "react" or "next". */
  id: string;
  /** Human label shown in the code panel tab, e.g. "React". */
  label: string;
  /** Syntax-highlighter language hint, e.g. "tsx". */
  language: string;
  /** Optional one-line note about extra packages this framework needs. */
  dependencies?: string;
  /** Produce code for the given input. */
  generate(input: GeneratorInput): GeneratorOutput;
}

/**
 * Options passed to a full-source {@link IconGenerator}.
 */
export interface GeneratorConfig {
  /** Import path prefix used in generated usage examples. */
  importPath?: string;
  /** Target directory name in the user's project. */
  outputDir?: string;
  /**
   * Live prop values (from the playground) baked into the generated component
   * as its default prop values. Falls back to {@link DEFAULT_ICON_PROPS}.
   */
  props?: Partial<{
    size: number;
    color: string;
    strokeWidth: number;
    trigger: AnimationTrigger;
    speed: number;
  }>;
}

/** The result of generating a full, self-contained component file. */
export interface GeneratedFile {
  /** The complete file content to write. */
  code: string;
  /** File extension to use ("tsx", "vue", "dart", …). */
  fileExtension: string;
  /** The import statement for this icon in the target framework. */
  importStatement: string;
  /** A usage snippet (JSX, template syntax, widget call, …). */
  usageSnippet: string;
  /** One-line note about any extra packages the framework needs. */
  dependencies: string;
}

/**
 * Contract every full-source framework generator implements. Unlike
 * {@link GeneratorInterface} (which emits a usage snippet for the playground),
 * an `IconGenerator` reads the framework-agnostic {@link AnimationSpec} and
 * {@link IconPaths} and emits a complete, native component file — the artifact
 * the CLI writes into a user's project.
 */
export interface IconGenerator {
  /** Stable id, e.g. "react" | "vue". */
  readonly framework: string;
  /** Human label, e.g. "React" | "Vue 3". */
  readonly displayName: string;
  /** File extension for the generated artifact, e.g. "tsx" | "vue". */
  readonly fileExtension: string;

  generate(
    spec: AnimationSpec,
    paths: IconPaths,
    meta: IconMetadata,
    config?: GeneratorConfig,
  ): GeneratedFile;
}

/** Default prop values — props equal to these are omitted from output. */
export const DEFAULT_ICON_PROPS = {
  size: 24,
  color: "currentColor",
  strokeWidth: 1.5,
  trigger: "hover" as AnimationTrigger,
  speed: 1,
  loop: false,
  delay: 0,
} as const;

/** Default import path for generated snippets. */
export const DEFAULT_IMPORT_PATH = "@/components/icons";

/**
 * Maps known hex colors to design-system CSS variables so generated code
 * stays themeable when the user picks a brand color.
 */
export const COLOR_VARIABLE_MAP: Record<string, string> = {
  "#6366f1": "var(--brand)",
};
