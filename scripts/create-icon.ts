/**
 * FluxIcons CLI.
 *
 * Scaffold a NEW icon (framework-agnostic source files):
 *   npm run create-icon -- Clock
 *
 * Act as the end-user `npx fluxicons add` command — generate a native
 * component for a framework from an existing icon's spec:
 *   npm run create-icon -- Bell --framework vue --out components/icons
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getIconSource } from "@/lib/icon-sources";
import { getIconGenerator, ICON_GENERATORS } from "@/lib/generators";
import { getIconMetadata } from "@/lib/icon-registry";

/* ----------------------------- string helpers ---------------------------- */

function toPascalCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function toSlug(input: string): string {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCamelCase(slug: string): string {
  const p = toPascalCase(slug);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

/* -------------------------------- logging --------------------------------- */

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

function fail(message: string): never {
  console.error(`\x1b[31m✗ ${message}\x1b[0m`);
  process.exit(1);
}

function write(path: string, contents: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

/* ------------------------------ arg parsing ------------------------------- */

const argv = process.argv.slice(2);
const positional: string[] = [];
let framework: string | undefined;
let outDir: string | undefined;

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "--framework" || arg === "-f") {
    framework = argv[++i];
  } else if (arg === "--out" || arg === "-o") {
    outDir = argv[++i];
  } else if (arg.startsWith("--framework=")) {
    framework = arg.slice("--framework=".length);
  } else if (arg.startsWith("--out=")) {
    outDir = arg.slice("--out=".length);
  } else {
    positional.push(arg);
  }
}

const rawName = positional[0];
if (!rawName) {
  fail("Usage: npm run create-icon -- <Name> [--framework <react|vue>]");
}

const name = toPascalCase(rawName);
const slug = toSlug(rawName);

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail(`Invalid slug "${slug}". Use lowercase alphanumerics and hyphens only.`);
}

/* ----------------------- mode: generate for framework --------------------- */

if (framework) {
  if (!getIconGenerator(framework)) {
    const known = Object.keys(ICON_GENERATORS).join(", ");
    fail(`Unknown framework "${framework}". Available: ${known}.`);
  }
  const generator = getIconGenerator(framework)!;

  const source = getIconSource(slug);
  const meta = getIconMetadata(slug);
  if (!source || !meta) {
    fail(`Unknown icon "${slug}". Run \`npm run create-icon -- ${name}\` to scaffold it first.`);
  }

  const output = generator.generate(source!.spec, source!.paths, meta!);

  const fileBase = name;
  const dir = outDir ?? "components/icons";
  const outPath = join(process.cwd(), dir, `${fileBase}.${output.fileExtension}`);

  write(outPath, output.code);

  const relPath = `${dir}/${fileBase}.${output.fileExtension}`;
  console.log(green(`✓ Generated ${fileBase}.${output.fileExtension} for ${generator.displayName}`));
  console.log(green(`✓ Written to ${relPath}`));
  console.log("\nImport it:");
  console.log(dim(`  ${output.importStatement}`));
  console.log("\nUse it:");
  console.log(dim(`  ${output.usageSnippet}`));
  console.log("\nDependencies required:");
  console.log(dim(`  ${output.dependencies}`));
  process.exit(0);
}

/* --------------------------- mode: scaffold icon -------------------------- */

const iconDir = join(process.cwd(), "icons", slug);
if (existsSync(iconDir)) {
  fail(`Icon "${slug}" already exists at icons/${slug}/`);
}

const camel = toCamelCase(slug);

const pathsSource = `import type { IconPaths } from "@/lib/animation-spec";

export const ${camel}Paths = {
  // TODO: define this icon's shapes on a 24x24 viewBox.
  shape: { type: "path", d: "M4 12h16" },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
`;

const specSource = `import type { AnimationSpec } from "@/lib/animation-spec";

const ${camel}Spec: AnimationSpec = {
  elements: {
    shape: { id: "${slug}-shape", description: "TODO: describe this element" },
  },
  sequences: {
    trigger: [
      {
        element: "shape",
        property: "scale",
        values: [1, 1.12, 1],
        duration: 0.5,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default ${camel}Spec;
`;

// A fixed thin wrapper: no animation code lives here — it all lives in
// animation.spec.ts, which FluxIcon compiles and every framework shares.
const componentSource = `"use client";

import { forwardRef } from "react";
import type { IconProps } from "@/lib/icon-registry";
import { FluxIcon } from "@/lib/runtime/react/flux-icon";
import ${camel}Spec from "./animation.spec";
import { ${camel}Paths } from "./paths";

/**
 * ${name} — TODO: one-line description.
 * Animation: TODO: describe what the animation does.
 */
const ${name} = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <FluxIcon ref={ref} name="${name}" paths={${camel}Paths} spec={${camel}Spec} {...props} />
));

${name}.displayName = "${name}";
export default ${name};
`;

const metadataSource = `import type { IconMetadata } from "@/lib/icon-registry";

export const metadata: IconMetadata = {
  name: "${name}",
  slug: "${slug}",
  category: "Uncategorized",
  tags: [],
  featured: false,
  description: "TODO: one-line description for ${name}.",
  animationDescription: "TODO: describe what the animation does.",
};
`;

const indexSource = `export { default } from "./${name}";
export { ${camel}Paths, viewBox } from "./paths";
export { default as ${camel}Spec } from "./animation.spec";
export { metadata } from "./metadata";
`;

mkdirSync(iconDir, { recursive: true });
writeFileSync(join(iconDir, "paths.ts"), pathsSource);
writeFileSync(join(iconDir, "animation.spec.ts"), specSource);
writeFileSync(join(iconDir, `${name}.tsx`), componentSource);
writeFileSync(join(iconDir, "metadata.ts"), metadataSource);
writeFileSync(join(iconDir, "index.ts"), indexSource);

console.log(green(`✓ Created icons/${slug}/paths.ts`));
console.log(green(`✓ Created icons/${slug}/animation.spec.ts`));
console.log(green(`✓ Created icons/${slug}/${name}.tsx`));
console.log(green(`✓ Created icons/${slug}/metadata.ts`));
console.log(green(`✓ Created icons/${slug}/index.ts`));
console.log("\nNext:");
console.log(`  1. Define real geometry in icons/${slug}/paths.ts`);
console.log(`  2. Design the animation in icons/${slug}/animation.spec.ts (the .tsx never changes)`);
console.log("  3. Run `npm run generate` — the icon is auto-registered for the");
console.log("     website and the CLI (no manual registry edits needed).");
console.log(`  4. Generate for any framework: npm run create-icon -- ${name} --framework vue`);
