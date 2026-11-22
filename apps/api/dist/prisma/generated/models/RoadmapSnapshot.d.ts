import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RoadmapSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$RoadmapSnapshotPayload>;
export type AggregateRoadmapSnapshot = {
    _count: RoadmapSnapshotCountAggregateOutputType | null;
    _avg: RoadmapSnapshotAvgAggregateOutputType | null;
    _sum: RoadmapSnapshotSumAggregateOutputType | null;
    _min: RoadmapSnapshotMinAggregateOutputType | null;
    _max: RoadmapSnapshotMaxAggregateOutputType | null;
};
export type RoadmapSnapshotAvgAggregateOutputType = {
    id: number | null;
    version: number | null;
};
export type RoadmapSnapshotSumAggregateOutputType = {
    id: number | null;
    version: number | null;
};
export type RoadmapSnapshotMinAggregateOutputType = {
    id: number | null;
    markdown: string | null;
    version: number | null;
    reason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type RoadmapSnapshotMaxAggregateOutputType = {
    id: number | null;
    markdown: string | null;
    version: number | null;
    reason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type RoadmapSnapshotCountAggregateOutputType = {
    id: number;
    markdown: number;
    version: number;
    reason: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type RoadmapSnapshotAvgAggregateInputType = {
    id?: true;
    version?: true;
};
export type RoadmapSnapshotSumAggregateInputType = {
    id?: true;
    version?: true;
};
export type RoadmapSnapshotMinAggregateInputType = {
    id?: true;
    markdown?: true;
    version?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type RoadmapSnapshotMaxAggregateInputType = {
    id?: true;
    markdown?: true;
    version?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type RoadmapSnapshotCountAggregateInputType = {
    id?: true;
    markdown?: true;
    version?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type RoadmapSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapSnapshotWhereInput;
    orderBy?: Prisma.RoadmapSnapshotOrderByWithRelationInput | Prisma.RoadmapSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RoadmapSnapshotCountAggregateInputType;
    _avg?: RoadmapSnapshotAvgAggregateInputType;
    _sum?: RoadmapSnapshotSumAggregateInputType;
    _min?: RoadmapSnapshotMinAggregateInputType;
    _max?: RoadmapSnapshotMaxAggregateInputType;
};
export type GetRoadmapSnapshotAggregateType<T extends RoadmapSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateRoadmapSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRoadmapSnapshot[P]> : Prisma.GetScalarType<T[P], AggregateRoadmapSnapshot[P]>;
};
export type RoadmapSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapSnapshotWhereInput;
    orderBy?: Prisma.RoadmapSnapshotOrderByWithAggregationInput | Prisma.RoadmapSnapshotOrderByWithAggregationInput[];
    by: Prisma.RoadmapSnapshotScalarFieldEnum[] | Prisma.RoadmapSnapshotScalarFieldEnum;
    having?: Prisma.RoadmapSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RoadmapSnapshotCountAggregateInputType | true;
    _avg?: RoadmapSnapshotAvgAggregateInputType;
    _sum?: RoadmapSnapshotSumAggregateInputType;
    _min?: RoadmapSnapshotMinAggregateInputType;
    _max?: RoadmapSnapshotMaxAggregateInputType;
};
export type RoadmapSnapshotGroupByOutputType = {
    id: number;
    markdown: string;
    version: number;
    reason: string;
    createdBy: string;
    createdAt: Date;
    _count: RoadmapSnapshotCountAggregateOutputType | null;
    _avg: RoadmapSnapshotAvgAggregateOutputType | null;
    _sum: RoadmapSnapshotSumAggregateOutputType | null;
    _min: RoadmapSnapshotMinAggregateOutputType | null;
    _max: RoadmapSnapshotMaxAggregateOutputType | null;
};
export type GetRoadmapSnapshotGroupByPayload<T extends RoadmapSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RoadmapSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RoadmapSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RoadmapSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RoadmapSnapshotGroupByOutputType[P]>;
}>>;
export type RoadmapSnapshotWhereInput = {
    AND?: Prisma.RoadmapSnapshotWhereInput | Prisma.RoadmapSnapshotWhereInput[];
    OR?: Prisma.RoadmapSnapshotWhereInput[];
    NOT?: Prisma.RoadmapSnapshotWhereInput | Prisma.RoadmapSnapshotWhereInput[];
    id?: Prisma.IntFilter<"RoadmapSnapshot"> | number;
    markdown?: Prisma.StringFilter<"RoadmapSnapshot"> | string;
    version?: Prisma.IntFilter<"RoadmapSnapshot"> | number;
    reason?: Prisma.StringFilter<"RoadmapSnapshot"> | string;
    createdBy?: Prisma.StringFilter<"RoadmapSnapshot"> | string;
    createdAt?: Prisma.DateTimeFilter<"RoadmapSnapshot"> | Date | string;
};
export type RoadmapSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RoadmapSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.RoadmapSnapshotWhereInput | Prisma.RoadmapSnapshotWhereInput[];
    OR?: Prisma.RoadmapSnapshotWhereInput[];
    NOT?: Prisma.RoadmapSnapshotWhereInput | Prisma.RoadmapSnapshotWhereInput[];
    markdown?: Prisma.StringFilter<"RoadmapSnapshot"> | string;
    version?: Prisma.IntFilter<"RoadmapSnapshot"> | number;
    reason?: Prisma.StringFilter<"RoadmapSnapshot"> | string;
    createdBy?: Prisma.StringFilter<"RoadmapSnapshot"> | string;
    createdAt?: Prisma.DateTimeFilter<"RoadmapSnapshot"> | Date | string;
}, "id">;
export type RoadmapSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RoadmapSnapshotCountOrderByAggregateInput;
    _avg?: Prisma.RoadmapSnapshotAvgOrderByAggregateInput;
    _max?: Prisma.RoadmapSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.RoadmapSnapshotMinOrderByAggregateInput;
    _sum?: Prisma.RoadmapSnapshotSumOrderByAggregateInput;
};
export type RoadmapSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.RoadmapSnapshotScalarWhereWithAggregatesInput | Prisma.RoadmapSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.RoadmapSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RoadmapSnapshotScalarWhereWithAggregatesInput | Prisma.RoadmapSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"RoadmapSnapshot"> | number;
    markdown?: Prisma.StringWithAggregatesFilter<"RoadmapSnapshot"> | string;
    version?: Prisma.IntWithAggregatesFilter<"RoadmapSnapshot"> | number;
    reason?: Prisma.StringWithAggregatesFilter<"RoadmapSnapshot"> | string;
    createdBy?: Prisma.StringWithAggregatesFilter<"RoadmapSnapshot"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RoadmapSnapshot"> | Date | string;
};
export type RoadmapSnapshotCreateInput = {
    markdown: string;
    version: number;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type RoadmapSnapshotUncheckedCreateInput = {
    id?: number;
    markdown: string;
    version: number;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type RoadmapSnapshotUpdateInput = {
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoadmapSnapshotUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoadmapSnapshotCreateManyInput = {
    id?: number;
    markdown: string;
    version: number;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type RoadmapSnapshotUpdateManyMutationInput = {
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoadmapSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoadmapSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RoadmapSnapshotAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
};
export type RoadmapSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RoadmapSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RoadmapSnapshotSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
};
export type RoadmapSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    markdown?: boolean;
    version?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["roadmapSnapshot"]>;
export type RoadmapSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    markdown?: boolean;
    version?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["roadmapSnapshot"]>;
export type RoadmapSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    markdown?: boolean;
    version?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["roadmapSnapshot"]>;
export type RoadmapSnapshotSelectScalar = {
    id?: boolean;
    markdown?: boolean;
    version?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type RoadmapSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "markdown" | "version" | "reason" | "createdBy" | "createdAt", ExtArgs["result"]["roadmapSnapshot"]>;
export type $RoadmapSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RoadmapSnapshot";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        markdown: string;
        version: number;
        reason: string;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["roadmapSnapshot"]>;
    composites: {};
};
export type RoadmapSnapshotGetPayload<S extends boolean | null | undefined | RoadmapSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload, S>;
export type RoadmapSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RoadmapSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RoadmapSnapshotCountAggregateInputType | true;
};
export interface RoadmapSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RoadmapSnapshot'];
        meta: {
            name: 'RoadmapSnapshot';
        };
    };
    findUnique<T extends RoadmapSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, RoadmapSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RoadmapSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RoadmapSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RoadmapSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RoadmapSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, RoadmapSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__RoadmapSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RoadmapSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RoadmapSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RoadmapSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, RoadmapSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RoadmapSnapshotCreateArgs>(args: Prisma.SelectSubset<T, RoadmapSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__RoadmapSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RoadmapSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, RoadmapSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RoadmapSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RoadmapSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RoadmapSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, RoadmapSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__RoadmapSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RoadmapSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, RoadmapSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__RoadmapSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RoadmapSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, RoadmapSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RoadmapSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, RoadmapSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RoadmapSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RoadmapSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RoadmapSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, RoadmapSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__RoadmapSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RoadmapSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RoadmapSnapshotCountArgs>(args?: Prisma.Subset<T, RoadmapSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RoadmapSnapshotCountAggregateOutputType> : number>;
    aggregate<T extends RoadmapSnapshotAggregateArgs>(args: Prisma.Subset<T, RoadmapSnapshotAggregateArgs>): Prisma.PrismaPromise<GetRoadmapSnapshotAggregateType<T>>;
    groupBy<T extends RoadmapSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RoadmapSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: RoadmapSnapshotGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RoadmapSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RoadmapSnapshotFieldRefs;
}
export interface Prisma__RoadmapSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RoadmapSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"RoadmapSnapshot", 'Int'>;
    readonly markdown: Prisma.FieldRef<"RoadmapSnapshot", 'String'>;
    readonly version: Prisma.FieldRef<"RoadmapSnapshot", 'Int'>;
    readonly reason: Prisma.FieldRef<"RoadmapSnapshot", 'String'>;
    readonly createdBy: Prisma.FieldRef<"RoadmapSnapshot", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RoadmapSnapshot", 'DateTime'>;
}
export type RoadmapSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    where: Prisma.RoadmapSnapshotWhereUniqueInput;
};
export type RoadmapSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    where: Prisma.RoadmapSnapshotWhereUniqueInput;
};
export type RoadmapSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    where?: Prisma.RoadmapSnapshotWhereInput;
    orderBy?: Prisma.RoadmapSnapshotOrderByWithRelationInput | Prisma.RoadmapSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapSnapshotScalarFieldEnum | Prisma.RoadmapSnapshotScalarFieldEnum[];
};
export type RoadmapSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    where?: Prisma.RoadmapSnapshotWhereInput;
    orderBy?: Prisma.RoadmapSnapshotOrderByWithRelationInput | Prisma.RoadmapSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapSnapshotScalarFieldEnum | Prisma.RoadmapSnapshotScalarFieldEnum[];
};
export type RoadmapSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    where?: Prisma.RoadmapSnapshotWhereInput;
    orderBy?: Prisma.RoadmapSnapshotOrderByWithRelationInput | Prisma.RoadmapSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapSnapshotScalarFieldEnum | Prisma.RoadmapSnapshotScalarFieldEnum[];
};
export type RoadmapSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapSnapshotCreateInput, Prisma.RoadmapSnapshotUncheckedCreateInput>;
};
export type RoadmapSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RoadmapSnapshotCreateManyInput | Prisma.RoadmapSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoadmapSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    data: Prisma.RoadmapSnapshotCreateManyInput | Prisma.RoadmapSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoadmapSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapSnapshotUpdateInput, Prisma.RoadmapSnapshotUncheckedUpdateInput>;
    where: Prisma.RoadmapSnapshotWhereUniqueInput;
};
export type RoadmapSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RoadmapSnapshotUpdateManyMutationInput, Prisma.RoadmapSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.RoadmapSnapshotWhereInput;
    limit?: number;
};
export type RoadmapSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapSnapshotUpdateManyMutationInput, Prisma.RoadmapSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.RoadmapSnapshotWhereInput;
    limit?: number;
};
export type RoadmapSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    where: Prisma.RoadmapSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoadmapSnapshotCreateInput, Prisma.RoadmapSnapshotUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RoadmapSnapshotUpdateInput, Prisma.RoadmapSnapshotUncheckedUpdateInput>;
};
export type RoadmapSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
    where: Prisma.RoadmapSnapshotWhereUniqueInput;
};
export type RoadmapSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapSnapshotWhereInput;
    limit?: number;
};
export type RoadmapSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapSnapshotOmit<ExtArgs> | null;
};
//# sourceMappingURL=RoadmapSnapshot.d.ts.map