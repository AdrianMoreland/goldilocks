import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type AiAnswerCacheModel = runtime.Types.Result.DefaultSelection<Prisma.$AiAnswerCachePayload>;
export type AggregateAiAnswerCache = {
    _count: AiAnswerCacheCountAggregateOutputType | null;
    _avg: AiAnswerCacheAvgAggregateOutputType | null;
    _sum: AiAnswerCacheSumAggregateOutputType | null;
    _min: AiAnswerCacheMinAggregateOutputType | null;
    _max: AiAnswerCacheMaxAggregateOutputType | null;
};
export type AiAnswerCacheAvgAggregateOutputType = {
    id: number | null;
    hits: number | null;
};
export type AiAnswerCacheSumAggregateOutputType = {
    id: number | null;
    hits: number | null;
};
export type AiAnswerCacheMinAggregateOutputType = {
    id: number | null;
    questionKey: string | null;
    corpusHash: string | null;
    answer: string | null;
    status: string | null;
    model: string | null;
    hits: number | null;
    createdAt: Date | null;
    expiresAt: Date | null;
};
export type AiAnswerCacheMaxAggregateOutputType = {
    id: number | null;
    questionKey: string | null;
    corpusHash: string | null;
    answer: string | null;
    status: string | null;
    model: string | null;
    hits: number | null;
    createdAt: Date | null;
    expiresAt: Date | null;
};
export type AiAnswerCacheCountAggregateOutputType = {
    id: number;
    questionKey: number;
    corpusHash: number;
    answer: number;
    status: number;
    citations: number;
    model: number;
    hits: number;
    createdAt: number;
    expiresAt: number;
    _all: number;
};
export type AiAnswerCacheAvgAggregateInputType = {
    id?: true;
    hits?: true;
};
export type AiAnswerCacheSumAggregateInputType = {
    id?: true;
    hits?: true;
};
export type AiAnswerCacheMinAggregateInputType = {
    id?: true;
    questionKey?: true;
    corpusHash?: true;
    answer?: true;
    status?: true;
    model?: true;
    hits?: true;
    createdAt?: true;
    expiresAt?: true;
};
export type AiAnswerCacheMaxAggregateInputType = {
    id?: true;
    questionKey?: true;
    corpusHash?: true;
    answer?: true;
    status?: true;
    model?: true;
    hits?: true;
    createdAt?: true;
    expiresAt?: true;
};
export type AiAnswerCacheCountAggregateInputType = {
    id?: true;
    questionKey?: true;
    corpusHash?: true;
    answer?: true;
    status?: true;
    citations?: true;
    model?: true;
    hits?: true;
    createdAt?: true;
    expiresAt?: true;
    _all?: true;
};
export type AiAnswerCacheAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiAnswerCacheWhereInput;
    orderBy?: Prisma.AiAnswerCacheOrderByWithRelationInput | Prisma.AiAnswerCacheOrderByWithRelationInput[];
    cursor?: Prisma.AiAnswerCacheWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AiAnswerCacheCountAggregateInputType;
    _avg?: AiAnswerCacheAvgAggregateInputType;
    _sum?: AiAnswerCacheSumAggregateInputType;
    _min?: AiAnswerCacheMinAggregateInputType;
    _max?: AiAnswerCacheMaxAggregateInputType;
};
export type GetAiAnswerCacheAggregateType<T extends AiAnswerCacheAggregateArgs> = {
    [P in keyof T & keyof AggregateAiAnswerCache]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAiAnswerCache[P]> : Prisma.GetScalarType<T[P], AggregateAiAnswerCache[P]>;
};
export type AiAnswerCacheGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiAnswerCacheWhereInput;
    orderBy?: Prisma.AiAnswerCacheOrderByWithAggregationInput | Prisma.AiAnswerCacheOrderByWithAggregationInput[];
    by: Prisma.AiAnswerCacheScalarFieldEnum[] | Prisma.AiAnswerCacheScalarFieldEnum;
    having?: Prisma.AiAnswerCacheScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AiAnswerCacheCountAggregateInputType | true;
    _avg?: AiAnswerCacheAvgAggregateInputType;
    _sum?: AiAnswerCacheSumAggregateInputType;
    _min?: AiAnswerCacheMinAggregateInputType;
    _max?: AiAnswerCacheMaxAggregateInputType;
};
export type AiAnswerCacheGroupByOutputType = {
    id: number;
    questionKey: string;
    corpusHash: string;
    answer: string;
    status: string;
    citations: runtime.JsonValue;
    model: string;
    hits: number;
    createdAt: Date;
    expiresAt: Date;
    _count: AiAnswerCacheCountAggregateOutputType | null;
    _avg: AiAnswerCacheAvgAggregateOutputType | null;
    _sum: AiAnswerCacheSumAggregateOutputType | null;
    _min: AiAnswerCacheMinAggregateOutputType | null;
    _max: AiAnswerCacheMaxAggregateOutputType | null;
};
export type GetAiAnswerCacheGroupByPayload<T extends AiAnswerCacheGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AiAnswerCacheGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AiAnswerCacheGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AiAnswerCacheGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AiAnswerCacheGroupByOutputType[P]>;
}>>;
export type AiAnswerCacheWhereInput = {
    AND?: Prisma.AiAnswerCacheWhereInput | Prisma.AiAnswerCacheWhereInput[];
    OR?: Prisma.AiAnswerCacheWhereInput[];
    NOT?: Prisma.AiAnswerCacheWhereInput | Prisma.AiAnswerCacheWhereInput[];
    id?: Prisma.IntFilter<"AiAnswerCache"> | number;
    questionKey?: Prisma.StringFilter<"AiAnswerCache"> | string;
    corpusHash?: Prisma.StringFilter<"AiAnswerCache"> | string;
    answer?: Prisma.StringFilter<"AiAnswerCache"> | string;
    status?: Prisma.StringFilter<"AiAnswerCache"> | string;
    citations?: Prisma.JsonFilter<"AiAnswerCache">;
    model?: Prisma.StringFilter<"AiAnswerCache"> | string;
    hits?: Prisma.IntFilter<"AiAnswerCache"> | number;
    createdAt?: Prisma.DateTimeFilter<"AiAnswerCache"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"AiAnswerCache"> | Date | string;
};
export type AiAnswerCacheOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    questionKey?: Prisma.SortOrder;
    corpusHash?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    citations?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    hits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type AiAnswerCacheWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    questionKey_corpusHash?: Prisma.AiAnswerCacheQuestionKeyCorpusHashCompoundUniqueInput;
    AND?: Prisma.AiAnswerCacheWhereInput | Prisma.AiAnswerCacheWhereInput[];
    OR?: Prisma.AiAnswerCacheWhereInput[];
    NOT?: Prisma.AiAnswerCacheWhereInput | Prisma.AiAnswerCacheWhereInput[];
    questionKey?: Prisma.StringFilter<"AiAnswerCache"> | string;
    corpusHash?: Prisma.StringFilter<"AiAnswerCache"> | string;
    answer?: Prisma.StringFilter<"AiAnswerCache"> | string;
    status?: Prisma.StringFilter<"AiAnswerCache"> | string;
    citations?: Prisma.JsonFilter<"AiAnswerCache">;
    model?: Prisma.StringFilter<"AiAnswerCache"> | string;
    hits?: Prisma.IntFilter<"AiAnswerCache"> | number;
    createdAt?: Prisma.DateTimeFilter<"AiAnswerCache"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"AiAnswerCache"> | Date | string;
}, "id" | "questionKey_corpusHash">;
export type AiAnswerCacheOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    questionKey?: Prisma.SortOrder;
    corpusHash?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    citations?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    hits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    _count?: Prisma.AiAnswerCacheCountOrderByAggregateInput;
    _avg?: Prisma.AiAnswerCacheAvgOrderByAggregateInput;
    _max?: Prisma.AiAnswerCacheMaxOrderByAggregateInput;
    _min?: Prisma.AiAnswerCacheMinOrderByAggregateInput;
    _sum?: Prisma.AiAnswerCacheSumOrderByAggregateInput;
};
export type AiAnswerCacheScalarWhereWithAggregatesInput = {
    AND?: Prisma.AiAnswerCacheScalarWhereWithAggregatesInput | Prisma.AiAnswerCacheScalarWhereWithAggregatesInput[];
    OR?: Prisma.AiAnswerCacheScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AiAnswerCacheScalarWhereWithAggregatesInput | Prisma.AiAnswerCacheScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"AiAnswerCache"> | number;
    questionKey?: Prisma.StringWithAggregatesFilter<"AiAnswerCache"> | string;
    corpusHash?: Prisma.StringWithAggregatesFilter<"AiAnswerCache"> | string;
    answer?: Prisma.StringWithAggregatesFilter<"AiAnswerCache"> | string;
    status?: Prisma.StringWithAggregatesFilter<"AiAnswerCache"> | string;
    citations?: Prisma.JsonWithAggregatesFilter<"AiAnswerCache">;
    model?: Prisma.StringWithAggregatesFilter<"AiAnswerCache"> | string;
    hits?: Prisma.IntWithAggregatesFilter<"AiAnswerCache"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"AiAnswerCache"> | Date | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"AiAnswerCache"> | Date | string;
};
export type AiAnswerCacheCreateInput = {
    questionKey: string;
    corpusHash: string;
    answer: string;
    status: string;
    citations: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    model: string;
    hits?: number;
    createdAt?: Date | string;
    expiresAt: Date | string;
};
export type AiAnswerCacheUncheckedCreateInput = {
    id?: number;
    questionKey: string;
    corpusHash: string;
    answer: string;
    status: string;
    citations: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    model: string;
    hits?: number;
    createdAt?: Date | string;
    expiresAt: Date | string;
};
export type AiAnswerCacheUpdateInput = {
    questionKey?: Prisma.StringFieldUpdateOperationsInput | string;
    corpusHash?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    citations?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    model?: Prisma.StringFieldUpdateOperationsInput | string;
    hits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiAnswerCacheUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    questionKey?: Prisma.StringFieldUpdateOperationsInput | string;
    corpusHash?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    citations?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    model?: Prisma.StringFieldUpdateOperationsInput | string;
    hits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiAnswerCacheCreateManyInput = {
    id?: number;
    questionKey: string;
    corpusHash: string;
    answer: string;
    status: string;
    citations: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    model: string;
    hits?: number;
    createdAt?: Date | string;
    expiresAt: Date | string;
};
export type AiAnswerCacheUpdateManyMutationInput = {
    questionKey?: Prisma.StringFieldUpdateOperationsInput | string;
    corpusHash?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    citations?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    model?: Prisma.StringFieldUpdateOperationsInput | string;
    hits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiAnswerCacheUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    questionKey?: Prisma.StringFieldUpdateOperationsInput | string;
    corpusHash?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    citations?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    model?: Prisma.StringFieldUpdateOperationsInput | string;
    hits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiAnswerCacheQuestionKeyCorpusHashCompoundUniqueInput = {
    questionKey: string;
    corpusHash: string;
};
export type AiAnswerCacheCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    questionKey?: Prisma.SortOrder;
    corpusHash?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    citations?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    hits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type AiAnswerCacheAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    hits?: Prisma.SortOrder;
};
export type AiAnswerCacheMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    questionKey?: Prisma.SortOrder;
    corpusHash?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    hits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type AiAnswerCacheMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    questionKey?: Prisma.SortOrder;
    corpusHash?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    hits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type AiAnswerCacheSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    hits?: Prisma.SortOrder;
};
export type AiAnswerCacheSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    questionKey?: boolean;
    corpusHash?: boolean;
    answer?: boolean;
    status?: boolean;
    citations?: boolean;
    model?: boolean;
    hits?: boolean;
    createdAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["aiAnswerCache"]>;
