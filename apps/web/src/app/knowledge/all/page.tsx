import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, TriangleAlert } from 'lucide-react';
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
import { useKnowledgeLibrary } from '@/hooks/use-knowledge.hook';
import { KnowledgeLayout } from '../components/knowledge-layout';
import { KnowledgePage } from '../components/knowledge-page';
import { ProcedureCard } from '../components/procedure-card';
import { plural } from '../utils/format';

/** Every procedure, A to Z, each with jumps to its sections — for when the flow on the front page isn't the way in. */
export default function KnowledgeAllPage() {
    const { library, isLoading, isError, refetch } = useKnowledgeLibrary();

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
                        <p className="text-muted-foreground tabular-nums">{plural(library.articles.length, 'procedure')}, A to Z.</p>
                    )}
                </header>

                {isLoading ? (
                    <div className="max-w-3xl space-y-4" aria-busy="true" aria-label="Loading procedures">
                        {[0, 1, 2].map((index) => (
                            <Skeleton key={index} className="h-32 w-full rounded-xl" />
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
                ) : library.articles.length === 0 ? (
                    <div className="flex max-w-xl flex-col items-start gap-3 rounded-xl border px-5 py-6">
                        <p className="text-base font-semibold">No procedures have been published yet</p>
                        <Button asChild variant="outline" size="sm">
                            <Link to="/knowledge">
                                <ArrowLeft aria-hidden /> Back to the Knowledge Center
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <ul className="flex max-w-3xl flex-col gap-4">
                        {library.articles.map((article) => (
                            <li key={article.doc.slug}>
                                <ProcedureCard article={article} />
                            </li>
                        ))}
                    </ul>
                )}
            </KnowledgePage>
        </KnowledgeLayout>
    );
}
