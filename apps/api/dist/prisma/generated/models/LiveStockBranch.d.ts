import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type LiveStockBranchModel = runtime.Types.Result.DefaultSelection<Prisma.$LiveStockBranchPayload>;
export type AggregateLiveStockBranch = {
    _count: LiveStockBranchCountAggregateOutputType | null;
    _avg: LiveStockBranchAvgAggregateOutputType | null;
    _sum: LiveStockBranchSumAggregateOutputType | null;
    _min: LiveStockBranchMinAggregateOutputType | null;
    _max: LiveStockBranchMaxAggregateOutputType | null;
};
export type LiveStockBranchAvgAggregateOutputType = {
    branchId: number | null;
};
export type LiveStockBranchSumAggregateOutputType = {
    branchId: number | null;
};
export type LiveStockBranchMinAggregateOutputType = {
    code: string | null;
    name: string | null;
    branchId: number | null;
    cutoverDate: Date | null;
    createdAt: Date | null;
};
export type LiveStockBranchMaxAggregateOutputType = {
    code: string | null;
    name: string | null;
    branchId: number | null;
    cutoverDate: Date | null;
    createdAt: Date | null;
};
export type LiveStockBranchCountAggregateOutputType = {
    code: number;
    name: number;
    branchId: number;
    cutoverDate: number;
    createdAt: number;
    _all: number;
};
export type LiveStockBranchAvgAggregateInputType = {
    branchId?: true;
};
export type LiveStockBranchSumAggregateInputType = {
    branchId?: true;
};
export type LiveStockBranchMinAggregateInputType = {
    code?: true;
    name?: true;
    branchId?: true;
    cutoverDate?: true;
    createdAt?: true;
};
export type LiveStockBranchMaxAggregateInputType = {
    code?: true;
    name?: true;
    branchId?: true;
    cutoverDate?: true;
    createdAt?: true;
};
export type LiveStockBranchCountAggregateInputType = {
    code?: true;
    name?: true;
    branchId?: true;
    cutoverDate?: true;
    createdAt?: true;
    _all?: true;
};
export type LiveStockBranchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockBranchWhereInput;
    orderBy?: Prisma.LiveStockBranchOrderByWithRelationInput | Prisma.LiveStockBranchOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockBranchWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LiveStockBranchCountAggregateInputType;
    _avg?: LiveStockBranchAvgAggregateInputType;
    _sum?: LiveStockBranchSumAggregateInputType;
    _min?: LiveStockBranchMinAggregateInputType;
    _max?: LiveStockBranchMaxAggregateInputType;
};
export type GetLiveStockBranchAggregateType<T extends LiveStockBranchAggregateArgs> = {
    [P in keyof T & keyof AggregateLiveStockBranch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLiveStockBranch[P]> : Prisma.GetScalarType<T[P], AggregateLiveStockBranch[P]>;
};
export type LiveStockBranchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockBranchWhereInput;
    orderBy?: Prisma.LiveStockBranchOrderByWithAggregationInput | Prisma.LiveStockBranchOrderByWithAggregationInput[];
    by: Prisma.LiveStockBranchScalarFieldEnum[] | Prisma.LiveStockBranchScalarFieldEnum;
    having?: Prisma.LiveStockBranchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LiveStockBranchCountAggregateInputType | true;
    _avg?: LiveStockBranchAvgAggregateInputType;
    _sum?: LiveStockBranchSumAggregateInputType;
    _min?: LiveStockBranchMinAggregateInputType;
    _max?: LiveStockBranchMaxAggregateInputType;
};
export type LiveStockBranchGroupByOutputType = {
    code: string;
    name: string;
    branchId: number | null;
    cutoverDate: Date | null;
    createdAt: Date;
    _count: LiveStockBranchCountAggregateOutputType | null;
    _avg: LiveStockBranchAvgAggregateOutputType | null;
    _sum: LiveStockBranchSumAggregateOutputType | null;
    _min: LiveStockBranchMinAggregateOutputType | null;
    _max: LiveStockBranchMaxAggregateOutputType | null;
};
export type GetLiveStockBranchGroupByPayload<T extends LiveStockBranchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LiveStockBranchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LiveStockBranchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LiveStockBranchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LiveStockBranchGroupByOutputType[P]>;
}>>;
export type LiveStockBranchWhereInput = {
    AND?: Prisma.LiveStockBranchWhereInput | Prisma.LiveStockBranchWhereInput[];
    OR?: Prisma.LiveStockBranchWhereInput[];
    NOT?: Prisma.LiveStockBranchWhereInput | Prisma.LiveStockBranchWhereInput[];
    code?: Prisma.StringFilter<"LiveStockBranch"> | string;
    name?: Prisma.StringFilter<"LiveStockBranch"> | string;
    branchId?: Prisma.IntNullableFilter<"LiveStockBranch"> | number | null;
    cutoverDate?: Prisma.DateTimeNullableFilter<"LiveStockBranch"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"LiveStockBranch"> | Date | string;
    lines?: Prisma.LiveStockLineListRelationFilter;
};
export type LiveStockBranchOrderByWithRelationInput = {
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    cutoverDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    lines?: Prisma.LiveStockLineOrderByRelationAggregateInput;
};
export type LiveStockBranchWhereUniqueInput = Prisma.AtLeast<{
    code?: string;
    AND?: Prisma.LiveStockBranchWhereInput | Prisma.LiveStockBranchWhereInput[];
    OR?: Prisma.LiveStockBranchWhereInput[];
    NOT?: Prisma.LiveStockBranchWhereInput | Prisma.LiveStockBranchWhereInput[];
    name?: Prisma.StringFilter<"LiveStockBranch"> | string;
    branchId?: Prisma.IntNullableFilter<"LiveStockBranch"> | number | null;
    cutoverDate?: Prisma.DateTimeNullableFilter<"LiveStockBranch"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"LiveStockBranch"> | Date | string;
    lines?: Prisma.LiveStockLineListRelationFilter;
}, "code">;
export type LiveStockBranchOrderByWithAggregationInput = {
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    cutoverDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.LiveStockBranchCountOrderByAggregateInput;
    _avg?: Prisma.LiveStockBranchAvgOrderByAggregateInput;
    _max?: Prisma.LiveStockBranchMaxOrderByAggregateInput;
    _min?: Prisma.LiveStockBranchMinOrderByAggregateInput;
    _sum?: Prisma.LiveStockBranchSumOrderByAggregateInput;
};
export type LiveStockBranchScalarWhereWithAggregatesInput = {
    AND?: Prisma.LiveStockBranchScalarWhereWithAggregatesInput | Prisma.LiveStockBranchScalarWhereWithAggregatesInput[];
    OR?: Prisma.LiveStockBranchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LiveStockBranchScalarWhereWithAggregatesInput | Prisma.LiveStockBranchScalarWhereWithAggregatesInput[];
    code?: Prisma.StringWithAggregatesFilter<"LiveStockBranch"> | string;
    name?: Prisma.StringWithAggregatesFilter<"LiveStockBranch"> | string;
    branchId?: Prisma.IntNullableWithAggregatesFilter<"LiveStockBranch"> | number | null;
    cutoverDate?: Prisma.DateTimeNullableWithAggregatesFilter<"LiveStockBranch"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LiveStockBranch"> | Date | string;
};
export type LiveStockBranchCreateInput = {
    code: string;
    name: string;
    branchId?: number | null;
    cutoverDate?: Date | string | null;
    createdAt?: Date | string;
    lines?: Prisma.LiveStockLineCreateNestedManyWithoutBranchInput;
};
export type LiveStockBranchUncheckedCreateInput = {
    code: string;
    name: string;
    branchId?: number | null;
    cutoverDate?: Date | string | null;
    createdAt?: Date | string;
    lines?: Prisma.LiveStockLineUncheckedCreateNestedManyWithoutBranchInput;
};
export type LiveStockBranchUpdateInput = {
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    cutoverDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.LiveStockLineUpdateManyWithoutBranchNestedInput;
};
export type LiveStockBranchUncheckedUpdateInput = {
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    cutoverDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.LiveStockLineUncheckedUpdateManyWithoutBranchNestedInput;
};
export type LiveStockBranchCreateManyInput = {
    code: string;
    name: string;
    branchId?: number | null;
    cutoverDate?: Date | string | null;
    createdAt?: Date | string;
};
export type LiveStockBranchUpdateManyMutationInput = {
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    cutoverDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBranchUncheckedUpdateManyInput = {
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    cutoverDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBranchCountOrderByAggregateInput = {
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    cutoverDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LiveStockBranchAvgOrderByAggregateInput = {
    branchId?: Prisma.SortOrder;
};
export type LiveStockBranchMaxOrderByAggregateInput = {
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    cutoverDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LiveStockBranchMinOrderByAggregateInput = {
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    cutoverDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LiveStockBranchSumOrderByAggregateInput = {
    branchId?: Prisma.SortOrder;
};
export type LiveStockBranchScalarRelationFilter = {
    is?: Prisma.LiveStockBranchWhereInput;
    isNot?: Prisma.LiveStockBranchWhereInput;
};
export type LiveStockBranchCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.LiveStockBranchCreateWithoutLinesInput, Prisma.LiveStockBranchUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.LiveStockBranchCreateOrConnectWithoutLinesInput;
    connect?: Prisma.LiveStockBranchWhereUniqueInput;
};
export type LiveStockBranchUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.LiveStockBranchCreateWithoutLinesInput, Prisma.LiveStockBranchUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.LiveStockBranchCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.LiveStockBranchUpsertWithoutLinesInput;
    connect?: Prisma.LiveStockBranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LiveStockBranchUpdateToOneWithWhereWithoutLinesInput, Prisma.LiveStockBranchUpdateWithoutLinesInput>, Prisma.LiveStockBranchUncheckedUpdateWithoutLinesInput>;
};
export type LiveStockBranchCreateWithoutLinesInput = {
    code: string;
    name: string;
    branchId?: number | null;
    cutoverDate?: Date | string | null;
    createdAt?: Date | string;
};
export type LiveStockBranchUncheckedCreateWithoutLinesInput = {
    code: string;
    name: string;
    branchId?: number | null;
    cutoverDate?: Date | string | null;
    createdAt?: Date | string;
};
export type LiveStockBranchCreateOrConnectWithoutLinesInput = {
    where: Prisma.LiveStockBranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockBranchCreateWithoutLinesInput, Prisma.LiveStockBranchUncheckedCreateWithoutLinesInput>;
};
export type LiveStockBranchUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.LiveStockBranchUpdateWithoutLinesInput, Prisma.LiveStockBranchUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.LiveStockBranchCreateWithoutLinesInput, Prisma.LiveStockBranchUncheckedCreateWithoutLinesInput>;
    where?: Prisma.LiveStockBranchWhereInput;
};
export type LiveStockBranchUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.LiveStockBranchWhereInput;
    data: Prisma.XOR<Prisma.LiveStockBranchUpdateWithoutLinesInput, Prisma.LiveStockBranchUncheckedUpdateWithoutLinesInput>;
};
export type LiveStockBranchUpdateWithoutLinesInput = {
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    cutoverDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBranchUncheckedUpdateWithoutLinesInput = {
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    cutoverDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBranchCountOutputType = {
    lines: number;
};
export type LiveStockBranchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | LiveStockBranchCountOutputTypeCountLinesArgs;
};
export type LiveStockBranchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchCountOutputTypeSelect<ExtArgs> | null;
};
export type LiveStockBranchCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockLineWhereInput;
};
export type LiveStockBranchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    code?: boolean;
    name?: boolean;
    branchId?: boolean;
    cutoverDate?: boolean;
    createdAt?: boolean;
    lines?: boolean | Prisma.LiveStockBranch$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.LiveStockBranchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockBranch"]>;
