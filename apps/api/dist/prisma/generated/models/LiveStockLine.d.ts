import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type LiveStockLineModel = runtime.Types.Result.DefaultSelection<Prisma.$LiveStockLinePayload>;
export type AggregateLiveStockLine = {
    _count: LiveStockLineCountAggregateOutputType | null;
    _avg: LiveStockLineAvgAggregateOutputType | null;
    _sum: LiveStockLineSumAggregateOutputType | null;
    _min: LiveStockLineMinAggregateOutputType | null;
    _max: LiveStockLineMaxAggregateOutputType | null;
};
export type LiveStockLineAvgAggregateOutputType = {
    id: number | null;
    qty: number | null;
    lowThreshold: number | null;
    unassigned: number | null;
};
export type LiveStockLineSumAggregateOutputType = {
    id: number | null;
    qty: number | null;
    lowThreshold: number | null;
    unassigned: number | null;
};
export type LiveStockLineMinAggregateOutputType = {
    id: number | null;
    branchCode: string | null;
    metal: $Enums.StockMetal | null;
    kind: $Enums.LiveStockKind | null;
    family: string | null;
    variant: string | null;
    refinery: string | null;
    qty: number | null;
    lowThreshold: number | null;
    unassigned: number | null;
    details: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LiveStockLineMaxAggregateOutputType = {
    id: number | null;
    branchCode: string | null;
    metal: $Enums.StockMetal | null;
    kind: $Enums.LiveStockKind | null;
    family: string | null;
    variant: string | null;
    refinery: string | null;
    qty: number | null;
    lowThreshold: number | null;
    unassigned: number | null;
    details: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LiveStockLineCountAggregateOutputType = {
    id: number;
    branchCode: number;
    metal: number;
    kind: number;
    family: number;
    variant: number;
    refinery: number;
    qty: number;
    lowThreshold: number;
    unassigned: number;
    details: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type LiveStockLineAvgAggregateInputType = {
    id?: true;
    qty?: true;
    lowThreshold?: true;
    unassigned?: true;
};
export type LiveStockLineSumAggregateInputType = {
    id?: true;
    qty?: true;
    lowThreshold?: true;
    unassigned?: true;
};
export type LiveStockLineMinAggregateInputType = {
    id?: true;
    branchCode?: true;
    metal?: true;
    kind?: true;
    family?: true;
    variant?: true;
    refinery?: true;
    qty?: true;
    lowThreshold?: true;
    unassigned?: true;
    details?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LiveStockLineMaxAggregateInputType = {
    id?: true;
    branchCode?: true;
    metal?: true;
    kind?: true;
    family?: true;
    variant?: true;
    refinery?: true;
    qty?: true;
    lowThreshold?: true;
    unassigned?: true;
    details?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LiveStockLineCountAggregateInputType = {
    id?: true;
    branchCode?: true;
    metal?: true;
    kind?: true;
    family?: true;
    variant?: true;
    refinery?: true;
    qty?: true;
    lowThreshold?: true;
    unassigned?: true;
    details?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type LiveStockLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockLineWhereInput;
    orderBy?: Prisma.LiveStockLineOrderByWithRelationInput | Prisma.LiveStockLineOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LiveStockLineCountAggregateInputType;
    _avg?: LiveStockLineAvgAggregateInputType;
    _sum?: LiveStockLineSumAggregateInputType;
    _min?: LiveStockLineMinAggregateInputType;
    _max?: LiveStockLineMaxAggregateInputType;
};
export type GetLiveStockLineAggregateType<T extends LiveStockLineAggregateArgs> = {
    [P in keyof T & keyof AggregateLiveStockLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLiveStockLine[P]> : Prisma.GetScalarType<T[P], AggregateLiveStockLine[P]>;
};
export type LiveStockLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockLineWhereInput;
    orderBy?: Prisma.LiveStockLineOrderByWithAggregationInput | Prisma.LiveStockLineOrderByWithAggregationInput[];
    by: Prisma.LiveStockLineScalarFieldEnum[] | Prisma.LiveStockLineScalarFieldEnum;
    having?: Prisma.LiveStockLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LiveStockLineCountAggregateInputType | true;
    _avg?: LiveStockLineAvgAggregateInputType;
    _sum?: LiveStockLineSumAggregateInputType;
    _min?: LiveStockLineMinAggregateInputType;
    _max?: LiveStockLineMaxAggregateInputType;
};
export type LiveStockLineGroupByOutputType = {
    id: number;
    branchCode: string;
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery: string;
    qty: number;
    lowThreshold: number | null;
    unassigned: number;
    details: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: LiveStockLineCountAggregateOutputType | null;
    _avg: LiveStockLineAvgAggregateOutputType | null;
    _sum: LiveStockLineSumAggregateOutputType | null;
    _min: LiveStockLineMinAggregateOutputType | null;
    _max: LiveStockLineMaxAggregateOutputType | null;
};
export type GetLiveStockLineGroupByPayload<T extends LiveStockLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LiveStockLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LiveStockLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LiveStockLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LiveStockLineGroupByOutputType[P]>;
}>>;
export type LiveStockLineWhereInput = {
    AND?: Prisma.LiveStockLineWhereInput | Prisma.LiveStockLineWhereInput[];
    OR?: Prisma.LiveStockLineWhereInput[];
    NOT?: Prisma.LiveStockLineWhereInput | Prisma.LiveStockLineWhereInput[];
    id?: Prisma.IntFilter<"LiveStockLine"> | number;
    branchCode?: Prisma.StringFilter<"LiveStockLine"> | string;
    metal?: Prisma.EnumStockMetalFilter<"LiveStockLine"> | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFilter<"LiveStockLine"> | $Enums.LiveStockKind;
    family?: Prisma.StringFilter<"LiveStockLine"> | string;
    variant?: Prisma.StringFilter<"LiveStockLine"> | string;
    refinery?: Prisma.StringFilter<"LiveStockLine"> | string;
    qty?: Prisma.IntFilter<"LiveStockLine"> | number;
    lowThreshold?: Prisma.IntNullableFilter<"LiveStockLine"> | number | null;
    unassigned?: Prisma.IntFilter<"LiveStockLine"> | number;
    details?: Prisma.StringNullableFilter<"LiveStockLine"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LiveStockLine"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LiveStockLine"> | Date | string;
    branch?: Prisma.XOR<Prisma.LiveStockBranchScalarRelationFilter, Prisma.LiveStockBranchWhereInput>;
    bars?: Prisma.LiveStockBarListRelationFilter;
    movements?: Prisma.LiveStockMovementListRelationFilter;
};
export type LiveStockLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    family?: Prisma.SortOrder;
    variant?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    lowThreshold?: Prisma.SortOrderInput | Prisma.SortOrder;
    unassigned?: Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    branch?: Prisma.LiveStockBranchOrderByWithRelationInput;
    bars?: Prisma.LiveStockBarOrderByRelationAggregateInput;
    movements?: Prisma.LiveStockMovementOrderByRelationAggregateInput;
};
export type LiveStockLineWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    branchCode_metal_kind_family_variant_refinery?: Prisma.LiveStockLineBranchCodeMetalKindFamilyVariantRefineryCompoundUniqueInput;
    AND?: Prisma.LiveStockLineWhereInput | Prisma.LiveStockLineWhereInput[];
    OR?: Prisma.LiveStockLineWhereInput[];
    NOT?: Prisma.LiveStockLineWhereInput | Prisma.LiveStockLineWhereInput[];
    branchCode?: Prisma.StringFilter<"LiveStockLine"> | string;
    metal?: Prisma.EnumStockMetalFilter<"LiveStockLine"> | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFilter<"LiveStockLine"> | $Enums.LiveStockKind;
    family?: Prisma.StringFilter<"LiveStockLine"> | string;
    variant?: Prisma.StringFilter<"LiveStockLine"> | string;
    refinery?: Prisma.StringFilter<"LiveStockLine"> | string;
    qty?: Prisma.IntFilter<"LiveStockLine"> | number;
    lowThreshold?: Prisma.IntNullableFilter<"LiveStockLine"> | number | null;
    unassigned?: Prisma.IntFilter<"LiveStockLine"> | number;
    details?: Prisma.StringNullableFilter<"LiveStockLine"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LiveStockLine"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LiveStockLine"> | Date | string;
    branch?: Prisma.XOR<Prisma.LiveStockBranchScalarRelationFilter, Prisma.LiveStockBranchWhereInput>;
    bars?: Prisma.LiveStockBarListRelationFilter;
    movements?: Prisma.LiveStockMovementListRelationFilter;
}, "id" | "branchCode_metal_kind_family_variant_refinery">;
export type LiveStockLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    family?: Prisma.SortOrder;
    variant?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    lowThreshold?: Prisma.SortOrderInput | Prisma.SortOrder;
    unassigned?: Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.LiveStockLineCountOrderByAggregateInput;
    _avg?: Prisma.LiveStockLineAvgOrderByAggregateInput;
    _max?: Prisma.LiveStockLineMaxOrderByAggregateInput;
    _min?: Prisma.LiveStockLineMinOrderByAggregateInput;
    _sum?: Prisma.LiveStockLineSumOrderByAggregateInput;
};
export type LiveStockLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.LiveStockLineScalarWhereWithAggregatesInput | Prisma.LiveStockLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.LiveStockLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LiveStockLineScalarWhereWithAggregatesInput | Prisma.LiveStockLineScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"LiveStockLine"> | number;
    branchCode?: Prisma.StringWithAggregatesFilter<"LiveStockLine"> | string;
    metal?: Prisma.EnumStockMetalWithAggregatesFilter<"LiveStockLine"> | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindWithAggregatesFilter<"LiveStockLine"> | $Enums.LiveStockKind;
    family?: Prisma.StringWithAggregatesFilter<"LiveStockLine"> | string;
    variant?: Prisma.StringWithAggregatesFilter<"LiveStockLine"> | string;
    refinery?: Prisma.StringWithAggregatesFilter<"LiveStockLine"> | string;
    qty?: Prisma.IntWithAggregatesFilter<"LiveStockLine"> | number;
    lowThreshold?: Prisma.IntNullableWithAggregatesFilter<"LiveStockLine"> | number | null;
    unassigned?: Prisma.IntWithAggregatesFilter<"LiveStockLine"> | number;
    details?: Prisma.StringNullableWithAggregatesFilter<"LiveStockLine"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LiveStockLine"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LiveStockLine"> | Date | string;
};
export type LiveStockLineCreateInput = {
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    branch: Prisma.LiveStockBranchCreateNestedOneWithoutLinesInput;
    bars?: Prisma.LiveStockBarCreateNestedManyWithoutLineInput;
    movements?: Prisma.LiveStockMovementCreateNestedManyWithoutLineInput;
};
export type LiveStockLineUncheckedCreateInput = {
    id?: number;
    branchCode: string;
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bars?: Prisma.LiveStockBarUncheckedCreateNestedManyWithoutLineInput;
    movements?: Prisma.LiveStockMovementUncheckedCreateNestedManyWithoutLineInput;
};
export type LiveStockLineUpdateInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.LiveStockBranchUpdateOneRequiredWithoutLinesNestedInput;
    bars?: Prisma.LiveStockBarUpdateManyWithoutLineNestedInput;
    movements?: Prisma.LiveStockMovementUpdateManyWithoutLineNestedInput;
};
export type LiveStockLineUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    branchCode?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bars?: Prisma.LiveStockBarUncheckedUpdateManyWithoutLineNestedInput;
    movements?: Prisma.LiveStockMovementUncheckedUpdateManyWithoutLineNestedInput;
};
export type LiveStockLineCreateManyInput = {
    id?: number;
    branchCode: string;
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LiveStockLineUpdateManyMutationInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockLineUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    branchCode?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockLineListRelationFilter = {
    every?: Prisma.LiveStockLineWhereInput;
    some?: Prisma.LiveStockLineWhereInput;
    none?: Prisma.LiveStockLineWhereInput;
};
export type LiveStockLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LiveStockLineBranchCodeMetalKindFamilyVariantRefineryCompoundUniqueInput = {
    branchCode: string;
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery: string;
};
export type LiveStockLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    family?: Prisma.SortOrder;
    variant?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    lowThreshold?: Prisma.SortOrder;
    unassigned?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LiveStockLineAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    lowThreshold?: Prisma.SortOrder;
    unassigned?: Prisma.SortOrder;
};
export type LiveStockLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    family?: Prisma.SortOrder;
    variant?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    lowThreshold?: Prisma.SortOrder;
    unassigned?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LiveStockLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    family?: Prisma.SortOrder;
    variant?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    lowThreshold?: Prisma.SortOrder;
    unassigned?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LiveStockLineSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    lowThreshold?: Prisma.SortOrder;
    unassigned?: Prisma.SortOrder;
};
export type LiveStockLineScalarRelationFilter = {
    is?: Prisma.LiveStockLineWhereInput;
    isNot?: Prisma.LiveStockLineWhereInput;
};
export type LiveStockLineCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBranchInput, Prisma.LiveStockLineUncheckedCreateWithoutBranchInput> | Prisma.LiveStockLineCreateWithoutBranchInput[] | Prisma.LiveStockLineUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.LiveStockLineCreateOrConnectWithoutBranchInput | Prisma.LiveStockLineCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.LiveStockLineCreateManyBranchInputEnvelope;
    connect?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
};
export type LiveStockLineUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBranchInput, Prisma.LiveStockLineUncheckedCreateWithoutBranchInput> | Prisma.LiveStockLineCreateWithoutBranchInput[] | Prisma.LiveStockLineUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.LiveStockLineCreateOrConnectWithoutBranchInput | Prisma.LiveStockLineCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.LiveStockLineCreateManyBranchInputEnvelope;
    connect?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
};
export type LiveStockLineUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBranchInput, Prisma.LiveStockLineUncheckedCreateWithoutBranchInput> | Prisma.LiveStockLineCreateWithoutBranchInput[] | Prisma.LiveStockLineUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.LiveStockLineCreateOrConnectWithoutBranchInput | Prisma.LiveStockLineCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.LiveStockLineUpsertWithWhereUniqueWithoutBranchInput | Prisma.LiveStockLineUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.LiveStockLineCreateManyBranchInputEnvelope;
    set?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
    disconnect?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
    delete?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
    connect?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
    update?: Prisma.LiveStockLineUpdateWithWhereUniqueWithoutBranchInput | Prisma.LiveStockLineUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.LiveStockLineUpdateManyWithWhereWithoutBranchInput | Prisma.LiveStockLineUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.LiveStockLineScalarWhereInput | Prisma.LiveStockLineScalarWhereInput[];
};
export type LiveStockLineUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBranchInput, Prisma.LiveStockLineUncheckedCreateWithoutBranchInput> | Prisma.LiveStockLineCreateWithoutBranchInput[] | Prisma.LiveStockLineUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.LiveStockLineCreateOrConnectWithoutBranchInput | Prisma.LiveStockLineCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.LiveStockLineUpsertWithWhereUniqueWithoutBranchInput | Prisma.LiveStockLineUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.LiveStockLineCreateManyBranchInputEnvelope;
    set?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
    disconnect?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
    delete?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
    connect?: Prisma.LiveStockLineWhereUniqueInput | Prisma.LiveStockLineWhereUniqueInput[];
    update?: Prisma.LiveStockLineUpdateWithWhereUniqueWithoutBranchInput | Prisma.LiveStockLineUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.LiveStockLineUpdateManyWithWhereWithoutBranchInput | Prisma.LiveStockLineUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.LiveStockLineScalarWhereInput | Prisma.LiveStockLineScalarWhereInput[];
};
export type EnumLiveStockKindFieldUpdateOperationsInput = {
    set?: $Enums.LiveStockKind;
};
export type LiveStockLineCreateNestedOneWithoutBarsInput = {
    create?: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBarsInput, Prisma.LiveStockLineUncheckedCreateWithoutBarsInput>;
    connectOrCreate?: Prisma.LiveStockLineCreateOrConnectWithoutBarsInput;
    connect?: Prisma.LiveStockLineWhereUniqueInput;
};
export type LiveStockLineUpdateOneRequiredWithoutBarsNestedInput = {
    create?: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBarsInput, Prisma.LiveStockLineUncheckedCreateWithoutBarsInput>;
    connectOrCreate?: Prisma.LiveStockLineCreateOrConnectWithoutBarsInput;
    upsert?: Prisma.LiveStockLineUpsertWithoutBarsInput;
    connect?: Prisma.LiveStockLineWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LiveStockLineUpdateToOneWithWhereWithoutBarsInput, Prisma.LiveStockLineUpdateWithoutBarsInput>, Prisma.LiveStockLineUncheckedUpdateWithoutBarsInput>;
};
export type LiveStockLineCreateNestedOneWithoutMovementsInput = {
    create?: Prisma.XOR<Prisma.LiveStockLineCreateWithoutMovementsInput, Prisma.LiveStockLineUncheckedCreateWithoutMovementsInput>;
    connectOrCreate?: Prisma.LiveStockLineCreateOrConnectWithoutMovementsInput;
    connect?: Prisma.LiveStockLineWhereUniqueInput;
};
export type LiveStockLineUpdateOneRequiredWithoutMovementsNestedInput = {
    create?: Prisma.XOR<Prisma.LiveStockLineCreateWithoutMovementsInput, Prisma.LiveStockLineUncheckedCreateWithoutMovementsInput>;
    connectOrCreate?: Prisma.LiveStockLineCreateOrConnectWithoutMovementsInput;
    upsert?: Prisma.LiveStockLineUpsertWithoutMovementsInput;
    connect?: Prisma.LiveStockLineWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LiveStockLineUpdateToOneWithWhereWithoutMovementsInput, Prisma.LiveStockLineUpdateWithoutMovementsInput>, Prisma.LiveStockLineUncheckedUpdateWithoutMovementsInput>;
};
export type LiveStockLineCreateWithoutBranchInput = {
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bars?: Prisma.LiveStockBarCreateNestedManyWithoutLineInput;
    movements?: Prisma.LiveStockMovementCreateNestedManyWithoutLineInput;
};
export type LiveStockLineUncheckedCreateWithoutBranchInput = {
    id?: number;
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bars?: Prisma.LiveStockBarUncheckedCreateNestedManyWithoutLineInput;
    movements?: Prisma.LiveStockMovementUncheckedCreateNestedManyWithoutLineInput;
};
export type LiveStockLineCreateOrConnectWithoutBranchInput = {
    where: Prisma.LiveStockLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBranchInput, Prisma.LiveStockLineUncheckedCreateWithoutBranchInput>;
};
export type LiveStockLineCreateManyBranchInputEnvelope = {
    data: Prisma.LiveStockLineCreateManyBranchInput | Prisma.LiveStockLineCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type LiveStockLineUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.LiveStockLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.LiveStockLineUpdateWithoutBranchInput, Prisma.LiveStockLineUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBranchInput, Prisma.LiveStockLineUncheckedCreateWithoutBranchInput>;
};
export type LiveStockLineUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.LiveStockLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.LiveStockLineUpdateWithoutBranchInput, Prisma.LiveStockLineUncheckedUpdateWithoutBranchInput>;
};
export type LiveStockLineUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.LiveStockLineScalarWhereInput;
    data: Prisma.XOR<Prisma.LiveStockLineUpdateManyMutationInput, Prisma.LiveStockLineUncheckedUpdateManyWithoutBranchInput>;
};
export type LiveStockLineScalarWhereInput = {
    AND?: Prisma.LiveStockLineScalarWhereInput | Prisma.LiveStockLineScalarWhereInput[];
    OR?: Prisma.LiveStockLineScalarWhereInput[];
    NOT?: Prisma.LiveStockLineScalarWhereInput | Prisma.LiveStockLineScalarWhereInput[];
    id?: Prisma.IntFilter<"LiveStockLine"> | number;
    branchCode?: Prisma.StringFilter<"LiveStockLine"> | string;
    metal?: Prisma.EnumStockMetalFilter<"LiveStockLine"> | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFilter<"LiveStockLine"> | $Enums.LiveStockKind;
    family?: Prisma.StringFilter<"LiveStockLine"> | string;
    variant?: Prisma.StringFilter<"LiveStockLine"> | string;
    refinery?: Prisma.StringFilter<"LiveStockLine"> | string;
    qty?: Prisma.IntFilter<"LiveStockLine"> | number;
    lowThreshold?: Prisma.IntNullableFilter<"LiveStockLine"> | number | null;
    unassigned?: Prisma.IntFilter<"LiveStockLine"> | number;
    details?: Prisma.StringNullableFilter<"LiveStockLine"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LiveStockLine"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LiveStockLine"> | Date | string;
};
export type LiveStockLineCreateWithoutBarsInput = {
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    branch: Prisma.LiveStockBranchCreateNestedOneWithoutLinesInput;
    movements?: Prisma.LiveStockMovementCreateNestedManyWithoutLineInput;
};
export type LiveStockLineUncheckedCreateWithoutBarsInput = {
    id?: number;
    branchCode: string;
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movements?: Prisma.LiveStockMovementUncheckedCreateNestedManyWithoutLineInput;
};
export type LiveStockLineCreateOrConnectWithoutBarsInput = {
    where: Prisma.LiveStockLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBarsInput, Prisma.LiveStockLineUncheckedCreateWithoutBarsInput>;
};
export type LiveStockLineUpsertWithoutBarsInput = {
    update: Prisma.XOR<Prisma.LiveStockLineUpdateWithoutBarsInput, Prisma.LiveStockLineUncheckedUpdateWithoutBarsInput>;
    create: Prisma.XOR<Prisma.LiveStockLineCreateWithoutBarsInput, Prisma.LiveStockLineUncheckedCreateWithoutBarsInput>;
    where?: Prisma.LiveStockLineWhereInput;
};
export type LiveStockLineUpdateToOneWithWhereWithoutBarsInput = {
    where?: Prisma.LiveStockLineWhereInput;
    data: Prisma.XOR<Prisma.LiveStockLineUpdateWithoutBarsInput, Prisma.LiveStockLineUncheckedUpdateWithoutBarsInput>;
};
export type LiveStockLineUpdateWithoutBarsInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.LiveStockBranchUpdateOneRequiredWithoutLinesNestedInput;
    movements?: Prisma.LiveStockMovementUpdateManyWithoutLineNestedInput;
};
export type LiveStockLineUncheckedUpdateWithoutBarsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    branchCode?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movements?: Prisma.LiveStockMovementUncheckedUpdateManyWithoutLineNestedInput;
};
export type LiveStockLineCreateWithoutMovementsInput = {
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    branch: Prisma.LiveStockBranchCreateNestedOneWithoutLinesInput;
    bars?: Prisma.LiveStockBarCreateNestedManyWithoutLineInput;
};
export type LiveStockLineUncheckedCreateWithoutMovementsInput = {
    id?: number;
    branchCode: string;
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bars?: Prisma.LiveStockBarUncheckedCreateNestedManyWithoutLineInput;
};
export type LiveStockLineCreateOrConnectWithoutMovementsInput = {
    where: Prisma.LiveStockLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockLineCreateWithoutMovementsInput, Prisma.LiveStockLineUncheckedCreateWithoutMovementsInput>;
};
export type LiveStockLineUpsertWithoutMovementsInput = {
    update: Prisma.XOR<Prisma.LiveStockLineUpdateWithoutMovementsInput, Prisma.LiveStockLineUncheckedUpdateWithoutMovementsInput>;
    create: Prisma.XOR<Prisma.LiveStockLineCreateWithoutMovementsInput, Prisma.LiveStockLineUncheckedCreateWithoutMovementsInput>;
    where?: Prisma.LiveStockLineWhereInput;
};
export type LiveStockLineUpdateToOneWithWhereWithoutMovementsInput = {
    where?: Prisma.LiveStockLineWhereInput;
    data: Prisma.XOR<Prisma.LiveStockLineUpdateWithoutMovementsInput, Prisma.LiveStockLineUncheckedUpdateWithoutMovementsInput>;
};
export type LiveStockLineUpdateWithoutMovementsInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.LiveStockBranchUpdateOneRequiredWithoutLinesNestedInput;
    bars?: Prisma.LiveStockBarUpdateManyWithoutLineNestedInput;
};
export type LiveStockLineUncheckedUpdateWithoutMovementsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    branchCode?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bars?: Prisma.LiveStockBarUncheckedUpdateManyWithoutLineNestedInput;
};
export type LiveStockLineCreateManyBranchInput = {
    id?: number;
    metal: $Enums.StockMetal;
    kind: $Enums.LiveStockKind;
    family: string;
    variant: string;
    refinery?: string;
    qty?: number;
    lowThreshold?: number | null;
    unassigned?: number;
    details?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LiveStockLineUpdateWithoutBranchInput = {
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bars?: Prisma.LiveStockBarUpdateManyWithoutLineNestedInput;
    movements?: Prisma.LiveStockMovementUpdateManyWithoutLineNestedInput;
};
export type LiveStockLineUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bars?: Prisma.LiveStockBarUncheckedUpdateManyWithoutLineNestedInput;
    movements?: Prisma.LiveStockMovementUncheckedUpdateManyWithoutLineNestedInput;
};
export type LiveStockLineUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    kind?: Prisma.EnumLiveStockKindFieldUpdateOperationsInput | $Enums.LiveStockKind;
    family?: Prisma.StringFieldUpdateOperationsInput | string;
    variant?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    lowThreshold?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    unassigned?: Prisma.IntFieldUpdateOperationsInput | number;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockLineCountOutputType = {
    bars: number;
    movements: number;
};
export type LiveStockLineCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bars?: boolean | LiveStockLineCountOutputTypeCountBarsArgs;
    movements?: boolean | LiveStockLineCountOutputTypeCountMovementsArgs;
};
export type LiveStockLineCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineCountOutputTypeSelect<ExtArgs> | null;
};
export type LiveStockLineCountOutputTypeCountBarsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockBarWhereInput;
};
export type LiveStockLineCountOutputTypeCountMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockMovementWhereInput;
};
export type LiveStockLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    branchCode?: boolean;
    metal?: boolean;
    kind?: boolean;
    family?: boolean;
    variant?: boolean;
    refinery?: boolean;
    qty?: boolean;
    lowThreshold?: boolean;
    unassigned?: boolean;
    details?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.LiveStockBranchDefaultArgs<ExtArgs>;
    bars?: boolean | Prisma.LiveStockLine$barsArgs<ExtArgs>;
    movements?: boolean | Prisma.LiveStockLine$movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.LiveStockLineCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockLine"]>;
