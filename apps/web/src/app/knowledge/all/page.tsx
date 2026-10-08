import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw, TriangleAlert } from 'lucide-react';
import { KB_CATEGORY_INFO, type KbCategory } from '@goldilocks/shared-types';
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
import { cn } from '@/lib/utils';
import { KnowledgeLayout } from '../components/knowledge-layout';
import { KnowledgePage } from '../components/knowledge-page';
import { ProcedureCard } from '../components/procedure-card';
import { plural } from '../utils/format';
import { FOCUS } from '../utils/tone';

const TOPIC_ORDER = Object.keys(KB_CATEGORY_INFO) as KbCategory[];

/** Every procedure, grouped by what it is about, for when the flow on the front page isn't the way in. */
export default function KnowledgeAllPage() {
    const { isAdmin } = useAuth();
    const { library, isLoading, isError, refetch } = useKnowledgeLibrary();
    const [params, setParams] = useSearchParams();

    // Retired procedures are kept for audit; only admins see them.
    const visible = useMemo(() => library.articles.filter((article) => isAdmin || article.doc.status !== 'retired'), [library, isAdmin]);
    const groups = useMemo(
        () =>
            TOPIC_ORDER.map((category) => ({ category, articles: visible.filter((article) => article.doc.category === category) })).filter(
                (group) => group.articles.length > 0,
            ),
        [visible],
    );

    // The topic lives in the URL, so Back restores it and a filtered list can be shared.
    const requested = params.get('topic');
    const topic = groups.some((group) => group.category === requested) ? (requested as KbCategory) : null;
    const choose = (next: KbCategory | null) => {
        const merged = new URLSearchParams(params);
        if (next) merged.set('topic', next);
        else merged.delete('topic');
        setParams(merged, { replace: true });
    };
    const shown = topic ? groups.filter((group) => group.category === topic) : groups;

    return (
        <KnowledgeLayout>
            <KnowledgePage className="gap-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/knowledge">Knowledge Center</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>All procedures</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <header className="space-y-1">
                    <h1 className="type-h2">All procedures</h1>
                    {!isLoading && !isError && (
                        <p className="max-w-2xl text-muted-foreground tabular-nums">
                            {plural(visible.length, 'procedure')}, grouped by what they are about. The coloured badge shows where a procedure sits in the Price or Buyback process.
                        </p>
                    )}
                </header>

                {isLoading ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading procedures">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <Skeleton key={index} className="h-28 w-full rounded-xl" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex max-w-xl flex-col items-start gap-3 rounded-xl border px-5 py-6">
                        <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <TriangleAlert className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-1">
                            <p className="text-base font-semibold">Couldn't load the procedures</p>
                            <p className="text-sm text-muted-foreground">Check the connection, then try again.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => void refetch()}>
                            <RefreshCw aria-hidden /> Try again
                        </Button>
                    </div>
                ) : visible.length === 0 ? (
                    <div className="flex max-w-xl flex-col items-start gap-3 rounded-xl border px-5 py-6">
                        <p className="text-base font-semibold">No procedures have been published yet</p>
                        <Button asChild variant="outline" size="sm">
                            <Link to="/knowledge">
                                <ArrowLeft aria-hidden /> Back to the Knowledge Center
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
                            {[{ category: null, label: 'All' }, ...groups.map((group) => ({ category: group.category, label: KB_CATEGORY_INFO[group.category].label }))].map((option) => (
                                <button
                                    key={option.label}
                                    type="button"
                                    aria-pressed={topic === option.category}
                                    onClick={() => choose(option.category)}
                                    className={cn(
                                        'inline-flex min-h-10 items-center rounded-full border px-3.5 text-sm transition-colors',
                                        topic === option.category ? 'border-foreground bg-foreground text-background' : 'bg-card hover:bg-muted',
                                        FOCUS,
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-7">
                            {shown.map((group) => (
                                <section key={group.category} aria-labelledby={`topic-${group.category}`}>
                                    <div className="mb-3 flex items-baseline justify-between gap-3">
                                        <h2 id={`topic-${group.category}`} className="type-h4">
                                            {KB_CATEGORY_INFO[group.category].label}
                                        </h2>
                                        <span className="text-sm text-muted-foreground tabular-nums">{group.articles.length}</span>
                                    </div>
                                    <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                                        {group.articles.map((article) => (
                                            <li key={article.doc.slug}>
                                                <ProcedureCard article={article} />
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    </>
                )}
            </KnowledgePage>
        </KnowledgeLayout>
    );
}
