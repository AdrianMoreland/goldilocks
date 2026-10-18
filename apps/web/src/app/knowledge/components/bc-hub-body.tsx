import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, OctagonMinus } from 'lucide-react';
import { KB_BC_HUB, type KbBcHubFlow, type KbBcHubItem, type KbGuideTarget } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import { resolveTarget } from '../utils/guide';
import type { KnowledgeLibrary } from '../utils/library';
import { FOCUS, TONE } from '../utils/tone';

/** Both Business Central flows on one page. Every link is resolved against the library, so SOPs the reader may not see are left out. */
export function HubBody({ library }: { library: KnowledgeLibrary }) {
    const hrefOf = (target: KbGuideTarget) => resolveTarget(library, target);
    const hub = KB_BC_HUB;

    return (
        <>
            <div className="grid gap-5 lg:grid-cols-2">
                {hub.flows.map((flow) => (
                    <FlowCard key={flow.id} flow={flow} hrefOf={hrefOf} />
                ))}
            </div>

            <section aria-labelledby="whole-sale">
                <h2 id="whole-sale" className="type-h4 mb-3">
                    The whole sale, in one line
                </h2>
                <ol className="flex flex-wrap items-center gap-1.5">
                    {hub.chain.flatMap((link, index) => {
                        const href = hrefOf(link.target);
                        if (!href) return [];
                        return [
                            <li key={link.label} className="flex items-center gap-1.5">
                                {index > 0 && <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden />}
                                <Link
                                    to={href}
                                    className={cn(
                                        'inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold transition-[filter] hover:brightness-95',
                                        link.tone === 'stop' ? 'bg-stop text-white' : link.tone === 'end' ? TONE.price.fill : 'bg-muted',
                                        FOCUS,
                                    )}
                                >
                                    {link.tone === 'stop' && <OctagonMinus className="mr-1 size-4" aria-hidden />}
                                    {link.label}
                                </Link>
                            </li>,
                        ];
                    })}
                </ol>
            </section>

            <section aria-labelledby="screen-finder">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3">
                    <h2 id="screen-finder" className="type-h4">
                        Which BC screen am I on?
                    </h2>
                    <p className="text-sm text-muted-foreground">Tap the name you see on screen</p>
                </div>
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-2.5">
                    {hub.screens.flatMap((screen) => {
                        const href = hrefOf(screen.target);
                        if (!href) return [];
                        return [
                            <li key={screen.title}>
                                <Link
                                    to={href}
                                    className={cn('flex h-full min-h-14 flex-col gap-0.5 rounded-xl border bg-card px-3.5 py-2.5 transition-colors hover:border-foreground/60 hover:bg-muted', FOCUS)}
                                >
                                    <span className={cn('text-[11px] font-extrabold tracking-wider uppercase', TONE[screen.flow].text)}>
                                        {screen.flow === 'price' ? 'Price flow' : 'Buy-in flow'}
                                    </span>
                                    <span className="text-[15px] font-semibold">{screen.title}</span>
                                    <span className="text-[13px] leading-snug text-muted-foreground">{screen.hint}</span>
                                </Link>
                            </li>,
                        ];
                    })}
                </ul>
            </section>

            <section aria-labelledby="zoho">
                <h2 id="zoho" className="type-h4 mb-3">
                    Zoho → BC table
                </h2>
                <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="grid grid-cols-[1fr_1.4fr] gap-3.5 bg-foreground px-4 py-2.5 text-xs font-bold tracking-widest text-background uppercase" aria-hidden>
                        <span>Zoho Books</span>
                        <span>Business Central</span>
                    </div>
                    <ul>
                        {hub.zoho.flatMap((row) => {
                            const href = hrefOf(row.target);
                            if (!href) return [];
                            return [
                                <li key={row.zoho} className="border-t first:border-t-0">
                                    <Link to={href} className={cn('grid min-h-11 grid-cols-[1fr_1.4fr] items-center gap-3.5 px-4 py-2.5 transition-colors hover:bg-muted', FOCUS)}>
                                        <span>
                                            <span className="sr-only">Zoho Books: </span>
                                            {row.zoho}
                                        </span>
                                        <span className="font-semibold">
                                            <span className="sr-only">Business Central: </span>
                                            {row.bc}
                                        </span>
                                    </Link>
                                </li>,
                            ];
                        })}
                    </ul>
                </div>
            </section>

            <section aria-labelledby="traps">
                <h2 id="traps" className="type-h4 mb-3">
                    Watch out
                </h2>
                <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {hub.traps.flatMap((trap) => {
                        const href = hrefOf(trap.target);
                        if (!href) return [];
                        return [
                            <li key={trap.title}>
                                <Link
                                    to={href}
                                    className={cn(
                                        'flex h-full min-h-14 flex-col gap-0.5 rounded-xl border bg-card px-3.5 py-3 transition-colors hover:border-stop-border hover:bg-stop-bg hover:text-stop-ink',
                                        FOCUS,
                                    )}
                                >
                                    <span className="text-[11px] font-extrabold tracking-wider text-stop uppercase">Trap</span>
                                    <span className="text-[15.5px] font-semibold">{trap.title}</span>
                                    <span className="text-[13.5px] text-muted-foreground">{trap.hint}</span>
                                </Link>
                            </li>,
                        ];
                    })}
                </ul>
            </section>

            {hrefOf(hub.stop.target) && (
                <Link
                    to={hrefOf(hub.stop.target)!}
                    className={cn('flex items-center gap-3.5 rounded-2xl bg-stop px-5 py-4 text-white transition-[filter] hover:brightness-110', FOCUS)}
                >
                    <OctagonMinus className="size-8 shrink-0" aria-hidden />
                    <span>
                        <span className="block text-lg font-bold">{hub.stop.title}</span>
                        <span className="block text-[14.5px] opacity-95">{hub.stop.hint}</span>
                    </span>
                </Link>
            )}
        </>
    );
}

