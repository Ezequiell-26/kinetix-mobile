import type { Span } from '@sentry/core';
/**
 * Handles the on span start event for Next.js spans.
 * This function is used to enhance the span with additional information such as the route, the method, the headers, etc.
 * It is called for every span that is started by Next.js.
 * @param span The span that is starting.
 */
export declare function handleOnSpanStart(span: Span): void;
//# sourceMappingURL=handleOnSpanStart.d.ts.map