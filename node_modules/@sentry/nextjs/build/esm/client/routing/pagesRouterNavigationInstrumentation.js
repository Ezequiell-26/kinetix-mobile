import { stripUrlQueryAndFragment, SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, SEMANTIC_ATTRIBUTE_SENTRY_OP } from '@sentry/core';
import { startBrowserTracingNavigationSpan, getAbsoluteUrl, WINDOW } from '@sentry/react';
import RouterImport from 'next/router';
import { URL_TEMPLATE } from '@sentry/conventions/attributes';

const Router = RouterImport.events ? RouterImport : RouterImport.default;
const globalObject = WINDOW;
function pagesRouterInstrumentNavigation(client) {
  Router.events.on("routeChangeStart", (navigationTarget) => {
    const strippedNavigationTarget = stripUrlQueryAndFragment(navigationTarget);
    const matchedRoute = getNextRouteFromPathname(strippedNavigationTarget);
    let newLocation;
    let spanSource;
    if (matchedRoute) {
      newLocation = matchedRoute;
      spanSource = "route";
    } else {
      newLocation = strippedNavigationTarget;
      spanSource = "url";
    }
    startBrowserTracingNavigationSpan(
      client,
      {
        name: newLocation,
        attributes: {
          [SEMANTIC_ATTRIBUTE_SENTRY_OP]: "navigation",
          [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.navigation.nextjs.pages_router_instrumentation",
          [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: spanSource,
          ...spanSource === "route" && { [URL_TEMPLATE]: newLocation }
        }
      },
      { url: getAbsoluteUrl(navigationTarget) }
    );
  });
}
function getNextRouteFromPathname(pathname) {
  const pageRoutes = globalObject.__BUILD_MANIFEST?.sortedPages;
  if (!pageRoutes) {
    return;
  }
  return pageRoutes.find((route) => {
    const routeRegExp = convertNextRouteToRegExp(route);
    return pathname.match(routeRegExp);
  });
}
function convertNextRouteToRegExp(route) {
  const routeParts = route.split("/");
  let optionalCatchallWildcardRegex = "";
  if (routeParts[routeParts.length - 1]?.match(/^\[\[\.\.\..+\]\]$/)) {
    routeParts.pop();
    optionalCatchallWildcardRegex = "(?:/(.+?))?";
  }
  const rejoinedRouteParts = routeParts.map(
    (routePart) => routePart.replace(/^\[\.\.\..+\]$/, "(.+?)").replace(/^\[.*\]$/, "([^/]+?)")
    // Replace route wildcards with lazy regex wildcards
  ).join("/");
  return new RegExp(
    `^${rejoinedRouteParts}${optionalCatchallWildcardRegex}(?:/)?$`
    // optional slash at the end
  );
}

export { pagesRouterInstrumentNavigation };
//# sourceMappingURL=pagesRouterNavigationInstrumentation.js.map
