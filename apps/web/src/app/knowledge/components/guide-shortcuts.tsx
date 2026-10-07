import { Link } from 'react-router-dom';
import { ArrowRight, Blocks } from 'lucide-react';
import { KB_GUIDE, type KbGuideShortcut } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeLibrary } from '../utils/library';
import { GUIDE_ICONS, resolveTarget } from '../utils/guide';

const FOCUS = 'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none';

function resolve(library: KnowledgeLibrary, shortcuts: KbGuideShortcut[]) {
    return shortcuts.flatMap((shortcut) => {
        const href = resolveTarget(library, shortcut.target);
        // Not in the library: a SOP still to be written shows as "coming soon"; anything else is left out.
        return href || shortcut.pendingSop ? [{ ...shortcut, href }] : [];
    });
}

/** Everyday lookups that don't belong to either side of the trade: one row, one answer. */
export function QuickLinks({ library }: { library: KnowledgeLibrary }) {
    const links = resolve(library, KB_GUIDE.quickLinks).filter((link) => link.href);

    return (
        <section aria-labelledby="quick-links">
            <h2 id="quick-links" className="type-h4 mb-3">
                Quick links
            </h2>
            <ul className="flex flex-col gap-2">
                {links.map((link) => {
                    const Icon = GUIDE_ICONS[link.icon];
                    return (
                        <li key={link.label}>
                            <Link
                                to={link.href!}
                                className={cn('group flex items-center gap-3 rounded-xl border bg-card p-2.5 pr-4 transition-colors hover:bg-muted/50', FOCUS)}
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                                    <Icon className="size-5" aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-base leading-5 font-semibold">{link.label}</span>
                                    <span className="block truncate text-sm text-muted-foreground">{link.hint}</span>
                                </span>
                                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

/** The bigger destinations: a whole procedure, or the Pricing Workbook itself. */
export function ToolTiles({ library }: { library: KnowledgeLibrary }) {
    const tools = resolve(library, KB_GUIDE.tools);

    return (
        <section aria-labelledby="tools-resources">
            <h2 id="tools-resources" className="type-h4 mb-3">
                Tools &amp; resources
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tools.map((tool) => {
                    const Icon = GUIDE_ICONS[tool.icon];
                    const body = (
                        <>
                            <span
                                className={cn(
                                    'flex size-10 items-center justify-center rounded-lg',
                                    tool.href ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                                )}
                            >
                                <Icon className="size-5" aria-hidden />
                            </span>
                            <span className="mt-auto pt-4">
                                <span className="block text-base leading-5 font-semibold">{tool.label}</span>
                                <span className={cn('mt-1 block text-xs leading-4', tool.href ? 'text-background/75' : 'text-muted-foreground')}>
                                    {tool.href ? tool.hint : 'Coming soon — not written yet'}
                                </span>
                            </span>
                        </>
                    );

                    return (
                        <li key={tool.label} className="flex">
                            {tool.href ? (
                                <Link
                                    to={tool.href}
                                    className={cn(
                                        'flex min-h-36 w-full flex-col rounded-xl bg-foreground p-4 text-background transition-colors hover:bg-foreground/90',
                                        FOCUS,
                                    )}
                                >
                                    {body}
                                </Link>
                            ) : (
                                <div className="flex min-h-36 w-full flex-col rounded-xl border border-dashed p-4 text-muted-foreground" aria-disabled>
                                    {body}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

/** Business Central has its own row: the how-tos are the part of the desk's day most people have to look up. */
export function BusinessCentralStrip({ library }: { library: KnowledgeLibrary }) {
    const { title, hint, start, links } = KB_GUIDE.businessCentral;
    const startHref = resolveTarget(library, start.target);
    const items = links.flatMap((link) => {
        const href = resolveTarget(library, link.target);
        return href ? [{ ...link, href }] : [];
    });
    if (!startHref && items.length === 0) return null;

    return (
        <section aria-labelledby="business-central" className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                        <Blocks className="size-5" aria-hidden />
                    </span>
                    <div>
                        <h2 id="business-central" className="type-h4">
                            {title}
                        </h2>
                        <p className="text-sm text-muted-foreground">{hint}</p>
                    </div>
                </div>
                {startHref && (
                    <Link
                        to={startHref}
                        className={cn('inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground', FOCUS)}
                    >
                        {start.label} <ArrowRight className="size-4" aria-hidden />
                    </Link>
                )}
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
                {items.map((link) => (
                    <li key={link.label}>
                        <Link
                            to={link.href}
                            className={cn('inline-flex items-center rounded-md border bg-background px-2.5 py-1.5 text-sm transition-colors hover:bg-muted/50', FOCUS)}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
