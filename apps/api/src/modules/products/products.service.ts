// src/products/products.service.ts
import {ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {MetalType} from "../../../prisma/generated/enums";
import {Product} from "@goldilocks/shared-types";
import {CreateProductDto, ProductResponseDto, UpdateProductDto} from "../../common/dto/dtos";
import { ProductsProvider } from './products.provider';
import {calculateProductPrice, ZERO_SPOT_MAP} from "../../common/utils/pricing.util";

@Injectable()
export class ProductsService {

    private readonly logger = new Logger(ProductsService.name);

    constructor(private readonly productsProvider: ProductsProvider) {}

    /**
     * Priced products. Caller (MarketDataService, typically) supplies spotMap.
     * If omitted, prices default to 0 rather than silently fetching live spot.
     */
    async getProducts(spotMap: Record<MetalType, number> = ZERO_SPOT_MAP): Promise<Product[]> {
        const rawProducts = await this.productsProvider.getAll();
        return rawProducts.map((p) => calculateProductPrice(p, spotMap));
    }

    /**
     * Raw products, no pricing applied. Useful for admin views/CRUD.
     */
    async getRawProducts() {
        return this.productsProvider.getAll();
    }

    async getById(
        id: number,
        spotMap: Record<MetalType, number> = ZERO_SPOT_MAP,
    ): Promise<Product> {
        const raw = await this.productsProvider.getById(id);
        if (!raw) {
            throw new NotFoundException('Product not found');
        }
        return calculateProductPrice(raw, spotMap);
    }

    async create(dto: CreateProductDto) {
        const existing = await this.productsProvider.findBySku(dto.sku);
        if (existing) {
            throw new ConflictException('Product already exists.');
        }
        return this.productsProvider.create(dto);
    }

    async update(id: number, dto: Partial<UpdateProductDto>) {
        const existing = await this.productsProvider.getById(id);
        if (!existing) {
            throw new NotFoundException('Product not found');
        }
        return this.productsProvider.update(id, dto);
    }

    async delete(id: number) {
        const existing = await this.productsProvider.getById(id);
        if (!existing) {
            throw new NotFoundException('Product not found');
        }
        return this.productsProvider.delete(id);
    }

    async updateStock(id: number, stockQuantity: number) {
        return this.productsProvider.updateStock(id, stockQuantity);
    }

   /* /!**
     * Get products with calculated prices based on provided spot prices.
     * If spotPrices not provided, fetches live spot prices internally.
     *!/
    async getProductsWithSpot(
        spotPrices: Record<MetalType, number>,
    ): Promise<Product[]> {
        this.logger.log('getProductsWithSpot= 📦 Fetching products with spot prices...');

        try {
            // 1️⃣ Ensure we have spot prices
            // Initialize with all keys to satisfy TypeScript
            let spotMap: Record<MetalType, number> = {
                GOLD: 0,
                SILVER: 0,
                PLATINUM: 0,
                PALLADIUM: 0,
            };

            // Override with frontend-provided spot prices if available
            if (spotPrices && Object.keys(spotPrices).length > 0) {
                spotMap = spotPrices;
            } else {
                this.logger.log('⚡ No spotPrices provided, fetching live spot prices...');
                const fetched = await this.metalsService.getAllLatest();
                if (fetched && Object.keys(fetched).length > 0) {
                    spotMap = await this.getSimpleSpotMap(fetched);
                }
            }

            // 2️⃣ Fetch products
            const products = await this.prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
            });

            if (!products || products.length === 0) {
                this.logger.warn('⚠️ No products found in database');
            } else {
                // this.logger.debug(`✅ Products fetched: count=${products.length}`);
                this.logger.log(
                    `📦 Products list:\n` +
                    products.map(p =>
                        `[${p.id}] ${p.name} | ${p.metalType} | buy=${p.spreadBuy} sell=${p.spreadSell} stock=${p.stock}`
                    ).join('\n')
                );
            }

            // 3️⃣ Map products using existing map function
            const mappedProducts = this.map(products, spotMap);

            this.logger.log(`✅ Products successfully mapped with spot prices`);
            return mappedProducts;
        } catch (error) {
            this.logger.error(
                '❌ Failed to fetch products with spot prices',
                error instanceof Error ? error.stack : String(error),
            );
            throw new InternalServerErrorException(
                'Failed to load products with spot prices',
            );
        }
    }

    async recalculate(
        overrides: Record<MetalType, number>
    ): Promise<Product[]> {
        this.logger.log('🔄 Recalculating products with UI overrides...');

        try {
            // 1️⃣ Fetch products (same as normal flow)
            const products = await this.prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
            });

            if (!products.length) {
                this.logger.warn('⚠️ No products found during recalculation');
                return [];
            }

            // 2️⃣ Get LIVE spot prices as base
            const liveSnapshots = await this.metalsService.getAllLatest();

            const liveSpotMap: Record<MetalType, number> =
                await this.getSimpleSpotMap(liveSnapshots);

            // 3️⃣ Merge overrides (UI has priority)
            const finalSpotMap: Record<MetalType, number> = {
                GOLD: overrides.GOLD ?? liveSpotMap.GOLD,
                SILVER: overrides.SILVER ?? liveSpotMap.SILVER,
                PLATINUM: overrides.PLATINUM ?? liveSpotMap.PLATINUM,
                PALLADIUM: overrides.PALLADIUM ?? liveSpotMap.PALLADIUM,
            };

            this.logger.debug(
                `🧠 Final spot map for recalculation: ${JSON.stringify(finalSpotMap)}`
            );

            // 4️⃣ Reuse existing mapping logic (IMPORTANT)
            const mapped = this.map(products, finalSpotMap);

            this.logger.log('✅ Recalculation completed');

            return mapped;
        } catch (error) {
            this.logger.error(
                '❌ Recalculation failed',
                error instanceof Error ? error.stack : String(error),
            );
            throw new InternalServerErrorException(
                'Failed to recalculate products',
            );
        }
    }

    async getProductsWithSpotPackage() {
        this.logger.log('getProductsWithSpotPackage= 📦getProductsWithSpotPackage: Fetching products with spot prices...');

        try {
            // 1️⃣ Get spot prices
            const spotMap = await this.metalsService.getAllLatest();

            if (!spotMap || Object.keys(spotMap).length === 0) {
                this.logger.warn('⚠️ Spot prices map is empty');
            } else {
                this.logger.debug(`✅ Spot prices loaded: ${JSON.stringify(spotMap)}`);
            }

            // 2️⃣ Get products
            const products = await this.prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
            });

            if (!products || products.length === 0) {
                this.logger.warn('⚠️ No products found in database');
            } else {
                this.logger.debug(`✅ Products fetched: count=${products.length}`);
                this.logger.debug(
                    `📦 Products list:\n` +
                    products.map(p =>
                        `[${p.id}] ${p.name} | ${p.metalType} | buy=${p.spreadBuy} sell=${p.spreadSell} stock=${p.stock}`
                    ).join('\n')
                );
            }

            // 3️⃣ Map products (pure function)
            const simpleSpotMap = await this.getSimpleSpotMap(spotMap);
            const mappedProducts = this.map(products, simpleSpotMap);

            this.logger.log('✅ Products successfully mapped with spot prices');

            // 4️⃣ Return response
            return {
                spotPrices: spotMap,
                products: mappedProducts,
            };

        } catch (error) {
            this.logger.error(
                '❌ Failed to fetch products with spot prices',
                error instanceof Error ? error.stack : String(error)
            );

            throw new InternalServerErrorException(
                'Failed to load products with spot prices'
            );
        }
    }

    private map(
        products: any[],
        spotMap: Record<MetalType, number>
    ): Product[] {

        return products.map((p) => {
            const marketPrice = Number(spotMap[p.metalType as MetalType] ?? 0);
            const spotPerGram  = marketPrice /31.1;
            const weight = Number(p.weight);
            const basePrice = spotPerGram * weight;
            const vatRate = Number(p.vatRate);

            const spreadSell = Number(p.spreadSell);
            const spreadBuy = Number(p.spreadBuy);

            const sellMultiplier = 1 + spreadSell;
            const buyMultiplier = 1 + spreadBuy;

            const priceSellVatExcl = basePrice * sellMultiplier;
            const priceSell = priceSellVatExcl * (1 + vatRate) ;
            const priceBuy = basePrice * buyMultiplier;

            this.logMap(p.name, p.metalType ,marketPrice, spotPerGram, weight, basePrice , vatRate, spreadSell, spreadBuy, sellMultiplier, buyMultiplier, priceSellVatExcl, priceSell, priceBuy)

            return {
                id: p.id,
                sku: p.sku,
                name: p.name,
                weight: this.round2(weight),
                metalType: p.metalType,
                description: p.description ?? '',

                spreadSell,
                spreadBuy,

                priceSell: this.round2(priceSell),
                priceSellVatExcl: this.round2(priceSellVatExcl),
                priceBuy: this.round2(priceBuy),

                vatRate,
                stock: p.stock,
                isActive: true,

                createdAt: p.createdAt,
                updatedAt: p.updatedAt,

                lastModified: p.updatedAt ?? p.createdAt,

                spotPrice: this.round2(marketPrice),

                totalPrice: this.round2(
                    marketPrice + Number(p.spreadSell) + Number(p.vatRate)
                ),

                buybackPrice: this.round2(
                    marketPrice - Number(p.spreadBuy)
                ),
            };
        });
    }

    private round2(value: number): number {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }

    async logMap(
        nameP: string,
        metal: string,
        marketPrice: number,
        spotPerGram: number,
        weight: number,
        basePrice: number,
        vatRate: number,
        spreadSell: number,
        spreadBuy: number,
        sellMultiplier: number,
        buyMultiplier: number,
        priceSellVatExcl: number,
        priceSell: number,
        priceBuy: number){
        // 🔍 DEBUG LOG PER PRODUCT
        this.logger.debug(
            `📊 Product calc [name]
            name=${nameP}
            metal=${metal}
            spot=${marketPrice}
            spot/gram=${spotPerGram}
            weight=${weight}
            base=${basePrice}
            vatRate=${vatRate}

            spreadSell=${spreadSell}% => sellMultiplier=${sellMultiplier}
            spreadBuy=${spreadBuy}% => buyMultiplier=${buyMultiplier}

            priceSellVatExcl=${priceSellVatExcl}
            priceSell=${priceSell}
            priceBuy=${priceBuy}
        `.replace(/\s+/g, ' ').trim()
        );
    }

    async getAll(): Promise<Product[]> {
        // 1️⃣ Get spot prices from MetalsService (clean)
        const spotMap = await this.metalsService.getAllLatest();

        const products = await this.prisma.product.findMany({
            orderBy: {createdAt: 'desc'},
        });
        if (!products || products.length === 0) {
            throw new NotFoundException('No products found in database');
        } else {
            this.logger.debug(`getAll= ✅ Products fetched: count=${products.length}`);
            this.logger.debug(
                `📦 Products list:\n` +
                products.map(p =>
                    `[${p.id}] ${p.name} | ${p.metalType} | buy=${p.spreadBuy} sell=${p.spreadSell} stock=${p.stock}`
                ).join('\n')
            );
        }

        const simpleSpotMap = await this.getSimpleSpotMap(spotMap);

        return this.map(products, simpleSpotMap); // ✅ Return the mapped array
    }

    async getSimpleSpotMap(
        snapshots: SpotPrice[]
    ): Promise<Record<MetalType, number>> {
        // Initialize all metals with 0
        const result: Record<MetalType, number> = {
            GOLD: 0,
            SILVER: 0,
            PLATINUM: 0,
            PALLADIUM: 0,
        };

        // Fill in values from snapshots
        snapshots.forEach(snapshot => {
            result[snapshot.metalType] = snapshot.currentPrice;
        });

        return result;
    }

    async getProductsForMetal(
        metal: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM'
    ): Promise<Product[]> {
        // 1️⃣ Get spot prices from MetalsService (clean)
        const spotMap = await this.metalsService.getAllLatest();

        const products = await this.prisma.product.findMany({
            where: {metalType: metal},
        });

        if (!products || products.length === 0) {
            throw new NotFoundException('No products found in database');
        }

        const simpleSpotMap = await this.getSimpleSpotMap(spotMap);

        return this.map(products, simpleSpotMap); // ✅ Return the mapped array
    }

    async getById(id: number, metal: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM') {
        const p = await this.prisma.product.findUnique({where: {id}});
        if (!p) throw new NotFoundException('Product not found');


        return {
            id: p.id,
            sku: p.sku,
            name: p.name,
            metalType: p.metalType,
            weight: Number(p.weight),
            description: p.description ?? '',
            spreadSell: Number(p.spreadSell),
            spreadBuy: Number(p.spreadBuy),
            priceSell: Number(p.spreadSell),
            priceSellVatExcl: Number(p.spreadSell),
            priceBuy: Number(p.spreadBuy),
            vatRate: Number(p.vatRate),
            stock: p.stock,
            isActive: true,
            spotPrice: 0,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
        };
    }

    // Create product with unique SKU (case-insensitive)
    async create(data: CreateProductDto) {
        const existing = await this.prisma.product.findFirst({
            where: {sku: {equals: data.sku, mode: 'insensitive'}},
        });

        if (existing) {
            throw new ConflictException('Product already exists.');
        }

        return this.prisma.product.create({
            data: {
                sku: data.sku,
                name: data.name,
                metalType: data.metalType,

                weight: data.weight,

                spreadSell: data.spreadSell,
                spreadBuy: data.spreadBuy,
                vatRate: data.vatRate,
                stock: data.stock,

                description: data.description,
            },
        });
    }

    // Check if product exists by sku (case-insensitive)
    async existsBySku(sku: string) {
        const existing = await this.prisma.product.findFirst({
            where: {
                sku: {
                    equals: sku,
                    mode: 'insensitive',
                },
            },
            select: {id: true},
        });

        return existing ?? null;
    }

    // Update product
    async update(id: number, data: Partial<CreateProductDto>) {
        const existing = await this.prisma.product.findUnique({
            where: {id},
        });

        if (!existing) {
            throw new NotFoundException('Product not found');
        }

        return this.prisma.product.update({
            where: {id},
            data: {
                sku: data.sku,
                weight: data.weight,
                spreadSell: data.spreadSell,
                spreadBuy: data.spreadBuy,
                description: data.description,
            },
        });
    }

    // Delete product (hard delete — since no soft delete fields exist)
    async delete(id: number) {
        const existing = await this.prisma.product.findUnique({
            where: {id},
        });

        if (!existing) {
            throw new NotFoundException('Product not found');
        }

        return this.prisma.product.delete({
            where: {id},
        });
    }

    updateStock(id: number, stock_quantity: number) {
        return this.prisma.product.update({
            where: {id},
            data: {stock: stock_quantity},
        });
    }*/

}