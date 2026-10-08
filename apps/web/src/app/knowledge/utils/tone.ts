import type { KbFlowTone } from '@goldilocks/shared-types';

/**
 * Price is teal and Buyback is raspberry everywhere in this product (the
 * Direction Is Colour rule), so a flow carries its colour from the home page
 * to the last procedure in it. Classes are spelled out in full so Tailwind
 * can see them.
 */
export const TONE: Record<
    KbFlowTone,
    {
        /** A solid fill with dark ink on it (numbers, headers). */
        fill: string;
        /** Coloured text that stays readable in both themes. */
        text: string;
        /** A pale surface. */
        tint: string;
        /** A stronger tint, for chips. */
        chip: string;
        border: string;
        borderLeft: string;
        line: string;
        arrow: string;
        hoverBorder: string;
        ring: string;
    }
> = {
    price: {
        fill: 'bg-price text-zinc-900',
        text: 'text-price-text',
        tint: 'bg-price/10',
        chip: 'bg-price/15 text-price-text',
        border: 'border-price',
        borderLeft: 'border-l-price',
        line: 'bg-price/35',
        arrow: 'text-price/70',
        hoverBorder: 'hover:border-price',
        ring: 'border-price/50',
    },
    buyback: {
        fill: 'bg-buyback text-zinc-900',
        text: 'text-buyback-text',
        tint: 'bg-buyback/10',
        chip: 'bg-buyback/15 text-buyback-text',
        border: 'border-buyback',
        borderLeft: 'border-l-buyback',
        line: 'bg-buyback/35',
        arrow: 'text-buyback/70',
        hoverBorder: 'hover:border-buyback',
        ring: 'border-buyback/50',
    },
};

export const FOCUS = 'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none';
