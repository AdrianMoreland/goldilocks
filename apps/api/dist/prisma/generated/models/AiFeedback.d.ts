import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type AiFeedbackModel = runtime.Types.Result.DefaultSelection<Prisma.$AiFeedbackPayload>;
export type AggregateAiFeedback = {
    _count: AiFeedbackCountAggregateOutputType | null;
    _avg: AiFeedbackAvgAggregateOutputType | null;
    _sum: AiFeedbackSumAggregateOutputType | null;
    _min: AiFeedbackMinAggregateOutputType | null;
    _max: AiFeedbackMaxAggregateOutputType | null;
};
export type AiFeedbackAvgAggregateOutputType = {
    id: number | null;
    questionId: number | null;
};
export type AiFeedbackSumAggregateOutputType = {
    id: number | null;
    questionId: number | null;
};
export type AiFeedbackMinAggregateOutputType = {
    id: number | null;
    questionId: number | null;
    userId: string | null;
    helpful: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AiFeedbackMaxAggregateOutputType = {
    id: number | null;
    questionId: number | null;
    userId: string | null;
    helpful: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AiFeedbackCountAggregateOutputType = {
    id: number;
    questionId: number;
    userId: number;
    helpful: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type AiFeedbackAvgAggregateInputType = {
    id?: true;
    questionId?: true;
};
export type AiFeedbackSumAggregateInputType = {
    id?: true;
    questionId?: true;
};
export type AiFeedbackMinAggregateInputType = {
    id?: true;
    questionId?: true;
    userId?: true;
    helpful?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AiFeedbackMaxAggregateInputType = {
    id?: true;
    questionId?: true;
    userId?: true;
    helpful?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AiFeedbackCountAggregateInputType = {
    id?: true;
    questionId?: true;
    userId?: true;
    helpful?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type AiFeedbackAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiFeedbackWhereInput;
    orderBy?: Prisma.AiFeedbackOrderByWithRelationInput | Prisma.AiFeedbackOrderByWithRelationInput[];
    cursor?: Prisma.AiFeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AiFeedbackCountAggregateInputType;
    _avg?: AiFeedbackAvgAggregateInputType;
    _sum?: AiFeedbackSumAggregateInputType;
    _min?: AiFeedbackMinAggregateInputType;
    _max?: AiFeedbackMaxAggregateInputType;
};
export type GetAiFeedbackAggregateType<T extends AiFeedbackAggregateArgs> = {
    [P in keyof T & keyof AggregateAiFeedback]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAiFeedback[P]> : Prisma.GetScalarType<T[P], AggregateAiFeedback[P]>;
};
export type AiFeedbackGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiFeedbackWhereInput;
    orderBy?: Prisma.AiFeedbackOrderByWithAggregationInput | Prisma.AiFeedbackOrderByWithAggregationInput[];
    by: Prisma.AiFeedbackScalarFieldEnum[] | Prisma.AiFeedbackScalarFieldEnum;
    having?: Prisma.AiFeedbackScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AiFeedbackCountAggregateInputType | true;
    _avg?: AiFeedbackAvgAggregateInputType;
    _sum?: AiFeedbackSumAggregateInputType;
    _min?: AiFeedbackMinAggregateInputType;
    _max?: AiFeedbackMaxAggregateInputType;
};
export type AiFeedbackGroupByOutputType = {
    id: number;
    questionId: number;
    userId: string;
    helpful: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: AiFeedbackCountAggregateOutputType | null;
    _avg: AiFeedbackAvgAggregateOutputType | null;
    _sum: AiFeedbackSumAggregateOutputType | null;
    _min: AiFeedbackMinAggregateOutputType | null;
    _max: AiFeedbackMaxAggregateOutputType | null;
};
export type GetAiFeedbackGroupByPayload<T extends AiFeedbackGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AiFeedbackGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AiFeedbackGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AiFeedbackGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AiFeedbackGroupByOutputType[P]>;
}>>;
export type AiFeedbackWhereInput = {
    AND?: Prisma.AiFeedbackWhereInput | Prisma.AiFeedbackWhereInput[];
    OR?: Prisma.AiFeedbackWhereInput[];
    NOT?: Prisma.AiFeedbackWhereInput | Prisma.AiFeedbackWhereInput[];
    id?: Prisma.IntFilter<"AiFeedback"> | number;
    questionId?: Prisma.IntFilter<"AiFeedback"> | number;
    userId?: Prisma.StringFilter<"AiFeedback"> | string;
    helpful?: Prisma.BoolFilter<"AiFeedback"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"AiFeedback"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AiFeedback"> | Date | string;
    question?: Prisma.XOR<Prisma.AiQuestionLogScalarRelationFilter, Prisma.AiQuestionLogWhereInput>;
};
export type AiFeedbackOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    helpful?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    question?: Prisma.AiQuestionLogOrderByWithRelationInput;
};
export type AiFeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    questionId_userId?: Prisma.AiFeedbackQuestionIdUserIdCompoundUniqueInput;
    AND?: Prisma.AiFeedbackWhereInput | Prisma.AiFeedbackWhereInput[];
    OR?: Prisma.AiFeedbackWhereInput[];
    NOT?: Prisma.AiFeedbackWhereInput | Prisma.AiFeedbackWhereInput[];
    questionId?: Prisma.IntFilter<"AiFeedback"> | number;
    userId?: Prisma.StringFilter<"AiFeedback"> | string;
    helpful?: Prisma.BoolFilter<"AiFeedback"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"AiFeedback"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AiFeedback"> | Date | string;
    question?: Prisma.XOR<Prisma.AiQuestionLogScalarRelationFilter, Prisma.AiQuestionLogWhereInput>;
}, "id" | "questionId_userId">;
export type AiFeedbackOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    helpful?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.AiFeedbackCountOrderByAggregateInput;
    _avg?: Prisma.AiFeedbackAvgOrderByAggregateInput;
    _max?: Prisma.AiFeedbackMaxOrderByAggregateInput;
    _min?: Prisma.AiFeedbackMinOrderByAggregateInput;
    _sum?: Prisma.AiFeedbackSumOrderByAggregateInput;
};
export type AiFeedbackScalarWhereWithAggregatesInput = {
    AND?: Prisma.AiFeedbackScalarWhereWithAggregatesInput | Prisma.AiFeedbackScalarWhereWithAggregatesInput[];
    OR?: Prisma.AiFeedbackScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AiFeedbackScalarWhereWithAggregatesInput | Prisma.AiFeedbackScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"AiFeedback"> | number;
    questionId?: Prisma.IntWithAggregatesFilter<"AiFeedback"> | number;
    userId?: Prisma.StringWithAggregatesFilter<"AiFeedback"> | string;
    helpful?: Prisma.BoolWithAggregatesFilter<"AiFeedback"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"AiFeedback"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"AiFeedback"> | Date | string;
};
export type AiFeedbackCreateInput = {
    userId: string;
    helpful: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    question: Prisma.AiQuestionLogCreateNestedOneWithoutFeedbackInput;
};
export type AiFeedbackUncheckedCreateInput = {
    id?: number;
    questionId: number;
    userId: string;
    helpful: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AiFeedbackUpdateInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    helpful?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    question?: Prisma.AiQuestionLogUpdateOneRequiredWithoutFeedbackNestedInput;
};
export type AiFeedbackUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    helpful?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiFeedbackCreateManyInput = {
    id?: number;
    questionId: number;
    userId: string;
    helpful: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AiFeedbackUpdateManyMutationInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    helpful?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiFeedbackUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    helpful?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiFeedbackListRelationFilter = {
    every?: Prisma.AiFeedbackWhereInput;
    some?: Prisma.AiFeedbackWhereInput;
    none?: Prisma.AiFeedbackWhereInput;
};
export type AiFeedbackOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AiFeedbackQuestionIdUserIdCompoundUniqueInput = {
    questionId: number;
    userId: string;
};
export type AiFeedbackCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    helpful?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AiFeedbackAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
};
export type AiFeedbackMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    helpful?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AiFeedbackMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    helpful?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AiFeedbackSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
};
export type AiFeedbackCreateNestedManyWithoutQuestionInput = {
    create?: Prisma.XOR<Prisma.AiFeedbackCreateWithoutQuestionInput, Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput> | Prisma.AiFeedbackCreateWithoutQuestionInput[] | Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.AiFeedbackCreateOrConnectWithoutQuestionInput | Prisma.AiFeedbackCreateOrConnectWithoutQuestionInput[];
    createMany?: Prisma.AiFeedbackCreateManyQuestionInputEnvelope;
    connect?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
};
export type AiFeedbackUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: Prisma.XOR<Prisma.AiFeedbackCreateWithoutQuestionInput, Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput> | Prisma.AiFeedbackCreateWithoutQuestionInput[] | Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.AiFeedbackCreateOrConnectWithoutQuestionInput | Prisma.AiFeedbackCreateOrConnectWithoutQuestionInput[];
    createMany?: Prisma.AiFeedbackCreateManyQuestionInputEnvelope;
    connect?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
};
export type AiFeedbackUpdateManyWithoutQuestionNestedInput = {
    create?: Prisma.XOR<Prisma.AiFeedbackCreateWithoutQuestionInput, Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput> | Prisma.AiFeedbackCreateWithoutQuestionInput[] | Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.AiFeedbackCreateOrConnectWithoutQuestionInput | Prisma.AiFeedbackCreateOrConnectWithoutQuestionInput[];
    upsert?: Prisma.AiFeedbackUpsertWithWhereUniqueWithoutQuestionInput | Prisma.AiFeedbackUpsertWithWhereUniqueWithoutQuestionInput[];
    createMany?: Prisma.AiFeedbackCreateManyQuestionInputEnvelope;
    set?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
    disconnect?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
    delete?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
    connect?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
    update?: Prisma.AiFeedbackUpdateWithWhereUniqueWithoutQuestionInput | Prisma.AiFeedbackUpdateWithWhereUniqueWithoutQuestionInput[];
    updateMany?: Prisma.AiFeedbackUpdateManyWithWhereWithoutQuestionInput | Prisma.AiFeedbackUpdateManyWithWhereWithoutQuestionInput[];
    deleteMany?: Prisma.AiFeedbackScalarWhereInput | Prisma.AiFeedbackScalarWhereInput[];
};
export type AiFeedbackUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: Prisma.XOR<Prisma.AiFeedbackCreateWithoutQuestionInput, Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput> | Prisma.AiFeedbackCreateWithoutQuestionInput[] | Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.AiFeedbackCreateOrConnectWithoutQuestionInput | Prisma.AiFeedbackCreateOrConnectWithoutQuestionInput[];
    upsert?: Prisma.AiFeedbackUpsertWithWhereUniqueWithoutQuestionInput | Prisma.AiFeedbackUpsertWithWhereUniqueWithoutQuestionInput[];
    createMany?: Prisma.AiFeedbackCreateManyQuestionInputEnvelope;
    set?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
    disconnect?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
    delete?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
    connect?: Prisma.AiFeedbackWhereUniqueInput | Prisma.AiFeedbackWhereUniqueInput[];
    update?: Prisma.AiFeedbackUpdateWithWhereUniqueWithoutQuestionInput | Prisma.AiFeedbackUpdateWithWhereUniqueWithoutQuestionInput[];
    updateMany?: Prisma.AiFeedbackUpdateManyWithWhereWithoutQuestionInput | Prisma.AiFeedbackUpdateManyWithWhereWithoutQuestionInput[];
    deleteMany?: Prisma.AiFeedbackScalarWhereInput | Prisma.AiFeedbackScalarWhereInput[];
};
export type AiFeedbackCreateWithoutQuestionInput = {
    userId: string;
    helpful: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AiFeedbackUncheckedCreateWithoutQuestionInput = {
    id?: number;
    userId: string;
    helpful: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AiFeedbackCreateOrConnectWithoutQuestionInput = {
    where: Prisma.AiFeedbackWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiFeedbackCreateWithoutQuestionInput, Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput>;
};
export type AiFeedbackCreateManyQuestionInputEnvelope = {
    data: Prisma.AiFeedbackCreateManyQuestionInput | Prisma.AiFeedbackCreateManyQuestionInput[];
    skipDuplicates?: boolean;
};
export type AiFeedbackUpsertWithWhereUniqueWithoutQuestionInput = {
    where: Prisma.AiFeedbackWhereUniqueInput;
    update: Prisma.XOR<Prisma.AiFeedbackUpdateWithoutQuestionInput, Prisma.AiFeedbackUncheckedUpdateWithoutQuestionInput>;
    create: Prisma.XOR<Prisma.AiFeedbackCreateWithoutQuestionInput, Prisma.AiFeedbackUncheckedCreateWithoutQuestionInput>;
};
export type AiFeedbackUpdateWithWhereUniqueWithoutQuestionInput = {
    where: Prisma.AiFeedbackWhereUniqueInput;
    data: Prisma.XOR<Prisma.AiFeedbackUpdateWithoutQuestionInput, Prisma.AiFeedbackUncheckedUpdateWithoutQuestionInput>;
};
export type AiFeedbackUpdateManyWithWhereWithoutQuestionInput = {
    where: Prisma.AiFeedbackScalarWhereInput;
    data: Prisma.XOR<Prisma.AiFeedbackUpdateManyMutationInput, Prisma.AiFeedbackUncheckedUpdateManyWithoutQuestionInput>;
};
export type AiFeedbackScalarWhereInput = {
    AND?: Prisma.AiFeedbackScalarWhereInput | Prisma.AiFeedbackScalarWhereInput[];
    OR?: Prisma.AiFeedbackScalarWhereInput[];
    NOT?: Prisma.AiFeedbackScalarWhereInput | Prisma.AiFeedbackScalarWhereInput[];
    id?: Prisma.IntFilter<"AiFeedback"> | number;
    questionId?: Prisma.IntFilter<"AiFeedback"> | number;
    userId?: Prisma.StringFilter<"AiFeedback"> | string;
    helpful?: Prisma.BoolFilter<"AiFeedback"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"AiFeedback"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AiFeedback"> | Date | string;
};
export type AiFeedbackCreateManyQuestionInput = {
    id?: number;
    userId: string;
    helpful: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AiFeedbackUpdateWithoutQuestionInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    helpful?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiFeedbackUncheckedUpdateWithoutQuestionInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    helpful?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiFeedbackUncheckedUpdateManyWithoutQuestionInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    helpful?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiFeedbackSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    questionId?: boolean;
    userId?: boolean;
    helpful?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    question?: boolean | Prisma.AiQuestionLogDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["aiFeedback"]>;
export type AiFeedbackSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    questionId?: boolean;
    userId?: boolean;
    helpful?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    question?: boolean | Prisma.AiQuestionLogDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["aiFeedback"]>;
export type AiFeedbackSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    questionId?: boolean;
    userId?: boolean;
    helpful?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    question?: boolean | Prisma.AiQuestionLogDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["aiFeedback"]>;
export type AiFeedbackSelectScalar = {
    id?: boolean;
    questionId?: boolean;
    userId?: boolean;
    helpful?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type AiFeedbackOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "questionId" | "userId" | "helpful" | "createdAt" | "updatedAt", ExtArgs["result"]["aiFeedback"]>;
export type AiFeedbackInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    question?: boolean | Prisma.AiQuestionLogDefaultArgs<ExtArgs>;
};
export type AiFeedbackIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    question?: boolean | Prisma.AiQuestionLogDefaultArgs<ExtArgs>;
};
export type AiFeedbackIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    question?: boolean | Prisma.AiQuestionLogDefaultArgs<ExtArgs>;
};
export type $AiFeedbackPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AiFeedback";
    objects: {
        question: Prisma.$AiQuestionLogPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        questionId: number;
        userId: string;
        helpful: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["aiFeedback"]>;
    composites: {};
};
export type AiFeedbackGetPayload<S extends boolean | null | undefined | AiFeedbackDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload, S>;
export type AiFeedbackCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AiFeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AiFeedbackCountAggregateInputType | true;
};
export interface AiFeedbackDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AiFeedback'];
        meta: {
            name: 'AiFeedback';
        };
    };
    findUnique<T extends AiFeedbackFindUniqueArgs>(args: Prisma.SelectSubset<T, AiFeedbackFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AiFeedbackClient<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AiFeedbackFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AiFeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AiFeedbackClient<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AiFeedbackFindFirstArgs>(args?: Prisma.SelectSubset<T, AiFeedbackFindFirstArgs<ExtArgs>>): Prisma.Prisma__AiFeedbackClient<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AiFeedbackFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AiFeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AiFeedbackClient<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AiFeedbackFindManyArgs>(args?: Prisma.SelectSubset<T, AiFeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AiFeedbackCreateArgs>(args: Prisma.SelectSubset<T, AiFeedbackCreateArgs<ExtArgs>>): Prisma.Prisma__AiFeedbackClient<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AiFeedbackCreateManyArgs>(args?: Prisma.SelectSubset<T, AiFeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AiFeedbackCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AiFeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AiFeedbackDeleteArgs>(args: Prisma.SelectSubset<T, AiFeedbackDeleteArgs<ExtArgs>>): Prisma.Prisma__AiFeedbackClient<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AiFeedbackUpdateArgs>(args: Prisma.SelectSubset<T, AiFeedbackUpdateArgs<ExtArgs>>): Prisma.Prisma__AiFeedbackClient<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AiFeedbackDeleteManyArgs>(args?: Prisma.SelectSubset<T, AiFeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AiFeedbackUpdateManyArgs>(args: Prisma.SelectSubset<T, AiFeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AiFeedbackUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AiFeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AiFeedbackUpsertArgs>(args: Prisma.SelectSubset<T, AiFeedbackUpsertArgs<ExtArgs>>): Prisma.Prisma__AiFeedbackClient<runtime.Types.Result.GetResult<Prisma.$AiFeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AiFeedbackCountArgs>(args?: Prisma.Subset<T, AiFeedbackCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AiFeedbackCountAggregateOutputType> : number>;
    aggregate<T extends AiFeedbackAggregateArgs>(args: Prisma.Subset<T, AiFeedbackAggregateArgs>): Prisma.PrismaPromise<GetAiFeedbackAggregateType<T>>;
    groupBy<T extends AiFeedbackGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AiFeedbackGroupByArgs['orderBy'];
    } : {
        orderBy?: AiFeedbackGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AiFeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AiFeedbackFieldRefs;
}
export interface Prisma__AiFeedbackClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    question<T extends Prisma.AiQuestionLogDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AiQuestionLogDefaultArgs<ExtArgs>>): Prisma.Prisma__AiQuestionLogClient<runtime.Types.Result.GetResult<Prisma.$AiQuestionLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AiFeedbackFieldRefs {
    readonly id: Prisma.FieldRef<"AiFeedback", 'Int'>;
    readonly questionId: Prisma.FieldRef<"AiFeedback", 'Int'>;
    readonly userId: Prisma.FieldRef<"AiFeedback", 'String'>;
    readonly helpful: Prisma.FieldRef<"AiFeedback", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"AiFeedback", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"AiFeedback", 'DateTime'>;
}
export type AiFeedbackFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
    where: Prisma.AiFeedbackWhereUniqueInput;
};
export type AiFeedbackFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
    where: Prisma.AiFeedbackWhereUniqueInput;
};
export type AiFeedbackFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
    where?: Prisma.AiFeedbackWhereInput;
    orderBy?: Prisma.AiFeedbackOrderByWithRelationInput | Prisma.AiFeedbackOrderByWithRelationInput[];
    cursor?: Prisma.AiFeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiFeedbackScalarFieldEnum | Prisma.AiFeedbackScalarFieldEnum[];
};
export type AiFeedbackFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
    where?: Prisma.AiFeedbackWhereInput;
    orderBy?: Prisma.AiFeedbackOrderByWithRelationInput | Prisma.AiFeedbackOrderByWithRelationInput[];
    cursor?: Prisma.AiFeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiFeedbackScalarFieldEnum | Prisma.AiFeedbackScalarFieldEnum[];
};
export type AiFeedbackFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
    where?: Prisma.AiFeedbackWhereInput;
    orderBy?: Prisma.AiFeedbackOrderByWithRelationInput | Prisma.AiFeedbackOrderByWithRelationInput[];
    cursor?: Prisma.AiFeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiFeedbackScalarFieldEnum | Prisma.AiFeedbackScalarFieldEnum[];
};
export type AiFeedbackCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiFeedbackCreateInput, Prisma.AiFeedbackUncheckedCreateInput>;
};
export type AiFeedbackCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AiFeedbackCreateManyInput | Prisma.AiFeedbackCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AiFeedbackCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    data: Prisma.AiFeedbackCreateManyInput | Prisma.AiFeedbackCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AiFeedbackIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AiFeedbackUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiFeedbackUpdateInput, Prisma.AiFeedbackUncheckedUpdateInput>;
    where: Prisma.AiFeedbackWhereUniqueInput;
};
export type AiFeedbackUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AiFeedbackUpdateManyMutationInput, Prisma.AiFeedbackUncheckedUpdateManyInput>;
    where?: Prisma.AiFeedbackWhereInput;
    limit?: number;
};
export type AiFeedbackUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiFeedbackUpdateManyMutationInput, Prisma.AiFeedbackUncheckedUpdateManyInput>;
    where?: Prisma.AiFeedbackWhereInput;
    limit?: number;
    include?: Prisma.AiFeedbackIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AiFeedbackUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
    where: Prisma.AiFeedbackWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiFeedbackCreateInput, Prisma.AiFeedbackUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AiFeedbackUpdateInput, Prisma.AiFeedbackUncheckedUpdateInput>;
};
export type AiFeedbackDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
    where: Prisma.AiFeedbackWhereUniqueInput;
};
export type AiFeedbackDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiFeedbackWhereInput;
    limit?: number;
};
export type AiFeedbackDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.AiFeedbackOmit<ExtArgs> | null;
    include?: Prisma.AiFeedbackInclude<ExtArgs> | null;
};
//# sourceMappingURL=AiFeedback.d.ts.map