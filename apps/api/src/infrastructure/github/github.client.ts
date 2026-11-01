import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
    GithubFile,
    GithubPort,
    GithubPullRequest,
    OpenPullRequest,
    WriteFileOnBranch,
} from './github.port';

const API = 'https://api.github.com';
const TIMEOUT_MS = 10_000;
const DEFAULT_REPO = 'AdrianMoreland/goldilocks';

export class GithubError extends Error {
    constructor(
        message: string,
        readonly status: number | null,
    ) {
        super(message);
    }
}

/**
 * GitHub REST over `fetch`, no dependency. Every call has a timeout and none is retried. The token
 * (GITHUB_SYNC_TOKEN, a Railway variable) is sent as a bearer header and is never logged or returned.
 */
@Injectable()
export class GithubClient implements GithubPort {
    readonly repo: string;
    private readonly token: string | undefined;
    private expiresAt: Date | null = null;

    constructor(config: ConfigService) {
        this.token = config.get<string>('GITHUB_SYNC_TOKEN') || undefined;
        this.repo = config.get<string>('GITHUB_REPO') || DEFAULT_REPO;
    }

    isConfigured() {
        return !!this.token;
    }

    tokenExpiresAt() {
        return this.expiresAt;
    }

    private async request(
        path: string,
        accept: string,
        write?: { method: 'POST' | 'PATCH' | 'PUT'; body: unknown },
        /** Explain failures in words; on for writes and the reads inside a write. */
        friendly = !!write,
    ): Promise<Response> {
        let res: Response;
        try {
            res = await fetch(`${API}${path}`, {
                ...(write
                    ? { method: write.method, body: JSON.stringify(write.body) }
                    : {}),
                headers: {
                    ...(write ? { 'Content-Type': 'application/json' } : {}),
                    Accept: accept,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'User-Agent': 'goldilocks-roadmap-sync',
                    ...(this.token
                        ? { Authorization: `Bearer ${this.token}` }
                        : {}),
                },
                signal: AbortSignal.timeout(TIMEOUT_MS),
            });
        } catch (e) {
            const timedOut = e instanceof Error && e.name === 'TimeoutError';
            throw new GithubError(
                timedOut
                    ? 'GitHub did not answer in time'
                    : 'GitHub could not be reached',
                null,
            );
        }
        const expiry = res.headers.get(
            'github-authentication-token-expiration',
        );
        if (expiry) {
            const parsed = new Date(expiry);
            if (!Number.isNaN(parsed.getTime())) this.expiresAt = parsed;
        }
        if (!res.ok) {
            throw new GithubError(
                await this.failureMessage(res, friendly),
                res.status,
            );
        }
        return res;
    }

    private async failureMessage(res: Response, friendly: boolean) {
        if (res.status === 401 || res.status === 403) {
            return 'GitHub refused the token (expired or missing a permission)';
        }
        if (!friendly) return `GitHub answered ${res.status}`;
        let detail = '';
        try {
            const body = (await res.json()) as { message?: string };
            detail = body.message ? `: ${body.message}` : '';
        } catch {
            // an unreadable body just leaves the status
        }
        if (res.status === 404) {
            return `GitHub could not find the repository, branch or file${detail}`;
        }
        if (res.status === 422) {
            return `GitHub rejected the change${detail}`;
        }
        return `GitHub answered ${res.status}${detail}`;
    }

    private json(
        path: string,
        method: 'POST' | 'PATCH' | 'PUT',
        body: unknown,
    ) {
        return this.request(path, 'application/vnd.github+json', {
            method,
            body,
        });
    }

    async readFile(path: string, branch: string): Promise<GithubFile> {
        const ref = encodeURIComponent(branch);
        const [file, sha] = await Promise.all([
            this.request(
                `/repos/${this.repo}/contents/${path}?ref=${ref}`,
                'application/vnd.github.raw+json',
            ),
            this.request(
                `/repos/${this.repo}/commits/${ref}`,
                'application/vnd.github.sha',
            ),
        ]);
        return {
            content: await file.text(),
            commit: (await sha.text()).trim(),
        };
    }

    async listOpenPullRequests(): Promise<GithubPullRequest[]> {
        const res = await this.request(
            `/repos/${this.repo}/pulls?state=open&per_page=50`,
            'application/vnd.github+json',
        );
        const rows = (await res.json()) as {
            number: number;
            title: string;
            html_url: string;
            head: { ref: string };
        }[];
        return rows.map((r) => ({
            number: r.number,
            title: r.title,
            url: r.html_url,
            branch: r.head.ref,
        }));
    }

    async writeFileOnBranch(input: WriteFileOnBranch) {
        const { branch, baseCommit, path, content, message } = input;
        const ref = encodeURIComponent(branch);
        const repo = `/repos/${this.repo}`;

        let exists = true;
        try {
            await this.request(
                `${repo}/git/ref/heads/${ref}`,
                'application/vnd.github+json',
            );
        } catch (e) {
            if (!(e instanceof GithubError && e.status === 404)) throw e;
            exists = false;
        }
        if (exists) {
            await this.json(`${repo}/git/refs/heads/${ref}`, 'PATCH', {
                sha: baseCommit,
                force: true,
            });
        } else {
            await this.json(`${repo}/git/refs`, 'POST', {
                ref: `refs/heads/${branch}`,
                sha: baseCommit,
            });
        }

        // The branch now equals master, so the file's blob sha on it is the one the update must name.
        const current = await this.request(
            `${repo}/contents/${path}?ref=${ref}`,
            'application/vnd.github+json',
            undefined,
            true,
        );
        const { sha } = (await current.json()) as { sha: string };
        const res = await this.json(`${repo}/contents/${path}`, 'PUT', {
            message,
            content: Buffer.from(content, 'utf8').toString('base64'),
            sha,
            branch,
        });
        const saved = (await res.json()) as { commit: { sha: string } };
        return { commit: saved.commit.sha };
    }

    async openPullRequest(input: OpenPullRequest) {
        const res = await this.json(`/repos/${this.repo}/pulls`, 'POST', input);
        const pr = (await res.json()) as {
            number: number;
            title: string;
            html_url: string;
            head: { ref: string };
        };
        return {
            number: pr.number,
            title: pr.title,
            url: pr.html_url,
            branch: pr.head.ref,
        };
    }

    async updatePullRequest(number: number, body: string) {
        await this.json(`/repos/${this.repo}/pulls/${number}`, 'PATCH', {
            body,
        });
    }
}
