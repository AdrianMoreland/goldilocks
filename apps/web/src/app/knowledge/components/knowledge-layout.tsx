import { BaseLayout } from '@/components/layouts/base-layout';
import { AssistantDock, AssistantToggle } from './assistant-panel';

/** The frame every Knowledge Center page shares: the app layout plus the "Ask" button that opens the assistant. */
export function KnowledgeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <div className="min-w-0 flex-1">
                <BaseLayout title="Knowledge Center" headerActions={() => <AssistantToggle />}>
                    {children}
                </BaseLayout>
            </div>
            <AssistantDock />
        </div>
    );
}
