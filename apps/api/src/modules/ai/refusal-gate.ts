import { NO_ANSWER_MARKER } from './prompt-builder';

/**
 * Sits between the model's stream and the screen. A refusal begins with the
 * NO_ANSWER marker, which is an instruction to the server, not something to
 * show; so the first few characters are held back until it is clear which
 * kind of reply this is. The final "done" event carries the validated answer
 * either way, so this only spares the reader a flash of the raw marker.
 */
export class RefusalGate {
    private held = '';
    private decision: 'pass' | 'refusal' | null = null;

    /** Text that is safe to show now (possibly empty while undecided). */
    push(text: string): string {
        if (this.decision === 'refusal') return '';
        if (this.decision === 'pass') return text;

        this.held += text;
        const probe = this.held.trimStart();
        if (probe.length < NO_ANSWER_MARKER.length) return '';

        if (probe.toUpperCase().startsWith(NO_ANSWER_MARKER)) {
            this.decision = 'refusal';
            this.held = '';
            return '';
        }
        this.decision = 'pass';
        const released = this.held;
        this.held = '';
        return released;
    }

    /** At the end of the stream: a reply shorter than the marker cannot be a refusal, so release it. */
    flush(): string {
        if (this.decision !== null) return '';
        const released = this.held;
        this.held = '';
        this.decision = 'pass';
        return released;
    }
}
