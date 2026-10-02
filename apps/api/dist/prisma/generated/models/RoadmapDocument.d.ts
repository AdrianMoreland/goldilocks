import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RoadmapDocumentModel = runtime.Types.Result.DefaultSelection<Prisma.$RoadmapDocumentPayload>;
export type AggregateRoadmapDocument = {
    _count: RoadmapDocumentCountAggregateOutputType | null;
    _avg: RoadmapDocumentAvgAggregateOutputType | null;
    _sum: RoadmapDocumentSumAggregateOutputType | null;
    _min: RoadmapDocumentMinAggregateOutputType | null;
    _max: RoadmapDocumentMaxAggregateOutputType | null;
};
export type RoadmapDocumentAvgAggregateOutputType = {
    id: number | null;
    version: number | null;
};
export type RoadmapDocumentSumAggregateOutputType = {
    id: number | null;
    version: number | null;
};
export type RoadmapDocumentMinAggregateOutputType = {
    id: number | null;
    markdown: string | null;
    version: number | null;
    updatedBy: string | null;
    updatedAt: Date | null;
};
export type RoadmapDocumentMaxAggregateOutputType = {
    id: number | null;
    markdown: string | null;
    version: number | null;
    updatedBy: string | null;
    updatedAt: Date | null;
};
export type RoadmapDocumentCountAggregateOutputType = {
    id: number;
    markdown: number;
    version: number;
    updatedBy: number;
    updatedAt: number;
    _all: number;
};
export type RoadmapDocumentAvgAggregateInputType = {
    id?: true;
    version?: true;
};
export type RoadmapDocumentSumAggregateInputType = {
    id?: true;
    version?: true;
};
export type RoadmapDocumentMinAggregateInputType = {
    id?: true;
    markdown?: true;
    version?: true;
    updatedBy?: true;
    updatedAt?: true;
};
export type RoadmapDocumentMaxAggregateInputType = {
    id?: true;
    markdown?: true;
    version?: true;
    updatedBy?: true;
    updatedAt?: true;
};
export type RoadmapDocumentCountAggregateInputType = {
    id?: true;
    markdown?: true;
    version?: true;
    updatedBy?: true;
    updatedAt?: true;
    _all?: true;
};
export type RoadmapDocumentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapDocumentWhereInput;
    orderBy?: Prisma.RoadmapDocumentOrderByWithRelationInput | Prisma.RoadmapDocumentOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RoadmapDocumentCountAggregateInputType;
    _avg?: RoadmapDocumentAvgAggregateInputType;
    _sum?: RoadmapDocumentSumAggregateInputType;
    _min?: RoadmapDocumentMinAggregateInputType;
    _max?: RoadmapDocumentMaxAggregateInputType;
};
export type GetRoadmapDocumentAggregateType<T extends RoadmapDocumentAggregateArgs> = {
    [P in keyof T & keyof AggregateRoadmapDocument]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRoadmapDocument[P]> : Prisma.GetScalarType<T[P], AggregateRoadmapDocument[P]>;
};
export type RoadmapDocumentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapDocumentWhereInput;
    orderBy?: Prisma.RoadmapDocumentOrderByWithAggregationInput | Prisma.RoadmapDocumentOrderByWithAggregationInput[];
    by: Prisma.RoadmapDocumentScalarFieldEnum[] | Prisma.RoadmapDocumentScalarFieldEnum;
    having?: Prisma.RoadmapDocumentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RoadmapDocumentCountAggregateInputType | true;
    _avg?: RoadmapDocumentAvgAggregateInputType;
    _sum?: RoadmapDocumentSumAggregateInputType;
    _min?: RoadmapDocumentMinAggregateInputType;
    _max?: RoadmapDocumentMaxAggregateInputType;
};
export type RoadmapDocumentGroupByOutputType = {
    id: number;
    markdown: string;
    version: number;
    updatedBy: string | null;
    updatedAt: Date;
    _count: RoadmapDocumentCountAggregateOutputType | null;
    _avg: RoadmapDocumentAvgAggregateOutputType | null;
    _sum: RoadmapDocumentSumAggregateOutputType | null;
    _min: RoadmapDocumentMinAggregateOutputType | null;
    _max: RoadmapDocumentMaxAggregateOutputType | null;
};
export type GetRoadmapDocumentGroupByPayload<T extends RoadmapDocumentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RoadmapDocumentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RoadmapDocumentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RoadmapDocumentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RoadmapDocumentGroupByOutputType[P]>;
}>>;
export type RoadmapDocumentWhereInput = {
    AND?: Prisma.RoadmapDocumentWhereInput | Prisma.RoadmapDocumentWhereInput[];
    OR?: Prisma.RoadmapDocumentWhereInput[];
    NOT?: Prisma.RoadmapDocumentWhereInput | Prisma.RoadmapDocumentWhereInput[];
    id?: Prisma.IntFilter<"RoadmapDocument"> | number;
    markdown?: Prisma.StringFilter<"RoadmapDocument"> | string;
    version?: Prisma.IntFilter<"RoadmapDocument"> | number;
    updatedBy?: Prisma.StringNullableFilter<"RoadmapDocument"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"RoadmapDocument"> | Date | string;
};
export type RoadmapDocumentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RoadmapDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.RoadmapDocumentWhereInput | Prisma.RoadmapDocumentWhereInput[];
    OR?: Prisma.RoadmapDocumentWhereInput[];
    NOT?: Prisma.RoadmapDocumentWhereInput | Prisma.RoadmapDocumentWhereInput[];
    markdown?: Prisma.StringFilter<"RoadmapDocument"> | string;
    version?: Prisma.IntFilter<"RoadmapDocument"> | number;
    updatedBy?: Prisma.StringNullableFilter<"RoadmapDocument"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"RoadmapDocument"> | Date | string;
}, "id">;
export type RoadmapDocumentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RoadmapDocumentCountOrderByAggregateInput;
    _avg?: Prisma.RoadmapDocumentAvgOrderByAggregateInput;
    _max?: Prisma.RoadmapDocumentMaxOrderByAggregateInput;
    _min?: Prisma.RoadmapDocumentMinOrderByAggregateInput;
    _sum?: Prisma.RoadmapDocumentSumOrderByAggregateInput;
};
export type RoadmapDocumentScalarWhereWithAggregatesInput = {
    AND?: Prisma.RoadmapDocumentScalarWhereWithAggregatesInput | Prisma.RoadmapDocumentScalarWhereWithAggregatesInput[];
    OR?: Prisma.RoadmapDocumentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RoadmapDocumentScalarWhereWithAggregatesInput | Prisma.RoadmapDocumentScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"RoadmapDocument"> | number;
    markdown?: Prisma.StringWithAggregatesFilter<"RoadmapDocument"> | string;
    version?: Prisma.IntWithAggregatesFilter<"RoadmapDocument"> | number;
    updatedBy?: Prisma.StringNullableWithAggregatesFilter<"RoadmapDocument"> | string | null;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"RoadmapDocument"> | Date | string;
};
export type RoadmapDocumentCreateInput = {
    id: number;
    markdown: string;
    version?: number;
    updatedBy?: string | null;
    updatedAt?: Date | string;
};
export type RoadmapDocumentUncheckedCreateInput = {
    id: number;
    markdown: string;
    version?: number;
    updatedBy?: string | null;
    updatedAt?: Date | string;
};
export type RoadmapDocumentUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoadmapDocumentUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoadmapDocumentCreateManyInput = {
    id: number;
    markdown: string;
    version?: number;
    updatedBy?: string | null;
    updatedAt?: Date | string;
};
export type RoadmapDocumentUpdateManyMutationInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoadmapDocumentUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoadmapDocumentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RoadmapDocumentAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
};
export type RoadmapDocumentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RoadmapDocumentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RoadmapDocumentSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
};
export type RoadmapDocumentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    markdown?: boolean;
    version?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["roadmapDocument"]>;
