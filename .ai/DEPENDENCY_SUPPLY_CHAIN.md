# Dependency & Supply-Chain Policy

KinetixFitt may add npm packages, GitHub repositories, SDKs, and APIs only after recording the decision in `.ai/INTEGRATION_REGISTRY.md` when they cross an integration boundary.

## Required review

Before adoption, verify:

- exact package/repository and version;
- license and whether the intended commercial use is permitted;
- source/release provenance;
- maintenance/activity and known advisories;
- transitive dependency impact;
- browser/mobile/desktop compatibility;
- bundle/runtime cost;
- data collection and telemetry behavior;
- secret/credential requirements;
- uninstall/rollback path;
- tests proving the package is actually used as intended.

## Lockfile policy

- `package-lock.json` changes must accompany intentional dependency changes.
- Do not update a lockfile without a corresponding manifest change unless repairing a known reproducibility issue and documenting it.
- CI installs with lockfiles and should reject uncontrolled drift.
- Production dependencies must not be introduced solely for development tooling.

## External repositories

MIT licensing is not itself proof of security, quality, compatibility, or maintenance. Search for the smallest maintained component that satisfies the requirement, isolate it behind an adapter, and keep the application's domain code independent from provider-specific types.
