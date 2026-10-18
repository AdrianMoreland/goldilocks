import { BaseLayout } from '@/components/layouts/base-layout';
import { useAuth } from '@/contexts/auth-context';
import { AssistantDock, AssistantToggle } from './assistant-panel';

/** The frame every Knowledge Center page shares: the app layout plus the "Ask" button that opens the assistant (branches without it get neither). */
export function KnowledgeLayout({ children }: { children: React.ReactNode }) {
    const { capabilities } = useAuth();

    return (
        <div className="flex">
            <div className="min-w-0 flex-1">
                <BaseLayout title="Knowledge Center" headerActions={() => (capabilities.assistant ? <AssistantToggle /> : null)}>
                    {children}
                </BaseLayout>
            </div>
            {capabilities.assistant && <AssistantDock />}
        </div>
    );
}
