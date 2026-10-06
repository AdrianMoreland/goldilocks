import { INestApplication, RequestMethod, Type } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { AppController } from '../../app.controller';
import { AdminController } from '../../modules/admin/admin.controller';
import { AdminOverviewService } from '../../modules/admin/admin-overview.service';
import { ApiCatalogueService } from '../../modules/admin/api-catalogue.service';
import { AuditLogService } from '../../modules/audit-log/audit-log.service';
import { AppLogsService } from '../../modules/admin/app-logs.service';
import { DbBrowserService } from '../../modules/admin/db-browser.service';
import { RequestMetricsService } from '../../modules/request-metrics/request-metrics.service';
import { AppService } from '../../app.service';
import { AuthController } from '../../modules/auth/auth.controller';
import { AuthService } from '../../modules/auth/auth.service';
import { BranchesController } from '../../modules/branches/branches.controller';
import { BranchesService } from '../../modules/branches/branches.service';
import { ErrorLogController } from '../../modules/error-log/error-log.controller';
import { ErrorLogService } from '../../modules/error-log/error-log.service';
import { AiController } from '../../modules/ai/ai.controller';
import { AskService } from '../../modules/ai/ask.service';
import { AskStreamResponder } from '../../modules/ai/ask-stream.responder';
import { KnowledgeController } from '../../modules/knowledge/knowledge.controller';
import { KnowledgeService } from '../../modules/knowledge/knowledge.service';
import { MarketModeController } from '../../modules/market-mode/market-mode.controller';
import { MarketModeService } from '../../modules/market-mode/market-mode.service';
import { RoadmapController } from '../../modules/roadmap/roadmap.controller';
import { RoadmapService } from '../../modules/roadmap/roadmap.service';
import { MarketDataController } from '../../modules/market-data/market-data.controller';
import { MarketDataService } from '../../modules/market-data/market-data.service';
import { FetchAttemptService } from '../../modules/metals/fetch-attempt.service';
import { MetalsController } from '../../modules/metals/metals.controller';
import { MetalsCron } from '../../modules/metals/metals.cron';
import { MetalsProvider } from '../../modules/metals/metals.provider';
import { PortfolioController } from '../../modules/portfolio/portfolio.controller';
import { PortfolioService } from '../../modules/portfolio/portfolio.service';
import { ProductsController } from '../../modules/products/products.controller';
import { ProductsService } from '../../modules/products/products.service';
import { TradeController } from '../../modules/trade/trade.controller';
import { TradeService } from '../../modules/trade/trade.service';

const CONTROLLERS: Type<unknown>[] = [
    AppController,
    AdminController,
    AuthController,
    BranchesController,
    ErrorLogController,
    KnowledgeController,
    AiController,
    MarketDataController,
    MarketModeController,
    MetalsController,
    PortfolioController,
    ProductsController,
    RoadmapController,
    TradeController,
];

/** Routes that are intentionally reachable without a token. Adding to this list is a security decision. */
const PUBLIC_ROUTES = new Set([
    'GET /',
    'GET /health',
    'POST /auth/login',
    // Called after the access token has expired; the refresh token in the body is the credential.
    'POST /auth/refresh',
]);

const METHOD_NAMES: Record<number, string> = {
    [RequestMethod.GET]: 'GET',
    [RequestMethod.POST]: 'POST',
    [RequestMethod.PUT]: 'PUT',
    [RequestMethod.DELETE]: 'DELETE',
    [RequestMethod.PATCH]: 'PATCH',
};

interface RouteInfo {
    method: string;
    /** Path with route params filled in, e.g. /products/1 */
    url: string;
    /** Same path as declared, used as the allow-list key, e.g. GET /products/:id */
    key: string;
    /** @Roles on the handler, else on the controller; undefined when neither declares any. */
    roles: string[] | undefined;
}

function joinPath(...parts: string[]): string {
    return (
        '/' +
        parts
            .map((p) => p.replace(/^\/+|\/+$/g, ''))
            .filter(Boolean)
            .join('/')
    );
}

