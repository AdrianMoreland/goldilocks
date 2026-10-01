"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logBuffer = void 0;
const node_stream_1 = require("node:stream");
const CAPACITY = 1000;
const LEVEL_BY_NUMBER = {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal',
};
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
class LogBuffer {
    entries = [];
    nextId = 1;
    stream = new node_stream_1.Writable({
        write: (chunk, _encoding, done) => {
            for (const line of chunk.toString('utf8').split('\n')) {
                if (line.trim())
                    this.add(line);
            }
            done();
        },
    });
    add(line) {
        let parsed;
        try {
            parsed = JSON.parse(line);
        }
        catch {
            return;
        }
        const req = parsed.req;
        const res = parsed.res;
        const extra = Object.fromEntries(Object.entries(parsed).filter(([key]) => !LIFTED.has(key)));
        this.entries.unshift({
            id: this.nextId++,
            time: typeof parsed.time === 'number' ? parsed.time : Date.now(),
            level: LEVEL_BY_NUMBER[Number(parsed.level)] ?? 'info',
            message: typeof parsed.msg === 'string' ? parsed.msg : '',
            context: typeof parsed.context === 'string' ? parsed.context : null,
            method: req?.method ?? null,
            url: req?.url ?? null,
            status: res?.statusCode ?? null,
            responseTimeMs: typeof parsed.responseTime === 'number'
                ? parsed.responseTime
                : null,
            extra,
        });
        if (this.entries.length > CAPACITY)
            this.entries.length = CAPACITY;
    }
    recent(limit) {
        return this.entries.slice(0, limit);
    }
    get capacity() {
        return CAPACITY;
    }
}
exports.logBuffer = new LogBuffer();
//# sourceMappingURL=log-buffer.js.map