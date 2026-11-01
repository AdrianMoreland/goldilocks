/**
 * The roadmap sync's only view of GitHub (docs/ROADMAP-TOOL-PLAN.md section 6.1). Swappable and fakeable
 * in tests, like MetalPriceApiPort. Slice 1 only reads; later slices add the write calls.
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

export interface GithubPort {
    /** Whether a token is configured (reads of a public repository work without one). */
    isConfigured(): boolean;
    readonly repo: string;
    /** When the token expires, as GitHub last reported it; null until a call has been made or if none. */
    tokenExpiresAt(): Date | null;
    readFile(path: string, branch: string): Promise<GithubFile>;
    listOpenPullRequests(): Promise<GithubPullRequest[]>;
}

export const GITHUB = Symbol('GITHUB');
