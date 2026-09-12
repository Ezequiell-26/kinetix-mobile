import type { RouteManifest } from './types';
export type CreateRouteManifestOptions = {
    appDirPath?: string;
    /**
     * Whether to include route groups (e.g., (auth-layout)) in the final route paths.
     * By default, route groups are stripped from paths following Next.js convention.
     */
    includeRouteGroups?: boolean;
    /**
     * Base path for the application, if any. This will be prefixed to all routes.
     */
    basePath?: string;
};
/**
 * Returns a route manifest for the given app directory
 */
export declare function createRouteManifest(options?: CreateRouteManifestOptions): RouteManifest;
//# sourceMappingURL=createRouteManifest.d.ts.map