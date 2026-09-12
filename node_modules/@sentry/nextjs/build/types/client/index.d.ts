import type { Client } from '@sentry/core';
import type { BrowserOptions } from '@sentry/react';
export * from '@sentry/react';
export * from '../common';
export { captureUnderscoreErrorException } from '../common/pages-router-instrumentation/_error';
export { startSpan, startSpanManual, startInactiveSpan } from '../common/utils/nextSpan';
export { browserTracingIntegration } from './browserTracingIntegration';
export { captureRouterTransitionStart } from './routing/appRouterRoutingInstrumentation';
/** Inits the Sentry NextJS SDK on the browser with the React SDK. */
export declare function init(options: BrowserOptions): Client | undefined;
/**
 * Just a passthrough in case this is imported from the client.
 */
export declare function withSentryConfig<T>(exportedUserNextConfig: T): T;
//# sourceMappingURL=index.d.ts.map