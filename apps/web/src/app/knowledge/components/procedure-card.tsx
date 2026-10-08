import { Link } from 'react-router-dom';
import { flowBarFor, kbArticlePath } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeArticle } from '../utils/library';
import { TONE } from '../utils/tone';
import { StatusBadge, UnconfirmedBadge } from './status-badges';

/**
 * One procedure in the library: its name, what it is for in a line, and the
 * only decoration that carries meaning — which flow it belongs to, whether it
 * is still a draft, and whether anything in it is to be confirmed.
 */
export function ProcedureCard({ article }: { article: KnowledgeArticle }) {
    const { doc } = article;
    const flow = flowBarFor(doc.slug)?.bar;
    const flowLabel = flow?.label.split('·')[1]?.trim();

    return (
        <Link
            to={kbArticlePath(doc.slug)}
            className="flex h-full min-h-24 flex-col gap-1.5 rounded-xl border bg-card px-3.5 py-3 transition-colors hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <span className="text-[15px] leading-snug font-semibold">{doc.title}</span>
            {article.summary && <span className="line-clamp-2 text-[13px] leading-snug text-muted-foreground">{article.summary}</span>}
            <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {flow && flowLabel && (
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', TONE[flow.tone].chip)}>{flowLabel}</span>
                )}
                {doc.status !== 'approved' && <StatusBadge status={doc.status} />}
                <UnconfirmedBadge count={article.todoSectionCount} />
            </span>
        </Link>
    );
}
