import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type LineSerialModel = runtime.Types.Result.DefaultSelection<Prisma.$LineSerialPayload>;
export type AggregateLineSerial = {
    _count: LineSerialCountAggregateOutputType | null;
    _avg: LineSerialAvgAggregateOutputType | null;
    _sum: LineSerialSumAggregateOutputType | null;
    _min: LineSerialMinAggregateOutputType | null;
    _max: LineSerialMaxAggregateOutputType | null;
};
export type LineSerialAvgAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    importBatchId: number | null;
};
export type LineSerialSumAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    importBatchId: number | null;
};
export type LineSerialMinAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    lineId: number | null;
    serial: string | null;
    serialNorm: string | null;
    refinery: string | null;
    collectedFlag: $Enums.CollectedFlag | null;
    collectedDate: Date | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LineSerialMaxAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    lineId: number | null;
    serial: string | null;
    serialNorm: string | null;
    refinery: string | null;
    collectedFlag: $Enums.CollectedFlag | null;
    collectedDate: Date | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LineSerialCountAggregateOutputType = {
    id: number;
    sourceKey: number;
    lineId: number;
    serial: number;
    serialNorm: number;
    refinery: number;
    collectedFlag: number;
    collectedDate: number;
    missingFromImport: number;
    importBatchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type LineSerialAvgAggregateInputType = {
    id?: true;
    lineId?: true;
    importBatchId?: true;
};
export type LineSerialSumAggregateInputType = {
    id?: true;
    lineId?: true;
    importBatchId?: true;
};
export type LineSerialMinAggregateInputType = {
    id?: true;
    sourceKey?: true;
    lineId?: true;
    serial?: true;
    serialNorm?: true;
    refinery?: true;
    collectedFlag?: true;
    collectedDate?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LineSerialMaxAggregateInputType = {
    id?: true;
    sourceKey?: true;
    lineId?: true;
    serial?: true;
    serialNorm?: true;
    refinery?: true;
    collectedFlag?: true;
    collectedDate?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LineSerialCountAggregateInputType = {
    id?: true;
    sourceKey?: true;
    lineId?: true;
    serial?: true;
    serialNorm?: true;
    refinery?: true;
    collectedFlag?: true;
    collectedDate?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type LineSerialAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LineSerialWhereInput;
    orderBy?: Prisma.LineSerialOrderByWithRelationInput | Prisma.LineSerialOrderByWithRelationInput[];
    cursor?: Prisma.LineSerialWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LineSerialCountAggregateInputType;
    _avg?: LineSerialAvgAggregateInputType;
    _sum?: LineSerialSumAggregateInputType;
    _min?: LineSerialMinAggregateInputType;
    _max?: LineSerialMaxAggregateInputType;
};
export type GetLineSerialAggregateType<T extends LineSerialAggregateArgs> = {
    [P in keyof T & keyof AggregateLineSerial]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLineSerial[P]> : Prisma.GetScalarType<T[P], AggregateLineSerial[P]>;
};
export type LineSerialGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LineSerialWhereInput;
    orderBy?: Prisma.LineSerialOrderByWithAggregationInput | Prisma.LineSerialOrderByWithAggregationInput[];
    by: Prisma.LineSerialScalarFieldEnum[] | Prisma.LineSerialScalarFieldEnum;
    having?: Prisma.LineSerialScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LineSerialCountAggregateInputType | true;
    _avg?: LineSerialAvgAggregateInputType;
    _sum?: LineSerialSumAggregateInputType;
    _min?: LineSerialMinAggregateInputType;
    _max?: LineSerialMaxAggregateInputType;
};
export type LineSerialGroupByOutputType = {
    id: number;
    sourceKey: string;
    lineId: number;
    serial: string;
    serialNorm: string;
    refinery: string | null;
    collectedFlag: $Enums.CollectedFlag | null;
    collectedDate: Date | null;
    missingFromImport: boolean;
    importBatchId: number;
    createdAt: Date;
    updatedAt: Date;
    _count: LineSerialCountAggregateOutputType | null;
    _avg: LineSerialAvgAggregateOutputType | null;
    _sum: LineSerialSumAggregateOutputType | null;
    _min: LineSerialMinAggregateOutputType | null;
    _max: LineSerialMaxAggregateOutputType | null;
};
export type GetLineSerialGroupByPayload<T extends LineSerialGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LineSerialGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LineSerialGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LineSerialGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LineSerialGroupByOutputType[P]>;
}>>;
export type LineSerialWhereInput = {
    AND?: Prisma.LineSerialWhereInput | Prisma.LineSerialWhereInput[];
    OR?: Prisma.LineSerialWhereInput[];
    NOT?: Prisma.LineSerialWhereInput | Prisma.LineSerialWhereInput[];
    id?: Prisma.IntFilter<"LineSerial"> | number;
    sourceKey?: Prisma.StringFilter<"LineSerial"> | string;
    lineId?: Prisma.IntFilter<"LineSerial"> | number;
    serial?: Prisma.StringFilter<"LineSerial"> | string;
    serialNorm?: Prisma.StringFilter<"LineSerial"> | string;
    refinery?: Prisma.StringNullableFilter<"LineSerial"> | string | null;
    collectedFlag?: Prisma.EnumCollectedFlagNullableFilter<"LineSerial"> | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.DateTimeNullableFilter<"LineSerial"> | Date | string | null;
    missingFromImport?: Prisma.BoolFilter<"LineSerial"> | boolean;
    importBatchId?: Prisma.IntFilter<"LineSerial"> | number;
    createdAt?: Prisma.DateTimeFilter<"LineSerial"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LineSerial"> | Date | string;
    line?: Prisma.XOR<Prisma.ZohoInvoiceLineScalarRelationFilter, Prisma.ZohoInvoiceLineWhereInput>;
};
export type LineSerialOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialNorm?: Prisma.SortOrder;
    refinery?: Prisma.SortOrderInput | Prisma.SortOrder;
    collectedFlag?: Prisma.SortOrderInput | Prisma.SortOrder;
    collectedDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    line?: Prisma.ZohoInvoiceLineOrderByWithRelationInput;
};
export type LineSerialWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    sourceKey?: string;
    AND?: Prisma.LineSerialWhereInput | Prisma.LineSerialWhereInput[];
    OR?: Prisma.LineSerialWhereInput[];
    NOT?: Prisma.LineSerialWhereInput | Prisma.LineSerialWhereInput[];
    lineId?: Prisma.IntFilter<"LineSerial"> | number;
    serial?: Prisma.StringFilter<"LineSerial"> | string;
    serialNorm?: Prisma.StringFilter<"LineSerial"> | string;
    refinery?: Prisma.StringNullableFilter<"LineSerial"> | string | null;
    collectedFlag?: Prisma.EnumCollectedFlagNullableFilter<"LineSerial"> | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.DateTimeNullableFilter<"LineSerial"> | Date | string | null;
    missingFromImport?: Prisma.BoolFilter<"LineSerial"> | boolean;
    importBatchId?: Prisma.IntFilter<"LineSerial"> | number;
    createdAt?: Prisma.DateTimeFilter<"LineSerial"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LineSerial"> | Date | string;
    line?: Prisma.XOR<Prisma.ZohoInvoiceLineScalarRelationFilter, Prisma.ZohoInvoiceLineWhereInput>;
}, "id" | "sourceKey">;
export type LineSerialOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialNorm?: Prisma.SortOrder;
    refinery?: Prisma.SortOrderInput | Prisma.SortOrder;
    collectedFlag?: Prisma.SortOrderInput | Prisma.SortOrder;
    collectedDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.LineSerialCountOrderByAggregateInput;
    _avg?: Prisma.LineSerialAvgOrderByAggregateInput;
    _max?: Prisma.LineSerialMaxOrderByAggregateInput;
    _min?: Prisma.LineSerialMinOrderByAggregateInput;
    _sum?: Prisma.LineSerialSumOrderByAggregateInput;
};
export type LineSerialScalarWhereWithAggregatesInput = {
    AND?: Prisma.LineSerialScalarWhereWithAggregatesInput | Prisma.LineSerialScalarWhereWithAggregatesInput[];
    OR?: Prisma.LineSerialScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LineSerialScalarWhereWithAggregatesInput | Prisma.LineSerialScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"LineSerial"> | number;
    sourceKey?: Prisma.StringWithAggregatesFilter<"LineSerial"> | string;
    lineId?: Prisma.IntWithAggregatesFilter<"LineSerial"> | number;
    serial?: Prisma.StringWithAggregatesFilter<"LineSerial"> | string;
    serialNorm?: Prisma.StringWithAggregatesFilter<"LineSerial"> | string;
    refinery?: Prisma.StringNullableWithAggregatesFilter<"LineSerial"> | string | null;
    collectedFlag?: Prisma.EnumCollectedFlagNullableWithAggregatesFilter<"LineSerial"> | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.DateTimeNullableWithAggregatesFilter<"LineSerial"> | Date | string | null;
    missingFromImport?: Prisma.BoolWithAggregatesFilter<"LineSerial"> | boolean;
    importBatchId?: Prisma.IntWithAggregatesFilter<"LineSerial"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LineSerial"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LineSerial"> | Date | string;
};
export type LineSerialCreateInput = {
    sourceKey: string;
    serial: string;
    serialNorm: string;
    refinery?: string | null;
    collectedFlag?: $Enums.CollectedFlag | null;
    collectedDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    line: Prisma.ZohoInvoiceLineCreateNestedOneWithoutSerialsInput;
};
export type LineSerialUncheckedCreateInput = {
    id?: number;
    sourceKey: string;
    lineId: number;
    serial: string;
    serialNorm: string;
    refinery?: string | null;
    collectedFlag?: $Enums.CollectedFlag | null;
    collectedDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LineSerialUpdateInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedFlag?: Prisma.NullableEnumCollectedFlagFieldUpdateOperationsInput | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    line?: Prisma.ZohoInvoiceLineUpdateOneRequiredWithoutSerialsNestedInput;
};
export type LineSerialUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    lineId?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedFlag?: Prisma.NullableEnumCollectedFlagFieldUpdateOperationsInput | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LineSerialCreateManyInput = {
    id?: number;
    sourceKey: string;
    lineId: number;
    serial: string;
    serialNorm: string;
    refinery?: string | null;
    collectedFlag?: $Enums.CollectedFlag | null;
    collectedDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LineSerialUpdateManyMutationInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedFlag?: Prisma.NullableEnumCollectedFlagFieldUpdateOperationsInput | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LineSerialUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    lineId?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedFlag?: Prisma.NullableEnumCollectedFlagFieldUpdateOperationsInput | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LineSerialListRelationFilter = {
    every?: Prisma.LineSerialWhereInput;
    some?: Prisma.LineSerialWhereInput;
    none?: Prisma.LineSerialWhereInput;
};
export type LineSerialOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LineSerialCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialNorm?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    collectedFlag?: Prisma.SortOrder;
    collectedDate?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LineSerialAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type LineSerialMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialNorm?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    collectedFlag?: Prisma.SortOrder;
    collectedDate?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LineSerialMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialNorm?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    collectedFlag?: Prisma.SortOrder;
    collectedDate?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LineSerialSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type LineSerialCreateNestedManyWithoutLineInput = {
    create?: Prisma.XOR<Prisma.LineSerialCreateWithoutLineInput, Prisma.LineSerialUncheckedCreateWithoutLineInput> | Prisma.LineSerialCreateWithoutLineInput[] | Prisma.LineSerialUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LineSerialCreateOrConnectWithoutLineInput | Prisma.LineSerialCreateOrConnectWithoutLineInput[];
    createMany?: Prisma.LineSerialCreateManyLineInputEnvelope;
    connect?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
};
export type LineSerialUncheckedCreateNestedManyWithoutLineInput = {
    create?: Prisma.XOR<Prisma.LineSerialCreateWithoutLineInput, Prisma.LineSerialUncheckedCreateWithoutLineInput> | Prisma.LineSerialCreateWithoutLineInput[] | Prisma.LineSerialUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LineSerialCreateOrConnectWithoutLineInput | Prisma.LineSerialCreateOrConnectWithoutLineInput[];
    createMany?: Prisma.LineSerialCreateManyLineInputEnvelope;
    connect?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
};
export type LineSerialUpdateManyWithoutLineNestedInput = {
    create?: Prisma.XOR<Prisma.LineSerialCreateWithoutLineInput, Prisma.LineSerialUncheckedCreateWithoutLineInput> | Prisma.LineSerialCreateWithoutLineInput[] | Prisma.LineSerialUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LineSerialCreateOrConnectWithoutLineInput | Prisma.LineSerialCreateOrConnectWithoutLineInput[];
    upsert?: Prisma.LineSerialUpsertWithWhereUniqueWithoutLineInput | Prisma.LineSerialUpsertWithWhereUniqueWithoutLineInput[];
    createMany?: Prisma.LineSerialCreateManyLineInputEnvelope;
    set?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
    disconnect?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
    delete?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
    connect?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
    update?: Prisma.LineSerialUpdateWithWhereUniqueWithoutLineInput | Prisma.LineSerialUpdateWithWhereUniqueWithoutLineInput[];
    updateMany?: Prisma.LineSerialUpdateManyWithWhereWithoutLineInput | Prisma.LineSerialUpdateManyWithWhereWithoutLineInput[];
    deleteMany?: Prisma.LineSerialScalarWhereInput | Prisma.LineSerialScalarWhereInput[];
};
export type LineSerialUncheckedUpdateManyWithoutLineNestedInput = {
    create?: Prisma.XOR<Prisma.LineSerialCreateWithoutLineInput, Prisma.LineSerialUncheckedCreateWithoutLineInput> | Prisma.LineSerialCreateWithoutLineInput[] | Prisma.LineSerialUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LineSerialCreateOrConnectWithoutLineInput | Prisma.LineSerialCreateOrConnectWithoutLineInput[];
    upsert?: Prisma.LineSerialUpsertWithWhereUniqueWithoutLineInput | Prisma.LineSerialUpsertWithWhereUniqueWithoutLineInput[];
    createMany?: Prisma.LineSerialCreateManyLineInputEnvelope;
    set?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
    disconnect?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
    delete?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
    connect?: Prisma.LineSerialWhereUniqueInput | Prisma.LineSerialWhereUniqueInput[];
    update?: Prisma.LineSerialUpdateWithWhereUniqueWithoutLineInput | Prisma.LineSerialUpdateWithWhereUniqueWithoutLineInput[];
    updateMany?: Prisma.LineSerialUpdateManyWithWhereWithoutLineInput | Prisma.LineSerialUpdateManyWithWhereWithoutLineInput[];
    deleteMany?: Prisma.LineSerialScalarWhereInput | Prisma.LineSerialScalarWhereInput[];
};
export type LineSerialCreateWithoutLineInput = {
    sourceKey: string;
    serial: string;
    serialNorm: string;
    refinery?: string | null;
    collectedFlag?: $Enums.CollectedFlag | null;
    collectedDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LineSerialUncheckedCreateWithoutLineInput = {
    id?: number;
    sourceKey: string;
    serial: string;
    serialNorm: string;
    refinery?: string | null;
    collectedFlag?: $Enums.CollectedFlag | null;
    collectedDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LineSerialCreateOrConnectWithoutLineInput = {
    where: Prisma.LineSerialWhereUniqueInput;
    create: Prisma.XOR<Prisma.LineSerialCreateWithoutLineInput, Prisma.LineSerialUncheckedCreateWithoutLineInput>;
};
export type LineSerialCreateManyLineInputEnvelope = {
    data: Prisma.LineSerialCreateManyLineInput | Prisma.LineSerialCreateManyLineInput[];
    skipDuplicates?: boolean;
};
export type LineSerialUpsertWithWhereUniqueWithoutLineInput = {
    where: Prisma.LineSerialWhereUniqueInput;
    update: Prisma.XOR<Prisma.LineSerialUpdateWithoutLineInput, Prisma.LineSerialUncheckedUpdateWithoutLineInput>;
    create: Prisma.XOR<Prisma.LineSerialCreateWithoutLineInput, Prisma.LineSerialUncheckedCreateWithoutLineInput>;
};
export type LineSerialUpdateWithWhereUniqueWithoutLineInput = {
    where: Prisma.LineSerialWhereUniqueInput;
    data: Prisma.XOR<Prisma.LineSerialUpdateWithoutLineInput, Prisma.LineSerialUncheckedUpdateWithoutLineInput>;
};
export type LineSerialUpdateManyWithWhereWithoutLineInput = {
    where: Prisma.LineSerialScalarWhereInput;
    data: Prisma.XOR<Prisma.LineSerialUpdateManyMutationInput, Prisma.LineSerialUncheckedUpdateManyWithoutLineInput>;
};
export type LineSerialScalarWhereInput = {
    AND?: Prisma.LineSerialScalarWhereInput | Prisma.LineSerialScalarWhereInput[];
    OR?: Prisma.LineSerialScalarWhereInput[];
    NOT?: Prisma.LineSerialScalarWhereInput | Prisma.LineSerialScalarWhereInput[];
    id?: Prisma.IntFilter<"LineSerial"> | number;
    sourceKey?: Prisma.StringFilter<"LineSerial"> | string;
    lineId?: Prisma.IntFilter<"LineSerial"> | number;
    serial?: Prisma.StringFilter<"LineSerial"> | string;
    serialNorm?: Prisma.StringFilter<"LineSerial"> | string;
    refinery?: Prisma.StringNullableFilter<"LineSerial"> | string | null;
    collectedFlag?: Prisma.EnumCollectedFlagNullableFilter<"LineSerial"> | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.DateTimeNullableFilter<"LineSerial"> | Date | string | null;
    missingFromImport?: Prisma.BoolFilter<"LineSerial"> | boolean;
    importBatchId?: Prisma.IntFilter<"LineSerial"> | number;
    createdAt?: Prisma.DateTimeFilter<"LineSerial"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LineSerial"> | Date | string;
};
export type LineSerialCreateManyLineInput = {
    id?: number;
    sourceKey: string;
    serial: string;
    serialNorm: string;
    refinery?: string | null;
    collectedFlag?: $Enums.CollectedFlag | null;
    collectedDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LineSerialUpdateWithoutLineInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedFlag?: Prisma.NullableEnumCollectedFlagFieldUpdateOperationsInput | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LineSerialUncheckedUpdateWithoutLineInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedFlag?: Prisma.NullableEnumCollectedFlagFieldUpdateOperationsInput | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LineSerialUncheckedUpdateManyWithoutLineInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedFlag?: Prisma.NullableEnumCollectedFlagFieldUpdateOperationsInput | $Enums.CollectedFlag | null;
    collectedDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LineSerialSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    lineId?: boolean;
    serial?: boolean;
    serialNorm?: boolean;
    refinery?: boolean;
    collectedFlag?: boolean;
    collectedDate?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    line?: boolean | Prisma.ZohoInvoiceLineDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["lineSerial"]>;
export type LineSerialSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    lineId?: boolean;
    serial?: boolean;
    serialNorm?: boolean;
    refinery?: boolean;
    collectedFlag?: boolean;
    collectedDate?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    line?: boolean | Prisma.ZohoInvoiceLineDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["lineSerial"]>;
export type LineSerialSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    lineId?: boolean;
    serial?: boolean;
    serialNorm?: boolean;
    refinery?: boolean;
    collectedFlag?: boolean;
    collectedDate?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    line?: boolean | Prisma.ZohoInvoiceLineDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["lineSerial"]>;
export type LineSerialSelectScalar = {
    id?: boolean;
    sourceKey?: boolean;
    lineId?: boolean;
    serial?: boolean;
    serialNorm?: boolean;
    refinery?: boolean;
    collectedFlag?: boolean;
    collectedDate?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type LineSerialOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sourceKey" | "lineId" | "serial" | "serialNorm" | "refinery" | "collectedFlag" | "collectedDate" | "missingFromImport" | "importBatchId" | "createdAt" | "updatedAt", ExtArgs["result"]["lineSerial"]>;
export type LineSerialInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    line?: boolean | Prisma.ZohoInvoiceLineDefaultArgs<ExtArgs>;
};
export type LineSerialIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    line?: boolean | Prisma.ZohoInvoiceLineDefaultArgs<ExtArgs>;
};
export type LineSerialIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    line?: boolean | Prisma.ZohoInvoiceLineDefaultArgs<ExtArgs>;
};
export type $LineSerialPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LineSerial";
    objects: {
        line: Prisma.$ZohoInvoiceLinePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        sourceKey: string;
        lineId: number;
        serial: string;
        serialNorm: string;
        refinery: string | null;
        collectedFlag: $Enums.CollectedFlag | null;
        collectedDate: Date | null;
        missingFromImport: boolean;
        importBatchId: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["lineSerial"]>;
    composites: {};
};
export type LineSerialGetPayload<S extends boolean | null | undefined | LineSerialDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LineSerialPayload, S>;
export type LineSerialCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LineSerialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LineSerialCountAggregateInputType | true;
};
export interface LineSerialDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LineSerial'];
        meta: {
            name: 'LineSerial';
        };
    };
    findUnique<T extends LineSerialFindUniqueArgs>(args: Prisma.SelectSubset<T, LineSerialFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LineSerialClient<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LineSerialFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LineSerialFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LineSerialClient<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LineSerialFindFirstArgs>(args?: Prisma.SelectSubset<T, LineSerialFindFirstArgs<ExtArgs>>): Prisma.Prisma__LineSerialClient<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LineSerialFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LineSerialFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LineSerialClient<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LineSerialFindManyArgs>(args?: Prisma.SelectSubset<T, LineSerialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LineSerialCreateArgs>(args: Prisma.SelectSubset<T, LineSerialCreateArgs<ExtArgs>>): Prisma.Prisma__LineSerialClient<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LineSerialCreateManyArgs>(args?: Prisma.SelectSubset<T, LineSerialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LineSerialCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LineSerialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LineSerialDeleteArgs>(args: Prisma.SelectSubset<T, LineSerialDeleteArgs<ExtArgs>>): Prisma.Prisma__LineSerialClient<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LineSerialUpdateArgs>(args: Prisma.SelectSubset<T, LineSerialUpdateArgs<ExtArgs>>): Prisma.Prisma__LineSerialClient<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LineSerialDeleteManyArgs>(args?: Prisma.SelectSubset<T, LineSerialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LineSerialUpdateManyArgs>(args: Prisma.SelectSubset<T, LineSerialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LineSerialUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LineSerialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LineSerialUpsertArgs>(args: Prisma.SelectSubset<T, LineSerialUpsertArgs<ExtArgs>>): Prisma.Prisma__LineSerialClient<runtime.Types.Result.GetResult<Prisma.$LineSerialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LineSerialCountArgs>(args?: Prisma.Subset<T, LineSerialCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LineSerialCountAggregateOutputType> : number>;
    aggregate<T extends LineSerialAggregateArgs>(args: Prisma.Subset<T, LineSerialAggregateArgs>): Prisma.PrismaPromise<GetLineSerialAggregateType<T>>;
    groupBy<T extends LineSerialGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LineSerialGroupByArgs['orderBy'];
    } : {
        orderBy?: LineSerialGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LineSerialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLineSerialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LineSerialFieldRefs;
}
export interface Prisma__LineSerialClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    line<T extends Prisma.ZohoInvoiceLineDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ZohoInvoiceLineDefaultArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceLineClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoiceLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LineSerialFieldRefs {
    readonly id: Prisma.FieldRef<"LineSerial", 'Int'>;
    readonly sourceKey: Prisma.FieldRef<"LineSerial", 'String'>;
    readonly lineId: Prisma.FieldRef<"LineSerial", 'Int'>;
    readonly serial: Prisma.FieldRef<"LineSerial", 'String'>;
    readonly serialNorm: Prisma.FieldRef<"LineSerial", 'String'>;
    readonly refinery: Prisma.FieldRef<"LineSerial", 'String'>;
    readonly collectedFlag: Prisma.FieldRef<"LineSerial", 'CollectedFlag'>;
    readonly collectedDate: Prisma.FieldRef<"LineSerial", 'DateTime'>;
    readonly missingFromImport: Prisma.FieldRef<"LineSerial", 'Boolean'>;
    readonly importBatchId: Prisma.FieldRef<"LineSerial", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"LineSerial", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"LineSerial", 'DateTime'>;
}
export type LineSerialFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
    where: Prisma.LineSerialWhereUniqueInput;
};
export type LineSerialFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
    where: Prisma.LineSerialWhereUniqueInput;
};
export type LineSerialFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
    where?: Prisma.LineSerialWhereInput;
    orderBy?: Prisma.LineSerialOrderByWithRelationInput | Prisma.LineSerialOrderByWithRelationInput[];
    cursor?: Prisma.LineSerialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LineSerialScalarFieldEnum | Prisma.LineSerialScalarFieldEnum[];
};
export type LineSerialFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
    where?: Prisma.LineSerialWhereInput;
    orderBy?: Prisma.LineSerialOrderByWithRelationInput | Prisma.LineSerialOrderByWithRelationInput[];
    cursor?: Prisma.LineSerialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LineSerialScalarFieldEnum | Prisma.LineSerialScalarFieldEnum[];
};
export type LineSerialFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
    where?: Prisma.LineSerialWhereInput;
    orderBy?: Prisma.LineSerialOrderByWithRelationInput | Prisma.LineSerialOrderByWithRelationInput[];
    cursor?: Prisma.LineSerialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LineSerialScalarFieldEnum | Prisma.LineSerialScalarFieldEnum[];
};
export type LineSerialCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LineSerialCreateInput, Prisma.LineSerialUncheckedCreateInput>;
};
export type LineSerialCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LineSerialCreateManyInput | Prisma.LineSerialCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LineSerialCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    data: Prisma.LineSerialCreateManyInput | Prisma.LineSerialCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LineSerialIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LineSerialUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LineSerialUpdateInput, Prisma.LineSerialUncheckedUpdateInput>;
    where: Prisma.LineSerialWhereUniqueInput;
};
export type LineSerialUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LineSerialUpdateManyMutationInput, Prisma.LineSerialUncheckedUpdateManyInput>;
    where?: Prisma.LineSerialWhereInput;
    limit?: number;
};
export type LineSerialUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LineSerialUpdateManyMutationInput, Prisma.LineSerialUncheckedUpdateManyInput>;
    where?: Prisma.LineSerialWhereInput;
    limit?: number;
    include?: Prisma.LineSerialIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LineSerialUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
    where: Prisma.LineSerialWhereUniqueInput;
    create: Prisma.XOR<Prisma.LineSerialCreateInput, Prisma.LineSerialUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LineSerialUpdateInput, Prisma.LineSerialUncheckedUpdateInput>;
};
export type LineSerialDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
    where: Prisma.LineSerialWhereUniqueInput;
};
export type LineSerialDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LineSerialWhereInput;
    limit?: number;
};
export type LineSerialDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LineSerialSelect<ExtArgs> | null;
    omit?: Prisma.LineSerialOmit<ExtArgs> | null;
    include?: Prisma.LineSerialInclude<ExtArgs> | null;
};
//# sourceMappingURL=LineSerial.d.ts.map