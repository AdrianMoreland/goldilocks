import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type MarketModeStateModel = runtime.Types.Result.DefaultSelection<Prisma.$MarketModeStatePayload>;
export type AggregateMarketModeState = {
    _count: MarketModeStateCountAggregateOutputType | null;
    _avg: MarketModeStateAvgAggregateOutputType | null;
    _sum: MarketModeStateSumAggregateOutputType | null;
    _min: MarketModeStateMinAggregateOutputType | null;
    _max: MarketModeStateMaxAggregateOutputType | null;
};
export type MarketModeStateAvgAggregateOutputType = {
    id: number | null;
};
export type MarketModeStateSumAggregateOutputType = {
    id: number | null;
};
export type MarketModeStateMinAggregateOutputType = {
    id: number | null;
    weekend: boolean | null;
    volatile: boolean | null;
    shortage: boolean | null;
    updatedBy: string | null;
    updatedAt: Date | null;
};
export type MarketModeStateMaxAggregateOutputType = {
    id: number | null;
    weekend: boolean | null;
    volatile: boolean | null;
    shortage: boolean | null;
    updatedBy: string | null;
    updatedAt: Date | null;
};
export type MarketModeStateCountAggregateOutputType = {
    id: number;
    weekend: number;
    volatile: number;
    shortage: number;
    updatedBy: number;
    updatedAt: number;
    _all: number;
};
export type MarketModeStateAvgAggregateInputType = {
    id?: true;
};
export type MarketModeStateSumAggregateInputType = {
    id?: true;
};
export type MarketModeStateMinAggregateInputType = {
    id?: true;
    weekend?: true;
    volatile?: true;
    shortage?: true;
    updatedBy?: true;
    updatedAt?: true;
};
export type MarketModeStateMaxAggregateInputType = {
    id?: true;
    weekend?: true;
    volatile?: true;
    shortage?: true;
    updatedBy?: true;
    updatedAt?: true;
};
export type MarketModeStateCountAggregateInputType = {
    id?: true;
    weekend?: true;
    volatile?: true;
    shortage?: true;
    updatedBy?: true;
    updatedAt?: true;
    _all?: true;
};
export type MarketModeStateAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MarketModeStateWhereInput;
    orderBy?: Prisma.MarketModeStateOrderByWithRelationInput | Prisma.MarketModeStateOrderByWithRelationInput[];
    cursor?: Prisma.MarketModeStateWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MarketModeStateCountAggregateInputType;
    _avg?: MarketModeStateAvgAggregateInputType;
    _sum?: MarketModeStateSumAggregateInputType;
    _min?: MarketModeStateMinAggregateInputType;
    _max?: MarketModeStateMaxAggregateInputType;
};
export type GetMarketModeStateAggregateType<T extends MarketModeStateAggregateArgs> = {
    [P in keyof T & keyof AggregateMarketModeState]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMarketModeState[P]> : Prisma.GetScalarType<T[P], AggregateMarketModeState[P]>;
};
export type MarketModeStateGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MarketModeStateWhereInput;
    orderBy?: Prisma.MarketModeStateOrderByWithAggregationInput | Prisma.MarketModeStateOrderByWithAggregationInput[];
    by: Prisma.MarketModeStateScalarFieldEnum[] | Prisma.MarketModeStateScalarFieldEnum;
    having?: Prisma.MarketModeStateScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MarketModeStateCountAggregateInputType | true;
    _avg?: MarketModeStateAvgAggregateInputType;
    _sum?: MarketModeStateSumAggregateInputType;
    _min?: MarketModeStateMinAggregateInputType;
    _max?: MarketModeStateMaxAggregateInputType;
};
export type MarketModeStateGroupByOutputType = {
    id: number;
    weekend: boolean;
    volatile: boolean;
    shortage: boolean;
    updatedBy: string | null;
    updatedAt: Date;
    _count: MarketModeStateCountAggregateOutputType | null;
    _avg: MarketModeStateAvgAggregateOutputType | null;
    _sum: MarketModeStateSumAggregateOutputType | null;
    _min: MarketModeStateMinAggregateOutputType | null;
    _max: MarketModeStateMaxAggregateOutputType | null;
};
export type GetMarketModeStateGroupByPayload<T extends MarketModeStateGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MarketModeStateGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MarketModeStateGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MarketModeStateGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MarketModeStateGroupByOutputType[P]>;
}>>;
export type MarketModeStateWhereInput = {
    AND?: Prisma.MarketModeStateWhereInput | Prisma.MarketModeStateWhereInput[];
    OR?: Prisma.MarketModeStateWhereInput[];
    NOT?: Prisma.MarketModeStateWhereInput | Prisma.MarketModeStateWhereInput[];
    id?: Prisma.IntFilter<"MarketModeState"> | number;
    weekend?: Prisma.BoolFilter<"MarketModeState"> | boolean;
    volatile?: Prisma.BoolFilter<"MarketModeState"> | boolean;
    shortage?: Prisma.BoolFilter<"MarketModeState"> | boolean;
    updatedBy?: Prisma.StringNullableFilter<"MarketModeState"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"MarketModeState"> | Date | string;
};
export type MarketModeStateOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    weekend?: Prisma.SortOrder;
    volatile?: Prisma.SortOrder;
    shortage?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MarketModeStateWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.MarketModeStateWhereInput | Prisma.MarketModeStateWhereInput[];
    OR?: Prisma.MarketModeStateWhereInput[];
    NOT?: Prisma.MarketModeStateWhereInput | Prisma.MarketModeStateWhereInput[];
    weekend?: Prisma.BoolFilter<"MarketModeState"> | boolean;
    volatile?: Prisma.BoolFilter<"MarketModeState"> | boolean;
    shortage?: Prisma.BoolFilter<"MarketModeState"> | boolean;
    updatedBy?: Prisma.StringNullableFilter<"MarketModeState"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"MarketModeState"> | Date | string;
}, "id">;
export type MarketModeStateOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    weekend?: Prisma.SortOrder;
    volatile?: Prisma.SortOrder;
    shortage?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MarketModeStateCountOrderByAggregateInput;
    _avg?: Prisma.MarketModeStateAvgOrderByAggregateInput;
    _max?: Prisma.MarketModeStateMaxOrderByAggregateInput;
    _min?: Prisma.MarketModeStateMinOrderByAggregateInput;
    _sum?: Prisma.MarketModeStateSumOrderByAggregateInput;
};
export type MarketModeStateScalarWhereWithAggregatesInput = {
    AND?: Prisma.MarketModeStateScalarWhereWithAggregatesInput | Prisma.MarketModeStateScalarWhereWithAggregatesInput[];
    OR?: Prisma.MarketModeStateScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MarketModeStateScalarWhereWithAggregatesInput | Prisma.MarketModeStateScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"MarketModeState"> | number;
    weekend?: Prisma.BoolWithAggregatesFilter<"MarketModeState"> | boolean;
    volatile?: Prisma.BoolWithAggregatesFilter<"MarketModeState"> | boolean;
    shortage?: Prisma.BoolWithAggregatesFilter<"MarketModeState"> | boolean;
    updatedBy?: Prisma.StringNullableWithAggregatesFilter<"MarketModeState"> | string | null;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"MarketModeState"> | Date | string;
};
export type MarketModeStateCreateInput = {
    id: number;
    weekend?: boolean;
    volatile?: boolean;
    shortage?: boolean;
    updatedBy?: string | null;
    updatedAt?: Date | string;
};
export type MarketModeStateUncheckedCreateInput = {
    id: number;
    weekend?: boolean;
    volatile?: boolean;
    shortage?: boolean;
    updatedBy?: string | null;
    updatedAt?: Date | string;
};
export type MarketModeStateUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    weekend?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    volatile?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    shortage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MarketModeStateUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    weekend?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    volatile?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    shortage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MarketModeStateCreateManyInput = {
    id: number;
    weekend?: boolean;
    volatile?: boolean;
    shortage?: boolean;
    updatedBy?: string | null;
    updatedAt?: Date | string;
};
export type MarketModeStateUpdateManyMutationInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    weekend?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    volatile?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    shortage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MarketModeStateUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    weekend?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    volatile?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    shortage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MarketModeStateCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    weekend?: Prisma.SortOrder;
    volatile?: Prisma.SortOrder;
    shortage?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MarketModeStateAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type MarketModeStateMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    weekend?: Prisma.SortOrder;
    volatile?: Prisma.SortOrder;
    shortage?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MarketModeStateMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    weekend?: Prisma.SortOrder;
    volatile?: Prisma.SortOrder;
    shortage?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MarketModeStateSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type MarketModeStateSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    weekend?: boolean;
    volatile?: boolean;
    shortage?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["marketModeState"]>;
