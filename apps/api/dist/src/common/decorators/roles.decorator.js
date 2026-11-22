"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnySignedInUser = exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
const AnySignedInUser = () => (0, common_1.SetMetadata)('roles', []);
exports.AnySignedInUser = AnySignedInUser;
//# sourceMappingURL=roles.decorator.js.map