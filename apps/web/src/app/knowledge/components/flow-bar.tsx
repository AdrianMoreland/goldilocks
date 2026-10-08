import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { flowBarFor, kbArticlePath, type KbFlowBar } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeLibrary } from '../utils/library';
import { resolveTarget } from '../utils/guide';
import { FOCUS, TONE } from '../utils/tone';

/** The flow a procedure belongs to, limited to the steps that are in the library, with the current one marked. */
function useFlow(slug: string, library: KnowledgeLibrary) {
    const found = flowBarFor(slug);
    if (!found) return null;
    const items = found.bar.items.filter((item) => library.bySlug.has(item.slug));
    const index = items.findIndex((item) => item.slug === slug);
    if (index < 0) return null;
    return { bar: found.bar, items, index, overview: resolveTarget(library, found.bar.overview) };
}

/** "Where this fits": the stepper at the top of a procedure that belongs to the Price or Buyback process. */
export function FlowBar({ slug, library }: { slug: string; library: KnowledgeLibrary }) {
    const flow = useFlow(slug, library);
    if (!flow) return null;
    const tone = TONE[flow.bar.tone];

    return (
        <nav aria-label="Where this fits" className="mb-4 rounded-xl border bg-card px-3 pt-2.5 pb-3">
            <div className="mb-2 flex items-center justify-between gap-2">
                <p className={cn('text-xs font-bold tracking-wider uppercase', tone.text)}>{flow.bar.label}</p>
                {flow.overview && (
                    <Link to={flow.overview} className={cn('rounded-md px-1.5 py-1 text-[12.5px] text-muted-foreground hover:text-foreground hover:underline', FOCUS)}>
                        See the whole flow
                    </Link>
                )}
            </div>
            <ol className="flex items-stretch gap-1 overflow-x-auto pb-0.5">
                {flow.items.map((item, index) => {
                    const current = index === flow.index;
                    return (
                        <Fragment key={item.slug}>
                            {index > 0 && <ArrowRight className="size-3.5 flex-none self-center text-muted-foreground" aria-hidden />}
                            <li className="flex min-w-[5.25rem] flex-1">
                                <Link
                                    to={kbArticlePath(item.slug)}
                                    aria-current={current ? 'step' : undefined}
                                    className={cn(
                                        'flex min-h-11 w-full flex-col justify-center rounded-[9px] border px-2.5 py-1.5 text-left text-[12.5px] leading-tight transition-colors',
                                        current ? cn(tone.fill, 'border-transparent font-bold') : cn('bg-background', tone.hoverBorder, index < flow.index && tone.tint),
                                        FOCUS,
                                    )}
                                >
                                    <span className={cn('text-[11px] font-bold tracking-wide', current ? 'opacity-70' : 'text-muted-foreground')}>STEP {index + 1}</span>
                                    {item.label}
                                </Link>
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}

/** The same flow as a vertical list, for the right-hand rail. */
export function FlowStepper({ slug, library }: { slug: string; library: KnowledgeLibrary }) {
    const flow = useFlow(slug, library);
    if (!flow) return null;
    const tone = TONE[flow.bar.tone];

    return (
        <nav aria-label={flow.bar.label} className="rounded-xl border bg-card px-3.5 py-3">
            <p className="mb-1.5 text-sm font-semibold">{flow.bar.label}</p>
            <ol>
                {flow.items.map((item, index) => {
                    const current = index === flow.index;
                    const done = index < flow.index;
                    return (
                        <li key={item.slug}>
                            <Link
                                to={kbArticlePath(item.slug)}
                                aria-current={current ? 'step' : undefined}
                                className={cn('flex min-h-9 items-center gap-2.5 rounded-lg px-1 py-1 text-[13.5px] leading-tight hover:bg-muted', current && 'font-bold', FOCUS)}
                            >
                                <span
                                    className={cn(
                                        'flex size-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-extrabold',
                                        tone.border,
                                        current ? tone.fill : tone.text,
                                    )}
                                >
                                    {done ? <Check className="size-3" aria-hidden /> : index + 1}
                                </span>
                                {item.label}
                                {done && <span className="sr-only"> (done)</span>}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export type { KbFlowBar };
