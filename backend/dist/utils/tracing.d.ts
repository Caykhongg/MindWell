import { Client } from 'langsmith';
export declare function trace<T extends (...args: any[]) => Promise<any>>(fn: T, options?: {
    name?: string;
    metadata?: Record<string, unknown>;
}): T;
export declare function getTracingClient(): Client | null;
//# sourceMappingURL=tracing.d.ts.map