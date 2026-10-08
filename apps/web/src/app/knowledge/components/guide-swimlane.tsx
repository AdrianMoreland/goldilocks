import { Fragment } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowLeftRight, ArrowRight, Blocks, OctagonMinus, UserRound } from 'lucide-react';
import { KB_GUIDE, type KbFlowTone, type KbGuideBranch, type KbGuideNode } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeLibrary } from '../utils/library';
import { GUIDE_ICONS, resolveTarget } from '../utils/guide';
import { FOCUS, TONE } from '../utils/tone';

type ResolvedNode = KbGuideNode & { href: string };

const resolveNodes = (library: KnowledgeLibrary, nodes: KbGuideNode[]): ResolvedNode[] =>
    nodes.flatMap((node) => {
        // A node whose SOP or section has gone away is left out, not shown as a dead link.
        const href = resolveTarget(library, node.target);
        return href ? [{ ...node, href }] : [];
    });

/** "Who is paying whom?", then the swimlane of the side you picked. The choice lives in the URL (?flow=). */
export function GuideSwimlane({ library }: { library: KnowledgeLibrary }) {
    const [params, setParams] = useSearchParams();
    const active: KbFlowTone = params.get('flow') === 'buyback' ? 'buyback' : 'price';
    const branch = KB_GUIDE.branches.find((candidate) => candidate.id === active) ?? KB_GUIDE.branches[0]!;

    const choose = (id: KbFlowTone) => {
        const next = new URLSearchParams(params);
        if (id === 'price') next.delete('flow');
        else next.set('flow', id);
        setParams(next, { replace: true });
    };

    return (
        <section aria-labelledby="who-is-paying" className="flex flex-col">
            <div className="mx-auto flex max-w-xl items-center gap-3 rounded-xl border bg-card px-5 py-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <ArrowLeftRight className="size-5" aria-hidden />
                </span>
                <div>
                    <h2 id="who-is-paying" className="text-lg leading-6 font-semibold">
                        {KB_GUIDE.start.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{KB_GUIDE.start.hint}</p>
                </div>
            </div>

            {/* The fork: the neutral line eases into each side's colour. */}
            <div className="relative h-9 w-full max-md:hidden" aria-hidden>
                <span className="absolute top-0 left-1/2 h-3.5 w-0.5 -translate-x-1/2 bg-foreground/25" />
                <span className="absolute top-3.5 right-1/4 left-1/4 h-0.5 bg-linear-to-r from-price via-foreground/25 to-buyback opacity-70" />
                <span className="absolute top-3.5 left-1/4 h-5 w-0.5 -translate-x-1/2 bg-price" />
                <span className="absolute top-3.5 left-3/4 h-5 w-0.5 -translate-x-1/2 bg-buyback" />
            </div>
            <div className="h-3 md:hidden" />

            <div role="group" aria-label="Direction of the trade" className="grid gap-3 md:grid-cols-2 md:gap-4">
                {KB_GUIDE.branches.map((candidate) => (
                    <FlowChoice key={candidate.id} branch={candidate} pressed={candidate.id === active} onChoose={() => choose(candidate.id)} />
                ))}
            </div>

            <Swimlane key={branch.id} branch={branch} library={library} />
        </section>
    );
}

function FlowChoice({ branch, pressed, onChoose }: { branch: KbGuideBranch; pressed: boolean; onChoose: () => void }) {
    const tone = TONE[branch.id];
    const Icon = GUIDE_ICONS[branch.icon];
    return (
        <button
            type="button"
            aria-pressed={pressed}
            aria-controls={`lane-${branch.id}`}
            onClick={onChoose}
            className={cn(
                'flex min-h-14 items-center gap-3 rounded-xl border-2 bg-card p-3.5 text-left transition-colors',
                FOCUS,
                pressed ? cn(tone.border, tone.tint) : 'border-border opacity-80 hover:opacity-100',
            )}
        >
            <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-lg', tone.fill)}>
                <Icon className="size-6" aria-hidden />
            </span>
            <span className="min-w-0">
                <span className="block text-lg leading-tight font-bold">{branch.title}</span>
                <span className="block text-sm leading-snug text-muted-foreground">
                    {branch.tag}. {branch.id === 'price' ? 'They pay us.' : 'We pay them.'}
                </span>
            </span>
        </button>
    );
}

function Swimlane({ branch, library }: { branch: KbGuideBranch; library: KnowledgeLibrary }) {
    const tone = TONE[branch.id];
    const phases = branch.phases
        .map((phase) => ({
            ...phase,
            gateHref: phase.gate ? resolveTarget(library, phase.gate.target) : null,
            desk: resolveNodes(library, phase.desk),
            bc: resolveNodes(library, phase.bc),
        }))
        .filter((phase) => phase.desk.length > 0 || phase.bc.length > 0);
    const alsoSee = branch.alsoSee.flatMap((link) => {
        const href = resolveTarget(library, link.target);
        return href ? [{ ...link, href }] : [];
    });

    return (
        <div id={`lane-${branch.id}`} role="region" aria-label={`${branch.title}: ${branch.tag}`} className="mt-5">
            <p className="mb-1 text-sm text-muted-foreground md:hidden">{branch.blurb}</p>

            {/* Lane headers only where the two lanes sit side by side. */}
            <div aria-hidden className="sticky top-[var(--header-height)] z-10 hidden grid-cols-2 gap-4 border-b bg-background py-2 pl-28 md:grid">
                <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    <UserRound className="size-4" /> At the desk
                </p>
                <p className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                    <span className="flex size-5 items-center justify-center rounded-md bg-foreground text-background">
                        <Blocks className="size-3.5" />
                    </span>
                    In Business Central
                </p>
            </div>

            <ol>
                {phases.map((phase, index) => (
                    <li
                        key={phase.title}
                        aria-label={`Phase ${index + 1}: ${phase.title}`}
                        className={cn('relative py-4 pl-14 md:pl-28', index > 0 && 'border-t border-dashed')}
                    >
                        <div className="absolute top-4 left-0 flex w-11 flex-col items-center gap-1.5 text-center md:w-24">
                            <span className={cn('relative z-10 flex size-9 items-center justify-center rounded-full text-base font-extrabold', tone.fill)}>{index + 1}</span>
                            <span className="relative z-10 hidden bg-background px-0.5 text-xs leading-tight font-semibold text-foreground/80 md:block">{phase.title}</span>
                        </div>
                        {index < phases.length - 1 && (
                            <span aria-hidden className={cn('absolute top-[3.75rem] -bottom-4 left-[22px] w-0.5 -translate-x-1/2 md:left-12', tone.line)} />
                        )}

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                            <h3 className="text-sm font-semibold md:hidden">{phase.title}</h3>

                            {phase.gate && phase.gateHref && (
                                <Link
                                    to={phase.gateHref}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl border border-stop-border bg-stop-bg px-4 py-3 text-stop-ink transition-[filter] hover:brightness-95 md:col-span-2',
                                        FOCUS,
                                    )}
                                >
                                    <OctagonMinus className="size-7 shrink-0 text-stop" aria-hidden />
                                    <span>
                                        <span className="block text-base leading-tight font-bold">{phase.gate.title}</span>
                                        <span className="block text-sm opacity-90">{phase.gate.hint}</span>
                                    </span>
                                </Link>
                            )}

                            <Lane label="At the desk" icon={<UserRound className="size-3.5" aria-hidden />} nodes={phase.desk} branch={branch} />
                            <Lane label="In Business Central" icon={<Blocks className="size-3.5" aria-hidden />} nodes={phase.bc} branch={branch} bc />
                        </div>
                    </li>
                ))}
            </ol>

            {alsoSee.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">Also branches off here</p>
                    <ul className="contents">
                        {alsoSee.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={link.href}
                                    className={cn('inline-flex min-h-10 items-center rounded-full border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-muted', FOCUS)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function Lane({ label, icon, nodes, branch, bc = false }: { label: string; icon: React.ReactNode; nodes: ResolvedNode[]; branch: KbGuideBranch; bc?: boolean }) {
    if (nodes.length === 0) return <div className="max-md:hidden" />;
    return (
        <div className={cn('min-w-0 self-start max-md:w-full', bc && 'rounded-xl border bg-muted/40 p-2.5')}>
            {/* The lanes stack on narrow screens, so each says which it is. */}
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase md:hidden">
                {icon} {label}
            </p>
            {nodes.map((node, index) => (
                <Fragment key={node.title}>
                    {index > 0 && <ArrowDown aria-hidden className={cn('mx-auto my-0.5 size-4', TONE[branch.id].arrow)} />}
                    <FlowNode node={node} tone={branch.id} bc={bc} />
                </Fragment>
            ))}
        </div>
    );
}

function FlowNode({ node, tone, bc }: { node: ResolvedNode; tone: KbFlowTone; bc: boolean }) {
    const t = TONE[tone];
    return (
        <Link
            to={node.href}
            className={cn(
                'group relative flex min-h-12 w-full items-center gap-3 rounded-xl border border-l-4 bg-card px-3 py-2.5 shadow-xs transition-[border-color,box-shadow,transform] hover:shadow-md motion-safe:hover:-translate-y-px',
                t.borderLeft,
                t.hoverBorder,
                node.kind === 'external' && 'border-dashed bg-transparent text-muted-foreground shadow-none motion-safe:hover:translate-y-0',
                node.kind === 'soft' && 'border-l border-l-border',
                FOCUS,
            )}
        >
            <span className="min-w-0 flex-1">
                <span className="block text-[15px] leading-snug font-semibold">
                    {node.title}
                    {bc && node.kind !== 'external' && (
                        <span className="mb-px ml-1.5 rounded-[5px] bg-foreground px-1.5 py-px align-middle text-[10.5px] font-extrabold tracking-wide text-background">BC</span>
                    )}
                    {node.optional && <span className="ml-1.5 text-[13px] font-medium text-muted-foreground">(if new)</span>}
                </span>
                <span className="mt-px block text-[13px] leading-snug text-muted-foreground">{node.hint}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
        </Link>
    );
}
