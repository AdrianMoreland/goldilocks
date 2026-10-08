import { Link } from 'react-router-dom';
import { ArrowRight, Blocks, OctagonMinus } from 'lucide-react';
import { KB_GUIDE, type KbGuideShortcut } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeLibrary } from '../utils/library';
import { GUIDE_ICONS, resolveTarget } from '../utils/guide';
import { FOCUS } from '../utils/tone';


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

/** Business Central's front door: learn it, see both flows on one page, or get unstuck. */
export function BusinessCentralBanner({ library }: { library: KnowledgeLibrary }) {
    const { title, hint, start, hub, stuck } = KB_GUIDE.businessCentral;
    const startHref = resolveTarget(library, start.target);
    const hubHref = resolveTarget(library, hub.target);
    const stuckHref = resolveTarget(library, stuck.target);
    if (!startHref && !hubHref && !stuckHref) return null;

    const button = 'inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors';
    return (
        <section aria-labelledby="business-central" className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border bg-card px-4.5 py-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
                <Blocks className="size-5.5" aria-hidden />
            </span>
            <div className="min-w-56 flex-1">
                <h2 id="business-central" className="type-h4">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground">{hint}</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {startHref && (
                    <Link to={startHref} className={cn(button, 'border-primary bg-primary text-primary-foreground hover:bg-primary/90', FOCUS)}>
                        {start.label} <ArrowRight className="size-4" aria-hidden />
                    </Link>
                )}
                {hubHref && (
                    <Link to={hubHref} className={cn(button, 'bg-card hover:bg-muted', FOCUS)}>
                        {hub.label}
                    </Link>
                )}
                {stuckHref && (
                    <Link to={stuckHref} className={cn(button, 'bg-card hover:bg-muted', FOCUS)}>
                        <OctagonMinus className="size-4 text-stop" aria-hidden /> {stuck.label}
                    </Link>
                )}
            </div>
        </section>
    );
}
