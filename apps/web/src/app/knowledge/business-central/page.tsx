import { Link } from 'react-router-dom';
import { KB_BC_HUB } from '@goldilocks/shared-types';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useKnowledgeLibrary } from '@/hooks/use-knowledge.hook';
import { KnowledgeLayout } from '../components/knowledge-layout';
import { KnowledgePage } from '../components/knowledge-page';
import { HubBody } from '../components/bc-hub-body';

/** Business Central on one page: the shape of the work first, then every box is a link to the exact clicks. */
export default function BusinessCentralHubPage() {
    const { library, isLoading, isError } = useKnowledgeLibrary();
    const ready = !isLoading && !isError && library.articles.length > 0;

    return (
        <KnowledgeLayout>
            <KnowledgePage className="gap-9">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/knowledge">Knowledge Center</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Business Central</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <header className="max-w-3xl">
                    <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-balance md:text-[2.5rem]">{KB_BC_HUB.title}</h1>
                    <p className="mt-2.5 max-w-[60ch] text-[17px] text-foreground/80">{KB_BC_HUB.intro}</p>
                </header>

                {isLoading ? (
                    <div className="grid gap-5 md:grid-cols-2" aria-busy="true" aria-label="Loading">
                        <Skeleton className="h-96 rounded-2xl" />
                        <Skeleton className="h-96 rounded-2xl" />
                    </div>
                ) : isError ? (
                    <p role="alert" className="max-w-xl rounded-xl border px-5 py-6 text-sm">
                        Couldn’t load the procedures. Check the connection, then reload the page.
                    </p>
                ) : !ready ? (
                    <p className="max-w-xl rounded-xl border px-5 py-6 text-sm">No procedures have been published yet.</p>
                ) : (
                    <HubBody library={library} />
                )}
            </KnowledgePage>
        </KnowledgeLayout>
    );
}
