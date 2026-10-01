import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Archive, ArrowLeft, CalendarClock, CircleDashed, FileQuestion, RefreshCw, TriangleAlert } from 'lucide-react';
import { kbReviewStatus, type KbJurisdiction, type KbReviewStatus } from '@goldilocks/shared-types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/auth-context';
import { useKnowledgeLibrary } from '@/hooks/use-knowledge.hook';
import { KnowledgeLayout } from '../components/knowledge-layout';
import { ArticleAdminBar } from '../components/article-admin-bar';
import { ArticleEditor } from '../components/article-editor';
import { ArticleSections } from '../components/article-sections';
import { KnowledgePage } from '../components/knowledge-page';
import { ArticleToc } from '../components/article-toc';
import { StatusBadge, UnconfirmedBadge } from '../components/status-badges';
import { formatDay } from '../utils/format';

const JURISDICTION_LABEL: Record<KbJurisdiction, string> = {
    all: 'All branches',
    IE: 'Ireland',
    UK: 'UK',
    ES: 'Spain',
};

/** Keeps the URL's #section honest: scrolls to it once the article is on screen, or to the top for a fresh article. */
function useScrollToHash(ready: boolean, slug: string | undefined) {
    const { hash } = useLocation();

    useEffect(() => {
        if (!ready) return;
        const id = decodeURIComponent(hash.replace(/^#/, ''));
        const frame = requestAnimationFrame(() => {
            const target = id ? document.getElementById(id) : null;
            if (target) target.scrollIntoView({ block: 'start' });
            else if (!id) window.scrollTo({ top: 0 });
        });
        return () => cancelAnimationFrame(frame);
    }, [ready, slug, hash]);
}

export default function KnowledgeArticlePage() {
    const { slug } = useParams<{ slug: string }>();
    const { library, isLoading, isError, refetch } = useKnowledgeLibrary();
    const article = slug ? library.bySlug.get(slug) : undefined;
    const { isAdmin } = useAuth();
    const [editing, setEditing] = useState(false);
    // Only approved procedures are on the 6-month review cycle; a draft isn't "due" for anything.
    const review = article && article.doc.status === 'approved' ? kbReviewStatus(article.doc.contentUpdatedOn) : null;

    useScrollToHash(Boolean(article) && !editing, slug);
    // Moving to another procedure never carries an open editor with it.
    useEffect(() => setEditing(false), [slug]);

    return (
        <KnowledgeLayout>
            <KnowledgePage>
                {isLoading ? (
                    <ArticleSkeleton />
                ) : isError ? (
                    <Problem
                        icon={<TriangleAlert className="size-5" aria-hidden />}
                        title="Couldn't load this procedure"
                        body="Check the connection, then try again."
                        action={
                            <Button variant="outline" size="sm" onClick={() => void refetch()}>
                                <RefreshCw aria-hidden /> Try again
                            </Button>
                        }
                    />
                ) : !article ? (
                    <Problem
                        icon={<FileQuestion className="size-5" aria-hidden />}
                        title="That procedure doesn’t exist"
                        body="It may have been renamed or retired. The library lists everything that is currently available."
                        action={
                            <Button asChild variant="outline" size="sm">
                                <Link to="/knowledge">
                                    <ArrowLeft aria-hidden /> Back to the library
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid items-start gap-x-10 gap-y-6 xl:grid-cols-[minmax(0,1fr)_14rem]">
                        <article className="min-w-0">
                            <Breadcrumb className="mb-4">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link to="/knowledge">Knowledge Center</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="truncate">{article.doc.title}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>

                            <header className="mb-6 max-w-[70ch] space-y-3">
                                <h1 className="type-h2 text-balance">{article.doc.title}</h1>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                                    <StatusBadge status={article.doc.status} />
                                    <UnconfirmedBadge count={article.todoSectionCount} />
                                    <p className="text-sm text-muted-foreground tabular-nums">
                                        Owner {article.doc.owner} · v{article.doc.version} · Updated {formatDay(article.doc.contentUpdatedOn)} ·{' '}
                                        {JURISDICTION_LABEL[article.doc.jurisdiction]}
                                        {review && <> · Next review {formatDay(review.dueOn)}</>}
                                    </p>
                                </div>
                                <StatusNotice status={article.doc.status} owner={article.doc.owner} />
                                {review && <ReviewNotice review={review} owner={article.doc.owner} />}
                                {isAdmin && <ArticleAdminBar article={article} editing={editing} onEdit={() => setEditing(true)} />}
                            </header>

                            {/* Phones and narrow windows get the contents above the text; wide ones get the sticky rail. */}
                            {!editing && (
                                <ArticleToc slug={article.doc.slug} sections={article.sections} className="mb-6 max-w-[70ch] rounded-lg border p-3 xl:hidden" />
                            )}

                            {editing ? (
                                <ArticleEditor article={article} library={library} onDone={() => setEditing(false)} />
                            ) : (
                                <div className="max-w-[70ch]">
                                    <ArticleSections article={article} library={library} />
                                </div>
                            )}
                        </article>

                        <aside className="sticky top-[calc(var(--header-height)+1rem)] hidden xl:block">
                            {!editing && <ArticleToc slug={article.doc.slug} sections={article.sections} />}
                        </aside>
                    </div>
                )}
            </KnowledgePage>
        </KnowledgeLayout>
    );
}

/** The 6-month review cycle: quiet when due soon, loud once overdue — an out-of-date procedure must not look current. */
function ReviewNotice({ review, owner }: { review: KbReviewStatus; owner: string }) {
    if (review.state === 'ok') return null;

    const overdue = review.state === 'overdue';
    return (
        <div
            role="note"
            className={
                overdue
                    ? 'flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-3 text-sm text-amber-950 dark:text-amber-200'
                    : 'flex gap-3 rounded-lg border bg-muted/50 px-3.5 py-3 text-sm'
            }
        >
            <span className={overdue ? 'mt-0.5 shrink-0 text-amber-700 dark:text-amber-400' : 'mt-0.5 shrink-0 text-muted-foreground'}>
                {overdue ? <TriangleAlert className="size-4" aria-hidden /> : <CalendarClock className="size-4" aria-hidden />}
            </span>
            <div className="space-y-0.5">
                <p className="font-semibold">{overdue ? 'Overdue for review' : 'Review due soon'}</p>
                <p className="leading-6">
                    {overdue
                        ? `This procedure was due for its 6-month review on ${formatDay(review.dueOn)}. Check anything you're unsure of with ${owner}.`
                        : `It is due for its 6-month review on ${formatDay(review.dueOn)}.`}
                </p>
            </div>
        </div>
    );
}

/** A draft is shown, never hidden — but it says so in plain words, above the first step. */
function StatusNotice({ status, owner }: { status: 'draft' | 'approved' | 'retired'; owner: string }) {
    if (status === 'approved') return null;

    const draft = status === 'draft';
    return (
        <div role="note" className="flex gap-3 rounded-lg border bg-muted/50 px-3.5 py-3 text-sm">
            <span className="mt-0.5 shrink-0 text-muted-foreground">
                {draft ? <CircleDashed className="size-4" aria-hidden /> : <Archive className="size-4" aria-hidden />}
            </span>
            <div className="space-y-0.5">
                <p className="font-semibold">{draft ? 'Not yet approved' : 'Retired'}</p>
                <p className="leading-6 text-muted-foreground">
                    {draft
                        ? 'This procedure is still a draft.'
                        : `This procedure is no longer in use and is kept for audit only. Ask ${owner} which one replaced it.`}
                </p>
            </div>
        </div>
    );
}

function Problem({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) {
    return (
        <div className="flex max-w-xl flex-col items-start gap-3 rounded-lg border px-5 py-6">
            <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">{icon}</span>
            <div className="space-y-1">
                <p className="text-base font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
            </div>
            {action}
        </div>
    );
}

function ArticleSkeleton() {
    return (
        <div className="max-w-[70ch] space-y-4" aria-busy="true" aria-label="Loading procedure">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
        </div>
    );
}
