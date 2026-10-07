import { useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CalendarClock, RefreshCw, Search, SearchX, TriangleAlert, X } from 'lucide-react';
import { kbArticlePath, kbReviewStatus, searchKb } from '@goldilocks/shared-types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { useKnowledgeLibrary } from '@/hooks/use-knowledge.hook';
import { KnowledgeLayout } from './components/knowledge-layout';
import { SearchResultList } from './components/search-results';
import { GuideFlow } from './components/guide-flow';
import { KnowledgePage } from './components/knowledge-page';
import { BusinessCentralStrip, QuickLinks, ToolTiles } from './components/guide-shortcuts';
import { formatDay, plural } from './utils/format';

const SEARCH_LIMIT = 30;

export default function KnowledgeCenterPage() {
    const { isAdmin } = useAuth();
    const { library, isLoading, isError, refetch } = useKnowledgeLibrary();
    const [params, setParams] = useSearchParams();
    const searchRef = useRef<HTMLInputElement>(null);

    // The query lives in the URL, so Back restores it and a search can be shared.
    const query = params.get('q') ?? '';
    const setQuery = (next: string) => {
        const merged = new URLSearchParams(params);
        if (next) merged.set('q', next);
        else merged.delete('q');
        setParams(merged, { replace: true });
    };

    // "/" jumps to the search box from anywhere on the page, like the workbook's other shortcuts.
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
            if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
                event.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const hits = useMemo(() => (query.trim() ? searchKb(library.searchIndex, query, SEARCH_LIMIT) : null), [library, query]);

    // The 6-month review reminder. Staff see it on each procedure; admins also get it here, so an
    // overdue one doesn't wait for someone to happen to open it.
    const dueForReview = useMemo(
        () =>
            library.articles
                .filter((article) => article.doc.status === 'approved')
                .map((article) => ({ article, review: kbReviewStatus(article.doc.contentUpdatedOn) }))
                .filter(({ review }) => review.state !== 'ok')
                .sort((a, b) => a.review.daysUntilDue - b.review.daysUntilDue),
        [library],
    );

    const hasDocuments = library.articles.length > 0;
    const drafts = library.articles.filter((article) => article.doc.status === 'draft').length;

    return (
        <KnowledgeLayout>
            <KnowledgePage className="gap-10">
                <header className="flex max-w-2xl flex-col gap-4">
                    <div className="space-y-1.5">
                        <h2 className="type-h2 text-balance">What do you need to know?</h2>
                        <p className="text-muted-foreground">Search for a word, or follow the steps below.</p>
                    </div>

                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
                        <input
                            ref={searchRef}
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Escape' && query) {
                                    event.preventDefault();
                                    setQuery('');
                                }
                            }}
                            placeholder="Try “cash”, “VAT”, “collection” or “ID”"
                            aria-label="Search procedures"
                            className="dark:bg-input/30 border-input selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground h-12 w-full rounded-lg border bg-transparent pr-16 pl-11 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:appearance-none"
                        />
                        {query ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery('');
                                    searchRef.current?.focus();
                                }}
                                title="Clear search (Esc)"
                                aria-label="Clear search"
                                className="absolute top-1/2 right-2.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        ) : (
                            <kbd
                                className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 rounded-sm border bg-muted px-1.5 text-[11px] leading-5 font-medium text-muted-foreground"
                                aria-hidden
                            >
                                /
                            </kbd>
                        )}
                    </div>
                </header>

                <section aria-live="polite">
                    {isLoading ? (
                        <LoadingCards />
                    ) : isError ? (
                        <Notice
                            icon={<TriangleAlert className="size-5" aria-hidden />}
                            title="Couldn't load the procedures"
                            body="Check the connection, then try again."
                            action={
                                <Button variant="outline" size="sm" onClick={() => void refetch()}>
                                    <RefreshCw aria-hidden /> Try again
                                </Button>
                            }
                        />
                    ) : !hasDocuments ? (
                        <Notice
                            icon={<SearchX className="size-5" aria-hidden />}
                            title="No procedures have been published yet"
                            body={
                                isAdmin
                                    ? 'Import the SOP files with “pnpm --filter api kb:import”, then refresh this page.'
                                    : 'Ask an admin to import the SOPs. They will appear here as soon as they are in.'
                            }
                        />
                    ) : hits ? (
                        <div className="max-w-4xl">
                            {hits.length > 0 ? (
                                <>
                                    <p className="type-muted mb-2 tabular-nums text-muted-foreground">
                                        {plural(hits.length, 'result')} for “{query.trim()}”
                                        {hits.length === SEARCH_LIMIT && ' (showing the best matches)'}
                                    </p>
                                    <SearchResultList hits={hits} query={query.trim()} />
                                </>
                            ) : (
                                <Notice
                                    icon={<SearchX className="size-5" aria-hidden />}
                                    title={`Nothing matches “${query.trim()}”`}
                                    body="Search looks at titles, headings and text. Try one or two key words, or go back to the steps."
                                    action={
                                        <Button variant="outline" size="sm" onClick={() => setQuery('')}>
                                            Back to the steps
                                        </Button>
                                    }
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-12">
                            {isAdmin && dueForReview.length > 0 && <ReviewDueNotice items={dueForReview} />}

                            <div className="grid gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
                                <QuickLinks library={library} />
                                <ToolTiles library={library} />
                            </div>

                            <BusinessCentralStrip library={library} />

                            <GuideFlow library={library} />

                            <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                <p className="tabular-nums">
                                    {drafts > 0
                                        ? `${drafts === library.articles.length ? 'All' : drafts} of ${plural(library.articles.length, 'procedure')} ${drafts === 1 ? 'is a draft' : 'are drafts'} awaiting approval. Anything still to be confirmed is flagged inside.`
                                        : `${plural(library.articles.length, 'procedure')}, all approved.`}
                                </p>
                                <nav aria-label="More" className="flex flex-wrap items-center gap-x-5 gap-y-1">
                                    <Link to="/knowledge/all" className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline">
                                        Browse all procedures <ArrowRight className="size-3.5" aria-hidden />
                                    </Link>
                                    {library.bySlug.has('readme') && (
                                        <Link to={kbArticlePath('readme')} className="underline-offset-4 hover:text-foreground hover:underline">
                                            How these procedures are written
                                        </Link>
                                    )}
                                </nav>
                            </footer>
                        </div>
                    )}
                </section>
            </KnowledgePage>
        </KnowledgeLayout>
    );
}

