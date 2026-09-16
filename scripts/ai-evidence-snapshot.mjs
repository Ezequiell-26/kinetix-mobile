#!/usr/bin/env node
/**
 * Generate a deterministic evidence snapshot for the current checkout.
 * No dependencies. Designed for local agents and CI.
 *
 * Usage:
 *   node scripts/ai-evidence-snapshot.mjs
 *   node scripts/ai-evidence-snapshot.mjs --json
 *   node scripts/ai-evidence-snapshot.mjs --out .ai/generated/evidence.json
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const json = args.includes("--json");
const outIndex = args.indexOf("--out");
const outPath = outIndex >= 0 ? args[outIndex + 1] : null;

const IGNORE = new Set([".git", "node_modules", ".next", "dist", "build", "coverage", ".turbo", ".cache", ".vercel", "target", "vendor"]);
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".prisma", ".sql", ".yml", ".yaml"]);
const SENSITIVE = /(^|\/)(\.env($|\.)|.*\.(pem|key|p12|pfx)$)/i;

function git(command, gitArgs = []) {
  try {
    return execFileSync("git", [command, ...gitArgs], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 10000 }).trim();
  } catch {
    return null;
  }
}
function rel(file) { return path.relative(ROOT, file).split(path.sep).join("/"); }
function walk(dir, result = []) {
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORE.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, result);
    else if (EXT.has(path.extname(entry.name).toLowerCase())) result.push(full);
  }
  return result;
}
function read(file) { try { return fs.readFileSync(file, "utf8"); } catch { return ""; } }
function jsonFile(file) { try { return JSON.parse(read(path.join(ROOT, file))); } catch { return null; } }

const files = walk(ROOT);
const tracked = (git("ls-files", ["-z"]) || "").split("\0").filter(Boolean);
const packages = ["package.json", "apps/mobile/package.json", "apps/web/package.json", ...files.map(rel).filter((p) => /^packages\/[^/]+\/package\.json$/.test(p))]
  .filter((p, i, a) => a.indexOf(p) === i)
  .filter((p) => fs.existsSync(path.join(ROOT, p)))
  .map((file) => { const pkg = jsonFile(file) || {}; return { file, name: pkg.name || null, version: pkg.version || null, dependencies: Object.keys(pkg.dependencies || {}).sort(), devDependencies: Object.keys(pkg.devDependencies || {}).sort(), scripts: Object.keys(pkg.scripts || {}).sort() }; });

const source = files.filter((f) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f));
const routes = files.filter((f) => /(^|\/)route\.(ts|tsx|js|jsx)$/.test(f)).map(rel).sort();
const pages = files.filter((f) => /(^|\/)(page|layout)\.(ts|tsx|js|jsx)$/.test(f)).map(rel).sort();
const tests = files.filter((f) => /(test|spec)\.(ts|tsx|js|jsx)$/.test(f) || /(^|\/)tests?\//.test(rel(f))).map(rel).sort();
const schemas = files.filter((f) => /(^|\/)schema\.prisma$/.test(f) || /\.sql$/.test(f)).map(rel).sort();
const workflows = files.filter((f) => /^\.github\/workflows\/.*\.(yml|yaml)$/.test(rel(f))).map(rel).sort();
const integrationRefs = files.filter((f) => /(^|\/)\.(ai|github)\//.test(rel(f)) && /integration|provider|skill|instruction/i.test(rel(f))).map(rel).sort();

const envNames = new Set();
for (const f of source) {
  const text = read(f);
  for (const m of text.matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)) envNames.add(m[1]);
  for (const m of text.matchAll(/process\.env\[\s*["'`]([A-Z][A-Z0-9_]*)["'`]\s*\]/g)) envNames.add(m[1]);
}

const signals = [];
const patterns = [
  ["TODO", /\bTODO\b/g],
  ["FIXME", /\bFIXME\b/g],
  ["MOCK_OR_DEMO", /\b(mock|mocked|demo login|fake success|placeholder)\b/gi],
  ["ANY", /\bas\s+any\b|:\s*any\b/g],
  ["DANGEROUS_EVAL", /\beval\s*\(|new Function\s*\(/g],
  ["SHELL_INTERPOLATION", /exec\s*\([^)]*\$\{|execSync\s*\([^)]*\$\{/g],
];
for (const f of source) {
  const text = read(f);
  for (const [name, re] of patterns) {
    const count = (text.match(re) || []).length;
    if (count) signals.push({ signal: name, file: rel(f), count });
  }
}

const sensitiveTracked = tracked.filter((f) => SENSITIVE.test(f)).sort();
const branch = git("branch", ["--show-current"]) || "DETACHED_OR_UNKNOWN";
const commit = git("rev-parse", ["HEAD"]) || "UNKNOWN";
const parent = git("rev-parse", ["HEAD^1"]);
const status = git("status", ["--porcelain=v1"]) || "";
const tree = git("rev-parse", ["HEAD^{tree}"]) || "UNKNOWN";

const snapshot = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  evidenceLevel: "E2_STATIC",
  git: { branch, commit, parent, tree, clean: status === "", status },
  counts: { scannedFiles: files.length, sourceFiles: source.length, routes: routes.length, pages: pages.length, tests: tests.length, schemas: schemas.length, workflows: workflows.length, packages: packages.length, envNames: envNames.size },
  packages,
  routes,
  pages,
  tests,
  schemas,
  workflows,
  integrationRefs,
  envNames: [...envNames].sort(),
  sensitiveTracked,
  riskSignals: signals,
  claims: { runtimeVerified: false, productionObserved: false, externalProvidersVerified: false, performanceMeasured: false },
  notes: ["Static snapshot only. It does not prove runtime, provider, deployment, device, or production behavior.", "Use the comparison script to classify material deltas against the parent snapshot."]
};

if (outPath) {
  const absolute = path.resolve(ROOT, outPath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, JSON.stringify(snapshot, null, 2) + "\n");
}

if (json || outPath) process.stdout.write(JSON.stringify(snapshot, null, 2) + "\n");
else {
  console.log(`KinetixFitt evidence snapshot`);
  console.log(`Branch: ${branch}`);
  console.log(`Commit: ${commit}`);
  console.log(`Files: ${files.length} | Source: ${source.length} | Routes: ${routes.length} | Tests: ${tests.length} | Schemas: ${schemas.length}`);
  console.log(`Risk signals: ${signals.length} | Tracked sensitive-looking files: ${sensitiveTracked.length}`);
}
