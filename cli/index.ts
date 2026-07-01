#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline";
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

/** Name of the folder FluxIcons creates inside the project's components dir. */
const FLUX_ICONS_DIR = "flux-icons";

/**
 * Find the project's existing components directory, checking the conventional
 * locations across frameworks (Next.js with/without `src/`, Vite, etc.). Falls
 * back to a sensible spot to create one when none exists yet.
 */
function detectComponentsDir(): string {
  const candidates = [
    join("src", "components"),
    "components",
    join("app", "components"),
    join("src", "app", "components"),
  ];
  for (const candidate of candidates) {
    if (existsSync(join(process.cwd(), candidate))) return candidate;
  }
  // No components folder yet — put one where the project keeps its source.
  return existsSync(join(process.cwd(), "src"))
    ? join("src", "components")
    : "components";
}

/** Resolve the directory icons are written to (honoring an explicit --out). */
function resolveOutputDir(outDir?: string): string {
  return outDir ?? join(detectComponentsDir(), FLUX_ICONS_DIR);
}

/** Default output location for a generated file in the user's project. */
function outputPath(slug: string, ext: string, dir: string): string {
  const fileBase = toPascalCase(slug);
  return join(process.cwd(), dir, `${fileBase}.${ext}`);
}

/* ------------------------------- prompting -------------------------------- */

/** Ask a single question on stdin and resolve with the trimmed answer. */
function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Prompt the user to pick a framework. Accepts a number, name, or alias; an
 * empty answer takes the first option. Falls back to the first framework in
 * non-interactive environments (no TTY).
 */
async function promptFramework(): Promise<string> {
  const keys = Object.keys(ICON_GENERATORS);

  if (!process.stdin.isTTY) return keys[0];

  console.log(`\n${bold("Which framework?")}`);
  keys.forEach((key, i) => {
    console.log(`  ${cyan(String(i + 1))}) ${ICON_GENERATORS[key].displayName}`);
  });

  const answer = await ask(`\n${dim(`Select [1-${keys.length}, default 1]:`)} `);
  if (answer === "") return keys[0];

  const num = Number(answer);
  if (Number.isInteger(num) && num >= 1 && num <= keys.length) {
    return keys[num - 1];
  }

  const resolved = resolveFramework(answer);
  if (resolved && keys.includes(resolved)) return resolved;

  console.log(
    yellow(`Unrecognized choice — defaulting to ${ICON_GENERATORS[keys[0]].displayName}.`),
  );
  return keys[0];
}

/** Make a path relative to cwd for display. */
function rel(absPath: string): string {
  return absPath.replace(`${process.cwd()}\\`, "").replace(`${process.cwd()}/`, "").replace(/\\/g, "/");
}

/* ------------------------------- arg parsing ------------------------------ */

interface Args {
  command?: string;
  icons: string[];
  /** Resolved framework, or undefined when not provided (prompt for it). */
  framework?: string;
  outDir?: string;
  force: boolean;
  help: boolean;
  version: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    icons: [],
    force: false,
    help: false,
    version: false,
  };
  let frameworkRaw: string | undefined;

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

  // Only resolve when --framework was passed; otherwise leave it unset so the
  // `add` command can prompt for it interactively.
  if (frameworkRaw !== undefined) {
    const resolved = resolveFramework(frameworkRaw);
    if (!resolved) {
      fail(
        `Unknown framework "${frameworkRaw}". Available: ${Object.keys(ICON_GENERATORS).join(", ")}.`,
      );
    }
    args.framework = resolved;
  }
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

async function add(args: Args): Promise<void> {
  if (args.icons.length === 0) {
    fail("No icon specified. Try `fluxicons add bell` or `fluxicons list`.");
  }

  // Ask for the framework when it wasn't passed via --framework.
  const framework = args.framework ?? (await promptFramework());

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
        red(`✗ Unknown icon "${name}".`) +
          dim(" Run `fluxicons list` to see what's available."),
      );
      continue;
    }

    const output = generator!.generate(source.spec, source.paths, source.metadata);
    const dest = outputPath(slug, output.fileExtension, outDir);

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

async function main(): Promise<void> {
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
