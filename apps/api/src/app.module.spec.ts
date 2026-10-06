import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { RedisService } from './infrastructure/redis/redis.service';
import { SupabaseService } from './infrastructure/supabase/supabase.service';
import { METAL_PRICE_API } from './infrastructure/metal-price-api/metal-price-api.port';

// The other specs mock providers by hand, which hides a missing module import
// (a guard that can't resolve AuthService only fails when the app boots).
// This compiles the real module graph with just the network-facing leaves
// replaced, so a broken DI wiring fails here instead of at `nest start`.
describe('AppModule wiring', () => {
    const env = {
        DATABASE_URL: 'postgres://u:p@localhost:5432/db',
        DIRECT_URL: 'postgres://u:p@localhost:5432/db',
        SUPABASE_URL: 'http://localhost:54321',
        SUPABASE_KEY: 'test-key',
        SUPABASE_ANON_KEY: 'test-key',
        SUPABASE_SERVICE_ROLE_KEY: 'test-key',
        METALPRICE_API_KEY: 'test-key',
        REDIS_URL: '',
    };
    const saved: Record<string, string | undefined> = {};

    beforeAll(() => {
        for (const [key, value] of Object.entries(env)) {
            saved[key] = process.env[key];
            process.env[key] = value;
        }
    });

    afterAll(() => {
        for (const [key, value] of Object.entries(saved)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    });

    it('resolves every provider, guard and controller', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue({ $connect: jest.fn(), $disconnect: jest.fn() })
            .overrideProvider(RedisService)
            .useValue({
                isHealthy: () => true,
                get: jest.fn(),
                set: jest.fn(),
                del: jest.fn(),
            })
            .overrideProvider(SupabaseService)
            .useValue({})
            .overrideProvider(METAL_PRICE_API)
            .useValue({})
            .compile();

        expect(moduleRef).toBeDefined();
        await moduleRef.close();
    });
});
