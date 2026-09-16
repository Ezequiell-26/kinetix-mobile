#!/usr/bin/env node
/**
 * Compare two repository evidence snapshots and fail on dangerous regressions.
 * The script can compare JSON snapshots directly or generate snapshots from refs.
 *
 * Usage:
 *   node scripts/ai-evidence-compare.mjs --base .ai/generated/base.json --head .ai/generated/head.json
 *   node scripts/ai-evidence-compare.mjs --base-ref HEAD^1 --head-ref HEAD
 *   node scripts/ai-evidence-compare.mjs --base-ref HEAD^1 --head-ref HEAD --strict
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const value = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const baseFile = value("--base");
const headFile = value("--head");
const baseRef = value("--base-ref");
const headRef = value("--head-ref");
const strict = args.includes("--strict");

function git(command, gitArgs = []) {
  try { return execFileSync("git", [command, ...gitArgs], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 20000 }).trim(); }
  catch { return null; }
}
function readJson(file) { return JSON.parse(fs.readFileSync(path.resolve(ROOT, file), "utf8")); }
function show(ref, file) { return git("show", [`${ref}:${file}`]); }
function list(ref, pattern) {
  const out = git("ls-tree", ["-r", "--name-only", ref]);
  if (!out) return [];
  return out.split("\n").filter(Boolean).filter((p) => pattern.test(p)).sort();
}
function jsonFromRef(ref, file) {
  const text = show(ref, file);
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}
function snapshotFromRef(ref) {
  const pkgFiles = ["package.json", "apps/mobile/package.json", "apps/web/package.json", ...list(ref, /^packages\/[^/]+\/package\.json$/)];
  const packages = pkgFiles.map((file) => {
    const pkg = jsonFromRef(ref, file) || {};
    return { file, name: pkg.name || null, version: pkg.version || null, dependencies: Object.keys(pkg.dependencies || {}).sort(), devDependencies: Object.keys(pkg.devDependencies || {}).sort(), scripts: Object.keys(pkg.scripts || {}).sort() };
  });
  const routes = list(ref, /(^|\/)route\.(ts|tsx|js|jsx)$/);
  const pages = list(ref, /(^|\/)(page|layout)\.(ts|tsx|js|jsx)$/);
  const tests = list(ref, /(test|spec)\.(ts|tsx|js|jsx)$/);
  const schemas = list(ref, /(^|\/)schema\.prisma$|\.sql$/);
  const workflows = list(ref, /^\.github\/workflows\/.*\.(yml|yaml)$/);
  const integrationRefs = list(ref, /(^|\/)(\.ai|\.github)\/.*(integration|provider|skill|instruction)/i);
  const files = list(ref, /\.(ts|tsx|js|jsx|mjs|cjs|json|prisma|sql|yml|yaml)$/);
  const signals = [];
  const patterns = [["TODO", /\bTODO\b/g], ["FIXME", /\bFIXME\b/g], ["MOCK_OR_DEMO", /\b(mock|mocked|demo login|fake success|placeholder)\b/gi], ["ANY", /\bas\s+any\b|:\s*any\b/g], ["DANGEROUS_EVAL", /\beval\s*\(|new Function\s*\(/g], ["SHELL_INTERPOLATION", /exec\s*\([^)]*\$\{|execSync\s*\([^)]*\$\{/g]];
  for (const file of files) {
    const text = show(ref, file) || "";
    for (const [name, re] of patterns) { const count = (text.match(re) || []).length; if (count) signals.push({ signal: name, file, count }); }
  }
  return { ref, packages, routes, pages, tests, schemas, workflows, integrationRefs, signals, counts: { files: files.length, routes: routes.length, pages: pages.length, tests: tests.length, schemas: schemas.length, workflows: workflows.length, packages: packages.length, integrations: integrationRefs.length } };
}

let base;
let head;
if (baseFile && headFile) { base = readJson(baseFile); head = readJson(headFile); }
else if (baseRef && headRef) { base = snapshotFromRef(baseRef); head = snapshotFromRef(headRef); }
else { console.error("Usage requires --base/--head or --base-ref/--head-ref"); process.exit(2); }

const setDiff = (a, b) => ({ added: b.filter((x) => !a.includes(x)), removed: a.filter((x) => !b.includes(x)) });
const routeDiff = setDiff(base.routes || [], head.routes || []);
const pageDiff = setDiff(base.pages || [], head.pages || []);
const testDiff = setDiff(base.tests || [], head.tests || []);
const schemaDiff = setDiff(base.schemas || [], head.schemas || []);
const workflowDiff = setDiff(base.workflows || [], head.workflows || []);
const integrationDiff = setDiff(base.integrationRefs || [], head.integrationRefs || []);

const packageByName = (items) => new Map(items.map((p) => [p.file, p]));
const bp = packageByName(base.packages || []);
const hp = packageByName(head.packages || []);
const dependencyChanges = [];
for (const [file, after] of hp) {
  const before = bp.get(file);
  if (!before) continue;
  const oldDeps = new Set([...(before.dependencies || []), ...(before.devDependencies || [])]);
  const newDeps = new Set([...(after.dependencies || []), ...(after.devDependencies || [])]);
  const added = [...newDeps].filter((x) => !oldDeps.has(x)).sort();
  const removed = [...oldDeps].filter((x) => !newDeps.has(x)).sort();
  if (added.length || removed.length) dependencyChanges.push({ file, added, removed });
}

const signalCount = (snapshot, name) => (snapshot.signals || []).filter((s) => s.signal === name).reduce((n, s) => n + s.count, 0);
const baseHighRisk = signalCount(base, "DANGEROUS_EVAL") + signalCount(base, "SHELL_INTERPOLATION");
const headHighRisk = signalCount(head, "DANGEROUS_EVAL") + signalCount(head, "SHELL_INTERPOLATION");
const removedCritical = [...routeDiff.removed, ...schemaDiff.removed].filter((p) => /(^|\/)(api\/|schema\.prisma$)|\.sql$/.test(p));

const warnings = [];
const blockers = [];
if (headHighRisk > baseHighRisk) blockers.push(`High-risk execution signal increased from ${baseHighRisk} to ${headHighRisk}.`);
if (removedCritical.length) blockers.push(`Critical route/schema files were removed: ${removedCritical.join(", ")}`);
if ((head.counts?.tests ?? 0) < (base.counts?.tests ?? 0)) warnings.push(`Test-file count decreased from ${base.counts.tests} to ${head.counts.tests}.`);
if ((head.counts?.routes ?? 0) < (base.counts?.routes ?? 0)) warnings.push(`Route count decreased from ${base.counts.routes} to ${head.counts.routes}.`);
if ((head.counts?.schemas ?? 0) < (base.counts?.schemas ?? 0)) warnings.push(`Schema/SQL file count decreased from ${base.counts.schemas} to ${head.counts.schemas}.`);
if (dependencyChanges.length) warnings.push(`Dependency manifests changed in ${dependencyChanges.length} package(s). Review compatibility and lockfiles.`);
if (integrationDiff.removed.length) warnings.push(`Integration/skill reference files removed: ${integrationDiff.removed.join(", ")}`);

const result = {
  schemaVersion: 1,
  base: base.ref || base.git?.commit || "UNKNOWN",
  head: head.ref || head.git?.commit || "UNKNOWN",
  delta: {
    counts: Object.fromEntries(Object.entries(head.counts || {}).map(([k, v]) => [k, v - (base.counts?.[k] || 0)])),
    routes: routeDiff,
    pages: pageDiff,
    tests: testDiff,
    schemas: schemaDiff,
    workflows: workflowDiff,
    integrations: integrationDiff,
    dependencyChanges,
    blockers,
    warnings,
  },
  pass: blockers.length === 0 && (!strict || warnings.length === 0),
};
console.log(JSON.stringify(result, null, 2));
if (blockers.length || (strict && warnings.length)) process.exitCode = 1;
