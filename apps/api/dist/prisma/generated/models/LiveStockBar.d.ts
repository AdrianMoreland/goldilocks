import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type LiveStockBarModel = runtime.Types.Result.DefaultSelection<Prisma.$LiveStockBarPayload>;
export type AggregateLiveStockBar = {
    _count: LiveStockBarCountAggregateOutputType | null;
    _avg: LiveStockBarAvgAggregateOutputType | null;
    _sum: LiveStockBarSumAggregateOutputType | null;
    _min: LiveStockBarMinAggregateOutputType | null;
    _max: LiveStockBarMaxAggregateOutputType | null;
};
export type LiveStockBarAvgAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    grams: runtime.Decimal | null;
};
export type LiveStockBarSumAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    grams: runtime.Decimal | null;
};
export type LiveStockBarMinAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    serial: string | null;
    serialKey: string | null;
    grams: runtime.Decimal | null;
    details: string | null;
    status: $Enums.LiveBarStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LiveStockBarMaxAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    serial: string | null;
    serialKey: string | null;
    grams: runtime.Decimal | null;
    details: string | null;
    status: $Enums.LiveBarStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LiveStockBarCountAggregateOutputType = {
    id: number;
    lineId: number;
    serial: number;
    serialKey: number;
    grams: number;
    details: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type LiveStockBarAvgAggregateInputType = {
    id?: true;
    lineId?: true;
    grams?: true;
};
export type LiveStockBarSumAggregateInputType = {
    id?: true;
    lineId?: true;
    grams?: true;
};
export type LiveStockBarMinAggregateInputType = {
    id?: true;
    lineId?: true;
    serial?: true;
    serialKey?: true;
    grams?: true;
    details?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LiveStockBarMaxAggregateInputType = {
    id?: true;
    lineId?: true;
    serial?: true;
    serialKey?: true;
    grams?: true;
    details?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LiveStockBarCountAggregateInputType = {
    id?: true;
    lineId?: true;
    serial?: true;
    serialKey?: true;
    grams?: true;
    details?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type LiveStockBarAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockBarWhereInput;
    orderBy?: Prisma.LiveStockBarOrderByWithRelationInput | Prisma.LiveStockBarOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockBarWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LiveStockBarCountAggregateInputType;
    _avg?: LiveStockBarAvgAggregateInputType;
    _sum?: LiveStockBarSumAggregateInputType;
    _min?: LiveStockBarMinAggregateInputType;
    _max?: LiveStockBarMaxAggregateInputType;
};
export type GetLiveStockBarAggregateType<T extends LiveStockBarAggregateArgs> = {
    [P in keyof T & keyof AggregateLiveStockBar]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLiveStockBar[P]> : Prisma.GetScalarType<T[P], AggregateLiveStockBar[P]>;
};
export type LiveStockBarGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockBarWhereInput;
    orderBy?: Prisma.LiveStockBarOrderByWithAggregationInput | Prisma.LiveStockBarOrderByWithAggregationInput[];
    by: Prisma.LiveStockBarScalarFieldEnum[] | Prisma.LiveStockBarScalarFieldEnum;
    having?: Prisma.LiveStockBarScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LiveStockBarCountAggregateInputType | true;
    _avg?: LiveStockBarAvgAggregateInputType;
    _sum?: LiveStockBarSumAggregateInputType;
    _min?: LiveStockBarMinAggregateInputType;
    _max?: LiveStockBarMaxAggregateInputType;
};
export type LiveStockBarGroupByOutputType = {
    id: number;
    lineId: number;
    serial: string;
    serialKey: string;
    grams: runtime.Decimal | null;
    details: string | null;
    status: $Enums.LiveBarStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: LiveStockBarCountAggregateOutputType | null;
    _avg: LiveStockBarAvgAggregateOutputType | null;
    _sum: LiveStockBarSumAggregateOutputType | null;
    _min: LiveStockBarMinAggregateOutputType | null;
    _max: LiveStockBarMaxAggregateOutputType | null;
};
export type GetLiveStockBarGroupByPayload<T extends LiveStockBarGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LiveStockBarGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LiveStockBarGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LiveStockBarGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LiveStockBarGroupByOutputType[P]>;
}>>;
export type LiveStockBarWhereInput = {
    AND?: Prisma.LiveStockBarWhereInput | Prisma.LiveStockBarWhereInput[];
    OR?: Prisma.LiveStockBarWhereInput[];
    NOT?: Prisma.LiveStockBarWhereInput | Prisma.LiveStockBarWhereInput[];
    id?: Prisma.IntFilter<"LiveStockBar"> | number;
    lineId?: Prisma.IntFilter<"LiveStockBar"> | number;
    serial?: Prisma.StringFilter<"LiveStockBar"> | string;
    serialKey?: Prisma.StringFilter<"LiveStockBar"> | string;
    grams?: Prisma.DecimalNullableFilter<"LiveStockBar"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.StringNullableFilter<"LiveStockBar"> | string | null;
    status?: Prisma.EnumLiveBarStatusFilter<"LiveStockBar"> | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFilter<"LiveStockBar"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LiveStockBar"> | Date | string;
    line?: Prisma.XOR<Prisma.LiveStockLineScalarRelationFilter, Prisma.LiveStockLineWhereInput>;
};
export type LiveStockBarOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    grams?: Prisma.SortOrderInput | Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    line?: Prisma.LiveStockLineOrderByWithRelationInput;
};
export type LiveStockBarWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.LiveStockBarWhereInput | Prisma.LiveStockBarWhereInput[];
    OR?: Prisma.LiveStockBarWhereInput[];
    NOT?: Prisma.LiveStockBarWhereInput | Prisma.LiveStockBarWhereInput[];
    lineId?: Prisma.IntFilter<"LiveStockBar"> | number;
    serial?: Prisma.StringFilter<"LiveStockBar"> | string;
    serialKey?: Prisma.StringFilter<"LiveStockBar"> | string;
    grams?: Prisma.DecimalNullableFilter<"LiveStockBar"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.StringNullableFilter<"LiveStockBar"> | string | null;
    status?: Prisma.EnumLiveBarStatusFilter<"LiveStockBar"> | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFilter<"LiveStockBar"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LiveStockBar"> | Date | string;
    line?: Prisma.XOR<Prisma.LiveStockLineScalarRelationFilter, Prisma.LiveStockLineWhereInput>;
}, "id">;
export type LiveStockBarOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    grams?: Prisma.SortOrderInput | Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.LiveStockBarCountOrderByAggregateInput;
    _avg?: Prisma.LiveStockBarAvgOrderByAggregateInput;
    _max?: Prisma.LiveStockBarMaxOrderByAggregateInput;
    _min?: Prisma.LiveStockBarMinOrderByAggregateInput;
    _sum?: Prisma.LiveStockBarSumOrderByAggregateInput;
};
export type LiveStockBarScalarWhereWithAggregatesInput = {
    AND?: Prisma.LiveStockBarScalarWhereWithAggregatesInput | Prisma.LiveStockBarScalarWhereWithAggregatesInput[];
    OR?: Prisma.LiveStockBarScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LiveStockBarScalarWhereWithAggregatesInput | Prisma.LiveStockBarScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"LiveStockBar"> | number;
    lineId?: Prisma.IntWithAggregatesFilter<"LiveStockBar"> | number;
    serial?: Prisma.StringWithAggregatesFilter<"LiveStockBar"> | string;
    serialKey?: Prisma.StringWithAggregatesFilter<"LiveStockBar"> | string;
    grams?: Prisma.DecimalNullableWithAggregatesFilter<"LiveStockBar"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.StringNullableWithAggregatesFilter<"LiveStockBar"> | string | null;
    status?: Prisma.EnumLiveBarStatusWithAggregatesFilter<"LiveStockBar"> | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LiveStockBar"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LiveStockBar"> | Date | string;
};
export type LiveStockBarCreateInput = {
    serial: string;
    serialKey: string;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.LiveBarStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    line: Prisma.LiveStockLineCreateNestedOneWithoutBarsInput;
};
export type LiveStockBarUncheckedCreateInput = {
    id?: number;
    lineId: number;
    serial: string;
    serialKey: string;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.LiveBarStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LiveStockBarUpdateInput = {
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLiveBarStatusFieldUpdateOperationsInput | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    line?: Prisma.LiveStockLineUpdateOneRequiredWithoutBarsNestedInput;
};
export type LiveStockBarUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    lineId?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLiveBarStatusFieldUpdateOperationsInput | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBarCreateManyInput = {
    id?: number;
    lineId: number;
    serial: string;
    serialKey: string;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.LiveBarStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LiveStockBarUpdateManyMutationInput = {
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLiveBarStatusFieldUpdateOperationsInput | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBarUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    lineId?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLiveBarStatusFieldUpdateOperationsInput | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBarListRelationFilter = {
    every?: Prisma.LiveStockBarWhereInput;
    some?: Prisma.LiveStockBarWhereInput;
    none?: Prisma.LiveStockBarWhereInput;
};
export type LiveStockBarOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LiveStockBarCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LiveStockBarAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
};
export type LiveStockBarMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LiveStockBarMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LiveStockBarSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    grams?: Prisma.SortOrder;
};
export type LiveStockBarCreateNestedManyWithoutLineInput = {
    create?: Prisma.XOR<Prisma.LiveStockBarCreateWithoutLineInput, Prisma.LiveStockBarUncheckedCreateWithoutLineInput> | Prisma.LiveStockBarCreateWithoutLineInput[] | Prisma.LiveStockBarUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LiveStockBarCreateOrConnectWithoutLineInput | Prisma.LiveStockBarCreateOrConnectWithoutLineInput[];
    createMany?: Prisma.LiveStockBarCreateManyLineInputEnvelope;
    connect?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
};
export type LiveStockBarUncheckedCreateNestedManyWithoutLineInput = {
    create?: Prisma.XOR<Prisma.LiveStockBarCreateWithoutLineInput, Prisma.LiveStockBarUncheckedCreateWithoutLineInput> | Prisma.LiveStockBarCreateWithoutLineInput[] | Prisma.LiveStockBarUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LiveStockBarCreateOrConnectWithoutLineInput | Prisma.LiveStockBarCreateOrConnectWithoutLineInput[];
    createMany?: Prisma.LiveStockBarCreateManyLineInputEnvelope;
    connect?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
};
export type LiveStockBarUpdateManyWithoutLineNestedInput = {
    create?: Prisma.XOR<Prisma.LiveStockBarCreateWithoutLineInput, Prisma.LiveStockBarUncheckedCreateWithoutLineInput> | Prisma.LiveStockBarCreateWithoutLineInput[] | Prisma.LiveStockBarUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LiveStockBarCreateOrConnectWithoutLineInput | Prisma.LiveStockBarCreateOrConnectWithoutLineInput[];
    upsert?: Prisma.LiveStockBarUpsertWithWhereUniqueWithoutLineInput | Prisma.LiveStockBarUpsertWithWhereUniqueWithoutLineInput[];
    createMany?: Prisma.LiveStockBarCreateManyLineInputEnvelope;
    set?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
    disconnect?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
    delete?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
    connect?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
    update?: Prisma.LiveStockBarUpdateWithWhereUniqueWithoutLineInput | Prisma.LiveStockBarUpdateWithWhereUniqueWithoutLineInput[];
    updateMany?: Prisma.LiveStockBarUpdateManyWithWhereWithoutLineInput | Prisma.LiveStockBarUpdateManyWithWhereWithoutLineInput[];
    deleteMany?: Prisma.LiveStockBarScalarWhereInput | Prisma.LiveStockBarScalarWhereInput[];
};
export type LiveStockBarUncheckedUpdateManyWithoutLineNestedInput = {
    create?: Prisma.XOR<Prisma.LiveStockBarCreateWithoutLineInput, Prisma.LiveStockBarUncheckedCreateWithoutLineInput> | Prisma.LiveStockBarCreateWithoutLineInput[] | Prisma.LiveStockBarUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LiveStockBarCreateOrConnectWithoutLineInput | Prisma.LiveStockBarCreateOrConnectWithoutLineInput[];
    upsert?: Prisma.LiveStockBarUpsertWithWhereUniqueWithoutLineInput | Prisma.LiveStockBarUpsertWithWhereUniqueWithoutLineInput[];
    createMany?: Prisma.LiveStockBarCreateManyLineInputEnvelope;
    set?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
    disconnect?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
    delete?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
    connect?: Prisma.LiveStockBarWhereUniqueInput | Prisma.LiveStockBarWhereUniqueInput[];
    update?: Prisma.LiveStockBarUpdateWithWhereUniqueWithoutLineInput | Prisma.LiveStockBarUpdateWithWhereUniqueWithoutLineInput[];
    updateMany?: Prisma.LiveStockBarUpdateManyWithWhereWithoutLineInput | Prisma.LiveStockBarUpdateManyWithWhereWithoutLineInput[];
    deleteMany?: Prisma.LiveStockBarScalarWhereInput | Prisma.LiveStockBarScalarWhereInput[];
};
export type EnumLiveBarStatusFieldUpdateOperationsInput = {
    set?: $Enums.LiveBarStatus;
};
export type LiveStockBarCreateWithoutLineInput = {
    serial: string;
    serialKey: string;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.LiveBarStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LiveStockBarUncheckedCreateWithoutLineInput = {
    id?: number;
    serial: string;
    serialKey: string;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.LiveBarStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LiveStockBarCreateOrConnectWithoutLineInput = {
    where: Prisma.LiveStockBarWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockBarCreateWithoutLineInput, Prisma.LiveStockBarUncheckedCreateWithoutLineInput>;
};
export type LiveStockBarCreateManyLineInputEnvelope = {
    data: Prisma.LiveStockBarCreateManyLineInput | Prisma.LiveStockBarCreateManyLineInput[];
    skipDuplicates?: boolean;
};
export type LiveStockBarUpsertWithWhereUniqueWithoutLineInput = {
    where: Prisma.LiveStockBarWhereUniqueInput;
    update: Prisma.XOR<Prisma.LiveStockBarUpdateWithoutLineInput, Prisma.LiveStockBarUncheckedUpdateWithoutLineInput>;
    create: Prisma.XOR<Prisma.LiveStockBarCreateWithoutLineInput, Prisma.LiveStockBarUncheckedCreateWithoutLineInput>;
};
export type LiveStockBarUpdateWithWhereUniqueWithoutLineInput = {
    where: Prisma.LiveStockBarWhereUniqueInput;
    data: Prisma.XOR<Prisma.LiveStockBarUpdateWithoutLineInput, Prisma.LiveStockBarUncheckedUpdateWithoutLineInput>;
};
export type LiveStockBarUpdateManyWithWhereWithoutLineInput = {
    where: Prisma.LiveStockBarScalarWhereInput;
    data: Prisma.XOR<Prisma.LiveStockBarUpdateManyMutationInput, Prisma.LiveStockBarUncheckedUpdateManyWithoutLineInput>;
};
export type LiveStockBarScalarWhereInput = {
    AND?: Prisma.LiveStockBarScalarWhereInput | Prisma.LiveStockBarScalarWhereInput[];
    OR?: Prisma.LiveStockBarScalarWhereInput[];
    NOT?: Prisma.LiveStockBarScalarWhereInput | Prisma.LiveStockBarScalarWhereInput[];
    id?: Prisma.IntFilter<"LiveStockBar"> | number;
    lineId?: Prisma.IntFilter<"LiveStockBar"> | number;
    serial?: Prisma.StringFilter<"LiveStockBar"> | string;
    serialKey?: Prisma.StringFilter<"LiveStockBar"> | string;
    grams?: Prisma.DecimalNullableFilter<"LiveStockBar"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.StringNullableFilter<"LiveStockBar"> | string | null;
    status?: Prisma.EnumLiveBarStatusFilter<"LiveStockBar"> | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFilter<"LiveStockBar"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LiveStockBar"> | Date | string;
};
export type LiveStockBarCreateManyLineInput = {
    id?: number;
    serial: string;
    serialKey: string;
    grams?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: string | null;
    status?: $Enums.LiveBarStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LiveStockBarUpdateWithoutLineInput = {
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLiveBarStatusFieldUpdateOperationsInput | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBarUncheckedUpdateWithoutLineInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLiveBarStatusFieldUpdateOperationsInput | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBarUncheckedUpdateManyWithoutLineInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    grams?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLiveBarStatusFieldUpdateOperationsInput | $Enums.LiveBarStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LiveStockBarSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lineId?: boolean;
    serial?: boolean;
    serialKey?: boolean;
    grams?: boolean;
    details?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockBar"]>;
export type LiveStockBarSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lineId?: boolean;
    serial?: boolean;
    serialKey?: boolean;
    grams?: boolean;
    details?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockBar"]>;
export type LiveStockBarSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lineId?: boolean;
    serial?: boolean;
    serialKey?: boolean;
    grams?: boolean;
    details?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockBar"]>;
export type LiveStockBarSelectScalar = {
    id?: boolean;
    lineId?: boolean;
    serial?: boolean;
    serialKey?: boolean;
    grams?: boolean;
    details?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type LiveStockBarOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "lineId" | "serial" | "serialKey" | "grams" | "details" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["liveStockBar"]>;
export type LiveStockBarInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
};
export type LiveStockBarIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
};
export type LiveStockBarIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
};
export type $LiveStockBarPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LiveStockBar";
    objects: {
        line: Prisma.$LiveStockLinePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        lineId: number;
        serial: string;
        serialKey: string;
        grams: runtime.Decimal | null;
        details: string | null;
        status: $Enums.LiveBarStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["liveStockBar"]>;
    composites: {};
};
export type LiveStockBarGetPayload<S extends boolean | null | undefined | LiveStockBarDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload, S>;
export type LiveStockBarCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LiveStockBarFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LiveStockBarCountAggregateInputType | true;
};
export interface LiveStockBarDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LiveStockBar'];
        meta: {
            name: 'LiveStockBar';
        };
    };
    findUnique<T extends LiveStockBarFindUniqueArgs>(args: Prisma.SelectSubset<T, LiveStockBarFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LiveStockBarClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LiveStockBarFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LiveStockBarFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveStockBarClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LiveStockBarFindFirstArgs>(args?: Prisma.SelectSubset<T, LiveStockBarFindFirstArgs<ExtArgs>>): Prisma.Prisma__LiveStockBarClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LiveStockBarFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LiveStockBarFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveStockBarClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LiveStockBarFindManyArgs>(args?: Prisma.SelectSubset<T, LiveStockBarFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LiveStockBarCreateArgs>(args: Prisma.SelectSubset<T, LiveStockBarCreateArgs<ExtArgs>>): Prisma.Prisma__LiveStockBarClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LiveStockBarCreateManyArgs>(args?: Prisma.SelectSubset<T, LiveStockBarCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LiveStockBarCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LiveStockBarCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LiveStockBarDeleteArgs>(args: Prisma.SelectSubset<T, LiveStockBarDeleteArgs<ExtArgs>>): Prisma.Prisma__LiveStockBarClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LiveStockBarUpdateArgs>(args: Prisma.SelectSubset<T, LiveStockBarUpdateArgs<ExtArgs>>): Prisma.Prisma__LiveStockBarClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LiveStockBarDeleteManyArgs>(args?: Prisma.SelectSubset<T, LiveStockBarDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LiveStockBarUpdateManyArgs>(args: Prisma.SelectSubset<T, LiveStockBarUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LiveStockBarUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LiveStockBarUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LiveStockBarUpsertArgs>(args: Prisma.SelectSubset<T, LiveStockBarUpsertArgs<ExtArgs>>): Prisma.Prisma__LiveStockBarClient<runtime.Types.Result.GetResult<Prisma.$LiveStockBarPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LiveStockBarCountArgs>(args?: Prisma.Subset<T, LiveStockBarCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LiveStockBarCountAggregateOutputType> : number>;
    aggregate<T extends LiveStockBarAggregateArgs>(args: Prisma.Subset<T, LiveStockBarAggregateArgs>): Prisma.PrismaPromise<GetLiveStockBarAggregateType<T>>;
    groupBy<T extends LiveStockBarGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LiveStockBarGroupByArgs['orderBy'];
    } : {
        orderBy?: LiveStockBarGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LiveStockBarGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLiveStockBarGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LiveStockBarFieldRefs;
}
export interface Prisma__LiveStockBarClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    line<T extends Prisma.LiveStockLineDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LiveStockLineDefaultArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LiveStockBarFieldRefs {
    readonly id: Prisma.FieldRef<"LiveStockBar", 'Int'>;
    readonly lineId: Prisma.FieldRef<"LiveStockBar", 'Int'>;
    readonly serial: Prisma.FieldRef<"LiveStockBar", 'String'>;
    readonly serialKey: Prisma.FieldRef<"LiveStockBar", 'String'>;
    readonly grams: Prisma.FieldRef<"LiveStockBar", 'Decimal'>;
    readonly details: Prisma.FieldRef<"LiveStockBar", 'String'>;
    readonly status: Prisma.FieldRef<"LiveStockBar", 'LiveBarStatus'>;
    readonly createdAt: Prisma.FieldRef<"LiveStockBar", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"LiveStockBar", 'DateTime'>;
}
export type LiveStockBarFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBarInclude<ExtArgs> | null;
    where: Prisma.LiveStockBarWhereUniqueInput;
};
export type LiveStockBarFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBarInclude<ExtArgs> | null;
    where: Prisma.LiveStockBarWhereUniqueInput;
};
export type LiveStockBarFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveStockBarFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveStockBarFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveStockBarCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBarInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockBarCreateInput, Prisma.LiveStockBarUncheckedCreateInput>;
};
export type LiveStockBarCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LiveStockBarCreateManyInput | Prisma.LiveStockBarCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LiveStockBarCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    data: Prisma.LiveStockBarCreateManyInput | Prisma.LiveStockBarCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LiveStockBarIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LiveStockBarUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBarInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockBarUpdateInput, Prisma.LiveStockBarUncheckedUpdateInput>;
    where: Prisma.LiveStockBarWhereUniqueInput;
};
export type LiveStockBarUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LiveStockBarUpdateManyMutationInput, Prisma.LiveStockBarUncheckedUpdateManyInput>;
    where?: Prisma.LiveStockBarWhereInput;
    limit?: number;
};
export type LiveStockBarUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockBarUpdateManyMutationInput, Prisma.LiveStockBarUncheckedUpdateManyInput>;
    where?: Prisma.LiveStockBarWhereInput;
    limit?: number;
    include?: Prisma.LiveStockBarIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LiveStockBarUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBarInclude<ExtArgs> | null;
    where: Prisma.LiveStockBarWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockBarCreateInput, Prisma.LiveStockBarUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LiveStockBarUpdateInput, Prisma.LiveStockBarUncheckedUpdateInput>;
};
export type LiveStockBarDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBarInclude<ExtArgs> | null;
    where: Prisma.LiveStockBarWhereUniqueInput;
};
export type LiveStockBarDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockBarWhereInput;
    limit?: number;
};
export type LiveStockBarDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockBarSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockBarOmit<ExtArgs> | null;
    include?: Prisma.LiveStockBarInclude<ExtArgs> | null;
};
//# sourceMappingURL=LiveStockBar.d.ts.map