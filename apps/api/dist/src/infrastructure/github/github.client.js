"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubClient = exports.GithubError = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const API = 'https://api.github.com';
const TIMEOUT_MS = 10_000;
const DEFAULT_REPO = 'AdrianMoreland/goldilocks';
const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;
class GithubError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.GithubError = GithubError;
let GithubClient = class GithubClient {
    repo;
    token;
    expiresAt = null;
    constructor(config) {
        this.token = config.get('GITHUB_SYNC_TOKEN') || undefined;
        this.repo = config.get('GITHUB_REPO') || DEFAULT_REPO;
    }
    isConfigured() {
        return !!this.token;
    }
    tokenExpiresAt() {
        return this.expiresAt;
    }
    async request(path, accept, write, friendly = !!write) {
        let res;
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
        }
        catch (e) {
            const timedOut = e instanceof Error && e.name === 'TimeoutError';
            throw new GithubError(timedOut
                ? 'GitHub did not answer in time'
                : 'GitHub could not be reached', null);
        }
        const expiry = res.headers.get('github-authentication-token-expiration');
        if (expiry) {
            const parsed = new Date(expiry);
            if (!Number.isNaN(parsed.getTime()))
                this.expiresAt = parsed;
        }
        if (!res.ok) {
            throw new GithubError(await this.failureMessage(res, friendly), res.status);
        }
        return res;
    }
    async failureMessage(res, friendly) {
        if (res.status === 401 || res.status === 403) {
            return 'GitHub refused the token (expired or missing a permission)';
        }
        if (!friendly)
            return `GitHub answered ${res.status}`;
        let detail = '';
        try {
            const body = (await res.json());
            detail = body.message ? `: ${body.message}` : '';
        }
        catch {
        }
        if (res.status === 404) {
            return `GitHub could not find the repository, branch or file${detail}`;
        }
        if (res.status === 422) {
            return `GitHub rejected the change${detail}`;
        }
        return `GitHub answered ${res.status}${detail}`;
    }
    json(path, method, body) {
        return this.request(path, 'application/vnd.github+json', {
            method,
            body,
        });
    }
    async readFile(path, branch, repo) {
        const ref = encodeURIComponent(branch);
        const target = repo ?? this.repo;
        if (!REPO_PATTERN.test(target)) {
            throw new GithubError('The repository must look like owner/name', null);
        }
        const [file, sha] = await Promise.all([
            this.request(`/repos/${target}/contents/${path}?ref=${ref}`, 'application/vnd.github.raw+json'),
            this.request(`/repos/${target}/commits/${ref}`, 'application/vnd.github.sha'),
        ]);
        return {
            content: await file.text(),
            commit: (await sha.text()).trim(),
        };
    }
    async listOpenPullRequests() {
        const res = await this.request(`/repos/${this.repo}/pulls?state=open&per_page=50`, 'application/vnd.github+json');
        const rows = (await res.json());
        return rows.map((r) => ({
            number: r.number,
            title: r.title,
            url: r.html_url,
            branch: r.head.ref,
        }));
    }
    async writeFileOnBranch(input) {
        const { branch, baseCommit, path, content, message } = input;
        const ref = encodeURIComponent(branch);
        const repo = `/repos/${this.repo}`;
        let exists = true;
        try {
            await this.request(`${repo}/git/ref/heads/${ref}`, 'application/vnd.github+json');
        }
        catch (e) {
            if (!(e instanceof GithubError && e.status === 404))
                throw e;
            exists = false;
        }
        if (exists) {
            await this.json(`${repo}/git/refs/heads/${ref}`, 'PATCH', {
                sha: baseCommit,
                force: true,
            });
        }
        else {
            await this.json(`${repo}/git/refs`, 'POST', {
                ref: `refs/heads/${branch}`,
                sha: baseCommit,
            });
        }
        const current = await this.request(`${repo}/contents/${path}?ref=${ref}`, 'application/vnd.github+json', undefined, true);
        const { sha } = (await current.json());
        const res = await this.json(`${repo}/contents/${path}`, 'PUT', {
            message,
            content: Buffer.from(content, 'utf8').toString('base64'),
            sha,
            branch,
        });
        const saved = (await res.json());
        return { commit: saved.commit.sha };
    }
    async openPullRequest(input) {
        const res = await this.json(`/repos/${this.repo}/pulls`, 'POST', input);
        const pr = (await res.json());
        return {
            number: pr.number,
            title: pr.title,
            url: pr.html_url,
            branch: pr.head.ref,
        };
    }
    async updatePullRequest(number, body) {
        await this.json(`/repos/${this.repo}/pulls/${number}`, 'PATCH', {
            body,
        });
    }
    async listOpenIssues(label) {
        const res = await this.request(`/repos/${this.repo}/issues?state=open&labels=${encodeURIComponent(label)}&per_page=100&sort=created&direction=desc`, 'application/vnd.github+json');
        const rows = (await res.json());
        return rows
            .filter((r) => !r.pull_request)
            .map((r) => ({
            number: r.number,
            title: r.title,
            body: r.body ?? '',
            url: r.html_url,
            createdAt: r.created_at,
            labels: r.labels.map((l) => typeof l === 'string' ? l : (l.name ?? '')),
        }));
    }
    async closeIssue(number, comment, reason) {
        const repo = `/repos/${this.repo}/issues/${number}`;
        await this.json(`${repo}/comments`, 'POST', { body: comment });
        await this.json(repo, 'PATCH', {
            state: 'closed',
            state_reason: reason,
        });
    }
};
exports.GithubClient = GithubClient;
exports.GithubClient = GithubClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GithubClient);
//# sourceMappingURL=github.client.js.map