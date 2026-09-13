import { prisma } from "../src/lib/db/prisma";
import { MetalType } from "./generated/enums";

/**
 * One-off data-sync script — NOT part of the initial `seed.ts` bootstrap.
 *
 * Source of truth: "New Pricing Workbook.xlsx" (the live sheet shared in
 * chat, superseding the earlier PW3.xlsx-based schedule). Unlike the old
 * schedule, this workbook does NOT share one universal bars/coins table
 * across metals — each metal's GOLD/SILVER/PGM sheet has its own weight
 * tiers and its own premium/discount schedule (confirmed by reading each
 * sheet's header row directly rather than assuming a shared layout; Silver
 * even carries two parallel bar/coin schedules — "Bonded" storage product
 * vs standard VAT-paid stock — for some of the same weights at different
 * prices). So every metal below is its own explicit list, not a shared one.
 *
 * This app prices products live from (spot / troy oz) * weight *
 * (1 + spreadSell/spreadBuy), so only weight + the two percentages are
 * needed — the sheet's own pre-computed price columns aren't used here.
 *
 * Naming: coin names deliberately drop the redundant "{Metal} Coin" suffix
 * and the space in "N oz" (e.g. "1oz Britannia", not "1 oz Britannia Gold
 * Coin") — this matches the workbook's own product names and what's asked
 * for. Bar names keep the existing "{weight} {Metal} Bar" pattern — the
 * frontend's product-grouping.ts detects bars via /bar/i on the name and
 * strips the metal word for display (`stripMetalWord`), so a bar's DB name
 * must keep the literal words "Bar" and the metal name for that to keep
 * working; only the coin side of that naming was in scope here.
 *
 * PAMP/CombiBar brand-stamp variants and any row the sheet marks
 * unavailable ("-" or a zero premium placeholder) are deliberately left out
 * — same call as the previous round, still true of this workbook.
 *
 * Every write is idempotent (safe to re-run) and never touches `stock` on a
 * product that already exists — inventory counts are managed separately
 * from pricing. After upserting the authoritative catalogue below, this
 * script also DELETES any product row for these four metals whose SKU is
 * no longer part of that catalogue (stale tiers from the old shared
 * schedule — e.g. a platinum 250g bar, or gold coin mints the old script
 * invented that this workbook doesn't actually carry) so the products
 * table ends up identical to the workbook, not a superset of it.
 */

const GOLD_VAT = 0;
const NON_GOLD_VAT = 0.23; // silver/platinum/palladium aren't EU "investment metal"

const GRAMS_PER_TROY_OUNCE = 31.1035;

interface Entry {
    /** Used verbatim in the SKU: `${metal}-${skuSuffix}-${kind}`. */
    skuSuffix: string;
    kind: "BAR" | "COIN";
    name: string;
    weightGrams: number;
    premium: number;
    discount: number;
    stock: number;
}

const bar = (skuSuffix: string, name: string, weightGrams: number, premium: number, discount: number, stock: number): Entry => ({
    skuSuffix,
    kind: "BAR",
    name,
    weightGrams,
    premium,
    discount,
    stock,
});

const coin = (skuSuffix: string, name: string, weightGrams: number, premium: number, discount: number, stock: number): Entry => ({
    skuSuffix,
    kind: "COIN",
    name,
    weightGrams,
    premium,
    discount,
    stock,
});

