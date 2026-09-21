"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRoleAndMicroservice = exports.Public = exports.Admin = exports.Role = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const roles_enum_1 = __importDefault(require("./roles.enum"));
exports.ROLES_KEY = "roles";
const Role = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Role = Role;
const Admin = () => (0, exports.Role)(roles_enum_1.default.Admin);
exports.Admin = Admin;
const Public = () => (0, exports.Role)(roles_enum_1.default.Anonymous);
exports.Public = Public;
const DefaultRoleAndMicroservice = () => (0, exports.Role)(roles_enum_1.default.Default, roles_enum_1.default.Microservice);
exports.DefaultRoleAndMicroservice = DefaultRoleAndMicroservice;
//# sourceMappingURL=roles.decorators.js.map