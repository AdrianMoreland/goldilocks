import RoleEnum from "./roles.enum";
export declare const ROLES_KEY = "roles";
export declare const Role: (...roles: RoleEnum[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const Admin: () => import("@nestjs/common").CustomDecorator<string>;
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const DefaultRoleAndMicroservice: () => import("@nestjs/common").CustomDecorator<string>;
//# sourceMappingURL=roles.decorators.d.ts.map