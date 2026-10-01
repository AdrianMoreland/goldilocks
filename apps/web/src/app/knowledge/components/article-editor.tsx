import { useState } from 'react';
import { Eye, PencilLine, Save, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useKnowledgeAdmin } from '@/hooks/use-knowledge-admin.hook';
import { cn } from '@/lib/utils';
import type { KnowledgeArticle, KnowledgeLibrary } from '../utils/library';
import { MarkdownView } from './markdown-view';

/**
 * Edits a procedure's title, owner and text. The text is Markdown in the SOP
 * format (## sections, [[slug#section]] links, [TODO: …] for facts still to be
 * confirmed) — Preview shows it exactly as staff will read it.
 */
export function ArticleEditor({
    article,
    library,
    onDone,
}: {
    article: KnowledgeArticle;
    library: KnowledgeLibrary;
    onDone: () => void;
}) {
    const { doc } = article;
    const { save } = useKnowledgeAdmin(doc.slug);
    const [title, setTitle] = useState(doc.title);
    const [owner, setOwner] = useState(doc.owner);
    const [markdown, setMarkdown] = useState(doc.markdown);
    const [tab, setTab] = useState<'write' | 'preview'>('write');

    const dirty = title !== doc.title || owner !== doc.owner || markdown.trim() !== doc.markdown.trim();
    const textChanged = title !== doc.title || markdown.trim() !== doc.markdown.trim();
    const valid = title.trim() !== '' && owner.trim() !== '' && markdown.trim() !== '';

    const submit = () =>
        save.mutate({ title: title.trim(), owner: owner.trim(), markdown }, { onSuccess: onDone });

    return (
        <form
            className="flex max-w-[70ch] flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault();
                if (valid && dirty) submit();
            }}
        >
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
                <label className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-semibold text-muted-foreground">Title</span>
                    <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-semibold text-muted-foreground">Owner</span>
                    <Input value={owner} onChange={(event) => setOwner(event.target.value)} maxLength={100} />
                </label>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-semibold text-muted-foreground">Text</span>
                    <div role="tablist" aria-label="Editor view" className="flex gap-1 rounded-md bg-muted p-0.5">
                        {(
                            [
                                ['write', 'Write', PencilLine],
                                ['preview', 'Preview', Eye],
                            ] as const
                        ).map(([id, label, Icon]) => (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={tab === id}
                                onClick={() => setTab(id)}
                                className={cn(
                                    'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                                    tab === id ? 'bg-background font-medium shadow-xs' : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <Icon className="size-3.5" aria-hidden /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                {tab === 'write' ? (
                    <textarea
                        value={markdown}
                        onChange={(event) => setMarkdown(event.target.value)}
                        spellCheck
                        aria-label="Procedure text in Markdown"
                        // Monospace because this is literally Markdown source — code, not interface text.
                        className="dark:bg-input/30 border-input selection:bg-primary selection:text-primary-foreground min-h-[28rem] w-full resize-y rounded-md border bg-transparent p-3 font-mono text-sm leading-6 shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    />
                ) : (
                    <div className="min-h-[28rem] rounded-md border p-4">
                        <MarkdownView markdown={markdown} fromSlug={doc.slug} library={library} />
                    </div>
                )}
                <p className="text-sm text-muted-foreground">
                    Sections start with <code className="rounded-sm bg-muted px-1">## Heading</code>. Link to another procedure with{' '}
                    <code className="rounded-sm bg-muted px-1">[[slug#section]]</code>. Mark a fact that still needs confirming with{' '}
                    <code className="rounded-sm bg-muted px-1">[TODO: what to confirm]</code>.
                </p>
            </div>

            {doc.status === 'approved' && textChanged && (
                <p role="note" className="flex gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-200">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
                    Saving changes to an approved procedure returns it to draft until it is approved again.
                </p>
            )}

            {save.isError && (
                <p role="alert" className="rounded-lg border border-destructive/40 px-3 py-2 text-sm text-destructive">
                    {save.error instanceof Error ? save.error.message : 'Could not save.'}
                </p>
            )}

            <div className="flex items-center gap-2">
                <Button type="submit" disabled={!valid || !dirty || save.isPending}>
                    <Save aria-hidden /> {save.isPending ? 'Saving…' : 'Save'}
                </Button>
                <Button type="button" variant="ghost" onClick={onDone} disabled={save.isPending}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