function ReviewDueNotice({ items }: { items: { article: { doc: { slug: string; title: string } }; review: { dueOn: string; state: string } }[] }) {
    const overdue = items.filter((item) => item.review.state === 'overdue').length;

    return (
        <section aria-label="Procedures due for review" className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
                <CalendarClock className="size-4 text-muted-foreground" aria-hidden />
                <h2 className="text-base font-semibold">
                    {plural(items.length, 'procedure')} {items.length === 1 ? 'is' : 'are'} due for its 6-month review
                    {overdue > 0 && <span className="text-amber-800 dark:text-amber-400"> · {overdue} overdue</span>}
                </h2>
            </div>
            <ul className="mt-2 flex flex-wrap gap-2">
                {items.map(({ article, review }) => (
                    <li key={article.doc.slug}>
                        <Link
                            to={kbArticlePath(article.doc.slug)}
                            className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            {article.doc.title}
                            <span className={review.state === 'overdue' ? 'text-amber-800 dark:text-amber-400' : 'text-muted-foreground'}>
                                · {review.state === 'overdue' ? 'was due' : 'due'} {formatDay(review.dueOn)}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function LoadingCards() {
    return (
        <div className="grid gap-6 lg:grid-cols-2" aria-busy="true" aria-label="Loading">
            {[0, 1].map((column) => (
                <div key={column} className="space-y-3">
                    <Skeleton className="h-28 w-full rounded-xl" />
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className="h-16 w-full rounded-xl" />
                    ))}
                </div>
            ))}
        </div>
    );
}

function Notice({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) {
    return (
        <div className="flex max-w-xl flex-col items-start gap-3 rounded-xl border px-5 py-6">
            <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">{icon}</span>
            <div className="space-y-1">
                <p className="text-base font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
            </div>
            {action}
        </div>
    );
}
