import {
    Banknote,
    Blocks,
    Boxes,
    BookUser,
    Calculator,
    FileText,
    HandCoins,
    IdCard,
    LayoutDashboard,
    Lock,
    MessagesSquare,
    PackageCheck,
    Phone,
    Receipt,
    SearchCheck,
    ShieldCheck,
    UserSearch,
    Vault,
    type LucideIcon,
} from 'lucide-react';
import { kbArticlePath, type KbGuideIcon, type KbGuideTarget } from '@goldilocks/shared-types';
import type { KnowledgeLibrary } from './library';

export const GUIDE_ICONS: Record<KbGuideIcon, LucideIcon> = {
    'file-text': FileText,
    calculator: Calculator,
    banknote: Banknote,
    lock: Lock,
    'package-check': PackageCheck,
    'id-card': IdCard,
    'search-check': SearchCheck,
    'hand-coins': HandCoins,
    boxes: Boxes,
    vault: Vault,
    'book-user': BookUser,
    'shield-check': ShieldCheck,
    messages: MessagesSquare,
    phone: Phone,
    blocks: Blocks,
    'layout-dashboard': LayoutDashboard,
    'user-search': UserSearch,
    receipt: Receipt,
};

/**
 * Where a guide target leads, or null when it can't be reached (the SOP — or
 * the section — isn't in the library, e.g. it's retired or not written yet).
 * The page then leaves that step out instead of rendering a link that 404s.
 */
export function resolveTarget(library: KnowledgeLibrary, target: KbGuideTarget): string | null {
    if ('href' in target) return target.href;

    const article = library.bySlug.get(target.slug);
    if (!article) return null;
    if (target.anchor && !article.sections.some((section) => section.anchor === target.anchor)) return null;
    return kbArticlePath(target.slug, target.anchor);
}

/** Section headings that are framing rather than something you'd jump to. */
const FRAMING_ANCHORS = new Set(['purpose', 'summary', 'note', 'related']);

export function jumpSections(article: { sections: { anchor: string; heading: string }[] }) {
    return article.sections.filter((section) => section.heading && section.anchor && !FRAMING_ANCHORS.has(section.anchor));
}
