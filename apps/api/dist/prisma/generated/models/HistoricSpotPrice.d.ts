import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type HistoricSpotPriceModel = runtime.Types.Result.DefaultSelection<Prisma.$HistoricSpotPricePayload>;
export type AggregateHistoricSpotPrice = {
    _count: HistoricSpotPriceCountAggregateOutputType | null;
    _avg: HistoricSpotPriceAvgAggregateOutputType | null;
    _sum: HistoricSpotPriceSumAggregateOutputType | null;
    _min: HistoricSpotPriceMinAggregateOutputType | null;
    _max: HistoricSpotPriceMaxAggregateOutputType | null;
};
export type HistoricSpotPriceAvgAggregateOutputType = {
    id: number | null;
    priceEur: runtime.Decimal | null;
    priceGbp: runtime.Decimal | null;
};
export type HistoricSpotPriceSumAggregateOutputType = {
    id: bigint | null;
    priceEur: runtime.Decimal | null;
    priceGbp: runtime.Decimal | null;
};
export type HistoricSpotPriceMinAggregateOutputType = {
    id: bigint | null;
    metalType: $Enums.MetalType | null;
    priceEur: runtime.Decimal | null;
    priceGbp: runtime.Decimal | null;
    recordedAt: Date | null;
    createdAt: Date | null;
};
export type HistoricSpotPriceMaxAggregateOutputType = {
    id: bigint | null;
    metalType: $Enums.MetalType | null;
    priceEur: runtime.Decimal | null;
    priceGbp: runtime.Decimal | null;
    recordedAt: Date | null;
    createdAt: Date | null;
};
export type HistoricSpotPriceCountAggregateOutputType = {
    id: number;
    metalType: number;
    priceEur: number;
    priceGbp: number;
    recordedAt: number;
    createdAt: number;
    _all: number;
};
export type HistoricSpotPriceAvgAggregateInputType = {
    id?: true;
    priceEur?: true;
    priceGbp?: true;
};
export type HistoricSpotPriceSumAggregateInputType = {
    id?: true;
    priceEur?: true;
    priceGbp?: true;
};
export type HistoricSpotPriceMinAggregateInputType = {
    id?: true;
    metalType?: true;
    priceEur?: true;
    priceGbp?: true;
    recordedAt?: true;
    createdAt?: true;
};
export type HistoricSpotPriceMaxAggregateInputType = {
    id?: true;
    metalType?: true;
    priceEur?: true;
    priceGbp?: true;
    recordedAt?: true;
    createdAt?: true;
};
export type HistoricSpotPriceCountAggregateInputType = {
    id?: true;
    metalType?: true;
    priceEur?: true;
    priceGbp?: true;
    recordedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type HistoricSpotPriceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HistoricSpotPriceWhereInput;
    orderBy?: Prisma.HistoricSpotPriceOrderByWithRelationInput | Prisma.HistoricSpotPriceOrderByWithRelationInput[];
    cursor?: Prisma.HistoricSpotPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | HistoricSpotPriceCountAggregateInputType;
    _avg?: HistoricSpotPriceAvgAggregateInputType;
    _sum?: HistoricSpotPriceSumAggregateInputType;
    _min?: HistoricSpotPriceMinAggregateInputType;
    _max?: HistoricSpotPriceMaxAggregateInputType;
};
export type GetHistoricSpotPriceAggregateType<T extends HistoricSpotPriceAggregateArgs> = {
    [P in keyof T & keyof AggregateHistoricSpotPrice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateHistoricSpotPrice[P]> : Prisma.GetScalarType<T[P], AggregateHistoricSpotPrice[P]>;
};
export type HistoricSpotPriceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HistoricSpotPriceWhereInput;
    orderBy?: Prisma.HistoricSpotPriceOrderByWithAggregationInput | Prisma.HistoricSpotPriceOrderByWithAggregationInput[];
    by: Prisma.HistoricSpotPriceScalarFieldEnum[] | Prisma.HistoricSpotPriceScalarFieldEnum;
    having?: Prisma.HistoricSpotPriceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: HistoricSpotPriceCountAggregateInputType | true;
    _avg?: HistoricSpotPriceAvgAggregateInputType;
    _sum?: HistoricSpotPriceSumAggregateInputType;
    _min?: HistoricSpotPriceMinAggregateInputType;
    _max?: HistoricSpotPriceMaxAggregateInputType;
};
export type HistoricSpotPriceGroupByOutputType = {
    id: bigint;
    metalType: $Enums.MetalType;
    priceEur: runtime.Decimal;
    priceGbp: runtime.Decimal;
    recordedAt: Date;
    createdAt: Date;
    _count: HistoricSpotPriceCountAggregateOutputType | null;
    _avg: HistoricSpotPriceAvgAggregateOutputType | null;
    _sum: HistoricSpotPriceSumAggregateOutputType | null;
    _min: HistoricSpotPriceMinAggregateOutputType | null;
    _max: HistoricSpotPriceMaxAggregateOutputType | null;
};
export type GetHistoricSpotPriceGroupByPayload<T extends HistoricSpotPriceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<HistoricSpotPriceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof HistoricSpotPriceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], HistoricSpotPriceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], HistoricSpotPriceGroupByOutputType[P]>;
}>>;
export type HistoricSpotPriceWhereInput = {
    AND?: Prisma.HistoricSpotPriceWhereInput | Prisma.HistoricSpotPriceWhereInput[];
    OR?: Prisma.HistoricSpotPriceWhereInput[];
    NOT?: Prisma.HistoricSpotPriceWhereInput | Prisma.HistoricSpotPriceWhereInput[];
    id?: Prisma.BigIntFilter<"HistoricSpotPrice"> | bigint | number;
    metalType?: Prisma.EnumMetalTypeFilter<"HistoricSpotPrice"> | $Enums.MetalType;
    priceEur?: Prisma.DecimalFilter<"HistoricSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFilter<"HistoricSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt?: Prisma.DateTimeFilter<"HistoricSpotPrice"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"HistoricSpotPrice"> | Date | string;
};
export type HistoricSpotPriceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HistoricSpotPriceWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    metalType_recordedAt?: Prisma.HistoricSpotPriceMetalTypeRecordedAtCompoundUniqueInput;
    AND?: Prisma.HistoricSpotPriceWhereInput | Prisma.HistoricSpotPriceWhereInput[];
    OR?: Prisma.HistoricSpotPriceWhereInput[];
    NOT?: Prisma.HistoricSpotPriceWhereInput | Prisma.HistoricSpotPriceWhereInput[];
    metalType?: Prisma.EnumMetalTypeFilter<"HistoricSpotPrice"> | $Enums.MetalType;
    priceEur?: Prisma.DecimalFilter<"HistoricSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFilter<"HistoricSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt?: Prisma.DateTimeFilter<"HistoricSpotPrice"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"HistoricSpotPrice"> | Date | string;
}, "id" | "metalType_recordedAt">;
export type HistoricSpotPriceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.HistoricSpotPriceCountOrderByAggregateInput;
    _avg?: Prisma.HistoricSpotPriceAvgOrderByAggregateInput;
    _max?: Prisma.HistoricSpotPriceMaxOrderByAggregateInput;
    _min?: Prisma.HistoricSpotPriceMinOrderByAggregateInput;
    _sum?: Prisma.HistoricSpotPriceSumOrderByAggregateInput;
};
export type HistoricSpotPriceScalarWhereWithAggregatesInput = {
    AND?: Prisma.HistoricSpotPriceScalarWhereWithAggregatesInput | Prisma.HistoricSpotPriceScalarWhereWithAggregatesInput[];
    OR?: Prisma.HistoricSpotPriceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.HistoricSpotPriceScalarWhereWithAggregatesInput | Prisma.HistoricSpotPriceScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"HistoricSpotPrice"> | bigint | number;
    metalType?: Prisma.EnumMetalTypeWithAggregatesFilter<"HistoricSpotPrice"> | $Enums.MetalType;
    priceEur?: Prisma.DecimalWithAggregatesFilter<"HistoricSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalWithAggregatesFilter<"HistoricSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt?: Prisma.DateTimeWithAggregatesFilter<"HistoricSpotPrice"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"HistoricSpotPrice"> | Date | string;
};
export type HistoricSpotPriceCreateInput = {
    id?: bigint | number;
    metalType: $Enums.MetalType;
    priceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt: Date | string;
    createdAt?: Date | string;
};
export type HistoricSpotPriceUncheckedCreateInput = {
    id?: bigint | number;
    metalType: $Enums.MetalType;
    priceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt: Date | string;
    createdAt?: Date | string;
};
export type HistoricSpotPriceUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    priceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HistoricSpotPriceUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    priceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HistoricSpotPriceCreateManyInput = {
    id?: bigint | number;
    metalType: $Enums.MetalType;
    priceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt: Date | string;
    createdAt?: Date | string;
};
export type HistoricSpotPriceUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    priceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HistoricSpotPriceUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    priceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HistoricSpotPriceMetalTypeRecordedAtCompoundUniqueInput = {
    metalType: $Enums.MetalType;
    recordedAt: Date | string;
};
export type HistoricSpotPriceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HistoricSpotPriceAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
};
export type HistoricSpotPriceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HistoricSpotPriceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HistoricSpotPriceSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
};
export type HistoricSpotPriceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    metalType?: boolean;
    priceEur?: boolean;
    priceGbp?: boolean;
    recordedAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["historicSpotPrice"]>;
