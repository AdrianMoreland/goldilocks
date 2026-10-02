import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';

@Roles('admin')
class AdminOnlyController {
    // Inherits the class-level role.
    list() {
        return [];
    }
}

class AdminOrManagerController {
    @Roles('admin', 'manager')
    set() {
        return [];
    }
}

class MixedController {
    open() {
        return [];
    }

    @Roles('admin')
    restricted() {
        return [];
    }
}

function contextFor(
    controller: new () => object,
    method: string,
    user: { admin: boolean; role?: string } | undefined,
): ExecutionContext {
    return {
        getClass: () => controller,
        getHandler: () =>
            (controller.prototype as Record<string, () => unknown>)[method],
        switchToHttp: () => ({ getRequest: () => ({ user }) }),
    } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
    const guard = new RolesGuard(new Reflector());

    it('enforces a role declared on the whole controller', () => {
        expect(() =>
            guard.canActivate(
                contextFor(AdminOnlyController, 'list', { admin: false }),
            ),
        ).toThrow(ForbiddenException);
        expect(
            guard.canActivate(
                contextFor(AdminOnlyController, 'list', { admin: true }),
            ),
        ).toBe(true);
    });

    it('enforces a role declared on one handler, and leaves the others open', () => {
        expect(() =>
            guard.canActivate(
                contextFor(MixedController, 'restricted', { admin: false }),
            ),
        ).toThrow(ForbiddenException);
        expect(
            guard.canActivate(
                contextFor(MixedController, 'restricted', { admin: true }),
            ),
        ).toBe(true);
        expect(
            guard.canActivate(
                contextFor(MixedController, 'open', { admin: false }),
            ),
        ).toBe(true);
    });

    it("lets a manager or an admin through a route listing 'manager', and refuses everyone else", () => {
        const run = (user: { admin: boolean; role?: string }) =>
            guard.canActivate(
                contextFor(AdminOrManagerController, 'set', user),
            );

        expect(run({ admin: false, role: 'MANAGER' })).toBe(true);
        expect(run({ admin: true, role: 'ADMIN' })).toBe(true);
        expect(() => run({ admin: false, role: 'SALES' })).toThrow(
            ForbiddenException,
        );
    });

    it('does not let a manager into an admin-only route', () => {
        expect(() =>
            guard.canActivate(
                contextFor(AdminOnlyController, 'list', {
                    admin: false,
                    role: 'MANAGER',
                }),
            ),
        ).toThrow(ForbiddenException);
    });

    it('refuses when there is no user on the request', () => {
        expect(() =>
            guard.canActivate(
                contextFor(AdminOnlyController, 'list', undefined),
            ),
        ).toThrow(ForbiddenException);
    });
});
