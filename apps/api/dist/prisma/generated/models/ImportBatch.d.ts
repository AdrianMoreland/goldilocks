import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ImportBatchModel = runtime.Types.Result.DefaultSelection<Prisma.$ImportBatchPayload>;
export type AggregateImportBatch = {
    _count: ImportBatchCountAggregateOutputType | null;
    _avg: ImportBatchAvgAggregateOutputType | null;
    _sum: ImportBatchSumAggregateOutputType | null;
    _min: ImportBatchMinAggregateOutputType | null;
    _max: ImportBatchMaxAggregateOutputType | null;
};
export type ImportBatchAvgAggregateOutputType = {
    id: number | null;
};
export type ImportBatchSumAggregateOutputType = {
    id: number | null;
};
export type ImportBatchMinAggregateOutputType = {
    id: number | null;
    fileName: string | null;
    sheetMonth: string | null;
    source: string | null;
    importedBy: string | null;
    importedAt: Date | null;
    kind: string | null;
    schemaVersion: string | null;
    status: string | null;
};
export type ImportBatchMaxAggregateOutputType = {
    id: number | null;
    fileName: string | null;
    sheetMonth: string | null;
    source: string | null;
    importedBy: string | null;
    importedAt: Date | null;
    kind: string | null;
    schemaVersion: string | null;
    status: string | null;
};
export type ImportBatchCountAggregateOutputType = {
    id: number;
    fileName: number;
    sheetMonth: number;
    source: number;
    importedBy: number;
    importedAt: number;
    summary: number;
    kind: number;
    schemaVersion: number;
    tableCounts: number;
    status: number;
    _all: number;
};
export type ImportBatchAvgAggregateInputType = {
    id?: true;
};
export type ImportBatchSumAggregateInputType = {
    id?: true;
};
export type ImportBatchMinAggregateInputType = {
    id?: true;
    fileName?: true;
    sheetMonth?: true;
    source?: true;
    importedBy?: true;
    importedAt?: true;
    kind?: true;
    schemaVersion?: true;
    status?: true;
};
export type ImportBatchMaxAggregateInputType = {
    id?: true;
    fileName?: true;
    sheetMonth?: true;
    source?: true;
    importedBy?: true;
    importedAt?: true;
    kind?: true;
    schemaVersion?: true;
    status?: true;
};
export type ImportBatchCountAggregateInputType = {
    id?: true;
    fileName?: true;
    sheetMonth?: true;
    source?: true;
    importedBy?: true;
    importedAt?: true;
    summary?: true;
    kind?: true;
    schemaVersion?: true;
    tableCounts?: true;
    status?: true;
    _all?: true;
};
export type ImportBatchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportBatchWhereInput;
    orderBy?: Prisma.ImportBatchOrderByWithRelationInput | Prisma.ImportBatchOrderByWithRelationInput[];
    cursor?: Prisma.ImportBatchWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ImportBatchCountAggregateInputType;
    _avg?: ImportBatchAvgAggregateInputType;
    _sum?: ImportBatchSumAggregateInputType;
    _min?: ImportBatchMinAggregateInputType;
    _max?: ImportBatchMaxAggregateInputType;
};
export type GetImportBatchAggregateType<T extends ImportBatchAggregateArgs> = {
    [P in keyof T & keyof AggregateImportBatch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateImportBatch[P]> : Prisma.GetScalarType<T[P], AggregateImportBatch[P]>;
};
export type ImportBatchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportBatchWhereInput;
    orderBy?: Prisma.ImportBatchOrderByWithAggregationInput | Prisma.ImportBatchOrderByWithAggregationInput[];
    by: Prisma.ImportBatchScalarFieldEnum[] | Prisma.ImportBatchScalarFieldEnum;
    having?: Prisma.ImportBatchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ImportBatchCountAggregateInputType | true;
    _avg?: ImportBatchAvgAggregateInputType;
    _sum?: ImportBatchSumAggregateInputType;
    _min?: ImportBatchMinAggregateInputType;
    _max?: ImportBatchMaxAggregateInputType;
};
export type ImportBatchGroupByOutputType = {
    id: number;
    fileName: string;
    sheetMonth: string;
    source: string;
    importedBy: string;
    importedAt: Date;
    summary: runtime.JsonValue;
    kind: string;
    schemaVersion: string | null;
    tableCounts: runtime.JsonValue | null;
    status: string;
    _count: ImportBatchCountAggregateOutputType | null;
    _avg: ImportBatchAvgAggregateOutputType | null;
    _sum: ImportBatchSumAggregateOutputType | null;
    _min: ImportBatchMinAggregateOutputType | null;
    _max: ImportBatchMaxAggregateOutputType | null;
};
export type GetImportBatchGroupByPayload<T extends ImportBatchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ImportBatchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ImportBatchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ImportBatchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ImportBatchGroupByOutputType[P]>;
}>>;
export type ImportBatchWhereInput = {
    AND?: Prisma.ImportBatchWhereInput | Prisma.ImportBatchWhereInput[];
    OR?: Prisma.ImportBatchWhereInput[];
    NOT?: Prisma.ImportBatchWhereInput | Prisma.ImportBatchWhereInput[];
    id?: Prisma.IntFilter<"ImportBatch"> | number;
    fileName?: Prisma.StringFilter<"ImportBatch"> | string;
    sheetMonth?: Prisma.StringFilter<"ImportBatch"> | string;
    source?: Prisma.StringFilter<"ImportBatch"> | string;
    importedBy?: Prisma.StringFilter<"ImportBatch"> | string;
    importedAt?: Prisma.DateTimeFilter<"ImportBatch"> | Date | string;
    summary?: Prisma.JsonFilter<"ImportBatch">;
    kind?: Prisma.StringFilter<"ImportBatch"> | string;
    schemaVersion?: Prisma.StringNullableFilter<"ImportBatch"> | string | null;
    tableCounts?: Prisma.JsonNullableFilter<"ImportBatch">;
    status?: Prisma.StringFilter<"ImportBatch"> | string;
    trades?: Prisma.TradeListRelationFilter;
    lots?: Prisma.PurchaseLotListRelationFilter;
};
export type ImportBatchOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    sheetMonth?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    importedBy?: Prisma.SortOrder;
    importedAt?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    schemaVersion?: Prisma.SortOrderInput | Prisma.SortOrder;
    tableCounts?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    trades?: Prisma.TradeOrderByRelationAggregateInput;
    lots?: Prisma.PurchaseLotOrderByRelationAggregateInput;
};
export type ImportBatchWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.ImportBatchWhereInput | Prisma.ImportBatchWhereInput[];
    OR?: Prisma.ImportBatchWhereInput[];
    NOT?: Prisma.ImportBatchWhereInput | Prisma.ImportBatchWhereInput[];
    fileName?: Prisma.StringFilter<"ImportBatch"> | string;
    sheetMonth?: Prisma.StringFilter<"ImportBatch"> | string;
    source?: Prisma.StringFilter<"ImportBatch"> | string;
    importedBy?: Prisma.StringFilter<"ImportBatch"> | string;
    importedAt?: Prisma.DateTimeFilter<"ImportBatch"> | Date | string;
    summary?: Prisma.JsonFilter<"ImportBatch">;
    kind?: Prisma.StringFilter<"ImportBatch"> | string;
    schemaVersion?: Prisma.StringNullableFilter<"ImportBatch"> | string | null;
    tableCounts?: Prisma.JsonNullableFilter<"ImportBatch">;
    status?: Prisma.StringFilter<"ImportBatch"> | string;
    trades?: Prisma.TradeListRelationFilter;
    lots?: Prisma.PurchaseLotListRelationFilter;
}, "id">;
export type ImportBatchOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    sheetMonth?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    importedBy?: Prisma.SortOrder;
    importedAt?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    schemaVersion?: Prisma.SortOrderInput | Prisma.SortOrder;
    tableCounts?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    _count?: Prisma.ImportBatchCountOrderByAggregateInput;
    _avg?: Prisma.ImportBatchAvgOrderByAggregateInput;
    _max?: Prisma.ImportBatchMaxOrderByAggregateInput;
    _min?: Prisma.ImportBatchMinOrderByAggregateInput;
    _sum?: Prisma.ImportBatchSumOrderByAggregateInput;
};
export type ImportBatchScalarWhereWithAggregatesInput = {
    AND?: Prisma.ImportBatchScalarWhereWithAggregatesInput | Prisma.ImportBatchScalarWhereWithAggregatesInput[];
    OR?: Prisma.ImportBatchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ImportBatchScalarWhereWithAggregatesInput | Prisma.ImportBatchScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ImportBatch"> | number;
    fileName?: Prisma.StringWithAggregatesFilter<"ImportBatch"> | string;
    sheetMonth?: Prisma.StringWithAggregatesFilter<"ImportBatch"> | string;
    source?: Prisma.StringWithAggregatesFilter<"ImportBatch"> | string;
    importedBy?: Prisma.StringWithAggregatesFilter<"ImportBatch"> | string;
    importedAt?: Prisma.DateTimeWithAggregatesFilter<"ImportBatch"> | Date | string;
    summary?: Prisma.JsonWithAggregatesFilter<"ImportBatch">;
    kind?: Prisma.StringWithAggregatesFilter<"ImportBatch"> | string;
    schemaVersion?: Prisma.StringNullableWithAggregatesFilter<"ImportBatch"> | string | null;
    tableCounts?: Prisma.JsonNullableWithAggregatesFilter<"ImportBatch">;
    status?: Prisma.StringWithAggregatesFilter<"ImportBatch"> | string;
};
export type ImportBatchCreateInput = {
    fileName: string;
    sheetMonth: string;
    source?: string;
    importedBy: string;
    importedAt?: Date | string;
    summary: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: string;
    schemaVersion?: string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    trades?: Prisma.TradeCreateNestedManyWithoutLastBatchInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutLastBatchInput;
};
export type ImportBatchUncheckedCreateInput = {
    id?: number;
    fileName: string;
    sheetMonth: string;
    source?: string;
    importedBy: string;
    importedAt?: Date | string;
    summary: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: string;
    schemaVersion?: string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutLastBatchInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutLastBatchInput;
};
export type ImportBatchUpdateInput = {
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    sheetMonth?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    importedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    importedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    summary?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    schemaVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    trades?: Prisma.TradeUpdateManyWithoutLastBatchNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutLastBatchNestedInput;
};
export type ImportBatchUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    sheetMonth?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    importedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    importedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    summary?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    schemaVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutLastBatchNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutLastBatchNestedInput;
};
export type ImportBatchCreateManyInput = {
    id?: number;
    fileName: string;
    sheetMonth: string;
    source?: string;
    importedBy: string;
    importedAt?: Date | string;
    summary: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: string;
    schemaVersion?: string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
};
export type ImportBatchUpdateManyMutationInput = {
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    sheetMonth?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    importedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    importedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    summary?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    schemaVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ImportBatchUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    sheetMonth?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    importedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    importedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    summary?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    schemaVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ImportBatchCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    sheetMonth?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    importedBy?: Prisma.SortOrder;
    importedAt?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    schemaVersion?: Prisma.SortOrder;
    tableCounts?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type ImportBatchAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type ImportBatchMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    sheetMonth?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    importedBy?: Prisma.SortOrder;
    importedAt?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    schemaVersion?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type ImportBatchMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    sheetMonth?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    importedBy?: Prisma.SortOrder;
    importedAt?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    schemaVersion?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type ImportBatchSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type ImportBatchScalarRelationFilter = {
    is?: Prisma.ImportBatchWhereInput;
    isNot?: Prisma.ImportBatchWhereInput;
};
export type ImportBatchCreateNestedOneWithoutTradesInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutTradesInput, Prisma.ImportBatchUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutTradesInput;
    connect?: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchUpdateOneRequiredWithoutTradesNestedInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutTradesInput, Prisma.ImportBatchUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutTradesInput;
    upsert?: Prisma.ImportBatchUpsertWithoutTradesInput;
    connect?: Prisma.ImportBatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ImportBatchUpdateToOneWithWhereWithoutTradesInput, Prisma.ImportBatchUpdateWithoutTradesInput>, Prisma.ImportBatchUncheckedUpdateWithoutTradesInput>;
};
export type ImportBatchCreateNestedOneWithoutLotsInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutLotsInput, Prisma.ImportBatchUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutLotsInput;
    connect?: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchUpdateOneRequiredWithoutLotsNestedInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutLotsInput, Prisma.ImportBatchUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutLotsInput;
    upsert?: Prisma.ImportBatchUpsertWithoutLotsInput;
    connect?: Prisma.ImportBatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ImportBatchUpdateToOneWithWhereWithoutLotsInput, Prisma.ImportBatchUpdateWithoutLotsInput>, Prisma.ImportBatchUncheckedUpdateWithoutLotsInput>;
};
export type ImportBatchCreateWithoutTradesInput = {
    fileName: string;
    sheetMonth: string;
    source?: string;
    importedBy: string;
    importedAt?: Date | string;
    summary: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: string;
    schemaVersion?: string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutLastBatchInput;
};
export type ImportBatchUncheckedCreateWithoutTradesInput = {
    id?: number;
    fileName: string;
    sheetMonth: string;
    source?: string;
    importedBy: string;
    importedAt?: Date | string;
    summary: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: string;
    schemaVersion?: string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutLastBatchInput;
};
export type ImportBatchCreateOrConnectWithoutTradesInput = {
    where: Prisma.ImportBatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.ImportBatchCreateWithoutTradesInput, Prisma.ImportBatchUncheckedCreateWithoutTradesInput>;
};
export type ImportBatchUpsertWithoutTradesInput = {
    update: Prisma.XOR<Prisma.ImportBatchUpdateWithoutTradesInput, Prisma.ImportBatchUncheckedUpdateWithoutTradesInput>;
    create: Prisma.XOR<Prisma.ImportBatchCreateWithoutTradesInput, Prisma.ImportBatchUncheckedCreateWithoutTradesInput>;
    where?: Prisma.ImportBatchWhereInput;
};
export type ImportBatchUpdateToOneWithWhereWithoutTradesInput = {
    where?: Prisma.ImportBatchWhereInput;
    data: Prisma.XOR<Prisma.ImportBatchUpdateWithoutTradesInput, Prisma.ImportBatchUncheckedUpdateWithoutTradesInput>;
};
export type ImportBatchUpdateWithoutTradesInput = {
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    sheetMonth?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    importedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    importedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    summary?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    schemaVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    lots?: Prisma.PurchaseLotUpdateManyWithoutLastBatchNestedInput;
};
export type ImportBatchUncheckedUpdateWithoutTradesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    sheetMonth?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    importedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    importedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    summary?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    schemaVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutLastBatchNestedInput;
};
export type ImportBatchCreateWithoutLotsInput = {
    fileName: string;
    sheetMonth: string;
    source?: string;
    importedBy: string;
    importedAt?: Date | string;
    summary: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: string;
    schemaVersion?: string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    trades?: Prisma.TradeCreateNestedManyWithoutLastBatchInput;
};
export type ImportBatchUncheckedCreateWithoutLotsInput = {
    id?: number;
    fileName: string;
    sheetMonth: string;
    source?: string;
    importedBy: string;
    importedAt?: Date | string;
    summary: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: string;
    schemaVersion?: string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutLastBatchInput;
};
export type ImportBatchCreateOrConnectWithoutLotsInput = {
    where: Prisma.ImportBatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.ImportBatchCreateWithoutLotsInput, Prisma.ImportBatchUncheckedCreateWithoutLotsInput>;
};
export type ImportBatchUpsertWithoutLotsInput = {
    update: Prisma.XOR<Prisma.ImportBatchUpdateWithoutLotsInput, Prisma.ImportBatchUncheckedUpdateWithoutLotsInput>;
    create: Prisma.XOR<Prisma.ImportBatchCreateWithoutLotsInput, Prisma.ImportBatchUncheckedCreateWithoutLotsInput>;
    where?: Prisma.ImportBatchWhereInput;
};
export type ImportBatchUpdateToOneWithWhereWithoutLotsInput = {
    where?: Prisma.ImportBatchWhereInput;
    data: Prisma.XOR<Prisma.ImportBatchUpdateWithoutLotsInput, Prisma.ImportBatchUncheckedUpdateWithoutLotsInput>;
};
export type ImportBatchUpdateWithoutLotsInput = {
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    sheetMonth?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    importedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    importedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    summary?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    schemaVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    trades?: Prisma.TradeUpdateManyWithoutLastBatchNestedInput;
};
export type ImportBatchUncheckedUpdateWithoutLotsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    sheetMonth?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    importedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    importedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    summary?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    schemaVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tableCounts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutLastBatchNestedInput;
};
export type ImportBatchCountOutputType = {
    trades: number;
    lots: number;
};
export type ImportBatchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trades?: boolean | ImportBatchCountOutputTypeCountTradesArgs;
    lots?: boolean | ImportBatchCountOutputTypeCountLotsArgs;
};
export type ImportBatchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchCountOutputTypeSelect<ExtArgs> | null;
};
export type ImportBatchCountOutputTypeCountTradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TradeWhereInput;
};
export type ImportBatchCountOutputTypeCountLotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseLotWhereInput;
};
export type ImportBatchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fileName?: boolean;
    sheetMonth?: boolean;
    source?: boolean;
    importedBy?: boolean;
    importedAt?: boolean;
    summary?: boolean;
    kind?: boolean;
    schemaVersion?: boolean;
    tableCounts?: boolean;
    status?: boolean;
    trades?: boolean | Prisma.ImportBatch$tradesArgs<ExtArgs>;
    lots?: boolean | Prisma.ImportBatch$lotsArgs<ExtArgs>;
    _count?: boolean | Prisma.ImportBatchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["importBatch"]>;
