/**
 * Animation parity check. Guards the core promise of the multi-framework
 * architecture: every framework animates from the SAME compiled keyframes.
 *
 *   1. Invariants — every compiled animation is well-formed.
 *   2. Determinism — compiling a spec twice yields identical output.
 *   3. Cross-framework parity — the Vue generator embeds exactly the compiler's
 *      animations (React's <FluxIcon> calls the same compiler directly), so the
 *      two frameworks cannot drift.
 *   4. Golden snapshot — the compiled keyframes match a checked-in baseline, so
 *      an accidental change to the compiler is caught in review. Run with
 *      `--update` to intentionally rewrite the baseline.
 *
 * Run: `tsx scripts/check-animation-parity.ts [--update]`
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { ICON_SOURCES } from "@/lib/icon-sources.generated";
import { compileSpec, type StepAnimation } from "@/lib/runtime/compile";
import { vueGenerator } from "@/lib/generators/vue";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GOLDEN = join(root, "lib", "runtime", "__golden__", "keyframes.json");
const update = process.argv.includes("--update");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

const failures: string[] = [];
const fail = (slug: string, msg: string) => failures.push(`${slug}: ${msg}`);

/** Extract the `RuntimePlan` JSON the Vue generator embeds in its SFC. */
function extractVuePlan(code: string): { animations: StepAnimation[] } {
  const match = code.match(/const plan: RuntimePlan = ([\s\S]*?)\n\nconst rootRef/);
  if (!match) throw new Error("could not find embedded RuntimePlan in Vue output");
  return JSON.parse(match[1]);
}

const signatures: Record<string, StepAnimation[]> = {};

for (const [slug, source] of Object.entries(ICON_SOURCES).sort()) {
  const plan = compileSpec(source.spec, source.paths);
  signatures[slug] = plan.animations;

  // 1. Invariants.
  const seen = new Set<string>();
  for (const a of plan.animations) {
    if (seen.has(a.key)) fail(slug, `duplicate data-flux key "${a.key}"`);
    seen.add(a.key);
    if (a.active.length === 0) fail(slug, `"${a.key}" has no active keyframes`);
    if (a.hold.length === 0) fail(slug, `"${a.key}" has no hold keyframes`);
    if (a.duration <= 0) fail(slug, `"${a.key}" has non-positive duration`);
    if (!a.easing) fail(slug, `"${a.key}" has no easing`);
  }

  // 2. Determinism.
  const again = compileSpec(source.spec, source.paths).animations;
  if (JSON.stringify(again) !== JSON.stringify(plan.animations)) {
    fail(slug, "compileSpec is non-deterministic");
  }

  // 3. Cross-framework parity: Vue's embedded plan === the compiler's output.
  try {
    const vue = extractVuePlan(
      vueGenerator.generate(source.spec, source.paths, source.metadata).code,
    );
    if (JSON.stringify(vue.animations) !== JSON.stringify(plan.animations)) {
      fail(slug, "Vue generator keyframes differ from the compiler (DRIFT)");
    }
  } catch (err) {
    fail(slug, `Vue parity check failed: ${(err as Error).message}`);
  }
}

// 4. Golden snapshot.
const current = JSON.stringify(signatures, null, 2);
if (update) {
  mkdirSync(dirname(GOLDEN), { recursive: true });
  writeFileSync(GOLDEN, `${current}\n`);
  console.log(`${GREEN}✓ Updated golden baseline${RESET} (${GOLDEN})`);
} else if (!existsSync(GOLDEN)) {
  mkdirSync(dirname(GOLDEN), { recursive: true });
  writeFileSync(GOLDEN, `${current}\n`);
  console.log(`${GREEN}✓ Wrote initial golden baseline${RESET} (${GOLDEN})`);
} else if (readFileSync(GOLDEN, "utf8").trim() !== current.trim()) {
  fail("golden", "compiled keyframes changed — review, then re-run with --update");
}

const count = Object.keys(signatures).length;
if (failures.length > 0) {
  console.error(`${RED}✗ Animation parity: ${failures.length} problem(s)${RESET}`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`${GREEN}✓ Animation parity: ${count} icons in sync across frameworks${RESET}`);
