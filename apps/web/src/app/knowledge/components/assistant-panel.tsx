import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CircleCheck,
    ArrowUp,
    BadgeCheck,
    BookOpen,
    Check,
    CircleHelp,
    Coins,
    Copy,
    Loader2,
    Mail,
    MessageCircle,
    Sparkles,
    Trash2,
    TriangleAlert,
    X,
    type LucideIcon,
} from 'lucide-react';
import { aiInputLimit, kbArticlePath, type AiAnswerStatus, type AiCitation, type AiMode, type AskResponse } from '@goldilocks/shared-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DockedPanel, RIGHT_PANEL_WIDTH } from '@/components/docked-panel';
import { useAssistantDock } from '@/contexts/docks-context';
import { useAiAssistant, type Exchange } from '@/hooks/use-ai-assistant.hook';
import { useKnowledgeLibrary } from '@/hooks/use-knowledge.hook';
import { cn } from '@/lib/utils';
import type { KnowledgeLibrary } from '../utils/library';
import { MarkdownView } from './markdown-view';

interface ModeInfo {
    label: string;
    icon: LucideIcon;
    /** What this mode is for, shown on its start-screen button. */
    blurb: string;
    placeholder: string;
    /** A pasted customer message is several lines, so Enter must add a line there and a shortcut sends. */
    isDraft: boolean;
    pendingText: string;
}

const MODES: Record<AiMode, ModeInfo> = {
    procedures: {
        label: 'Procedures',
        icon: BookOpen,
        blurb: 'Ask how the desk does something, or what a price is right now.',
        placeholder: 'Ask a question…',
        isDraft: false,
        pendingText: 'Looking through the procedures…',
    },
    email: {
        label: 'Email',
        icon: Mail,
        blurb: 'Paste a customer’s email and get a reply drafted, with live prices if they ask.',
        placeholder: 'Paste the customer’s email here…',
        isDraft: true,
        pendingText: 'Drafting a reply…',
    },
    whatsapp: {
        label: 'WhatsApp',
        icon: MessageCircle,
        blurb: 'Paste a customer’s WhatsApp message and get a short reply drafted.',
        placeholder: 'Paste the customer’s WhatsApp message here…',
        isDraft: true,
        pendingText: 'Drafting a reply…',
    },
};

const MODE_ORDER: AiMode[] = ['procedures', 'email', 'whatsapp'];

const STATUS_LABEL: Record<AiAnswerStatus, { label: string; icon: typeof BadgeCheck; className: string }> = {
    answered: { label: 'Answered from the SOPs', icon: BadgeCheck, className: '' },
    refused: { label: 'Not covered by approved SOPs', icon: CircleHelp, className: 'text-muted-foreground' },
    uncited: {
        label: 'No valid citation — check before using',
        icon: TriangleAlert,
        className: 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-400',
    },
};

/**
 * The assistant, in a side panel (docs/AI-AGENT-PLAN.md). Three things staff
 * can ask of it: how the desk works (Procedures), or to draft a reply to a
 * customer's pasted Email or WhatsApp message. Prices it quotes are live and
 * match the product table. Admin-only for now.
 */
/** The header button: opens and closes the assistant panel. */
export function AssistantToggle() {
    const { open, toggle } = useAssistantDock();
    return (
        <Button
            variant={open ? 'default' : 'outline'}
            size="sm"
            aria-pressed={open}
            title="Ask the assistant (preview)"
            aria-label="Ask the assistant (preview)"
            onClick={toggle}
        >
            <Sparkles aria-hidden /> Ask
        </Button>
    );
}

/**
 * The assistant, docked beside the page. On the dashboard it takes the Pricing
 * Tools panel's slot (and width), so the table stays usable beside it; elsewhere
 * it simply pushes the page. It stays mounted while closed, so a conversation
 * survives closing and reopening the panel.
 */
