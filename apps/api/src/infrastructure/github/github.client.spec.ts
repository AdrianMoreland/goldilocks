import type { ConfigService } from '@nestjs/config';
import { GithubClient, GithubError } from './github.client';

type Call = { url: string; method: string; body: unknown };

const reply = (status: number, body: unknown = {}) =>
    new Response(JSON.stringify(body), { status });

/** Answers each fetch from `routes` by "METHOD path-suffix"; records every call. */
function mockFetch(routes: Record<string, Response>) {
    const calls: Call[] = [];
    global.fetch = jest.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? 'GET';
        const path = url.replace('https://api.github.com', '');
        calls.push({
            url: path,
            method,
            body: init?.body ? JSON.parse(init.body as string) : undefined,
        });
        const hit = Object.keys(routes).find((k) => `${method} ${path}` === k);
        return Promise.resolve(hit ? routes[hit].clone() : reply(500));
    }) as unknown as typeof fetch;
    return calls;
}

const client = () =>
    new GithubClient({
        get: (k: string) =>
            k === 'GITHUB_SYNC_TOKEN'
                ? 'tok'
                : k === 'GITHUB_REPO'
                  ? 'o/r'
                  : undefined,
    } as unknown as ConfigService);

const write = {
    branch: 'roadmap-sync/app',
    baseCommit: 'abc123',
    path: 'docs/ROADMAP.md',
    content: 'héllo\n',
    message: 'roadmap-sync: app edits',
};
const REF = 'GET /repos/o/r/git/ref/heads/roadmap-sync%2Fapp';
const FILE = 'GET /repos/o/r/contents/docs/ROADMAP.md?ref=roadmap-sync%2Fapp';
const PUT = 'PUT /repos/o/r/contents/docs/ROADMAP.md';

describe('GithubClient writes', () => {
    const realFetch = global.fetch;
    afterEach(() => {
        global.fetch = realFetch;
    });

    it('creates the branch at the base commit when it is missing, then commits the file', async () => {
        const calls = mockFetch({
            [REF]: reply(404),
            'POST /repos/o/r/git/refs': reply(201),
            [FILE]: reply(200, { sha: 'blob1' }),
            [PUT]: reply(200, { commit: { sha: 'newcommit' } }),
        });

        const out = await client().writeFileOnBranch(write);

        expect(out).toEqual({ commit: 'newcommit' });
        expect(calls[1]).toMatchObject({
            method: 'POST',
            body: { ref: 'refs/heads/roadmap-sync/app', sha: 'abc123' },
        });
        expect(calls[3].body).toEqual({
            message: 'roadmap-sync: app edits',
            content: Buffer.from('héllo\n', 'utf8').toString('base64'),
            sha: 'blob1',
            branch: 'roadmap-sync/app',
        });
    });

    it('moves an existing branch to the base commit with a forced update', async () => {
        const calls = mockFetch({
            [REF]: reply(200, {}),
            'PATCH /repos/o/r/git/refs/heads/roadmap-sync%2Fapp': reply(200),
            [FILE]: reply(200, { sha: 'blob1' }),
            [PUT]: reply(200, { commit: { sha: 'c2' } }),
        });

        await client().writeFileOnBranch(write);

        expect(calls[1]).toMatchObject({
            method: 'PATCH',
            body: { sha: 'abc123', force: true },
        });
        expect(calls.some((c) => c.method === 'POST')).toBe(false);
    });

    it('turns a 422 into a readable error that carries GitHub’s message', async () => {
        mockFetch({
            [REF]: reply(404),
            'POST /repos/o/r/git/refs': reply(422, {
                message: 'Reference update failed',
            }),
        });

        const err = await client()
            .writeFileOnBranch(write)
            .catch((e: unknown) => e);

        expect(err).toBeInstanceOf(GithubError);
        expect((err as GithubError).status).toBe(422);
        expect((err as GithubError).message).toBe(
            'GitHub rejected the change: Reference update failed',
        );
    });

    it('turns a 404 on the commit into a readable error', async () => {
        mockFetch({
            [REF]: reply(200, {}),
            'PATCH /repos/o/r/git/refs/heads/roadmap-sync%2Fapp': reply(200),
            [FILE]: reply(404, { message: 'Not Found' }),
        });

        await expect(client().writeFileOnBranch(write)).rejects.toThrow(
            'GitHub could not find the repository, branch or file: Not Found',
        );
    });

    it('opens a pull request and maps the answer', async () => {
        const calls = mockFetch({
            'POST /repos/o/r/pulls': reply(201, {
                number: 7,
                title: 'T',
                html_url: 'https://github.com/o/r/pull/7',
                head: { ref: 'roadmap-sync/app' },
            }),
        });

        const pr = await client().openPullRequest({
            title: 'T',
            body: 'B',
            head: 'roadmap-sync/app',
            base: 'master',
        });

        expect(pr).toEqual({
            number: 7,
            title: 'T',
            url: 'https://github.com/o/r/pull/7',
            branch: 'roadmap-sync/app',
        });
        expect(calls[0].body).toEqual({
            title: 'T',
            body: 'B',
            head: 'roadmap-sync/app',
            base: 'master',
        });
    });

    it('updates a pull request body', async () => {
        const calls = mockFetch({ 'PATCH /repos/o/r/pulls/7': reply(200) });

        await client().updatePullRequest(7, 'new body');

        expect(calls[0].body).toEqual({ body: 'new body' });
    });

    it('does not retry a failed write', async () => {
        mockFetch({ 'POST /repos/o/r/pulls': reply(500) });
        await expect(
            client().openPullRequest({
                title: 'T',
                body: 'B',
                head: 'h',
                base: 'master',
            }),
        ).rejects.toThrow('GitHub answered 500');
        expect((global.fetch as jest.Mock).mock.calls).toHaveLength(1);
    });

    it('lists open issues with a label, leaving out pull requests', async () => {
        const calls = mockFetch({
            'GET /repos/o/r/issues?state=open&labels=roadmap&per_page=100&sort=created&direction=desc':
                reply(200, [
                    {
                        number: 3,
                        title: 'An idea',
                        body: null,
                        html_url: 'https://github.com/o/r/issues/3',
                        created_at: '2026-11-05T10:00:00Z',
                        labels: [{ name: 'roadmap' }, 'idea'],
                    },
                    { number: 4, title: 'A PR', pull_request: {}, labels: [] },
                ]),
        });
        const issues = await client().listOpenIssues('roadmap');
        expect(issues).toEqual([
            {
                number: 3,
                title: 'An idea',
                body: '',
                url: 'https://github.com/o/r/issues/3',
                createdAt: '2026-11-05T10:00:00Z',
                labels: ['roadmap', 'idea'],
            },
        ]);
        expect(calls).toHaveLength(1);
    });

    it('closes an issue with a comment and a reason', async () => {
        const calls = mockFetch({
            'POST /repos/o/r/issues/3/comments': reply(201),
            'PATCH /repos/o/r/issues/3': reply(200),
        });
        await client().closeIssue(3, 'Added.', 'completed');
        expect(calls.map((c) => c.method)).toEqual(['POST', 'PATCH']);
        expect(calls[1].body).toEqual({
            state: 'closed',
            state_reason: 'completed',
        });
    });
});
