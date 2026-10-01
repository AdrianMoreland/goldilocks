import { Writable } from 'node:stream';
import type { AdminLogEntry, LogLevel } from '@goldilocks/shared-types';

const CAPACITY = 1000;

// pino's numeric levels, as written on every log line.
const LEVEL_BY_NUMBER: Record<number, LogLevel> = {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal',
};

// Fields lifted into their own columns in the viewer; the rest go to `extra`.
const LIFTED = new Set([
    'level',
    'time',
    'msg',
    'context',
    'req',
    'res',
    'responseTime',
    'pid',
    'hostname',
]);

/**
 * The most recent log lines, kept in memory so the admin console can show
 * them without a log-shipping service. A plain module-level singleton,
 * because pino's destination has to exist before Nest's container does.
 * Lost on restart — the stdout stream (Railway's own log view) is the
 * durable copy.
 */
class LogBuffer {
    private readonly entries: AdminLogEntry[] = [];
    private nextId = 1;

    /** A pino destination: receives one JSON line per write. */
    readonly stream = new Writable({
        write: (chunk: Buffer, _encoding, done) => {
            for (const line of chunk.toString('utf8').split('\n')) {
                if (line.trim()) this.add(line);
            }
            done();
        },
    });

    private add(line: string): void {
        let parsed: Record<string, unknown>;
        try {
            parsed = JSON.parse(line) as Record<string, unknown>;
        } catch {
            return; // not a pino line (e.g. a stray console.log)
        }

        const req = parsed.req as { method?: string; url?: string } | undefined;
        const res = parsed.res as { statusCode?: number } | undefined;
        const extra = Object.fromEntries(
            Object.entries(parsed).filter(([key]) => !LIFTED.has(key)),
        );

        this.entries.unshift({
            id: this.nextId++,
            time: typeof parsed.time === 'number' ? parsed.time : Date.now(),
            level: LEVEL_BY_NUMBER[Number(parsed.level)] ?? 'info',
            message: typeof parsed.msg === 'string' ? parsed.msg : '',
            context: typeof parsed.context === 'string' ? parsed.context : null,
            method: req?.method ?? null,
            url: req?.url ?? null,
            status: res?.statusCode ?? null,
            responseTimeMs:
                typeof parsed.responseTime === 'number'
                    ? parsed.responseTime
                    : null,
            extra,
        });
        if (this.entries.length > CAPACITY) this.entries.length = CAPACITY;
    }

    /** Newest first. */
    recent(limit: number): AdminLogEntry[] {
        return this.entries.slice(0, limit);
    }

    get capacity(): number {
        return CAPACITY;
    }
}

export const logBuffer = new LogBuffer();
