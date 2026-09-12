import type { Client } from '@sentry/core';
export declare const INCOMPLETE_APP_ROUTER_INSTRUMENTATION_TRANSACTION_NAME = "incomplete-app-router-transaction";
/** Instruments the Next.js app router for pageloads. */
export declare function appRouterInstrumentPageLoad(client: Client): void;
/** Instruments the Next.js app router for navigation. */
export declare function appRouterInstrumentNavigation(client: Client): void;
/**
 * A handler for Next.js' `onRouterTransitionStart` hook in `instrumentation-client.ts` to record navigation spans in Sentry.
 */
export declare function captureRouterTransitionStart(href: string, navigationType: string): void;
//# sourceMappingURL=appRouterRoutingInstrumentation.d.ts.map