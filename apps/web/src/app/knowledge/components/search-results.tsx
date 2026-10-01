import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { kbArticlePath, type KbSearchHit } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import { UnconfirmedBadge } from './status-badges';

/** Search results are sections, not documents: each one deep-links to its heading. */
export function SearchResultList({ hits, query }: { hits: KbSearchHit[]; query: string }) {
    return (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card" aria-label={`Search results for ${query}`}>
            {hits.map((hit) => (
                <li key={`${hit.slug}#${hit.sectionAnchor ?? ''}`}>
                    <Link
                        to={kbArticlePath(hit.slug, hit.sectionAnchor)}
                        className="block px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
                            <span className="font-semibold">{hit.title}</span>
                            {hit.sectionHeading && (
                                <>
                                    <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden />
                                    <span className="font-medium">{hit.sectionHeading}</span>
                                </>
                            )}
                            <UnconfirmedBadge count={hit.hasTodo ? 1 : 0} className="ml-1" />
                        </span>
                        {hit.snippet.length > 0 && (
                            <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
                                {hit.snippet.map((part, index) => (
                                    <span
                                        key={index}
                                        className={cn(
                                            part.hit &&
                                                'rounded-sm bg-[color-mix(in_oklab,var(--primary)_28%,transparent)] px-0.5 font-medium text-foreground',
                                        )}
                                    >
                                        {part.text}
                                    </span>
                                ))}
                            </span>
                        )}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
