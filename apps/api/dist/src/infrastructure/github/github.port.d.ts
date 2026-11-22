export interface GithubFile {
    content: string;
    commit: string;
}
export interface GithubPullRequest {
    number: number;
    title: string;
    url: string;
    branch: string;
}
export interface WriteFileOnBranch {
    branch: string;
    baseCommit: string;
    path: string;
    content: string;
    message: string;
}
export interface OpenPullRequest {
    title: string;
    body: string;
    head: string;
    base: string;
}
export interface GithubIssue {
    number: number;
    title: string;
    body: string;
    url: string;
    labels: string[];
    createdAt: string;
}
export interface GithubPort {
    isConfigured(): boolean;
    readonly repo: string;
    tokenExpiresAt(): Date | null;
    readFile(path: string, branch: string, repo?: string): Promise<GithubFile>;
    listOpenPullRequests(): Promise<GithubPullRequest[]>;
    writeFileOnBranch(input: WriteFileOnBranch): Promise<{
        commit: string;
    }>;
    openPullRequest(input: OpenPullRequest): Promise<GithubPullRequest>;
    updatePullRequest(number: number, body: string): Promise<void>;
    listOpenIssues(label: string): Promise<GithubIssue[]>;
    closeIssue(number: number, comment: string, reason: 'completed' | 'not_planned'): Promise<void>;
}
export declare const GITHUB: unique symbol;
//# sourceMappingURL=github.port.d.ts.map