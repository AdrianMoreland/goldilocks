"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDto = createDto;
const nestjs_zod_1 = require("nestjs-zod");
function createDto(schema, className) {
    const DtoClass = (0, nestjs_zod_1.createZodDto)(schema);
    Object.defineProperty(DtoClass, 'name', { value: className });
    return DtoClass;
}
//# sourceMappingURL=dto-generator.js.map