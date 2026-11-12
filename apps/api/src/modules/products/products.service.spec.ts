import { ProductsService } from './products.service';

const raw = (id: number, isActive: boolean) => ({ id, isActive });

describe('ProductsService inactive products', () => {
    const provider = {
        getAll: jest.fn().mockResolvedValue([raw(1, true), raw(2, false)]),
    };
    const service = new ProductsService(provider as never);

    it('leaves inactive products out of the list every price view reads', async () => {
        expect((await service.getRawProducts()).map((p) => p.id)).toEqual([1]);
    });

    it('still gives the admin views every live product', async () => {
        expect(
            (await service.getRawProductsIncludingInactive()).map((p) => p.id),
        ).toEqual([1, 2]);
    });
});
