"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_provider_1 = require("./products.provider");
const pricing_util_1 = require("../../common/utils/pricing.util");
let ProductsService = ProductsService_1 = class ProductsService {
    productsProvider;
    logger = new common_1.Logger(ProductsService_1.name);
    constructor(productsProvider) {
        this.productsProvider = productsProvider;
    }
    async getProducts(spotMap = pricing_util_1.ZERO_SPOT_MAP) {
        const rawProducts = await this.productsProvider.getAll();
        return rawProducts.map((p) => (0, pricing_util_1.calculateProductPrice)(p, spotMap));
    }
    async getRawProducts() {
        return this.productsProvider.getAll();
    }
    async getById(id, spotMap = pricing_util_1.ZERO_SPOT_MAP) {
        const raw = await this.productsProvider.getById(id);
        if (!raw) {
            throw new common_1.NotFoundException('Product not found');
        }
        return (0, pricing_util_1.calculateProductPrice)(raw, spotMap);
    }
    async create(dto) {
        const existing = await this.productsProvider.findBySku(dto.sku);
        if (existing) {
            throw new common_1.ConflictException('Product already exists.');
        }
        return this.productsProvider.create(dto);
    }
    async update(id, dto) {
        const existing = await this.productsProvider.getById(id);
        if (!existing) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.productsProvider.update(id, dto);
    }
    async delete(id) {
        const existing = await this.productsProvider.getById(id);
        if (!existing) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.productsProvider.delete(id);
    }
    async updateStock(id, stockQuantity) {
        return this.productsProvider.updateStock(id, stockQuantity);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_provider_1.ProductsProvider])
], ProductsService);
//# sourceMappingURL=products.service.js.map