export type AiAnswerCacheSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    questionKey?: boolean;
    corpusHash?: boolean;
    answer?: boolean;
    status?: boolean;
    citations?: boolean;
    model?: boolean;
    hits?: boolean;
    createdAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["aiAnswerCache"]>;
export type AiAnswerCacheSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    questionKey?: boolean;
    corpusHash?: boolean;
    answer?: boolean;
    status?: boolean;
    citations?: boolean;
    model?: boolean;
    hits?: boolean;
    createdAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["aiAnswerCache"]>;
export type AiAnswerCacheSelectScalar = {
    id?: boolean;
    questionKey?: boolean;
    corpusHash?: boolean;
    answer?: boolean;
    status?: boolean;
    citations?: boolean;
    model?: boolean;
    hits?: boolean;
    createdAt?: boolean;
    expiresAt?: boolean;
};
export type AiAnswerCacheOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "questionKey" | "corpusHash" | "answer" | "status" | "citations" | "model" | "hits" | "createdAt" | "expiresAt", ExtArgs["result"]["aiAnswerCache"]>;
export type $AiAnswerCachePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AiAnswerCache";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        questionKey: string;
        corpusHash: string;
        answer: string;
        status: string;
        citations: runtime.JsonValue;
        model: string;
        hits: number;
        createdAt: Date;
        expiresAt: Date;
    }, ExtArgs["result"]["aiAnswerCache"]>;
    composites: {};
};
export type AiAnswerCacheGetPayload<S extends boolean | null | undefined | AiAnswerCacheDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload, S>;
export type AiAnswerCacheCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AiAnswerCacheFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AiAnswerCacheCountAggregateInputType | true;
};
export interface AiAnswerCacheDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AiAnswerCache'];
        meta: {
            name: 'AiAnswerCache';
        };
    };
    findUnique<T extends AiAnswerCacheFindUniqueArgs>(args: Prisma.SelectSubset<T, AiAnswerCacheFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AiAnswerCacheClient<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AiAnswerCacheFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AiAnswerCacheFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AiAnswerCacheClient<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AiAnswerCacheFindFirstArgs>(args?: Prisma.SelectSubset<T, AiAnswerCacheFindFirstArgs<ExtArgs>>): Prisma.Prisma__AiAnswerCacheClient<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AiAnswerCacheFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AiAnswerCacheFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AiAnswerCacheClient<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AiAnswerCacheFindManyArgs>(args?: Prisma.SelectSubset<T, AiAnswerCacheFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AiAnswerCacheCreateArgs>(args: Prisma.SelectSubset<T, AiAnswerCacheCreateArgs<ExtArgs>>): Prisma.Prisma__AiAnswerCacheClient<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AiAnswerCacheCreateManyArgs>(args?: Prisma.SelectSubset<T, AiAnswerCacheCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AiAnswerCacheCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AiAnswerCacheCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AiAnswerCacheDeleteArgs>(args: Prisma.SelectSubset<T, AiAnswerCacheDeleteArgs<ExtArgs>>): Prisma.Prisma__AiAnswerCacheClient<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AiAnswerCacheUpdateArgs>(args: Prisma.SelectSubset<T, AiAnswerCacheUpdateArgs<ExtArgs>>): Prisma.Prisma__AiAnswerCacheClient<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AiAnswerCacheDeleteManyArgs>(args?: Prisma.SelectSubset<T, AiAnswerCacheDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AiAnswerCacheUpdateManyArgs>(args: Prisma.SelectSubset<T, AiAnswerCacheUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AiAnswerCacheUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AiAnswerCacheUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AiAnswerCacheUpsertArgs>(args: Prisma.SelectSubset<T, AiAnswerCacheUpsertArgs<ExtArgs>>): Prisma.Prisma__AiAnswerCacheClient<runtime.Types.Result.GetResult<Prisma.$AiAnswerCachePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AiAnswerCacheCountArgs>(args?: Prisma.Subset<T, AiAnswerCacheCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AiAnswerCacheCountAggregateOutputType> : number>;
    aggregate<T extends AiAnswerCacheAggregateArgs>(args: Prisma.Subset<T, AiAnswerCacheAggregateArgs>): Prisma.PrismaPromise<GetAiAnswerCacheAggregateType<T>>;
    groupBy<T extends AiAnswerCacheGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AiAnswerCacheGroupByArgs['orderBy'];
    } : {
        orderBy?: AiAnswerCacheGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AiAnswerCacheGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiAnswerCacheGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AiAnswerCacheFieldRefs;
}
export interface Prisma__AiAnswerCacheClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AiAnswerCacheFieldRefs {
    readonly id: Prisma.FieldRef<"AiAnswerCache", 'Int'>;
    readonly questionKey: Prisma.FieldRef<"AiAnswerCache", 'String'>;
    readonly corpusHash: Prisma.FieldRef<"AiAnswerCache", 'String'>;
    readonly answer: Prisma.FieldRef<"AiAnswerCache", 'String'>;
    readonly status: Prisma.FieldRef<"AiAnswerCache", 'String'>;
    readonly citations: Prisma.FieldRef<"AiAnswerCache", 'Json'>;
    readonly model: Prisma.FieldRef<"AiAnswerCache", 'String'>;
    readonly hits: Prisma.FieldRef<"AiAnswerCache", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"AiAnswerCache", 'DateTime'>;
    readonly expiresAt: Prisma.FieldRef<"AiAnswerCache", 'DateTime'>;
}
export type AiAnswerCacheFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    where: Prisma.AiAnswerCacheWhereUniqueInput;
};
export type AiAnswerCacheFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    where: Prisma.AiAnswerCacheWhereUniqueInput;
};
export type AiAnswerCacheFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    where?: Prisma.AiAnswerCacheWhereInput;
    orderBy?: Prisma.AiAnswerCacheOrderByWithRelationInput | Prisma.AiAnswerCacheOrderByWithRelationInput[];
    cursor?: Prisma.AiAnswerCacheWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiAnswerCacheScalarFieldEnum | Prisma.AiAnswerCacheScalarFieldEnum[];
};
export type AiAnswerCacheFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    where?: Prisma.AiAnswerCacheWhereInput;
    orderBy?: Prisma.AiAnswerCacheOrderByWithRelationInput | Prisma.AiAnswerCacheOrderByWithRelationInput[];
    cursor?: Prisma.AiAnswerCacheWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiAnswerCacheScalarFieldEnum | Prisma.AiAnswerCacheScalarFieldEnum[];
};
export type AiAnswerCacheFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    where?: Prisma.AiAnswerCacheWhereInput;
    orderBy?: Prisma.AiAnswerCacheOrderByWithRelationInput | Prisma.AiAnswerCacheOrderByWithRelationInput[];
    cursor?: Prisma.AiAnswerCacheWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiAnswerCacheScalarFieldEnum | Prisma.AiAnswerCacheScalarFieldEnum[];
};
export type AiAnswerCacheCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiAnswerCacheCreateInput, Prisma.AiAnswerCacheUncheckedCreateInput>;
};
export type AiAnswerCacheCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AiAnswerCacheCreateManyInput | Prisma.AiAnswerCacheCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AiAnswerCacheCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    data: Prisma.AiAnswerCacheCreateManyInput | Prisma.AiAnswerCacheCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AiAnswerCacheUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiAnswerCacheUpdateInput, Prisma.AiAnswerCacheUncheckedUpdateInput>;
    where: Prisma.AiAnswerCacheWhereUniqueInput;
};
export type AiAnswerCacheUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AiAnswerCacheUpdateManyMutationInput, Prisma.AiAnswerCacheUncheckedUpdateManyInput>;
    where?: Prisma.AiAnswerCacheWhereInput;
    limit?: number;
};
export type AiAnswerCacheUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiAnswerCacheUpdateManyMutationInput, Prisma.AiAnswerCacheUncheckedUpdateManyInput>;
    where?: Prisma.AiAnswerCacheWhereInput;
    limit?: number;
};
export type AiAnswerCacheUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    where: Prisma.AiAnswerCacheWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiAnswerCacheCreateInput, Prisma.AiAnswerCacheUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AiAnswerCacheUpdateInput, Prisma.AiAnswerCacheUncheckedUpdateInput>;
};
export type AiAnswerCacheDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
    where: Prisma.AiAnswerCacheWhereUniqueInput;
};
export type AiAnswerCacheDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiAnswerCacheWhereInput;
    limit?: number;
};
export type AiAnswerCacheDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiAnswerCacheSelect<ExtArgs> | null;
    omit?: Prisma.AiAnswerCacheOmit<ExtArgs> | null;
};
//# sourceMappingURL=AiAnswerCache.d.ts.map