export type ImportBatchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fileName?: boolean;
    sheetMonth?: boolean;
    source?: boolean;
    importedBy?: boolean;
    importedAt?: boolean;
    summary?: boolean;
    kind?: boolean;
    schemaVersion?: boolean;
    tableCounts?: boolean;
    status?: boolean;
}, ExtArgs["result"]["importBatch"]>;
export type ImportBatchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fileName?: boolean;
    sheetMonth?: boolean;
    source?: boolean;
    importedBy?: boolean;
    importedAt?: boolean;
    summary?: boolean;
    kind?: boolean;
    schemaVersion?: boolean;
    tableCounts?: boolean;
    status?: boolean;
}, ExtArgs["result"]["importBatch"]>;
export type ImportBatchSelectScalar = {
    id?: boolean;
    fileName?: boolean;
    sheetMonth?: boolean;
    source?: boolean;
    importedBy?: boolean;
    importedAt?: boolean;
    summary?: boolean;
    kind?: boolean;
    schemaVersion?: boolean;
    tableCounts?: boolean;
    status?: boolean;
};
export type ImportBatchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "fileName" | "sheetMonth" | "source" | "importedBy" | "importedAt" | "summary" | "kind" | "schemaVersion" | "tableCounts" | "status", ExtArgs["result"]["importBatch"]>;
export type ImportBatchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trades?: boolean | Prisma.ImportBatch$tradesArgs<ExtArgs>;
    lots?: boolean | Prisma.ImportBatch$lotsArgs<ExtArgs>;
    _count?: boolean | Prisma.ImportBatchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ImportBatchIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ImportBatchIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ImportBatchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ImportBatch";
    objects: {
        trades: Prisma.$TradePayload<ExtArgs>[];
        lots: Prisma.$PurchaseLotPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        fileName: string;
        sheetMonth: string;
        source: string;
        importedBy: string;
        importedAt: Date;
        summary: runtime.JsonValue;
        kind: string;
        schemaVersion: string | null;
        tableCounts: runtime.JsonValue | null;
        status: string;
    }, ExtArgs["result"]["importBatch"]>;
    composites: {};
};
export type ImportBatchGetPayload<S extends boolean | null | undefined | ImportBatchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload, S>;
export type ImportBatchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ImportBatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ImportBatchCountAggregateInputType | true;
};
export interface ImportBatchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ImportBatch'];
        meta: {
            name: 'ImportBatch';
        };
    };
    findUnique<T extends ImportBatchFindUniqueArgs>(args: Prisma.SelectSubset<T, ImportBatchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ImportBatchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ImportBatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ImportBatchFindFirstArgs>(args?: Prisma.SelectSubset<T, ImportBatchFindFirstArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ImportBatchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ImportBatchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ImportBatchFindManyArgs>(args?: Prisma.SelectSubset<T, ImportBatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ImportBatchCreateArgs>(args: Prisma.SelectSubset<T, ImportBatchCreateArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ImportBatchCreateManyArgs>(args?: Prisma.SelectSubset<T, ImportBatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ImportBatchCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ImportBatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ImportBatchDeleteArgs>(args: Prisma.SelectSubset<T, ImportBatchDeleteArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ImportBatchUpdateArgs>(args: Prisma.SelectSubset<T, ImportBatchUpdateArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ImportBatchDeleteManyArgs>(args?: Prisma.SelectSubset<T, ImportBatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ImportBatchUpdateManyArgs>(args: Prisma.SelectSubset<T, ImportBatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ImportBatchUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ImportBatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ImportBatchUpsertArgs>(args: Prisma.SelectSubset<T, ImportBatchUpsertArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ImportBatchCountArgs>(args?: Prisma.Subset<T, ImportBatchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ImportBatchCountAggregateOutputType> : number>;
    aggregate<T extends ImportBatchAggregateArgs>(args: Prisma.Subset<T, ImportBatchAggregateArgs>): Prisma.PrismaPromise<GetImportBatchAggregateType<T>>;
    groupBy<T extends ImportBatchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ImportBatchGroupByArgs['orderBy'];
    } : {
        orderBy?: ImportBatchGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ImportBatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportBatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ImportBatchFieldRefs;
}
export interface Prisma__ImportBatchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    trades<T extends Prisma.ImportBatch$tradesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ImportBatch$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    lots<T extends Prisma.ImportBatch$lotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ImportBatch$lotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseLotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ImportBatchFieldRefs {
    readonly id: Prisma.FieldRef<"ImportBatch", 'Int'>;
    readonly fileName: Prisma.FieldRef<"ImportBatch", 'String'>;
    readonly sheetMonth: Prisma.FieldRef<"ImportBatch", 'String'>;
    readonly source: Prisma.FieldRef<"ImportBatch", 'String'>;
    readonly importedBy: Prisma.FieldRef<"ImportBatch", 'String'>;
    readonly importedAt: Prisma.FieldRef<"ImportBatch", 'DateTime'>;
    readonly summary: Prisma.FieldRef<"ImportBatch", 'Json'>;
    readonly kind: Prisma.FieldRef<"ImportBatch", 'String'>;
    readonly schemaVersion: Prisma.FieldRef<"ImportBatch", 'String'>;
    readonly tableCounts: Prisma.FieldRef<"ImportBatch", 'Json'>;
    readonly status: Prisma.FieldRef<"ImportBatch", 'String'>;
}
export type ImportBatchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where?: Prisma.ImportBatchWhereInput;
    orderBy?: Prisma.ImportBatchOrderByWithRelationInput | Prisma.ImportBatchOrderByWithRelationInput[];
    cursor?: Prisma.ImportBatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ImportBatchScalarFieldEnum | Prisma.ImportBatchScalarFieldEnum[];
};
export type ImportBatchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where?: Prisma.ImportBatchWhereInput;
    orderBy?: Prisma.ImportBatchOrderByWithRelationInput | Prisma.ImportBatchOrderByWithRelationInput[];
    cursor?: Prisma.ImportBatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ImportBatchScalarFieldEnum | Prisma.ImportBatchScalarFieldEnum[];
};
export type ImportBatchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where?: Prisma.ImportBatchWhereInput;
    orderBy?: Prisma.ImportBatchOrderByWithRelationInput | Prisma.ImportBatchOrderByWithRelationInput[];
    cursor?: Prisma.ImportBatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ImportBatchScalarFieldEnum | Prisma.ImportBatchScalarFieldEnum[];
};
export type ImportBatchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ImportBatchCreateInput, Prisma.ImportBatchUncheckedCreateInput>;
};
export type ImportBatchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ImportBatchCreateManyInput | Prisma.ImportBatchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ImportBatchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    data: Prisma.ImportBatchCreateManyInput | Prisma.ImportBatchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ImportBatchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ImportBatchUpdateInput, Prisma.ImportBatchUncheckedUpdateInput>;
    where: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ImportBatchUpdateManyMutationInput, Prisma.ImportBatchUncheckedUpdateManyInput>;
    where?: Prisma.ImportBatchWhereInput;
    limit?: number;
};
export type ImportBatchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ImportBatchUpdateManyMutationInput, Prisma.ImportBatchUncheckedUpdateManyInput>;
    where?: Prisma.ImportBatchWhereInput;
    limit?: number;
};
export type ImportBatchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where: Prisma.ImportBatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.ImportBatchCreateInput, Prisma.ImportBatchUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ImportBatchUpdateInput, Prisma.ImportBatchUncheckedUpdateInput>;
};
export type ImportBatchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportBatchWhereInput;
    limit?: number;
};
export type ImportBatch$tradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TradeSelect<ExtArgs> | null;
    omit?: Prisma.TradeOmit<ExtArgs> | null;
    include?: Prisma.TradeInclude<ExtArgs> | null;
    where?: Prisma.TradeWhereInput;
    orderBy?: Prisma.TradeOrderByWithRelationInput | Prisma.TradeOrderByWithRelationInput[];
    cursor?: Prisma.TradeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TradeScalarFieldEnum | Prisma.TradeScalarFieldEnum[];
};
export type ImportBatch$lotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseLotSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseLotOmit<ExtArgs> | null;
    include?: Prisma.PurchaseLotInclude<ExtArgs> | null;
    where?: Prisma.PurchaseLotWhereInput;
    orderBy?: Prisma.PurchaseLotOrderByWithRelationInput | Prisma.PurchaseLotOrderByWithRelationInput[];
    cursor?: Prisma.PurchaseLotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PurchaseLotScalarFieldEnum | Prisma.PurchaseLotScalarFieldEnum[];
};
export type ImportBatchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
};
//# sourceMappingURL=ImportBatch.d.ts.map