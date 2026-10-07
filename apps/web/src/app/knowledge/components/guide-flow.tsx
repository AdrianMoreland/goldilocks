import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowLeftRight, Blocks } from 'lucide-react';
import { KB_GUIDE, type KbGuideBranch } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeLibrary } from '../utils/library';
import { GUIDE_ICONS, resolveTarget } from '../utils/guide';

/**
 * Price is teal and Buyback is raspberry everywhere in this product (the
 * Direction Is Colour rule), so the fork carries them: a clerk knows which
 * side they're on before reading a word. Classes are spelled out in full so
 * Tailwind can see them.
 */
const TONE = {
    price: {
        fill: 'bg-price',
        chip: 'bg-price/15 text-price-text',
        arrow: 'text-price/55',
        hover: 'hover:border-price',
        chipHover: 'hover:border-price hover:bg-price/10',
    },
    buyback: {
        fill: 'bg-buyback',
        chip: 'bg-buyback/15 text-buyback-text',
        arrow: 'text-buyback/55',
        hover: 'hover:border-buyback',
        chipHover: 'hover:border-buyback hover:bg-buyback/10',
    },
} as const;

const FOCUS = 'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none';

export function GuideFlow({ library }: { library: KnowledgeLibrary }) {
    return (
        <div className="flex flex-col">
            <div className="mx-auto flex max-w-md items-center gap-3 rounded-xl border bg-card px-5 py-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <ArrowLeftRight className="size-5" aria-hidden />
                </span>
                <div>
                    <h2 className="text-lg leading-6 font-semibold">{KB_GUIDE.start.title}</h2>
                    <p className="text-sm text-muted-foreground">{KB_GUIDE.start.hint}</p>
                </div>
            </div>

            {/*
              The fork (wide screens): one line from the question that splits to the two
              branches. The neutral line eases into each branch's colour along the
              horizontal run, so it never jumps from grey to full teal/raspberry, and
              each side ends in a large arrowhead pointing into its branch.
            */}
            <div className="relative h-20 w-full max-lg:hidden" aria-hidden>
                <span className="absolute top-0 left-1/2 h-7 w-0.5 -translate-x-1/2 bg-foreground/25" />
                <span className="absolute top-7 left-1/4 h-0.5 w-1/4 bg-linear-to-l from-foreground/25 to-price/55" />
                <span className="absolute top-7 left-1/2 h-0.5 w-1/4 bg-linear-to-r from-foreground/25 to-buyback/55" />
                <span className="absolute top-7 bottom-8 left-1/4 w-0.5 -translate-x-1/2 bg-price/55" />
                <span className="absolute top-7 bottom-8 left-3/4 w-0.5 -translate-x-1/2 bg-buyback/55" />
                <ArrowDown className="absolute bottom-0 left-1/4 size-8 -translate-x-1/2 text-price/55" strokeWidth={1.5} />
                <ArrowDown className="absolute bottom-0 left-3/4 size-8 -translate-x-1/2 text-buyback/55" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-center lg:hidden" aria-hidden>
                <span className="h-6 w-0.5 bg-foreground/25" />
                <ArrowDown className="size-8 text-foreground/25" strokeWidth={1.5} />
            </div>

            <div className="grid items-start gap-x-6 gap-y-10 lg:grid-cols-2">
                {KB_GUIDE.branches.map((branch) => (
                    <Branch key={branch.id} branch={branch} library={library} />
                ))}
            </div>
        </div>
    );
}

function Branch({ branch, library }: { branch: KbGuideBranch; library: KnowledgeLibrary }) {
    const tone = TONE[branch.id];
    const Icon = GUIDE_ICONS[branch.icon];

    // A step whose SOP or section has gone away is left out, not shown as a dead link.
    const steps = branch.steps.flatMap((step) => {
        const href = resolveTarget(library, step.target);
        const bcHref = step.bc ? resolveTarget(library, step.bc.target) : null;
        return href ? [{ ...step, href, bcHref }] : [];
    });
    const alsoSee = branch.alsoSee.flatMap((link) => {
        const href = resolveTarget(library, link.target);
        return href ? [{ ...link, href }] : [];
    });

    return (
        <section aria-labelledby={`branch-${branch.id}`} className="min-w-0">
            <header className={cn('rounded-xl p-5 text-zinc-900', tone.fill)}>
                <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900/10">
                        <Icon className="size-6" aria-hidden />
                    </span>
                    <div>
                        <h2 id={`branch-${branch.id}`} className="type-h3 leading-7 font-bold">
                            {branch.title}
                        </h2>
                        <p className="text-sm font-semibold">{branch.tag}</p>
                    </div>
                </div>
                <p className="mt-3 text-sm leading-5">{branch.blurb}</p>
            </header>

            <ol>
                {steps.map((step, index) => {
                    const StepIcon = GUIDE_ICONS[step.icon];
                    return (
                        <Fragment key={step.title}>
                            <li aria-hidden className="flex h-12 items-center justify-center">
                                <ArrowDown className={cn('size-9', tone.arrow)} strokeWidth={1.5} />
                            </li>
                            <li>
                                <Link
                                    to={step.href}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-xl border bg-card p-3.5 transition-colors hover:bg-muted/50',
                                        tone.hover,
                                        FOCUS,
                                    )}
                                >
                                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-bold tabular-nums', tone.chip)}>
                                        {index + 1}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-base leading-5 font-semibold">{step.title}</span>
                                        <span className="mt-0.5 block text-sm text-muted-foreground">{step.hint}</span>
                                    </span>
                                    <StepIcon className="size-5 shrink-0 text-muted-foreground group-hover:hidden" aria-hidden />
                                    <ArrowRight className="hidden size-5 shrink-0 group-hover:block" aria-hidden />
                                </Link>
                                {step.bc && step.bcHref && (
                                    <Link
                                        to={step.bcHref}
                                        className={cn(
                                            'mt-1.5 ml-11 inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-sm transition-colors',
                                            tone.chipHover,
                                            FOCUS,
                                        )}
                                    >
                                        <Blocks className="size-3.5 text-muted-foreground" aria-hidden />
                                        <span className="font-medium">In BC:</span> {step.bc.label}
                                    </Link>
                                )}
                            </li>
                        </Fragment>
                    );
                })}
            </ol>

            {alsoSee.length > 0 && (
                <div className="mt-6">
                    <p className="mb-2 text-sm font-semibold">Also branches off here</p>
                    <ul className="flex flex-wrap gap-2">
                        {alsoSee.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={link.href}
                                    className={cn('inline-flex items-center rounded-md border bg-card px-2.5 py-1.5 text-sm transition-colors', tone.chipHover, FOCUS)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
