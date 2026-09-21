import { ProductsService } from './products.service';
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "../../common/dto/dtos";
import { RawProduct } from "@goldilocks/shared-types";
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    getAll(): Promise<RawProduct[]>;
    getById(id: number, metal: any): Promise<ProductResponseDto>;
    createProduct(body: CreateProductDto): Promise<{
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
        description?: string | null | undefined;
    }>;
    updateProduct(id: number, body: UpdateProductDto): Promise<{
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
        description?: string | null | undefined;
    }>;
    updateStock(id: number, body: {
        stock_quantity: number;
    }): Promise<{
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
        description?: string | null | undefined;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=products.controller.d.ts.map