import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import { kbArticlePath, type KbSection } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';

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
            { rootMargin: '-72px 0px -65% 0px' },
        );
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
        // `key` stands in for the anchors array, whose identity changes every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return active;
}

export function ArticleToc({ slug, sections, className }: { slug: string; sections: KbSection[]; className?: string }) {
    // The lead ("Purpose"/"Summary") opens the page; it isn't something you jump to.
    const entries = sections.filter((section) => section.heading && section.anchor && !['purpose', 'summary'].includes(section.anchor));
    const active = useActiveAnchor(entries.map((section) => section.anchor));

    if (entries.length < 2) return null;

    return (
        <nav aria-label="On this page" className={className}>
            <p className="mb-2 px-2.5 text-sm font-semibold">On this page</p>
            <ol className="space-y-0.5 border-l">
                {entries.map((section) => {
                    const isActive = section.anchor === active;
                    return (
                        <li key={section.anchor}>
                            <Link
                                to={kbArticlePath(slug, section.anchor)}
                                replace
                                aria-current={isActive ? 'location' : undefined}
                                className={cn(
                                    '-ml-px flex items-start gap-1.5 border-l py-1 pr-2 pl-2.5 text-sm transition-colors',
                                    'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                                    isActive
                                        ? 'border-primary font-medium text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <span className="flex-1">{section.heading}</span>
                                {section.hasTodo && (
                                    <TriangleAlert
                                        className="mt-0.5 size-3.5 shrink-0 text-amber-700 dark:text-amber-400"
                                        aria-label="Contains facts still to be confirmed"
                                    />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
