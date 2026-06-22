import { prisma } from "../src/lib/db/prisma";
import { UserRole, MetalType } from "./generated/enums";
import {Decimal} from "./generated/internal/prismaNamespace";

// const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seeding...");

    // --- USERS ---
    const users = [
        {
            id: "00000000-0000-0000-0000-000000000001",
            mgEmail: "admin@mariongold.com",
            firstName: "Alice",
            lastName: "Admin",
            password: "hashedpassword123",
            role: UserRole.ADMIN,
            isActive: true,
            admin: true,
        },
        {
            id: "00000000-0000-0000-0000-000000000002",
            mgEmail: "sales@mariongold.com",
            firstName: "Bob",
            lastName: "Sales",
            password: "hashedpassword456",
            role: UserRole.SALES,
            isActive: true,
            admin: false,
        },
    ];

    for (const user of users) {
        try {
            await prisma.user.upsert({
                where: { mgEmail: user.mgEmail },
                update: {},
                create: user,
            });
        } catch (e) {
            console.error(`Failed to seed user ${user.mgEmail}:`, e);
        }
    }
    console.log("✅ Seeded users!");

    // --- PRODUCTS ---

    const goldProducts = [
        { sku: "GOLD-1OZ-BAR", name: "1 oz Gold Bar", metalType: MetalType.GOLD, weight: 31.1035, spreadBuy: -0.03, spreadSell: 0.02, vatRate: 0.0, stock: 50, description: "Cast 1 oz gold bar, .9999 fine" },
        { sku: "GOLD-1KG-BAR", name: "1 kg Gold Bar", metalType: MetalType.GOLD, weight: 1000, spreadBuy: -0.035, spreadSell: 0.025, vatRate: 0.0, stock: 30, description: "Cast 1 kg gold bar, vaulted" },
        { sku: "GOLD-1G-BAR", name: "1 g Gold Bar", metalType: MetalType.GOLD, weight: 1, spreadBuy: -0.02, spreadSell: 0.015, vatRate: 0.0, stock: 100, description: "1 gram gold bar, fractional accumulation" },
        { sku: "GOLD-1OZ-COIN", name: "1 oz Gold Coin", metalType: MetalType.GOLD, weight: 31.1035, spreadBuy: -0.025, spreadSell: 0.03, vatRate: 0.0, stock: 40, description: "Minted 1 oz gold coin, collectible" },
        { sku: "GOLD-1/2OZ-COIN", name: "1/2 oz Gold Coin", metalType: MetalType.GOLD, weight: 15.5518, spreadBuy: -0.025, spreadSell: 0.03, vatRate: 0.0, stock: 35, description: "Popular fractional option" },
        { sku: "GOLD-1/4OZ-COIN", name: "1/4 oz Gold Coin", metalType: MetalType.GOLD, weight: 7.776, spreadBuy: -0.02, spreadSell: 0.025, vatRate: 0.0, stock: 30, description: "Fractional investment coin" },
        { sku: "GOLD-100G-BAR", name: "100 g Gold Bar", metalType: MetalType.GOLD, weight: 100, spreadBuy: -0.03, spreadSell: 0.02, vatRate: 0.0, stock: 20, description: "100 gram minted bar" },
        { sku: "GOLD-50G-BAR", name: "50 g Gold Bar", metalType: MetalType.GOLD, weight: 50, spreadBuy: -0.03, spreadSell: 0.02, vatRate: 0.0, stock: 20, description: "50 gram cast gold bar" },
        { sku: "GOLD-5G-BAR", name: "5 g Gold Bar", metalType: MetalType.GOLD, weight: 5, spreadBuy: -0.02, spreadSell: 0.015, vatRate: 0.0, stock: 80, description: "Entry-level gold piece" },
        { sku: "GOLD-0.5G-BAR", name: "0.5 g Gold Bar", metalType: MetalType.GOLD, weight: 0.5, spreadBuy: -0.015, spreadSell: 0.01, vatRate: 0.0, stock: 100, description: "Micro fractional gold bar" },
    ];

    const silverProducts = [
        { sku: "SILVER-1KG-BAR", name: "1 kg Silver Bar", metalType: MetalType.SILVER, weight: 1000, spreadBuy: -0.035, spreadSell: 0.025, vatRate: 0.23, stock: 25, description: "1 kg silver bar" },
        { sku: "SILVER-100G-BAR", name: "100 g Silver Bar", metalType: MetalType.SILVER, weight: 100, spreadBuy: -0.03, spreadSell: 0.02, vatRate: 0.23, stock: 40, description: "100 g silver bar" },
        { sku: "SILVER-1OZ-COIN", name: "1 oz Silver Coin", metalType: MetalType.SILVER, weight: 31.1035, spreadBuy: -0.03, spreadSell: 0.025, vatRate: 0.23, stock: 30, description: "1 oz silver coin, collectible" },
    ];

    const platinumProducts = [
        { sku: "PLATINUM-1OZ-BAR", name: "1 oz Platinum Bar", metalType: MetalType.PLATINUM, weight: 31.1035, spreadBuy: -0.04, spreadSell: 0.03, vatRate: 0.23, stock: 15, description: "1 oz platinum bar" },
        { sku: "PLATINUM-1OZ-COIN", name: "1 oz Platinum Coin", metalType: MetalType.PLATINUM, weight: 31.1035, spreadBuy: -0.04, spreadSell: 0.03, vatRate: 0.23, stock: 10, description: "1 oz platinum coin" },
    ];

    const palladiumProducts = [
        { sku: "PALLADIUM-1OZ-BAR", name: "1 oz Palladium Bar", metalType: MetalType.PALLADIUM, weight: 31.1035, spreadBuy: -0.04, spreadSell: 0.03, vatRate: 0.23, stock: 10, description: "1 oz palladium bar" },
        { sku: "PALLADIUM-1OZ-COIN", name: "1 oz Palladium Coin", metalType: MetalType.PALLADIUM, weight: 31.1035, spreadBuy: -0.04, spreadSell: 0.03, vatRate: 0.23, stock: 8, description: "1 oz palladium coin" },
    ];

    const allProducts = [...goldProducts, ...silverProducts, ...platinumProducts, ...palladiumProducts];

    for (const product of allProducts) {
        await prisma.product.upsert({
            where: { sku: product.sku },
            update: {},
            create: product,
        });
    }
    console.log(`✅ Seeded ${allProducts.length} products!`);

    // --- METAL SPOT PRICES ---
    const now = new Date();
    const spotPrices = [
        { metalType: MetalType.GOLD, priceUsd: Decimal('4800'), priceEur: Decimal('4500'), previousPrice: Decimal('4800'), source: 'metals-api', timestamp: now },
        { metalType: MetalType.SILVER, priceUsd: Decimal('27'), priceEur: Decimal('25'), previousPrice: Decimal('27'), source: 'metals-api', timestamp: now },
        { metalType: MetalType.PLATINUM, priceUsd: Decimal('1200'), priceEur: Decimal('1100'), previousPrice: Decimal('1200'), source: 'metals-api', timestamp: now },
        { metalType: MetalType.PALLADIUM, priceUsd: Decimal('2600'), priceEur: Decimal('2400'), previousPrice: Decimal('2600'), source: 'metals-api', timestamp: now },
    ];

    for (const spot of spotPrices) {
        await prisma.metalSpotPrice.upsert({
            where: { metalType_timestamp: { metalType: spot.metalType, timestamp: spot.timestamp } },
            update: {
                priceUsd: spot.priceUsd,
                priceEur: spot.priceEur,
                previousPrice: spot.previousPrice,
                source: spot.source
            },
            create: spot,
        });
    }

    console.log("✅ Seeded metal spot prices!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });