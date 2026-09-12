import { GLOBAL_OBJ, debug } from '@sentry/core';
import { DEBUG_BUILD } from '../../common/debug-build.js';

const globalWithInjectedManifest = GLOBAL_OBJ;
let cachedManifest = null;
let cachedManifestString = void 0;
const compiledRegexCache = /* @__PURE__ */ new Map();
const routeResultCache = /* @__PURE__ */ new Map();
function getRouteSpecificity(routePath) {
  const segments = routePath.split("/").filter(Boolean);
  let score = 0;
  for (const segment of segments) {
    if (segment.startsWith(":")) {
      const paramName = segment.substring(1);
      if (paramName.endsWith("*?")) {
        score += 1e3;
      } else if (paramName.endsWith("*")) {
        score += 100;
      } else {
        score += 10;
      }
    }
  }
  if (segments.length > 0) {
    const segmentCountPenalty = 1 / segments.length;
    score += segmentCountPenalty;
  }
  return score;
}
function getCompiledRegex(regexString) {
  if (compiledRegexCache.has(regexString)) {
    return compiledRegexCache.get(regexString) ?? null;
  }
  try {
    const regex = new RegExp(regexString);
    compiledRegexCache.set(regexString, regex);
    return regex;
  } catch (error) {
    DEBUG_BUILD && debug.warn("Could not compile regex", { regexString, error });
    return null;
  }
}
function getManifest() {
  if (!globalWithInjectedManifest?._sentryRouteManifest || typeof globalWithInjectedManifest._sentryRouteManifest !== "string") {
    return null;
  }
  const currentManifestString = globalWithInjectedManifest._sentryRouteManifest;
  if (cachedManifest && cachedManifestString === currentManifestString) {
    return cachedManifest;
  }
  compiledRegexCache.clear();
  routeResultCache.clear();
  let manifest = {
    staticRoutes: [],
    dynamicRoutes: [],
    isrRoutes: []
  };
  try {
    manifest = JSON.parse(currentManifestString);
    if (!Array.isArray(manifest.staticRoutes) || !Array.isArray(manifest.dynamicRoutes)) {
      return null;
    }
    cachedManifest = manifest;
    cachedManifestString = currentManifestString;
    return manifest;
  } catch {
    DEBUG_BUILD && debug.warn("Could not extract route manifest");
    return null;
  }
}
function findMatchingRoutes(route, staticRoutes, dynamicRoutes) {
  const matches = [];
  if (staticRoutes.some((r) => r.path === route)) {
    return matches;
  }
  for (const dynamicRoute of dynamicRoutes) {
    if (dynamicRoute.regex) {
      const regex = getCompiledRegex(dynamicRoute.regex);
      if (regex?.test(route)) {
        matches.push(dynamicRoute.path);
      }
    }
  }
  if (!route.startsWith("/:")) {
    for (const dynamicRoute of dynamicRoutes) {
      if (dynamicRoute.hasOptionalPrefix && dynamicRoute.regex) {
        const routeWithPrefix = route === "/" ? "/SENTRY_OPTIONAL_PREFIX" : `/SENTRY_OPTIONAL_PREFIX${route}`;
        const regex = getCompiledRegex(dynamicRoute.regex);
        if (regex?.test(routeWithPrefix)) {
          matches.push(dynamicRoute.path);
        }
      }
    }
  }
  return matches;
}
const maybeParameterizeRoute = (route) => {
  const manifest = getManifest();
  if (!manifest) {
    return void 0;
  }
  const normalizedRoute = route.length > 1 && route.endsWith("/") ? route.slice(0, -1) : route;
  if (routeResultCache.has(normalizedRoute)) {
    return routeResultCache.get(normalizedRoute);
  }
  const { staticRoutes, dynamicRoutes } = manifest;
  if (!Array.isArray(staticRoutes) || !Array.isArray(dynamicRoutes)) {
    return void 0;
  }
  const matches = findMatchingRoutes(normalizedRoute, staticRoutes, dynamicRoutes);
  const result = matches.sort((a, b) => getRouteSpecificity(a) - getRouteSpecificity(b))[0];
  routeResultCache.set(normalizedRoute, result);
  return result;
};

export { getManifest, maybeParameterizeRoute };
//# sourceMappingURL=parameterization.js.map