export type RoadmapDocumentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    markdown?: boolean;
    version?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["roadmapDocument"]>;
export type RoadmapDocumentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    markdown?: boolean;
    version?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["roadmapDocument"]>;
export type RoadmapDocumentSelectScalar = {
    id?: boolean;
    markdown?: boolean;
    version?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
};
export type RoadmapDocumentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "markdown" | "version" | "updatedBy" | "updatedAt", ExtArgs["result"]["roadmapDocument"]>;
export type $RoadmapDocumentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RoadmapDocument";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        markdown: string;
        version: number;
        updatedBy: string | null;
        updatedAt: Date;
    }, ExtArgs["result"]["roadmapDocument"]>;
    composites: {};
};
export type RoadmapDocumentGetPayload<S extends boolean | null | undefined | RoadmapDocumentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload, S>;
export type RoadmapDocumentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RoadmapDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RoadmapDocumentCountAggregateInputType | true;
};
export interface RoadmapDocumentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RoadmapDocument'];
        meta: {
            name: 'RoadmapDocument';
        };
    };
    findUnique<T extends RoadmapDocumentFindUniqueArgs>(args: Prisma.SelectSubset<T, RoadmapDocumentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RoadmapDocumentClient<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RoadmapDocumentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RoadmapDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapDocumentClient<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RoadmapDocumentFindFirstArgs>(args?: Prisma.SelectSubset<T, RoadmapDocumentFindFirstArgs<ExtArgs>>): Prisma.Prisma__RoadmapDocumentClient<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RoadmapDocumentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RoadmapDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapDocumentClient<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RoadmapDocumentFindManyArgs>(args?: Prisma.SelectSubset<T, RoadmapDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RoadmapDocumentCreateArgs>(args: Prisma.SelectSubset<T, RoadmapDocumentCreateArgs<ExtArgs>>): Prisma.Prisma__RoadmapDocumentClient<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RoadmapDocumentCreateManyArgs>(args?: Prisma.SelectSubset<T, RoadmapDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RoadmapDocumentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RoadmapDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RoadmapDocumentDeleteArgs>(args: Prisma.SelectSubset<T, RoadmapDocumentDeleteArgs<ExtArgs>>): Prisma.Prisma__RoadmapDocumentClient<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RoadmapDocumentUpdateArgs>(args: Prisma.SelectSubset<T, RoadmapDocumentUpdateArgs<ExtArgs>>): Prisma.Prisma__RoadmapDocumentClient<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RoadmapDocumentDeleteManyArgs>(args?: Prisma.SelectSubset<T, RoadmapDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RoadmapDocumentUpdateManyArgs>(args: Prisma.SelectSubset<T, RoadmapDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RoadmapDocumentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RoadmapDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RoadmapDocumentUpsertArgs>(args: Prisma.SelectSubset<T, RoadmapDocumentUpsertArgs<ExtArgs>>): Prisma.Prisma__RoadmapDocumentClient<runtime.Types.Result.GetResult<Prisma.$RoadmapDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RoadmapDocumentCountArgs>(args?: Prisma.Subset<T, RoadmapDocumentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RoadmapDocumentCountAggregateOutputType> : number>;
    aggregate<T extends RoadmapDocumentAggregateArgs>(args: Prisma.Subset<T, RoadmapDocumentAggregateArgs>): Prisma.PrismaPromise<GetRoadmapDocumentAggregateType<T>>;
    groupBy<T extends RoadmapDocumentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RoadmapDocumentGroupByArgs['orderBy'];
    } : {
        orderBy?: RoadmapDocumentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RoadmapDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RoadmapDocumentFieldRefs;
}
export interface Prisma__RoadmapDocumentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RoadmapDocumentFieldRefs {
    readonly id: Prisma.FieldRef<"RoadmapDocument", 'Int'>;
    readonly markdown: Prisma.FieldRef<"RoadmapDocument", 'String'>;
    readonly version: Prisma.FieldRef<"RoadmapDocument", 'Int'>;
    readonly updatedBy: Prisma.FieldRef<"RoadmapDocument", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"RoadmapDocument", 'DateTime'>;
}
export type RoadmapDocumentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    where: Prisma.RoadmapDocumentWhereUniqueInput;
};
export type RoadmapDocumentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    where: Prisma.RoadmapDocumentWhereUniqueInput;
};
export type RoadmapDocumentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    where?: Prisma.RoadmapDocumentWhereInput;
    orderBy?: Prisma.RoadmapDocumentOrderByWithRelationInput | Prisma.RoadmapDocumentOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapDocumentScalarFieldEnum | Prisma.RoadmapDocumentScalarFieldEnum[];
};
export type RoadmapDocumentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    where?: Prisma.RoadmapDocumentWhereInput;
    orderBy?: Prisma.RoadmapDocumentOrderByWithRelationInput | Prisma.RoadmapDocumentOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapDocumentScalarFieldEnum | Prisma.RoadmapDocumentScalarFieldEnum[];
};
export type RoadmapDocumentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    where?: Prisma.RoadmapDocumentWhereInput;
    orderBy?: Prisma.RoadmapDocumentOrderByWithRelationInput | Prisma.RoadmapDocumentOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapDocumentScalarFieldEnum | Prisma.RoadmapDocumentScalarFieldEnum[];
};
export type RoadmapDocumentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapDocumentCreateInput, Prisma.RoadmapDocumentUncheckedCreateInput>;
};
export type RoadmapDocumentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RoadmapDocumentCreateManyInput | Prisma.RoadmapDocumentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoadmapDocumentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    data: Prisma.RoadmapDocumentCreateManyInput | Prisma.RoadmapDocumentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoadmapDocumentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapDocumentUpdateInput, Prisma.RoadmapDocumentUncheckedUpdateInput>;
    where: Prisma.RoadmapDocumentWhereUniqueInput;
};
export type RoadmapDocumentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RoadmapDocumentUpdateManyMutationInput, Prisma.RoadmapDocumentUncheckedUpdateManyInput>;
    where?: Prisma.RoadmapDocumentWhereInput;
    limit?: number;
};
export type RoadmapDocumentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapDocumentUpdateManyMutationInput, Prisma.RoadmapDocumentUncheckedUpdateManyInput>;
    where?: Prisma.RoadmapDocumentWhereInput;
    limit?: number;
};
export type RoadmapDocumentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    where: Prisma.RoadmapDocumentWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoadmapDocumentCreateInput, Prisma.RoadmapDocumentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RoadmapDocumentUpdateInput, Prisma.RoadmapDocumentUncheckedUpdateInput>;
};
export type RoadmapDocumentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
    where: Prisma.RoadmapDocumentWhereUniqueInput;
};
export type RoadmapDocumentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapDocumentWhereInput;
    limit?: number;
};
export type RoadmapDocumentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapDocumentSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapDocumentOmit<ExtArgs> | null;
};
//# sourceMappingURL=RoadmapDocument.d.ts.map