function listRoutes(): RouteInfo[] {
    const routes: RouteInfo[] = [];
    for (const controller of CONTROLLERS) {
        const base = Reflect.getMetadata(PATH_METADATA, controller) as string;
        for (const name of Object.getOwnPropertyNames(controller.prototype)) {
            const handler = (controller.prototype as Record<string, unknown>)[
                name
            ] as object;
            const method = Reflect.getMetadata(METHOD_METADATA, handler) as
                | number
                | undefined;
            if (typeof handler !== 'function' || method === undefined) continue;
            const path = Reflect.getMetadata(PATH_METADATA, handler) as string;
            const declared = joinPath(base, path);
            const verb = METHOD_NAMES[method];
            routes.push({
                method: verb,
                url: declared
                    .replace(/:metal/g, 'GOLD')
                    .replace(/:id/g, '1')
                    .replace(/:table/g, 'products'),
                key: `${verb} ${declared}`,
                roles:
                    (Reflect.getMetadata('roles', handler) as
                        | string[]
                        | undefined) ??
                    (Reflect.getMetadata('roles', controller) as
                        | string[]
                        | undefined),
            });
        }
    }
    return routes;
}

describe('route authentication (SEC-1 / SEC-2)', () => {
    let app: INestApplication;
    const user = { id: 'u1', email: 'staff@example.com', admin: false };
    const admin = { id: 'u2', email: 'boss@example.com', admin: true };
    const authService = {
        validateToken: jest.fn(async (token: string) => {
            if (token === 'staff') return user;
            if (token === 'admin') return admin;
            throw new (await import('@nestjs/common')).UnauthorizedException(
                'Invalid or expired token',
            );
        }),
    };
    const marketData = {
        getMarketData: jest.fn(),
        recalculate: jest.fn().mockResolvedValue([]),
        refresh: jest.fn().mockResolvedValue({}),
        fetchHistoricClose: jest.fn().mockResolvedValue(undefined),
        seedHistoricPrices: jest.fn().mockResolvedValue(undefined),
    };
    const productsService = { updateStock: jest.fn().mockResolvedValue({}) };
    const tradeService = { getBootstrap: jest.fn().mockResolvedValue({}) };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: CONTROLLERS,
            providers: [
                { provide: APP_GUARD, useClass: JwtAuthGuard },
                { provide: APP_GUARD, useClass: RolesGuard },
                { provide: APP_PIPE, useClass: ZodValidationPipe },
                { provide: AuthService, useValue: authService },
                {
                    provide: AppService,
                    useValue: { getStatus: () => ({}), getHealth: () => ({}) },
                },
                { provide: AdminOverviewService, useValue: {} },
                { provide: ApiCatalogueService, useValue: {} },
                { provide: AuditLogService, useValue: {} },
                { provide: AppLogsService, useValue: {} },
                { provide: DbBrowserService, useValue: {} },
                {
                    provide: RequestMetricsService,
                    useValue: { recordLogin: jest.fn() },
                },
                { provide: BranchesService, useValue: {} },
                { provide: ErrorLogService, useValue: {} },
                { provide: KnowledgeService, useValue: {} },
                { provide: AskService, useValue: {} },
                { provide: AskStreamResponder, useValue: {} },
                { provide: MarketDataService, useValue: marketData },
                { provide: MarketModeService, useValue: {} },
                { provide: MetalsProvider, useValue: {} },
                { provide: MetalsCron, useValue: {} },
                { provide: FetchAttemptService, useValue: {} },
                { provide: PortfolioService, useValue: {} },
                { provide: RoadmapService, useValue: {} },
                { provide: ProductsService, useValue: productsService },
                { provide: TradeService, useValue: tradeService },
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const send = (route: Pick<RouteInfo, 'method' | 'url'>, token?: string) => {
        const req = request(app.getHttpServer() as Server)[
            route.method.toLowerCase() as 'get'
        ](route.url);
        return token ? req.set('Authorization', `Bearer ${token}`) : req;
    };

    const protectedRoutes = listRoutes().filter(
        (r) => !PUBLIC_ROUTES.has(r.key),
    );

    it('discovers the routes it is meant to guard', () => {
        expect(listRoutes().length).toBeGreaterThan(30);
        // A typo in the allow-list must not silently turn into "nothing is public".
        const keys = new Set(listRoutes().map((r) => r.key));
        for (const publicKey of PUBLIC_ROUTES)
            expect(keys).toContain(publicKey);
    });

    it.each(protectedRoutes.map((r) => [r.key, r] as const))(
        '%s rejects a request with no token',
        async (_key, route) => {
            await send(route).expect(401);
        },
    );

    it.each(protectedRoutes.map((r) => [r.key, r] as const))(
        '%s rejects an invalid token',
        async (_key, route) => {
            await send(route, 'bogus').expect(401);
        },
    );

    it('verifies a token once per request even when a route also declares @UseGuards(JwtAuthGuard)', async () => {
        // GET /branches has both the global guard and a route-level JwtAuthGuard.
        const res = await send({ method: 'GET', url: '/branches' }, 'staff');
        expect(res.status).toBe(403);
        expect(authService.validateToken).toHaveBeenCalledTimes(1);
    });

    // A write route that forgets @Roles is open to every signed-in user. Adding a route to this list is a
    // decision that it is meant for non-admin staff; anything else must declare its roles.
    describe('write routes declare who may call them', () => {
        const NON_ADMIN_WRITES = new Set([
            'POST /portfolio/build',
            'POST /portfolio/profit-analysis',
            'POST /trade/cart',
            'POST /trade/melt',
            'POST /market-data/recalculate',
            'POST /market-data/refresh',
            'POST /errors/client',
            'POST /ai/ask',
            'POST /ai/ask/stream',
        ]);

        const writeRoutes = listRoutes().filter(
            (r) => r.method !== 'GET' && !PUBLIC_ROUTES.has(r.key),
        );

        it('finds the write routes it is meant to check', () => {
            expect(writeRoutes.length).toBeGreaterThan(15);
            const keys = new Set(listRoutes().map((r) => r.key));
            for (const allowed of NON_ADMIN_WRITES)
                expect(keys).toContain(allowed);
        });

        it.each(writeRoutes.map((r) => [r.key, r] as const))(
            '%s has @Roles or is on the non-admin allow-list',
            (_key, route) => {
                if (NON_ADMIN_WRITES.has(route.key)) {
                    // Allow-listed routes must not quietly become admin-only without the list being updated.
                    expect(route.roles ?? []).toEqual([]);
                } else {
                    expect(route.roles).toBeDefined();
                }
            },
        );
    });

    describe('vendor-quota and write endpoints', () => {
        it('POST /market-data/seed-history is admin-only', async () => {
            await send(
                { method: 'POST', url: '/market-data/seed-history' },
                'staff',
            ).expect(403);
            expect(marketData.seedHistoricPrices).not.toHaveBeenCalled();

            await send(
                { method: 'POST', url: '/market-data/seed-history' },
                'admin',
            ).expect(201);
            expect(marketData.seedHistoricPrices).toHaveBeenCalledTimes(1);
        });

        it('GET /market-data/historic-close/debug is admin-only', async () => {
            await send(
                { method: 'GET', url: '/market-data/historic-close/debug' },
                'staff',
            ).expect(403);
            expect(marketData.fetchHistoricClose).not.toHaveBeenCalled();

            await send(
                {
                    method: 'GET',
                    url: '/market-data/historic-close/debug?date=2026-09-01',
                },
                'admin',
            ).expect(200);
            expect(marketData.fetchHistoricClose).toHaveBeenCalledWith(
                '2026-09-01',
            );
        });

        it('POST /market-data/refresh works for any signed-in user (the desk Refresh button)', async () => {
            await send(
                { method: 'POST', url: '/market-data/refresh' },
                'staff',
            ).expect(201);
            expect(marketData.refresh).toHaveBeenCalledTimes(1);
        });
    });

    // Every question costs tokens, but the per-user quota and spend breaker bound that, so the
    // assistant is open to all signed-in staff. (No-token and bad-token cases are covered above.)
    describe('AI assistant', () => {
        it.each([
            ['GET', '/ai/status'],
            ['POST', '/ai/ask'],
            ['POST', '/ai/ask/stream'],
        ])('%s %s is not blocked for non-admin staff', async (method, url) => {
            const res = await send({ method, url }, 'staff').send({
                question: 'VAT?',
            });
            // The AskService is a stub here, so the handler may still fail; it must not be an auth refusal.
            expect([401, 403]).not.toContain(res.status);
        });
    });

    describe('Knowledge Center editing', () => {
        it.each([
            ['PATCH', '/knowledge/documents/pricing'],
            ['POST', '/knowledge/documents/pricing/status'],
        ])('%s %s is admin-only', async (method, url) => {
            await send({ method, url }, 'staff').send({}).expect(403);
        });
    });

    describe('class-level admin gating', () => {
        it.each([
            ['GET', '/metals/cron-status'],
            ['POST', '/metals/clear-cache'],
            ['GET', '/metals/fetch-log'],
            ['GET', '/errors'],
            ['DELETE', '/errors'],
        ])(
            '%s %s is admin-only without a per-route decorator',
            async (method, url) => {
                await send({ method, url }, 'staff').expect(403);
            },
        );

        it('POST /errors/client stays open to every signed-in user inside the admin-only controller', async () => {
            const res = await send(
                { method: 'POST', url: '/errors/client' },
                'staff',
            ).send({ reports: [] });
            // The ErrorLogService is a stub here, so the handler may fail; it must not be an auth refusal.
            expect([401, 403]).not.toContain(res.status);
        });
    });

    describe('query parameters are validated, not defaulted (0.12)', () => {
        it.each([
            ['GET', '/errors?limit=abc'],
            ['GET', '/errors?limit=501'],
            ['GET', '/admin/audit?limit=0'],
            ['GET', '/admin/logs?level=loud'],
            ['GET', '/admin/db/tables/products/rows?page=0'],
            ['GET', '/admin/db/tables/products/rows?pageSize=999'],
            ['GET', '/admin/db/tables/products/rows?dir=sideways'],
            ['GET', '/metals/fetch-log?limit=-1'],
            ['POST', '/market-data/backfill-history?years=11'],
            ['POST', '/metals/COPPER/retry'],
        ])('%s %s is a 400 for an admin', async (method, url) => {
            await send({ method, url }, 'admin').expect(400);
        });
    });

    describe('input validation (SEC-3)', () => {
        it('rejects an unknown metal on GET /trade/:metal/bootstrap before any lookup', async () => {
            await send(
                { method: 'GET', url: '/trade/COPPER/bootstrap' },
                'staff',
            ).expect(400);
            expect(tradeService.getBootstrap).not.toHaveBeenCalled();

            await send(
                { method: 'GET', url: '/trade/GOLD/bootstrap' },
                'staff',
            ).expect(200);
            expect(tradeService.getBootstrap).toHaveBeenCalledWith('GOLD');
        });

        it.each([{ GOLD: 'abc' }, { GOLD: -5 }, { SILVER: 0 }])(
            'rejects recalculate overrides %j',
            async (body) => {
                await send(
                    { method: 'POST', url: '/market-data/recalculate' },
                    'staff',
                )
                    .send(body)
                    .expect(400);
                expect(marketData.recalculate).not.toHaveBeenCalled();
            },
        );

        it('accepts valid recalculate overrides', async () => {
            await send(
                { method: 'POST', url: '/market-data/recalculate' },
                'staff',
            )
                .send({ GOLD: 3000 })
                .expect(201);
            expect(marketData.recalculate).toHaveBeenCalledWith({ GOLD: 3000 });
        });

        it.each(['garbage', '2026-02-30', '2026-9-1'])(
            'rejects historic-close date %j',
            async (date) => {
                await send(
                    {
                        method: 'GET',
                        url: `/market-data/historic-close/debug?date=${date}`,
                    },
                    'admin',
                ).expect(400);
                expect(marketData.fetchHistoricClose).not.toHaveBeenCalled();
            },
        );

        it.each([
            { stock_quantity: -1 },
            { stock_quantity: 1.5 },
            { stock_quantity: '5' },
            {},
        ])('rejects stock update body %j', async (body) => {
            await send(
                { method: 'PATCH', url: '/products/admin/products/1/stock' },
                'admin',
            )
                .send(body)
                .expect(400);
            expect(productsService.updateStock).not.toHaveBeenCalled();
        });

        it('accepts a valid stock update', async () => {
            await send(
                { method: 'PATCH', url: '/products/admin/products/1/stock' },
                'admin',
            )
                .send({ stock_quantity: 7 })
                .expect(200);
            expect(productsService.updateStock).toHaveBeenCalledWith(
                1,
                7,
                'boss@example.com',
            );
        });
    });
});
