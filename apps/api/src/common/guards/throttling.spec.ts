import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import type { Server } from 'node:http';
import request from 'supertest';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { UserThrottlerGuard } from './user-throttler.guard';
import { AuthController } from '../../modules/auth/auth.controller';
import { AuthService } from '../../modules/auth/auth.service';
import { RequestMetricsService } from '../../modules/request-metrics/request-metrics.service';
import { MarketDataController } from '../../modules/market-data/market-data.controller';
import { MarketDataService } from '../../modules/market-data/market-data.service';

/** Same shape as AppModule: JwtAuthGuard, RolesGuard, then the throttler, so it can key on the user. */
describe('rate limiting', () => {
    let app: INestApplication;
    const users: Record<string, { id: string; email: string; admin: boolean }> =
        {
            alice: { id: 'u-alice', email: 'alice@example.com', admin: false },
            bob: { id: 'u-bob', email: 'bob@example.com', admin: false },
        };
    const authService = {
        login: jest.fn(),
        refresh: jest.fn().mockResolvedValue({}),
        validateToken: jest.fn((token: string) => {
            const user = users[token];
            if (!user) throw new UnauthorizedException('Invalid token');
            return Promise.resolve(user);
        }),
    };
    const marketData = { refresh: jest.fn().mockResolvedValue({}) };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ThrottlerModule.forRoot({
                    throttlers: [{ ttl: 60_000, limit: 300 }],
                }),
            ],
            controllers: [AuthController, MarketDataController],
            providers: [
                { provide: APP_GUARD, useClass: JwtAuthGuard },
                { provide: APP_GUARD, useClass: RolesGuard },
                { provide: APP_GUARD, useClass: UserThrottlerGuard },
                { provide: APP_PIPE, useClass: ZodValidationPipe },
                { provide: AuthService, useValue: authService },
                { provide: MarketDataService, useValue: marketData },
                {
                    provide: RequestMetricsService,
                    useValue: { recordLogin: jest.fn() },
                },
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    const server = () => app.getHttpServer() as Server;

    it('limits POST /auth/login to 10 attempts a minute per client, then answers 429', async () => {
        authService.login.mockRejectedValue(
            new UnauthorizedException('Invalid email or password'),
        );
        const attempt = () =>
            request(server())
                .post('/auth/login')
                .send({ email: 'a@b.co', password: 'wrong' });

        for (let i = 0; i < 10; i++) await attempt().expect(401);
        await attempt().expect(429);
    });

    it('limits POST /auth/refresh separately from login', async () => {
        const attempt = () =>
            request(server())
                .post('/auth/refresh')
                .send({ refreshToken: 'token' });

        for (let i = 0; i < 30; i++) await attempt().expect(200);
        await attempt().expect(429);
    });

    it('counts POST /market-data/refresh per signed-in user, so one desk cannot throttle another', async () => {
        const refresh = (token: string) =>
            request(server())
                .post('/market-data/refresh')
                .set('Authorization', `Bearer ${token}`);

        for (let i = 0; i < 6; i++) await refresh('alice').expect(201);
        await refresh('alice').expect(429);

        // Same IP (supertest), different user: still allowed.
        await refresh('bob').expect(201);
    });

    it('tells a throttled client when to retry', async () => {
        const res = await request(server())
            .post('/market-data/refresh')
            .set('Authorization', 'Bearer alice')
            .expect(429);
        expect(res.headers['retry-after']).toBeDefined();
    });
});
