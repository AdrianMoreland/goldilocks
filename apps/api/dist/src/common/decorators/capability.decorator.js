"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiresCapability = exports.CAPABILITY_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.CAPABILITY_KEY = 'requiredCapability';
const RequiresCapability = (capability) => (0, common_1.SetMetadata)(exports.CAPABILITY_KEY, capability);
exports.RequiresCapability = RequiresCapability;
//# sourceMappingURL=capability.decorator.js.map