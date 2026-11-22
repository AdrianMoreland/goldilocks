import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type StocktakeBarModel = runtime.Types.Result.DefaultSelection<Prisma.$StocktakeBarPayload>;
export type AggregateStocktakeBar = {
    _count: StocktakeBarCountAggregateOutputType | null;
    _avg: StocktakeBarAvgAggregateOutputType | null;
    _sum: StocktakeBarSumAggregateOutputType | null;
    _min: StocktakeBarMinAggregateOutputType | null;
    _max: StocktakeBarMaxAggregateOutputType | null;
};
export type StocktakeBarAvgAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    grams: runtime.Decimal | null;
    carriedFromId: number | null;
};
export type StocktakeBarSumAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    grams: runtime.Decimal | null;
    carriedFromId: number | null;
};
export type StocktakeBarMinAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    metal: $Enums.StockMetal | null;
    locationCode: string | null;
    weightLabel: string | null;
    refinery: string | null;
    serial: string | null;
    grams: runtime.Decimal | null;
    details: string | null;
    status: $Enums.BarStatus | null;
    carriedFromId: number | null;
    sourceKey: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type StocktakeBarMaxAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    metal: $Enums.StockMetal | null;
    locationCode: string | null;
    weightLabel: string | null;
    refinery: string | null;
    serial: string | null;
    grams: runtime.Decimal | null;
    details: string | null;
    status: $Enums.BarStatus | null;
    carriedFromId: number | null;
    sourceKey: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type StocktakeBarCountAggregateOutputType = {
    id: number;
    stocktakeId: number;
    metal: number;
    locationCode: number;
    weightLabel: number;
    refinery: number;
    serial: number;
    grams: number;
    details: number;
    status: number;
    carriedFromId: number;
    sourceKey: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type StocktakeBarAvgAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    grams?: true;
    carriedFromId?: true;
};
export type StocktakeBarSumAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    grams?: true;
    carriedFromId?: true;
};
export type StocktakeBarMinAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    metal?: true;
    locationCode?: true;
    weightLabel?: true;
    refinery?: true;
    serial?: true;
    grams?: true;
    details?: true;
    status?: true;
    carriedFromId?: true;
    sourceKey?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type StocktakeBarMaxAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    metal?: true;
    locationCode?: true;
    weightLabel?: true;
    refinery?: true;
    serial?: true;
    grams?: true;
    details?: true;
    status?: true;
    carriedFromId?: true;
    sourceKey?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type StocktakeBarCountAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    metal?: true;
    locationCode?: true;
    weightLabel?: true;
    refinery?: true;
    serial?: true;
    grams?: true;
    details?: true;
    status?: true;
    carriedFromId?: true;
    sourceKey?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type StocktakeBarAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeBarWhereInput;
    orderBy?: Prisma.StocktakeBarOrderByWithRelationInput | Prisma.StocktakeBarOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeBarWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StocktakeBarCountAggregateInputType;
    _avg?: StocktakeBarAvgAggregateInputType;
    _sum?: StocktakeBarSumAggregateInputType;
    _min?: StocktakeBarMinAggregateInputType;
    _max?: StocktakeBarMaxAggregateInputType;
};
export type GetStocktakeBarAggregateType<T extends StocktakeBarAggregateArgs> = {
    [P in keyof T & keyof AggregateStocktakeBar]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStocktakeBar[P]> : Prisma.GetScalarType<T[P], AggregateStocktakeBar[P]>;
};
export type StocktakeBarGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeBarWhereInput;
    orderBy?: Prisma.StocktakeBarOrderByWithAggregationInput | Prisma.StocktakeBarOrderByWithAggregationInput[];
    by: Prisma.StocktakeBarScalarFieldEnum[] | Prisma.StocktakeBarScalarFieldEnum;
    having?: Prisma.StocktakeBarScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StocktakeBarCountAggregateInputType | true;
    _avg?: StocktakeBarAvgAggregateInputType;
    _sum?: StocktakeBarSumAggregateInputType;
    _min?: StocktakeBarMinAggregateInputType;
    _max?: StocktakeBarMaxAggregateInputType;
};
export type StocktakeBarGroupByOutputType = {
    id: number;
    stocktakeId: number;
    metal: $Enums.StockMetal;
    locationCode: string;
    weightLabel: string;
    refinery: string | null;
    serial: string | null;
    grams: runtime.Decimal | null;
    details: string | null;
    status: $Enums.BarStatus;
    carriedFromId: number | null;
    sourceKey: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: StocktakeBarCountAggregateOutputType | null;
    _avg: StocktakeBarAvgAggregateOutputType | null;
    _sum: StocktakeBarSumAggregateOutputType | null;
    _min: StocktakeBarMinAggregateOutputType | null;
    _max: StocktakeBarMaxAggregateOutputType | null;
};
export type GetStocktakeBarGroupByPayload<T extends StocktakeBarGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StocktakeBarGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StocktakeBarGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StocktakeBarGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StocktakeBarGroupByOutputType[P]>;
}>>;
export type StocktakeBarWhereInput = {
    AND?: Prisma.StocktakeBarWhereInput | Prisma.StocktakeBarWhereInput[];
    OR?: Prisma.StocktakeBarWhereInput[];
    NOT?: Prisma.StocktakeBarWhereInput | Prisma.StocktakeBarWhereInput[];
    id?: Prisma.IntFilter<"StocktakeBar"> | number;
    stocktakeId?: Prisma.IntFilter<"StocktakeBar"> | number;
    metal?: Prisma.EnumStockMetalFilter<"StocktakeBar"> | $Enums.StockMetal;
    locationCode?: Prisma.StringFilter<"StocktakeBar"> | string;
    weightLabel?: Prisma.StringFilter<"StocktakeBar"> | string;
    refinery?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    serial?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    grams?: Prisma.DecimalNullableFilter<"StocktakeBar"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    status?: Prisma.EnumBarStatusFilter<"StocktakeBar"> | $Enums.BarStatus;
    carriedFromId?: Prisma.IntNullableFilter<"StocktakeBar"> | number | null;
    sourceKey?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"StocktakeBar"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"StocktakeBar"> | Date | string;
    stocktake?: Prisma.XOR<Prisma.StocktakeScalarRelationFilter, Prisma.StocktakeWhereInput>;
};
export type StocktakeBarOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrder;
    refinery?: Prisma.SortOrderInput | Prisma.SortOrder;
    serial?: Prisma.SortOrderInput | Prisma.SortOrder;
    grams?: Prisma.SortOrderInput | Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    carriedFromId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    stocktake?: Prisma.StocktakeOrderByWithRelationInput;
};
export type StocktakeBarWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    sourceKey?: string;
    AND?: Prisma.StocktakeBarWhereInput | Prisma.StocktakeBarWhereInput[];
    OR?: Prisma.StocktakeBarWhereInput[];
    NOT?: Prisma.StocktakeBarWhereInput | Prisma.StocktakeBarWhereInput[];
    stocktakeId?: Prisma.IntFilter<"StocktakeBar"> | number;
    metal?: Prisma.EnumStockMetalFilter<"StocktakeBar"> | $Enums.StockMetal;
    locationCode?: Prisma.StringFilter<"StocktakeBar"> | string;
    weightLabel?: Prisma.StringFilter<"StocktakeBar"> | string;
    refinery?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    serial?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    grams?: Prisma.DecimalNullableFilter<"StocktakeBar"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    status?: Prisma.EnumBarStatusFilter<"StocktakeBar"> | $Enums.BarStatus;
    carriedFromId?: Prisma.IntNullableFilter<"StocktakeBar"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"StocktakeBar"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"StocktakeBar"> | Date | string;
    stocktake?: Prisma.XOR<Prisma.StocktakeScalarRelationFilter, Prisma.StocktakeWhereInput>;
}, "id" | "sourceKey">;
export type StocktakeBarOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrder;
    refinery?: Prisma.SortOrderInput | Prisma.SortOrder;
    serial?: Prisma.SortOrderInput | Prisma.SortOrder;
    grams?: Prisma.SortOrderInput | Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    carriedFromId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.StocktakeBarCountOrderByAggregateInput;
    _avg?: Prisma.StocktakeBarAvgOrderByAggregateInput;
    _max?: Prisma.StocktakeBarMaxOrderByAggregateInput;
    _min?: Prisma.StocktakeBarMinOrderByAggregateInput;
    _sum?: Prisma.StocktakeBarSumOrderByAggregateInput;
};
export type StocktakeBarScalarWhereWithAggregatesInput = {
    AND?: Prisma.StocktakeBarScalarWhereWithAggregatesInput | Prisma.StocktakeBarScalarWhereWithAggregatesInput[];
    OR?: Prisma.StocktakeBarScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StocktakeBarScalarWhereWithAggregatesInput | Prisma.StocktakeBarScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"StocktakeBar"> | number;
    stocktakeId?: Prisma.IntWithAggregatesFilter<"StocktakeBar"> | number;
    metal?: Prisma.EnumStockMetalWithAggregatesFilter<"StocktakeBar"> | $Enums.StockMetal;
    locationCode?: Prisma.StringWithAggregatesFilter<"StocktakeBar"> | string;
    weightLabel?: Prisma.StringWithAggregatesFilter<"StocktakeBar"> | string;
    refinery?: Prisma.StringNullableWithAggregatesFilter<"StocktakeBar"> | string | null;
    serial?: Prisma.StringNullableWithAggregatesFilter<"StocktakeBar"> | string | null;
    grams?: Prisma.DecimalNullableWithAggregatesFilter<"StocktakeBar"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.StringNullableWithAggregatesFilter<"StocktakeBar"> | string | null;
    status?: Prisma.EnumBarStatusWithAggregatesFilter<"StocktakeBar"> | $Enums.BarStatus;
    carriedFromId?: Prisma.IntNullableWithAggregatesFilter<"StocktakeBar"> | number | null;
    sourceKey?: Prisma.StringNullableWithAggregatesFilter<"StocktakeBar"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"StocktakeBar"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"StocktakeBar"> | Date | string;
};
export type StocktakeBarCreateInput = {
    metal: $Enums.StockMetal;
    locationCode: string;
    weightLabel: string;
    refinery?: string | null;
    serial?: string | null;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.BarStatus;
    carriedFromId?: number | null;
    sourceKey?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stocktake: Prisma.StocktakeCreateNestedOneWithoutBarsInput;
};
export type StocktakeBarUncheckedCreateInput = {
    id?: number;
    stocktakeId: number;
    metal: $Enums.StockMetal;
    locationCode: string;
    weightLabel: string;
    refinery?: string | null;
    serial?: string | null;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.BarStatus;
    carriedFromId?: number | null;
    sourceKey?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeBarUpdateInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumBarStatusFieldUpdateOperationsInput | $Enums.BarStatus;
    carriedFromId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stocktake?: Prisma.StocktakeUpdateOneRequiredWithoutBarsNestedInput;
};
export type StocktakeBarUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stocktakeId?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumBarStatusFieldUpdateOperationsInput | $Enums.BarStatus;
    carriedFromId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeBarCreateManyInput = {
    id?: number;
    stocktakeId: number;
    metal: $Enums.StockMetal;
    locationCode: string;
    weightLabel: string;
    refinery?: string | null;
    serial?: string | null;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.BarStatus;
    carriedFromId?: number | null;
    sourceKey?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeBarUpdateManyMutationInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumBarStatusFieldUpdateOperationsInput | $Enums.BarStatus;
    carriedFromId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeBarUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stocktakeId?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumBarStatusFieldUpdateOperationsInput | $Enums.BarStatus;
    carriedFromId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeBarListRelationFilter = {
    every?: Prisma.StocktakeBarWhereInput;
    some?: Prisma.StocktakeBarWhereInput;
    none?: Prisma.StocktakeBarWhereInput;
};
export type StocktakeBarOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StocktakeBarCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    carriedFromId?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StocktakeBarAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
    carriedFromId?: Prisma.SortOrder;
};
export type StocktakeBarMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    carriedFromId?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StocktakeBarMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    carriedFromId?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StocktakeBarSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
    carriedFromId?: Prisma.SortOrder;
};
export type StocktakeBarCreateNestedManyWithoutStocktakeInput = {
    create?: Prisma.XOR<Prisma.StocktakeBarCreateWithoutStocktakeInput, Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeBarCreateWithoutStocktakeInput[] | Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeBarCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeBarCreateOrConnectWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeBarCreateManyStocktakeInputEnvelope;
    connect?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
};
export type StocktakeBarUncheckedCreateNestedManyWithoutStocktakeInput = {
    create?: Prisma.XOR<Prisma.StocktakeBarCreateWithoutStocktakeInput, Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeBarCreateWithoutStocktakeInput[] | Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeBarCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeBarCreateOrConnectWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeBarCreateManyStocktakeInputEnvelope;
    connect?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
};
export type StocktakeBarUpdateManyWithoutStocktakeNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeBarCreateWithoutStocktakeInput, Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeBarCreateWithoutStocktakeInput[] | Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeBarCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeBarCreateOrConnectWithoutStocktakeInput[];
    upsert?: Prisma.StocktakeBarUpsertWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeBarUpsertWithWhereUniqueWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeBarCreateManyStocktakeInputEnvelope;
    set?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
    disconnect?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
    delete?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
    connect?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
    update?: Prisma.StocktakeBarUpdateWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeBarUpdateWithWhereUniqueWithoutStocktakeInput[];
    updateMany?: Prisma.StocktakeBarUpdateManyWithWhereWithoutStocktakeInput | Prisma.StocktakeBarUpdateManyWithWhereWithoutStocktakeInput[];
    deleteMany?: Prisma.StocktakeBarScalarWhereInput | Prisma.StocktakeBarScalarWhereInput[];
};
export type StocktakeBarUncheckedUpdateManyWithoutStocktakeNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeBarCreateWithoutStocktakeInput, Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeBarCreateWithoutStocktakeInput[] | Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeBarCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeBarCreateOrConnectWithoutStocktakeInput[];
    upsert?: Prisma.StocktakeBarUpsertWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeBarUpsertWithWhereUniqueWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeBarCreateManyStocktakeInputEnvelope;
    set?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
    disconnect?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
    delete?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
    connect?: Prisma.StocktakeBarWhereUniqueInput | Prisma.StocktakeBarWhereUniqueInput[];
    update?: Prisma.StocktakeBarUpdateWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeBarUpdateWithWhereUniqueWithoutStocktakeInput[];
    updateMany?: Prisma.StocktakeBarUpdateManyWithWhereWithoutStocktakeInput | Prisma.StocktakeBarUpdateManyWithWhereWithoutStocktakeInput[];
    deleteMany?: Prisma.StocktakeBarScalarWhereInput | Prisma.StocktakeBarScalarWhereInput[];
};
export type EnumStockMetalFieldUpdateOperationsInput = {
    set?: $Enums.StockMetal;
};
export type EnumBarStatusFieldUpdateOperationsInput = {
    set?: $Enums.BarStatus;
};
export type StocktakeBarCreateWithoutStocktakeInput = {
    metal: $Enums.StockMetal;
    locationCode: string;
    weightLabel: string;
    refinery?: string | null;
    serial?: string | null;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.BarStatus;
    carriedFromId?: number | null;
    sourceKey?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeBarUncheckedCreateWithoutStocktakeInput = {
    id?: number;
    metal: $Enums.StockMetal;
    locationCode: string;
    weightLabel: string;
    refinery?: string | null;
    serial?: string | null;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.BarStatus;
    carriedFromId?: number | null;
    sourceKey?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeBarCreateOrConnectWithoutStocktakeInput = {
    where: Prisma.StocktakeBarWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeBarCreateWithoutStocktakeInput, Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput>;
};
export type StocktakeBarCreateManyStocktakeInputEnvelope = {
    data: Prisma.StocktakeBarCreateManyStocktakeInput | Prisma.StocktakeBarCreateManyStocktakeInput[];
    skipDuplicates?: boolean;
};
export type StocktakeBarUpsertWithWhereUniqueWithoutStocktakeInput = {
    where: Prisma.StocktakeBarWhereUniqueInput;
    update: Prisma.XOR<Prisma.StocktakeBarUpdateWithoutStocktakeInput, Prisma.StocktakeBarUncheckedUpdateWithoutStocktakeInput>;
    create: Prisma.XOR<Prisma.StocktakeBarCreateWithoutStocktakeInput, Prisma.StocktakeBarUncheckedCreateWithoutStocktakeInput>;
};
export type StocktakeBarUpdateWithWhereUniqueWithoutStocktakeInput = {
    where: Prisma.StocktakeBarWhereUniqueInput;
    data: Prisma.XOR<Prisma.StocktakeBarUpdateWithoutStocktakeInput, Prisma.StocktakeBarUncheckedUpdateWithoutStocktakeInput>;
};
export type StocktakeBarUpdateManyWithWhereWithoutStocktakeInput = {
    where: Prisma.StocktakeBarScalarWhereInput;
    data: Prisma.XOR<Prisma.StocktakeBarUpdateManyMutationInput, Prisma.StocktakeBarUncheckedUpdateManyWithoutStocktakeInput>;
};
export type StocktakeBarScalarWhereInput = {
    AND?: Prisma.StocktakeBarScalarWhereInput | Prisma.StocktakeBarScalarWhereInput[];
    OR?: Prisma.StocktakeBarScalarWhereInput[];
    NOT?: Prisma.StocktakeBarScalarWhereInput | Prisma.StocktakeBarScalarWhereInput[];
    id?: Prisma.IntFilter<"StocktakeBar"> | number;
    stocktakeId?: Prisma.IntFilter<"StocktakeBar"> | number;
    metal?: Prisma.EnumStockMetalFilter<"StocktakeBar"> | $Enums.StockMetal;
    locationCode?: Prisma.StringFilter<"StocktakeBar"> | string;
    weightLabel?: Prisma.StringFilter<"StocktakeBar"> | string;
    refinery?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    serial?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    grams?: Prisma.DecimalNullableFilter<"StocktakeBar"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    status?: Prisma.EnumBarStatusFilter<"StocktakeBar"> | $Enums.BarStatus;
    carriedFromId?: Prisma.IntNullableFilter<"StocktakeBar"> | number | null;
    sourceKey?: Prisma.StringNullableFilter<"StocktakeBar"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"StocktakeBar"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"StocktakeBar"> | Date | string;
};
export type StocktakeBarCreateManyStocktakeInput = {
    id?: number;
    metal: $Enums.StockMetal;
    locationCode: string;
    weightLabel: string;
    refinery?: string | null;
    serial?: string | null;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.BarStatus;
    carriedFromId?: number | null;
    sourceKey?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeBarUpdateWithoutStocktakeInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumBarStatusFieldUpdateOperationsInput | $Enums.BarStatus;
    carriedFromId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeBarUncheckedUpdateWithoutStocktakeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumBarStatusFieldUpdateOperationsInput | $Enums.BarStatus;
    carriedFromId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeBarUncheckedUpdateManyWithoutStocktakeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    locationCode?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumBarStatusFieldUpdateOperationsInput | $Enums.BarStatus;
    carriedFromId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    sourceKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeBarSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stocktakeId?: boolean;
    metal?: boolean;
    locationCode?: boolean;
    weightLabel?: boolean;
    refinery?: boolean;
    serial?: boolean;
    grams?: boolean;
    details?: boolean;
    status?: boolean;
    carriedFromId?: boolean;
    sourceKey?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktakeBar"]>;
export type StocktakeBarSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stocktakeId?: boolean;
    metal?: boolean;
    locationCode?: boolean;
    weightLabel?: boolean;
    refinery?: boolean;
    serial?: boolean;
    grams?: boolean;
    details?: boolean;
    status?: boolean;
    carriedFromId?: boolean;
    sourceKey?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktakeBar"]>;
export type StocktakeBarSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stocktakeId?: boolean;
    metal?: boolean;
    locationCode?: boolean;
    weightLabel?: boolean;
    refinery?: boolean;
    serial?: boolean;
    grams?: boolean;
    details?: boolean;
    status?: boolean;
    carriedFromId?: boolean;
    sourceKey?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktakeBar"]>;
export type StocktakeBarSelectScalar = {
    id?: boolean;
    stocktakeId?: boolean;
    metal?: boolean;
    locationCode?: boolean;
    weightLabel?: boolean;
    refinery?: boolean;
    serial?: boolean;
    grams?: boolean;
    details?: boolean;
    status?: boolean;
    carriedFromId?: boolean;
    sourceKey?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type StocktakeBarOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "stocktakeId" | "metal" | "locationCode" | "weightLabel" | "refinery" | "serial" | "grams" | "details" | "status" | "carriedFromId" | "sourceKey" | "createdAt" | "updatedAt", ExtArgs["result"]["stocktakeBar"]>;
export type StocktakeBarInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
};
export type StocktakeBarIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
};
export type StocktakeBarIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
};
export type $StocktakeBarPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StocktakeBar";
    objects: {
        stocktake: Prisma.$StocktakePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        stocktakeId: number;
        metal: $Enums.StockMetal;
        locationCode: string;
        weightLabel: string;
        refinery: string | null;
        serial: string | null;
        grams: runtime.Decimal | null;
        details: string | null;
        status: $Enums.BarStatus;
        carriedFromId: number | null;
        sourceKey: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["stocktakeBar"]>;
    composites: {};
};
export type StocktakeBarGetPayload<S extends boolean | null | undefined | StocktakeBarDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload, S>;
export type StocktakeBarCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StocktakeBarFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StocktakeBarCountAggregateInputType | true;
};
export interface StocktakeBarDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StocktakeBar'];
        meta: {
            name: 'StocktakeBar';
        };
    };
    findUnique<T extends StocktakeBarFindUniqueArgs>(args: Prisma.SelectSubset<T, StocktakeBarFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StocktakeBarClient<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StocktakeBarFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StocktakeBarFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StocktakeBarClient<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StocktakeBarFindFirstArgs>(args?: Prisma.SelectSubset<T, StocktakeBarFindFirstArgs<ExtArgs>>): Prisma.Prisma__StocktakeBarClient<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StocktakeBarFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StocktakeBarFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StocktakeBarClient<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StocktakeBarFindManyArgs>(args?: Prisma.SelectSubset<T, StocktakeBarFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StocktakeBarCreateArgs>(args: Prisma.SelectSubset<T, StocktakeBarCreateArgs<ExtArgs>>): Prisma.Prisma__StocktakeBarClient<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StocktakeBarCreateManyArgs>(args?: Prisma.SelectSubset<T, StocktakeBarCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StocktakeBarCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StocktakeBarCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StocktakeBarDeleteArgs>(args: Prisma.SelectSubset<T, StocktakeBarDeleteArgs<ExtArgs>>): Prisma.Prisma__StocktakeBarClient<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StocktakeBarUpdateArgs>(args: Prisma.SelectSubset<T, StocktakeBarUpdateArgs<ExtArgs>>): Prisma.Prisma__StocktakeBarClient<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StocktakeBarDeleteManyArgs>(args?: Prisma.SelectSubset<T, StocktakeBarDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StocktakeBarUpdateManyArgs>(args: Prisma.SelectSubset<T, StocktakeBarUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StocktakeBarUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StocktakeBarUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StocktakeBarUpsertArgs>(args: Prisma.SelectSubset<T, StocktakeBarUpsertArgs<ExtArgs>>): Prisma.Prisma__StocktakeBarClient<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StocktakeBarCountArgs>(args?: Prisma.Subset<T, StocktakeBarCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StocktakeBarCountAggregateOutputType> : number>;
    aggregate<T extends StocktakeBarAggregateArgs>(args: Prisma.Subset<T, StocktakeBarAggregateArgs>): Prisma.PrismaPromise<GetStocktakeBarAggregateType<T>>;
    groupBy<T extends StocktakeBarGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StocktakeBarGroupByArgs['orderBy'];
    } : {
        orderBy?: StocktakeBarGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StocktakeBarGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStocktakeBarGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StocktakeBarFieldRefs;
}
export interface Prisma__StocktakeBarClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    stocktake<T extends Prisma.StocktakeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StocktakeDefaultArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StocktakeBarFieldRefs {
    readonly id: Prisma.FieldRef<"StocktakeBar", 'Int'>;
    readonly stocktakeId: Prisma.FieldRef<"StocktakeBar", 'Int'>;
    readonly metal: Prisma.FieldRef<"StocktakeBar", 'StockMetal'>;
    readonly locationCode: Prisma.FieldRef<"StocktakeBar", 'String'>;
    readonly weightLabel: Prisma.FieldRef<"StocktakeBar", 'String'>;
    readonly refinery: Prisma.FieldRef<"StocktakeBar", 'String'>;
    readonly serial: Prisma.FieldRef<"StocktakeBar", 'String'>;
    readonly grams: Prisma.FieldRef<"StocktakeBar", 'Decimal'>;
    readonly details: Prisma.FieldRef<"StocktakeBar", 'String'>;
    readonly status: Prisma.FieldRef<"StocktakeBar", 'BarStatus'>;
    readonly carriedFromId: Prisma.FieldRef<"StocktakeBar", 'Int'>;
    readonly sourceKey: Prisma.FieldRef<"StocktakeBar", 'String'>;
    readonly createdAt: Prisma.FieldRef<"StocktakeBar", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"StocktakeBar", 'DateTime'>;
}
export type StocktakeBarFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
    where: Prisma.StocktakeBarWhereUniqueInput;
};
export type StocktakeBarFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
    where: Prisma.StocktakeBarWhereUniqueInput;
};
export type StocktakeBarFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
    where?: Prisma.StocktakeBarWhereInput;
    orderBy?: Prisma.StocktakeBarOrderByWithRelationInput | Prisma.StocktakeBarOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeBarWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeBarScalarFieldEnum | Prisma.StocktakeBarScalarFieldEnum[];
};
export type StocktakeBarFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
    where?: Prisma.StocktakeBarWhereInput;
    orderBy?: Prisma.StocktakeBarOrderByWithRelationInput | Prisma.StocktakeBarOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeBarWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeBarScalarFieldEnum | Prisma.StocktakeBarScalarFieldEnum[];
};
export type StocktakeBarFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
    where?: Prisma.StocktakeBarWhereInput;
    orderBy?: Prisma.StocktakeBarOrderByWithRelationInput | Prisma.StocktakeBarOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeBarWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeBarScalarFieldEnum | Prisma.StocktakeBarScalarFieldEnum[];
};
export type StocktakeBarCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeBarCreateInput, Prisma.StocktakeBarUncheckedCreateInput>;
};
export type StocktakeBarCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StocktakeBarCreateManyInput | Prisma.StocktakeBarCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StocktakeBarCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    data: Prisma.StocktakeBarCreateManyInput | Prisma.StocktakeBarCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StocktakeBarIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StocktakeBarUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeBarUpdateInput, Prisma.StocktakeBarUncheckedUpdateInput>;
    where: Prisma.StocktakeBarWhereUniqueInput;
};
export type StocktakeBarUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StocktakeBarUpdateManyMutationInput, Prisma.StocktakeBarUncheckedUpdateManyInput>;
    where?: Prisma.StocktakeBarWhereInput;
    limit?: number;
};
export type StocktakeBarUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeBarUpdateManyMutationInput, Prisma.StocktakeBarUncheckedUpdateManyInput>;
    where?: Prisma.StocktakeBarWhereInput;
    limit?: number;
    include?: Prisma.StocktakeBarIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StocktakeBarUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
    where: Prisma.StocktakeBarWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeBarCreateInput, Prisma.StocktakeBarUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StocktakeBarUpdateInput, Prisma.StocktakeBarUncheckedUpdateInput>;
};
export type StocktakeBarDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
    where: Prisma.StocktakeBarWhereUniqueInput;
};
export type StocktakeBarDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeBarWhereInput;
    limit?: number;
};
export type StocktakeBarDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeBarSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeBarOmit<ExtArgs> | null;
    include?: Prisma.StocktakeBarInclude<ExtArgs> | null;
};
//# sourceMappingURL=StocktakeBar.d.ts.map