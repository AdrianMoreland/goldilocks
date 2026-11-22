import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type HandoverModel = runtime.Types.Result.DefaultSelection<Prisma.$HandoverPayload>;
export type AggregateHandover = {
    _count: HandoverCountAggregateOutputType | null;
    _avg: HandoverAvgAggregateOutputType | null;
    _sum: HandoverSumAggregateOutputType | null;
    _min: HandoverMinAggregateOutputType | null;
    _max: HandoverMaxAggregateOutputType | null;
};
export type HandoverAvgAggregateOutputType = {
    id: number | null;
};
export type HandoverSumAggregateOutputType = {
    id: number | null;
};
export type HandoverMinAggregateOutputType = {
    id: number | null;
    note: string | null;
    by: string | null;
    createdAt: Date | null;
};
export type HandoverMaxAggregateOutputType = {
    id: number | null;
    note: string | null;
    by: string | null;
    createdAt: Date | null;
};
export type HandoverCountAggregateOutputType = {
    id: number;
    note: number;
    by: number;
    createdAt: number;
    _all: number;
};
export type HandoverAvgAggregateInputType = {
    id?: true;
};
export type HandoverSumAggregateInputType = {
    id?: true;
};
export type HandoverMinAggregateInputType = {
    id?: true;
    note?: true;
    by?: true;
    createdAt?: true;
};
export type HandoverMaxAggregateInputType = {
    id?: true;
    note?: true;
    by?: true;
    createdAt?: true;
};
export type HandoverCountAggregateInputType = {
    id?: true;
    note?: true;
    by?: true;
    createdAt?: true;
    _all?: true;
};
export type HandoverAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HandoverWhereInput;
    orderBy?: Prisma.HandoverOrderByWithRelationInput | Prisma.HandoverOrderByWithRelationInput[];
    cursor?: Prisma.HandoverWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | HandoverCountAggregateInputType;
    _avg?: HandoverAvgAggregateInputType;
    _sum?: HandoverSumAggregateInputType;
    _min?: HandoverMinAggregateInputType;
    _max?: HandoverMaxAggregateInputType;
};
export type GetHandoverAggregateType<T extends HandoverAggregateArgs> = {
    [P in keyof T & keyof AggregateHandover]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateHandover[P]> : Prisma.GetScalarType<T[P], AggregateHandover[P]>;
};
export type HandoverGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HandoverWhereInput;
    orderBy?: Prisma.HandoverOrderByWithAggregationInput | Prisma.HandoverOrderByWithAggregationInput[];
    by: Prisma.HandoverScalarFieldEnum[] | Prisma.HandoverScalarFieldEnum;
    having?: Prisma.HandoverScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: HandoverCountAggregateInputType | true;
    _avg?: HandoverAvgAggregateInputType;
    _sum?: HandoverSumAggregateInputType;
    _min?: HandoverMinAggregateInputType;
    _max?: HandoverMaxAggregateInputType;
};
export type HandoverGroupByOutputType = {
    id: number;
    note: string;
    by: string;
    createdAt: Date;
    _count: HandoverCountAggregateOutputType | null;
    _avg: HandoverAvgAggregateOutputType | null;
    _sum: HandoverSumAggregateOutputType | null;
    _min: HandoverMinAggregateOutputType | null;
    _max: HandoverMaxAggregateOutputType | null;
};
export type GetHandoverGroupByPayload<T extends HandoverGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<HandoverGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof HandoverGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], HandoverGroupByOutputType[P]> : Prisma.GetScalarType<T[P], HandoverGroupByOutputType[P]>;
}>>;
export type HandoverWhereInput = {
    AND?: Prisma.HandoverWhereInput | Prisma.HandoverWhereInput[];
    OR?: Prisma.HandoverWhereInput[];
    NOT?: Prisma.HandoverWhereInput | Prisma.HandoverWhereInput[];
    id?: Prisma.IntFilter<"Handover"> | number;
    note?: Prisma.StringFilter<"Handover"> | string;
    by?: Prisma.StringFilter<"Handover"> | string;
    createdAt?: Prisma.DateTimeFilter<"Handover"> | Date | string;
};
export type HandoverOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HandoverWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.HandoverWhereInput | Prisma.HandoverWhereInput[];
    OR?: Prisma.HandoverWhereInput[];
    NOT?: Prisma.HandoverWhereInput | Prisma.HandoverWhereInput[];
    note?: Prisma.StringFilter<"Handover"> | string;
    by?: Prisma.StringFilter<"Handover"> | string;
    createdAt?: Prisma.DateTimeFilter<"Handover"> | Date | string;
}, "id">;
export type HandoverOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.HandoverCountOrderByAggregateInput;
    _avg?: Prisma.HandoverAvgOrderByAggregateInput;
    _max?: Prisma.HandoverMaxOrderByAggregateInput;
    _min?: Prisma.HandoverMinOrderByAggregateInput;
    _sum?: Prisma.HandoverSumOrderByAggregateInput;
};
export type HandoverScalarWhereWithAggregatesInput = {
    AND?: Prisma.HandoverScalarWhereWithAggregatesInput | Prisma.HandoverScalarWhereWithAggregatesInput[];
    OR?: Prisma.HandoverScalarWhereWithAggregatesInput[];
    NOT?: Prisma.HandoverScalarWhereWithAggregatesInput | Prisma.HandoverScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Handover"> | number;
    note?: Prisma.StringWithAggregatesFilter<"Handover"> | string;
    by?: Prisma.StringWithAggregatesFilter<"Handover"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Handover"> | Date | string;
};
export type HandoverCreateInput = {
    note: string;
    by: string;
    createdAt?: Date | string;
};
export type HandoverUncheckedCreateInput = {
    id?: number;
    note: string;
    by: string;
    createdAt?: Date | string;
};
export type HandoverUpdateInput = {
    note?: Prisma.StringFieldUpdateOperationsInput | string;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HandoverUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    note?: Prisma.StringFieldUpdateOperationsInput | string;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HandoverCreateManyInput = {
    id?: number;
    note: string;
    by: string;
    createdAt?: Date | string;
};
export type HandoverUpdateManyMutationInput = {
    note?: Prisma.StringFieldUpdateOperationsInput | string;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HandoverUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    note?: Prisma.StringFieldUpdateOperationsInput | string;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HandoverCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HandoverAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type HandoverMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HandoverMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HandoverSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type HandoverSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    note?: boolean;
    by?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["handover"]>;
export type HandoverSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    note?: boolean;
    by?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["handover"]>;
export type HandoverSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    note?: boolean;
    by?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["handover"]>;
export type HandoverSelectScalar = {
    id?: boolean;
    note?: boolean;
    by?: boolean;
    createdAt?: boolean;
};
export type HandoverOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "note" | "by" | "createdAt", ExtArgs["result"]["handover"]>;
export type $HandoverPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Handover";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        note: string;
        by: string;
        createdAt: Date;
    }, ExtArgs["result"]["handover"]>;
    composites: {};
};
export type HandoverGetPayload<S extends boolean | null | undefined | HandoverDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$HandoverPayload, S>;
export type HandoverCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<HandoverFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: HandoverCountAggregateInputType | true;
};
export interface HandoverDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Handover'];
        meta: {
            name: 'Handover';
        };
    };
    findUnique<T extends HandoverFindUniqueArgs>(args: Prisma.SelectSubset<T, HandoverFindUniqueArgs<ExtArgs>>): Prisma.Prisma__HandoverClient<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends HandoverFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, HandoverFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__HandoverClient<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends HandoverFindFirstArgs>(args?: Prisma.SelectSubset<T, HandoverFindFirstArgs<ExtArgs>>): Prisma.Prisma__HandoverClient<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends HandoverFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, HandoverFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__HandoverClient<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends HandoverFindManyArgs>(args?: Prisma.SelectSubset<T, HandoverFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends HandoverCreateArgs>(args: Prisma.SelectSubset<T, HandoverCreateArgs<ExtArgs>>): Prisma.Prisma__HandoverClient<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends HandoverCreateManyArgs>(args?: Prisma.SelectSubset<T, HandoverCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends HandoverCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, HandoverCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends HandoverDeleteArgs>(args: Prisma.SelectSubset<T, HandoverDeleteArgs<ExtArgs>>): Prisma.Prisma__HandoverClient<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends HandoverUpdateArgs>(args: Prisma.SelectSubset<T, HandoverUpdateArgs<ExtArgs>>): Prisma.Prisma__HandoverClient<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends HandoverDeleteManyArgs>(args?: Prisma.SelectSubset<T, HandoverDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends HandoverUpdateManyArgs>(args: Prisma.SelectSubset<T, HandoverUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends HandoverUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, HandoverUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends HandoverUpsertArgs>(args: Prisma.SelectSubset<T, HandoverUpsertArgs<ExtArgs>>): Prisma.Prisma__HandoverClient<runtime.Types.Result.GetResult<Prisma.$HandoverPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends HandoverCountArgs>(args?: Prisma.Subset<T, HandoverCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], HandoverCountAggregateOutputType> : number>;
    aggregate<T extends HandoverAggregateArgs>(args: Prisma.Subset<T, HandoverAggregateArgs>): Prisma.PrismaPromise<GetHandoverAggregateType<T>>;
    groupBy<T extends HandoverGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: HandoverGroupByArgs['orderBy'];
    } : {
        orderBy?: HandoverGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, HandoverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHandoverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: HandoverFieldRefs;
}
export interface Prisma__HandoverClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface HandoverFieldRefs {
    readonly id: Prisma.FieldRef<"Handover", 'Int'>;
    readonly note: Prisma.FieldRef<"Handover", 'String'>;
    readonly by: Prisma.FieldRef<"Handover", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Handover", 'DateTime'>;
}
export type HandoverFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    where: Prisma.HandoverWhereUniqueInput;
};
export type HandoverFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    where: Prisma.HandoverWhereUniqueInput;
};
export type HandoverFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    where?: Prisma.HandoverWhereInput;
    orderBy?: Prisma.HandoverOrderByWithRelationInput | Prisma.HandoverOrderByWithRelationInput[];
    cursor?: Prisma.HandoverWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HandoverScalarFieldEnum | Prisma.HandoverScalarFieldEnum[];
};
export type HandoverFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    where?: Prisma.HandoverWhereInput;
    orderBy?: Prisma.HandoverOrderByWithRelationInput | Prisma.HandoverOrderByWithRelationInput[];
    cursor?: Prisma.HandoverWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HandoverScalarFieldEnum | Prisma.HandoverScalarFieldEnum[];
};
export type HandoverFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    where?: Prisma.HandoverWhereInput;
    orderBy?: Prisma.HandoverOrderByWithRelationInput | Prisma.HandoverOrderByWithRelationInput[];
    cursor?: Prisma.HandoverWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HandoverScalarFieldEnum | Prisma.HandoverScalarFieldEnum[];
};
export type HandoverCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HandoverCreateInput, Prisma.HandoverUncheckedCreateInput>;
};
export type HandoverCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.HandoverCreateManyInput | Prisma.HandoverCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HandoverCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    data: Prisma.HandoverCreateManyInput | Prisma.HandoverCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HandoverUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HandoverUpdateInput, Prisma.HandoverUncheckedUpdateInput>;
    where: Prisma.HandoverWhereUniqueInput;
};
export type HandoverUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.HandoverUpdateManyMutationInput, Prisma.HandoverUncheckedUpdateManyInput>;
    where?: Prisma.HandoverWhereInput;
    limit?: number;
};
export type HandoverUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HandoverUpdateManyMutationInput, Prisma.HandoverUncheckedUpdateManyInput>;
    where?: Prisma.HandoverWhereInput;
    limit?: number;
};
export type HandoverUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    where: Prisma.HandoverWhereUniqueInput;
    create: Prisma.XOR<Prisma.HandoverCreateInput, Prisma.HandoverUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.HandoverUpdateInput, Prisma.HandoverUncheckedUpdateInput>;
};
export type HandoverDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
    where: Prisma.HandoverWhereUniqueInput;
};
export type HandoverDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HandoverWhereInput;
    limit?: number;
};
export type HandoverDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoverSelect<ExtArgs> | null;
    omit?: Prisma.HandoverOmit<ExtArgs> | null;
};
//# sourceMappingURL=Handover.d.ts.map