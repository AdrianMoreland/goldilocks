import { useState } from 'react';
import { Archive, BadgeCheck, PencilLine, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKnowledgeAdmin } from '@/hooks/use-knowledge-admin.hook';
import type { KnowledgeArticle } from '../utils/library';

/**
 * The approval workflow, for admins: edit the text, then approve (which dates
 * the procedure and bumps its version). The server is the authority — these
 * buttons only mirror its rules so an admin isn't offered something that will
 * be refused.
 */
export function ArticleAdminBar({
    article,
    editing,
    onEdit,
}: {
    article: KnowledgeArticle;
    editing: boolean;
    onEdit: () => void;
}) {
    const { doc, todoSectionCount } = article;
    const { changeStatus } = useKnowledgeAdmin(doc.slug);
    const [confirmRetire, setConfirmRetire] = useState(false);
    const busy = changeStatus.isPending;

    const hasNoOwner = /^todo$/i.test(doc.owner.trim());
    const approveBlocked =
        todoSectionCount > 0
            ? `${todoSectionCount} ${todoSectionCount === 1 ? 'section still has' : 'sections still have'} a [TODO] to resolve first`
            : hasNoOwner
              ? 'Assign an owner first'
              : null;

    return (
        <div role="toolbar" aria-label="Admin actions" className="flex flex-wrap items-center gap-2 rounded-lg border bg-card px-3 py-2">
            <span className="mr-1 text-sm font-semibold">Admin</span>

            {!editing && (
                <Button variant="outline" size="sm" onClick={onEdit} disabled={busy}>
                    <PencilLine aria-hidden /> Edit
                </Button>
            )}

            {doc.status === 'draft' && (
                <Button
                    size="sm"
                    onClick={() => changeStatus.mutate('approved')}
                    disabled={busy || approveBlocked !== null || editing}
                    title={approveBlocked ?? (editing ? 'Save or cancel your edit first' : 'Approve — dates it today and bumps the version')}
                >
                    <BadgeCheck aria-hidden /> Approve
                </Button>
            )}

            {(doc.status === 'approved' || doc.status === 'retired') && (
                <Button variant="outline" size="sm" onClick={() => changeStatus.mutate('draft')} disabled={busy}>
                    <Undo2 aria-hidden /> Return to draft
                </Button>
            )}

            {doc.status !== 'retired' &&
                (confirmRetire ? (
                    <span className="flex items-center gap-2 text-sm">
                        Hide it from staff?
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                changeStatus.mutate('retired');
                                setConfirmRetire(false);
                            }}
                            disabled={busy}
                        >
                            Yes, retire
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmRetire(false)}>
                            Cancel
                        </Button>
                    </span>
                ) : (
                    <Button variant="ghost" size="sm" onClick={() => setConfirmRetire(true)} disabled={busy}>
                        <Archive aria-hidden /> Retire
                    </Button>
                ))}

            {doc.status === 'draft' && approveBlocked && (
                <span className="text-sm text-muted-foreground">Can’t approve yet: {approveBlocked}.</span>
            )}
        </div>
    );
}
