import type { SentryBuildOptions } from '../types';
/**
 * Migrates deprecated top-level webpack options to the new `webpack.*` path for backward compatibility.
 * The new path takes precedence over deprecated options. This mutates the userSentryOptions object.
 */
export declare function migrateDeprecatedWebpackOptions(userSentryOptions: SentryBuildOptions): void;
//# sourceMappingURL=deprecatedWebpackOptions.d.ts.map