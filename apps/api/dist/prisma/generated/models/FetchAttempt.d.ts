import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type FetchAttemptModel = runtime.Types.Result.DefaultSelection<Prisma.$FetchAttemptPayload>;
export type AggregateFetchAttempt = {
    _count: FetchAttemptCountAggregateOutputType | null;
    _avg: FetchAttemptAvgAggregateOutputType | null;
    _sum: FetchAttemptSumAggregateOutputType | null;
    _min: FetchAttemptMinAggregateOutputType | null;
    _max: FetchAttemptMaxAggregateOutputType | null;
};
export type FetchAttemptAvgAggregateOutputType = {
    id: number | null;
    durationMs: number | null;
};
export type FetchAttemptSumAggregateOutputType = {
    id: bigint | null;
    durationMs: number | null;
};
export type FetchAttemptMinAggregateOutputType = {
    id: bigint | null;
    attemptedAt: Date | null;
    durationMs: number | null;
    success: boolean | null;
    errorMessage: string | null;
    triggeredBy: $Enums.FetchTrigger | null;
};
export type FetchAttemptMaxAggregateOutputType = {
    id: bigint | null;
    attemptedAt: Date | null;
    durationMs: number | null;
    success: boolean | null;
    errorMessage: string | null;
    triggeredBy: $Enums.FetchTrigger | null;
};
export type FetchAttemptCountAggregateOutputType = {
    id: number;
    attemptedAt: number;
    durationMs: number;
    success: number;
    errorMessage: number;
    metalsResolved: number;
    triggeredBy: number;
    _all: number;
};
export type FetchAttemptAvgAggregateInputType = {
    id?: true;
    durationMs?: true;
};
export type FetchAttemptSumAggregateInputType = {
    id?: true;
    durationMs?: true;
};
export type FetchAttemptMinAggregateInputType = {
    id?: true;
    attemptedAt?: true;
    durationMs?: true;
    success?: true;
    errorMessage?: true;
    triggeredBy?: true;
};
export type FetchAttemptMaxAggregateInputType = {
    id?: true;
    attemptedAt?: true;
    durationMs?: true;
    success?: true;
    errorMessage?: true;
    triggeredBy?: true;
};
export type FetchAttemptCountAggregateInputType = {
    id?: true;
    attemptedAt?: true;
    durationMs?: true;
    success?: true;
    errorMessage?: true;
    metalsResolved?: true;
    triggeredBy?: true;
    _all?: true;
};
export type FetchAttemptAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FetchAttemptWhereInput;
    orderBy?: Prisma.FetchAttemptOrderByWithRelationInput | Prisma.FetchAttemptOrderByWithRelationInput[];
    cursor?: Prisma.FetchAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FetchAttemptCountAggregateInputType;
    _avg?: FetchAttemptAvgAggregateInputType;
    _sum?: FetchAttemptSumAggregateInputType;
    _min?: FetchAttemptMinAggregateInputType;
    _max?: FetchAttemptMaxAggregateInputType;
};
export type GetFetchAttemptAggregateType<T extends FetchAttemptAggregateArgs> = {
    [P in keyof T & keyof AggregateFetchAttempt]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFetchAttempt[P]> : Prisma.GetScalarType<T[P], AggregateFetchAttempt[P]>;
};
export type FetchAttemptGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FetchAttemptWhereInput;
    orderBy?: Prisma.FetchAttemptOrderByWithAggregationInput | Prisma.FetchAttemptOrderByWithAggregationInput[];
    by: Prisma.FetchAttemptScalarFieldEnum[] | Prisma.FetchAttemptScalarFieldEnum;
    having?: Prisma.FetchAttemptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FetchAttemptCountAggregateInputType | true;
    _avg?: FetchAttemptAvgAggregateInputType;
    _sum?: FetchAttemptSumAggregateInputType;
    _min?: FetchAttemptMinAggregateInputType;
    _max?: FetchAttemptMaxAggregateInputType;
};
export type FetchAttemptGroupByOutputType = {
    id: bigint;
    attemptedAt: Date;
    durationMs: number;
    success: boolean;
    errorMessage: string | null;
    metalsResolved: $Enums.MetalType[];
    triggeredBy: $Enums.FetchTrigger;
    _count: FetchAttemptCountAggregateOutputType | null;
    _avg: FetchAttemptAvgAggregateOutputType | null;
    _sum: FetchAttemptSumAggregateOutputType | null;
    _min: FetchAttemptMinAggregateOutputType | null;
    _max: FetchAttemptMaxAggregateOutputType | null;
};
export type GetFetchAttemptGroupByPayload<T extends FetchAttemptGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FetchAttemptGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FetchAttemptGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FetchAttemptGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FetchAttemptGroupByOutputType[P]>;
}>>;
export type FetchAttemptWhereInput = {
    AND?: Prisma.FetchAttemptWhereInput | Prisma.FetchAttemptWhereInput[];
    OR?: Prisma.FetchAttemptWhereInput[];
    NOT?: Prisma.FetchAttemptWhereInput | Prisma.FetchAttemptWhereInput[];
    id?: Prisma.BigIntFilter<"FetchAttempt"> | bigint | number;
    attemptedAt?: Prisma.DateTimeFilter<"FetchAttempt"> | Date | string;
    durationMs?: Prisma.IntFilter<"FetchAttempt"> | number;
    success?: Prisma.BoolFilter<"FetchAttempt"> | boolean;
    errorMessage?: Prisma.StringNullableFilter<"FetchAttempt"> | string | null;
    metalsResolved?: Prisma.EnumMetalTypeNullableListFilter<"FetchAttempt">;
    triggeredBy?: Prisma.EnumFetchTriggerFilter<"FetchAttempt"> | $Enums.FetchTrigger;
};
export type FetchAttemptOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    attemptedAt?: Prisma.SortOrder;
    durationMs?: Prisma.SortOrder;
    success?: Prisma.SortOrder;
    errorMessage?: Prisma.SortOrderInput | Prisma.SortOrder;
    metalsResolved?: Prisma.SortOrder;
    triggeredBy?: Prisma.SortOrder;
};
export type FetchAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    AND?: Prisma.FetchAttemptWhereInput | Prisma.FetchAttemptWhereInput[];
    OR?: Prisma.FetchAttemptWhereInput[];
    NOT?: Prisma.FetchAttemptWhereInput | Prisma.FetchAttemptWhereInput[];
    attemptedAt?: Prisma.DateTimeFilter<"FetchAttempt"> | Date | string;
    durationMs?: Prisma.IntFilter<"FetchAttempt"> | number;
    success?: Prisma.BoolFilter<"FetchAttempt"> | boolean;
    errorMessage?: Prisma.StringNullableFilter<"FetchAttempt"> | string | null;
    metalsResolved?: Prisma.EnumMetalTypeNullableListFilter<"FetchAttempt">;
    triggeredBy?: Prisma.EnumFetchTriggerFilter<"FetchAttempt"> | $Enums.FetchTrigger;
}, "id">;
export type FetchAttemptOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    attemptedAt?: Prisma.SortOrder;
    durationMs?: Prisma.SortOrder;
    success?: Prisma.SortOrder;
    errorMessage?: Prisma.SortOrderInput | Prisma.SortOrder;
    metalsResolved?: Prisma.SortOrder;
    triggeredBy?: Prisma.SortOrder;
    _count?: Prisma.FetchAttemptCountOrderByAggregateInput;
    _avg?: Prisma.FetchAttemptAvgOrderByAggregateInput;
    _max?: Prisma.FetchAttemptMaxOrderByAggregateInput;
    _min?: Prisma.FetchAttemptMinOrderByAggregateInput;
    _sum?: Prisma.FetchAttemptSumOrderByAggregateInput;
};
export type FetchAttemptScalarWhereWithAggregatesInput = {
    AND?: Prisma.FetchAttemptScalarWhereWithAggregatesInput | Prisma.FetchAttemptScalarWhereWithAggregatesInput[];
    OR?: Prisma.FetchAttemptScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FetchAttemptScalarWhereWithAggregatesInput | Prisma.FetchAttemptScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"FetchAttempt"> | bigint | number;
    attemptedAt?: Prisma.DateTimeWithAggregatesFilter<"FetchAttempt"> | Date | string;
    durationMs?: Prisma.IntWithAggregatesFilter<"FetchAttempt"> | number;
    success?: Prisma.BoolWithAggregatesFilter<"FetchAttempt"> | boolean;
    errorMessage?: Prisma.StringNullableWithAggregatesFilter<"FetchAttempt"> | string | null;
    metalsResolved?: Prisma.EnumMetalTypeNullableListFilter<"FetchAttempt">;
    triggeredBy?: Prisma.EnumFetchTriggerWithAggregatesFilter<"FetchAttempt"> | $Enums.FetchTrigger;
};
export type FetchAttemptCreateInput = {
    id?: bigint | number;
    attemptedAt?: Date | string;
    durationMs: number;
    success: boolean;
    errorMessage?: string | null;
    metalsResolved?: Prisma.FetchAttemptCreatemetalsResolvedInput | $Enums.MetalType[];
    triggeredBy: $Enums.FetchTrigger;
};
export type FetchAttemptUncheckedCreateInput = {
    id?: bigint | number;
    attemptedAt?: Date | string;
    durationMs: number;
    success: boolean;
    errorMessage?: string | null;
    metalsResolved?: Prisma.FetchAttemptCreatemetalsResolvedInput | $Enums.MetalType[];
    triggeredBy: $Enums.FetchTrigger;
};
export type FetchAttemptUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    attemptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    durationMs?: Prisma.IntFieldUpdateOperationsInput | number;
    success?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metalsResolved?: Prisma.FetchAttemptUpdatemetalsResolvedInput | $Enums.MetalType[];
    triggeredBy?: Prisma.EnumFetchTriggerFieldUpdateOperationsInput | $Enums.FetchTrigger;
};
export type FetchAttemptUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    attemptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    durationMs?: Prisma.IntFieldUpdateOperationsInput | number;
    success?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metalsResolved?: Prisma.FetchAttemptUpdatemetalsResolvedInput | $Enums.MetalType[];
    triggeredBy?: Prisma.EnumFetchTriggerFieldUpdateOperationsInput | $Enums.FetchTrigger;
};
export type FetchAttemptCreateManyInput = {
    id?: bigint | number;
    attemptedAt?: Date | string;
    durationMs: number;
    success: boolean;
    errorMessage?: string | null;
    metalsResolved?: Prisma.FetchAttemptCreatemetalsResolvedInput | $Enums.MetalType[];
    triggeredBy: $Enums.FetchTrigger;
};
export type FetchAttemptUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    attemptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    durationMs?: Prisma.IntFieldUpdateOperationsInput | number;
    success?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metalsResolved?: Prisma.FetchAttemptUpdatemetalsResolvedInput | $Enums.MetalType[];
    triggeredBy?: Prisma.EnumFetchTriggerFieldUpdateOperationsInput | $Enums.FetchTrigger;
};
export type FetchAttemptUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    attemptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    durationMs?: Prisma.IntFieldUpdateOperationsInput | number;
    success?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metalsResolved?: Prisma.FetchAttemptUpdatemetalsResolvedInput | $Enums.MetalType[];
    triggeredBy?: Prisma.EnumFetchTriggerFieldUpdateOperationsInput | $Enums.FetchTrigger;
};
export type EnumMetalTypeNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel> | null;
    has?: $Enums.MetalType | Prisma.EnumMetalTypeFieldRefInput<$PrismaModel> | null;
    hasEvery?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    hasSome?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type FetchAttemptCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    attemptedAt?: Prisma.SortOrder;
    durationMs?: Prisma.SortOrder;
    success?: Prisma.SortOrder;
    errorMessage?: Prisma.SortOrder;
    metalsResolved?: Prisma.SortOrder;
    triggeredBy?: Prisma.SortOrder;
};
export type FetchAttemptAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    durationMs?: Prisma.SortOrder;
};
export type FetchAttemptMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    attemptedAt?: Prisma.SortOrder;
    durationMs?: Prisma.SortOrder;
    success?: Prisma.SortOrder;
    errorMessage?: Prisma.SortOrder;
    triggeredBy?: Prisma.SortOrder;
};
export type FetchAttemptMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    attemptedAt?: Prisma.SortOrder;
    durationMs?: Prisma.SortOrder;
    success?: Prisma.SortOrder;
    errorMessage?: Prisma.SortOrder;
    triggeredBy?: Prisma.SortOrder;
};
export type FetchAttemptSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    durationMs?: Prisma.SortOrder;
};
export type FetchAttemptCreatemetalsResolvedInput = {
    set: $Enums.MetalType[];
};
export type FetchAttemptUpdatemetalsResolvedInput = {
    set?: $Enums.MetalType[];
    push?: $Enums.MetalType | $Enums.MetalType[];
};
export type EnumFetchTriggerFieldUpdateOperationsInput = {
    set?: $Enums.FetchTrigger;
};
export type FetchAttemptSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    attemptedAt?: boolean;
    durationMs?: boolean;
    success?: boolean;
    errorMessage?: boolean;
    metalsResolved?: boolean;
    triggeredBy?: boolean;
}, ExtArgs["result"]["fetchAttempt"]>;
export type FetchAttemptSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    attemptedAt?: boolean;
    durationMs?: boolean;
    success?: boolean;
    errorMessage?: boolean;
    metalsResolved?: boolean;
    triggeredBy?: boolean;
}, ExtArgs["result"]["fetchAttempt"]>;
export type FetchAttemptSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    attemptedAt?: boolean;
    durationMs?: boolean;
    success?: boolean;
    errorMessage?: boolean;
    metalsResolved?: boolean;
    triggeredBy?: boolean;
}, ExtArgs["result"]["fetchAttempt"]>;
export type FetchAttemptSelectScalar = {
    id?: boolean;
    attemptedAt?: boolean;
    durationMs?: boolean;
    success?: boolean;
    errorMessage?: boolean;
    metalsResolved?: boolean;
    triggeredBy?: boolean;
};
export type FetchAttemptOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "attemptedAt" | "durationMs" | "success" | "errorMessage" | "metalsResolved" | "triggeredBy", ExtArgs["result"]["fetchAttempt"]>;
export type $FetchAttemptPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FetchAttempt";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        attemptedAt: Date;
        durationMs: number;
        success: boolean;
        errorMessage: string | null;
        metalsResolved: $Enums.MetalType[];
        triggeredBy: $Enums.FetchTrigger;
    }, ExtArgs["result"]["fetchAttempt"]>;
    composites: {};
};
export type FetchAttemptGetPayload<S extends boolean | null | undefined | FetchAttemptDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload, S>;
export type FetchAttemptCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FetchAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FetchAttemptCountAggregateInputType | true;
};
export interface FetchAttemptDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FetchAttempt'];
        meta: {
            name: 'FetchAttempt';
        };
    };
    findUnique<T extends FetchAttemptFindUniqueArgs>(args: Prisma.SelectSubset<T, FetchAttemptFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FetchAttemptClient<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FetchAttemptFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FetchAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FetchAttemptClient<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FetchAttemptFindFirstArgs>(args?: Prisma.SelectSubset<T, FetchAttemptFindFirstArgs<ExtArgs>>): Prisma.Prisma__FetchAttemptClient<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FetchAttemptFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FetchAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FetchAttemptClient<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FetchAttemptFindManyArgs>(args?: Prisma.SelectSubset<T, FetchAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FetchAttemptCreateArgs>(args: Prisma.SelectSubset<T, FetchAttemptCreateArgs<ExtArgs>>): Prisma.Prisma__FetchAttemptClient<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FetchAttemptCreateManyArgs>(args?: Prisma.SelectSubset<T, FetchAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FetchAttemptCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FetchAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FetchAttemptDeleteArgs>(args: Prisma.SelectSubset<T, FetchAttemptDeleteArgs<ExtArgs>>): Prisma.Prisma__FetchAttemptClient<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FetchAttemptUpdateArgs>(args: Prisma.SelectSubset<T, FetchAttemptUpdateArgs<ExtArgs>>): Prisma.Prisma__FetchAttemptClient<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FetchAttemptDeleteManyArgs>(args?: Prisma.SelectSubset<T, FetchAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FetchAttemptUpdateManyArgs>(args: Prisma.SelectSubset<T, FetchAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FetchAttemptUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FetchAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FetchAttemptUpsertArgs>(args: Prisma.SelectSubset<T, FetchAttemptUpsertArgs<ExtArgs>>): Prisma.Prisma__FetchAttemptClient<runtime.Types.Result.GetResult<Prisma.$FetchAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FetchAttemptCountArgs>(args?: Prisma.Subset<T, FetchAttemptCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FetchAttemptCountAggregateOutputType> : number>;
    aggregate<T extends FetchAttemptAggregateArgs>(args: Prisma.Subset<T, FetchAttemptAggregateArgs>): Prisma.PrismaPromise<GetFetchAttemptAggregateType<T>>;
    groupBy<T extends FetchAttemptGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FetchAttemptGroupByArgs['orderBy'];
    } : {
        orderBy?: FetchAttemptGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FetchAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFetchAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FetchAttemptFieldRefs;
}
export interface Prisma__FetchAttemptClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FetchAttemptFieldRefs {
    readonly id: Prisma.FieldRef<"FetchAttempt", 'BigInt'>;
    readonly attemptedAt: Prisma.FieldRef<"FetchAttempt", 'DateTime'>;
    readonly durationMs: Prisma.FieldRef<"FetchAttempt", 'Int'>;
    readonly success: Prisma.FieldRef<"FetchAttempt", 'Boolean'>;
    readonly errorMessage: Prisma.FieldRef<"FetchAttempt", 'String'>;
    readonly metalsResolved: Prisma.FieldRef<"FetchAttempt", 'MetalType[]'>;
    readonly triggeredBy: Prisma.FieldRef<"FetchAttempt", 'FetchTrigger'>;
}
export type FetchAttemptFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    where: Prisma.FetchAttemptWhereUniqueInput;
};
export type FetchAttemptFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    where: Prisma.FetchAttemptWhereUniqueInput;
};
export type FetchAttemptFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    where?: Prisma.FetchAttemptWhereInput;
    orderBy?: Prisma.FetchAttemptOrderByWithRelationInput | Prisma.FetchAttemptOrderByWithRelationInput[];
    cursor?: Prisma.FetchAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FetchAttemptScalarFieldEnum | Prisma.FetchAttemptScalarFieldEnum[];
};
export type FetchAttemptFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    where?: Prisma.FetchAttemptWhereInput;
    orderBy?: Prisma.FetchAttemptOrderByWithRelationInput | Prisma.FetchAttemptOrderByWithRelationInput[];
    cursor?: Prisma.FetchAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FetchAttemptScalarFieldEnum | Prisma.FetchAttemptScalarFieldEnum[];
};
export type FetchAttemptFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    where?: Prisma.FetchAttemptWhereInput;
    orderBy?: Prisma.FetchAttemptOrderByWithRelationInput | Prisma.FetchAttemptOrderByWithRelationInput[];
    cursor?: Prisma.FetchAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FetchAttemptScalarFieldEnum | Prisma.FetchAttemptScalarFieldEnum[];
};
export type FetchAttemptCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FetchAttemptCreateInput, Prisma.FetchAttemptUncheckedCreateInput>;
};
export type FetchAttemptCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FetchAttemptCreateManyInput | Prisma.FetchAttemptCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FetchAttemptCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    data: Prisma.FetchAttemptCreateManyInput | Prisma.FetchAttemptCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FetchAttemptUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FetchAttemptUpdateInput, Prisma.FetchAttemptUncheckedUpdateInput>;
    where: Prisma.FetchAttemptWhereUniqueInput;
};
export type FetchAttemptUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FetchAttemptUpdateManyMutationInput, Prisma.FetchAttemptUncheckedUpdateManyInput>;
    where?: Prisma.FetchAttemptWhereInput;
    limit?: number;
};
export type FetchAttemptUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FetchAttemptUpdateManyMutationInput, Prisma.FetchAttemptUncheckedUpdateManyInput>;
    where?: Prisma.FetchAttemptWhereInput;
    limit?: number;
};
export type FetchAttemptUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    where: Prisma.FetchAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.FetchAttemptCreateInput, Prisma.FetchAttemptUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FetchAttemptUpdateInput, Prisma.FetchAttemptUncheckedUpdateInput>;
};
export type FetchAttemptDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
    where: Prisma.FetchAttemptWhereUniqueInput;
};
export type FetchAttemptDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FetchAttemptWhereInput;
    limit?: number;
};
export type FetchAttemptDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FetchAttemptSelect<ExtArgs> | null;
    omit?: Prisma.FetchAttemptOmit<ExtArgs> | null;
};
//# sourceMappingURL=FetchAttempt.d.ts.map