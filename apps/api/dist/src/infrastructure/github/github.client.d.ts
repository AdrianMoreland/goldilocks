import { ConfigService } from '@nestjs/config';
import type { GithubFile, GithubIssue, GithubPort, GithubPullRequest, OpenPullRequest, WriteFileOnBranch } from './github.port';
export declare class GithubError extends Error {
    readonly status: number | null;
    constructor(message: string, status: number | null);
}
export declare class GithubClient implements GithubPort {
    readonly repo: string;
    private readonly token;
    private expiresAt;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    tokenExpiresAt(): Date | null;
    private request;
    private failureMessage;
    private json;
    readFile(path: string, branch: string, repo?: string): Promise<GithubFile>;
    listOpenPullRequests(): Promise<GithubPullRequest[]>;
    writeFileOnBranch(input: WriteFileOnBranch): Promise<{
        commit: string;
    }>;
    openPullRequest(input: OpenPullRequest): Promise<{
        number: number;
        title: string;
        url: string;
        branch: string;
    }>;
    updatePullRequest(number: number, body: string): Promise<void>;
    listOpenIssues(label: string): Promise<GithubIssue[]>;
    closeIssue(number: number, comment: string, reason: 'completed' | 'not_planned'): Promise<void>;
}
//# sourceMappingURL=github.client.d.ts.map