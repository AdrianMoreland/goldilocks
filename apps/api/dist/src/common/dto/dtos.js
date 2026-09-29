"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientErrorReportBatchDto = exports.FetchMetricsResponseDto = exports.FetchAttemptResponseDto = exports.CreateBranchRequestDto = exports.BranchResponseDto = exports.PortfolioBuildResponseDto = exports.PortfolioBuildRequestDto = exports.ProfitAnalysisResponseDto = exports.ProfitAnalysisRequestDto = exports.MeltCalculatorResponseDto = exports.MeltCalculatorRequestDto = exports.TradeCartResponseDto = exports.TradeCartRequestDto = exports.TradeBootstrapResponseDto = exports.MarketDataResponseDto = exports.UpdateProductDto = exports.ProductResponseDto = exports.CreateProductDto = exports.CreateSpotPriceDto = exports.SpotPriceResponseDto = exports.RawSpotPriceResponseDto = exports.HealthCheckDto = exports.MessageResponseDto = exports.CreateUserRequestDto = exports.SessionUserDto = exports.LoginResponseDto = exports.LoginRequestDto = void 0;
const shared_types_1 = require("@goldilocks/shared-types");
const shared_types_2 = require("@goldilocks/shared-types");
const dto_generator_1 = require("./dto-generator");
class LoginRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.LoginRequestSchema, 'LoginRequestDto') {
}
exports.LoginRequestDto = LoginRequestDto;
class LoginResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.LoginResponseSchema, 'LoginResponseDto') {
}
exports.LoginResponseDto = LoginResponseDto;
class SessionUserDto extends (0, dto_generator_1.createDto)(shared_types_1.SessionUserSchema, 'SessionUserDto') {
}
exports.SessionUserDto = SessionUserDto;
class CreateUserRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.CreateUserRequestSchema, 'CreateUserRequestDto') {
}
exports.CreateUserRequestDto = CreateUserRequestDto;
class MessageResponseDto extends (0, dto_generator_1.createDto)((0, shared_types_2.ApiSuccessResponseSchema)(shared_types_1.MessageResponseSchema), 'MessageResponseDto') {
}
exports.MessageResponseDto = MessageResponseDto;
class HealthCheckDto extends (0, dto_generator_1.createDto)(shared_types_2.HealthCheckSchema, 'HealthCheckDto') {
}
exports.HealthCheckDto = HealthCheckDto;
class RawSpotPriceResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.RawSpotPriceSchema, 'RawSpotPriceResponseDto') {
}
exports.RawSpotPriceResponseDto = RawSpotPriceResponseDto;
class SpotPriceResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.SpotPriceSchema, 'SpotPriceResponseDto') {
}
exports.SpotPriceResponseDto = SpotPriceResponseDto;
class CreateSpotPriceDto extends (0, dto_generator_1.createDto)(shared_types_2.CreateSpotPriceDtoSchema, 'CreateSpotPriceDto') {
}
exports.CreateSpotPriceDto = CreateSpotPriceDto;
class CreateProductDto extends (0, dto_generator_1.createDto)(shared_types_2.CreateProductDtoSchema, 'CreateProductDto') {
}
exports.CreateProductDto = CreateProductDto;
class ProductResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.ProductSchema, 'ProductResponseDto') {
}
exports.ProductResponseDto = ProductResponseDto;
class UpdateProductDto extends (0, dto_generator_1.createDto)(shared_types_2.UpdateProductFullDtoSchema, 'UpdateProductDto') {
}
exports.UpdateProductDto = UpdateProductDto;
class MarketDataResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.MarketDataResponseSchema, 'MarketDataResponseDto') {
}
exports.MarketDataResponseDto = MarketDataResponseDto;
class TradeBootstrapResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.TradeBootstrapResponseSchema, 'TradeBootstrapResponseDto') {
}
exports.TradeBootstrapResponseDto = TradeBootstrapResponseDto;
class TradeCartRequestDto extends (0, dto_generator_1.createDto)(shared_types_2.TradeCartRequestSchema, 'TradeCartRequestDto') {
}
exports.TradeCartRequestDto = TradeCartRequestDto;
class TradeCartResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.TradeCartResponseSchema, 'TradeCartResponseDto') {
}
exports.TradeCartResponseDto = TradeCartResponseDto;
class MeltCalculatorRequestDto extends (0, dto_generator_1.createDto)(shared_types_2.MeltCalculatorRequestSchema, 'MeltCalculatorRequestDto') {
}
exports.MeltCalculatorRequestDto = MeltCalculatorRequestDto;
class MeltCalculatorResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.MeltCalculatorResponseSchema, 'MeltCalculatorResponseDto') {
}
exports.MeltCalculatorResponseDto = MeltCalculatorResponseDto;
class ProfitAnalysisRequestDto extends (0, dto_generator_1.createDto)(shared_types_2.ProfitAnalysisRequestSchema, 'ProfitAnalysisRequestDto') {
}
exports.ProfitAnalysisRequestDto = ProfitAnalysisRequestDto;
class ProfitAnalysisResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.ProfitAnalysisResponseSchema, 'ProfitAnalysisResponseDto') {
}
exports.ProfitAnalysisResponseDto = ProfitAnalysisResponseDto;
class PortfolioBuildRequestDto extends (0, dto_generator_1.createDto)(shared_types_2.PortfolioBuildRequestSchema, 'PortfolioBuildRequestDto') {
}
exports.PortfolioBuildRequestDto = PortfolioBuildRequestDto;
class PortfolioBuildResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.PortfolioBuildResponseSchema, 'PortfolioBuildResponseDto') {
}
exports.PortfolioBuildResponseDto = PortfolioBuildResponseDto;
class BranchResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.BranchSchema, 'BranchResponseDto') {
}
exports.BranchResponseDto = BranchResponseDto;
class CreateBranchRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.CreateBranchRequestSchema, 'CreateBranchRequestDto') {
}
exports.CreateBranchRequestDto = CreateBranchRequestDto;
class FetchAttemptResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.FetchAttemptSchema, 'FetchAttemptResponseDto') {
}
exports.FetchAttemptResponseDto = FetchAttemptResponseDto;
class FetchMetricsResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.FetchMetricsSchema, 'FetchMetricsResponseDto') {
}
exports.FetchMetricsResponseDto = FetchMetricsResponseDto;
class ClientErrorReportBatchDto extends (0, dto_generator_1.createDto)(shared_types_1.ClientErrorReportBatchSchema, 'ClientErrorReportBatchDto') {
}
exports.ClientErrorReportBatchDto = ClientErrorReportBatchDto;
//# sourceMappingURL=dtos.js.map