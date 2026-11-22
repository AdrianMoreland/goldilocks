import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type LiveStockMovementModel = runtime.Types.Result.DefaultSelection<Prisma.$LiveStockMovementPayload>;
export type AggregateLiveStockMovement = {
    _count: LiveStockMovementCountAggregateOutputType | null;
    _avg: LiveStockMovementAvgAggregateOutputType | null;
    _sum: LiveStockMovementSumAggregateOutputType | null;
    _min: LiveStockMovementMinAggregateOutputType | null;
    _max: LiveStockMovementMaxAggregateOutputType | null;
};
export type LiveStockMovementAvgAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    delta: number | null;
    qtyAfter: number | null;
    reversesId: number | null;
};
export type LiveStockMovementSumAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    delta: number | null;
    qtyAfter: number | null;
    reversesId: number | null;
};
export type LiveStockMovementMinAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    delta: number | null;
    qtyAfter: number | null;
    source: $Enums.LiveMovementSource | null;
    reference: string | null;
    reason: string | null;
    note: string | null;
    actor: string | null;
    at: Date | null;
    reversesId: number | null;
};
export type LiveStockMovementMaxAggregateOutputType = {
    id: number | null;
    lineId: number | null;
    delta: number | null;
    qtyAfter: number | null;
    source: $Enums.LiveMovementSource | null;
    reference: string | null;
    reason: string | null;
    note: string | null;
    actor: string | null;
    at: Date | null;
    reversesId: number | null;
};
export type LiveStockMovementCountAggregateOutputType = {
    id: number;
    lineId: number;
    delta: number;
    qtyAfter: number;
    source: number;
    reference: number;
    reason: number;
    note: number;
    actor: number;
    at: number;
    reversesId: number;
    _all: number;
};
export type LiveStockMovementAvgAggregateInputType = {
    id?: true;
    lineId?: true;
    delta?: true;
    qtyAfter?: true;
    reversesId?: true;
};
export type LiveStockMovementSumAggregateInputType = {
    id?: true;
    lineId?: true;
    delta?: true;
    qtyAfter?: true;
    reversesId?: true;
};
export type LiveStockMovementMinAggregateInputType = {
    id?: true;
    lineId?: true;
    delta?: true;
    qtyAfter?: true;
    source?: true;
    reference?: true;
    reason?: true;
    note?: true;
    actor?: true;
    at?: true;
    reversesId?: true;
};
export type LiveStockMovementMaxAggregateInputType = {
    id?: true;
    lineId?: true;
    delta?: true;
    qtyAfter?: true;
    source?: true;
    reference?: true;
    reason?: true;
    note?: true;
    actor?: true;
    at?: true;
    reversesId?: true;
};
export type LiveStockMovementCountAggregateInputType = {
    id?: true;
    lineId?: true;
    delta?: true;
    qtyAfter?: true;
    source?: true;
    reference?: true;
    reason?: true;
    note?: true;
    actor?: true;
    at?: true;
    reversesId?: true;
    _all?: true;
};
export type LiveStockMovementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockMovementWhereInput;
    orderBy?: Prisma.LiveStockMovementOrderByWithRelationInput | Prisma.LiveStockMovementOrderByWithRelationInput[];
    cursor?: Prisma.LiveStockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LiveStockMovementCountAggregateInputType;
    _avg?: LiveStockMovementAvgAggregateInputType;
    _sum?: LiveStockMovementSumAggregateInputType;
    _min?: LiveStockMovementMinAggregateInputType;
    _max?: LiveStockMovementMaxAggregateInputType;
};
export type GetLiveStockMovementAggregateType<T extends LiveStockMovementAggregateArgs> = {
    [P in keyof T & keyof AggregateLiveStockMovement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLiveStockMovement[P]> : Prisma.GetScalarType<T[P], AggregateLiveStockMovement[P]>;
};
export type LiveStockMovementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockMovementWhereInput;
    orderBy?: Prisma.LiveStockMovementOrderByWithAggregationInput | Prisma.LiveStockMovementOrderByWithAggregationInput[];
    by: Prisma.LiveStockMovementScalarFieldEnum[] | Prisma.LiveStockMovementScalarFieldEnum;
    having?: Prisma.LiveStockMovementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LiveStockMovementCountAggregateInputType | true;
    _avg?: LiveStockMovementAvgAggregateInputType;
    _sum?: LiveStockMovementSumAggregateInputType;
    _min?: LiveStockMovementMinAggregateInputType;
    _max?: LiveStockMovementMaxAggregateInputType;
};
export type LiveStockMovementGroupByOutputType = {
    id: number;
    lineId: number;
    delta: number;
    qtyAfter: number;
    source: $Enums.LiveMovementSource;
    reference: string | null;
    reason: string | null;
    note: string | null;
    actor: string;
    at: Date;
    reversesId: number | null;
    _count: LiveStockMovementCountAggregateOutputType | null;
    _avg: LiveStockMovementAvgAggregateOutputType | null;
    _sum: LiveStockMovementSumAggregateOutputType | null;
    _min: LiveStockMovementMinAggregateOutputType | null;
    _max: LiveStockMovementMaxAggregateOutputType | null;
};
export type GetLiveStockMovementGroupByPayload<T extends LiveStockMovementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LiveStockMovementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LiveStockMovementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LiveStockMovementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LiveStockMovementGroupByOutputType[P]>;
}>>;
export type LiveStockMovementWhereInput = {
    AND?: Prisma.LiveStockMovementWhereInput | Prisma.LiveStockMovementWhereInput[];
    OR?: Prisma.LiveStockMovementWhereInput[];
    NOT?: Prisma.LiveStockMovementWhereInput | Prisma.LiveStockMovementWhereInput[];
    id?: Prisma.IntFilter<"LiveStockMovement"> | number;
    lineId?: Prisma.IntFilter<"LiveStockMovement"> | number;
    delta?: Prisma.IntFilter<"LiveStockMovement"> | number;
    qtyAfter?: Prisma.IntFilter<"LiveStockMovement"> | number;
    source?: Prisma.EnumLiveMovementSourceFilter<"LiveStockMovement"> | $Enums.LiveMovementSource;
    reference?: Prisma.StringNullableFilter<"LiveStockMovement"> | string | null;
    reason?: Prisma.StringNullableFilter<"LiveStockMovement"> | string | null;
    note?: Prisma.StringNullableFilter<"LiveStockMovement"> | string | null;
    actor?: Prisma.StringFilter<"LiveStockMovement"> | string;
    at?: Prisma.DateTimeFilter<"LiveStockMovement"> | Date | string;
    reversesId?: Prisma.IntNullableFilter<"LiveStockMovement"> | number | null;
    line?: Prisma.XOR<Prisma.LiveStockLineScalarRelationFilter, Prisma.LiveStockLineWhereInput>;
};
export type LiveStockMovementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    qtyAfter?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    reference?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    reversesId?: Prisma.SortOrderInput | Prisma.SortOrder;
    line?: Prisma.LiveStockLineOrderByWithRelationInput;
};
export type LiveStockMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    reversesId?: number;
    AND?: Prisma.LiveStockMovementWhereInput | Prisma.LiveStockMovementWhereInput[];
    OR?: Prisma.LiveStockMovementWhereInput[];
    NOT?: Prisma.LiveStockMovementWhereInput | Prisma.LiveStockMovementWhereInput[];
    lineId?: Prisma.IntFilter<"LiveStockMovement"> | number;
    delta?: Prisma.IntFilter<"LiveStockMovement"> | number;
    qtyAfter?: Prisma.IntFilter<"LiveStockMovement"> | number;
    source?: Prisma.EnumLiveMovementSourceFilter<"LiveStockMovement"> | $Enums.LiveMovementSource;
    reference?: Prisma.StringNullableFilter<"LiveStockMovement"> | string | null;
    reason?: Prisma.StringNullableFilter<"LiveStockMovement"> | string | null;
    note?: Prisma.StringNullableFilter<"LiveStockMovement"> | string | null;
    actor?: Prisma.StringFilter<"LiveStockMovement"> | string;
    at?: Prisma.DateTimeFilter<"LiveStockMovement"> | Date | string;
    line?: Prisma.XOR<Prisma.LiveStockLineScalarRelationFilter, Prisma.LiveStockLineWhereInput>;
}, "id" | "reversesId">;
export type LiveStockMovementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    qtyAfter?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    reference?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    reversesId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.LiveStockMovementCountOrderByAggregateInput;
    _avg?: Prisma.LiveStockMovementAvgOrderByAggregateInput;
    _max?: Prisma.LiveStockMovementMaxOrderByAggregateInput;
    _min?: Prisma.LiveStockMovementMinOrderByAggregateInput;
    _sum?: Prisma.LiveStockMovementSumOrderByAggregateInput;
};
export type LiveStockMovementScalarWhereWithAggregatesInput = {
    AND?: Prisma.LiveStockMovementScalarWhereWithAggregatesInput | Prisma.LiveStockMovementScalarWhereWithAggregatesInput[];
    OR?: Prisma.LiveStockMovementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LiveStockMovementScalarWhereWithAggregatesInput | Prisma.LiveStockMovementScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"LiveStockMovement"> | number;
    lineId?: Prisma.IntWithAggregatesFilter<"LiveStockMovement"> | number;
    delta?: Prisma.IntWithAggregatesFilter<"LiveStockMovement"> | number;
    qtyAfter?: Prisma.IntWithAggregatesFilter<"LiveStockMovement"> | number;
    source?: Prisma.EnumLiveMovementSourceWithAggregatesFilter<"LiveStockMovement"> | $Enums.LiveMovementSource;
    reference?: Prisma.StringNullableWithAggregatesFilter<"LiveStockMovement"> | string | null;
    reason?: Prisma.StringNullableWithAggregatesFilter<"LiveStockMovement"> | string | null;
    note?: Prisma.StringNullableWithAggregatesFilter<"LiveStockMovement"> | string | null;
    actor?: Prisma.StringWithAggregatesFilter<"LiveStockMovement"> | string;
    at?: Prisma.DateTimeWithAggregatesFilter<"LiveStockMovement"> | Date | string;
    reversesId?: Prisma.IntNullableWithAggregatesFilter<"LiveStockMovement"> | number | null;
};
export type LiveStockMovementCreateInput = {
    delta: number;
    qtyAfter: number;
    source: $Enums.LiveMovementSource;
    reference?: string | null;
    reason?: string | null;
    note?: string | null;
    actor: string;
    at?: Date | string;
    reversesId?: number | null;
    line: Prisma.LiveStockLineCreateNestedOneWithoutMovementsInput;
};
export type LiveStockMovementUncheckedCreateInput = {
    id?: number;
    lineId: number;
    delta: number;
    qtyAfter: number;
    source: $Enums.LiveMovementSource;
    reference?: string | null;
    reason?: string | null;
    note?: string | null;
    actor: string;
    at?: Date | string;
    reversesId?: number | null;
};
export type LiveStockMovementUpdateInput = {
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.EnumLiveMovementSourceFieldUpdateOperationsInput | $Enums.LiveMovementSource;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reversesId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    line?: Prisma.LiveStockLineUpdateOneRequiredWithoutMovementsNestedInput;
};
export type LiveStockMovementUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    lineId?: Prisma.IntFieldUpdateOperationsInput | number;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.EnumLiveMovementSourceFieldUpdateOperationsInput | $Enums.LiveMovementSource;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reversesId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type LiveStockMovementCreateManyInput = {
    id?: number;
    lineId: number;
    delta: number;
    qtyAfter: number;
    source: $Enums.LiveMovementSource;
    reference?: string | null;
    reason?: string | null;
    note?: string | null;
    actor: string;
    at?: Date | string;
    reversesId?: number | null;
};
export type LiveStockMovementUpdateManyMutationInput = {
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.EnumLiveMovementSourceFieldUpdateOperationsInput | $Enums.LiveMovementSource;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reversesId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type LiveStockMovementUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    lineId?: Prisma.IntFieldUpdateOperationsInput | number;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.EnumLiveMovementSourceFieldUpdateOperationsInput | $Enums.LiveMovementSource;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reversesId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type LiveStockMovementListRelationFilter = {
    every?: Prisma.LiveStockMovementWhereInput;
    some?: Prisma.LiveStockMovementWhereInput;
    none?: Prisma.LiveStockMovementWhereInput;
};
export type LiveStockMovementOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LiveStockMovementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    qtyAfter?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    reversesId?: Prisma.SortOrder;
};
export type LiveStockMovementAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    qtyAfter?: Prisma.SortOrder;
    reversesId?: Prisma.SortOrder;
};
export type LiveStockMovementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    qtyAfter?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    reversesId?: Prisma.SortOrder;
};
export type LiveStockMovementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    qtyAfter?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    reversesId?: Prisma.SortOrder;
};
export type LiveStockMovementSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    qtyAfter?: Prisma.SortOrder;
    reversesId?: Prisma.SortOrder;
};
export type LiveStockMovementCreateNestedManyWithoutLineInput = {
    create?: Prisma.XOR<Prisma.LiveStockMovementCreateWithoutLineInput, Prisma.LiveStockMovementUncheckedCreateWithoutLineInput> | Prisma.LiveStockMovementCreateWithoutLineInput[] | Prisma.LiveStockMovementUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LiveStockMovementCreateOrConnectWithoutLineInput | Prisma.LiveStockMovementCreateOrConnectWithoutLineInput[];
    createMany?: Prisma.LiveStockMovementCreateManyLineInputEnvelope;
    connect?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
};
export type LiveStockMovementUncheckedCreateNestedManyWithoutLineInput = {
    create?: Prisma.XOR<Prisma.LiveStockMovementCreateWithoutLineInput, Prisma.LiveStockMovementUncheckedCreateWithoutLineInput> | Prisma.LiveStockMovementCreateWithoutLineInput[] | Prisma.LiveStockMovementUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LiveStockMovementCreateOrConnectWithoutLineInput | Prisma.LiveStockMovementCreateOrConnectWithoutLineInput[];
    createMany?: Prisma.LiveStockMovementCreateManyLineInputEnvelope;
    connect?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
};
export type LiveStockMovementUpdateManyWithoutLineNestedInput = {
    create?: Prisma.XOR<Prisma.LiveStockMovementCreateWithoutLineInput, Prisma.LiveStockMovementUncheckedCreateWithoutLineInput> | Prisma.LiveStockMovementCreateWithoutLineInput[] | Prisma.LiveStockMovementUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LiveStockMovementCreateOrConnectWithoutLineInput | Prisma.LiveStockMovementCreateOrConnectWithoutLineInput[];
    upsert?: Prisma.LiveStockMovementUpsertWithWhereUniqueWithoutLineInput | Prisma.LiveStockMovementUpsertWithWhereUniqueWithoutLineInput[];
    createMany?: Prisma.LiveStockMovementCreateManyLineInputEnvelope;
    set?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
    disconnect?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
    delete?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
    connect?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
    update?: Prisma.LiveStockMovementUpdateWithWhereUniqueWithoutLineInput | Prisma.LiveStockMovementUpdateWithWhereUniqueWithoutLineInput[];
    updateMany?: Prisma.LiveStockMovementUpdateManyWithWhereWithoutLineInput | Prisma.LiveStockMovementUpdateManyWithWhereWithoutLineInput[];
    deleteMany?: Prisma.LiveStockMovementScalarWhereInput | Prisma.LiveStockMovementScalarWhereInput[];
};
export type LiveStockMovementUncheckedUpdateManyWithoutLineNestedInput = {
    create?: Prisma.XOR<Prisma.LiveStockMovementCreateWithoutLineInput, Prisma.LiveStockMovementUncheckedCreateWithoutLineInput> | Prisma.LiveStockMovementCreateWithoutLineInput[] | Prisma.LiveStockMovementUncheckedCreateWithoutLineInput[];
    connectOrCreate?: Prisma.LiveStockMovementCreateOrConnectWithoutLineInput | Prisma.LiveStockMovementCreateOrConnectWithoutLineInput[];
    upsert?: Prisma.LiveStockMovementUpsertWithWhereUniqueWithoutLineInput | Prisma.LiveStockMovementUpsertWithWhereUniqueWithoutLineInput[];
    createMany?: Prisma.LiveStockMovementCreateManyLineInputEnvelope;
    set?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
    disconnect?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
    delete?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
    connect?: Prisma.LiveStockMovementWhereUniqueInput | Prisma.LiveStockMovementWhereUniqueInput[];
    update?: Prisma.LiveStockMovementUpdateWithWhereUniqueWithoutLineInput | Prisma.LiveStockMovementUpdateWithWhereUniqueWithoutLineInput[];
    updateMany?: Prisma.LiveStockMovementUpdateManyWithWhereWithoutLineInput | Prisma.LiveStockMovementUpdateManyWithWhereWithoutLineInput[];
    deleteMany?: Prisma.LiveStockMovementScalarWhereInput | Prisma.LiveStockMovementScalarWhereInput[];
};
export type EnumLiveMovementSourceFieldUpdateOperationsInput = {
    set?: $Enums.LiveMovementSource;
};
export type LiveStockMovementCreateWithoutLineInput = {
    delta: number;
    qtyAfter: number;
    source: $Enums.LiveMovementSource;
    reference?: string | null;
    reason?: string | null;
    note?: string | null;
    actor: string;
    at?: Date | string;
    reversesId?: number | null;
};
export type LiveStockMovementUncheckedCreateWithoutLineInput = {
    id?: number;
    delta: number;
    qtyAfter: number;
    source: $Enums.LiveMovementSource;
    reference?: string | null;
    reason?: string | null;
    note?: string | null;
    actor: string;
    at?: Date | string;
    reversesId?: number | null;
};
export type LiveStockMovementCreateOrConnectWithoutLineInput = {
    where: Prisma.LiveStockMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockMovementCreateWithoutLineInput, Prisma.LiveStockMovementUncheckedCreateWithoutLineInput>;
};
export type LiveStockMovementCreateManyLineInputEnvelope = {
    data: Prisma.LiveStockMovementCreateManyLineInput | Prisma.LiveStockMovementCreateManyLineInput[];
    skipDuplicates?: boolean;
};
export type LiveStockMovementUpsertWithWhereUniqueWithoutLineInput = {
    where: Prisma.LiveStockMovementWhereUniqueInput;
    update: Prisma.XOR<Prisma.LiveStockMovementUpdateWithoutLineInput, Prisma.LiveStockMovementUncheckedUpdateWithoutLineInput>;
    create: Prisma.XOR<Prisma.LiveStockMovementCreateWithoutLineInput, Prisma.LiveStockMovementUncheckedCreateWithoutLineInput>;
};
export type LiveStockMovementUpdateWithWhereUniqueWithoutLineInput = {
    where: Prisma.LiveStockMovementWhereUniqueInput;
    data: Prisma.XOR<Prisma.LiveStockMovementUpdateWithoutLineInput, Prisma.LiveStockMovementUncheckedUpdateWithoutLineInput>;
};
export type LiveStockMovementUpdateManyWithWhereWithoutLineInput = {
    where: Prisma.LiveStockMovementScalarWhereInput;
    data: Prisma.XOR<Prisma.LiveStockMovementUpdateManyMutationInput, Prisma.LiveStockMovementUncheckedUpdateManyWithoutLineInput>;
};
export type LiveStockMovementScalarWhereInput = {
    AND?: Prisma.LiveStockMovementScalarWhereInput | Prisma.LiveStockMovementScalarWhereInput[];
    OR?: Prisma.LiveStockMovementScalarWhereInput[];
    NOT?: Prisma.LiveStockMovementScalarWhereInput | Prisma.LiveStockMovementScalarWhereInput[];
    id?: Prisma.IntFilter<"LiveStockMovement"> | number;
    lineId?: Prisma.IntFilter<"LiveStockMovement"> | number;
    delta?: Prisma.IntFilter<"LiveStockMovement"> | number;
    qtyAfter?: Prisma.IntFilter<"LiveStockMovement"> | number;
    source?: Prisma.EnumLiveMovementSourceFilter<"LiveStockMovement"> | $Enums.LiveMovementSource;
    reference?: Prisma.StringNullableFilter<"LiveStockMovement"> | string | null;
    reason?: Prisma.StringNullableFilter<"LiveStockMovement"> | string | null;
    note?: Prisma.StringNullableFilter<"LiveStockMovement"> | string | null;
    actor?: Prisma.StringFilter<"LiveStockMovement"> | string;
    at?: Prisma.DateTimeFilter<"LiveStockMovement"> | Date | string;
    reversesId?: Prisma.IntNullableFilter<"LiveStockMovement"> | number | null;
};
export type LiveStockMovementCreateManyLineInput = {
    id?: number;
    delta: number;
    qtyAfter: number;
    source: $Enums.LiveMovementSource;
    reference?: string | null;
    reason?: string | null;
    note?: string | null;
    actor: string;
    at?: Date | string;
    reversesId?: number | null;
};
export type LiveStockMovementUpdateWithoutLineInput = {
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.EnumLiveMovementSourceFieldUpdateOperationsInput | $Enums.LiveMovementSource;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reversesId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type LiveStockMovementUncheckedUpdateWithoutLineInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.EnumLiveMovementSourceFieldUpdateOperationsInput | $Enums.LiveMovementSource;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reversesId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type LiveStockMovementUncheckedUpdateManyWithoutLineInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.EnumLiveMovementSourceFieldUpdateOperationsInput | $Enums.LiveMovementSource;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reversesId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type LiveStockMovementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lineId?: boolean;
    delta?: boolean;
    qtyAfter?: boolean;
    source?: boolean;
    reference?: boolean;
    reason?: boolean;
    note?: boolean;
    actor?: boolean;
    at?: boolean;
    reversesId?: boolean;
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockMovement"]>;
export type LiveStockMovementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lineId?: boolean;
    delta?: boolean;
    qtyAfter?: boolean;
    source?: boolean;
    reference?: boolean;
    reason?: boolean;
    note?: boolean;
    actor?: boolean;
    at?: boolean;
    reversesId?: boolean;
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockMovement"]>;
export type LiveStockMovementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lineId?: boolean;
    delta?: boolean;
    qtyAfter?: boolean;
    source?: boolean;
    reference?: boolean;
    reason?: boolean;
    note?: boolean;
    actor?: boolean;
    at?: boolean;
    reversesId?: boolean;
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveStockMovement"]>;
export type LiveStockMovementSelectScalar = {
    id?: boolean;
    lineId?: boolean;
    delta?: boolean;
    qtyAfter?: boolean;
    source?: boolean;
    reference?: boolean;
    reason?: boolean;
    note?: boolean;
    actor?: boolean;
    at?: boolean;
    reversesId?: boolean;
};
export type LiveStockMovementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "lineId" | "delta" | "qtyAfter" | "source" | "reference" | "reason" | "note" | "actor" | "at" | "reversesId", ExtArgs["result"]["liveStockMovement"]>;
export type LiveStockMovementInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
};
export type LiveStockMovementIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
};
export type LiveStockMovementIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    line?: boolean | Prisma.LiveStockLineDefaultArgs<ExtArgs>;
};
export type $LiveStockMovementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LiveStockMovement";
    objects: {
        line: Prisma.$LiveStockLinePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        lineId: number;
        delta: number;
        qtyAfter: number;
        source: $Enums.LiveMovementSource;
        reference: string | null;
        reason: string | null;
        note: string | null;
        actor: string;
        at: Date;
        reversesId: number | null;
    }, ExtArgs["result"]["liveStockMovement"]>;
    composites: {};
};
export type LiveStockMovementGetPayload<S extends boolean | null | undefined | LiveStockMovementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload, S>;
export type LiveStockMovementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LiveStockMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LiveStockMovementCountAggregateInputType | true;
};
export interface LiveStockMovementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LiveStockMovement'];
        meta: {
            name: 'LiveStockMovement';
        };
    };
    findUnique<T extends LiveStockMovementFindUniqueArgs>(args: Prisma.SelectSubset<T, LiveStockMovementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LiveStockMovementClient<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LiveStockMovementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LiveStockMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveStockMovementClient<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LiveStockMovementFindFirstArgs>(args?: Prisma.SelectSubset<T, LiveStockMovementFindFirstArgs<ExtArgs>>): Prisma.Prisma__LiveStockMovementClient<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LiveStockMovementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LiveStockMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveStockMovementClient<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LiveStockMovementFindManyArgs>(args?: Prisma.SelectSubset<T, LiveStockMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LiveStockMovementCreateArgs>(args: Prisma.SelectSubset<T, LiveStockMovementCreateArgs<ExtArgs>>): Prisma.Prisma__LiveStockMovementClient<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LiveStockMovementCreateManyArgs>(args?: Prisma.SelectSubset<T, LiveStockMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LiveStockMovementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LiveStockMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LiveStockMovementDeleteArgs>(args: Prisma.SelectSubset<T, LiveStockMovementDeleteArgs<ExtArgs>>): Prisma.Prisma__LiveStockMovementClient<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LiveStockMovementUpdateArgs>(args: Prisma.SelectSubset<T, LiveStockMovementUpdateArgs<ExtArgs>>): Prisma.Prisma__LiveStockMovementClient<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LiveStockMovementDeleteManyArgs>(args?: Prisma.SelectSubset<T, LiveStockMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LiveStockMovementUpdateManyArgs>(args: Prisma.SelectSubset<T, LiveStockMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LiveStockMovementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LiveStockMovementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LiveStockMovementUpsertArgs>(args: Prisma.SelectSubset<T, LiveStockMovementUpsertArgs<ExtArgs>>): Prisma.Prisma__LiveStockMovementClient<runtime.Types.Result.GetResult<Prisma.$LiveStockMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LiveStockMovementCountArgs>(args?: Prisma.Subset<T, LiveStockMovementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LiveStockMovementCountAggregateOutputType> : number>;
    aggregate<T extends LiveStockMovementAggregateArgs>(args: Prisma.Subset<T, LiveStockMovementAggregateArgs>): Prisma.PrismaPromise<GetLiveStockMovementAggregateType<T>>;
    groupBy<T extends LiveStockMovementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LiveStockMovementGroupByArgs['orderBy'];
    } : {
        orderBy?: LiveStockMovementGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LiveStockMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLiveStockMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LiveStockMovementFieldRefs;
}
export interface Prisma__LiveStockMovementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    line<T extends Prisma.LiveStockLineDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LiveStockLineDefaultArgs<ExtArgs>>): Prisma.Prisma__LiveStockLineClient<runtime.Types.Result.GetResult<Prisma.$LiveStockLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LiveStockMovementFieldRefs {
    readonly id: Prisma.FieldRef<"LiveStockMovement", 'Int'>;
    readonly lineId: Prisma.FieldRef<"LiveStockMovement", 'Int'>;
    readonly delta: Prisma.FieldRef<"LiveStockMovement", 'Int'>;
    readonly qtyAfter: Prisma.FieldRef<"LiveStockMovement", 'Int'>;
    readonly source: Prisma.FieldRef<"LiveStockMovement", 'LiveMovementSource'>;
    readonly reference: Prisma.FieldRef<"LiveStockMovement", 'String'>;
    readonly reason: Prisma.FieldRef<"LiveStockMovement", 'String'>;
    readonly note: Prisma.FieldRef<"LiveStockMovement", 'String'>;
    readonly actor: Prisma.FieldRef<"LiveStockMovement", 'String'>;
    readonly at: Prisma.FieldRef<"LiveStockMovement", 'DateTime'>;
    readonly reversesId: Prisma.FieldRef<"LiveStockMovement", 'Int'>;
}
export type LiveStockMovementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    include?: Prisma.LiveStockMovementInclude<ExtArgs> | null;
    where: Prisma.LiveStockMovementWhereUniqueInput;
};
export type LiveStockMovementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    include?: Prisma.LiveStockMovementInclude<ExtArgs> | null;
    where: Prisma.LiveStockMovementWhereUniqueInput;
};
export type LiveStockMovementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveStockMovementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveStockMovementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveStockMovementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    include?: Prisma.LiveStockMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockMovementCreateInput, Prisma.LiveStockMovementUncheckedCreateInput>;
};
export type LiveStockMovementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LiveStockMovementCreateManyInput | Prisma.LiveStockMovementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LiveStockMovementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    data: Prisma.LiveStockMovementCreateManyInput | Prisma.LiveStockMovementCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LiveStockMovementIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LiveStockMovementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    include?: Prisma.LiveStockMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockMovementUpdateInput, Prisma.LiveStockMovementUncheckedUpdateInput>;
    where: Prisma.LiveStockMovementWhereUniqueInput;
};
export type LiveStockMovementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LiveStockMovementUpdateManyMutationInput, Prisma.LiveStockMovementUncheckedUpdateManyInput>;
    where?: Prisma.LiveStockMovementWhereInput;
    limit?: number;
};
export type LiveStockMovementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveStockMovementUpdateManyMutationInput, Prisma.LiveStockMovementUncheckedUpdateManyInput>;
    where?: Prisma.LiveStockMovementWhereInput;
    limit?: number;
    include?: Prisma.LiveStockMovementIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LiveStockMovementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    include?: Prisma.LiveStockMovementInclude<ExtArgs> | null;
    where: Prisma.LiveStockMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveStockMovementCreateInput, Prisma.LiveStockMovementUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LiveStockMovementUpdateInput, Prisma.LiveStockMovementUncheckedUpdateInput>;
};
export type LiveStockMovementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    include?: Prisma.LiveStockMovementInclude<ExtArgs> | null;
    where: Prisma.LiveStockMovementWhereUniqueInput;
};
export type LiveStockMovementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveStockMovementWhereInput;
    limit?: number;
};
export type LiveStockMovementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveStockMovementSelect<ExtArgs> | null;
    omit?: Prisma.LiveStockMovementOmit<ExtArgs> | null;
    include?: Prisma.LiveStockMovementInclude<ExtArgs> | null;
};
//# sourceMappingURL=LiveStockMovement.d.ts.map