"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const prismaNamespace_1 = require("../../../prisma/generated/internal/prismaNamespace");
let PrismaExceptionFilter = class PrismaExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        switch (exception.code) {
            case 'P2002': {
                const target = Array.isArray(exception.meta?.target) ? exception.meta.target.join(', ') : 'field';
                response.status(409).json({
                    statusCode: 409,
                    message: `A record with this ${target} already exists.`,
                });
                return;
            }
            case 'P2025':
                response.status(404).json({
                    statusCode: 404,
                    message: 'Record not found.',
                });
                return;
            default:
                response.status(500).json({
                    statusCode: 500,
                    message: 'Unexpected database error.',
                });
        }
    }
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = __decorate([
    (0, common_1.Catch)(prismaNamespace_1.PrismaClientKnownRequestError)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map