// ============================================================================
// GOLD — no 10oz bar (workbook lists it with a 0% placeholder premium, i.e.
// not actually offered); sovereigns and the 1g/fractional coins are gold-only.
// ============================================================================
const GOLD_ENTRIES: Entry[] = [
    bar("1G", "1 g Gold Bar", 1, 0.34, 0.10, 150),
    bar("2.5G", "2.5 g Gold Bar", 2.5, 0.26, 0.065, 120),
    bar("5G", "5 g Gold Bar", 5, 0.14, 0.065, 100),
    bar("10G", "10 g Gold Bar", 10, 0.1175, 0.065, 80),
    bar("20G", "20 g Gold Bar", 20, 0.068, 0.05, 60),
    bar("1OZ", "1 oz Gold Bar", GRAMS_PER_TROY_OUNCE, 0.059, 0.04, 50),
    bar("50G", "50 g Gold Bar", 50, 0.061, 0.04, 40),
    bar("100G", "100 g Gold Bar", 100, 0.051, 0.0375, 25),
    bar("250G", "250 g Gold Bar", 250, 0.046, 0.035, 12),
    bar("500G", "500 g Gold Bar", 500, 0.0455, 0.0325, 6),
    bar("1KG", "1 kg Gold Bar", 1000, 0.035, 0.03, 4),

    coin("1OZ-MAPLELEAF", "1oz Maple Leaf", GRAMS_PER_TROY_OUNCE, 0.057, 0.0375, 40),
    coin("1OZ-BRITANNIA", "1oz Britannia", GRAMS_PER_TROY_OUNCE, 0.065, 0.0375, 35),
    coin("1OZ-KRUGERRAND", "1oz Krugerrand", GRAMS_PER_TROY_OUNCE, 0.0585, 0.0375, 35),
    coin("1OZ-PHILHARMONIC", "1oz Philharmonic", GRAMS_PER_TROY_OUNCE, 0.0675, 0.0375, 30),
    coin("1OZ-KANGAROO", "1oz Kangaroo", GRAMS_PER_TROY_OUNCE, 0.065, 0.04, 30),
    coin("1OZ-TREEOFLIFE", "1oz Tree of Life", GRAMS_PER_TROY_OUNCE, 0.0925, 0.0375, 20),
    coin("1OZ-USEAGLE", "1oz US Eagle", GRAMS_PER_TROY_OUNCE, 0.084, 0.0325, 30),
    coin("HALF-SOVEREIGN", "Half Sovereign", 3.6612, 0.08, 0.06, 25),
    coin("FULL-SOVEREIGN", "Full Sovereign", 7.3224, 0.0675, 0.055, 15),
    coin("DOUBLE-SOVEREIGN", "Double Sovereign", 14.6447, 0.095, 0.065, 8),
    coin("1G", "1g Coin", 1, 0.325, 0.08, 100),
    coin("1/10OZ", "1/10oz", GRAMS_PER_TROY_OUNCE / 10, 0.225, 0.07, 60),
    coin("1/10OZ-US", "1/10oz US Eagle", GRAMS_PER_TROY_OUNCE / 10, 0.25, 0.06, 50),
    coin("1/4OZ", "1/4oz", GRAMS_PER_TROY_OUNCE / 4, 0.15, 0.06, 45),
    coin("1/4OZ-US", "1/4oz US Eagle", GRAMS_PER_TROY_OUNCE / 4, 0.1675, 0.06, 40),
    coin("1/2OZ", "1/2oz", GRAMS_PER_TROY_OUNCE / 2, 0.115, 0.06, 35),
    coin("1/2OZ-US", "1/2oz US Eagle", GRAMS_PER_TROY_OUNCE / 2, 0.125, 0.05, 32),
];

// ============================================================================
// SILVER — three parallel sub-schedules in the workbook: "Bonded" (deferred-
// VAT storage product), standard VAT-paid bars, and mint coins. Bonded and
// standard bars share some weight labels (1kg, 100oz) at different
// prices, so the Bonded ones get their own "Bonded Bar"/"Bonded Coins" name
// to stay visually distinct in the product table instead of colliding.
// "Market bar" and the "-" (unavailable) 10oz/5kg bar rows are skipped —
// no fixed weight or no live premium to price them from.
// ============================================================================
const SILVER_ENTRIES: Entry[] = [
    // Bonded
    bar("1KG-BONDED", "1 kg Silver Bonded Bar", 1000, 0.08, 0.03, 20),
    bar("100OZ-BONDED", "100 oz Silver Bonded Bar", GRAMS_PER_TROY_OUNCE * 100, 0.075, 0.03, 15),
    bar("5KG-BONDED", "5 kg Silver Bonded Bar", 5000, 0.08, 0.025, 8),
    bar("15KG-BONDED", "15 kg Silver Bonded Bar", 15000, 0.065, 0.025, 4),
    coin("1OZ-BONDED", "1oz Bonded Coins", GRAMS_PER_TROY_OUNCE, 0.08, 0.05, 50),

    // Standard (VAT-paid) bars
    bar("100G", "100 g Silver Bar", 100, 0.375, 0.09, 60),
    bar("250G", "250 g Silver Bar", 250, 0.35, 0.09, 40),
    bar("500G", "500 g Silver Bar", 500, 0.275, 0.08, 25),
    bar("1KG", "1 kg Silver Bar", 1000, 0.175, 0.06, 15),
    bar("100OZ", "100 oz Silver Bar", GRAMS_PER_TROY_OUNCE * 100, 0.225, 0.06, 10),

    // Mint coins
    coin("1OZ-BRITANNIA", "1oz Britannia", GRAMS_PER_TROY_OUNCE, 0.30, 0.085, 60),
    coin("1OZ-MAPLELEAF", "1oz Maple Leaf", GRAMS_PER_TROY_OUNCE, 0.275, 0.085, 60),
    coin("1OZ-TREEOFLIFE", "1oz Tree of Life", GRAMS_PER_TROY_OUNCE, 0.40, 0.085, 30),
    coin("1OZ-KRUGERRAND", "1oz Krugerrand", GRAMS_PER_TROY_OUNCE, 0.325, 0.085, 40),
    coin("1OZ-KANGAROO", "1oz Kangaroo", GRAMS_PER_TROY_OUNCE, 0.325, 0.085, 40),
    coin("1OZ-PHILHARMONIC", "1oz Philharmonic", GRAMS_PER_TROY_OUNCE, 0.325, 0.085, 40),
    coin("1OZ-USEAGLE", "1oz US Eagle", GRAMS_PER_TROY_OUNCE, 0.40, 0.085, 30),
    coin("2OZ-QUEENSBEASTS", "2oz Queen's Beasts", GRAMS_PER_TROY_OUNCE * 2, 0.425, 0.085, 20),
    coin("1KG-COINS", "1kg Coins", 1000, 0.40, 0.06, 10),
];

