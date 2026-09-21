import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type MetalSpotPriceModel = runtime.Types.Result.DefaultSelection<Prisma.$MetalSpotPricePayload>;
export type AggregateMetalSpotPrice = {
    _count: MetalSpotPriceCountAggregateOutputType | null;
    _avg: MetalSpotPriceAvgAggregateOutputType | null;
    _sum: MetalSpotPriceSumAggregateOutputType | null;
    _min: MetalSpotPriceMinAggregateOutputType | null;
    _max: MetalSpotPriceMaxAggregateOutputType | null;
};
export type MetalSpotPriceAvgAggregateOutputType = {
    id: number | null;
    priceEur: runtime.Decimal | null;
    priceGbp: runtime.Decimal | null;
};
export type MetalSpotPriceSumAggregateOutputType = {
    id: bigint | null;
    priceEur: runtime.Decimal | null;
    priceGbp: runtime.Decimal | null;
};
export type MetalSpotPriceMinAggregateOutputType = {
    id: bigint | null;
    metalType: $Enums.MetalType | null;
    priceEur: runtime.Decimal | null;
    priceGbp: runtime.Decimal | null;
    source: string | null;
    timestamp: Date | null;
    createdAt: Date | null;
};
export type MetalSpotPriceMaxAggregateOutputType = {
    id: bigint | null;
    metalType: $Enums.MetalType | null;
    priceEur: runtime.Decimal | null;
    priceGbp: runtime.Decimal | null;
    source: string | null;
    timestamp: Date | null;
    createdAt: Date | null;
};
export type MetalSpotPriceCountAggregateOutputType = {
    id: number;
    metalType: number;
    priceEur: number;
    priceGbp: number;
    source: number;
    timestamp: number;
    createdAt: number;
    _all: number;
};
export type MetalSpotPriceAvgAggregateInputType = {
    id?: true;
    priceEur?: true;
    priceGbp?: true;
};
export type MetalSpotPriceSumAggregateInputType = {
    id?: true;
    priceEur?: true;
    priceGbp?: true;
};
export type MetalSpotPriceMinAggregateInputType = {
    id?: true;
    metalType?: true;
    priceEur?: true;
    priceGbp?: true;
    source?: true;
    timestamp?: true;
    createdAt?: true;
};
export type MetalSpotPriceMaxAggregateInputType = {
    id?: true;
    metalType?: true;
    priceEur?: true;
    priceGbp?: true;
    source?: true;
    timestamp?: true;
    createdAt?: true;
};
export type MetalSpotPriceCountAggregateInputType = {
    id?: true;
    metalType?: true;
    priceEur?: true;
    priceGbp?: true;
    source?: true;
    timestamp?: true;
    createdAt?: true;
    _all?: true;
};
export type MetalSpotPriceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MetalSpotPriceWhereInput;
    orderBy?: Prisma.MetalSpotPriceOrderByWithRelationInput | Prisma.MetalSpotPriceOrderByWithRelationInput[];
    cursor?: Prisma.MetalSpotPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MetalSpotPriceCountAggregateInputType;
    _avg?: MetalSpotPriceAvgAggregateInputType;
    _sum?: MetalSpotPriceSumAggregateInputType;
    _min?: MetalSpotPriceMinAggregateInputType;
    _max?: MetalSpotPriceMaxAggregateInputType;
};
export type GetMetalSpotPriceAggregateType<T extends MetalSpotPriceAggregateArgs> = {
    [P in keyof T & keyof AggregateMetalSpotPrice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMetalSpotPrice[P]> : Prisma.GetScalarType<T[P], AggregateMetalSpotPrice[P]>;
};
export type MetalSpotPriceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MetalSpotPriceWhereInput;
    orderBy?: Prisma.MetalSpotPriceOrderByWithAggregationInput | Prisma.MetalSpotPriceOrderByWithAggregationInput[];
    by: Prisma.MetalSpotPriceScalarFieldEnum[] | Prisma.MetalSpotPriceScalarFieldEnum;
    having?: Prisma.MetalSpotPriceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MetalSpotPriceCountAggregateInputType | true;
    _avg?: MetalSpotPriceAvgAggregateInputType;
    _sum?: MetalSpotPriceSumAggregateInputType;
    _min?: MetalSpotPriceMinAggregateInputType;
    _max?: MetalSpotPriceMaxAggregateInputType;
};
export type MetalSpotPriceGroupByOutputType = {
    id: bigint;
    metalType: $Enums.MetalType;
    priceEur: runtime.Decimal;
    priceGbp: runtime.Decimal;
    source: string;
    timestamp: Date;
    createdAt: Date;
    _count: MetalSpotPriceCountAggregateOutputType | null;
    _avg: MetalSpotPriceAvgAggregateOutputType | null;
    _sum: MetalSpotPriceSumAggregateOutputType | null;
    _min: MetalSpotPriceMinAggregateOutputType | null;
    _max: MetalSpotPriceMaxAggregateOutputType | null;
};
export type GetMetalSpotPriceGroupByPayload<T extends MetalSpotPriceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MetalSpotPriceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MetalSpotPriceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MetalSpotPriceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MetalSpotPriceGroupByOutputType[P]>;
}>>;
export type MetalSpotPriceWhereInput = {
    AND?: Prisma.MetalSpotPriceWhereInput | Prisma.MetalSpotPriceWhereInput[];
    OR?: Prisma.MetalSpotPriceWhereInput[];
    NOT?: Prisma.MetalSpotPriceWhereInput | Prisma.MetalSpotPriceWhereInput[];
    id?: Prisma.BigIntFilter<"MetalSpotPrice"> | bigint | number;
    metalType?: Prisma.EnumMetalTypeFilter<"MetalSpotPrice"> | $Enums.MetalType;
    priceEur?: Prisma.DecimalFilter<"MetalSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFilter<"MetalSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    source?: Prisma.StringFilter<"MetalSpotPrice"> | string;
    timestamp?: Prisma.DateTimeFilter<"MetalSpotPrice"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"MetalSpotPrice"> | Date | string;
};
export type MetalSpotPriceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MetalSpotPriceWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    metalType_timestamp?: Prisma.MetalSpotPriceMetalTypeTimestampCompoundUniqueInput;
    AND?: Prisma.MetalSpotPriceWhereInput | Prisma.MetalSpotPriceWhereInput[];
    OR?: Prisma.MetalSpotPriceWhereInput[];
    NOT?: Prisma.MetalSpotPriceWhereInput | Prisma.MetalSpotPriceWhereInput[];
    metalType?: Prisma.EnumMetalTypeFilter<"MetalSpotPrice"> | $Enums.MetalType;
    priceEur?: Prisma.DecimalFilter<"MetalSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFilter<"MetalSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    source?: Prisma.StringFilter<"MetalSpotPrice"> | string;
    timestamp?: Prisma.DateTimeFilter<"MetalSpotPrice"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"MetalSpotPrice"> | Date | string;
}, "id" | "metalType_timestamp">;
export type MetalSpotPriceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.MetalSpotPriceCountOrderByAggregateInput;
    _avg?: Prisma.MetalSpotPriceAvgOrderByAggregateInput;
    _max?: Prisma.MetalSpotPriceMaxOrderByAggregateInput;
    _min?: Prisma.MetalSpotPriceMinOrderByAggregateInput;
    _sum?: Prisma.MetalSpotPriceSumOrderByAggregateInput;
};
export type MetalSpotPriceScalarWhereWithAggregatesInput = {
    AND?: Prisma.MetalSpotPriceScalarWhereWithAggregatesInput | Prisma.MetalSpotPriceScalarWhereWithAggregatesInput[];
    OR?: Prisma.MetalSpotPriceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MetalSpotPriceScalarWhereWithAggregatesInput | Prisma.MetalSpotPriceScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"MetalSpotPrice"> | bigint | number;
    metalType?: Prisma.EnumMetalTypeWithAggregatesFilter<"MetalSpotPrice"> | $Enums.MetalType;
    priceEur?: Prisma.DecimalWithAggregatesFilter<"MetalSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalWithAggregatesFilter<"MetalSpotPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    source?: Prisma.StringWithAggregatesFilter<"MetalSpotPrice"> | string;
    timestamp?: Prisma.DateTimeWithAggregatesFilter<"MetalSpotPrice"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MetalSpotPrice"> | Date | string;
};
export type MetalSpotPriceCreateInput = {
    id?: bigint | number;
    metalType: $Enums.MetalType;
    priceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp: runtime.Decimal | runtime.DecimalJsLike | number | string;
    source: string;
    timestamp: Date | string;
    createdAt?: Date | string;
};
export type MetalSpotPriceUncheckedCreateInput = {
    id?: bigint | number;
    metalType: $Enums.MetalType;
    priceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp: runtime.Decimal | runtime.DecimalJsLike | number | string;
    source: string;
    timestamp: Date | string;
    createdAt?: Date | string;
};
export type MetalSpotPriceUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    priceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MetalSpotPriceUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    priceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MetalSpotPriceCreateManyInput = {
    id?: bigint | number;
    metalType: $Enums.MetalType;
    priceEur: runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp: runtime.Decimal | runtime.DecimalJsLike | number | string;
    source: string;
    timestamp: Date | string;
    createdAt?: Date | string;
};
export type MetalSpotPriceUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    priceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MetalSpotPriceUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    metalType?: Prisma.EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType;
    priceEur?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    priceGbp?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MetalSpotPriceMetalTypeTimestampCompoundUniqueInput = {
    metalType: $Enums.MetalType;
    timestamp: Date | string;
};
export type MetalSpotPriceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MetalSpotPriceAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
};
export type MetalSpotPriceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MetalSpotPriceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    metalType?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MetalSpotPriceSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    priceEur?: Prisma.SortOrder;
    priceGbp?: Prisma.SortOrder;
};
export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
};
export type MetalSpotPriceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    metalType?: boolean;
    priceEur?: boolean;
    priceGbp?: boolean;
    source?: boolean;
    timestamp?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["metalSpotPrice"]>;
