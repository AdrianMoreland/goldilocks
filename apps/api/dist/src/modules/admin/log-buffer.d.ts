import { Writable } from 'node:stream';
import type { AdminLogEntry } from '@goldilocks/shared-types';
declare class LogBuffer {
    private readonly entries;
    private nextId;
    readonly stream: Writable;
    private add;
    recent(limit: number): AdminLogEntry[];
    get capacity(): number;
}
export declare const logBuffer: LogBuffer;
export {};
//# sourceMappingURL=log-buffer.d.ts.map