export function AssistantDock() {
    const { open, close, context, clearContext } = useAssistantDock();
    const { library } = useKnowledgeLibrary();
    const assistant = useAiAssistant(open);
    const [mode, setMode] = useState<AiMode | null>(null);
    const [draft, setDraft] = useState('');
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Keep the newest answer in view.
    useEffect(() => {
        endRef.current?.scrollIntoView({ block: 'end' });
    }, [assistant.exchanges, assistant.pending]);

    // Opened from a procedure: the question is about the procedures, so skip the picker.
    useEffect(() => {
        if (context && open) setMode((current) => current ?? 'procedures');
    }, [context, open]);

    // Choosing a mode puts the cursor in the box, ready to type or paste.
    useEffect(() => {
        if (mode) inputRef.current?.focus();
    }, [mode]);

    const info = mode ? MODES[mode] : null;
    const limit = mode ? aiInputLimit(mode) : 0;
    const off = assistant.status && !assistant.status.enabled;
    const canSend = Boolean(mode) && draft.trim().length > 0 && !assistant.pending && !off;

    const submit = async () => {
        if (!mode || !canSend) return;
        const text = draft;
        setDraft('');
        await assistant.send(text, mode, context?.title);
    };

    return (
        <DockedPanel side="right" open={open} width={RIGHT_PANEL_WIDTH} label="Assistant">
            <>
                <div className="flex items-start justify-between gap-2 border-b p-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 font-semibold">
                            Ask the assistant
                            <Badge variant="outline" className="text-muted-foreground">
                                Preview
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">{info ? info.blurb : 'What do you need help with?'}</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="-mt-1 -mr-2 size-8 shrink-0 cursor-pointer" aria-label="Close the assistant" onClick={close}>
                        <X className="size-4" />
                    </Button>
                </div>

                {mode && (
                    <div role="tablist" aria-label="What to ask" className="flex gap-1 border-b p-2">
                        {MODE_ORDER.map((id) => {
                            const Icon = MODES[id].icon;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    role="tab"
                                    aria-selected={mode === id}
                                    onClick={() => setMode(id)}
                                    className={cn(
                                        'inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                                        mode === id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                    )}
                                >
                                    <Icon className="size-4" aria-hidden /> {MODES[id].label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {off && (
                    <p role="note" className="m-4 mb-0 rounded-lg border bg-muted/50 px-3 py-2 text-sm">
                        The assistant is switched off. Set <code className="rounded-sm bg-muted px-1">AI_ENABLED=true</code> in <code className="rounded-sm bg-muted px-1">apps/api/.env</code> and
                        restart the API.
                    </p>
                )}
                {assistant.statusError && (
                    <p role="alert" className="m-4 mb-0 rounded-lg border border-destructive/40 px-3 py-2 text-sm text-destructive">
                        Couldn’t reach the assistant. Is the API running?
                    </p>
                )}

                <div className="flex-1 space-y-5 overflow-y-auto p-4">
                    {context && (
                        <p className="flex w-fit max-w-full items-center gap-1 rounded-full border border-dashed py-0.5 pr-1 pl-2.5 text-xs text-muted-foreground">
                            <span className="min-w-0 truncate">Asking about: {context.title}</span>
                            <button
                                type="button"
                                onClick={clearContext}
                                aria-label="Stop asking about this procedure"
                                className="flex size-6 shrink-0 items-center justify-center rounded-full hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                                <X className="size-3" aria-hidden />
                            </button>
                        </p>
                    )}
                    {mode === null && assistant.exchanges.length === 0 ? (
                        <ul className="flex flex-col gap-3">
                            {MODE_ORDER.map((id) => {
                                const { label, icon: Icon, blurb } = MODES[id];
                                return (
                                    <li key={id}>
                                        <button
                                            type="button"
                                            onClick={() => setMode(id)}
                                            disabled={Boolean(off)}
                                            className="flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50"
                                        >
                                            <Icon className="mt-0.5 size-5 shrink-0 text-primary-text" aria-hidden />
                                            <span>
                                                <span className="block text-sm font-medium">{label}</span>
                                                <span className="block text-sm text-muted-foreground">{blurb}</span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        assistant.exchanges.map((exchange) => (
                            <ExchangeView key={exchange.id} exchange={exchange} library={library} onNavigate={() => undefined} />
                        ))
                    )}
                    {mode && assistant.exchanges.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            {info?.isDraft ? 'Paste the message below, then send. The reply comes with notes for you, and live prices when the customer asks.' : 'Type your question below.'}
                        </p>
                    )}
                    {assistant.pending && info && (
                        <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                            <Loader2 className="size-4 animate-spin" aria-hidden /> {info.pendingText}
                        </p>
                    )}
                    <div ref={endRef} />
                </div>

                {mode && info && (
                    <form
                        className="border-t p-3"
                        onSubmit={(event) => {
                            event.preventDefault();
                            void submit();
                        }}
                    >
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                onKeyDown={(event) => {
                                    // A question: Enter sends, Shift+Enter adds a line. A pasted message is
                                    // several lines, so Enter adds a line and Ctrl/Cmd+Enter sends.
                                    if (event.key !== 'Enter') return;
                                    const send = info.isDraft ? event.ctrlKey || event.metaKey : !event.shiftKey;
                                    if (send) {
                                        event.preventDefault();
                                        void submit();
                                    }
                                }}
                                rows={info.isDraft ? 7 : 2}
                                maxLength={limit}
                                placeholder={info.placeholder}
                                aria-label={info.isDraft ? 'The customer’s message' : 'Your question'}
                                className={cn(
                                    'dark:bg-input/30 border-input selection:bg-primary selection:text-primary-foreground flex-1 resize-none rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm',
                                    info.isDraft ? 'min-h-40' : 'min-h-16',
                                )}
                            />
                            <Button type="submit" size="icon" disabled={!canSend} title={info.isDraft ? 'Draft a reply (Ctrl+Enter)' : 'Send (Enter)'} aria-label="Send">
                                <ArrowUp aria-hidden />
                            </Button>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{info.isDraft ? 'Ctrl+Enter to send. Don’t paste ID or account numbers.' : 'Don’t paste customer ID or account numbers.'}</span>
                            <span className="flex items-center gap-3">
                                <span className="tabular-nums">
                                    {draft.length}/{limit}
                                </span>
                                {assistant.exchanges.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={assistant.clear}
                                        className="inline-flex items-center gap-1 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                                    >
                                        <Trash2 className="size-3.5" aria-hidden /> Clear
                                    </button>
                                )}
                            </span>
                        </div>
                    </form>
                )}
            </>
        </DockedPanel>
    );
}

function ExchangeView({ exchange, library, onNavigate }: { exchange: Exchange; library: KnowledgeLibrary; onNavigate: () => void }) {
    const { response, error, mode } = exchange;
    const info = MODES[mode];

    return (
        <div className="space-y-2">
            <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                {info.isDraft && <p className="mb-1 text-xs font-medium text-muted-foreground">{info.label} from the customer</p>}
                <p className={cn('whitespace-pre-wrap', info.isDraft && 'line-clamp-4')}>{exchange.question}</p>
            </div>

            {error && (
                <p role="alert" className="flex gap-2 rounded-lg border border-destructive/40 px-3 py-2 text-sm text-destructive">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {error}
                </p>
            )}

            {response && (
                <div className="space-y-2.5 rounded-lg border p-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={response.status} isDraft={info.isDraft} />
                        {response.toolsUsed.length > 0 && (
                            <Badge variant="outline" className="text-muted-foreground">
                                <Coins aria-hidden /> Live prices
                            </Badge>
                        )}
                    </div>

                    {info.isDraft && response.status === 'answered' ? (
                        <DraftBlock message={response.answer} label={info.label} />
                    ) : (
                        <MarkdownView markdown={response.answer} fromSlug="" library={library} className="text-sm [&_li]:text-sm [&_p]:text-sm" />
                    )}

                    {response.spotNote && <SpotNote note={response.spotNote} />}
                    {response.warnings.length > 0 && <Warnings warnings={response.warnings} />}

                    {response.notes && (
                        <div className="space-y-1 border-t pt-2.5">
                            <p className="text-xs font-medium text-muted-foreground">Notes for you</p>
                            <MarkdownView markdown={response.notes} fromSlug="" library={library} className="text-sm [&_li]:text-sm [&_p]:text-sm" />
                        </div>
                    )}

                    {response.citations.length > 0 && <Citations citations={response.citations} onNavigate={onNavigate} library={library} />}
                </div>
            )}
        </div>
    );
}

/** The message to send, kept apart from the notes so it can be copied as it is. */
function DraftBlock({ message, label }: { message: string; label: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard access can be refused (e.g. an insecure origin); the text is still selectable.
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">{label} reply</p>
                <Button type="button" variant="outline" size="sm" onClick={() => void copy()}>
                    {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
                    {copied ? 'Copied' : 'Copy'}
                </Button>
            </div>
            <p className="rounded-md border bg-background px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
            <span role="status" className="sr-only">
                {copied ? 'Reply copied to the clipboard' : ''}
            </span>
        </div>
    );
}

/** Staff-only: which spot the prices came from. Not part of the reply, so it is never copied with it. */
function SpotNote({ note }: { note: NonNullable<AskResponse['spotNote']> }) {
    const healthy = note.tone === 'healthy';
    return (
        <p
            className={
                healthy
                    ? 'text-muted-foreground flex gap-2 rounded-md border px-3 py-2 text-sm'
                    : 'flex gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-300'
            }
        >
            {healthy ? <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden /> : <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />}
            {note.message}
        </p>
    );
}

function Warnings({ warnings }: { warnings: string[] }) {
    return (
        <ul className="space-y-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-300">
            {warnings.map((warning) => (
                <li key={warning} className="flex gap-2">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {warning}
                </li>
            ))}
        </ul>
    );
}

function StatusBadge({ status, isDraft }: { status: AiAnswerStatus; isDraft: boolean }) {
    const base = STATUS_LABEL[status];
    // A draft is not "answered from the SOPs"; it is a reply to check and send.
    const label = isDraft ? (status === 'refused' ? 'Couldn’t draft a reply' : 'Draft ready — check before sending') : base.label;
    const Icon = base.icon;
    return (
        <Badge variant="outline" className={cn(base.className)}>
            <Icon aria-hidden /> {label}
        </Badge>
    );
}

/**
 * Each citation opens the article at that section, with the gold "You're here" frame.
 * A section that still has a fact to confirm is marked amber: the answer leaned on something nobody has signed off.
 */
function Citations({ citations, onNavigate, library }: { citations: AiCitation[]; onNavigate: () => void; library: KnowledgeLibrary }) {
    return (
        <ul className="flex flex-wrap gap-1.5" aria-label="Sections used">
            {citations.map((citation) => {
                const section = citation.anchor ? library.bySlug.get(citation.slug)?.sections.find((candidate) => candidate.anchor === citation.anchor) : undefined;
                const unconfirmed = Boolean(section?.hasTodo);
                return (
                    <li key={`${citation.slug}#${citation.anchor ?? ''}`}>
                        <Link
                            to={kbArticlePath(citation.slug, citation.anchor)}
                            onClick={onNavigate}
                            className={cn(
                                'inline-flex min-h-8 items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                                unconfirmed ? 'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-300' : 'text-primary-text',
                            )}
                        >
                            {unconfirmed && <TriangleAlert className="size-3 shrink-0" aria-hidden />}
                            {unconfirmed && <span className="font-semibold">Not confirmed yet · </span>}
                            {citation.title}
                            {citation.heading && <span className="text-muted-foreground"> › {citation.heading}</span>}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
