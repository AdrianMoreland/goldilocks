import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { PermissionKey } from '@goldilocks/shared-types';
import { RequiresPermission } from '../decorators/permission.decorator';
import { PermissionGuard } from './permission.guard';

@RequiresPermission('analytics.ops')
class OpsController {
    summary() {
        return [];
    }
}

class MixedController {
    open() {
        return [];
    }

    @RequiresPermission('analytics.pricing')
    pricing() {
        return [];
    }
}

function contextFor(
    controller: new () => object,
    method: string,
    user: { id: string } | undefined,
): ExecutionContext {
    return {
        getClass: () => controller,
        getHandler: () =>
            (controller.prototype as Record<string, () => unknown>)[method],
        switchToHttp: () => ({ getRequest: () => ({ user }) }),
    } as unknown as ExecutionContext;
}

function guardHolding(held: PermissionKey[]) {
    const permissions = { forUser: jest.fn().mockResolvedValue(held) };
    return {
        guard: new PermissionGuard(new Reflector(), permissions as never),
        permissions,
    };
}

describe('PermissionGuard', () => {
    it('lets a route without @RequiresPermission through without looking anything up', async () => {
        const { guard, permissions } = guardHolding([]);
        await expect(
            guard.canActivate(
                contextFor(MixedController, 'open', { id: 'u1' }),
            ),
        ).resolves.toBe(true);
        expect(permissions.forUser).not.toHaveBeenCalled();
    });

    it('allows a person who holds the permission on the handler', async () => {
        const { guard } = guardHolding(['analytics.pricing']);
        await expect(
            guard.canActivate(
                contextFor(MixedController, 'pricing', { id: 'u1' }),
            ),
        ).resolves.toBe(true);
    });

    it('refuses a person without it, with the generic message', async () => {
        const { guard } = guardHolding(['analytics.pricing']);
        await expect(
            guard.canActivate(
                contextFor(OpsController, 'summary', { id: 'u1' }),
            ),
        ).rejects.toThrow(new ForbiddenException('Insufficient permissions'));
    });

    it('applies a class-level permission to every route in the controller', async () => {
        const { guard } = guardHolding(['analytics.ops']);
        await expect(
            guard.canActivate(
                contextFor(OpsController, 'summary', { id: 'u1' }),
            ),
        ).resolves.toBe(true);
    });

    it('fails closed when there is no signed-in user', async () => {
        const { guard } = guardHolding(['analytics.ops']);
        await expect(
            guard.canActivate(contextFor(OpsController, 'summary', undefined)),
        ).rejects.toThrow(ForbiddenException);
    });
});
