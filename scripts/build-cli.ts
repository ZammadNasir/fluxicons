/**
 * Bundles the FluxIcons CLI and public API into self-contained CommonJS files
 * under dist/. Everything (generators, icon specs, path data) is inlined so the
 * published binary runs in any project with plain Node — no `@/` path-alias or
 * React runtime is needed.
 */
import { build } from "esbuild";
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { generateRegistry } from "./generate-registry";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as {
  version: string;
};

async function run(): Promise<void> {
  // Refresh the icon registries from the filesystem before bundling.
  const slugs = generateRegistry(root);
  console.log(`Bundling CLI for ${slugs.length} icons...`);

  rmSync(resolve(root, "dist"), { recursive: true, force: true });
  await build({
    entryPoints: {
      "cli/index": resolve(root, "cli/index.ts"),
      index: resolve(root, "cli/api.ts"),
    },
    outdir: resolve(root, "dist"),
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    tsconfig: resolve(root, "tsconfig.json"),
    define: { __FLUX_VERSION__: JSON.stringify(pkg.version) },
    // Keep node built-ins external; everything else is inlined.
    banner: { js: "" },
    logLevel: "info",
  });
  console.log(`\x1b[32m✓ Built dist/cli/index.js and dist/index.js (v${pkg.version})\x1b[0m`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
