import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { RedisService } from './infrastructure/redis/redis.service';
import { FetchAttemptService } from './modules/metals/fetch-attempt.service';

describe('AppController', () => {
    let appController: AppController;
    let mockPrisma: { $queryRaw: jest.Mock };
    let mockRedis: { isHealthy: jest.Mock };
    let mockFetchAttempts: { getLastSuccessfulAt: jest.Mock };

    beforeEach(async () => {
        const mockConfigService = { get: jest.fn().mockReturnValue(4000) };
        mockPrisma = {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
        };
        mockRedis = { isHealthy: jest.fn().mockReturnValue(true) };
        mockFetchAttempts = {
            getLastSuccessfulAt: jest.fn().mockResolvedValue(null),
        };

        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                AppService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: PrismaService, useValue: mockPrisma },
                { provide: RedisService, useValue: mockRedis },
                { provide: FetchAttemptService, useValue: mockFetchAttempts },
            ],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('reports API status', () => {
            expect(appController.getStatus()).toMatchObject({
                name: 'Merrion Gold API',
                status: 'ok',
            });
        });
    });

    describe('health', () => {
        it('reports ok when both DB and Redis are reachable', async () => {
            await expect(appController.getHealth()).resolves.toEqual({
                status: 'ok',
                db: 'ok',
                redis: 'ok',
                lastSuccessfulMetalsApiCall: null,
            });
        });

        it('reports degraded when the DB query throws', async () => {
            mockPrisma.$queryRaw.mockRejectedValueOnce(
                new Error('connection refused'),
            );

            await expect(appController.getHealth()).resolves.toEqual({
                status: 'degraded',
                db: 'unreachable',
                redis: 'ok',
                lastSuccessfulMetalsApiCall: null,
            });
        });

        it('reports degraded when Redis is not connected', async () => {
            mockRedis.isHealthy.mockReturnValueOnce(false);

            await expect(appController.getHealth()).resolves.toEqual({
                status: 'degraded',
                db: 'ok',
                redis: 'unreachable',
                lastSuccessfulMetalsApiCall: null,
            });
        });

        it('surfaces the last successful MetalsAPI call time', async () => {
            mockFetchAttempts.getLastSuccessfulAt.mockResolvedValueOnce(
                '2026-09-20T12:20:00.866Z',
            );

            await expect(appController.getHealth()).resolves.toMatchObject({
                lastSuccessfulMetalsApiCall: '2026-09-20T12:20:00.866Z',
            });
        });
    });
});
