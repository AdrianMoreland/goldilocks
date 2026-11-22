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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapQueueTokenController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const dtos_1 = require("../../common/dto/dtos");
const roadmap_queue_service_1 = require("./roadmap-queue.service");
const roadmap_token_1 = require("./roadmap-token");
const roadmap_writer_1 = require("./roadmap-writer");
const HEADER = 'x-roadmap-token';
let RoadmapQueueTokenController = class RoadmapQueueTokenController {
    config;
    queue;
    writer;
    constructor(config, queue, writer) {
        this.config = config;
        this.queue = queue;
        this.writer = writer;
    }
    require(variable, given) {
        if (!(0, roadmap_token_1.isValidToken)(this.config.get(variable), given)) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    intake(token, body) {
        this.require('ROADMAP_INTAKE_TOKEN', token);
        return this.writer.append({ text: body.text, source: 'phone' });
    }
    pending(token) {
        this.require('ROADMAP_DRAIN_TOKEN', token);
        return this.queue.pending();
    }
    filed(token, body) {
        this.require('ROADMAP_DRAIN_TOKEN', token);
        return this.queue.markFiled(body.ids, 'laptop');
    }
};
exports.RoadmapQueueTokenController = RoadmapQueueTokenController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('intake'),
    (0, common_1.HttpCode)(201),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60_000 } }),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Headers)(HEADER)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.RoadmapQueueRequestDto]),
    __metadata("design:returntype", void 0)
], RoadmapQueueTokenController.prototype, "intake", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('pending'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60_000 } }),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Headers)(HEADER)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoadmapQueueTokenController.prototype, "pending", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('filed'),
    (0, common_1.HttpCode)(200),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60_000 } }),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Headers)(HEADER)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.RoadmapQueueFiledRequestDto]),
    __metadata("design:returntype", void 0)
], RoadmapQueueTokenController.prototype, "filed", null);
exports.RoadmapQueueTokenController = RoadmapQueueTokenController = __decorate([
    (0, swagger_1.ApiTags)('roadmap'),
    (0, common_1.Controller)('roadmap/queue'),
    __param(2, (0, common_1.Inject)(roadmap_writer_1.ROADMAP_WRITER)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        roadmap_queue_service_1.RoadmapQueueService, Object])
], RoadmapQueueTokenController);
//# sourceMappingURL=roadmap-queue-token.controller.js.map