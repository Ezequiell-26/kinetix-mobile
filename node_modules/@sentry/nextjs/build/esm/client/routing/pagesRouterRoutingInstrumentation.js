import { parseBaggageHeader, browserPerformanceTimeOrigin, SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, SEMANTIC_ATTRIBUTE_SENTRY_OP, debug } from '@sentry/core';
import { WINDOW, startBrowserTracingPageLoadSpan } from '@sentry/react';
import { DEBUG_BUILD } from '../../common/debug-build.js';
import { URL_TEMPLATE } from '@sentry/conventions/attributes';

const globalObject = WINDOW;
function extractNextDataTagInformation() {
  let nextData;
  const nextDataTag = globalObject.document.getElementById("__NEXT_DATA__");
  if (nextDataTag?.innerHTML) {
    try {
      nextData = JSON.parse(nextDataTag.innerHTML);
    } catch {
      DEBUG_BUILD && debug.warn("Could not extract __NEXT_DATA__");
    }
  }
  if (!nextData) {
    return {};
  }
  const nextDataTagInfo = {};
  const { page, query, props } = nextData;
  nextDataTagInfo.route = page;
  nextDataTagInfo.params = query;
  if (props?.pageProps) {
    nextDataTagInfo.sentryTrace = props.pageProps._sentryTraceData;
    nextDataTagInfo.baggage = props.pageProps._sentryBaggage;
  }
  return nextDataTagInfo;
}
function pagesRouterInstrumentPageLoad(client) {
  const { route, params, sentryTrace, baggage } = extractNextDataTagInformation();
  const parsedBaggage = parseBaggageHeader(baggage);
  let name = route || globalObject.location.pathname;
  if (parsedBaggage?.["sentry-transaction"] && name === "/_error") {
    name = parsedBaggage["sentry-transaction"];
    name = name.replace(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS|TRACE|CONNECT)\s+/i, "");
  }
  const origin = browserPerformanceTimeOrigin();
  startBrowserTracingPageLoadSpan(
    client,
    {
      name,
      // pageload should always start at timeOrigin (and needs to be in s, not ms)
      startTime: origin ? origin / 1e3 : void 0,
      attributes: {
        [SEMANTIC_ATTRIBUTE_SENTRY_OP]: "pageload",
        [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.pageload.nextjs.pages_router_instrumentation",
        [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: route ? "route" : "url",
        ...route && { [URL_TEMPLATE]: route },
        ...params && { ...params }
      }
    },
    { sentryTrace, baggage }
  );
}

export { pagesRouterInstrumentPageLoad };
//# sourceMappingURL=pagesRouterRoutingInstrumentation.js.map
