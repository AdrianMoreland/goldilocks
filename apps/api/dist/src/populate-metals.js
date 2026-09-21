"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const prisma_1 = require("./lib/db/prisma");
const prismaNamespace_1 = require("../prisma/generated/internal/prismaNamespace");
const metals_provider_1 = require("./modules/metals/metals.provider");
async function run() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const metalsProvider = app.get(metals_provider_1.MetalsProvider);
    try {
        await prisma_1.prisma.metalSpotPrice.createMany({
            data: [
                {
                    metalType: 'GOLD',
                    priceGbp: new prismaNamespace_1.Decimal('4800'),
                    priceEur: new prismaNamespace_1.Decimal('4400'),
                    source: 'livepriceofgold',
                    timestamp: new Date('2000-01-01T00:00:00.000Z'),
                },
                {
                    metalType: 'SILVER',
                    priceGbp: new prismaNamespace_1.Decimal('27'),
                    priceEur: new prismaNamespace_1.Decimal('25'),
                    source: 'livepriceofgold',
                    timestamp: new Date('2000-01-01T00:00:00.000Z'),
                },
                {
                    metalType: 'PLATINUM',
                    priceGbp: new prismaNamespace_1.Decimal('1200'),
                    priceEur: new prismaNamespace_1.Decimal('1100'),
                    source: 'livepriceofgold',
                    timestamp: new Date('2000-01-01T00:00:00.000Z'),
                },
                {
                    metalType: 'PALLADIUM',
                    priceGbp: new prismaNamespace_1.Decimal('2600'),
                    priceEur: new prismaNamespace_1.Decimal('2400'),
                    source: 'livepriceofgold',
                    timestamp: new Date('2000-01-01T00:00:00.000Z'),
                },
            ],
            skipDuplicates: true,
        });
        await metalsProvider.refreshAll();
        console.log('✅ Metals initialized and cached in Redis');
    }
    catch (err) {
        console.error('❌ Failed to initialize metals:', err);
    }
    finally {
        await prisma_1.prisma.$disconnect();
        await app.close();
    }
}
run();
//# sourceMappingURL=populate-metals.js.map