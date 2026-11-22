import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type StocktakeModel = runtime.Types.Result.DefaultSelection<Prisma.$StocktakePayload>;
export type AggregateStocktake = {
    _count: StocktakeCountAggregateOutputType | null;
    _avg: StocktakeAvgAggregateOutputType | null;
    _sum: StocktakeSumAggregateOutputType | null;
    _min: StocktakeMinAggregateOutputType | null;
    _max: StocktakeMaxAggregateOutputType | null;
};
export type StocktakeAvgAggregateOutputType = {
    id: number | null;
    importBatchId: number | null;
};
export type StocktakeSumAggregateOutputType = {
    id: number | null;
    importBatchId: number | null;
};
export type StocktakeMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    countDate: Date | null;
    cutoffDate: Date | null;
    status: $Enums.StocktakeStatus | null;
    stocktakeLead: string | null;
    secondChecker: string | null;
    notes: string | null;
    createdBy: string | null;
    finalisedBy: string | null;
    finalisedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    imported: boolean | null;
    importBatchId: number | null;
};
export type StocktakeMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    countDate: Date | null;
    cutoffDate: Date | null;
    status: $Enums.StocktakeStatus | null;
    stocktakeLead: string | null;
    secondChecker: string | null;
    notes: string | null;
    createdBy: string | null;
    finalisedBy: string | null;
    finalisedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    imported: boolean | null;
    importBatchId: number | null;
};
export type StocktakeCountAggregateOutputType = {
    id: number;
    name: number;
    countDate: number;
    cutoffDate: number;
    status: number;
    stocktakeLead: number;
    secondChecker: number;
    notes: number;
    createdBy: number;
    finalisedBy: number;
    finalisedAt: number;
    createdAt: number;
    updatedAt: number;
    imported: number;
    importBatchId: number;
    _all: number;
};
export type StocktakeAvgAggregateInputType = {
    id?: true;
    importBatchId?: true;
};
export type StocktakeSumAggregateInputType = {
    id?: true;
    importBatchId?: true;
};
export type StocktakeMinAggregateInputType = {
    id?: true;
    name?: true;
    countDate?: true;
    cutoffDate?: true;
    status?: true;
    stocktakeLead?: true;
    secondChecker?: true;
    notes?: true;
    createdBy?: true;
    finalisedBy?: true;
    finalisedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    imported?: true;
    importBatchId?: true;
};
export type StocktakeMaxAggregateInputType = {
    id?: true;
    name?: true;
    countDate?: true;
    cutoffDate?: true;
    status?: true;
    stocktakeLead?: true;
    secondChecker?: true;
    notes?: true;
    createdBy?: true;
    finalisedBy?: true;
    finalisedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    imported?: true;
    importBatchId?: true;
};
export type StocktakeCountAggregateInputType = {
    id?: true;
    name?: true;
    countDate?: true;
    cutoffDate?: true;
    status?: true;
    stocktakeLead?: true;
    secondChecker?: true;
    notes?: true;
    createdBy?: true;
    finalisedBy?: true;
    finalisedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    imported?: true;
    importBatchId?: true;
    _all?: true;
};
export type StocktakeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeWhereInput;
    orderBy?: Prisma.StocktakeOrderByWithRelationInput | Prisma.StocktakeOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StocktakeCountAggregateInputType;
    _avg?: StocktakeAvgAggregateInputType;
    _sum?: StocktakeSumAggregateInputType;
    _min?: StocktakeMinAggregateInputType;
    _max?: StocktakeMaxAggregateInputType;
};
export type GetStocktakeAggregateType<T extends StocktakeAggregateArgs> = {
    [P in keyof T & keyof AggregateStocktake]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStocktake[P]> : Prisma.GetScalarType<T[P], AggregateStocktake[P]>;
};
export type StocktakeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeWhereInput;
    orderBy?: Prisma.StocktakeOrderByWithAggregationInput | Prisma.StocktakeOrderByWithAggregationInput[];
    by: Prisma.StocktakeScalarFieldEnum[] | Prisma.StocktakeScalarFieldEnum;
    having?: Prisma.StocktakeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StocktakeCountAggregateInputType | true;
    _avg?: StocktakeAvgAggregateInputType;
    _sum?: StocktakeSumAggregateInputType;
    _min?: StocktakeMinAggregateInputType;
    _max?: StocktakeMaxAggregateInputType;
};
export type StocktakeGroupByOutputType = {
    id: number;
    name: string;
    countDate: Date;
    cutoffDate: Date;
    status: $Enums.StocktakeStatus;
    stocktakeLead: string | null;
    secondChecker: string | null;
    notes: string | null;
    createdBy: string;
    finalisedBy: string | null;
    finalisedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    imported: boolean;
    importBatchId: number | null;
    _count: StocktakeCountAggregateOutputType | null;
    _avg: StocktakeAvgAggregateOutputType | null;
    _sum: StocktakeSumAggregateOutputType | null;
    _min: StocktakeMinAggregateOutputType | null;
    _max: StocktakeMaxAggregateOutputType | null;
};
export type GetStocktakeGroupByPayload<T extends StocktakeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StocktakeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StocktakeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StocktakeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StocktakeGroupByOutputType[P]>;
}>>;
export type StocktakeWhereInput = {
    AND?: Prisma.StocktakeWhereInput | Prisma.StocktakeWhereInput[];
    OR?: Prisma.StocktakeWhereInput[];
    NOT?: Prisma.StocktakeWhereInput | Prisma.StocktakeWhereInput[];
    id?: Prisma.IntFilter<"Stocktake"> | number;
    name?: Prisma.StringFilter<"Stocktake"> | string;
    countDate?: Prisma.DateTimeFilter<"Stocktake"> | Date | string;
    cutoffDate?: Prisma.DateTimeFilter<"Stocktake"> | Date | string;
    status?: Prisma.EnumStocktakeStatusFilter<"Stocktake"> | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.StringNullableFilter<"Stocktake"> | string | null;
    secondChecker?: Prisma.StringNullableFilter<"Stocktake"> | string | null;
    notes?: Prisma.StringNullableFilter<"Stocktake"> | string | null;
    createdBy?: Prisma.StringFilter<"Stocktake"> | string;
    finalisedBy?: Prisma.StringNullableFilter<"Stocktake"> | string | null;
    finalisedAt?: Prisma.DateTimeNullableFilter<"Stocktake"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Stocktake"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Stocktake"> | Date | string;
    imported?: Prisma.BoolFilter<"Stocktake"> | boolean;
    importBatchId?: Prisma.IntNullableFilter<"Stocktake"> | number | null;
    lines?: Prisma.StocktakeLineListRelationFilter;
    discrepancies?: Prisma.StocktakeDiscrepancyListRelationFilter;
    bars?: Prisma.StocktakeBarListRelationFilter;
    coins?: Prisma.StocktakeCoinListRelationFilter;
};
export type StocktakeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    countDate?: Prisma.SortOrder;
    cutoffDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    stocktakeLead?: Prisma.SortOrderInput | Prisma.SortOrder;
    secondChecker?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    finalisedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    finalisedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    imported?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    lines?: Prisma.StocktakeLineOrderByRelationAggregateInput;
    discrepancies?: Prisma.StocktakeDiscrepancyOrderByRelationAggregateInput;
    bars?: Prisma.StocktakeBarOrderByRelationAggregateInput;
    coins?: Prisma.StocktakeCoinOrderByRelationAggregateInput;
};
export type StocktakeWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.StocktakeWhereInput | Prisma.StocktakeWhereInput[];
    OR?: Prisma.StocktakeWhereInput[];
    NOT?: Prisma.StocktakeWhereInput | Prisma.StocktakeWhereInput[];
    name?: Prisma.StringFilter<"Stocktake"> | string;
    countDate?: Prisma.DateTimeFilter<"Stocktake"> | Date | string;
    cutoffDate?: Prisma.DateTimeFilter<"Stocktake"> | Date | string;
    status?: Prisma.EnumStocktakeStatusFilter<"Stocktake"> | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.StringNullableFilter<"Stocktake"> | string | null;
    secondChecker?: Prisma.StringNullableFilter<"Stocktake"> | string | null;
    notes?: Prisma.StringNullableFilter<"Stocktake"> | string | null;
    createdBy?: Prisma.StringFilter<"Stocktake"> | string;
    finalisedBy?: Prisma.StringNullableFilter<"Stocktake"> | string | null;
    finalisedAt?: Prisma.DateTimeNullableFilter<"Stocktake"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Stocktake"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Stocktake"> | Date | string;
    imported?: Prisma.BoolFilter<"Stocktake"> | boolean;
    importBatchId?: Prisma.IntNullableFilter<"Stocktake"> | number | null;
    lines?: Prisma.StocktakeLineListRelationFilter;
    discrepancies?: Prisma.StocktakeDiscrepancyListRelationFilter;
    bars?: Prisma.StocktakeBarListRelationFilter;
    coins?: Prisma.StocktakeCoinListRelationFilter;
}, "id">;
export type StocktakeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    countDate?: Prisma.SortOrder;
    cutoffDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    stocktakeLead?: Prisma.SortOrderInput | Prisma.SortOrder;
    secondChecker?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    finalisedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    finalisedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    imported?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.StocktakeCountOrderByAggregateInput;
    _avg?: Prisma.StocktakeAvgOrderByAggregateInput;
    _max?: Prisma.StocktakeMaxOrderByAggregateInput;
    _min?: Prisma.StocktakeMinOrderByAggregateInput;
    _sum?: Prisma.StocktakeSumOrderByAggregateInput;
};
export type StocktakeScalarWhereWithAggregatesInput = {
    AND?: Prisma.StocktakeScalarWhereWithAggregatesInput | Prisma.StocktakeScalarWhereWithAggregatesInput[];
    OR?: Prisma.StocktakeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StocktakeScalarWhereWithAggregatesInput | Prisma.StocktakeScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Stocktake"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Stocktake"> | string;
    countDate?: Prisma.DateTimeWithAggregatesFilter<"Stocktake"> | Date | string;
    cutoffDate?: Prisma.DateTimeWithAggregatesFilter<"Stocktake"> | Date | string;
    status?: Prisma.EnumStocktakeStatusWithAggregatesFilter<"Stocktake"> | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.StringNullableWithAggregatesFilter<"Stocktake"> | string | null;
    secondChecker?: Prisma.StringNullableWithAggregatesFilter<"Stocktake"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"Stocktake"> | string | null;
    createdBy?: Prisma.StringWithAggregatesFilter<"Stocktake"> | string;
    finalisedBy?: Prisma.StringNullableWithAggregatesFilter<"Stocktake"> | string | null;
    finalisedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Stocktake"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Stocktake"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Stocktake"> | Date | string;
    imported?: Prisma.BoolWithAggregatesFilter<"Stocktake"> | boolean;
    importBatchId?: Prisma.IntNullableWithAggregatesFilter<"Stocktake"> | number | null;
};
export type StocktakeCreateInput = {
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    lines?: Prisma.StocktakeLineCreateNestedManyWithoutStocktakeInput;
    discrepancies?: Prisma.StocktakeDiscrepancyCreateNestedManyWithoutStocktakeInput;
    bars?: Prisma.StocktakeBarCreateNestedManyWithoutStocktakeInput;
    coins?: Prisma.StocktakeCoinCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeUncheckedCreateInput = {
    id?: number;
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    lines?: Prisma.StocktakeLineUncheckedCreateNestedManyWithoutStocktakeInput;
    discrepancies?: Prisma.StocktakeDiscrepancyUncheckedCreateNestedManyWithoutStocktakeInput;
    bars?: Prisma.StocktakeBarUncheckedCreateNestedManyWithoutStocktakeInput;
    coins?: Prisma.StocktakeCoinUncheckedCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lines?: Prisma.StocktakeLineUpdateManyWithoutStocktakeNestedInput;
    discrepancies?: Prisma.StocktakeDiscrepancyUpdateManyWithoutStocktakeNestedInput;
    bars?: Prisma.StocktakeBarUpdateManyWithoutStocktakeNestedInput;
    coins?: Prisma.StocktakeCoinUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lines?: Prisma.StocktakeLineUncheckedUpdateManyWithoutStocktakeNestedInput;
    discrepancies?: Prisma.StocktakeDiscrepancyUncheckedUpdateManyWithoutStocktakeNestedInput;
    bars?: Prisma.StocktakeBarUncheckedUpdateManyWithoutStocktakeNestedInput;
    coins?: Prisma.StocktakeCoinUncheckedUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeCreateManyInput = {
    id?: number;
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
};
export type StocktakeUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StocktakeUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StocktakeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    countDate?: Prisma.SortOrder;
    cutoffDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    stocktakeLead?: Prisma.SortOrder;
    secondChecker?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    finalisedBy?: Prisma.SortOrder;
    finalisedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    imported?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type StocktakeAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type StocktakeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    countDate?: Prisma.SortOrder;
    cutoffDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    stocktakeLead?: Prisma.SortOrder;
    secondChecker?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    finalisedBy?: Prisma.SortOrder;
    finalisedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    imported?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type StocktakeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    countDate?: Prisma.SortOrder;
    cutoffDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    stocktakeLead?: Prisma.SortOrder;
    secondChecker?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    finalisedBy?: Prisma.SortOrder;
    finalisedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    imported?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type StocktakeSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type StocktakeScalarRelationFilter = {
    is?: Prisma.StocktakeWhereInput;
    isNot?: Prisma.StocktakeWhereInput;
};
export type EnumStocktakeStatusFieldUpdateOperationsInput = {
    set?: $Enums.StocktakeStatus;
};
export type StocktakeCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.StocktakeCreateWithoutLinesInput, Prisma.StocktakeUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.StocktakeCreateOrConnectWithoutLinesInput;
    connect?: Prisma.StocktakeWhereUniqueInput;
};
export type StocktakeUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeCreateWithoutLinesInput, Prisma.StocktakeUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.StocktakeCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.StocktakeUpsertWithoutLinesInput;
    connect?: Prisma.StocktakeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StocktakeUpdateToOneWithWhereWithoutLinesInput, Prisma.StocktakeUpdateWithoutLinesInput>, Prisma.StocktakeUncheckedUpdateWithoutLinesInput>;
};
export type StocktakeCreateNestedOneWithoutDiscrepanciesInput = {
    create?: Prisma.XOR<Prisma.StocktakeCreateWithoutDiscrepanciesInput, Prisma.StocktakeUncheckedCreateWithoutDiscrepanciesInput>;
    connectOrCreate?: Prisma.StocktakeCreateOrConnectWithoutDiscrepanciesInput;
    connect?: Prisma.StocktakeWhereUniqueInput;
};
export type StocktakeUpdateOneRequiredWithoutDiscrepanciesNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeCreateWithoutDiscrepanciesInput, Prisma.StocktakeUncheckedCreateWithoutDiscrepanciesInput>;
    connectOrCreate?: Prisma.StocktakeCreateOrConnectWithoutDiscrepanciesInput;
    upsert?: Prisma.StocktakeUpsertWithoutDiscrepanciesInput;
    connect?: Prisma.StocktakeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StocktakeUpdateToOneWithWhereWithoutDiscrepanciesInput, Prisma.StocktakeUpdateWithoutDiscrepanciesInput>, Prisma.StocktakeUncheckedUpdateWithoutDiscrepanciesInput>;
};
export type StocktakeCreateNestedOneWithoutBarsInput = {
    create?: Prisma.XOR<Prisma.StocktakeCreateWithoutBarsInput, Prisma.StocktakeUncheckedCreateWithoutBarsInput>;
    connectOrCreate?: Prisma.StocktakeCreateOrConnectWithoutBarsInput;
    connect?: Prisma.StocktakeWhereUniqueInput;
};
export type StocktakeUpdateOneRequiredWithoutBarsNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeCreateWithoutBarsInput, Prisma.StocktakeUncheckedCreateWithoutBarsInput>;
    connectOrCreate?: Prisma.StocktakeCreateOrConnectWithoutBarsInput;
    upsert?: Prisma.StocktakeUpsertWithoutBarsInput;
    connect?: Prisma.StocktakeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StocktakeUpdateToOneWithWhereWithoutBarsInput, Prisma.StocktakeUpdateWithoutBarsInput>, Prisma.StocktakeUncheckedUpdateWithoutBarsInput>;
};
export type StocktakeCreateNestedOneWithoutCoinsInput = {
    create?: Prisma.XOR<Prisma.StocktakeCreateWithoutCoinsInput, Prisma.StocktakeUncheckedCreateWithoutCoinsInput>;
    connectOrCreate?: Prisma.StocktakeCreateOrConnectWithoutCoinsInput;
    connect?: Prisma.StocktakeWhereUniqueInput;
};
export type StocktakeUpdateOneRequiredWithoutCoinsNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeCreateWithoutCoinsInput, Prisma.StocktakeUncheckedCreateWithoutCoinsInput>;
    connectOrCreate?: Prisma.StocktakeCreateOrConnectWithoutCoinsInput;
    upsert?: Prisma.StocktakeUpsertWithoutCoinsInput;
    connect?: Prisma.StocktakeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StocktakeUpdateToOneWithWhereWithoutCoinsInput, Prisma.StocktakeUpdateWithoutCoinsInput>, Prisma.StocktakeUncheckedUpdateWithoutCoinsInput>;
};
export type StocktakeCreateWithoutLinesInput = {
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    discrepancies?: Prisma.StocktakeDiscrepancyCreateNestedManyWithoutStocktakeInput;
    bars?: Prisma.StocktakeBarCreateNestedManyWithoutStocktakeInput;
    coins?: Prisma.StocktakeCoinCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeUncheckedCreateWithoutLinesInput = {
    id?: number;
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    discrepancies?: Prisma.StocktakeDiscrepancyUncheckedCreateNestedManyWithoutStocktakeInput;
    bars?: Prisma.StocktakeBarUncheckedCreateNestedManyWithoutStocktakeInput;
    coins?: Prisma.StocktakeCoinUncheckedCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeCreateOrConnectWithoutLinesInput = {
    where: Prisma.StocktakeWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeCreateWithoutLinesInput, Prisma.StocktakeUncheckedCreateWithoutLinesInput>;
};
export type StocktakeUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.StocktakeUpdateWithoutLinesInput, Prisma.StocktakeUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.StocktakeCreateWithoutLinesInput, Prisma.StocktakeUncheckedCreateWithoutLinesInput>;
    where?: Prisma.StocktakeWhereInput;
};
export type StocktakeUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.StocktakeWhereInput;
    data: Prisma.XOR<Prisma.StocktakeUpdateWithoutLinesInput, Prisma.StocktakeUncheckedUpdateWithoutLinesInput>;
};
export type StocktakeUpdateWithoutLinesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    discrepancies?: Prisma.StocktakeDiscrepancyUpdateManyWithoutStocktakeNestedInput;
    bars?: Prisma.StocktakeBarUpdateManyWithoutStocktakeNestedInput;
    coins?: Prisma.StocktakeCoinUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    discrepancies?: Prisma.StocktakeDiscrepancyUncheckedUpdateManyWithoutStocktakeNestedInput;
    bars?: Prisma.StocktakeBarUncheckedUpdateManyWithoutStocktakeNestedInput;
    coins?: Prisma.StocktakeCoinUncheckedUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeCreateWithoutDiscrepanciesInput = {
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    lines?: Prisma.StocktakeLineCreateNestedManyWithoutStocktakeInput;
    bars?: Prisma.StocktakeBarCreateNestedManyWithoutStocktakeInput;
    coins?: Prisma.StocktakeCoinCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeUncheckedCreateWithoutDiscrepanciesInput = {
    id?: number;
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    lines?: Prisma.StocktakeLineUncheckedCreateNestedManyWithoutStocktakeInput;
    bars?: Prisma.StocktakeBarUncheckedCreateNestedManyWithoutStocktakeInput;
    coins?: Prisma.StocktakeCoinUncheckedCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeCreateOrConnectWithoutDiscrepanciesInput = {
    where: Prisma.StocktakeWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeCreateWithoutDiscrepanciesInput, Prisma.StocktakeUncheckedCreateWithoutDiscrepanciesInput>;
};
export type StocktakeUpsertWithoutDiscrepanciesInput = {
    update: Prisma.XOR<Prisma.StocktakeUpdateWithoutDiscrepanciesInput, Prisma.StocktakeUncheckedUpdateWithoutDiscrepanciesInput>;
    create: Prisma.XOR<Prisma.StocktakeCreateWithoutDiscrepanciesInput, Prisma.StocktakeUncheckedCreateWithoutDiscrepanciesInput>;
    where?: Prisma.StocktakeWhereInput;
};
export type StocktakeUpdateToOneWithWhereWithoutDiscrepanciesInput = {
    where?: Prisma.StocktakeWhereInput;
    data: Prisma.XOR<Prisma.StocktakeUpdateWithoutDiscrepanciesInput, Prisma.StocktakeUncheckedUpdateWithoutDiscrepanciesInput>;
};
export type StocktakeUpdateWithoutDiscrepanciesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lines?: Prisma.StocktakeLineUpdateManyWithoutStocktakeNestedInput;
    bars?: Prisma.StocktakeBarUpdateManyWithoutStocktakeNestedInput;
    coins?: Prisma.StocktakeCoinUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeUncheckedUpdateWithoutDiscrepanciesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lines?: Prisma.StocktakeLineUncheckedUpdateManyWithoutStocktakeNestedInput;
    bars?: Prisma.StocktakeBarUncheckedUpdateManyWithoutStocktakeNestedInput;
    coins?: Prisma.StocktakeCoinUncheckedUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeCreateWithoutBarsInput = {
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    lines?: Prisma.StocktakeLineCreateNestedManyWithoutStocktakeInput;
    discrepancies?: Prisma.StocktakeDiscrepancyCreateNestedManyWithoutStocktakeInput;
    coins?: Prisma.StocktakeCoinCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeUncheckedCreateWithoutBarsInput = {
    id?: number;
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    lines?: Prisma.StocktakeLineUncheckedCreateNestedManyWithoutStocktakeInput;
    discrepancies?: Prisma.StocktakeDiscrepancyUncheckedCreateNestedManyWithoutStocktakeInput;
    coins?: Prisma.StocktakeCoinUncheckedCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeCreateOrConnectWithoutBarsInput = {
    where: Prisma.StocktakeWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeCreateWithoutBarsInput, Prisma.StocktakeUncheckedCreateWithoutBarsInput>;
};
export type StocktakeUpsertWithoutBarsInput = {
    update: Prisma.XOR<Prisma.StocktakeUpdateWithoutBarsInput, Prisma.StocktakeUncheckedUpdateWithoutBarsInput>;
    create: Prisma.XOR<Prisma.StocktakeCreateWithoutBarsInput, Prisma.StocktakeUncheckedCreateWithoutBarsInput>;
    where?: Prisma.StocktakeWhereInput;
};
export type StocktakeUpdateToOneWithWhereWithoutBarsInput = {
    where?: Prisma.StocktakeWhereInput;
    data: Prisma.XOR<Prisma.StocktakeUpdateWithoutBarsInput, Prisma.StocktakeUncheckedUpdateWithoutBarsInput>;
};
export type StocktakeUpdateWithoutBarsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lines?: Prisma.StocktakeLineUpdateManyWithoutStocktakeNestedInput;
    discrepancies?: Prisma.StocktakeDiscrepancyUpdateManyWithoutStocktakeNestedInput;
    coins?: Prisma.StocktakeCoinUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeUncheckedUpdateWithoutBarsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lines?: Prisma.StocktakeLineUncheckedUpdateManyWithoutStocktakeNestedInput;
    discrepancies?: Prisma.StocktakeDiscrepancyUncheckedUpdateManyWithoutStocktakeNestedInput;
    coins?: Prisma.StocktakeCoinUncheckedUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeCreateWithoutCoinsInput = {
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    lines?: Prisma.StocktakeLineCreateNestedManyWithoutStocktakeInput;
    discrepancies?: Prisma.StocktakeDiscrepancyCreateNestedManyWithoutStocktakeInput;
    bars?: Prisma.StocktakeBarCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeUncheckedCreateWithoutCoinsInput = {
    id?: number;
    name: string;
    countDate: Date | string;
    cutoffDate: Date | string;
    status?: $Enums.StocktakeStatus;
    stocktakeLead?: string | null;
    secondChecker?: string | null;
    notes?: string | null;
    createdBy: string;
    finalisedBy?: string | null;
    finalisedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imported?: boolean;
    importBatchId?: number | null;
    lines?: Prisma.StocktakeLineUncheckedCreateNestedManyWithoutStocktakeInput;
    discrepancies?: Prisma.StocktakeDiscrepancyUncheckedCreateNestedManyWithoutStocktakeInput;
    bars?: Prisma.StocktakeBarUncheckedCreateNestedManyWithoutStocktakeInput;
};
export type StocktakeCreateOrConnectWithoutCoinsInput = {
    where: Prisma.StocktakeWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeCreateWithoutCoinsInput, Prisma.StocktakeUncheckedCreateWithoutCoinsInput>;
};
export type StocktakeUpsertWithoutCoinsInput = {
    update: Prisma.XOR<Prisma.StocktakeUpdateWithoutCoinsInput, Prisma.StocktakeUncheckedUpdateWithoutCoinsInput>;
    create: Prisma.XOR<Prisma.StocktakeCreateWithoutCoinsInput, Prisma.StocktakeUncheckedCreateWithoutCoinsInput>;
    where?: Prisma.StocktakeWhereInput;
};
export type StocktakeUpdateToOneWithWhereWithoutCoinsInput = {
    where?: Prisma.StocktakeWhereInput;
    data: Prisma.XOR<Prisma.StocktakeUpdateWithoutCoinsInput, Prisma.StocktakeUncheckedUpdateWithoutCoinsInput>;
};
export type StocktakeUpdateWithoutCoinsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lines?: Prisma.StocktakeLineUpdateManyWithoutStocktakeNestedInput;
    discrepancies?: Prisma.StocktakeDiscrepancyUpdateManyWithoutStocktakeNestedInput;
    bars?: Prisma.StocktakeBarUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeUncheckedUpdateWithoutCoinsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    countDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cutoffDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumStocktakeStatusFieldUpdateOperationsInput | $Enums.StocktakeStatus;
    stocktakeLead?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    secondChecker?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    finalisedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    finalisedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    imported?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lines?: Prisma.StocktakeLineUncheckedUpdateManyWithoutStocktakeNestedInput;
    discrepancies?: Prisma.StocktakeDiscrepancyUncheckedUpdateManyWithoutStocktakeNestedInput;
    bars?: Prisma.StocktakeBarUncheckedUpdateManyWithoutStocktakeNestedInput;
};
export type StocktakeCountOutputType = {
    lines: number;
    discrepancies: number;
    bars: number;
    coins: number;
};
export type StocktakeCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | StocktakeCountOutputTypeCountLinesArgs;
    discrepancies?: boolean | StocktakeCountOutputTypeCountDiscrepanciesArgs;
    bars?: boolean | StocktakeCountOutputTypeCountBarsArgs;
    coins?: boolean | StocktakeCountOutputTypeCountCoinsArgs;
};
export type StocktakeCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeCountOutputTypeSelect<ExtArgs> | null;
};
export type StocktakeCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeLineWhereInput;
};
export type StocktakeCountOutputTypeCountDiscrepanciesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeDiscrepancyWhereInput;
};
export type StocktakeCountOutputTypeCountBarsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeBarWhereInput;
};
export type StocktakeCountOutputTypeCountCoinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeCoinWhereInput;
};
export type StocktakeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    countDate?: boolean;
    cutoffDate?: boolean;
    status?: boolean;
    stocktakeLead?: boolean;
    secondChecker?: boolean;
    notes?: boolean;
    createdBy?: boolean;
    finalisedBy?: boolean;
    finalisedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    imported?: boolean;
    importBatchId?: boolean;
    lines?: boolean | Prisma.Stocktake$linesArgs<ExtArgs>;
    discrepancies?: boolean | Prisma.Stocktake$discrepanciesArgs<ExtArgs>;
    bars?: boolean | Prisma.Stocktake$barsArgs<ExtArgs>;
    coins?: boolean | Prisma.Stocktake$coinsArgs<ExtArgs>;
    _count?: boolean | Prisma.StocktakeCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktake"]>;
