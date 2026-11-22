import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ItemEventModel = runtime.Types.Result.DefaultSelection<Prisma.$ItemEventPayload>;
export type AggregateItemEvent = {
    _count: ItemEventCountAggregateOutputType | null;
    _avg: ItemEventAvgAggregateOutputType | null;
    _sum: ItemEventSumAggregateOutputType | null;
    _min: ItemEventMinAggregateOutputType | null;
    _max: ItemEventMaxAggregateOutputType | null;
};
export type ItemEventAvgAggregateOutputType = {
    id: number | null;
    itemId: number | null;
    customerId: number | null;
    tradeId: number | null;
    quantity: runtime.Decimal | null;
    amount: runtime.Decimal | null;
};
export type ItemEventSumAggregateOutputType = {
    id: number | null;
    itemId: number | null;
    customerId: number | null;
    tradeId: number | null;
    quantity: runtime.Decimal | null;
    amount: runtime.Decimal | null;
};
export type ItemEventMinAggregateOutputType = {
    id: number | null;
    itemId: number | null;
    kind: $Enums.ItemEventKind | null;
    date: Date | null;
    source: $Enums.ItemEventSource | null;
    sourceRef: string | null;
    sourceKey: string | null;
    locationCode: string | null;
    partyNo: string | null;
    customerId: number | null;
    tradeId: number | null;
    quantity: runtime.Decimal | null;
    amount: runtime.Decimal | null;
    createdAt: Date | null;
};
export type ItemEventMaxAggregateOutputType = {
    id: number | null;
    itemId: number | null;
    kind: $Enums.ItemEventKind | null;
    date: Date | null;
    source: $Enums.ItemEventSource | null;
    sourceRef: string | null;
    sourceKey: string | null;
    locationCode: string | null;
    partyNo: string | null;
    customerId: number | null;
    tradeId: number | null;
    quantity: runtime.Decimal | null;
    amount: runtime.Decimal | null;
    createdAt: Date | null;
};
export type ItemEventCountAggregateOutputType = {
    id: number;
    itemId: number;
    kind: number;
    date: number;
    source: number;
    sourceRef: number;
    sourceKey: number;
    locationCode: number;
    partyNo: number;
    customerId: number;
    tradeId: number;
    quantity: number;
    amount: number;
    createdAt: number;
    _all: number;
};
export type ItemEventAvgAggregateInputType = {
    id?: true;
    itemId?: true;
    customerId?: true;
    tradeId?: true;
    quantity?: true;
    amount?: true;
};
export type ItemEventSumAggregateInputType = {
    id?: true;
    itemId?: true;
    customerId?: true;
    tradeId?: true;
    quantity?: true;
    amount?: true;
};
export type ItemEventMinAggregateInputType = {
    id?: true;
    itemId?: true;
    kind?: true;
    date?: true;
    source?: true;
    sourceRef?: true;
    sourceKey?: true;
    locationCode?: true;
    partyNo?: true;
    customerId?: true;
    tradeId?: true;
    quantity?: true;
    amount?: true;
    createdAt?: true;
};
export type ItemEventMaxAggregateInputType = {
    id?: true;
    itemId?: true;
    kind?: true;
    date?: true;
    source?: true;
    sourceRef?: true;
    sourceKey?: true;
    locationCode?: true;
    partyNo?: true;
    customerId?: true;
    tradeId?: true;
    quantity?: true;
    amount?: true;
    createdAt?: true;
};
export type ItemEventCountAggregateInputType = {
    id?: true;
    itemId?: true;
    kind?: true;
    date?: true;
    source?: true;
    sourceRef?: true;
    sourceKey?: true;
    locationCode?: true;
    partyNo?: true;
    customerId?: true;
    tradeId?: true;
    quantity?: true;
    amount?: true;
    createdAt?: true;
    _all?: true;
};
export type ItemEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemEventWhereInput;
    orderBy?: Prisma.ItemEventOrderByWithRelationInput | Prisma.ItemEventOrderByWithRelationInput[];
    cursor?: Prisma.ItemEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ItemEventCountAggregateInputType;
    _avg?: ItemEventAvgAggregateInputType;
    _sum?: ItemEventSumAggregateInputType;
    _min?: ItemEventMinAggregateInputType;
    _max?: ItemEventMaxAggregateInputType;
};
export type GetItemEventAggregateType<T extends ItemEventAggregateArgs> = {
    [P in keyof T & keyof AggregateItemEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateItemEvent[P]> : Prisma.GetScalarType<T[P], AggregateItemEvent[P]>;
};
export type ItemEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemEventWhereInput;
    orderBy?: Prisma.ItemEventOrderByWithAggregationInput | Prisma.ItemEventOrderByWithAggregationInput[];
    by: Prisma.ItemEventScalarFieldEnum[] | Prisma.ItemEventScalarFieldEnum;
    having?: Prisma.ItemEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ItemEventCountAggregateInputType | true;
    _avg?: ItemEventAvgAggregateInputType;
    _sum?: ItemEventSumAggregateInputType;
    _min?: ItemEventMinAggregateInputType;
    _max?: ItemEventMaxAggregateInputType;
};
export type ItemEventGroupByOutputType = {
    id: number;
    itemId: number;
    kind: $Enums.ItemEventKind;
    date: Date | null;
    source: $Enums.ItemEventSource;
    sourceRef: string | null;
    sourceKey: string;
    locationCode: string | null;
    partyNo: string | null;
    customerId: number | null;
    tradeId: number | null;
    quantity: runtime.Decimal;
    amount: runtime.Decimal | null;
    createdAt: Date;
    _count: ItemEventCountAggregateOutputType | null;
    _avg: ItemEventAvgAggregateOutputType | null;
    _sum: ItemEventSumAggregateOutputType | null;
    _min: ItemEventMinAggregateOutputType | null;
    _max: ItemEventMaxAggregateOutputType | null;
};
export type GetItemEventGroupByPayload<T extends ItemEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ItemEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ItemEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ItemEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ItemEventGroupByOutputType[P]>;
}>>;
export type ItemEventWhereInput = {
    AND?: Prisma.ItemEventWhereInput | Prisma.ItemEventWhereInput[];
    OR?: Prisma.ItemEventWhereInput[];
    NOT?: Prisma.ItemEventWhereInput | Prisma.ItemEventWhereInput[];
    id?: Prisma.IntFilter<"ItemEvent"> | number;
    itemId?: Prisma.IntFilter<"ItemEvent"> | number;
    kind?: Prisma.EnumItemEventKindFilter<"ItemEvent"> | $Enums.ItemEventKind;
    date?: Prisma.DateTimeNullableFilter<"ItemEvent"> | Date | string | null;
    source?: Prisma.EnumItemEventSourceFilter<"ItemEvent"> | $Enums.ItemEventSource;
    sourceRef?: Prisma.StringNullableFilter<"ItemEvent"> | string | null;
    sourceKey?: Prisma.StringFilter<"ItemEvent"> | string;
    locationCode?: Prisma.StringNullableFilter<"ItemEvent"> | string | null;
    partyNo?: Prisma.StringNullableFilter<"ItemEvent"> | string | null;
    customerId?: Prisma.IntNullableFilter<"ItemEvent"> | number | null;
    tradeId?: Prisma.IntNullableFilter<"ItemEvent"> | number | null;
    quantity?: Prisma.DecimalFilter<"ItemEvent"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.DecimalNullableFilter<"ItemEvent"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFilter<"ItemEvent"> | Date | string;
    item?: Prisma.XOR<Prisma.ItemScalarRelationFilter, Prisma.ItemWhereInput>;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    trade?: Prisma.XOR<Prisma.TradeNullableScalarRelationFilter, Prisma.TradeWhereInput> | null;
};
export type ItemEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    date?: Prisma.SortOrderInput | Prisma.SortOrder;
    source?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    partyNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    tradeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    amount?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    item?: Prisma.ItemOrderByWithRelationInput;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    trade?: Prisma.TradeOrderByWithRelationInput;
};
export type ItemEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    sourceKey?: string;
    AND?: Prisma.ItemEventWhereInput | Prisma.ItemEventWhereInput[];
    OR?: Prisma.ItemEventWhereInput[];
    NOT?: Prisma.ItemEventWhereInput | Prisma.ItemEventWhereInput[];
    itemId?: Prisma.IntFilter<"ItemEvent"> | number;
    kind?: Prisma.EnumItemEventKindFilter<"ItemEvent"> | $Enums.ItemEventKind;
    date?: Prisma.DateTimeNullableFilter<"ItemEvent"> | Date | string | null;
    source?: Prisma.EnumItemEventSourceFilter<"ItemEvent"> | $Enums.ItemEventSource;
    sourceRef?: Prisma.StringNullableFilter<"ItemEvent"> | string | null;
    locationCode?: Prisma.StringNullableFilter<"ItemEvent"> | string | null;
    partyNo?: Prisma.StringNullableFilter<"ItemEvent"> | string | null;
    customerId?: Prisma.IntNullableFilter<"ItemEvent"> | number | null;
    tradeId?: Prisma.IntNullableFilter<"ItemEvent"> | number | null;
    quantity?: Prisma.DecimalFilter<"ItemEvent"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.DecimalNullableFilter<"ItemEvent"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFilter<"ItemEvent"> | Date | string;
    item?: Prisma.XOR<Prisma.ItemScalarRelationFilter, Prisma.ItemWhereInput>;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    trade?: Prisma.XOR<Prisma.TradeNullableScalarRelationFilter, Prisma.TradeWhereInput> | null;
}, "id" | "sourceKey">;
export type ItemEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    date?: Prisma.SortOrderInput | Prisma.SortOrder;
    source?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    partyNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    tradeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    amount?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ItemEventCountOrderByAggregateInput;
    _avg?: Prisma.ItemEventAvgOrderByAggregateInput;
    _max?: Prisma.ItemEventMaxOrderByAggregateInput;
    _min?: Prisma.ItemEventMinOrderByAggregateInput;
    _sum?: Prisma.ItemEventSumOrderByAggregateInput;
};
export type ItemEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.ItemEventScalarWhereWithAggregatesInput | Prisma.ItemEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.ItemEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ItemEventScalarWhereWithAggregatesInput | Prisma.ItemEventScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ItemEvent"> | number;
    itemId?: Prisma.IntWithAggregatesFilter<"ItemEvent"> | number;
    kind?: Prisma.EnumItemEventKindWithAggregatesFilter<"ItemEvent"> | $Enums.ItemEventKind;
    date?: Prisma.DateTimeNullableWithAggregatesFilter<"ItemEvent"> | Date | string | null;
    source?: Prisma.EnumItemEventSourceWithAggregatesFilter<"ItemEvent"> | $Enums.ItemEventSource;
    sourceRef?: Prisma.StringNullableWithAggregatesFilter<"ItemEvent"> | string | null;
    sourceKey?: Prisma.StringWithAggregatesFilter<"ItemEvent"> | string;
    locationCode?: Prisma.StringNullableWithAggregatesFilter<"ItemEvent"> | string | null;
    partyNo?: Prisma.StringNullableWithAggregatesFilter<"ItemEvent"> | string | null;
    customerId?: Prisma.IntNullableWithAggregatesFilter<"ItemEvent"> | number | null;
    tradeId?: Prisma.IntNullableWithAggregatesFilter<"ItemEvent"> | number | null;
    quantity?: Prisma.DecimalWithAggregatesFilter<"ItemEvent"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.DecimalNullableWithAggregatesFilter<"ItemEvent"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ItemEvent"> | Date | string;
};
export type ItemEventCreateInput = {
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    item: Prisma.ItemCreateNestedOneWithoutEventsInput;
    customer?: Prisma.CustomerCreateNestedOneWithoutItemEventsInput;
    trade?: Prisma.TradeCreateNestedOneWithoutItemEventsInput;
};
export type ItemEventUncheckedCreateInput = {
    id?: number;
    itemId: number;
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    customerId?: number | null;
    tradeId?: number | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type ItemEventUpdateInput = {
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    item?: Prisma.ItemUpdateOneRequiredWithoutEventsNestedInput;
    customer?: Prisma.CustomerUpdateOneWithoutItemEventsNestedInput;
    trade?: Prisma.TradeUpdateOneWithoutItemEventsNestedInput;
};
export type ItemEventUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemEventCreateManyInput = {
    id?: number;
    itemId: number;
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    customerId?: number | null;
    tradeId?: number | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type ItemEventUpdateManyMutationInput = {
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemEventUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemEventListRelationFilter = {
    every?: Prisma.ItemEventWhereInput;
    some?: Prisma.ItemEventWhereInput;
    none?: Prisma.ItemEventWhereInput;
};
export type ItemEventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ItemEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    partyNo?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ItemEventAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
};
export type ItemEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    partyNo?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ItemEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    partyNo?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ItemEventSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
};
export type ItemEventCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutTradeInput, Prisma.ItemEventUncheckedCreateWithoutTradeInput> | Prisma.ItemEventCreateWithoutTradeInput[] | Prisma.ItemEventUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutTradeInput | Prisma.ItemEventCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.ItemEventCreateManyTradeInputEnvelope;
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
};
export type ItemEventUncheckedCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutTradeInput, Prisma.ItemEventUncheckedCreateWithoutTradeInput> | Prisma.ItemEventCreateWithoutTradeInput[] | Prisma.ItemEventUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutTradeInput | Prisma.ItemEventCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.ItemEventCreateManyTradeInputEnvelope;
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
};
export type ItemEventUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutTradeInput, Prisma.ItemEventUncheckedCreateWithoutTradeInput> | Prisma.ItemEventCreateWithoutTradeInput[] | Prisma.ItemEventUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutTradeInput | Prisma.ItemEventCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.ItemEventUpsertWithWhereUniqueWithoutTradeInput | Prisma.ItemEventUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.ItemEventCreateManyTradeInputEnvelope;
    set?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    disconnect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    delete?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    update?: Prisma.ItemEventUpdateWithWhereUniqueWithoutTradeInput | Prisma.ItemEventUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.ItemEventUpdateManyWithWhereWithoutTradeInput | Prisma.ItemEventUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.ItemEventScalarWhereInput | Prisma.ItemEventScalarWhereInput[];
};
export type ItemEventUncheckedUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutTradeInput, Prisma.ItemEventUncheckedCreateWithoutTradeInput> | Prisma.ItemEventCreateWithoutTradeInput[] | Prisma.ItemEventUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutTradeInput | Prisma.ItemEventCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.ItemEventUpsertWithWhereUniqueWithoutTradeInput | Prisma.ItemEventUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.ItemEventCreateManyTradeInputEnvelope;
    set?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    disconnect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    delete?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    update?: Prisma.ItemEventUpdateWithWhereUniqueWithoutTradeInput | Prisma.ItemEventUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.ItemEventUpdateManyWithWhereWithoutTradeInput | Prisma.ItemEventUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.ItemEventScalarWhereInput | Prisma.ItemEventScalarWhereInput[];
};
export type ItemEventCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutCustomerInput, Prisma.ItemEventUncheckedCreateWithoutCustomerInput> | Prisma.ItemEventCreateWithoutCustomerInput[] | Prisma.ItemEventUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutCustomerInput | Prisma.ItemEventCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ItemEventCreateManyCustomerInputEnvelope;
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
};
export type ItemEventUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutCustomerInput, Prisma.ItemEventUncheckedCreateWithoutCustomerInput> | Prisma.ItemEventCreateWithoutCustomerInput[] | Prisma.ItemEventUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutCustomerInput | Prisma.ItemEventCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ItemEventCreateManyCustomerInputEnvelope;
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
};
export type ItemEventUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutCustomerInput, Prisma.ItemEventUncheckedCreateWithoutCustomerInput> | Prisma.ItemEventCreateWithoutCustomerInput[] | Prisma.ItemEventUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutCustomerInput | Prisma.ItemEventCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ItemEventUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ItemEventUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ItemEventCreateManyCustomerInputEnvelope;
    set?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    disconnect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    delete?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    update?: Prisma.ItemEventUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ItemEventUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ItemEventUpdateManyWithWhereWithoutCustomerInput | Prisma.ItemEventUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ItemEventScalarWhereInput | Prisma.ItemEventScalarWhereInput[];
};
export type ItemEventUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutCustomerInput, Prisma.ItemEventUncheckedCreateWithoutCustomerInput> | Prisma.ItemEventCreateWithoutCustomerInput[] | Prisma.ItemEventUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutCustomerInput | Prisma.ItemEventCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ItemEventUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ItemEventUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ItemEventCreateManyCustomerInputEnvelope;
    set?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    disconnect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    delete?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    update?: Prisma.ItemEventUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ItemEventUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ItemEventUpdateManyWithWhereWithoutCustomerInput | Prisma.ItemEventUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ItemEventScalarWhereInput | Prisma.ItemEventScalarWhereInput[];
};
export type ItemEventCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutItemInput, Prisma.ItemEventUncheckedCreateWithoutItemInput> | Prisma.ItemEventCreateWithoutItemInput[] | Prisma.ItemEventUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutItemInput | Prisma.ItemEventCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.ItemEventCreateManyItemInputEnvelope;
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
};
export type ItemEventUncheckedCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutItemInput, Prisma.ItemEventUncheckedCreateWithoutItemInput> | Prisma.ItemEventCreateWithoutItemInput[] | Prisma.ItemEventUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutItemInput | Prisma.ItemEventCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.ItemEventCreateManyItemInputEnvelope;
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
};
export type ItemEventUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutItemInput, Prisma.ItemEventUncheckedCreateWithoutItemInput> | Prisma.ItemEventCreateWithoutItemInput[] | Prisma.ItemEventUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutItemInput | Prisma.ItemEventCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.ItemEventUpsertWithWhereUniqueWithoutItemInput | Prisma.ItemEventUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.ItemEventCreateManyItemInputEnvelope;
    set?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    disconnect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    delete?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    update?: Prisma.ItemEventUpdateWithWhereUniqueWithoutItemInput | Prisma.ItemEventUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.ItemEventUpdateManyWithWhereWithoutItemInput | Prisma.ItemEventUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.ItemEventScalarWhereInput | Prisma.ItemEventScalarWhereInput[];
};
export type ItemEventUncheckedUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.ItemEventCreateWithoutItemInput, Prisma.ItemEventUncheckedCreateWithoutItemInput> | Prisma.ItemEventCreateWithoutItemInput[] | Prisma.ItemEventUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.ItemEventCreateOrConnectWithoutItemInput | Prisma.ItemEventCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.ItemEventUpsertWithWhereUniqueWithoutItemInput | Prisma.ItemEventUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.ItemEventCreateManyItemInputEnvelope;
    set?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    disconnect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    delete?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    connect?: Prisma.ItemEventWhereUniqueInput | Prisma.ItemEventWhereUniqueInput[];
    update?: Prisma.ItemEventUpdateWithWhereUniqueWithoutItemInput | Prisma.ItemEventUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.ItemEventUpdateManyWithWhereWithoutItemInput | Prisma.ItemEventUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.ItemEventScalarWhereInput | Prisma.ItemEventScalarWhereInput[];
};
export type EnumItemEventKindFieldUpdateOperationsInput = {
    set?: $Enums.ItemEventKind;
};
export type EnumItemEventSourceFieldUpdateOperationsInput = {
    set?: $Enums.ItemEventSource;
};
export type ItemEventCreateWithoutTradeInput = {
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    item: Prisma.ItemCreateNestedOneWithoutEventsInput;
    customer?: Prisma.CustomerCreateNestedOneWithoutItemEventsInput;
};
export type ItemEventUncheckedCreateWithoutTradeInput = {
    id?: number;
    itemId: number;
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    customerId?: number | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type ItemEventCreateOrConnectWithoutTradeInput = {
    where: Prisma.ItemEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemEventCreateWithoutTradeInput, Prisma.ItemEventUncheckedCreateWithoutTradeInput>;
};
export type ItemEventCreateManyTradeInputEnvelope = {
    data: Prisma.ItemEventCreateManyTradeInput | Prisma.ItemEventCreateManyTradeInput[];
    skipDuplicates?: boolean;
};
export type ItemEventUpsertWithWhereUniqueWithoutTradeInput = {
    where: Prisma.ItemEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.ItemEventUpdateWithoutTradeInput, Prisma.ItemEventUncheckedUpdateWithoutTradeInput>;
    create: Prisma.XOR<Prisma.ItemEventCreateWithoutTradeInput, Prisma.ItemEventUncheckedCreateWithoutTradeInput>;
};
export type ItemEventUpdateWithWhereUniqueWithoutTradeInput = {
    where: Prisma.ItemEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.ItemEventUpdateWithoutTradeInput, Prisma.ItemEventUncheckedUpdateWithoutTradeInput>;
};
export type ItemEventUpdateManyWithWhereWithoutTradeInput = {
    where: Prisma.ItemEventScalarWhereInput;
    data: Prisma.XOR<Prisma.ItemEventUpdateManyMutationInput, Prisma.ItemEventUncheckedUpdateManyWithoutTradeInput>;
};
export type ItemEventScalarWhereInput = {
    AND?: Prisma.ItemEventScalarWhereInput | Prisma.ItemEventScalarWhereInput[];
    OR?: Prisma.ItemEventScalarWhereInput[];
    NOT?: Prisma.ItemEventScalarWhereInput | Prisma.ItemEventScalarWhereInput[];
    id?: Prisma.IntFilter<"ItemEvent"> | number;
    itemId?: Prisma.IntFilter<"ItemEvent"> | number;
    kind?: Prisma.EnumItemEventKindFilter<"ItemEvent"> | $Enums.ItemEventKind;
    date?: Prisma.DateTimeNullableFilter<"ItemEvent"> | Date | string | null;
    source?: Prisma.EnumItemEventSourceFilter<"ItemEvent"> | $Enums.ItemEventSource;
    sourceRef?: Prisma.StringNullableFilter<"ItemEvent"> | string | null;
    sourceKey?: Prisma.StringFilter<"ItemEvent"> | string;
    locationCode?: Prisma.StringNullableFilter<"ItemEvent"> | string | null;
    partyNo?: Prisma.StringNullableFilter<"ItemEvent"> | string | null;
    customerId?: Prisma.IntNullableFilter<"ItemEvent"> | number | null;
    tradeId?: Prisma.IntNullableFilter<"ItemEvent"> | number | null;
    quantity?: Prisma.DecimalFilter<"ItemEvent"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.DecimalNullableFilter<"ItemEvent"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFilter<"ItemEvent"> | Date | string;
};
export type ItemEventCreateWithoutCustomerInput = {
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    item: Prisma.ItemCreateNestedOneWithoutEventsInput;
    trade?: Prisma.TradeCreateNestedOneWithoutItemEventsInput;
};
export type ItemEventUncheckedCreateWithoutCustomerInput = {
    id?: number;
    itemId: number;
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    tradeId?: number | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type ItemEventCreateOrConnectWithoutCustomerInput = {
    where: Prisma.ItemEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemEventCreateWithoutCustomerInput, Prisma.ItemEventUncheckedCreateWithoutCustomerInput>;
};
export type ItemEventCreateManyCustomerInputEnvelope = {
    data: Prisma.ItemEventCreateManyCustomerInput | Prisma.ItemEventCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type ItemEventUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ItemEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.ItemEventUpdateWithoutCustomerInput, Prisma.ItemEventUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.ItemEventCreateWithoutCustomerInput, Prisma.ItemEventUncheckedCreateWithoutCustomerInput>;
};
export type ItemEventUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ItemEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.ItemEventUpdateWithoutCustomerInput, Prisma.ItemEventUncheckedUpdateWithoutCustomerInput>;
};
export type ItemEventUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.ItemEventScalarWhereInput;
    data: Prisma.XOR<Prisma.ItemEventUpdateManyMutationInput, Prisma.ItemEventUncheckedUpdateManyWithoutCustomerInput>;
};
export type ItemEventCreateWithoutItemInput = {
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutItemEventsInput;
    trade?: Prisma.TradeCreateNestedOneWithoutItemEventsInput;
};
export type ItemEventUncheckedCreateWithoutItemInput = {
    id?: number;
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    customerId?: number | null;
    tradeId?: number | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type ItemEventCreateOrConnectWithoutItemInput = {
    where: Prisma.ItemEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemEventCreateWithoutItemInput, Prisma.ItemEventUncheckedCreateWithoutItemInput>;
};
export type ItemEventCreateManyItemInputEnvelope = {
    data: Prisma.ItemEventCreateManyItemInput | Prisma.ItemEventCreateManyItemInput[];
    skipDuplicates?: boolean;
};
export type ItemEventUpsertWithWhereUniqueWithoutItemInput = {
    where: Prisma.ItemEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.ItemEventUpdateWithoutItemInput, Prisma.ItemEventUncheckedUpdateWithoutItemInput>;
    create: Prisma.XOR<Prisma.ItemEventCreateWithoutItemInput, Prisma.ItemEventUncheckedCreateWithoutItemInput>;
};
export type ItemEventUpdateWithWhereUniqueWithoutItemInput = {
    where: Prisma.ItemEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.ItemEventUpdateWithoutItemInput, Prisma.ItemEventUncheckedUpdateWithoutItemInput>;
};
export type ItemEventUpdateManyWithWhereWithoutItemInput = {
    where: Prisma.ItemEventScalarWhereInput;
    data: Prisma.XOR<Prisma.ItemEventUpdateManyMutationInput, Prisma.ItemEventUncheckedUpdateManyWithoutItemInput>;
};
export type ItemEventCreateManyTradeInput = {
    id?: number;
    itemId: number;
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    customerId?: number | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type ItemEventUpdateWithoutTradeInput = {
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    item?: Prisma.ItemUpdateOneRequiredWithoutEventsNestedInput;
    customer?: Prisma.CustomerUpdateOneWithoutItemEventsNestedInput;
};
export type ItemEventUncheckedUpdateWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemEventUncheckedUpdateManyWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemEventCreateManyCustomerInput = {
    id?: number;
    itemId: number;
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    tradeId?: number | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type ItemEventUpdateWithoutCustomerInput = {
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    item?: Prisma.ItemUpdateOneRequiredWithoutEventsNestedInput;
    trade?: Prisma.TradeUpdateOneWithoutItemEventsNestedInput;
};
export type ItemEventUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemEventUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemEventCreateManyItemInput = {
    id?: number;
    kind: $Enums.ItemEventKind;
    date?: Date | string | null;
    source: $Enums.ItemEventSource;
    sourceRef?: string | null;
    sourceKey: string;
    locationCode?: string | null;
    partyNo?: string | null;
    customerId?: number | null;
    tradeId?: number | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type ItemEventUpdateWithoutItemInput = {
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutItemEventsNestedInput;
    trade?: Prisma.TradeUpdateOneWithoutItemEventsNestedInput;
};
export type ItemEventUncheckedUpdateWithoutItemInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemEventUncheckedUpdateManyWithoutItemInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumItemEventKindFieldUpdateOperationsInput | $Enums.ItemEventKind;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    source?: Prisma.EnumItemEventSourceFieldUpdateOperationsInput | $Enums.ItemEventSource;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partyNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    itemId?: boolean;
    kind?: boolean;
    date?: boolean;
    source?: boolean;
    sourceRef?: boolean;
    sourceKey?: boolean;
    locationCode?: boolean;
    partyNo?: boolean;
    customerId?: boolean;
    tradeId?: boolean;
    quantity?: boolean;
    amount?: boolean;
    createdAt?: boolean;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.ItemEvent$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.ItemEvent$tradeArgs<ExtArgs>;
}, ExtArgs["result"]["itemEvent"]>;
export type ItemEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    itemId?: boolean;
    kind?: boolean;
    date?: boolean;
    source?: boolean;
    sourceRef?: boolean;
    sourceKey?: boolean;
    locationCode?: boolean;
    partyNo?: boolean;
    customerId?: boolean;
    tradeId?: boolean;
    quantity?: boolean;
    amount?: boolean;
    createdAt?: boolean;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.ItemEvent$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.ItemEvent$tradeArgs<ExtArgs>;
}, ExtArgs["result"]["itemEvent"]>;
export type ItemEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    itemId?: boolean;
    kind?: boolean;
    date?: boolean;
    source?: boolean;
    sourceRef?: boolean;
    sourceKey?: boolean;
    locationCode?: boolean;
    partyNo?: boolean;
    customerId?: boolean;
    tradeId?: boolean;
    quantity?: boolean;
    amount?: boolean;
    createdAt?: boolean;
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.ItemEvent$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.ItemEvent$tradeArgs<ExtArgs>;
}, ExtArgs["result"]["itemEvent"]>;
export type ItemEventSelectScalar = {
    id?: boolean;
    itemId?: boolean;
    kind?: boolean;
    date?: boolean;
    source?: boolean;
    sourceRef?: boolean;
    sourceKey?: boolean;
    locationCode?: boolean;
    partyNo?: boolean;
    customerId?: boolean;
    tradeId?: boolean;
    quantity?: boolean;
    amount?: boolean;
    createdAt?: boolean;
};
export type ItemEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "itemId" | "kind" | "date" | "source" | "sourceRef" | "sourceKey" | "locationCode" | "partyNo" | "customerId" | "tradeId" | "quantity" | "amount" | "createdAt", ExtArgs["result"]["itemEvent"]>;
export type ItemEventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.ItemEvent$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.ItemEvent$tradeArgs<ExtArgs>;
};
export type ItemEventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.ItemEvent$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.ItemEvent$tradeArgs<ExtArgs>;
};
export type ItemEventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    item?: boolean | Prisma.ItemDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.ItemEvent$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.ItemEvent$tradeArgs<ExtArgs>;
};
export type $ItemEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ItemEvent";
    objects: {
        item: Prisma.$ItemPayload<ExtArgs>;
        customer: Prisma.$CustomerPayload<ExtArgs> | null;
        trade: Prisma.$TradePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        itemId: number;
        kind: $Enums.ItemEventKind;
        date: Date | null;
        source: $Enums.ItemEventSource;
        sourceRef: string | null;
        sourceKey: string;
        locationCode: string | null;
        partyNo: string | null;
        customerId: number | null;
        tradeId: number | null;
        quantity: runtime.Decimal;
        amount: runtime.Decimal | null;
        createdAt: Date;
    }, ExtArgs["result"]["itemEvent"]>;
    composites: {};
};
export type ItemEventGetPayload<S extends boolean | null | undefined | ItemEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ItemEventPayload, S>;
export type ItemEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ItemEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ItemEventCountAggregateInputType | true;
};
export interface ItemEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ItemEvent'];
        meta: {
            name: 'ItemEvent';
        };
    };
    findUnique<T extends ItemEventFindUniqueArgs>(args: Prisma.SelectSubset<T, ItemEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ItemEventClient<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ItemEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ItemEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ItemEventClient<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ItemEventFindFirstArgs>(args?: Prisma.SelectSubset<T, ItemEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__ItemEventClient<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ItemEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ItemEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ItemEventClient<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ItemEventFindManyArgs>(args?: Prisma.SelectSubset<T, ItemEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ItemEventCreateArgs>(args: Prisma.SelectSubset<T, ItemEventCreateArgs<ExtArgs>>): Prisma.Prisma__ItemEventClient<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ItemEventCreateManyArgs>(args?: Prisma.SelectSubset<T, ItemEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ItemEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ItemEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ItemEventDeleteArgs>(args: Prisma.SelectSubset<T, ItemEventDeleteArgs<ExtArgs>>): Prisma.Prisma__ItemEventClient<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ItemEventUpdateArgs>(args: Prisma.SelectSubset<T, ItemEventUpdateArgs<ExtArgs>>): Prisma.Prisma__ItemEventClient<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ItemEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, ItemEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ItemEventUpdateManyArgs>(args: Prisma.SelectSubset<T, ItemEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ItemEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ItemEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ItemEventUpsertArgs>(args: Prisma.SelectSubset<T, ItemEventUpsertArgs<ExtArgs>>): Prisma.Prisma__ItemEventClient<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ItemEventCountArgs>(args?: Prisma.Subset<T, ItemEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ItemEventCountAggregateOutputType> : number>;
    aggregate<T extends ItemEventAggregateArgs>(args: Prisma.Subset<T, ItemEventAggregateArgs>): Prisma.PrismaPromise<GetItemEventAggregateType<T>>;
    groupBy<T extends ItemEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ItemEventGroupByArgs['orderBy'];
    } : {
        orderBy?: ItemEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ItemEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ItemEventFieldRefs;
}
export interface Prisma__ItemEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    item<T extends Prisma.ItemDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ItemDefaultArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    customer<T extends Prisma.ItemEvent$customerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ItemEvent$customerArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    trade<T extends Prisma.ItemEvent$tradeArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ItemEvent$tradeArgs<ExtArgs>>): Prisma.Prisma__TradeClient<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ItemEventFieldRefs {
    readonly id: Prisma.FieldRef<"ItemEvent", 'Int'>;
    readonly itemId: Prisma.FieldRef<"ItemEvent", 'Int'>;
    readonly kind: Prisma.FieldRef<"ItemEvent", 'ItemEventKind'>;
    readonly date: Prisma.FieldRef<"ItemEvent", 'DateTime'>;
    readonly source: Prisma.FieldRef<"ItemEvent", 'ItemEventSource'>;
    readonly sourceRef: Prisma.FieldRef<"ItemEvent", 'String'>;
    readonly sourceKey: Prisma.FieldRef<"ItemEvent", 'String'>;
    readonly locationCode: Prisma.FieldRef<"ItemEvent", 'String'>;
    readonly partyNo: Prisma.FieldRef<"ItemEvent", 'String'>;
    readonly customerId: Prisma.FieldRef<"ItemEvent", 'Int'>;
    readonly tradeId: Prisma.FieldRef<"ItemEvent", 'Int'>;
    readonly quantity: Prisma.FieldRef<"ItemEvent", 'Decimal'>;
    readonly amount: Prisma.FieldRef<"ItemEvent", 'Decimal'>;
    readonly createdAt: Prisma.FieldRef<"ItemEvent", 'DateTime'>;
}
export type ItemEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
    where: Prisma.ItemEventWhereUniqueInput;
};
export type ItemEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
    where: Prisma.ItemEventWhereUniqueInput;
};
export type ItemEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
    where?: Prisma.ItemEventWhereInput;
    orderBy?: Prisma.ItemEventOrderByWithRelationInput | Prisma.ItemEventOrderByWithRelationInput[];
    cursor?: Prisma.ItemEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemEventScalarFieldEnum | Prisma.ItemEventScalarFieldEnum[];
};
export type ItemEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
    where?: Prisma.ItemEventWhereInput;
    orderBy?: Prisma.ItemEventOrderByWithRelationInput | Prisma.ItemEventOrderByWithRelationInput[];
    cursor?: Prisma.ItemEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemEventScalarFieldEnum | Prisma.ItemEventScalarFieldEnum[];
};
export type ItemEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
    where?: Prisma.ItemEventWhereInput;
    orderBy?: Prisma.ItemEventOrderByWithRelationInput | Prisma.ItemEventOrderByWithRelationInput[];
    cursor?: Prisma.ItemEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemEventScalarFieldEnum | Prisma.ItemEventScalarFieldEnum[];
};
export type ItemEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemEventCreateInput, Prisma.ItemEventUncheckedCreateInput>;
};
export type ItemEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ItemEventCreateManyInput | Prisma.ItemEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ItemEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    data: Prisma.ItemEventCreateManyInput | Prisma.ItemEventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ItemEventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ItemEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemEventUpdateInput, Prisma.ItemEventUncheckedUpdateInput>;
    where: Prisma.ItemEventWhereUniqueInput;
};
export type ItemEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ItemEventUpdateManyMutationInput, Prisma.ItemEventUncheckedUpdateManyInput>;
    where?: Prisma.ItemEventWhereInput;
    limit?: number;
};
export type ItemEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemEventUpdateManyMutationInput, Prisma.ItemEventUncheckedUpdateManyInput>;
    where?: Prisma.ItemEventWhereInput;
    limit?: number;
    include?: Prisma.ItemEventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ItemEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
    where: Prisma.ItemEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemEventCreateInput, Prisma.ItemEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ItemEventUpdateInput, Prisma.ItemEventUncheckedUpdateInput>;
};
export type ItemEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
    where: Prisma.ItemEventWhereUniqueInput;
};
export type ItemEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemEventWhereInput;
    limit?: number;
};
export type ItemEvent$customerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
};
export type ItemEvent$tradeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TradeSelect<ExtArgs> | null;
    omit?: Prisma.TradeOmit<ExtArgs> | null;
    include?: Prisma.TradeInclude<ExtArgs> | null;
    where?: Prisma.TradeWhereInput;
};
export type ItemEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemEventSelect<ExtArgs> | null;
    omit?: Prisma.ItemEventOmit<ExtArgs> | null;
    include?: Prisma.ItemEventInclude<ExtArgs> | null;
};
//# sourceMappingURL=ItemEvent.d.ts.map