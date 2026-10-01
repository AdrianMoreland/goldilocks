import { Archive, CircleDashed, TriangleAlert } from 'lucide-react';
import type { KbStatus } from '@goldilocks/shared-types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Approval state. Drafts are neutral (they are normal, not an alarm); the loud
 * signal is reserved for facts that still need confirming — see
 * UnconfirmedBadge. Approved gets the same emerald dot the price-freshness
 * indicator uses for "fresh".
 */
export function StatusBadge({ status, className }: { status: KbStatus; className?: string }) {
    if (status === 'approved') {
        return (
            <Badge variant="outline" className={cn('gap-1.5', className)}>
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                Approved
            </Badge>
        );
    }

    if (status === 'retired') {
        return (
            <Badge variant="outline" className={cn('text-muted-foreground', className)}>
                <Archive aria-hidden />
                Retired
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className={cn('text-muted-foreground', className)}>
            <CircleDashed aria-hidden />
            Draft
        </Badge>
    );
}

/** "Stale Is Loud" applied to content: an unconfirmed fact must never look the same as a confirmed one. */
export function UnconfirmedBadge({ count, className }: { count: number; className?: string }) {
    if (count === 0) return null;

    return (
        <Badge
            variant="outline"
            className={cn(
                'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-400',
                className,
            )}
            title={`${count} ${count === 1 ? 'section has' : 'sections have'} facts still to be confirmed`}
        >
            <TriangleAlert aria-hidden />
            {count} to confirm
        </Badge>
    );
}
