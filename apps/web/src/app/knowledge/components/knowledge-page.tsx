import { cn } from '@/lib/utils';

/**
 * The page frame for every Knowledge Center screen, so they all breathe the
 * same: generous side padding that grows with the window, room at the bottom,
 * and a readable maximum width on very wide monitors.
 */
export function KnowledgePage({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('mx-auto flex w-full max-w-7xl flex-col px-5 pt-2 pb-16 sm:px-8 lg:px-12', className)}>{children}</div>;
}
