#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  getIconSource,
  listIconSlugs,
  ICON_SOURCES,
} from "@/lib/icon-sources";
import { getIconGenerator, ICON_GENERATORS } from "@/lib/generators";
import { slugify, toPascalCase } from "@/lib/utils";

/** Injected at build time from package.json. */
declare const __FLUX_VERSION__: string;
const VERSION =
  typeof __FLUX_VERSION__ !== "undefined" ? __FLUX_VERSION__ : "0.0.0";

/* -------------------------------- styling --------------------------------- */

const supportsColor = process.stdout.isTTY && process.env.NO_COLOR === undefined;
const paint = (code: string, s: string) =>
  supportsColor ? `\x1b[${code}m${s}\x1b[0m` : s;
const green = (s: string) => paint("32", s);
const red = (s: string) => paint("31", s);
const cyan = (s: string) => paint("36", s);
const yellow = (s: string) => paint("33", s);
const dim = (s: string) => paint("2", s);
const bold = (s: string) => paint("1", s);

function fail(message: string): never {
  console.error(red(`✗ ${message}`));
  process.exit(1);
}

/* ------------------------------ framework map ----------------------------- */

/** Normalize a framework alias to a canonical generator key. */
function resolveFramework(input: string): string | undefined {
  const key = input.trim().toLowerCase();
  const aliases: Record<string, string> = {
    react: "react",
    next: "react",
    "next.js": "react",
    nextjs: "react",
    vue: "vue",
    vue3: "vue",
  };
  return aliases[key];
}

/** Default output location for a generated file in the user's project. */
function outputPath(slug: string, ext: string, outDir?: string): string {
  const fileBase = toPascalCase(slug);
  const dir = outDir ?? "components/icons";
  return join(process.cwd(), dir, `${fileBase}.${ext}`);
}

/** Make a path relative to cwd for display. */
function rel(absPath: string): string {
  return absPath.replace(`${process.cwd()}\\`, "").replace(`${process.cwd()}/`, "").replace(/\\/g, "/");
}

/* ------------------------------- arg parsing ------------------------------ */

interface Args {
  command?: string;
  icons: string[];
  framework: string;
  outDir?: string;
  force: boolean;
  help: boolean;
  version: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    icons: [],
    framework: "react",
    force: false,
    help: false,
    version: false,
  };
  let frameworkRaw = "react";

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

  const resolved = resolveFramework(frameworkRaw);
  if (!resolved) {
    fail(
      `Unknown framework "${frameworkRaw}". Available: ${Object.keys(ICON_GENERATORS).join(", ")}.`,
    );
  }
  args.framework = resolved;
  return args;
}

/* --------------------------------- output --------------------------------- */

function printHelp(): void {
  console.log(`
${bold("FluxIcons")} ${dim(`v${VERSION}`)} — animated icons for every framework

${bold("Usage")}
  ${cyan("npx @zammadnasir/fluxicons add <icon...> [options]")}

${bold("Commands")}
  ${cyan("add <icon...>")}   Add one or more icons to your project
  ${cyan("list")}            List every available icon

${bold("Options")}
  ${cyan("-f, --framework")}   react | vue ${dim("(default: react)")}
  ${cyan("-o, --out")}         Output directory ${dim("(default: components/icons)")}
  ${cyan("    --force")}       Overwrite existing files
  ${cyan("-h, --help")}        Show this help
  ${cyan("-v, --version")}     Show the version

${bold("Examples")}
  ${dim("$")} npx @zammadnasir/fluxicons add bell
  ${dim("$")} npx @zammadnasir/fluxicons add clock heart --framework vue
  ${dim("$")} npx @zammadnasir/fluxicons add download --out src/icons
`);
}

function printList(): void {
  const slugs = listIconSlugs();
  console.log(`\n${bold(`${slugs.length} icons available`)}\n`);
  for (const slug of slugs) {
    const meta = ICON_SOURCES[slug].metadata;
    console.log(`  ${cyan(slug.padEnd(12))} ${dim(meta.description)}`);
  }
  console.log(`\n${dim("Add one with:")} npx @zammadnasir/fluxicons add ${slugs[0]}\n`);
}

/* --------------------------------- add ------------------------------------ */

function add(args: Args): void {
  if (args.icons.length === 0) {
    fail("No icon specified. Try `fluxicons add bell` or `fluxicons list`.");
  }

  const generator = getIconGenerator(args.framework);
  if (!generator) {
    fail(`Unknown framework "${args.framework}".`);
  }

  let written = 0;
  let depsNote = "";

  for (const name of args.icons) {
    const slug = slugify(name);
    const source = getIconSource(slug);
    if (!source) {
      console.error(
        red(`✗ Unknown icon "${name}".`) +
          dim(" Run `fluxicons list` to see what's available."),
      );
      continue;
    }

    const output = generator!.generate(source.spec, source.paths, source.metadata);
    const dest = outputPath(slug, output.fileExtension, args.outDir);

    if (existsSync(dest) && !args.force) {
      console.log(
        yellow(`• Skipped ${rel(dest)}`) + dim(" (already exists — use --force to overwrite)"),
      );
      continue;
    }

    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, output.code);
    console.log(green(`✓ ${rel(dest)}`) + dim(`  (${generator!.displayName})`));
    written++;
    depsNote = output.dependencies;
  }

  if (written > 0) {
    console.log();
    console.log(dim("Dependencies: ") + depsNote);
    console.log(dim("Done.") + ` Added ${written} icon${written === 1 ? "" : "s"}.`);
  }
}

/* --------------------------------- main ----------------------------------- */

function main(): void {
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
      add(args);
      break;
    case "list":
    case "ls":
      printList();
      break;
    default:
      fail(`Unknown command "${args.command}". Run \`fluxicons --help\`.`);
  }
}

main();
