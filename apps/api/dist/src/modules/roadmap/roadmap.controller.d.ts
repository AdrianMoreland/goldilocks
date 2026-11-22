import { type RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RoadmapEditRequestDto, RoadmapInboxPromoteDto, RoadmapPullRequestDto, RoadmapPushRequestDto, RoadmapQueueRequestDto } from '../../common/dto/dtos';
import { RoadmapService } from './roadmap.service';
import { RoadmapInboxService } from './roadmap-inbox.service';
import { RoadmapPullService } from './roadmap-pull.service';
import { RoadmapPushService } from './roadmap-push.service';
import { RoadmapQueueService } from './roadmap-queue.service';
import { type RoadmapWriter } from './roadmap-writer';
import { RoadmapScopeService } from './roadmap-scope.service';
import { RoadmapSyncService } from './roadmap-sync.service';
export declare class RoadmapController {
    private readonly service;
    private readonly sync;
    private readonly pulls;
    private readonly pushes;
    private readonly inbox;
    private readonly scope;
    private readonly queue;
    private readonly writer;
    constructor(service: RoadmapService, sync: RoadmapSyncService, pulls: RoadmapPullService, pushes: RoadmapPushService, inbox: RoadmapInboxService, scope: RoadmapScopeService, queue: RoadmapQueueService, writer: RoadmapWriter);
    queueList(): Promise<{
        entries: {
            id: number;
            text: string;
            source: "phone" | "web";
            status: "new" | "filed";
            line: string;
            createdAt: string;
            filedAt: string | null;
        }[];
    }>;
    queueAppend(body: RoadmapQueueRequestDto): Promise<{
        id: number;
        line: string;
    }>;
    scopeGet(): Promise<{
        enabled: boolean;
        configured: boolean;
        empty: boolean;
        repo: string | null;
        branch: string | null;
        commit: string | null;
        version: number;
        syncedAt: string | null;
        syncedBy: string | null;
        view: {
            items: {
                id: string;
                scope: "fixes" | "features" | "ops";
                title: string;
                priority: "P0" | "P1" | "P2" | "P3";
                effort: "S" | "M" | "L" | "XL";
                status: "done" | "idea" | "next" | "planned" | "doing" | "dropped";
                after: string[];
                flags: string[];
                verified: string | null;
                was: string | null;
                evidence: string[];
                spec: string | null;
                deadline: string | null;
                body: string;
                tasks: {
                    checked: boolean;
                    text: string;
                    depth: number;
                }[];
            }[];
            done: {
                id: string;
                scope: "fixes" | "features" | "ops";
                text: string;
            }[];
            decisions: {
                id: string;
                title: string;
                settled: boolean;
                default: string | null;
                blocks: string | null;
                text: string;
            }[];
            now: string | null;
        };
    }>;
    scopeRefresh(req: RequestWithUser): Promise<{
        changed: boolean;
        commit: string;
        version: number;
        items: number;
        decisions: number;
    }>;
    get(): Promise<{
        markdown: string;
        version: number;
        updatedBy: string | null;
        updatedAt: string | null;
    }>;
    syncStatus(): Promise<{
        state: "unconfigured" | "in-sync" | "differs" | "unavailable";
        repo: string;
        branch: string;
        masterCommit: string | null;
        appVersion: number;
        appUpdatedAt: string | null;
        appOnlyLines: number;
        masterOnlyLines: number;
        preview: string[];
        openSyncPr: {
            number: number;
            title: string;
            url: string;
        } | null;
        tokenExpiresAt: string | null;
        error: string | null;
        appEditsToPush: number | null;
    }>;
    pull(body: RoadmapPullRequestDto, req: RequestWithUser): Promise<{
        mode: "adopt" | "merge" | "nothing";
        applied: boolean;
        commit: string;
        appChanged: boolean;
        log: {
            kind: "to-file" | "to-app" | "conflict-app-wins" | "kept-file-edit" | "missing-from-file" | "both-added";
            baseLine: number;
            text: string;
        }[];
        appOnlyTasks: {
            section: string;
            title: string;
            checked: boolean;
        }[];
        appOnlyTaskCount: number;
        ticksOnlyInApp: {
            section: string;
            title: string;
            checked: boolean;
        }[];
        ticksOnlyInAppCount: number;
        appOnlyLines: number;
        masterOnlyLines: number;
        snapshotId: number | null;
        appVersion: number;
    }>;
    push(body: RoadmapPushRequestDto, req: RequestWithUser): Promise<{
        mode: "push" | "nothing";
        applied: boolean;
        commit: string;
        edits: {
            kind: "to-file" | "to-app" | "conflict-app-wins" | "kept-file-edit" | "missing-from-file" | "both-added";
            baseLine: number;
            text: string;
        }[];
        diffPreview: string[];
        prNumber: number | null;
        prUrl: string | null;
    }>;
    edit(body: RoadmapEditRequestDto, req: RequestWithUser): Promise<{
        markdown: string;
        version: number;
        updatedBy: string | null;
        updatedAt: string | null;
    }>;
    inboxList(): Promise<{
        items: {
            id: number;
            issueNumber: number;
            title: string;
            body: string;
            kind: string | null;
            url: string;
            status: "new" | "promoted" | "dismissed";
            issueCreatedAt: string;
            handledAt: string | null;
            handledBy: string | null;
        }[];
        configured: boolean;
    }>;
    inboxRefresh(): Promise<{
        added: number;
        closedOnGithub: number;
    }>;
    inboxPromote(id: number, body: RoadmapInboxPromoteDto, req: RequestWithUser): Promise<{
        id: number;
        issueNumber: number;
        title: string;
        body: string;
        kind: string | null;
        url: string;
        status: "new" | "promoted" | "dismissed";
        issueCreatedAt: string;
        handledAt: string | null;
        handledBy: string | null;
    }>;
    inboxDismiss(id: number, req: RequestWithUser): Promise<{
        id: number;
        issueNumber: number;
        title: string;
        body: string;
        kind: string | null;
        url: string;
        status: "new" | "promoted" | "dismissed";
        issueCreatedAt: string;
        handledAt: string | null;
        handledBy: string | null;
    }>;
}
//# sourceMappingURL=roadmap.controller.d.ts.map