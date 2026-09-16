#!/usr/bin/env node
/**
 * Dependency-free smoke contract for CI. It verifies that expected platform
 * entry points and governance files still exist without pretending to prove
 * native runtime behavior.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  '.ai/AI_CONTROL_CENTER.md',
  '.ai/AI_ENGINEERING_SYSTEM.md',
  '.ai/FEATURE_LEDGER.md',
  '.ai/INTEGRATION_REGISTRY.md',
  '.ai/PERFORMANCE_BASELINES.md',
  '.ai/CHANGE_MANIFEST.json',
  '.ai/API_CONTRACTS.md',
  '.ai/AUTHORIZATION_MATRIX.md',
  '.ai/PLATFORM_MATRIX.md',
  '.github/workflows/ci.yml',
  'apps/mobile/package.json',
  'apps/web/package.json'
];
const missing = required.filter(file => !fs.existsSync(path.join(root, file)));
const report = { required, missing, pass: missing.length === 0 };
console.log(JSON.stringify(report, null, 2));
if (!report.pass) process.exit(1);