export type MarketModeStateSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    weekend?: boolean;
    volatile?: boolean;
    shortage?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["marketModeState"]>;
export type MarketModeStateSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    weekend?: boolean;
    volatile?: boolean;
    shortage?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["marketModeState"]>;
export type MarketModeStateSelectScalar = {
    id?: boolean;
    weekend?: boolean;
    volatile?: boolean;
    shortage?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
};
export type MarketModeStateOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "weekend" | "volatile" | "shortage" | "updatedBy" | "updatedAt", ExtArgs["result"]["marketModeState"]>;
export type $MarketModeStatePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MarketModeState";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        weekend: boolean;
        volatile: boolean;
        shortage: boolean;
        updatedBy: string | null;
        updatedAt: Date;
    }, ExtArgs["result"]["marketModeState"]>;
    composites: {};
};
export type MarketModeStateGetPayload<S extends boolean | null | undefined | MarketModeStateDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload, S>;
export type MarketModeStateCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MarketModeStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MarketModeStateCountAggregateInputType | true;
};
export interface MarketModeStateDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MarketModeState'];
        meta: {
            name: 'MarketModeState';
        };
    };
    findUnique<T extends MarketModeStateFindUniqueArgs>(args: Prisma.SelectSubset<T, MarketModeStateFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MarketModeStateClient<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MarketModeStateFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MarketModeStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MarketModeStateClient<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MarketModeStateFindFirstArgs>(args?: Prisma.SelectSubset<T, MarketModeStateFindFirstArgs<ExtArgs>>): Prisma.Prisma__MarketModeStateClient<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MarketModeStateFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MarketModeStateFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MarketModeStateClient<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MarketModeStateFindManyArgs>(args?: Prisma.SelectSubset<T, MarketModeStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MarketModeStateCreateArgs>(args: Prisma.SelectSubset<T, MarketModeStateCreateArgs<ExtArgs>>): Prisma.Prisma__MarketModeStateClient<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MarketModeStateCreateManyArgs>(args?: Prisma.SelectSubset<T, MarketModeStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MarketModeStateCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MarketModeStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MarketModeStateDeleteArgs>(args: Prisma.SelectSubset<T, MarketModeStateDeleteArgs<ExtArgs>>): Prisma.Prisma__MarketModeStateClient<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MarketModeStateUpdateArgs>(args: Prisma.SelectSubset<T, MarketModeStateUpdateArgs<ExtArgs>>): Prisma.Prisma__MarketModeStateClient<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MarketModeStateDeleteManyArgs>(args?: Prisma.SelectSubset<T, MarketModeStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MarketModeStateUpdateManyArgs>(args: Prisma.SelectSubset<T, MarketModeStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MarketModeStateUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MarketModeStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MarketModeStateUpsertArgs>(args: Prisma.SelectSubset<T, MarketModeStateUpsertArgs<ExtArgs>>): Prisma.Prisma__MarketModeStateClient<runtime.Types.Result.GetResult<Prisma.$MarketModeStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MarketModeStateCountArgs>(args?: Prisma.Subset<T, MarketModeStateCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MarketModeStateCountAggregateOutputType> : number>;
    aggregate<T extends MarketModeStateAggregateArgs>(args: Prisma.Subset<T, MarketModeStateAggregateArgs>): Prisma.PrismaPromise<GetMarketModeStateAggregateType<T>>;
    groupBy<T extends MarketModeStateGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MarketModeStateGroupByArgs['orderBy'];
    } : {
        orderBy?: MarketModeStateGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MarketModeStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarketModeStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MarketModeStateFieldRefs;
}
export interface Prisma__MarketModeStateClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MarketModeStateFieldRefs {
    readonly id: Prisma.FieldRef<"MarketModeState", 'Int'>;
    readonly weekend: Prisma.FieldRef<"MarketModeState", 'Boolean'>;
    readonly volatile: Prisma.FieldRef<"MarketModeState", 'Boolean'>;
    readonly shortage: Prisma.FieldRef<"MarketModeState", 'Boolean'>;
    readonly updatedBy: Prisma.FieldRef<"MarketModeState", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"MarketModeState", 'DateTime'>;
}
export type MarketModeStateFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    where: Prisma.MarketModeStateWhereUniqueInput;
};
export type MarketModeStateFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    where: Prisma.MarketModeStateWhereUniqueInput;
};
export type MarketModeStateFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    where?: Prisma.MarketModeStateWhereInput;
    orderBy?: Prisma.MarketModeStateOrderByWithRelationInput | Prisma.MarketModeStateOrderByWithRelationInput[];
    cursor?: Prisma.MarketModeStateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MarketModeStateScalarFieldEnum | Prisma.MarketModeStateScalarFieldEnum[];
};
export type MarketModeStateFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    where?: Prisma.MarketModeStateWhereInput;
    orderBy?: Prisma.MarketModeStateOrderByWithRelationInput | Prisma.MarketModeStateOrderByWithRelationInput[];
    cursor?: Prisma.MarketModeStateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MarketModeStateScalarFieldEnum | Prisma.MarketModeStateScalarFieldEnum[];
};
export type MarketModeStateFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    where?: Prisma.MarketModeStateWhereInput;
    orderBy?: Prisma.MarketModeStateOrderByWithRelationInput | Prisma.MarketModeStateOrderByWithRelationInput[];
    cursor?: Prisma.MarketModeStateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MarketModeStateScalarFieldEnum | Prisma.MarketModeStateScalarFieldEnum[];
};
export type MarketModeStateCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MarketModeStateCreateInput, Prisma.MarketModeStateUncheckedCreateInput>;
};
export type MarketModeStateCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MarketModeStateCreateManyInput | Prisma.MarketModeStateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MarketModeStateCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    data: Prisma.MarketModeStateCreateManyInput | Prisma.MarketModeStateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MarketModeStateUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MarketModeStateUpdateInput, Prisma.MarketModeStateUncheckedUpdateInput>;
    where: Prisma.MarketModeStateWhereUniqueInput;
};
export type MarketModeStateUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MarketModeStateUpdateManyMutationInput, Prisma.MarketModeStateUncheckedUpdateManyInput>;
    where?: Prisma.MarketModeStateWhereInput;
    limit?: number;
};
export type MarketModeStateUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MarketModeStateUpdateManyMutationInput, Prisma.MarketModeStateUncheckedUpdateManyInput>;
    where?: Prisma.MarketModeStateWhereInput;
    limit?: number;
};
export type MarketModeStateUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    where: Prisma.MarketModeStateWhereUniqueInput;
    create: Prisma.XOR<Prisma.MarketModeStateCreateInput, Prisma.MarketModeStateUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MarketModeStateUpdateInput, Prisma.MarketModeStateUncheckedUpdateInput>;
};
export type MarketModeStateDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
    where: Prisma.MarketModeStateWhereUniqueInput;
};
export type MarketModeStateDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MarketModeStateWhereInput;
    limit?: number;
};
export type MarketModeStateDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketModeStateSelect<ExtArgs> | null;
    omit?: Prisma.MarketModeStateOmit<ExtArgs> | null;
};
//# sourceMappingURL=MarketModeState.d.ts.map