import { ProductsService } from './products.service';
import { type RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto, UpdateStockRequestDto } from '../../common/dto/dtos';
import { RawProduct } from '@goldilocks/shared-types';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    getAll(): Promise<RawProduct[]>;
    getById(id: number): Promise<RawProduct>;
    createProduct(body: CreateProductDto, req: RequestWithUser): Promise<{
        id: number;
        sku: string;
        name: string;
        metalType: "GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM";
        weight: number;
        spreadBuy: number;
        spreadSell: number;
        vatRate: number;
        stock: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        category?: "BAR" | "COIN" | null | undefined;
        description?: string | null | undefined;
    }>;
    updateProduct(id: number, body: UpdateProductDto, req: RequestWithUser): Promise<{
        id: number;
        sku: string;
        name: string;
        metalType: "GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM";
        weight: number;
        spreadBuy: number;
        spreadSell: number;
        vatRate: number;
        stock: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        category?: "BAR" | "COIN" | null | undefined;
        description?: string | null | undefined;
    }>;
    updateStock(id: number, body: UpdateStockRequestDto, req: RequestWithUser): Promise<{
        id: number;
        sku: string;
        name: string;
        metalType: "GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM";
        weight: number;
        spreadBuy: number;
        spreadSell: number;
        vatRate: number;
        stock: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        category?: "BAR" | "COIN" | null | undefined;
        description?: string | null | undefined;
    }>;
    getInactive(): Promise<RawProduct[]>;
    getDeleted(): Promise<({
        id: number;
        sku: string;
        name: string;
        metalType: "GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM";
        weight: number;
        spreadBuy: number;
        spreadSell: number;
        vatRate: number;
        stock: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        category?: "BAR" | "COIN" | null | undefined;
        description?: string | null | undefined;
    } & {
        deletedAt: string;
    })[]>;
    restore(id: number, req: RequestWithUser): Promise<{
        id: number;
        sku: string;
        name: string;
        metalType: "GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM";
        weight: number;
        spreadBuy: number;
        spreadSell: number;
        vatRate: number;
        stock: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        category?: "BAR" | "COIN" | null | undefined;
        description?: string | null | undefined;
    }>;
    delete(id: number, req: RequestWithUser): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=products.controller.d.ts.map