export type HistoricSpotPriceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    metalType?: boolean;
    priceEur?: boolean;
    priceGbp?: boolean;
    recordedAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["historicSpotPrice"]>;
export type HistoricSpotPriceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    metalType?: boolean;
    priceEur?: boolean;
    priceGbp?: boolean;
    recordedAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["historicSpotPrice"]>;
export type HistoricSpotPriceSelectScalar = {
    id?: boolean;
    metalType?: boolean;
    priceEur?: boolean;
    priceGbp?: boolean;
    recordedAt?: boolean;
    createdAt?: boolean;
};
export type HistoricSpotPriceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "metalType" | "priceEur" | "priceGbp" | "recordedAt" | "createdAt", ExtArgs["result"]["historicSpotPrice"]>;
export type $HistoricSpotPricePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "HistoricSpotPrice";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        metalType: $Enums.MetalType;
        priceEur: runtime.Decimal;
        priceGbp: runtime.Decimal;
        recordedAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["historicSpotPrice"]>;
    composites: {};
};
export type HistoricSpotPriceGetPayload<S extends boolean | null | undefined | HistoricSpotPriceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload, S>;
export type HistoricSpotPriceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<HistoricSpotPriceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: HistoricSpotPriceCountAggregateInputType | true;
};
export interface HistoricSpotPriceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['HistoricSpotPrice'];
        meta: {
            name: 'HistoricSpotPrice';
        };
    };
    findUnique<T extends HistoricSpotPriceFindUniqueArgs>(args: Prisma.SelectSubset<T, HistoricSpotPriceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__HistoricSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends HistoricSpotPriceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, HistoricSpotPriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__HistoricSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends HistoricSpotPriceFindFirstArgs>(args?: Prisma.SelectSubset<T, HistoricSpotPriceFindFirstArgs<ExtArgs>>): Prisma.Prisma__HistoricSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends HistoricSpotPriceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, HistoricSpotPriceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__HistoricSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends HistoricSpotPriceFindManyArgs>(args?: Prisma.SelectSubset<T, HistoricSpotPriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends HistoricSpotPriceCreateArgs>(args: Prisma.SelectSubset<T, HistoricSpotPriceCreateArgs<ExtArgs>>): Prisma.Prisma__HistoricSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends HistoricSpotPriceCreateManyArgs>(args?: Prisma.SelectSubset<T, HistoricSpotPriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends HistoricSpotPriceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, HistoricSpotPriceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends HistoricSpotPriceDeleteArgs>(args: Prisma.SelectSubset<T, HistoricSpotPriceDeleteArgs<ExtArgs>>): Prisma.Prisma__HistoricSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends HistoricSpotPriceUpdateArgs>(args: Prisma.SelectSubset<T, HistoricSpotPriceUpdateArgs<ExtArgs>>): Prisma.Prisma__HistoricSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends HistoricSpotPriceDeleteManyArgs>(args?: Prisma.SelectSubset<T, HistoricSpotPriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends HistoricSpotPriceUpdateManyArgs>(args: Prisma.SelectSubset<T, HistoricSpotPriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends HistoricSpotPriceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, HistoricSpotPriceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends HistoricSpotPriceUpsertArgs>(args: Prisma.SelectSubset<T, HistoricSpotPriceUpsertArgs<ExtArgs>>): Prisma.Prisma__HistoricSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$HistoricSpotPricePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends HistoricSpotPriceCountArgs>(args?: Prisma.Subset<T, HistoricSpotPriceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], HistoricSpotPriceCountAggregateOutputType> : number>;
    aggregate<T extends HistoricSpotPriceAggregateArgs>(args: Prisma.Subset<T, HistoricSpotPriceAggregateArgs>): Prisma.PrismaPromise<GetHistoricSpotPriceAggregateType<T>>;
    groupBy<T extends HistoricSpotPriceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: HistoricSpotPriceGroupByArgs['orderBy'];
    } : {
        orderBy?: HistoricSpotPriceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, HistoricSpotPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHistoricSpotPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: HistoricSpotPriceFieldRefs;
}
export interface Prisma__HistoricSpotPriceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface HistoricSpotPriceFieldRefs {
    readonly id: Prisma.FieldRef<"HistoricSpotPrice", 'BigInt'>;
    readonly metalType: Prisma.FieldRef<"HistoricSpotPrice", 'MetalType'>;
    readonly priceEur: Prisma.FieldRef<"HistoricSpotPrice", 'Decimal'>;
    readonly priceGbp: Prisma.FieldRef<"HistoricSpotPrice", 'Decimal'>;
    readonly recordedAt: Prisma.FieldRef<"HistoricSpotPrice", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"HistoricSpotPrice", 'DateTime'>;
}
export type HistoricSpotPriceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    where: Prisma.HistoricSpotPriceWhereUniqueInput;
};
export type HistoricSpotPriceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    where: Prisma.HistoricSpotPriceWhereUniqueInput;
};
export type HistoricSpotPriceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    where?: Prisma.HistoricSpotPriceWhereInput;
    orderBy?: Prisma.HistoricSpotPriceOrderByWithRelationInput | Prisma.HistoricSpotPriceOrderByWithRelationInput[];
    cursor?: Prisma.HistoricSpotPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HistoricSpotPriceScalarFieldEnum | Prisma.HistoricSpotPriceScalarFieldEnum[];
};
export type HistoricSpotPriceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    where?: Prisma.HistoricSpotPriceWhereInput;
    orderBy?: Prisma.HistoricSpotPriceOrderByWithRelationInput | Prisma.HistoricSpotPriceOrderByWithRelationInput[];
    cursor?: Prisma.HistoricSpotPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HistoricSpotPriceScalarFieldEnum | Prisma.HistoricSpotPriceScalarFieldEnum[];
};
export type HistoricSpotPriceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    where?: Prisma.HistoricSpotPriceWhereInput;
    orderBy?: Prisma.HistoricSpotPriceOrderByWithRelationInput | Prisma.HistoricSpotPriceOrderByWithRelationInput[];
    cursor?: Prisma.HistoricSpotPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HistoricSpotPriceScalarFieldEnum | Prisma.HistoricSpotPriceScalarFieldEnum[];
};
export type HistoricSpotPriceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HistoricSpotPriceCreateInput, Prisma.HistoricSpotPriceUncheckedCreateInput>;
};
export type HistoricSpotPriceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.HistoricSpotPriceCreateManyInput | Prisma.HistoricSpotPriceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HistoricSpotPriceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    data: Prisma.HistoricSpotPriceCreateManyInput | Prisma.HistoricSpotPriceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HistoricSpotPriceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HistoricSpotPriceUpdateInput, Prisma.HistoricSpotPriceUncheckedUpdateInput>;
    where: Prisma.HistoricSpotPriceWhereUniqueInput;
};
export type HistoricSpotPriceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.HistoricSpotPriceUpdateManyMutationInput, Prisma.HistoricSpotPriceUncheckedUpdateManyInput>;
    where?: Prisma.HistoricSpotPriceWhereInput;
    limit?: number;
};
export type HistoricSpotPriceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HistoricSpotPriceUpdateManyMutationInput, Prisma.HistoricSpotPriceUncheckedUpdateManyInput>;
    where?: Prisma.HistoricSpotPriceWhereInput;
    limit?: number;
};
export type HistoricSpotPriceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    where: Prisma.HistoricSpotPriceWhereUniqueInput;
    create: Prisma.XOR<Prisma.HistoricSpotPriceCreateInput, Prisma.HistoricSpotPriceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.HistoricSpotPriceUpdateInput, Prisma.HistoricSpotPriceUncheckedUpdateInput>;
};
export type HistoricSpotPriceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
    where: Prisma.HistoricSpotPriceWhereUniqueInput;
};
export type HistoricSpotPriceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HistoricSpotPriceWhereInput;
    limit?: number;
};
export type HistoricSpotPriceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HistoricSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.HistoricSpotPriceOmit<ExtArgs> | null;
};
//# sourceMappingURL=HistoricSpotPrice.d.ts.map