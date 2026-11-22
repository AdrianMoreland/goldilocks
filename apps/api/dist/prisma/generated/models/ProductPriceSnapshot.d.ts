import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ProductPriceSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$ProductPriceSnapshotPayload>;
export type AggregateProductPriceSnapshot = {
    _count: ProductPriceSnapshotCountAggregateOutputType | null;
    _avg: ProductPriceSnapshotAvgAggregateOutputType | null;
    _sum: ProductPriceSnapshotSumAggregateOutputType | null;
    _min: ProductPriceSnapshotMinAggregateOutputType | null;
    _max: ProductPriceSnapshotMaxAggregateOutputType | null;
};
export type ProductPriceSnapshotAvgAggregateOutputType = {
    id: number | null;
    productId: number | null;
    spotEur: runtime.Decimal | null;
    spreadSell: runtime.Decimal | null;
    spreadBuy: runtime.Decimal | null;
    sellPriceEur: runtime.Decimal | null;
    buyPriceEur: runtime.Decimal | null;
};
export type ProductPriceSnapshotSumAggregateOutputType = {
    id: bigint | null;
    productId: number | null;
    spotEur: runtime.Decimal | null;
    spreadSell: runtime.Decimal | null;
    spreadBuy: runtime.Decimal | null;
    sellPriceEur: runtime.Decimal | null;
    buyPriceEur: runtime.Decimal | null;
};
export type ProductPriceSnapshotMinAggregateOutputType = {
    id: bigint | null;
    day: Date | null;
    productId: number | null;
    metalType: $Enums.MetalType | null;
    spotEur: runtime.Decimal | null;
    spreadSell: runtime.Decimal | null;
    spreadBuy: runtime.Decimal | null;
    sellPriceEur: runtime.Decimal | null;
    buyPriceEur: runtime.Decimal | null;
    createdAt: Date | null;
};
export type ProductPriceSnapshotMaxAggregateOutputType = {
    id: bigint | null;
    day: Date | null;
    productId: number | null;
    metalType: $Enums.MetalType | null;
    spotEur: runtime.Decimal | null;
    spreadSell: runtime.Decimal | null;
    spreadBuy: runtime.Decimal | null;
    sellPriceEur: runtime.Decimal | null;
    buyPriceEur: runtime.Decimal | null;
    createdAt: Date | null;
};
export type ProductPriceSnapshotCountAggregateOutputType = {
    id: number;
    day: number;
    productId: number;
    metalType: number;
    spotEur: number;
    spreadSell: number;
    spreadBuy: number;
    sellPriceEur: number;
    buyPriceEur: number;
    createdAt: number;
    _all: number;
};
export type ProductPriceSnapshotAvgAggregateInputType = {
    id?: true;
    productId?: true;
    spotEur?: true;
    spreadSell?: true;
    spreadBuy?: true;
    sellPriceEur?: true;
    buyPriceEur?: true;
};
export type ProductPriceSnapshotSumAggregateInputType = {
    id?: true;
    productId?: true;
    spotEur?: true;
    spreadSell?: true;
    spreadBuy?: true;
    sellPriceEur?: true;
    buyPriceEur?: true;
};
export type ProductPriceSnapshotMinAggregateInputType = {
    id?: true;
    day?: true;
    productId?: true;
    metalType?: true;
    spotEur?: true;
    spreadSell?: true;
    spreadBuy?: true;
    sellPriceEur?: true;
    buyPriceEur?: true;
    createdAt?: true;
};
export type ProductPriceSnapshotMaxAggregateInputType = {
    id?: true;
    day?: true;
    productId?: true;
    metalType?: true;
    spotEur?: true;
    spreadSell?: true;
    spreadBuy?: true;
    sellPriceEur?: true;
    buyPriceEur?: true;
    createdAt?: true;
};
export type ProductPriceSnapshotCountAggregateInputType = {
    id?: true;
    day?: true;
    productId?: true;
    metalType?: true;
    spotEur?: true;
    spreadSell?: true;
    spreadBuy?: true;
    sellPriceEur?: true;
    buyPriceEur?: true;
    createdAt?: true;
    _all?: true;
};
export type ProductPriceSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductPriceSnapshotWhereInput;
    orderBy?: Prisma.ProductPriceSnapshotOrderByWithRelationInput | Prisma.ProductPriceSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.ProductPriceSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProductPriceSnapshotCountAggregateInputType;
    _avg?: ProductPriceSnapshotAvgAggregateInputType;
    _sum?: ProductPriceSnapshotSumAggregateInputType;
    _min?: ProductPriceSnapshotMinAggregateInputType;
    _max?: ProductPriceSnapshotMaxAggregateInputType;
};
export type GetProductPriceSnapshotAggregateType<T extends ProductPriceSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateProductPriceSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProductPriceSnapshot[P]> : Prisma.GetScalarType<T[P], AggregateProductPriceSnapshot[P]>;
};
export type ProductPriceSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductPriceSnapshotWhereInput;
    orderBy?: Prisma.ProductPriceSnapshotOrderByWithAggregationInput | Prisma.ProductPriceSnapshotOrderByWithAggregationInput[];
    by: Prisma.ProductPriceSnapshotScalarFieldEnum[] | Prisma.ProductPriceSnapshotScalarFieldEnum;
    having?: Prisma.ProductPriceSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductPriceSnapshotCountAggregateInputType | true;
    _avg?: ProductPriceSnapshotAvgAggregateInputType;
    _sum?: ProductPriceSnapshotSumAggregateInputType;
    _min?: ProductPriceSnapshotMinAggregateInputType;
    _max?: ProductPriceSnapshotMaxAggregateInputType;
};
export type ProductPriceSnapshotGroupByOutputType = {
    id: bigint;
    day: Date;
    productId: number;
    metalType: $Enums.MetalType;
    spotEur: runtime.Decimal;
    spreadSell: runtime.Decimal;
    spreadBuy: runtime.Decimal;
    sellPriceEur: runtime.Decimal;
    buyPriceEur: runtime.Decimal;
    createdAt: Date;
    _count: ProductPriceSnapshotCountAggregateOutputType | null;
    _avg: ProductPriceSnapshotAvgAggregateOutputType | null;
    _sum: ProductPriceSnapshotSumAggregateOutputType | null;
    _min: ProductPriceSnapshotMinAggregateOutputType | null;
    _max: ProductPriceSnapshotMaxAggregateOutputType | null;
};
export type GetProductPriceSnapshotGroupByPayload<T extends ProductPriceSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProductPriceSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProductPriceSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProductPriceSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProductPriceSnapshotGroupByOutputType[P]>;
}>>;
export type ProductPriceSnapshotWhereInput = {
    AND?: Prisma.ProductPriceSnapshotWhereInput | Prisma.ProductPriceSnapshotWhereInput[];
    OR?: Prisma.ProductPriceSnapshotWhereInput[];
    NOT?: Prisma.ProductPriceSnapshotWhereInput | Prisma.ProductPriceSnapshotWhereInput[];
    id?: Prisma.BigIntFilter<"ProductPriceSnapshot"> | bigint | number;
    day?: Prisma.DateTimeFilter<"ProductPriceSnapshot"> | Date | string;
    productId?: Prisma.IntFilter<"ProductPriceSnapshot"> | number;
    metalType?: Prisma.EnumMetalTypeFilter<"ProductPriceSnapshot"> | $Enums.MetalType;
    spotEur?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"ProductPriceSnapshot"> | Date | string;
};
export type ProductPriceSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    day?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    spotEur?: Prisma.SortOrder;
    spreadSell?: Prisma.SortOrder;
    spreadBuy?: Prisma.SortOrder;
    sellPriceEur?: Prisma.SortOrder;
    buyPriceEur?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProductPriceSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    productId_day?: Prisma.ProductPriceSnapshotProductIdDayCompoundUniqueInput;
    AND?: Prisma.ProductPriceSnapshotWhereInput | Prisma.ProductPriceSnapshotWhereInput[];
    OR?: Prisma.ProductPriceSnapshotWhereInput[];
    NOT?: Prisma.ProductPriceSnapshotWhereInput | Prisma.ProductPriceSnapshotWhereInput[];
    day?: Prisma.DateTimeFilter<"ProductPriceSnapshot"> | Date | string;
    productId?: Prisma.IntFilter<"ProductPriceSnapshot"> | number;
    metalType?: Prisma.EnumMetalTypeFilter<"ProductPriceSnapshot"> | $Enums.MetalType;
    spotEur?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur?: Prisma.DecimalFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"ProductPriceSnapshot"> | Date | string;
}, "id" | "productId_day">;
export type ProductPriceSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    day?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    spotEur?: Prisma.SortOrder;
    spreadSell?: Prisma.SortOrder;
    spreadBuy?: Prisma.SortOrder;
    sellPriceEur?: Prisma.SortOrder;
    buyPriceEur?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ProductPriceSnapshotCountOrderByAggregateInput;
    _avg?: Prisma.ProductPriceSnapshotAvgOrderByAggregateInput;
    _max?: Prisma.ProductPriceSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.ProductPriceSnapshotMinOrderByAggregateInput;
    _sum?: Prisma.ProductPriceSnapshotSumOrderByAggregateInput;
};
export type ProductPriceSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProductPriceSnapshotScalarWhereWithAggregatesInput | Prisma.ProductPriceSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProductPriceSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProductPriceSnapshotScalarWhereWithAggregatesInput | Prisma.ProductPriceSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"ProductPriceSnapshot"> | bigint | number;
    day?: Prisma.DateTimeWithAggregatesFilter<"ProductPriceSnapshot"> | Date | string;
    productId?: Prisma.IntWithAggregatesFilter<"ProductPriceSnapshot"> | number;
    metalType?: Prisma.EnumMetalTypeWithAggregatesFilter<"ProductPriceSnapshot"> | $Enums.MetalType;
    spotEur?: Prisma.DecimalWithAggregatesFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell?: Prisma.DecimalWithAggregatesFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy?: Prisma.DecimalWithAggregatesFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur?: Prisma.DecimalWithAggregatesFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur?: Prisma.DecimalWithAggregatesFilter<"ProductPriceSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProductPriceSnapshot"> | Date | string;
};
export type ProductPriceSnapshotCreateInput = {
    id?: bigint | number;
    day: Date | string;
    productId: number;
    metalType: $Enums.MetalType;
    spotEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell: runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type ProductPriceSnapshotUncheckedCreateInput = {
    id?: bigint | number;
    day: Date | string;
    productId: number;
    metalType: $Enums.MetalType;
    spotEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell: runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type ProductPriceSnapshotUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    day?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    spotEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductPriceSnapshotUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    day?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    spotEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductPriceSnapshotCreateManyInput = {
    id?: bigint | number;
    day: Date | string;
    productId: number;
    metalType: $Enums.MetalType;
    spotEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell: runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type ProductPriceSnapshotUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    day?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    spotEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductPriceSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    day?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    spotEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadSell?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    spreadBuy?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sellPriceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    buyPriceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductPriceSnapshotProductIdDayCompoundUniqueInput = {
    productId: number;
    day: Date | string;
};
export type ProductPriceSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    day?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    spotEur?: Prisma.SortOrder;
    spreadSell?: Prisma.SortOrder;
    spreadBuy?: Prisma.SortOrder;
    sellPriceEur?: Prisma.SortOrder;
    buyPriceEur?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProductPriceSnapshotAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    spotEur?: Prisma.SortOrder;
    spreadSell?: Prisma.SortOrder;
    spreadBuy?: Prisma.SortOrder;
    sellPriceEur?: Prisma.SortOrder;
    buyPriceEur?: Prisma.SortOrder;
};
export type ProductPriceSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    day?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    spotEur?: Prisma.SortOrder;
    spreadSell?: Prisma.SortOrder;
    spreadBuy?: Prisma.SortOrder;
    sellPriceEur?: Prisma.SortOrder;
    buyPriceEur?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProductPriceSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    day?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    spotEur?: Prisma.SortOrder;
    spreadSell?: Prisma.SortOrder;
    spreadBuy?: Prisma.SortOrder;
    sellPriceEur?: Prisma.SortOrder;
    buyPriceEur?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProductPriceSnapshotSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    spotEur?: Prisma.SortOrder;
    spreadSell?: Prisma.SortOrder;
    spreadBuy?: Prisma.SortOrder;
    sellPriceEur?: Prisma.SortOrder;
    buyPriceEur?: Prisma.SortOrder;
};
export type ProductPriceSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    day?: boolean;
    productId?: boolean;
    metalType?: boolean;
    spotEur?: boolean;
    spreadSell?: boolean;
    spreadBuy?: boolean;
    sellPriceEur?: boolean;
    buyPriceEur?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["productPriceSnapshot"]>;
export type ProductPriceSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    day?: boolean;
    productId?: boolean;
    metalType?: boolean;
    spotEur?: boolean;
    spreadSell?: boolean;
    spreadBuy?: boolean;
    sellPriceEur?: boolean;
    buyPriceEur?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["productPriceSnapshot"]>;
export type ProductPriceSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    day?: boolean;
    productId?: boolean;
    metalType?: boolean;
    spotEur?: boolean;
    spreadSell?: boolean;
    spreadBuy?: boolean;
    sellPriceEur?: boolean;
    buyPriceEur?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["productPriceSnapshot"]>;
export type ProductPriceSnapshotSelectScalar = {
    id?: boolean;
    day?: boolean;
    productId?: boolean;
    metalType?: boolean;
    spotEur?: boolean;
    spreadSell?: boolean;
    spreadBuy?: boolean;
    sellPriceEur?: boolean;
    buyPriceEur?: boolean;
    createdAt?: boolean;
};
export type ProductPriceSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "day" | "productId" | "metalType" | "spotEur" | "spreadSell" | "spreadBuy" | "sellPriceEur" | "buyPriceEur" | "createdAt", ExtArgs["result"]["productPriceSnapshot"]>;
export type $ProductPriceSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProductPriceSnapshot";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        day: Date;
        productId: number;
        metalType: $Enums.MetalType;
        spotEur: runtime.Decimal;
        spreadSell: runtime.Decimal;
        spreadBuy: runtime.Decimal;
        sellPriceEur: runtime.Decimal;
        buyPriceEur: runtime.Decimal;
        createdAt: Date;
    }, ExtArgs["result"]["productPriceSnapshot"]>;
    composites: {};
};
export type ProductPriceSnapshotGetPayload<S extends boolean | null | undefined | ProductPriceSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload, S>;
export type ProductPriceSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProductPriceSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProductPriceSnapshotCountAggregateInputType | true;
};
export interface ProductPriceSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProductPriceSnapshot'];
        meta: {
            name: 'ProductPriceSnapshot';
        };
    };
    findUnique<T extends ProductPriceSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, ProductPriceSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProductPriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProductPriceSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProductPriceSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductPriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProductPriceSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, ProductPriceSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProductPriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProductPriceSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProductPriceSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductPriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProductPriceSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, ProductPriceSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProductPriceSnapshotCreateArgs>(args: Prisma.SelectSubset<T, ProductPriceSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__ProductPriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProductPriceSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, ProductPriceSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProductPriceSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProductPriceSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProductPriceSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, ProductPriceSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__ProductPriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProductPriceSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, ProductPriceSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__ProductPriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProductPriceSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProductPriceSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProductPriceSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, ProductPriceSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProductPriceSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProductPriceSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProductPriceSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, ProductPriceSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__ProductPriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ProductPriceSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProductPriceSnapshotCountArgs>(args?: Prisma.Subset<T, ProductPriceSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProductPriceSnapshotCountAggregateOutputType> : number>;
    aggregate<T extends ProductPriceSnapshotAggregateArgs>(args: Prisma.Subset<T, ProductPriceSnapshotAggregateArgs>): Prisma.PrismaPromise<GetProductPriceSnapshotAggregateType<T>>;
    groupBy<T extends ProductPriceSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProductPriceSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: ProductPriceSnapshotGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProductPriceSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductPriceSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProductPriceSnapshotFieldRefs;
}
export interface Prisma__ProductPriceSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProductPriceSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"ProductPriceSnapshot", 'BigInt'>;
    readonly day: Prisma.FieldRef<"ProductPriceSnapshot", 'DateTime'>;
    readonly productId: Prisma.FieldRef<"ProductPriceSnapshot", 'Int'>;
    readonly metalType: Prisma.FieldRef<"ProductPriceSnapshot", 'MetalType'>;
    readonly spotEur: Prisma.FieldRef<"ProductPriceSnapshot", 'Decimal'>;
    readonly spreadSell: Prisma.FieldRef<"ProductPriceSnapshot", 'Decimal'>;
    readonly spreadBuy: Prisma.FieldRef<"ProductPriceSnapshot", 'Decimal'>;
    readonly sellPriceEur: Prisma.FieldRef<"ProductPriceSnapshot", 'Decimal'>;
    readonly buyPriceEur: Prisma.FieldRef<"ProductPriceSnapshot", 'Decimal'>;
    readonly createdAt: Prisma.FieldRef<"ProductPriceSnapshot", 'DateTime'>;
}
export type ProductPriceSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    where: Prisma.ProductPriceSnapshotWhereUniqueInput;
};
export type ProductPriceSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    where: Prisma.ProductPriceSnapshotWhereUniqueInput;
};
export type ProductPriceSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    where?: Prisma.ProductPriceSnapshotWhereInput;
    orderBy?: Prisma.ProductPriceSnapshotOrderByWithRelationInput | Prisma.ProductPriceSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.ProductPriceSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductPriceSnapshotScalarFieldEnum | Prisma.ProductPriceSnapshotScalarFieldEnum[];
};
export type ProductPriceSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    where?: Prisma.ProductPriceSnapshotWhereInput;
    orderBy?: Prisma.ProductPriceSnapshotOrderByWithRelationInput | Prisma.ProductPriceSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.ProductPriceSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductPriceSnapshotScalarFieldEnum | Prisma.ProductPriceSnapshotScalarFieldEnum[];
};
export type ProductPriceSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    where?: Prisma.ProductPriceSnapshotWhereInput;
    orderBy?: Prisma.ProductPriceSnapshotOrderByWithRelationInput | Prisma.ProductPriceSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.ProductPriceSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductPriceSnapshotScalarFieldEnum | Prisma.ProductPriceSnapshotScalarFieldEnum[];
};
export type ProductPriceSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductPriceSnapshotCreateInput, Prisma.ProductPriceSnapshotUncheckedCreateInput>;
};
export type ProductPriceSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProductPriceSnapshotCreateManyInput | Prisma.ProductPriceSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProductPriceSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    data: Prisma.ProductPriceSnapshotCreateManyInput | Prisma.ProductPriceSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProductPriceSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductPriceSnapshotUpdateInput, Prisma.ProductPriceSnapshotUncheckedUpdateInput>;
    where: Prisma.ProductPriceSnapshotWhereUniqueInput;
};
export type ProductPriceSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProductPriceSnapshotUpdateManyMutationInput, Prisma.ProductPriceSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.ProductPriceSnapshotWhereInput;
    limit?: number;
};
export type ProductPriceSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductPriceSnapshotUpdateManyMutationInput, Prisma.ProductPriceSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.ProductPriceSnapshotWhereInput;
    limit?: number;
};
export type ProductPriceSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    where: Prisma.ProductPriceSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductPriceSnapshotCreateInput, Prisma.ProductPriceSnapshotUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProductPriceSnapshotUpdateInput, Prisma.ProductPriceSnapshotUncheckedUpdateInput>;
};
export type ProductPriceSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
    where: Prisma.ProductPriceSnapshotWhereUniqueInput;
};
export type ProductPriceSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductPriceSnapshotWhereInput;
    limit?: number;
};
export type ProductPriceSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductPriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.ProductPriceSnapshotOmit<ExtArgs> | null;
};
//# sourceMappingURL=ProductPriceSnapshot.d.ts.map