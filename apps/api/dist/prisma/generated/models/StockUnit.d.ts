import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type StockUnitModel = runtime.Types.Result.DefaultSelection<Prisma.$StockUnitPayload>;
export type AggregateStockUnit = {
    _count: StockUnitCountAggregateOutputType | null;
    _avg: StockUnitAvgAggregateOutputType | null;
    _sum: StockUnitSumAggregateOutputType | null;
    _min: StockUnitMinAggregateOutputType | null;
    _max: StockUnitMaxAggregateOutputType | null;
};
export type StockUnitAvgAggregateOutputType = {
    id: number | null;
    lotId: number | null;
    seq: number | null;
    tradeId: number | null;
};
export type StockUnitSumAggregateOutputType = {
    id: number | null;
    lotId: number | null;
    seq: number | null;
    tradeId: number | null;
};
export type StockUnitMinAggregateOutputType = {
    id: number | null;
    lotId: number | null;
    seq: number | null;
    tradeId: number | null;
};
export type StockUnitMaxAggregateOutputType = {
    id: number | null;
    lotId: number | null;
    seq: number | null;
    tradeId: number | null;
};
export type StockUnitCountAggregateOutputType = {
    id: number;
    lotId: number;
    seq: number;
    tradeId: number;
    _all: number;
};
export type StockUnitAvgAggregateInputType = {
    id?: true;
    lotId?: true;
    seq?: true;
    tradeId?: true;
};
export type StockUnitSumAggregateInputType = {
    id?: true;
    lotId?: true;
    seq?: true;
    tradeId?: true;
};
export type StockUnitMinAggregateInputType = {
    id?: true;
    lotId?: true;
    seq?: true;
    tradeId?: true;
};
export type StockUnitMaxAggregateInputType = {
    id?: true;
    lotId?: true;
    seq?: true;
    tradeId?: true;
};
export type StockUnitCountAggregateInputType = {
    id?: true;
    lotId?: true;
    seq?: true;
    tradeId?: true;
    _all?: true;
};
export type StockUnitAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockUnitWhereInput;
    orderBy?: Prisma.StockUnitOrderByWithRelationInput | Prisma.StockUnitOrderByWithRelationInput[];
    cursor?: Prisma.StockUnitWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StockUnitCountAggregateInputType;
    _avg?: StockUnitAvgAggregateInputType;
    _sum?: StockUnitSumAggregateInputType;
    _min?: StockUnitMinAggregateInputType;
    _max?: StockUnitMaxAggregateInputType;
};
export type GetStockUnitAggregateType<T extends StockUnitAggregateArgs> = {
    [P in keyof T & keyof AggregateStockUnit]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStockUnit[P]> : Prisma.GetScalarType<T[P], AggregateStockUnit[P]>;
};
export type StockUnitGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockUnitWhereInput;
    orderBy?: Prisma.StockUnitOrderByWithAggregationInput | Prisma.StockUnitOrderByWithAggregationInput[];
    by: Prisma.StockUnitScalarFieldEnum[] | Prisma.StockUnitScalarFieldEnum;
    having?: Prisma.StockUnitScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StockUnitCountAggregateInputType | true;
    _avg?: StockUnitAvgAggregateInputType;
    _sum?: StockUnitSumAggregateInputType;
    _min?: StockUnitMinAggregateInputType;
    _max?: StockUnitMaxAggregateInputType;
};
export type StockUnitGroupByOutputType = {
    id: number;
    lotId: number;
    seq: number;
    tradeId: number | null;
    _count: StockUnitCountAggregateOutputType | null;
    _avg: StockUnitAvgAggregateOutputType | null;
    _sum: StockUnitSumAggregateOutputType | null;
    _min: StockUnitMinAggregateOutputType | null;
    _max: StockUnitMaxAggregateOutputType | null;
};
export type GetStockUnitGroupByPayload<T extends StockUnitGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StockUnitGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StockUnitGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StockUnitGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StockUnitGroupByOutputType[P]>;
}>>;
export type StockUnitWhereInput = {
    AND?: Prisma.StockUnitWhereInput | Prisma.StockUnitWhereInput[];
    OR?: Prisma.StockUnitWhereInput[];
    NOT?: Prisma.StockUnitWhereInput | Prisma.StockUnitWhereInput[];
    id?: Prisma.IntFilter<"StockUnit"> | number;
    lotId?: Prisma.IntFilter<"StockUnit"> | number;
    seq?: Prisma.IntFilter<"StockUnit"> | number;
    tradeId?: Prisma.IntNullableFilter<"StockUnit"> | number | null;
    lot?: Prisma.XOR<Prisma.PurchaseLotScalarRelationFilter, Prisma.PurchaseLotWhereInput>;
    trade?: Prisma.XOR<Prisma.TradeNullableScalarRelationFilter, Prisma.TradeWhereInput> | null;
};
export type StockUnitOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    seq?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    lot?: Prisma.PurchaseLotOrderByWithRelationInput;
    trade?: Prisma.TradeOrderByWithRelationInput;
};
export type StockUnitWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    lotId_seq?: Prisma.StockUnitLotIdSeqCompoundUniqueInput;
    AND?: Prisma.StockUnitWhereInput | Prisma.StockUnitWhereInput[];
    OR?: Prisma.StockUnitWhereInput[];
    NOT?: Prisma.StockUnitWhereInput | Prisma.StockUnitWhereInput[];
    lotId?: Prisma.IntFilter<"StockUnit"> | number;
    seq?: Prisma.IntFilter<"StockUnit"> | number;
    tradeId?: Prisma.IntNullableFilter<"StockUnit"> | number | null;
    lot?: Prisma.XOR<Prisma.PurchaseLotScalarRelationFilter, Prisma.PurchaseLotWhereInput>;
    trade?: Prisma.XOR<Prisma.TradeNullableScalarRelationFilter, Prisma.TradeWhereInput> | null;
}, "id" | "lotId_seq">;
export type StockUnitOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    seq?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.StockUnitCountOrderByAggregateInput;
    _avg?: Prisma.StockUnitAvgOrderByAggregateInput;
    _max?: Prisma.StockUnitMaxOrderByAggregateInput;
    _min?: Prisma.StockUnitMinOrderByAggregateInput;
    _sum?: Prisma.StockUnitSumOrderByAggregateInput;
};
export type StockUnitScalarWhereWithAggregatesInput = {
    AND?: Prisma.StockUnitScalarWhereWithAggregatesInput | Prisma.StockUnitScalarWhereWithAggregatesInput[];
    OR?: Prisma.StockUnitScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StockUnitScalarWhereWithAggregatesInput | Prisma.StockUnitScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"StockUnit"> | number;
    lotId?: Prisma.IntWithAggregatesFilter<"StockUnit"> | number;
    seq?: Prisma.IntWithAggregatesFilter<"StockUnit"> | number;
    tradeId?: Prisma.IntNullableWithAggregatesFilter<"StockUnit"> | number | null;
};
export type StockUnitCreateInput = {
    seq: number;
    lot: Prisma.PurchaseLotCreateNestedOneWithoutUnitsInput;
    trade?: Prisma.TradeCreateNestedOneWithoutUnitsInput;
};
export type StockUnitUncheckedCreateInput = {
    id?: number;
    lotId: number;
    seq: number;
    tradeId?: number | null;
};
export type StockUnitUpdateInput = {
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
    lot?: Prisma.PurchaseLotUpdateOneRequiredWithoutUnitsNestedInput;
    trade?: Prisma.TradeUpdateOneWithoutUnitsNestedInput;
};
export type StockUnitUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    lotId?: Prisma.IntFieldUpdateOperationsInput | number;
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockUnitCreateManyInput = {
    id?: number;
    lotId: number;
    seq: number;
    tradeId?: number | null;
};
export type StockUnitUpdateManyMutationInput = {
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type StockUnitUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    lotId?: Prisma.IntFieldUpdateOperationsInput | number;
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockUnitListRelationFilter = {
    every?: Prisma.StockUnitWhereInput;
    some?: Prisma.StockUnitWhereInput;
    none?: Prisma.StockUnitWhereInput;
};
export type StockUnitOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StockUnitLotIdSeqCompoundUniqueInput = {
    lotId: number;
    seq: number;
};
export type StockUnitCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    seq?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
};
export type StockUnitAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    seq?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
};
export type StockUnitMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    seq?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
};
export type StockUnitMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    seq?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
};
export type StockUnitSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    seq?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
};
export type StockUnitCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.StockUnitCreateWithoutTradeInput, Prisma.StockUnitUncheckedCreateWithoutTradeInput> | Prisma.StockUnitCreateWithoutTradeInput[] | Prisma.StockUnitUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.StockUnitCreateOrConnectWithoutTradeInput | Prisma.StockUnitCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.StockUnitCreateManyTradeInputEnvelope;
    connect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
};
export type StockUnitUncheckedCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.StockUnitCreateWithoutTradeInput, Prisma.StockUnitUncheckedCreateWithoutTradeInput> | Prisma.StockUnitCreateWithoutTradeInput[] | Prisma.StockUnitUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.StockUnitCreateOrConnectWithoutTradeInput | Prisma.StockUnitCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.StockUnitCreateManyTradeInputEnvelope;
    connect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
};
export type StockUnitUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.StockUnitCreateWithoutTradeInput, Prisma.StockUnitUncheckedCreateWithoutTradeInput> | Prisma.StockUnitCreateWithoutTradeInput[] | Prisma.StockUnitUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.StockUnitCreateOrConnectWithoutTradeInput | Prisma.StockUnitCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.StockUnitUpsertWithWhereUniqueWithoutTradeInput | Prisma.StockUnitUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.StockUnitCreateManyTradeInputEnvelope;
    set?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    disconnect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    delete?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    connect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    update?: Prisma.StockUnitUpdateWithWhereUniqueWithoutTradeInput | Prisma.StockUnitUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.StockUnitUpdateManyWithWhereWithoutTradeInput | Prisma.StockUnitUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.StockUnitScalarWhereInput | Prisma.StockUnitScalarWhereInput[];
};
export type StockUnitUncheckedUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.StockUnitCreateWithoutTradeInput, Prisma.StockUnitUncheckedCreateWithoutTradeInput> | Prisma.StockUnitCreateWithoutTradeInput[] | Prisma.StockUnitUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.StockUnitCreateOrConnectWithoutTradeInput | Prisma.StockUnitCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.StockUnitUpsertWithWhereUniqueWithoutTradeInput | Prisma.StockUnitUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.StockUnitCreateManyTradeInputEnvelope;
    set?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    disconnect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    delete?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    connect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    update?: Prisma.StockUnitUpdateWithWhereUniqueWithoutTradeInput | Prisma.StockUnitUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.StockUnitUpdateManyWithWhereWithoutTradeInput | Prisma.StockUnitUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.StockUnitScalarWhereInput | Prisma.StockUnitScalarWhereInput[];
};
export type StockUnitCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.StockUnitCreateWithoutLotInput, Prisma.StockUnitUncheckedCreateWithoutLotInput> | Prisma.StockUnitCreateWithoutLotInput[] | Prisma.StockUnitUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.StockUnitCreateOrConnectWithoutLotInput | Prisma.StockUnitCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.StockUnitCreateManyLotInputEnvelope;
    connect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
};
export type StockUnitUncheckedCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.StockUnitCreateWithoutLotInput, Prisma.StockUnitUncheckedCreateWithoutLotInput> | Prisma.StockUnitCreateWithoutLotInput[] | Prisma.StockUnitUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.StockUnitCreateOrConnectWithoutLotInput | Prisma.StockUnitCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.StockUnitCreateManyLotInputEnvelope;
    connect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
};
export type StockUnitUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.StockUnitCreateWithoutLotInput, Prisma.StockUnitUncheckedCreateWithoutLotInput> | Prisma.StockUnitCreateWithoutLotInput[] | Prisma.StockUnitUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.StockUnitCreateOrConnectWithoutLotInput | Prisma.StockUnitCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.StockUnitUpsertWithWhereUniqueWithoutLotInput | Prisma.StockUnitUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.StockUnitCreateManyLotInputEnvelope;
    set?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    disconnect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    delete?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    connect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    update?: Prisma.StockUnitUpdateWithWhereUniqueWithoutLotInput | Prisma.StockUnitUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.StockUnitUpdateManyWithWhereWithoutLotInput | Prisma.StockUnitUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.StockUnitScalarWhereInput | Prisma.StockUnitScalarWhereInput[];
};
export type StockUnitUncheckedUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.StockUnitCreateWithoutLotInput, Prisma.StockUnitUncheckedCreateWithoutLotInput> | Prisma.StockUnitCreateWithoutLotInput[] | Prisma.StockUnitUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.StockUnitCreateOrConnectWithoutLotInput | Prisma.StockUnitCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.StockUnitUpsertWithWhereUniqueWithoutLotInput | Prisma.StockUnitUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.StockUnitCreateManyLotInputEnvelope;
    set?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    disconnect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    delete?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    connect?: Prisma.StockUnitWhereUniqueInput | Prisma.StockUnitWhereUniqueInput[];
    update?: Prisma.StockUnitUpdateWithWhereUniqueWithoutLotInput | Prisma.StockUnitUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.StockUnitUpdateManyWithWhereWithoutLotInput | Prisma.StockUnitUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.StockUnitScalarWhereInput | Prisma.StockUnitScalarWhereInput[];
};
export type StockUnitCreateWithoutTradeInput = {
    seq: number;
    lot: Prisma.PurchaseLotCreateNestedOneWithoutUnitsInput;
};
export type StockUnitUncheckedCreateWithoutTradeInput = {
    id?: number;
    lotId: number;
    seq: number;
};
export type StockUnitCreateOrConnectWithoutTradeInput = {
    where: Prisma.StockUnitWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockUnitCreateWithoutTradeInput, Prisma.StockUnitUncheckedCreateWithoutTradeInput>;
};
export type StockUnitCreateManyTradeInputEnvelope = {
    data: Prisma.StockUnitCreateManyTradeInput | Prisma.StockUnitCreateManyTradeInput[];
    skipDuplicates?: boolean;
};
export type StockUnitUpsertWithWhereUniqueWithoutTradeInput = {
    where: Prisma.StockUnitWhereUniqueInput;
    update: Prisma.XOR<Prisma.StockUnitUpdateWithoutTradeInput, Prisma.StockUnitUncheckedUpdateWithoutTradeInput>;
    create: Prisma.XOR<Prisma.StockUnitCreateWithoutTradeInput, Prisma.StockUnitUncheckedCreateWithoutTradeInput>;
};
export type StockUnitUpdateWithWhereUniqueWithoutTradeInput = {
    where: Prisma.StockUnitWhereUniqueInput;
    data: Prisma.XOR<Prisma.StockUnitUpdateWithoutTradeInput, Prisma.StockUnitUncheckedUpdateWithoutTradeInput>;
};
export type StockUnitUpdateManyWithWhereWithoutTradeInput = {
    where: Prisma.StockUnitScalarWhereInput;
    data: Prisma.XOR<Prisma.StockUnitUpdateManyMutationInput, Prisma.StockUnitUncheckedUpdateManyWithoutTradeInput>;
};
export type StockUnitScalarWhereInput = {
    AND?: Prisma.StockUnitScalarWhereInput | Prisma.StockUnitScalarWhereInput[];
    OR?: Prisma.StockUnitScalarWhereInput[];
    NOT?: Prisma.StockUnitScalarWhereInput | Prisma.StockUnitScalarWhereInput[];
    id?: Prisma.IntFilter<"StockUnit"> | number;
    lotId?: Prisma.IntFilter<"StockUnit"> | number;
    seq?: Prisma.IntFilter<"StockUnit"> | number;
    tradeId?: Prisma.IntNullableFilter<"StockUnit"> | number | null;
};
export type StockUnitCreateWithoutLotInput = {
    seq: number;
    trade?: Prisma.TradeCreateNestedOneWithoutUnitsInput;
};
export type StockUnitUncheckedCreateWithoutLotInput = {
    id?: number;
    seq: number;
    tradeId?: number | null;
};
export type StockUnitCreateOrConnectWithoutLotInput = {
    where: Prisma.StockUnitWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockUnitCreateWithoutLotInput, Prisma.StockUnitUncheckedCreateWithoutLotInput>;
};
export type StockUnitCreateManyLotInputEnvelope = {
    data: Prisma.StockUnitCreateManyLotInput | Prisma.StockUnitCreateManyLotInput[];
    skipDuplicates?: boolean;
};
export type StockUnitUpsertWithWhereUniqueWithoutLotInput = {
    where: Prisma.StockUnitWhereUniqueInput;
    update: Prisma.XOR<Prisma.StockUnitUpdateWithoutLotInput, Prisma.StockUnitUncheckedUpdateWithoutLotInput>;
    create: Prisma.XOR<Prisma.StockUnitCreateWithoutLotInput, Prisma.StockUnitUncheckedCreateWithoutLotInput>;
};
export type StockUnitUpdateWithWhereUniqueWithoutLotInput = {
    where: Prisma.StockUnitWhereUniqueInput;
    data: Prisma.XOR<Prisma.StockUnitUpdateWithoutLotInput, Prisma.StockUnitUncheckedUpdateWithoutLotInput>;
};
export type StockUnitUpdateManyWithWhereWithoutLotInput = {
    where: Prisma.StockUnitScalarWhereInput;
    data: Prisma.XOR<Prisma.StockUnitUpdateManyMutationInput, Prisma.StockUnitUncheckedUpdateManyWithoutLotInput>;
};
export type StockUnitCreateManyTradeInput = {
    id?: number;
    lotId: number;
    seq: number;
};
export type StockUnitUpdateWithoutTradeInput = {
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
    lot?: Prisma.PurchaseLotUpdateOneRequiredWithoutUnitsNestedInput;
};
export type StockUnitUncheckedUpdateWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    lotId?: Prisma.IntFieldUpdateOperationsInput | number;
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type StockUnitUncheckedUpdateManyWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    lotId?: Prisma.IntFieldUpdateOperationsInput | number;
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type StockUnitCreateManyLotInput = {
    id?: number;
    seq: number;
    tradeId?: number | null;
};
export type StockUnitUpdateWithoutLotInput = {
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
    trade?: Prisma.TradeUpdateOneWithoutUnitsNestedInput;
};
export type StockUnitUncheckedUpdateWithoutLotInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockUnitUncheckedUpdateManyWithoutLotInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    seq?: Prisma.IntFieldUpdateOperationsInput | number;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockUnitSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lotId?: boolean;
    seq?: boolean;
    tradeId?: boolean;
    lot?: boolean | Prisma.PurchaseLotDefaultArgs<ExtArgs>;
    trade?: boolean | Prisma.StockUnit$tradeArgs<ExtArgs>;
}, ExtArgs["result"]["stockUnit"]>;
export type StockUnitSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lotId?: boolean;
    seq?: boolean;
    tradeId?: boolean;
    lot?: boolean | Prisma.PurchaseLotDefaultArgs<ExtArgs>;
    trade?: boolean | Prisma.StockUnit$tradeArgs<ExtArgs>;
}, ExtArgs["result"]["stockUnit"]>;
export type StockUnitSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lotId?: boolean;
    seq?: boolean;
    tradeId?: boolean;
    lot?: boolean | Prisma.PurchaseLotDefaultArgs<ExtArgs>;
    trade?: boolean | Prisma.StockUnit$tradeArgs<ExtArgs>;
}, ExtArgs["result"]["stockUnit"]>;
export type StockUnitSelectScalar = {
    id?: boolean;
    lotId?: boolean;
    seq?: boolean;
    tradeId?: boolean;
};
export type StockUnitOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "lotId" | "seq" | "tradeId", ExtArgs["result"]["stockUnit"]>;
export type StockUnitInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.PurchaseLotDefaultArgs<ExtArgs>;
    trade?: boolean | Prisma.StockUnit$tradeArgs<ExtArgs>;
};
export type StockUnitIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.PurchaseLotDefaultArgs<ExtArgs>;
    trade?: boolean | Prisma.StockUnit$tradeArgs<ExtArgs>;
};
export type StockUnitIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.PurchaseLotDefaultArgs<ExtArgs>;
    trade?: boolean | Prisma.StockUnit$tradeArgs<ExtArgs>;
};
export type $StockUnitPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StockUnit";
    objects: {
        lot: Prisma.$PurchaseLotPayload<ExtArgs>;
        trade: Prisma.$TradePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        lotId: number;
        seq: number;
        tradeId: number | null;
    }, ExtArgs["result"]["stockUnit"]>;
    composites: {};
};
export type StockUnitGetPayload<S extends boolean | null | undefined | StockUnitDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StockUnitPayload, S>;
export type StockUnitCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StockUnitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StockUnitCountAggregateInputType | true;
};
export interface StockUnitDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StockUnit'];
        meta: {
            name: 'StockUnit';
        };
    };
    findUnique<T extends StockUnitFindUniqueArgs>(args: Prisma.SelectSubset<T, StockUnitFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StockUnitClient<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StockUnitFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StockUnitFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockUnitClient<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StockUnitFindFirstArgs>(args?: Prisma.SelectSubset<T, StockUnitFindFirstArgs<ExtArgs>>): Prisma.Prisma__StockUnitClient<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StockUnitFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StockUnitFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockUnitClient<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StockUnitFindManyArgs>(args?: Prisma.SelectSubset<T, StockUnitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StockUnitCreateArgs>(args: Prisma.SelectSubset<T, StockUnitCreateArgs<ExtArgs>>): Prisma.Prisma__StockUnitClient<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StockUnitCreateManyArgs>(args?: Prisma.SelectSubset<T, StockUnitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StockUnitCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StockUnitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StockUnitDeleteArgs>(args: Prisma.SelectSubset<T, StockUnitDeleteArgs<ExtArgs>>): Prisma.Prisma__StockUnitClient<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StockUnitUpdateArgs>(args: Prisma.SelectSubset<T, StockUnitUpdateArgs<ExtArgs>>): Prisma.Prisma__StockUnitClient<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StockUnitDeleteManyArgs>(args?: Prisma.SelectSubset<T, StockUnitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StockUnitUpdateManyArgs>(args: Prisma.SelectSubset<T, StockUnitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StockUnitUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StockUnitUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StockUnitUpsertArgs>(args: Prisma.SelectSubset<T, StockUnitUpsertArgs<ExtArgs>>): Prisma.Prisma__StockUnitClient<runtime.Types.Result.GetResult<Prisma.$StockUnitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StockUnitCountArgs>(args?: Prisma.Subset<T, StockUnitCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StockUnitCountAggregateOutputType> : number>;
    aggregate<T extends StockUnitAggregateArgs>(args: Prisma.Subset<T, StockUnitAggregateArgs>): Prisma.PrismaPromise<GetStockUnitAggregateType<T>>;
    groupBy<T extends StockUnitGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StockUnitGroupByArgs['orderBy'];
    } : {
        orderBy?: StockUnitGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StockUnitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockUnitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StockUnitFieldRefs;
}
export interface Prisma__StockUnitClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lot<T extends Prisma.PurchaseLotDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PurchaseLotDefaultArgs<ExtArgs>>): Prisma.Prisma__PurchaseLotClient<runtime.Types.Result.GetResult<Prisma.$PurchaseLotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    trade<T extends Prisma.StockUnit$tradeArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockUnit$tradeArgs<ExtArgs>>): Prisma.Prisma__TradeClient<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StockUnitFieldRefs {
    readonly id: Prisma.FieldRef<"StockUnit", 'Int'>;
    readonly lotId: Prisma.FieldRef<"StockUnit", 'Int'>;
    readonly seq: Prisma.FieldRef<"StockUnit", 'Int'>;
    readonly tradeId: Prisma.FieldRef<"StockUnit", 'Int'>;
}
export type StockUnitFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
    where: Prisma.StockUnitWhereUniqueInput;
};
export type StockUnitFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
    where: Prisma.StockUnitWhereUniqueInput;
};
export type StockUnitFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
    where?: Prisma.StockUnitWhereInput;
    orderBy?: Prisma.StockUnitOrderByWithRelationInput | Prisma.StockUnitOrderByWithRelationInput[];
    cursor?: Prisma.StockUnitWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockUnitScalarFieldEnum | Prisma.StockUnitScalarFieldEnum[];
};
export type StockUnitFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
    where?: Prisma.StockUnitWhereInput;
    orderBy?: Prisma.StockUnitOrderByWithRelationInput | Prisma.StockUnitOrderByWithRelationInput[];
    cursor?: Prisma.StockUnitWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockUnitScalarFieldEnum | Prisma.StockUnitScalarFieldEnum[];
};
export type StockUnitFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
    where?: Prisma.StockUnitWhereInput;
    orderBy?: Prisma.StockUnitOrderByWithRelationInput | Prisma.StockUnitOrderByWithRelationInput[];
    cursor?: Prisma.StockUnitWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockUnitScalarFieldEnum | Prisma.StockUnitScalarFieldEnum[];
};
export type StockUnitCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockUnitCreateInput, Prisma.StockUnitUncheckedCreateInput>;
};
export type StockUnitCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StockUnitCreateManyInput | Prisma.StockUnitCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StockUnitCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    data: Prisma.StockUnitCreateManyInput | Prisma.StockUnitCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StockUnitIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StockUnitUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockUnitUpdateInput, Prisma.StockUnitUncheckedUpdateInput>;
    where: Prisma.StockUnitWhereUniqueInput;
};
export type StockUnitUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StockUnitUpdateManyMutationInput, Prisma.StockUnitUncheckedUpdateManyInput>;
    where?: Prisma.StockUnitWhereInput;
    limit?: number;
};
export type StockUnitUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockUnitUpdateManyMutationInput, Prisma.StockUnitUncheckedUpdateManyInput>;
    where?: Prisma.StockUnitWhereInput;
    limit?: number;
    include?: Prisma.StockUnitIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StockUnitUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
    where: Prisma.StockUnitWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockUnitCreateInput, Prisma.StockUnitUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StockUnitUpdateInput, Prisma.StockUnitUncheckedUpdateInput>;
};
export type StockUnitDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
    where: Prisma.StockUnitWhereUniqueInput;
};
export type StockUnitDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockUnitWhereInput;
    limit?: number;
};
export type StockUnit$tradeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TradeSelect<ExtArgs> | null;
    omit?: Prisma.TradeOmit<ExtArgs> | null;
    include?: Prisma.TradeInclude<ExtArgs> | null;
    where?: Prisma.TradeWhereInput;
};
export type StockUnitDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockUnitSelect<ExtArgs> | null;
    omit?: Prisma.StockUnitOmit<ExtArgs> | null;
    include?: Prisma.StockUnitInclude<ExtArgs> | null;
};
//# sourceMappingURL=StockUnit.d.ts.map