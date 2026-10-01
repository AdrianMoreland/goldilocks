import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { kbArticlePath } from '@goldilocks/shared-types';
import { formatDay } from '../utils/format';
import type { KnowledgeArticle } from '../utils/library';
import { jumpSections } from '../utils/guide';
import { StatusBadge, UnconfirmedBadge } from './status-badges';

/**
 * One procedure in the A–Z list: its name, what it's for, and one-click jumps
 * to the exact part you need ("Identity check", "Paying the customer"), so
 * nobody has to open the whole thing to find a single answer.
 */
export function ProcedureCard({ article }: { article: KnowledgeArticle }) {
    const { doc } = article;
    const sections = jumpSections(article);

    return (
        <article className="rounded-xl border bg-card p-5">
            <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0 space-y-1">
                    <h2 className="text-lg leading-6 font-semibold">
                        <Link
                            to={kbArticlePath(doc.slug)}
                            className="underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            {doc.title}
                        </Link>
                    </h2>
                    {article.summary && <p className="line-clamp-2 text-sm text-muted-foreground">{article.summary}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={doc.status} />
                    <UnconfirmedBadge count={article.todoSectionCount} />
                </div>
            </header>

            {sections.length > 0 && (
                <nav aria-label={`Jump to a part of ${doc.title}`} className="mt-4">
                    <ul className="flex flex-wrap gap-2">
                        {sections.map((section) => (
                            <li key={section.anchor}>
                                <Link
                                    to={kbArticlePath(doc.slug, section.anchor)}
                                    className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-sm transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                                >
                                    {section.heading}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            <footer className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="tabular-nums">
                    Owner {doc.owner} · v{doc.version} · Updated {formatDay(doc.contentUpdatedOn)}
                </span>
                <Link to={kbArticlePath(doc.slug)} className="inline-flex items-center gap-1 font-medium text-foreground hover:underline underline-offset-4">
                    Open <ArrowRight className="size-3.5" aria-hidden />
                </Link>
            </footer>
        </article>
    );
}
