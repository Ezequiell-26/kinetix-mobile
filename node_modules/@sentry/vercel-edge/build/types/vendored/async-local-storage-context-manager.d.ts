import type { Context } from '@opentelemetry/api';
import { AbstractAsyncHooksContextManager } from './abstract-async-hooks-context-manager';
export declare class AsyncLocalStorageContextManager extends AbstractAsyncHooksContextManager {
    private _asyncLocalStorage;
    constructor();
    active(): Context;
    with<A extends unknown[], F extends (...args: A) => ReturnType<F>>(context: Context, fn: F, thisArg?: ThisParameterType<F>, ...args: A): ReturnType<F>;
    enable(): this;
    disable(): this;
}
//# sourceMappingURL=async-local-storage-context-manager.d.ts.map