import type { BasicTracerProvider } from '@opentelemetry/sdk-trace-base';
import { ServerRuntimeClient } from '@sentry/core';
import type { VercelEdgeClientOptions } from './types';
/**
 * The Sentry Vercel Edge Runtime SDK Client.
 *
 * @see VercelEdgeClientOptions for documentation on configuration options.
 * @see ServerRuntimeClient for usage documentation.
 */
export declare class VercelEdgeClient extends ServerRuntimeClient<VercelEdgeClientOptions> {
    traceProvider: BasicTracerProvider | undefined;
    /**
     * Creates a new Vercel Edge Runtime SDK instance.
     * @param options Configuration options for this SDK.
     */
    constructor(options: VercelEdgeClientOptions);
    flush(timeout?: number): Promise<boolean>;
}
//# sourceMappingURL=client.d.ts.map