// ============================================================================
// PGM (Platinum / Palladium) — the workbook stops at 100g bars (no 250g,
// 500g, 1kg, or 10oz tier like gold/silver) and only lists two coin mints.
// ============================================================================
const PLATINUM_ENTRIES: Entry[] = [
    bar("1G", "1 g Platinum Bar", 1, 0.5, 0.10, 30),
    bar("5G", "5 g Platinum Bar", 5, 0.2, 0.065, 25),
    bar("10G", "10 g Platinum Bar", 10, 0.15, 0.05, 20),
    bar("20G", "20 g Platinum Bar", 20, 0.12, 0.04, 15),
    bar("1OZ", "1 oz Platinum Bar", GRAMS_PER_TROY_OUNCE, 0.10, 0.035, 12),
    bar("50G", "50 g Platinum Bar", 50, 0.09, 0.03, 8),
    bar("100G", "100 g Platinum Bar", 100, 0.075, 0.03, 5),

    coin("1OZ-BRITANNIA", "1oz Britannia", GRAMS_PER_TROY_OUNCE, 0.12, 0.035, 15),
    coin("1OZ-MAPLE", "1oz Maple", GRAMS_PER_TROY_OUNCE, 0.12, 0.035, 15),
];

const PALLADIUM_ENTRIES: Entry[] = [
    bar("1G", "1 g Palladium Bar", 1, 0.55, 0.10, 30),
    bar("5G", "5 g Palladium Bar", 5, 0.25, 0.065, 25),
    bar("10G", "10 g Palladium Bar", 10, 0.18, 0.05, 20),
    bar("20G", "20 g Palladium Bar", 20, 0.14, 0.04, 15),
    bar("1OZ", "1 oz Palladium Bar", GRAMS_PER_TROY_OUNCE, 0.12, 0.035, 12),
    bar("50G", "50 g Palladium Bar", 50, 0.10, 0.03, 8),
    bar("100G", "100 g Palladium Bar", 100, 0.08, 0.03, 5),

    coin("1OZ-BRITANNIA", "1oz Britannia", GRAMS_PER_TROY_OUNCE, 0.15, 0.035, 15),
    coin("1OZ-MAPLE", "1oz Maple", GRAMS_PER_TROY_OUNCE, 0.15, 0.035, 15),
];

const CATALOGUE: Record<MetalType, Entry[]> = {
    GOLD: GOLD_ENTRIES,
    SILVER: SILVER_ENTRIES,
    PLATINUM: PLATINUM_ENTRIES,
    PALLADIUM: PALLADIUM_ENTRIES,
};

async function upsertEntry(metal: MetalType, entry: Entry) {
    const sku = `${metal}-${entry.skuSuffix}-${entry.kind}`;
    const vatRate = metal === MetalType.GOLD ? GOLD_VAT : NON_GOLD_VAT;

    const result = await prisma.product.upsert({
        where: { sku },
        update: {
            name: entry.name,
            weight: entry.weightGrams,
            spreadSell: entry.premium,
            spreadBuy: -entry.discount,
            vatRate,
        },
        create: {
            sku,
            name: entry.name,
            metalType: metal,
            weight: entry.weightGrams,
            spreadSell: entry.premium,
            spreadBuy: -entry.discount,
            vatRate,
            stock: entry.stock,
            description: entry.name,
        },
    });

    return { sku, created: result.createdAt.getTime() === result.updatedAt.getTime() };
}

async function main() {
    console.log("🌱 Syncing the products table to New Pricing Workbook.xlsx…");

    let created = 0;
    let updated = 0;
    let deleted = 0;

    for (const metal of Object.keys(CATALOGUE) as MetalType[]) {
        const entries = CATALOGUE[metal];

        for (const entry of entries) {
            const r = await upsertEntry(metal, entry);
            r.created ? created++ : updated++;
            console.log(`${r.created ? "✨ Created" : "✅ Updated"} ${r.sku}`);
        }

        const validSkus = entries.map((e) => `${metal}-${e.skuSuffix}-${e.kind}`);
        const stale = await prisma.product.findMany({
            where: { metalType: metal, sku: { notIn: validSkus } },
            select: { id: true, sku: true },
        });

        for (const product of stale) {
            await prisma.product.delete({ where: { id: product.id } });
            deleted++;
            console.log(`🗑️  Removed stale ${product.sku} (not in the new workbook)`);
        }
    }

    console.log(`✅ Done — ${created} created, ${updated} updated, ${deleted} removed.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