function FlowCard({ flow, hrefOf }: { flow: KbBcHubFlow; hrefOf: (target: KbGuideTarget) => string | null }) {
    const tone = TONE[flow.id];
    const foot = hrefOf(flow.foot.target);
    let step = 0;

    const nodes = flow.items.flatMap((item) => {
        const href = hrefOf(item.target);
        if (!href) return [];
        return [{ item, href, number: item.kind === 'step' ? ++step : 0 }];
    });

    return (
        <article className="overflow-hidden rounded-2xl border bg-card">
            <header className={cn('flex flex-wrap items-baseline justify-between gap-x-3 px-4 py-3 text-[13.5px] font-extrabold tracking-wide uppercase', tone.fill)}>
                <h2>{flow.title}</h2>
                <span className="font-semibold tracking-normal normal-case opacity-85">{flow.sub}</span>
            </header>
            <ol className="flex flex-col px-3.5 pt-3.5 pb-1.5">
                {nodes.map(({ item, href, number }, index) => (
                    <Fragment key={`${item.title}-${index}`}>
                        {index > 0 && <ArrowDown aria-hidden className={cn('mx-auto my-0.5 size-4', tone.arrow)} />}
                        <li>
                            <HubNode item={item} href={href} number={number} tone={flow.id} />
                        </li>
                    </Fragment>
                ))}
            </ol>
            {foot && (
                <div className="px-4 pt-1.5 pb-3.5">
                    <Link
                        to={foot}
                        className={cn('inline-flex min-h-10 items-center gap-1.5 rounded-full border bg-card px-3.5 text-[13.5px] font-medium transition-colors hover:bg-muted', FOCUS)}
                    >
                        {flow.foot.label} <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                </div>
            )}
        </article>
    );
}

function HubNode({ item, href, number, tone }: { item: KbBcHubItem; href: string; number: number; tone: 'price' | 'buyback' }) {
    const t = TONE[tone];

    if (item.kind === 'stop') {
        return (
            <Link
                to={href}
                className={cn('flex items-center gap-3 rounded-xl border border-l-4 border-stop-border border-l-stop bg-stop-bg px-3 py-2.5 text-stop-ink transition-[filter] hover:brightness-95', FOCUS)}
            >
                <OctagonMinus className="size-6 shrink-0 text-stop" aria-hidden />
                <span>
                    <span className="block text-[15px] leading-snug font-semibold">{item.title}</span>
                    <span className="block text-[13px] opacity-85">{item.hint}</span>
                </span>
            </Link>
        );
    }

    return (
        <Link
            to={href}
            className={cn(
                'group flex min-h-12 items-center gap-3 rounded-xl border border-l-4 bg-card px-3 py-2.5 shadow-xs transition-[border-color,box-shadow] hover:shadow-md',
                t.borderLeft,
                t.hoverBorder,
                item.kind === 'external' && 'border-dashed bg-transparent text-muted-foreground shadow-none',
                FOCUS,
            )}
        >
            <span className="min-w-0 flex-1">
                <span className="block text-[15px] leading-snug font-semibold">
                    {item.kind === 'step' && <span className={cn('mr-1.5 font-extrabold', t.text)}>{number}</span>}
                    {item.title}
                </span>
                <span className="block text-[13px] leading-snug text-muted-foreground">{item.hint}</span>
                {item.kind === 'step' && (
                    <span className="mt-1 inline-block rounded-[5px] bg-muted px-1.5 font-mono text-xs leading-5 font-medium text-foreground/80">{item.screen}</span>
                )}
            </span>
            {item.kind === 'step' && <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />}
        </Link>
    );
}
