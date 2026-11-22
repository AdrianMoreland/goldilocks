import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RefineryAliasModel = runtime.Types.Result.DefaultSelection<Prisma.$RefineryAliasPayload>;
export type AggregateRefineryAlias = {
    _count: RefineryAliasCountAggregateOutputType | null;
    _avg: RefineryAliasAvgAggregateOutputType | null;
    _sum: RefineryAliasSumAggregateOutputType | null;
    _min: RefineryAliasMinAggregateOutputType | null;
    _max: RefineryAliasMaxAggregateOutputType | null;
};
export type RefineryAliasAvgAggregateOutputType = {
    id: number | null;
};
export type RefineryAliasSumAggregateOutputType = {
    id: number | null;
};
export type RefineryAliasMinAggregateOutputType = {
    id: number | null;
    alias: string | null;
    refinery: string | null;
    createdAt: Date | null;
};
export type RefineryAliasMaxAggregateOutputType = {
    id: number | null;
    alias: string | null;
    refinery: string | null;
    createdAt: Date | null;
};
export type RefineryAliasCountAggregateOutputType = {
    id: number;
    alias: number;
    refinery: number;
    createdAt: number;
    _all: number;
};
export type RefineryAliasAvgAggregateInputType = {
    id?: true;
};
export type RefineryAliasSumAggregateInputType = {
    id?: true;
};
export type RefineryAliasMinAggregateInputType = {
    id?: true;
    alias?: true;
    refinery?: true;
    createdAt?: true;
};
export type RefineryAliasMaxAggregateInputType = {
    id?: true;
    alias?: true;
    refinery?: true;
    createdAt?: true;
};
export type RefineryAliasCountAggregateInputType = {
    id?: true;
    alias?: true;
    refinery?: true;
    createdAt?: true;
    _all?: true;
};
export type RefineryAliasAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefineryAliasWhereInput;
    orderBy?: Prisma.RefineryAliasOrderByWithRelationInput | Prisma.RefineryAliasOrderByWithRelationInput[];
    cursor?: Prisma.RefineryAliasWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RefineryAliasCountAggregateInputType;
    _avg?: RefineryAliasAvgAggregateInputType;
    _sum?: RefineryAliasSumAggregateInputType;
    _min?: RefineryAliasMinAggregateInputType;
    _max?: RefineryAliasMaxAggregateInputType;
};
export type GetRefineryAliasAggregateType<T extends RefineryAliasAggregateArgs> = {
    [P in keyof T & keyof AggregateRefineryAlias]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRefineryAlias[P]> : Prisma.GetScalarType<T[P], AggregateRefineryAlias[P]>;
};
export type RefineryAliasGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefineryAliasWhereInput;
    orderBy?: Prisma.RefineryAliasOrderByWithAggregationInput | Prisma.RefineryAliasOrderByWithAggregationInput[];
    by: Prisma.RefineryAliasScalarFieldEnum[] | Prisma.RefineryAliasScalarFieldEnum;
    having?: Prisma.RefineryAliasScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RefineryAliasCountAggregateInputType | true;
    _avg?: RefineryAliasAvgAggregateInputType;
    _sum?: RefineryAliasSumAggregateInputType;
    _min?: RefineryAliasMinAggregateInputType;
    _max?: RefineryAliasMaxAggregateInputType;
};
export type RefineryAliasGroupByOutputType = {
    id: number;
    alias: string;
    refinery: string;
    createdAt: Date;
    _count: RefineryAliasCountAggregateOutputType | null;
    _avg: RefineryAliasAvgAggregateOutputType | null;
    _sum: RefineryAliasSumAggregateOutputType | null;
    _min: RefineryAliasMinAggregateOutputType | null;
    _max: RefineryAliasMaxAggregateOutputType | null;
};
export type GetRefineryAliasGroupByPayload<T extends RefineryAliasGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RefineryAliasGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RefineryAliasGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RefineryAliasGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RefineryAliasGroupByOutputType[P]>;
}>>;
export type RefineryAliasWhereInput = {
    AND?: Prisma.RefineryAliasWhereInput | Prisma.RefineryAliasWhereInput[];
    OR?: Prisma.RefineryAliasWhereInput[];
    NOT?: Prisma.RefineryAliasWhereInput | Prisma.RefineryAliasWhereInput[];
    id?: Prisma.IntFilter<"RefineryAlias"> | number;
    alias?: Prisma.StringFilter<"RefineryAlias"> | string;
    refinery?: Prisma.StringFilter<"RefineryAlias"> | string;
    createdAt?: Prisma.DateTimeFilter<"RefineryAlias"> | Date | string;
};
export type RefineryAliasOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    alias?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RefineryAliasWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    alias?: string;
    AND?: Prisma.RefineryAliasWhereInput | Prisma.RefineryAliasWhereInput[];
    OR?: Prisma.RefineryAliasWhereInput[];
    NOT?: Prisma.RefineryAliasWhereInput | Prisma.RefineryAliasWhereInput[];
    refinery?: Prisma.StringFilter<"RefineryAlias"> | string;
    createdAt?: Prisma.DateTimeFilter<"RefineryAlias"> | Date | string;
}, "id" | "alias">;
export type RefineryAliasOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    alias?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RefineryAliasCountOrderByAggregateInput;
    _avg?: Prisma.RefineryAliasAvgOrderByAggregateInput;
    _max?: Prisma.RefineryAliasMaxOrderByAggregateInput;
    _min?: Prisma.RefineryAliasMinOrderByAggregateInput;
    _sum?: Prisma.RefineryAliasSumOrderByAggregateInput;
};
export type RefineryAliasScalarWhereWithAggregatesInput = {
    AND?: Prisma.RefineryAliasScalarWhereWithAggregatesInput | Prisma.RefineryAliasScalarWhereWithAggregatesInput[];
    OR?: Prisma.RefineryAliasScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RefineryAliasScalarWhereWithAggregatesInput | Prisma.RefineryAliasScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"RefineryAlias"> | number;
    alias?: Prisma.StringWithAggregatesFilter<"RefineryAlias"> | string;
    refinery?: Prisma.StringWithAggregatesFilter<"RefineryAlias"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RefineryAlias"> | Date | string;
};
export type RefineryAliasCreateInput = {
    alias: string;
    refinery: string;
    createdAt?: Date | string;
};
export type RefineryAliasUncheckedCreateInput = {
    id?: number;
    alias: string;
    refinery: string;
    createdAt?: Date | string;
};
export type RefineryAliasUpdateInput = {
    alias?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefineryAliasUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    alias?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefineryAliasCreateManyInput = {
    id?: number;
    alias: string;
    refinery: string;
    createdAt?: Date | string;
};
export type RefineryAliasUpdateManyMutationInput = {
    alias?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefineryAliasUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    alias?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefineryAliasCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    alias?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RefineryAliasAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type RefineryAliasMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    alias?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RefineryAliasMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    alias?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RefineryAliasSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type RefineryAliasSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    alias?: boolean;
    refinery?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["refineryAlias"]>;
export type RefineryAliasSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    alias?: boolean;
    refinery?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["refineryAlias"]>;
export type RefineryAliasSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    alias?: boolean;
    refinery?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["refineryAlias"]>;
export type RefineryAliasSelectScalar = {
    id?: boolean;
    alias?: boolean;
    refinery?: boolean;
    createdAt?: boolean;
};
export type RefineryAliasOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "alias" | "refinery" | "createdAt", ExtArgs["result"]["refineryAlias"]>;
export type $RefineryAliasPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RefineryAlias";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        alias: string;
        refinery: string;
        createdAt: Date;
    }, ExtArgs["result"]["refineryAlias"]>;
    composites: {};
};
export type RefineryAliasGetPayload<S extends boolean | null | undefined | RefineryAliasDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload, S>;
export type RefineryAliasCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RefineryAliasFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RefineryAliasCountAggregateInputType | true;
};
export interface RefineryAliasDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RefineryAlias'];
        meta: {
            name: 'RefineryAlias';
        };
    };
    findUnique<T extends RefineryAliasFindUniqueArgs>(args: Prisma.SelectSubset<T, RefineryAliasFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RefineryAliasClient<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RefineryAliasFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RefineryAliasFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RefineryAliasClient<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RefineryAliasFindFirstArgs>(args?: Prisma.SelectSubset<T, RefineryAliasFindFirstArgs<ExtArgs>>): Prisma.Prisma__RefineryAliasClient<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RefineryAliasFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RefineryAliasFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RefineryAliasClient<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RefineryAliasFindManyArgs>(args?: Prisma.SelectSubset<T, RefineryAliasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RefineryAliasCreateArgs>(args: Prisma.SelectSubset<T, RefineryAliasCreateArgs<ExtArgs>>): Prisma.Prisma__RefineryAliasClient<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RefineryAliasCreateManyArgs>(args?: Prisma.SelectSubset<T, RefineryAliasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RefineryAliasCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RefineryAliasCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RefineryAliasDeleteArgs>(args: Prisma.SelectSubset<T, RefineryAliasDeleteArgs<ExtArgs>>): Prisma.Prisma__RefineryAliasClient<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RefineryAliasUpdateArgs>(args: Prisma.SelectSubset<T, RefineryAliasUpdateArgs<ExtArgs>>): Prisma.Prisma__RefineryAliasClient<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RefineryAliasDeleteManyArgs>(args?: Prisma.SelectSubset<T, RefineryAliasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RefineryAliasUpdateManyArgs>(args: Prisma.SelectSubset<T, RefineryAliasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RefineryAliasUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RefineryAliasUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RefineryAliasUpsertArgs>(args: Prisma.SelectSubset<T, RefineryAliasUpsertArgs<ExtArgs>>): Prisma.Prisma__RefineryAliasClient<runtime.Types.Result.GetResult<Prisma.$RefineryAliasPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RefineryAliasCountArgs>(args?: Prisma.Subset<T, RefineryAliasCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RefineryAliasCountAggregateOutputType> : number>;
    aggregate<T extends RefineryAliasAggregateArgs>(args: Prisma.Subset<T, RefineryAliasAggregateArgs>): Prisma.PrismaPromise<GetRefineryAliasAggregateType<T>>;
    groupBy<T extends RefineryAliasGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RefineryAliasGroupByArgs['orderBy'];
    } : {
        orderBy?: RefineryAliasGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RefineryAliasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefineryAliasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RefineryAliasFieldRefs;
}
export interface Prisma__RefineryAliasClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RefineryAliasFieldRefs {
    readonly id: Prisma.FieldRef<"RefineryAlias", 'Int'>;
    readonly alias: Prisma.FieldRef<"RefineryAlias", 'String'>;
    readonly refinery: Prisma.FieldRef<"RefineryAlias", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RefineryAlias", 'DateTime'>;
}
export type RefineryAliasFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    where: Prisma.RefineryAliasWhereUniqueInput;
};
export type RefineryAliasFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    where: Prisma.RefineryAliasWhereUniqueInput;
};
export type RefineryAliasFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    where?: Prisma.RefineryAliasWhereInput;
    orderBy?: Prisma.RefineryAliasOrderByWithRelationInput | Prisma.RefineryAliasOrderByWithRelationInput[];
    cursor?: Prisma.RefineryAliasWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RefineryAliasScalarFieldEnum | Prisma.RefineryAliasScalarFieldEnum[];
};
export type RefineryAliasFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    where?: Prisma.RefineryAliasWhereInput;
    orderBy?: Prisma.RefineryAliasOrderByWithRelationInput | Prisma.RefineryAliasOrderByWithRelationInput[];
    cursor?: Prisma.RefineryAliasWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RefineryAliasScalarFieldEnum | Prisma.RefineryAliasScalarFieldEnum[];
};
export type RefineryAliasFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    where?: Prisma.RefineryAliasWhereInput;
    orderBy?: Prisma.RefineryAliasOrderByWithRelationInput | Prisma.RefineryAliasOrderByWithRelationInput[];
    cursor?: Prisma.RefineryAliasWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RefineryAliasScalarFieldEnum | Prisma.RefineryAliasScalarFieldEnum[];
};
export type RefineryAliasCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RefineryAliasCreateInput, Prisma.RefineryAliasUncheckedCreateInput>;
};
export type RefineryAliasCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RefineryAliasCreateManyInput | Prisma.RefineryAliasCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RefineryAliasCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    data: Prisma.RefineryAliasCreateManyInput | Prisma.RefineryAliasCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RefineryAliasUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RefineryAliasUpdateInput, Prisma.RefineryAliasUncheckedUpdateInput>;
    where: Prisma.RefineryAliasWhereUniqueInput;
};
export type RefineryAliasUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RefineryAliasUpdateManyMutationInput, Prisma.RefineryAliasUncheckedUpdateManyInput>;
    where?: Prisma.RefineryAliasWhereInput;
    limit?: number;
};
export type RefineryAliasUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RefineryAliasUpdateManyMutationInput, Prisma.RefineryAliasUncheckedUpdateManyInput>;
    where?: Prisma.RefineryAliasWhereInput;
    limit?: number;
};
export type RefineryAliasUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    where: Prisma.RefineryAliasWhereUniqueInput;
    create: Prisma.XOR<Prisma.RefineryAliasCreateInput, Prisma.RefineryAliasUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RefineryAliasUpdateInput, Prisma.RefineryAliasUncheckedUpdateInput>;
};
export type RefineryAliasDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
    where: Prisma.RefineryAliasWhereUniqueInput;
};
export type RefineryAliasDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefineryAliasWhereInput;
    limit?: number;
};
export type RefineryAliasDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefineryAliasSelect<ExtArgs> | null;
    omit?: Prisma.RefineryAliasOmit<ExtArgs> | null;
};
//# sourceMappingURL=RefineryAlias.d.ts.map