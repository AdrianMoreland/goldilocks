import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RoadmapSyncStateModel = runtime.Types.Result.DefaultSelection<Prisma.$RoadmapSyncStatePayload>;
export type AggregateRoadmapSyncState = {
    _count: RoadmapSyncStateCountAggregateOutputType | null;
    _avg: RoadmapSyncStateAvgAggregateOutputType | null;
    _sum: RoadmapSyncStateSumAggregateOutputType | null;
    _min: RoadmapSyncStateMinAggregateOutputType | null;
    _max: RoadmapSyncStateMaxAggregateOutputType | null;
};
export type RoadmapSyncStateAvgAggregateOutputType = {
    id: number | null;
};
export type RoadmapSyncStateSumAggregateOutputType = {
    id: number | null;
};
export type RoadmapSyncStateMinAggregateOutputType = {
    id: number | null;
    baseCommit: string | null;
    baseMarkdown: string | null;
    syncedAt: Date | null;
    syncedBy: string | null;
};
export type RoadmapSyncStateMaxAggregateOutputType = {
    id: number | null;
    baseCommit: string | null;
    baseMarkdown: string | null;
    syncedAt: Date | null;
    syncedBy: string | null;
};
export type RoadmapSyncStateCountAggregateOutputType = {
    id: number;
    baseCommit: number;
    baseMarkdown: number;
    syncedAt: number;
    syncedBy: number;
    _all: number;
};
export type RoadmapSyncStateAvgAggregateInputType = {
    id?: true;
};
export type RoadmapSyncStateSumAggregateInputType = {
    id?: true;
};
export type RoadmapSyncStateMinAggregateInputType = {
    id?: true;
    baseCommit?: true;
    baseMarkdown?: true;
    syncedAt?: true;
    syncedBy?: true;
};
export type RoadmapSyncStateMaxAggregateInputType = {
    id?: true;
    baseCommit?: true;
    baseMarkdown?: true;
    syncedAt?: true;
    syncedBy?: true;
};
export type RoadmapSyncStateCountAggregateInputType = {
    id?: true;
    baseCommit?: true;
    baseMarkdown?: true;
    syncedAt?: true;
    syncedBy?: true;
    _all?: true;
};
export type RoadmapSyncStateAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapSyncStateWhereInput;
    orderBy?: Prisma.RoadmapSyncStateOrderByWithRelationInput | Prisma.RoadmapSyncStateOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapSyncStateWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RoadmapSyncStateCountAggregateInputType;
    _avg?: RoadmapSyncStateAvgAggregateInputType;
    _sum?: RoadmapSyncStateSumAggregateInputType;
    _min?: RoadmapSyncStateMinAggregateInputType;
    _max?: RoadmapSyncStateMaxAggregateInputType;
};
export type GetRoadmapSyncStateAggregateType<T extends RoadmapSyncStateAggregateArgs> = {
    [P in keyof T & keyof AggregateRoadmapSyncState]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRoadmapSyncState[P]> : Prisma.GetScalarType<T[P], AggregateRoadmapSyncState[P]>;
};
export type RoadmapSyncStateGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapSyncStateWhereInput;
    orderBy?: Prisma.RoadmapSyncStateOrderByWithAggregationInput | Prisma.RoadmapSyncStateOrderByWithAggregationInput[];
    by: Prisma.RoadmapSyncStateScalarFieldEnum[] | Prisma.RoadmapSyncStateScalarFieldEnum;
    having?: Prisma.RoadmapSyncStateScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RoadmapSyncStateCountAggregateInputType | true;
    _avg?: RoadmapSyncStateAvgAggregateInputType;
    _sum?: RoadmapSyncStateSumAggregateInputType;
    _min?: RoadmapSyncStateMinAggregateInputType;
    _max?: RoadmapSyncStateMaxAggregateInputType;
};
export type RoadmapSyncStateGroupByOutputType = {
    id: number;
    baseCommit: string;
    baseMarkdown: string;
    syncedAt: Date;
    syncedBy: string;
    _count: RoadmapSyncStateCountAggregateOutputType | null;
    _avg: RoadmapSyncStateAvgAggregateOutputType | null;
    _sum: RoadmapSyncStateSumAggregateOutputType | null;
    _min: RoadmapSyncStateMinAggregateOutputType | null;
    _max: RoadmapSyncStateMaxAggregateOutputType | null;
};
export type GetRoadmapSyncStateGroupByPayload<T extends RoadmapSyncStateGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RoadmapSyncStateGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RoadmapSyncStateGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RoadmapSyncStateGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RoadmapSyncStateGroupByOutputType[P]>;
}>>;
export type RoadmapSyncStateWhereInput = {
    AND?: Prisma.RoadmapSyncStateWhereInput | Prisma.RoadmapSyncStateWhereInput[];
    OR?: Prisma.RoadmapSyncStateWhereInput[];
    NOT?: Prisma.RoadmapSyncStateWhereInput | Prisma.RoadmapSyncStateWhereInput[];
    id?: Prisma.IntFilter<"RoadmapSyncState"> | number;
    baseCommit?: Prisma.StringFilter<"RoadmapSyncState"> | string;
    baseMarkdown?: Prisma.StringFilter<"RoadmapSyncState"> | string;
    syncedAt?: Prisma.DateTimeFilter<"RoadmapSyncState"> | Date | string;
    syncedBy?: Prisma.StringFilter<"RoadmapSyncState"> | string;
};
export type RoadmapSyncStateOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    baseCommit?: Prisma.SortOrder;
    baseMarkdown?: Prisma.SortOrder;
    syncedAt?: Prisma.SortOrder;
    syncedBy?: Prisma.SortOrder;
};
export type RoadmapSyncStateWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.RoadmapSyncStateWhereInput | Prisma.RoadmapSyncStateWhereInput[];
    OR?: Prisma.RoadmapSyncStateWhereInput[];
    NOT?: Prisma.RoadmapSyncStateWhereInput | Prisma.RoadmapSyncStateWhereInput[];
    baseCommit?: Prisma.StringFilter<"RoadmapSyncState"> | string;
    baseMarkdown?: Prisma.StringFilter<"RoadmapSyncState"> | string;
    syncedAt?: Prisma.DateTimeFilter<"RoadmapSyncState"> | Date | string;
    syncedBy?: Prisma.StringFilter<"RoadmapSyncState"> | string;
}, "id">;
export type RoadmapSyncStateOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    baseCommit?: Prisma.SortOrder;
    baseMarkdown?: Prisma.SortOrder;
    syncedAt?: Prisma.SortOrder;
    syncedBy?: Prisma.SortOrder;
    _count?: Prisma.RoadmapSyncStateCountOrderByAggregateInput;
    _avg?: Prisma.RoadmapSyncStateAvgOrderByAggregateInput;
    _max?: Prisma.RoadmapSyncStateMaxOrderByAggregateInput;
    _min?: Prisma.RoadmapSyncStateMinOrderByAggregateInput;
    _sum?: Prisma.RoadmapSyncStateSumOrderByAggregateInput;
};
export type RoadmapSyncStateScalarWhereWithAggregatesInput = {
    AND?: Prisma.RoadmapSyncStateScalarWhereWithAggregatesInput | Prisma.RoadmapSyncStateScalarWhereWithAggregatesInput[];
    OR?: Prisma.RoadmapSyncStateScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RoadmapSyncStateScalarWhereWithAggregatesInput | Prisma.RoadmapSyncStateScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"RoadmapSyncState"> | number;
    baseCommit?: Prisma.StringWithAggregatesFilter<"RoadmapSyncState"> | string;
    baseMarkdown?: Prisma.StringWithAggregatesFilter<"RoadmapSyncState"> | string;
    syncedAt?: Prisma.DateTimeWithAggregatesFilter<"RoadmapSyncState"> | Date | string;
    syncedBy?: Prisma.StringWithAggregatesFilter<"RoadmapSyncState"> | string;
};
export type RoadmapSyncStateCreateInput = {
    id: number;
    baseCommit: string;
    baseMarkdown: string;
    syncedAt: Date | string;
    syncedBy: string;
};
export type RoadmapSyncStateUncheckedCreateInput = {
    id: number;
    baseCommit: string;
    baseMarkdown: string;
    syncedAt: Date | string;
    syncedBy: string;
};
export type RoadmapSyncStateUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    baseCommit?: Prisma.StringFieldUpdateOperationsInput | string;
    baseMarkdown?: Prisma.StringFieldUpdateOperationsInput | string;
    syncedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncedBy?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type RoadmapSyncStateUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    baseCommit?: Prisma.StringFieldUpdateOperationsInput | string;
    baseMarkdown?: Prisma.StringFieldUpdateOperationsInput | string;
    syncedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncedBy?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type RoadmapSyncStateCreateManyInput = {
    id: number;
    baseCommit: string;
    baseMarkdown: string;
    syncedAt: Date | string;
    syncedBy: string;
};
export type RoadmapSyncStateUpdateManyMutationInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    baseCommit?: Prisma.StringFieldUpdateOperationsInput | string;
    baseMarkdown?: Prisma.StringFieldUpdateOperationsInput | string;
    syncedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncedBy?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type RoadmapSyncStateUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    baseCommit?: Prisma.StringFieldUpdateOperationsInput | string;
    baseMarkdown?: Prisma.StringFieldUpdateOperationsInput | string;
    syncedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncedBy?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type RoadmapSyncStateCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    baseCommit?: Prisma.SortOrder;
    baseMarkdown?: Prisma.SortOrder;
    syncedAt?: Prisma.SortOrder;
    syncedBy?: Prisma.SortOrder;
};
export type RoadmapSyncStateAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type RoadmapSyncStateMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    baseCommit?: Prisma.SortOrder;
    baseMarkdown?: Prisma.SortOrder;
    syncedAt?: Prisma.SortOrder;
    syncedBy?: Prisma.SortOrder;
};
export type RoadmapSyncStateMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    baseCommit?: Prisma.SortOrder;
    baseMarkdown?: Prisma.SortOrder;
    syncedAt?: Prisma.SortOrder;
    syncedBy?: Prisma.SortOrder;
};
export type RoadmapSyncStateSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type RoadmapSyncStateSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    baseCommit?: boolean;
    baseMarkdown?: boolean;
    syncedAt?: boolean;
    syncedBy?: boolean;
}, ExtArgs["result"]["roadmapSyncState"]>;
export type RoadmapSyncStateSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    baseCommit?: boolean;
    baseMarkdown?: boolean;
    syncedAt?: boolean;
    syncedBy?: boolean;
}, ExtArgs["result"]["roadmapSyncState"]>;
export type RoadmapSyncStateSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    baseCommit?: boolean;
    baseMarkdown?: boolean;
    syncedAt?: boolean;
    syncedBy?: boolean;
}, ExtArgs["result"]["roadmapSyncState"]>;
export type RoadmapSyncStateSelectScalar = {
    id?: boolean;
    baseCommit?: boolean;
    baseMarkdown?: boolean;
    syncedAt?: boolean;
    syncedBy?: boolean;
};
export type RoadmapSyncStateOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "baseCommit" | "baseMarkdown" | "syncedAt" | "syncedBy", ExtArgs["result"]["roadmapSyncState"]>;
export type $RoadmapSyncStatePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RoadmapSyncState";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        baseCommit: string;
        baseMarkdown: string;
        syncedAt: Date;
        syncedBy: string;
    }, ExtArgs["result"]["roadmapSyncState"]>;
    composites: {};
};
export type RoadmapSyncStateGetPayload<S extends boolean | null | undefined | RoadmapSyncStateDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload, S>;
export type RoadmapSyncStateCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RoadmapSyncStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RoadmapSyncStateCountAggregateInputType | true;
};
export interface RoadmapSyncStateDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RoadmapSyncState'];
        meta: {
            name: 'RoadmapSyncState';
        };
    };
    findUnique<T extends RoadmapSyncStateFindUniqueArgs>(args: Prisma.SelectSubset<T, RoadmapSyncStateFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RoadmapSyncStateClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RoadmapSyncStateFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RoadmapSyncStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapSyncStateClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RoadmapSyncStateFindFirstArgs>(args?: Prisma.SelectSubset<T, RoadmapSyncStateFindFirstArgs<ExtArgs>>): Prisma.Prisma__RoadmapSyncStateClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RoadmapSyncStateFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RoadmapSyncStateFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapSyncStateClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RoadmapSyncStateFindManyArgs>(args?: Prisma.SelectSubset<T, RoadmapSyncStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RoadmapSyncStateCreateArgs>(args: Prisma.SelectSubset<T, RoadmapSyncStateCreateArgs<ExtArgs>>): Prisma.Prisma__RoadmapSyncStateClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RoadmapSyncStateCreateManyArgs>(args?: Prisma.SelectSubset<T, RoadmapSyncStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RoadmapSyncStateCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RoadmapSyncStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RoadmapSyncStateDeleteArgs>(args: Prisma.SelectSubset<T, RoadmapSyncStateDeleteArgs<ExtArgs>>): Prisma.Prisma__RoadmapSyncStateClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RoadmapSyncStateUpdateArgs>(args: Prisma.SelectSubset<T, RoadmapSyncStateUpdateArgs<ExtArgs>>): Prisma.Prisma__RoadmapSyncStateClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RoadmapSyncStateDeleteManyArgs>(args?: Prisma.SelectSubset<T, RoadmapSyncStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RoadmapSyncStateUpdateManyArgs>(args: Prisma.SelectSubset<T, RoadmapSyncStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RoadmapSyncStateUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RoadmapSyncStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RoadmapSyncStateUpsertArgs>(args: Prisma.SelectSubset<T, RoadmapSyncStateUpsertArgs<ExtArgs>>): Prisma.Prisma__RoadmapSyncStateClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSyncStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RoadmapSyncStateCountArgs>(args?: Prisma.Subset<T, RoadmapSyncStateCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RoadmapSyncStateCountAggregateOutputType> : number>;
    aggregate<T extends RoadmapSyncStateAggregateArgs>(args: Prisma.Subset<T, RoadmapSyncStateAggregateArgs>): Prisma.PrismaPromise<GetRoadmapSyncStateAggregateType<T>>;
    groupBy<T extends RoadmapSyncStateGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RoadmapSyncStateGroupByArgs['orderBy'];
    } : {
        orderBy?: RoadmapSyncStateGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RoadmapSyncStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapSyncStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RoadmapSyncStateFieldRefs;
}
export interface Prisma__RoadmapSyncStateClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RoadmapSyncStateFieldRefs {
    readonly id: Prisma.FieldRef<"RoadmapSyncState", 'Int'>;
    readonly baseCommit: Prisma.FieldRef<"RoadmapSyncState", 'String'>;
    readonly baseMarkdown: Prisma.FieldRef<"RoadmapSyncState", 'String'>;
    readonly syncedAt: Prisma.FieldRef<"RoadmapSyncState", 'DateTime'>;
    readonly syncedBy: Prisma.FieldRef<"RoadmapSyncState", 'String'>;
}
export type RoadmapSyncStateFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    where: Prisma.RoadmapSyncStateWhereUniqueInput;
};
export type RoadmapSyncStateFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    where: Prisma.RoadmapSyncStateWhereUniqueInput;
};
export type RoadmapSyncStateFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    where?: Prisma.RoadmapSyncStateWhereInput;
    orderBy?: Prisma.RoadmapSyncStateOrderByWithRelationInput | Prisma.RoadmapSyncStateOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapSyncStateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapSyncStateScalarFieldEnum | Prisma.RoadmapSyncStateScalarFieldEnum[];
};
export type RoadmapSyncStateFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    where?: Prisma.RoadmapSyncStateWhereInput;
    orderBy?: Prisma.RoadmapSyncStateOrderByWithRelationInput | Prisma.RoadmapSyncStateOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapSyncStateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapSyncStateScalarFieldEnum | Prisma.RoadmapSyncStateScalarFieldEnum[];
};
export type RoadmapSyncStateFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    where?: Prisma.RoadmapSyncStateWhereInput;
    orderBy?: Prisma.RoadmapSyncStateOrderByWithRelationInput | Prisma.RoadmapSyncStateOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapSyncStateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapSyncStateScalarFieldEnum | Prisma.RoadmapSyncStateScalarFieldEnum[];
};
export type RoadmapSyncStateCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapSyncStateCreateInput, Prisma.RoadmapSyncStateUncheckedCreateInput>;
};
export type RoadmapSyncStateCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RoadmapSyncStateCreateManyInput | Prisma.RoadmapSyncStateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoadmapSyncStateCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    data: Prisma.RoadmapSyncStateCreateManyInput | Prisma.RoadmapSyncStateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoadmapSyncStateUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapSyncStateUpdateInput, Prisma.RoadmapSyncStateUncheckedUpdateInput>;
    where: Prisma.RoadmapSyncStateWhereUniqueInput;
};
export type RoadmapSyncStateUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RoadmapSyncStateUpdateManyMutationInput, Prisma.RoadmapSyncStateUncheckedUpdateManyInput>;
    where?: Prisma.RoadmapSyncStateWhereInput;
    limit?: number;
};
export type RoadmapSyncStateUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapSyncStateUpdateManyMutationInput, Prisma.RoadmapSyncStateUncheckedUpdateManyInput>;
    where?: Prisma.RoadmapSyncStateWhereInput;
    limit?: number;
};
export type RoadmapSyncStateUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    where: Prisma.RoadmapSyncStateWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoadmapSyncStateCreateInput, Prisma.RoadmapSyncStateUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RoadmapSyncStateUpdateInput, Prisma.RoadmapSyncStateUncheckedUpdateInput>;
};
export type RoadmapSyncStateDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
    where: Prisma.RoadmapSyncStateWhereUniqueInput;
};
export type RoadmapSyncStateDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapSyncStateWhereInput;
    limit?: number;
};
export type RoadmapSyncStateDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSyncStateSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSyncStateOmit<ExtArgs> | null;
};
//# sourceMappingURL=RoadmapSyncState.d.ts.map