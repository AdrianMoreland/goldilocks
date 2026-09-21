import { MetalType } from "../../../prisma/generated/enums";
import { Product } from "@goldilocks/shared-types";
import { CreateProductDto, UpdateProductDto } from "../../common/dto/dtos";
import { ProductsProvider } from './products.provider';
export declare class ProductsService {
    private readonly productsProvider;
    private readonly logger;
    constructor(productsProvider: ProductsProvider);
    getProducts(spotMap?: Record<MetalType, number>): Promise<Product[]>;
    getRawProducts(): Promise<{
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
    }[]>;
    getById(id: number, spotMap?: Record<MetalType, number>): Promise<Product>;
    create(dto: CreateProductDto): Promise<{
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
    update(id: number, dto: Partial<UpdateProductDto>): Promise<{
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
    updateStock(id: number, stockQuantity: number): Promise<{
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
}
//# sourceMappingURL=products.service.d.ts.map