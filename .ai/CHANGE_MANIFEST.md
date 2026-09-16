# Change Manifest Workflow

Before changing code, edit `.ai/CHANGE_MANIFEST.json` with the actual task scope. The manifest is checked against the commit diff in CI.

`allowedPaths` must cover the intended change. `forbiddenPaths` must never be touched. Any high-risk path requires `approvedHighRisk: true` plus explicit human/maintainer approval before merge.

Keep the manifest current for the commit being tested. Do not leave a previous task's scope active on a new change.
