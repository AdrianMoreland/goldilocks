import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type StocktakeCoinModel = runtime.Types.Result.DefaultSelection<Prisma.$StocktakeCoinPayload>;
export type AggregateStocktakeCoin = {
    _count: StocktakeCoinCountAggregateOutputType | null;
    _avg: StocktakeCoinAvgAggregateOutputType | null;
    _sum: StocktakeCoinSumAggregateOutputType | null;
    _min: StocktakeCoinMinAggregateOutputType | null;
    _max: StocktakeCoinMaxAggregateOutputType | null;
};
export type StocktakeCoinAvgAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    previousQty: number | null;
    countedQty: number | null;
};
export type StocktakeCoinSumAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    previousQty: number | null;
    countedQty: number | null;
};
export type StocktakeCoinMinAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    metal: $Enums.StockMetal | null;
    locationCode: string | null;
    item: string | null;
    previousQty: number | null;
    countedQty: number | null;
    details: string | null;
    sourceKey: string | null;
};
export type StocktakeCoinMaxAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    metal: $Enums.StockMetal | null;
    locationCode: string | null;
    item: string | null;
    previousQty: number | null;
    countedQty: number | null;
    details: string | null;
    sourceKey: string | null;
};
export type StocktakeCoinCountAggregateOutputType = {
    id: number;
    stocktakeId: number;
    metal: number;
    locationCode: number;
    item: number;
    previousQty: number;
    countedQty: number;
    details: number;
    countsJson: number;
    sourceKey: number;
    _all: number;
};
export type StocktakeCoinAvgAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    previousQty?: true;
    countedQty?: true;
};
export type StocktakeCoinSumAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    previousQty?: true;
    countedQty?: true;
};
export type StocktakeCoinMinAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    metal?: true;
    locationCode?: true;
    item?: true;
    previousQty?: true;
    countedQty?: true;
    details?: true;
    sourceKey?: true;
};
export type StocktakeCoinMaxAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    metal?: true;
    locationCode?: true;
    item?: true;
    previousQty?: true;
    countedQty?: true;
    details?: true;
    sourceKey?: true;
};
export type StocktakeCoinCountAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    metal?: true;
    locationCode?: true;
    item?: true;
    previousQty?: true;
    countedQty?: true;
    details?: true;
    countsJson?: true;
    sourceKey?: true;
    _all?: true;
};
export type StocktakeCoinAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeCoinWhereInput;
    orderBy?: Prisma.StocktakeCoinOrderByWithRelationInput | Prisma.StocktakeCoinOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeCoinWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StocktakeCoinCountAggregateInputType;
    _avg?: StocktakeCoinAvgAggregateInputType;
    _sum?: StocktakeCoinSumAggregateInputType;
    _min?: StocktakeCoinMinAggregateInputType;
    _max?: StocktakeCoinMaxAggregateInputType;
};
export type GetStocktakeCoinAggregateType<T extends StocktakeCoinAggregateArgs> = {
    [P in keyof T & keyof AggregateStocktakeCoin]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStocktakeCoin[P]> : Prisma.GetScalarType<T[P], AggregateStocktakeCoin[P]>;
};
export type StocktakeCoinGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeCoinWhereInput;
    orderBy?: Prisma.StocktakeCoinOrderByWithAggregationInput | Prisma.StocktakeCoinOrderByWithAggregationInput[];
    by: Prisma.StocktakeCoinScalarFieldEnum[] | Prisma.StocktakeCoinScalarFieldEnum;
    having?: Prisma.StocktakeCoinScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StocktakeCoinCountAggregateInputType | true;
    _avg?: StocktakeCoinAvgAggregateInputType;
    _sum?: StocktakeCoinSumAggregateInputType;
    _min?: StocktakeCoinMinAggregateInputType;
    _max?: StocktakeCoinMaxAggregateInputType;
};
export type StocktakeCoinGroupByOutputType = {
    id: number;
    stocktakeId: number;
    metal: $Enums.StockMetal;
    locationCode: string;
    item: string;
    previousQty: number | null;
    countedQty: number | null;
    details: string | null;
    countsJson: runtime.JsonValue | null;
    sourceKey: string | null;
    _count: StocktakeCoinCountAggregateOutputType | null;
    _avg: StocktakeCoinAvgAggregateOutputType | null;
    _sum: StocktakeCoinSumAggregateOutputType | null;
    _min: StocktakeCoinMinAggregateOutputType | null;
    _max: StocktakeCoinMaxAggregateOutputType | null;
};
export type GetStocktakeCoinGroupByPayload<T extends StocktakeCoinGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StocktakeCoinGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StocktakeCoinGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StocktakeCoinGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StocktakeCoinGroupByOutputType[P]>;
}>>;
export type StocktakeCoinWhereInput = {
    AND?: Prisma.StocktakeCoinWhereInput | Prisma.StocktakeCoinWhereInput[];
    OR?: Prisma.StocktakeCoinWhereInput[];
    NOT?: Prisma.StocktakeCoinWhereInput | Prisma.StocktakeCoinWhereInput[];
    id?: Prisma.IntFilter<"StocktakeCoin"> | number;
    stocktakeId?: Prisma.IntFilter<"StocktakeCoin"> | number;
    metal?: Prisma.EnumStockMetalFilter<"StocktakeCoin"> | $Enums.StockMetal;
    locationCode?: Prisma.StringFilter<"StocktakeCoin"> | string;
    item?: Prisma.StringFilter<"StocktakeCoin"> | string;
    previousQty?: Prisma.IntNullableFilter<"StocktakeCoin"> | number | null;
    countedQty?: Prisma.IntNullableFilter<"StocktakeCoin"> | number | null;
    details?: Prisma.StringNullableFilter<"StocktakeCoin"> | string | null;
    countsJson?: Prisma.JsonNullableFilter<"StocktakeCoin">;
    sourceKey?: Prisma.StringNullableFilter<"StocktakeCoin"> | string | null;
    stocktake?: Prisma.XOR<Prisma.StocktakeScalarRelationFilter, Prisma.StocktakeWhereInput>;
};
export type StocktakeCoinOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    previousQty?: Prisma.SortOrderInput | Prisma.SortOrder;
    countedQty?: Prisma.SortOrderInput | Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    countsJson?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    stocktake?: Prisma.StocktakeOrderByWithRelationInput;
};
export type StocktakeCoinWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    sourceKey?: string;
    stocktakeId_metal_locationCode_item?: Prisma.StocktakeCoinStocktakeIdMetalLocationCodeItemCompoundUniqueInput;
    AND?: Prisma.StocktakeCoinWhereInput | Prisma.StocktakeCoinWhereInput[];
    OR?: Prisma.StocktakeCoinWhereInput[];
    NOT?: Prisma.StocktakeCoinWhereInput | Prisma.StocktakeCoinWhereInput[];
    stocktakeId?: Prisma.IntFilter<"StocktakeCoin"> | number;
    metal?: Prisma.EnumStockMetalFilter<"StocktakeCoin"> | $Enums.StockMetal;
    locationCode?: Prisma.StringFilter<"StocktakeCoin"> | string;
    item?: Prisma.StringFilter<"StocktakeCoin"> | string;
    previousQty?: Prisma.IntNullableFilter<"StocktakeCoin"> | number | null;
    countedQty?: Prisma.IntNullableFilter<"StocktakeCoin"> | number | null;
    details?: Prisma.StringNullableFilter<"StocktakeCoin"> | string | null;
    countsJson?: Prisma.JsonNullableFilter<"StocktakeCoin">;
    stocktake?: Prisma.XOR<Prisma.StocktakeScalarRelationFilter, Prisma.StocktakeWhereInput>;
}, "id" | "sourceKey" | "stocktakeId_metal_locationCode_item">;
export type StocktakeCoinOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    previousQty?: Prisma.SortOrderInput | Prisma.SortOrder;
    countedQty?: Prisma.SortOrderInput | Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    countsJson?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.StocktakeCoinCountOrderByAggregateInput;
    _avg?: Prisma.StocktakeCoinAvgOrderByAggregateInput;
    _max?: Prisma.StocktakeCoinMaxOrderByAggregateInput;
    _min?: Prisma.StocktakeCoinMinOrderByAggregateInput;
    _sum?: Prisma.StocktakeCoinSumOrderByAggregateInput;
};
export type StocktakeCoinScalarWhereWithAggregatesInput = {
    AND?: Prisma.StocktakeCoinScalarWhereWithAggregatesInput | Prisma.StocktakeCoinScalarWhereWithAggregatesInput[];
    OR?: Prisma.StocktakeCoinScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StocktakeCoinScalarWhereWithAggregatesInput | Prisma.StocktakeCoinScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"StocktakeCoin"> | number;
    stocktakeId?: Prisma.IntWithAggregatesFilter<"StocktakeCoin"> | number;
    metal?: Prisma.EnumStockMetalWithAggregatesFilter<"StocktakeCoin"> | $Enums.StockMetal;
    locationCode?: Prisma.StringWithAggregatesFilter<"StocktakeCoin"> | string;
    item?: Prisma.StringWithAggregatesFilter<"StocktakeCoin"> | string;
    previousQty?: Prisma.IntNullableWithAggregatesFilter<"StocktakeCoin"> | number | null;
    countedQty?: Prisma.IntNullableWithAggregatesFilter<"StocktakeCoin"> | number | null;
    details?: Prisma.StringNullableWithAggregatesFilter<"StocktakeCoin"> | string | null;
    countsJson?: Prisma.JsonNullableWithAggregatesFilter<"StocktakeCoin">;
    sourceKey?: Prisma.StringNullableWithAggregatesFilter<"StocktakeCoin"> | string | null;
};
export type StocktakeCoinCreateInput = {
    metal: $Enums.StockMetal;
    locationCode?: string;
    item: string;
    previousQty?: number | null;
    countedQty?: number | null;
    details?: string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: string | null;
    stocktake: Prisma.StocktakeCreateNestedOneWithoutCoinsInput;
};
export type StocktakeCoinUncheckedCreateInput = {
    id?: number;
    stocktakeId: number;
    metal: $Enums.StockMetal;
    locationCode?: string;
    item: string;
    previousQty?: number | null;
    countedQty?: number | null;
    details?: string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: string | null;
};
export type StocktakeCoinUpdateInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    previousQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    countedQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stocktake?: Prisma.StocktakeUpdateOneRequiredWithoutCoinsNestedInput;
};
export type StocktakeCoinUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stocktakeId?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    previousQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    countedQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StocktakeCoinCreateManyInput = {
    id?: number;
    stocktakeId: number;
    metal: $Enums.StockMetal;
    locationCode?: string;
    item: string;
    previousQty?: number | null;
    countedQty?: number | null;
    details?: string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: string | null;
};
export type StocktakeCoinUpdateManyMutationInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    previousQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    countedQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StocktakeCoinUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stocktakeId?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    previousQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    countedQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StocktakeCoinListRelationFilter = {
    every?: Prisma.StocktakeCoinWhereInput;
    some?: Prisma.StocktakeCoinWhereInput;
    none?: Prisma.StocktakeCoinWhereInput;
};
export type StocktakeCoinOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StocktakeCoinStocktakeIdMetalLocationCodeItemCompoundUniqueInput = {
    stocktakeId: number;
    metal: $Enums.StockMetal;
    locationCode: string;
    item: string;
};
export type StocktakeCoinCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    previousQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    countsJson?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
};
export type StocktakeCoinAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    previousQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
};
export type StocktakeCoinMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    previousQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
};
export type StocktakeCoinMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    previousQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
};
export type StocktakeCoinSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    previousQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
};
export type StocktakeCoinCreateNestedManyWithoutStocktakeInput = {
    create?: Prisma.XOR<Prisma.StocktakeCoinCreateWithoutStocktakeInput, Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeCoinCreateWithoutStocktakeInput[] | Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeCoinCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeCoinCreateOrConnectWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeCoinCreateManyStocktakeInputEnvelope;
    connect?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
};
export type StocktakeCoinUncheckedCreateNestedManyWithoutStocktakeInput = {
    create?: Prisma.XOR<Prisma.StocktakeCoinCreateWithoutStocktakeInput, Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeCoinCreateWithoutStocktakeInput[] | Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeCoinCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeCoinCreateOrConnectWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeCoinCreateManyStocktakeInputEnvelope;
    connect?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
};
export type StocktakeCoinUpdateManyWithoutStocktakeNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeCoinCreateWithoutStocktakeInput, Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeCoinCreateWithoutStocktakeInput[] | Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeCoinCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeCoinCreateOrConnectWithoutStocktakeInput[];
    upsert?: Prisma.StocktakeCoinUpsertWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeCoinUpsertWithWhereUniqueWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeCoinCreateManyStocktakeInputEnvelope;
    set?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
    disconnect?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
    delete?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
    connect?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
    update?: Prisma.StocktakeCoinUpdateWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeCoinUpdateWithWhereUniqueWithoutStocktakeInput[];
    updateMany?: Prisma.StocktakeCoinUpdateManyWithWhereWithoutStocktakeInput | Prisma.StocktakeCoinUpdateManyWithWhereWithoutStocktakeInput[];
    deleteMany?: Prisma.StocktakeCoinScalarWhereInput | Prisma.StocktakeCoinScalarWhereInput[];
};
export type StocktakeCoinUncheckedUpdateManyWithoutStocktakeNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeCoinCreateWithoutStocktakeInput, Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeCoinCreateWithoutStocktakeInput[] | Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeCoinCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeCoinCreateOrConnectWithoutStocktakeInput[];
    upsert?: Prisma.StocktakeCoinUpsertWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeCoinUpsertWithWhereUniqueWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeCoinCreateManyStocktakeInputEnvelope;
    set?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
    disconnect?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
    delete?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
    connect?: Prisma.StocktakeCoinWhereUniqueInput | Prisma.StocktakeCoinWhereUniqueInput[];
    update?: Prisma.StocktakeCoinUpdateWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeCoinUpdateWithWhereUniqueWithoutStocktakeInput[];
    updateMany?: Prisma.StocktakeCoinUpdateManyWithWhereWithoutStocktakeInput | Prisma.StocktakeCoinUpdateManyWithWhereWithoutStocktakeInput[];
    deleteMany?: Prisma.StocktakeCoinScalarWhereInput | Prisma.StocktakeCoinScalarWhereInput[];
};
export type StocktakeCoinCreateWithoutStocktakeInput = {
    metal: $Enums.StockMetal;
    locationCode?: string;
    item: string;
    previousQty?: number | null;
    countedQty?: number | null;
    details?: string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: string | null;
};
export type StocktakeCoinUncheckedCreateWithoutStocktakeInput = {
    id?: number;
    metal: $Enums.StockMetal;
    locationCode?: string;
    item: string;
    previousQty?: number | null;
    countedQty?: number | null;
    details?: string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: string | null;
};
export type StocktakeCoinCreateOrConnectWithoutStocktakeInput = {
    where: Prisma.StocktakeCoinWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeCoinCreateWithoutStocktakeInput, Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput>;
};
export type StocktakeCoinCreateManyStocktakeInputEnvelope = {
    data: Prisma.StocktakeCoinCreateManyStocktakeInput | Prisma.StocktakeCoinCreateManyStocktakeInput[];
    skipDuplicates?: boolean;
};
export type StocktakeCoinUpsertWithWhereUniqueWithoutStocktakeInput = {
    where: Prisma.StocktakeCoinWhereUniqueInput;
    update: Prisma.XOR<Prisma.StocktakeCoinUpdateWithoutStocktakeInput, Prisma.StocktakeCoinUncheckedUpdateWithoutStocktakeInput>;
    create: Prisma.XOR<Prisma.StocktakeCoinCreateWithoutStocktakeInput, Prisma.StocktakeCoinUncheckedCreateWithoutStocktakeInput>;
};
export type StocktakeCoinUpdateWithWhereUniqueWithoutStocktakeInput = {
    where: Prisma.StocktakeCoinWhereUniqueInput;
    data: Prisma.XOR<Prisma.StocktakeCoinUpdateWithoutStocktakeInput, Prisma.StocktakeCoinUncheckedUpdateWithoutStocktakeInput>;
};
export type StocktakeCoinUpdateManyWithWhereWithoutStocktakeInput = {
    where: Prisma.StocktakeCoinScalarWhereInput;
    data: Prisma.XOR<Prisma.StocktakeCoinUpdateManyMutationInput, Prisma.StocktakeCoinUncheckedUpdateManyWithoutStocktakeInput>;
};
export type StocktakeCoinScalarWhereInput = {
    AND?: Prisma.StocktakeCoinScalarWhereInput | Prisma.StocktakeCoinScalarWhereInput[];
    OR?: Prisma.StocktakeCoinScalarWhereInput[];
    NOT?: Prisma.StocktakeCoinScalarWhereInput | Prisma.StocktakeCoinScalarWhereInput[];
    id?: Prisma.IntFilter<"StocktakeCoin"> | number;
    stocktakeId?: Prisma.IntFilter<"StocktakeCoin"> | number;
    metal?: Prisma.EnumStockMetalFilter<"StocktakeCoin"> | $Enums.StockMetal;
    locationCode?: Prisma.StringFilter<"StocktakeCoin"> | string;
    item?: Prisma.StringFilter<"StocktakeCoin"> | string;
    previousQty?: Prisma.IntNullableFilter<"StocktakeCoin"> | number | null;
    countedQty?: Prisma.IntNullableFilter<"StocktakeCoin"> | number | null;
    details?: Prisma.StringNullableFilter<"StocktakeCoin"> | string | null;
    countsJson?: Prisma.JsonNullableFilter<"StocktakeCoin">;
    sourceKey?: Prisma.StringNullableFilter<"StocktakeCoin"> | string | null;
};
export type StocktakeCoinCreateManyStocktakeInput = {
    id?: number;
    metal: $Enums.StockMetal;
    locationCode?: string;
    item: string;
    previousQty?: number | null;
    countedQty?: number | null;
    details?: string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: string | null;
};
export type StocktakeCoinUpdateWithoutStocktakeInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    previousQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    countedQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StocktakeCoinUncheckedUpdateWithoutStocktakeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    previousQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    countedQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StocktakeCoinUncheckedUpdateManyWithoutStocktakeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    previousQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    countedQty?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    countsJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StocktakeCoinSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stocktakeId?: boolean;
    metal?: boolean;
    locationCode?: boolean;
    item?: boolean;
    previousQty?: boolean;
    countedQty?: boolean;
    details?: boolean;
    countsJson?: boolean;
    sourceKey?: boolean;
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktakeCoin"]>;
export type StocktakeCoinSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stocktakeId?: boolean;
    metal?: boolean;
    locationCode?: boolean;
    item?: boolean;
    previousQty?: boolean;
    countedQty?: boolean;
    details?: boolean;
    countsJson?: boolean;
    sourceKey?: boolean;
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktakeCoin"]>;
export type StocktakeCoinSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stocktakeId?: boolean;
    metal?: boolean;
    locationCode?: boolean;
    item?: boolean;
    previousQty?: boolean;
    countedQty?: boolean;
    details?: boolean;
    countsJson?: boolean;
    sourceKey?: boolean;
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktakeCoin"]>;
export type StocktakeCoinSelectScalar = {
    id?: boolean;
    stocktakeId?: boolean;
    metal?: boolean;
    locationCode?: boolean;
    item?: boolean;
    previousQty?: boolean;
    countedQty?: boolean;
    details?: boolean;
    countsJson?: boolean;
    sourceKey?: boolean;
};
export type StocktakeCoinOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "stocktakeId" | "metal" | "locationCode" | "item" | "previousQty" | "countedQty" | "details" | "countsJson" | "sourceKey", ExtArgs["result"]["stocktakeCoin"]>;
export type StocktakeCoinInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
};
export type StocktakeCoinIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
};
export type StocktakeCoinIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
};
export type $StocktakeCoinPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StocktakeCoin";
    objects: {
        stocktake: Prisma.$StocktakePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        stocktakeId: number;
        metal: $Enums.StockMetal;
        locationCode: string;
        item: string;
        previousQty: number | null;
        countedQty: number | null;
        details: string | null;
        countsJson: runtime.JsonValue | null;
        sourceKey: string | null;
    }, ExtArgs["result"]["stocktakeCoin"]>;
    composites: {};
};
export type StocktakeCoinGetPayload<S extends boolean | null | undefined | StocktakeCoinDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload, S>;
export type StocktakeCoinCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StocktakeCoinFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StocktakeCoinCountAggregateInputType | true;
};
export interface StocktakeCoinDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StocktakeCoin'];
        meta: {
            name: 'StocktakeCoin';
        };
    };
    findUnique<T extends StocktakeCoinFindUniqueArgs>(args: Prisma.SelectSubset<T, StocktakeCoinFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StocktakeCoinClient<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StocktakeCoinFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StocktakeCoinFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StocktakeCoinClient<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StocktakeCoinFindFirstArgs>(args?: Prisma.SelectSubset<T, StocktakeCoinFindFirstArgs<ExtArgs>>): Prisma.Prisma__StocktakeCoinClient<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StocktakeCoinFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StocktakeCoinFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StocktakeCoinClient<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StocktakeCoinFindManyArgs>(args?: Prisma.SelectSubset<T, StocktakeCoinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StocktakeCoinCreateArgs>(args: Prisma.SelectSubset<T, StocktakeCoinCreateArgs<ExtArgs>>): Prisma.Prisma__StocktakeCoinClient<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StocktakeCoinCreateManyArgs>(args?: Prisma.SelectSubset<T, StocktakeCoinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StocktakeCoinCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StocktakeCoinCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StocktakeCoinDeleteArgs>(args: Prisma.SelectSubset<T, StocktakeCoinDeleteArgs<ExtArgs>>): Prisma.Prisma__StocktakeCoinClient<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StocktakeCoinUpdateArgs>(args: Prisma.SelectSubset<T, StocktakeCoinUpdateArgs<ExtArgs>>): Prisma.Prisma__StocktakeCoinClient<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StocktakeCoinDeleteManyArgs>(args?: Prisma.SelectSubset<T, StocktakeCoinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StocktakeCoinUpdateManyArgs>(args: Prisma.SelectSubset<T, StocktakeCoinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StocktakeCoinUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StocktakeCoinUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StocktakeCoinUpsertArgs>(args: Prisma.SelectSubset<T, StocktakeCoinUpsertArgs<ExtArgs>>): Prisma.Prisma__StocktakeCoinClient<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StocktakeCoinCountArgs>(args?: Prisma.Subset<T, StocktakeCoinCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StocktakeCoinCountAggregateOutputType> : number>;
    aggregate<T extends StocktakeCoinAggregateArgs>(args: Prisma.Subset<T, StocktakeCoinAggregateArgs>): Prisma.PrismaPromise<GetStocktakeCoinAggregateType<T>>;
    groupBy<T extends StocktakeCoinGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StocktakeCoinGroupByArgs['orderBy'];
    } : {
        orderBy?: StocktakeCoinGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StocktakeCoinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStocktakeCoinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StocktakeCoinFieldRefs;
}
export interface Prisma__StocktakeCoinClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    stocktake<T extends Prisma.StocktakeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StocktakeDefaultArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StocktakeCoinFieldRefs {
    readonly id: Prisma.FieldRef<"StocktakeCoin", 'Int'>;
    readonly stocktakeId: Prisma.FieldRef<"StocktakeCoin", 'Int'>;
    readonly metal: Prisma.FieldRef<"StocktakeCoin", 'StockMetal'>;
    readonly locationCode: Prisma.FieldRef<"StocktakeCoin", 'String'>;
    readonly item: Prisma.FieldRef<"StocktakeCoin", 'String'>;
    readonly previousQty: Prisma.FieldRef<"StocktakeCoin", 'Int'>;
    readonly countedQty: Prisma.FieldRef<"StocktakeCoin", 'Int'>;
    readonly details: Prisma.FieldRef<"StocktakeCoin", 'String'>;
    readonly countsJson: Prisma.FieldRef<"StocktakeCoin", 'Json'>;
    readonly sourceKey: Prisma.FieldRef<"StocktakeCoin", 'String'>;
}
export type StocktakeCoinFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
    where: Prisma.StocktakeCoinWhereUniqueInput;
};
export type StocktakeCoinFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
    where: Prisma.StocktakeCoinWhereUniqueInput;
};
export type StocktakeCoinFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
    where?: Prisma.StocktakeCoinWhereInput;
    orderBy?: Prisma.StocktakeCoinOrderByWithRelationInput | Prisma.StocktakeCoinOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeCoinWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeCoinScalarFieldEnum | Prisma.StocktakeCoinScalarFieldEnum[];
};
export type StocktakeCoinFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
    where?: Prisma.StocktakeCoinWhereInput;
    orderBy?: Prisma.StocktakeCoinOrderByWithRelationInput | Prisma.StocktakeCoinOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeCoinWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeCoinScalarFieldEnum | Prisma.StocktakeCoinScalarFieldEnum[];
};
export type StocktakeCoinFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
    where?: Prisma.StocktakeCoinWhereInput;
    orderBy?: Prisma.StocktakeCoinOrderByWithRelationInput | Prisma.StocktakeCoinOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeCoinWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeCoinScalarFieldEnum | Prisma.StocktakeCoinScalarFieldEnum[];
};
export type StocktakeCoinCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeCoinCreateInput, Prisma.StocktakeCoinUncheckedCreateInput>;
};
export type StocktakeCoinCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StocktakeCoinCreateManyInput | Prisma.StocktakeCoinCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StocktakeCoinCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    data: Prisma.StocktakeCoinCreateManyInput | Prisma.StocktakeCoinCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StocktakeCoinIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StocktakeCoinUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeCoinUpdateInput, Prisma.StocktakeCoinUncheckedUpdateInput>;
    where: Prisma.StocktakeCoinWhereUniqueInput;
};
export type StocktakeCoinUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StocktakeCoinUpdateManyMutationInput, Prisma.StocktakeCoinUncheckedUpdateManyInput>;
    where?: Prisma.StocktakeCoinWhereInput;
    limit?: number;
};
export type StocktakeCoinUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeCoinUpdateManyMutationInput, Prisma.StocktakeCoinUncheckedUpdateManyInput>;
    where?: Prisma.StocktakeCoinWhereInput;
    limit?: number;
    include?: Prisma.StocktakeCoinIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StocktakeCoinUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
    where: Prisma.StocktakeCoinWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeCoinCreateInput, Prisma.StocktakeCoinUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StocktakeCoinUpdateInput, Prisma.StocktakeCoinUncheckedUpdateInput>;
};
export type StocktakeCoinDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
    where: Prisma.StocktakeCoinWhereUniqueInput;
};
export type StocktakeCoinDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeCoinWhereInput;
    limit?: number;
};
export type StocktakeCoinDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCoinSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeCoinOmit<ExtArgs> | null;
    include?: Prisma.StocktakeCoinInclude<ExtArgs> | null;
};
//# sourceMappingURL=StocktakeCoin.d.ts.map