export type LiveStockLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    branchCode?: boolean;
    metal?: boolean;
    kind?: boolean;
    family?: boolean;
    variant?: boolean;
    refinery?: boolean;
    qty?: boolean;
    lowThreshold?: boolean;
    unassigned?: boolean;
    details?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.LiveStockBranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockLine"]>;
export type LiveStockLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    branchCode?: boolean;
    metal?: boolean;
    kind?: boolean;
    family?: boolean;
    variant?: boolean;
    refinery?: boolean;
    qty?: boolean;
    lowThreshold?: boolean;
    unassigned?: boolean;
    details?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.LiveStockBranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockLine"]>;
export type LiveStockLineSelectScalar = {
    id?: boolean;
    branchCode?: boolean;
    metal?: boolean;
    kind?: boolean;
    family?: boolean;
    variant?: boolean;
    refinery?: boolean;
    qty?: boolean;
    lowThreshold?: boolean;
    unassigned?: boolean;
    details?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type LiveStockLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "branchCode" | "metal" | "kind" | "family" | "variant" | "refinery" | "qty" | "lowThreshold" | "unassigned" | "details" | "createdAt" | "updatedAt", ExtArgs["result"]["liveStockLine"]>;
export type LiveStockLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.LiveStockBranchDefaultArgs<ExtArgs>;
    bars?: boolean | Prisma.LiveStockLine$barsArgs<ExtArgs>;
    movements?: boolean | Prisma.LiveStockLine$movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.LiveStockLineCountOutputTypeDefaultArgs<ExtArgs>;
};
export type LiveStockLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.LiveStockBranchDefaultArgs<ExtArgs>;
};
export type LiveStockLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.LiveStockBranchDefaultArgs<ExtArgs>;
};
export type $LiveStockLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LiveStockLine";
    objects: {
        branch: Prisma.$LiveStockBranchPayload<ExtArgs>;
        bars: Prisma.$LiveStockBarPayload<ExtArgs>[];
        movements: Prisma.$LiveStockMovementPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        branchCode: string;
        metal: $Enums.StockMetal;
        kind: $Enums.LiveStockKind;
        family: string;
        variant: string;
        refinery: string;
        qty: number;
        lowThreshold: number | null;
        unassigned: number;
        details: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["liveStockLine"]>;
    composites: {};
};
export type LiveStockLineGetPayload<S extends boolean | null | undefined | LiveStockLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload, S>;
export type LiveStockLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LiveStockLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LiveStockLineCountAggregateInputType | true;
};
export interface LiveStockLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LiveStockLine'];
        meta: {
            name: 'LiveStockLine';
        };
    };
    findUnique<T extends LiveStockLineFindUniqueArgs>(args: Prisma.SelectSubset<T, LiveStockLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LiveStockLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LiveStockLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LiveStockLineFindFirstArgs>(args?: Prisma.SelectSubset<T, LiveStockLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LiveStockLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LiveStockLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LiveStockLineFindManyArgs>(args?: Prisma.SelectSubset<T, LiveStockLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LiveStockLineCreateArgs>(args: Prisma.SelectSubset<T, LiveStockLineCreateArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LiveStockLineCreateManyArgs>(args?: Prisma.SelectSubset<T, LiveStockLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LiveStockLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LiveStockLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LiveStockLineDeleteArgs>(args: Prisma.SelectSubset<T, LiveStockLineDeleteArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LiveStockLineUpdateArgs>(args: Prisma.SelectSubset<T, LiveStockLineUpdateArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LiveStockLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, LiveStockLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LiveStockLineUpdateManyArgs>(args: Prisma.SelectSubset<T, LiveStockLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LiveStockLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LiveStockLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LiveStockLineUpsertArgs>(args: Prisma.SelectSubset<T, LiveStockLineUpsertArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LiveStockLineCountArgs>(args?: Prisma.Subset<T, LiveStockLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LiveStockLineCountAggregateOutputType> : number>;
    aggregate<T extends LiveStockLineAggregateArgs>(args: Prisma.Subset<T, LiveStockLineAggregateArgs>): Prisma.PrismaPromise<GetLiveStockLineAggregateType<T>>;
    groupBy<T extends LiveStockLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LiveStockLineGroupByArgs['orderBy'];
    } : {
        orderBy?: LiveStockLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LiveStockLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLiveStockLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LiveStockLineFieldRefs;
}
export interface Prisma__LiveStockLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    branch<T extends Prisma.LiveStockBranchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LiveStockBranchDefaultArgs<ExtArgs>>): Prisma.Prisma__LiveStockBranchClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    bars<T extends Prisma.LiveStockLine$barsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LiveStockLine$barsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    movements<T extends Prisma.LiveStockLine$movementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LiveStockLine$movementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LiveStockLineFieldRefs {
    readonly id: Prisma.FieldRef<"LiveStockLine", 'Int'>;
    readonly branchCode: Prisma.FieldRef<"LiveStockLine", 'String'>;
    readonly metal: Prisma.FieldRef<"LiveStockLine", 'StockMetal'>;
    readonly kind: Prisma.FieldRef<"LiveStockLine", 'LiveStockKind'>;
    readonly family: Prisma.FieldRef<"LiveStockLine", 'String'>;
    readonly variant: Prisma.FieldRef<"LiveStockLine", 'String'>;
    readonly refinery: Prisma.FieldRef<"LiveStockLine", 'String'>;
    readonly qty: Prisma.FieldRef<"LiveStockLine", 'Int'>;
    readonly lowThreshold: Prisma.FieldRef<"LiveStockLine", 'Int'>;
    readonly unassigned: Prisma.FieldRef<"LiveStockLine", 'Int'>;
    readonly details: Prisma.FieldRef<"LiveStockLine", 'String'>;
    readonly createdAt: Prisma.FieldRef<"LiveStockLine", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"LiveStockLine", 'DateTime'>;
}
export type LiveStockLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    include?: Prisma.LiveStockLineInclude<ExtArgs> | null;
    where: Prisma.LiveStockLineWhereUniqueInput;
};
export type LiveStockLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    include?: Prisma.LiveStockLineInclude<ExtArgs> | null;
    where: Prisma.LiveStockLineWhereUniqueInput;
};
export type LiveStockLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveStockLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveStockLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveStockLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    include?: Prisma.LiveStockLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockLineCreateInput, Prisma.LiveStockLineUncheckedCreateInput>;
};
export type LiveStockLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LiveStockLineCreateManyInput | Prisma.LiveStockLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LiveStockLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    data: Prisma.LiveStockLineCreateManyInput | Prisma.LiveStockLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LiveStockLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LiveStockLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    include?: Prisma.LiveStockLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockLineUpdateInput, Prisma.LiveStockLineUncheckedUpdateInput>;
    where: Prisma.LiveStockLineWhereUniqueInput;
};
export type LiveStockLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LiveStockLineUpdateManyMutationInput, Prisma.LiveStockLineUncheckedUpdateManyInput>;
    where?: Prisma.LiveStockLineWhereInput;
    limit?: number;
};
export type LiveStockLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockLineUpdateManyMutationInput, Prisma.LiveStockLineUncheckedUpdateManyInput>;
    where?: Prisma.LiveStockLineWhereInput;
    limit?: number;
    include?: Prisma.LiveStockLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LiveStockLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    include?: Prisma.LiveStockLineInclude<ExtArgs> | null;
    where: Prisma.LiveStockLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockLineCreateInput, Prisma.LiveStockLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LiveStockLineUpdateInput, Prisma.LiveStockLineUncheckedUpdateInput>;
};
export type LiveStockLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    include?: Prisma.LiveStockLineInclude<ExtArgs> | null;
    where: Prisma.LiveStockLineWhereUniqueInput;
};
export type LiveStockLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockLineWhereInput;
    limit?: number;
};
export type LiveStockLine$barsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBarInclude<ExtArgs> | null;
    where?: Prisma.LiveStockBarWhereInput;
    orderBy?: Prisma.LiveStockBarOrderByWithRelationInput | Prisma.LiveStockBarOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockBarWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveStockBarScalarFieldEnum | Prisma.LiveStockBarScalarFieldEnum[];
};
export type LiveStockLine$movementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    include?: Prisma.LiveStockMovementInclude<ExtArgs> | null;
    where?: Prisma.LiveStockMovementWhereInput;
    orderBy?: Prisma.LiveStockMovementOrderByWithRelationInput | Prisma.LiveStockMovementOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveStockMovementScalarFieldEnum | Prisma.LiveStockMovementScalarFieldEnum[];
};
export type LiveStockLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockLineSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockLineOmit<ExtArgs> | null;
    include?: Prisma.LiveStockLineInclude<ExtArgs> | null;
};
//# sourceMappingURL=LiveStockLine.d.ts.map