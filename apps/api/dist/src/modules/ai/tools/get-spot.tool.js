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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSpotTool = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const shared_types_1 = require("@goldilocks/shared-types");
const market_data_service_1 = require("../../market-data/market-data.service");
const spot_description_1 = require("./spot-description");
const schema = zod_1.z.object({
    metal: shared_types_1.MetalTypeEnum.describe('The metal to read the spot price of.'),
});
let GetSpotTool = class GetSpotTool {
    marketData;
    name = 'getSpot';
    description = 'Current spot price of one metal in EUR per troy ounce, as the dashboard is quoting it right now, with the time it was taken and whether it may be out of date. Use it when asked what gold, silver, platinum or palladium is trading at. Never state a spot price from memory.';
    schema = schema;
    constructor(marketData) {
        this.marketData = marketData;
    }
    async run(args, context) {
        const { spots } = await this.marketData.getPricedCatalogue(context.spotOverrides);
        const spot = spots.find((s) => s.metalType === args.metal);
        return spot
            ? (0, spot_description_1.describeSpot)(spot, context.now)
            : { metal: args.metal, available: false };
    }
};
exports.GetSpotTool = GetSpotTool;
exports.GetSpotTool = GetSpotTool = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [market_data_service_1.MarketDataService])
], GetSpotTool);
//# sourceMappingURL=get-spot.tool.js.map