export type MetalSpotPriceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    metalType?: boolean;
    priceEur?: boolean;
    priceGbp?: boolean;
    source?: boolean;
    timestamp?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["metalSpotPrice"]>;
export type MetalSpotPriceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    metalType?: boolean;
    priceEur?: boolean;
    priceGbp?: boolean;
    source?: boolean;
    timestamp?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["metalSpotPrice"]>;
export type MetalSpotPriceSelectScalar = {
    id?: boolean;
    metalType?: boolean;
    priceEur?: boolean;
    priceGbp?: boolean;
    source?: boolean;
    timestamp?: boolean;
    createdAt?: boolean;
};
export type MetalSpotPriceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "metalType" | "priceEur" | "priceGbp" | "source" | "timestamp" | "createdAt", ExtArgs["result"]["metalSpotPrice"]>;
export type $MetalSpotPricePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MetalSpotPrice";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        metalType: $Enums.MetalType;
        priceEur: runtime.Decimal;
        priceGbp: runtime.Decimal;
        source: string;
        timestamp: Date;
        createdAt: Date;
    }, ExtArgs["result"]["metalSpotPrice"]>;
    composites: {};
};
export type MetalSpotPriceGetPayload<S extends boolean | null | undefined | MetalSpotPriceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload, S>;
export type MetalSpotPriceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MetalSpotPriceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MetalSpotPriceCountAggregateInputType | true;
};
export interface MetalSpotPriceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MetalSpotPrice'];
        meta: {
            name: 'MetalSpotPrice';
        };
    };
    findUnique<T extends MetalSpotPriceFindUniqueArgs>(args: Prisma.SelectSubset<T, MetalSpotPriceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MetalSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MetalSpotPriceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MetalSpotPriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MetalSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MetalSpotPriceFindFirstArgs>(args?: Prisma.SelectSubset<T, MetalSpotPriceFindFirstArgs<ExtArgs>>): Prisma.Prisma__MetalSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MetalSpotPriceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MetalSpotPriceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MetalSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MetalSpotPriceFindManyArgs>(args?: Prisma.SelectSubset<T, MetalSpotPriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MetalSpotPriceCreateArgs>(args: Prisma.SelectSubset<T, MetalSpotPriceCreateArgs<ExtArgs>>): Prisma.Prisma__MetalSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MetalSpotPriceCreateManyArgs>(args?: Prisma.SelectSubset<T, MetalSpotPriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MetalSpotPriceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MetalSpotPriceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MetalSpotPriceDeleteArgs>(args: Prisma.SelectSubset<T, MetalSpotPriceDeleteArgs<ExtArgs>>): Prisma.Prisma__MetalSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MetalSpotPriceUpdateArgs>(args: Prisma.SelectSubset<T, MetalSpotPriceUpdateArgs<ExtArgs>>): Prisma.Prisma__MetalSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MetalSpotPriceDeleteManyArgs>(args?: Prisma.SelectSubset<T, MetalSpotPriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MetalSpotPriceUpdateManyArgs>(args: Prisma.SelectSubset<T, MetalSpotPriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MetalSpotPriceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MetalSpotPriceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MetalSpotPriceUpsertArgs>(args: Prisma.SelectSubset<T, MetalSpotPriceUpsertArgs<ExtArgs>>): Prisma.Prisma__MetalSpotPriceClient<runtime.Types.Result.GetResult<Prisma.$MetalSpotPricePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MetalSpotPriceCountArgs>(args?: Prisma.Subset<T, MetalSpotPriceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MetalSpotPriceCountAggregateOutputType> : number>;
    aggregate<T extends MetalSpotPriceAggregateArgs>(args: Prisma.Subset<T, MetalSpotPriceAggregateArgs>): Prisma.PrismaPromise<GetMetalSpotPriceAggregateType<T>>;
    groupBy<T extends MetalSpotPriceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MetalSpotPriceGroupByArgs['orderBy'];
    } : {
        orderBy?: MetalSpotPriceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MetalSpotPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetalSpotPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MetalSpotPriceFieldRefs;
}
export interface Prisma__MetalSpotPriceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MetalSpotPriceFieldRefs {
    readonly id: Prisma.FieldRef<"MetalSpotPrice", 'BigInt'>;
    readonly metalType: Prisma.FieldRef<"MetalSpotPrice", 'MetalType'>;
    readonly priceEur: Prisma.FieldRef<"MetalSpotPrice", 'Decimal'>;
    readonly priceGbp: Prisma.FieldRef<"MetalSpotPrice", 'Decimal'>;
    readonly source: Prisma.FieldRef<"MetalSpotPrice", 'String'>;
    readonly timestamp: Prisma.FieldRef<"MetalSpotPrice", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"MetalSpotPrice", 'DateTime'>;
}
export type MetalSpotPriceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    where: Prisma.MetalSpotPriceWhereUniqueInput;
};
export type MetalSpotPriceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    where: Prisma.MetalSpotPriceWhereUniqueInput;
};
export type MetalSpotPriceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    where?: Prisma.MetalSpotPriceWhereInput;
    orderBy?: Prisma.MetalSpotPriceOrderByWithRelationInput | Prisma.MetalSpotPriceOrderByWithRelationInput[];
    cursor?: Prisma.MetalSpotPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MetalSpotPriceScalarFieldEnum | Prisma.MetalSpotPriceScalarFieldEnum[];
};
export type MetalSpotPriceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    where?: Prisma.MetalSpotPriceWhereInput;
    orderBy?: Prisma.MetalSpotPriceOrderByWithRelationInput | Prisma.MetalSpotPriceOrderByWithRelationInput[];
    cursor?: Prisma.MetalSpotPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MetalSpotPriceScalarFieldEnum | Prisma.MetalSpotPriceScalarFieldEnum[];
};
export type MetalSpotPriceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    where?: Prisma.MetalSpotPriceWhereInput;
    orderBy?: Prisma.MetalSpotPriceOrderByWithRelationInput | Prisma.MetalSpotPriceOrderByWithRelationInput[];
    cursor?: Prisma.MetalSpotPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MetalSpotPriceScalarFieldEnum | Prisma.MetalSpotPriceScalarFieldEnum[];
};
export type MetalSpotPriceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MetalSpotPriceCreateInput, Prisma.MetalSpotPriceUncheckedCreateInput>;
};
export type MetalSpotPriceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MetalSpotPriceCreateManyInput | Prisma.MetalSpotPriceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MetalSpotPriceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    data: Prisma.MetalSpotPriceCreateManyInput | Prisma.MetalSpotPriceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MetalSpotPriceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MetalSpotPriceUpdateInput, Prisma.MetalSpotPriceUncheckedUpdateInput>;
    where: Prisma.MetalSpotPriceWhereUniqueInput;
};
export type MetalSpotPriceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MetalSpotPriceUpdateManyMutationInput, Prisma.MetalSpotPriceUncheckedUpdateManyInput>;
    where?: Prisma.MetalSpotPriceWhereInput;
    limit?: number;
};
export type MetalSpotPriceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MetalSpotPriceUpdateManyMutationInput, Prisma.MetalSpotPriceUncheckedUpdateManyInput>;
    where?: Prisma.MetalSpotPriceWhereInput;
    limit?: number;
};
export type MetalSpotPriceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    where: Prisma.MetalSpotPriceWhereUniqueInput;
    create: Prisma.XOR<Prisma.MetalSpotPriceCreateInput, Prisma.MetalSpotPriceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MetalSpotPriceUpdateInput, Prisma.MetalSpotPriceUncheckedUpdateInput>;
};
export type MetalSpotPriceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
    where: Prisma.MetalSpotPriceWhereUniqueInput;
};
export type MetalSpotPriceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MetalSpotPriceWhereInput;
    limit?: number;
};
export type MetalSpotPriceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MetalSpotPriceSelect<ExtArgs> | null;
    omit?: Prisma.MetalSpotPriceOmit<ExtArgs> | null;
};
//# sourceMappingURL=MetalSpotPrice.d.ts.map