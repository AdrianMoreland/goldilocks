import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import { kbArticlePath } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';

export interface TocEntry {
    anchor: string;
    heading: string;
    hasTodo: boolean;
}

/** The anchor of whichever section is currently under the top of the viewport. */
function useActiveAnchor(anchors: string[]): string | null {
    const [active, setActive] = useState<string | null>(anchors[0] ?? null);
    const key = anchors.join('|');

    useEffect(() => {
        const elements = anchors.map((anchor) => document.getElementById(anchor)).filter((el): el is HTMLElement => el !== null);
        if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(visible[0].target.id);
            },
            // A band near the top of the viewport: the section whose heading has just scrolled into it is "current".
            { rootMargin: '-90px 0px -65% 0px' },
        );
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
        // `key` stands in for the anchors array, whose identity changes every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return active;
}

const FOCUS = 'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none';

/**
 * "On this page". On wide screens it is the list in the right-hand rail; below
 * that it becomes a row of pills that sticks under the header, so the first
 * step is not pushed off a phone's screen.
 */
export function ArticleToc({ slug, entries, variant, className }: { slug: string; entries: TocEntry[]; variant: 'rail' | 'pills'; className?: string }) {
    const active = useActiveAnchor(entries.map((entry) => entry.anchor));

    if (entries.length < 2) return null;

    if (variant === 'pills') {
        return (
            <nav
                aria-label="On this page"
                className={cn('sticky top-[var(--header-height)] z-10 -mx-4 mb-4 flex gap-1.5 overflow-x-auto border-b bg-background px-4 py-2 whitespace-nowrap', className)}
            >
                {entries.map((entry) => (
                    <Link
                        key={entry.anchor}
                        to={kbArticlePath(slug, entry.anchor)}
                        replace
                        aria-current={entry.anchor === active ? 'location' : undefined}
                        className={cn(
                            'inline-flex min-h-10 flex-none items-center gap-1 rounded-full border px-3.5 text-[13px] transition-colors',
                            entry.anchor === active ? 'border-foreground bg-foreground text-background' : 'bg-card hover:bg-muted',
                            FOCUS,
                        )}
                    >
                        {entry.heading}
                        {entry.hasTodo && <TriangleAlert className="size-3" aria-label="Contains facts still to be confirmed" />}
                    </Link>
                ))}
            </nav>
        );
    }

    return (
        <nav aria-label="On this page" className={className}>
            <p className="mb-1.5 text-sm font-semibold">On this page</p>
            <ol className="border-l">
                {entries.map((entry) => {
                    const isActive = entry.anchor === active;
                    return (
                        <li key={entry.anchor}>
                            <Link
                                to={kbArticlePath(slug, entry.anchor)}
                                replace
                                aria-current={isActive ? 'location' : undefined}
                                className={cn(
                                    '-ml-px flex items-start gap-1.5 border-l-2 py-1 pr-2 pl-3 text-sm leading-snug transition-colors',
                                    FOCUS,
                                    isActive ? 'border-primary font-semibold text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <span className="flex-1">{entry.heading}</span>
                                {entry.hasTodo && (
                                    <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-amber-700 dark:text-amber-400" aria-label="Contains facts still to be confirmed" />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
