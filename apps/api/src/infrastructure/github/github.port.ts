/**
 * The roadmap sync's only view of GitHub (docs/ROADMAP-TOOL-PLAN.md section 6.1). Swappable and fakeable
 * in tests, like MetalPriceApiPort. Reads, plus the few writes slice 3 needs (a bot branch, one file commit, a pull request); nothing merges.
 */
export interface GithubFile {
    /** The file's text. */
    content: string;
    /** Commit the branch tip was at when the file was read. */
    commit: string;
}

export interface GithubPullRequest {
    number: number;
    title: string;
    url: string;
    /** Head branch name, e.g. `roadmap-sync/2026-11-02`. */
    branch: string;
}

export interface WriteFileOnBranch {
    /** Bot branch; created at `baseCommit`, or moved there if it exists. */
    branch: string;
    /** Master's commit the new file is built on. */
    baseCommit: string;
    path: string;
    content: string;
    message: string;
}

export interface OpenPullRequest {
    title: string;
    body: string;
    /** Head branch name. */
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
    /** Whether a token is configured (reads of a public repository work without one). */
    isConfigured(): boolean;
    readonly repo: string;
    /** When the token expires, as GitHub last reported it; null until a call has been made or if none. */
    tokenExpiresAt(): Date | null;
    readFile(path: string, branch: string): Promise<GithubFile>;
    listOpenPullRequests(): Promise<GithubPullRequest[]>;
    /** Puts `branch` at `baseCommit` (forced if it exists), commits `content` to `path` on it; returns the new commit. */
    writeFileOnBranch(input: WriteFileOnBranch): Promise<{ commit: string }>;
    openPullRequest(input: OpenPullRequest): Promise<GithubPullRequest>;
    updatePullRequest(number: number, body: string): Promise<void>;
    /** Open issues carrying `label` (pull requests excluded), newest first, up to 100. */
    listOpenIssues(label: string): Promise<GithubIssue[]>;
    /** Comments on an issue and closes it. `completed` for a promoted idea, `not_planned` for a dismissed one. */
    closeIssue(
        number: number,
        comment: string,
        reason: 'completed' | 'not_planned',
    ): Promise<void>;
}

export const GITHUB = Symbol('GITHUB');
