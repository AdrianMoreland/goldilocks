import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { GithubFile, GithubPort, GithubPullRequest } from './github.port';

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

    private async request(path: string, accept: string): Promise<Response> {
        let res: Response;
        try {
            res = await fetch(`${API}${path}`, {
                headers: {
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
                res.status === 401 || res.status === 403
                    ? 'GitHub refused the token (expired or missing a permission)'
                    : `GitHub answered ${res.status}`,
                res.status,
            );
        }
        return res;
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
}