export type StocktakeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    countDate?: boolean;
    cutoffDate?: boolean;
    status?: boolean;
    stocktakeLead?: boolean;
    secondChecker?: boolean;
    notes?: boolean;
    createdBy?: boolean;
    finalisedBy?: boolean;
    finalisedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    imported?: boolean;
    importBatchId?: boolean;
}, ExtArgs["result"]["stocktake"]>;
export type StocktakeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    countDate?: boolean;
    cutoffDate?: boolean;
    status?: boolean;
    stocktakeLead?: boolean;
    secondChecker?: boolean;
    notes?: boolean;
    createdBy?: boolean;
    finalisedBy?: boolean;
    finalisedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    imported?: boolean;
    importBatchId?: boolean;
}, ExtArgs["result"]["stocktake"]>;
export type StocktakeSelectScalar = {
    id?: boolean;
    name?: boolean;
    countDate?: boolean;
    cutoffDate?: boolean;
    status?: boolean;
    stocktakeLead?: boolean;
    secondChecker?: boolean;
    notes?: boolean;
    createdBy?: boolean;
    finalisedBy?: boolean;
    finalisedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    imported?: boolean;
    importBatchId?: boolean;
};
export type StocktakeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "countDate" | "cutoffDate" | "status" | "stocktakeLead" | "secondChecker" | "notes" | "createdBy" | "finalisedBy" | "finalisedAt" | "createdAt" | "updatedAt" | "imported" | "importBatchId", ExtArgs["result"]["stocktake"]>;
export type StocktakeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | Prisma.Stocktake$linesArgs<ExtArgs>;
    discrepancies?: boolean | Prisma.Stocktake$discrepanciesArgs<ExtArgs>;
    bars?: boolean | Prisma.Stocktake$barsArgs<ExtArgs>;
    coins?: boolean | Prisma.Stocktake$coinsArgs<ExtArgs>;
    _count?: boolean | Prisma.StocktakeCountOutputTypeDefaultArgs<ExtArgs>;
};
export type StocktakeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type StocktakeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $StocktakePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Stocktake";
    objects: {
        lines: Prisma.$StocktakeLinePayload<ExtArgs>[];
        discrepancies: Prisma.$StocktakeDiscrepancyPayload<ExtArgs>[];
        bars: Prisma.$StocktakeBarPayload<ExtArgs>[];
        coins: Prisma.$StocktakeCoinPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        countDate: Date;
        cutoffDate: Date;
        status: $Enums.StocktakeStatus;
        stocktakeLead: string | null;
        secondChecker: string | null;
        notes: string | null;
        createdBy: string;
        finalisedBy: string | null;
        finalisedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        imported: boolean;
        importBatchId: number | null;
    }, ExtArgs["result"]["stocktake"]>;
    composites: {};
};
export type StocktakeGetPayload<S extends boolean | null | undefined | StocktakeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StocktakePayload, S>;
export type StocktakeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StocktakeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StocktakeCountAggregateInputType | true;
};
export interface StocktakeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Stocktake'];
        meta: {
            name: 'Stocktake';
        };
    };
    findUnique<T extends StocktakeFindUniqueArgs>(args: Prisma.SelectSubset<T, StocktakeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StocktakeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StocktakeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StocktakeFindFirstArgs>(args?: Prisma.SelectSubset<T, StocktakeFindFirstArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StocktakeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StocktakeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StocktakeFindManyArgs>(args?: Prisma.SelectSubset<T, StocktakeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StocktakeCreateArgs>(args: Prisma.SelectSubset<T, StocktakeCreateArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StocktakeCreateManyArgs>(args?: Prisma.SelectSubset<T, StocktakeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StocktakeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StocktakeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StocktakeDeleteArgs>(args: Prisma.SelectSubset<T, StocktakeDeleteArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StocktakeUpdateArgs>(args: Prisma.SelectSubset<T, StocktakeUpdateArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StocktakeDeleteManyArgs>(args?: Prisma.SelectSubset<T, StocktakeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StocktakeUpdateManyArgs>(args: Prisma.SelectSubset<T, StocktakeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StocktakeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StocktakeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StocktakeUpsertArgs>(args: Prisma.SelectSubset<T, StocktakeUpsertArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StocktakeCountArgs>(args?: Prisma.Subset<T, StocktakeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StocktakeCountAggregateOutputType> : number>;
    aggregate<T extends StocktakeAggregateArgs>(args: Prisma.Subset<T, StocktakeAggregateArgs>): Prisma.PrismaPromise<GetStocktakeAggregateType<T>>;
    groupBy<T extends StocktakeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StocktakeGroupByArgs['orderBy'];
    } : {
        orderBy?: StocktakeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StocktakeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStocktakeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StocktakeFieldRefs;
}
export interface Prisma__StocktakeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lines<T extends Prisma.Stocktake$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Stocktake$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    discrepancies<T extends Prisma.Stocktake$discrepanciesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Stocktake$discrepanciesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    bars<T extends Prisma.Stocktake$barsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Stocktake$barsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeBarPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    coins<T extends Prisma.Stocktake$coinsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Stocktake$coinsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeCoinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StocktakeFieldRefs {
    readonly id: Prisma.FieldRef<"Stocktake", 'Int'>;
    readonly name: Prisma.FieldRef<"Stocktake", 'String'>;
    readonly countDate: Prisma.FieldRef<"Stocktake", 'DateTime'>;
    readonly cutoffDate: Prisma.FieldRef<"Stocktake", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Stocktake", 'StocktakeStatus'>;
    readonly stocktakeLead: Prisma.FieldRef<"Stocktake", 'String'>;
    readonly secondChecker: Prisma.FieldRef<"Stocktake", 'String'>;
    readonly notes: Prisma.FieldRef<"Stocktake", 'String'>;
    readonly createdBy: Prisma.FieldRef<"Stocktake", 'String'>;
    readonly finalisedBy: Prisma.FieldRef<"Stocktake", 'String'>;
    readonly finalisedAt: Prisma.FieldRef<"Stocktake", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Stocktake", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Stocktake", 'DateTime'>;
    readonly imported: Prisma.FieldRef<"Stocktake", 'Boolean'>;
    readonly importBatchId: Prisma.FieldRef<"Stocktake", 'Int'>;
}
export type StocktakeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
    where: Prisma.StocktakeWhereUniqueInput;
};
export type StocktakeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
    where: Prisma.StocktakeWhereUniqueInput;
};
export type StocktakeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
    where?: Prisma.StocktakeWhereInput;
    orderBy?: Prisma.StocktakeOrderByWithRelationInput | Prisma.StocktakeOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeScalarFieldEnum | Prisma.StocktakeScalarFieldEnum[];
};
export type StocktakeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
    where?: Prisma.StocktakeWhereInput;
    orderBy?: Prisma.StocktakeOrderByWithRelationInput | Prisma.StocktakeOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeScalarFieldEnum | Prisma.StocktakeScalarFieldEnum[];
};
export type StocktakeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
    where?: Prisma.StocktakeWhereInput;
    orderBy?: Prisma.StocktakeOrderByWithRelationInput | Prisma.StocktakeOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeScalarFieldEnum | Prisma.StocktakeScalarFieldEnum[];
};
export type StocktakeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeCreateInput, Prisma.StocktakeUncheckedCreateInput>;
};
export type StocktakeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StocktakeCreateManyInput | Prisma.StocktakeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StocktakeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    data: Prisma.StocktakeCreateManyInput | Prisma.StocktakeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StocktakeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeUpdateInput, Prisma.StocktakeUncheckedUpdateInput>;
    where: Prisma.StocktakeWhereUniqueInput;
};
export type StocktakeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StocktakeUpdateManyMutationInput, Prisma.StocktakeUncheckedUpdateManyInput>;
    where?: Prisma.StocktakeWhereInput;
    limit?: number;
};
export type StocktakeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeUpdateManyMutationInput, Prisma.StocktakeUncheckedUpdateManyInput>;
    where?: Prisma.StocktakeWhereInput;
    limit?: number;
};
export type StocktakeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
    where: Prisma.StocktakeWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeCreateInput, Prisma.StocktakeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StocktakeUpdateInput, Prisma.StocktakeUncheckedUpdateInput>;
};
export type StocktakeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
    where: Prisma.StocktakeWhereUniqueInput;
};
export type StocktakeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeWhereInput;
    limit?: number;
};
export type Stocktake$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeLineSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeLineOmit<ExtArgs> | null;
    include?: Prisma.StocktakeLineInclude<ExtArgs> | null;
    where?: Prisma.StocktakeLineWhereInput;
    orderBy?: Prisma.StocktakeLineOrderByWithRelationInput | Prisma.StocktakeLineOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeLineScalarFieldEnum | Prisma.StocktakeLineScalarFieldEnum[];
};
export type Stocktake$discrepanciesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    where?: Prisma.StocktakeDiscrepancyWhereInput;
    orderBy?: Prisma.StocktakeDiscrepancyOrderByWithRelationInput | Prisma.StocktakeDiscrepancyOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeDiscrepancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeDiscrepancyScalarFieldEnum | Prisma.StocktakeDiscrepancyScalarFieldEnum[];
};
export type Stocktake$barsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Stocktake$coinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StocktakeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeSelect<ExtArgs> | null;
    omit?: Prisma.StocktakeOmit<ExtArgs> | null;
    include?: Prisma.StocktakeInclude<ExtArgs> | null;
};
//# sourceMappingURL=Stocktake.d.ts.map