export type LiveStockBranchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    code?: boolean;
    name?: boolean;
    branchId?: boolean;
    cutoverDate?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["liveStockBranch"]>;
export type LiveStockBranchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    code?: boolean;
    name?: boolean;
    branchId?: boolean;
    cutoverDate?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["liveStockBranch"]>;
export type LiveStockBranchSelectScalar = {
    code?: boolean;
    name?: boolean;
    branchId?: boolean;
    cutoverDate?: boolean;
    createdAt?: boolean;
};
export type LiveStockBranchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"code" | "name" | "branchId" | "cutoverDate" | "createdAt", ExtArgs["result"]["liveStockBranch"]>;
export type LiveStockBranchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | Prisma.LiveStockBranch$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.LiveStockBranchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type LiveStockBranchIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type LiveStockBranchIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $LiveStockBranchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LiveStockBranch";
    objects: {
        lines: Prisma.$LiveStockLinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        code: string;
        name: string;
        branchId: number | null;
        cutoverDate: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["liveStockBranch"]>;
    composites: {};
};
export type LiveStockBranchGetPayload<S extends boolean | null | undefined | LiveStockBranchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload, S>;
export type LiveStockBranchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LiveStockBranchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LiveStockBranchCountAggregateInputType | true;
};
export interface LiveStockBranchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LiveStockBranch'];
        meta: {
            name: 'LiveStockBranch';
        };
    };
    findUnique<T extends LiveStockBranchFindUniqueArgs>(args: Prisma.SelectSubset<T, LiveStockBranchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LiveStockBranchClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LiveStockBranchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LiveStockBranchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveStockBranchClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LiveStockBranchFindFirstArgs>(args?: Prisma.SelectSubset<T, LiveStockBranchFindFirstArgs<ExtArgs>>): Prisma.Prisma__LiveStockBranchClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LiveStockBranchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LiveStockBranchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveStockBranchClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LiveStockBranchFindManyArgs>(args?: Prisma.SelectSubset<T, LiveStockBranchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LiveStockBranchCreateArgs>(args: Prisma.SelectSubset<T, LiveStockBranchCreateArgs<ExtArgs>>): Prisma.Prisma__LiveStockBranchClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LiveStockBranchCreateManyArgs>(args?: Prisma.SelectSubset<T, LiveStockBranchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LiveStockBranchCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LiveStockBranchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LiveStockBranchDeleteArgs>(args: Prisma.SelectSubset<T, LiveStockBranchDeleteArgs<ExtArgs>>): Prisma.Prisma__LiveStockBranchClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LiveStockBranchUpdateArgs>(args: Prisma.SelectSubset<T, LiveStockBranchUpdateArgs<ExtArgs>>): Prisma.Prisma__LiveStockBranchClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LiveStockBranchDeleteManyArgs>(args?: Prisma.SelectSubset<T, LiveStockBranchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LiveStockBranchUpdateManyArgs>(args: Prisma.SelectSubset<T, LiveStockBranchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LiveStockBranchUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LiveStockBranchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LiveStockBranchUpsertArgs>(args: Prisma.SelectSubset<T, LiveStockBranchUpsertArgs<ExtArgs>>): Prisma.Prisma__LiveStockBranchClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LiveStockBranchCountArgs>(args?: Prisma.Subset<T, LiveStockBranchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LiveStockBranchCountAggregateOutputType> : number>;
    aggregate<T extends LiveStockBranchAggregateArgs>(args: Prisma.Subset<T, LiveStockBranchAggregateArgs>): Prisma.PrismaPromise<GetLiveStockBranchAggregateType<T>>;
    groupBy<T extends LiveStockBranchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LiveStockBranchGroupByArgs['orderBy'];
    } : {
        orderBy?: LiveStockBranchGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LiveStockBranchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLiveStockBranchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LiveStockBranchFieldRefs;
}
export interface Prisma__LiveStockBranchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lines<T extends Prisma.LiveStockBranch$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LiveStockBranch$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LiveStockBranchFieldRefs {
    readonly code: Prisma.FieldRef<"LiveStockBranch", 'String'>;
    readonly name: Prisma.FieldRef<"LiveStockBranch", 'String'>;
    readonly branchId: Prisma.FieldRef<"LiveStockBranch", 'Int'>;
    readonly cutoverDate: Prisma.FieldRef<"LiveStockBranch", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"LiveStockBranch", 'DateTime'>;
}
export type LiveStockBranchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
    where: Prisma.LiveStockBranchWhereUniqueInput;
};
export type LiveStockBranchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
    where: Prisma.LiveStockBranchWhereUniqueInput;
};
export type LiveStockBranchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
    where?: Prisma.LiveStockBranchWhereInput;
    orderBy?: Prisma.LiveStockBranchOrderByWithRelationInput | Prisma.LiveStockBranchOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockBranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveStockBranchScalarFieldEnum | Prisma.LiveStockBranchScalarFieldEnum[];
};
export type LiveStockBranchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
    where?: Prisma.LiveStockBranchWhereInput;
    orderBy?: Prisma.LiveStockBranchOrderByWithRelationInput | Prisma.LiveStockBranchOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockBranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveStockBranchScalarFieldEnum | Prisma.LiveStockBranchScalarFieldEnum[];
};
export type LiveStockBranchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
    where?: Prisma.LiveStockBranchWhereInput;
    orderBy?: Prisma.LiveStockBranchOrderByWithRelationInput | Prisma.LiveStockBranchOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockBranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveStockBranchScalarFieldEnum | Prisma.LiveStockBranchScalarFieldEnum[];
};
export type LiveStockBranchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockBranchCreateInput, Prisma.LiveStockBranchUncheckedCreateInput>;
};
export type LiveStockBranchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LiveStockBranchCreateManyInput | Prisma.LiveStockBranchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LiveStockBranchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    data: Prisma.LiveStockBranchCreateManyInput | Prisma.LiveStockBranchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LiveStockBranchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockBranchUpdateInput, Prisma.LiveStockBranchUncheckedUpdateInput>;
    where: Prisma.LiveStockBranchWhereUniqueInput;
};
export type LiveStockBranchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LiveStockBranchUpdateManyMutationInput, Prisma.LiveStockBranchUncheckedUpdateManyInput>;
    where?: Prisma.LiveStockBranchWhereInput;
    limit?: number;
};
export type LiveStockBranchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockBranchUpdateManyMutationInput, Prisma.LiveStockBranchUncheckedUpdateManyInput>;
    where?: Prisma.LiveStockBranchWhereInput;
    limit?: number;
};
export type LiveStockBranchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
    where: Prisma.LiveStockBranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockBranchCreateInput, Prisma.LiveStockBranchUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LiveStockBranchUpdateInput, Prisma.LiveStockBranchUncheckedUpdateInput>;
};
export type LiveStockBranchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
    where: Prisma.LiveStockBranchWhereUniqueInput;
};
export type LiveStockBranchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockBranchWhereInput;
    limit?: number;
};
export type LiveStockBranch$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    include?: Prisma.LiveStockLineInclude<ExtArgs> | null;
    where?: Prisma.LiveStockLineWhereInput;
    orderBy?: Prisma.LiveStockLineOrderByWithRelationInput | Prisma.LiveStockLineOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveStockLineScalarFieldEnum | Prisma.LiveStockLineScalarFieldEnum[];
};
export type LiveStockBranchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBranchSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBranchOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBranchInclude<ExtArgs> | null;
};
//# sourceMappingURL=LiveStockBranch.d.ts.map