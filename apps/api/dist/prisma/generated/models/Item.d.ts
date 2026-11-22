import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ItemModel = runtime.Types.Result.DefaultSelection<Prisma.$ItemPayload>;
export type AggregateItem = {
    _count: ItemCountAggregateOutputType | null;
    _avg: ItemAvgAggregateOutputType | null;
    _sum: ItemSumAggregateOutputType | null;
    _min: ItemMinAggregateOutputType | null;
    _max: ItemMaxAggregateOutputType | null;
};
export type ItemAvgAggregateOutputType = {
    id: number | null;
    productId: number | null;
};
export type ItemSumAggregateOutputType = {
    id: number | null;
    productId: number | null;
};
export type ItemMinAggregateOutputType = {
    id: number | null;
    serial: string | null;
    serialKey: string | null;
    bcItemNo: string | null;
    productId: number | null;
    status: $Enums.ItemStatus | null;
    locationCode: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ItemMaxAggregateOutputType = {
    id: number | null;
    serial: string | null;
    serialKey: string | null;
    bcItemNo: string | null;
    productId: number | null;
    status: $Enums.ItemStatus | null;
    locationCode: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ItemCountAggregateOutputType = {
    id: number;
    serial: number;
    serialKey: number;
    bcItemNo: number;
    productId: number;
    status: number;
    locationCode: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ItemAvgAggregateInputType = {
    id?: true;
    productId?: true;
};
export type ItemSumAggregateInputType = {
    id?: true;
    productId?: true;
};
export type ItemMinAggregateInputType = {
    id?: true;
    serial?: true;
    serialKey?: true;
    bcItemNo?: true;
    productId?: true;
    status?: true;
    locationCode?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ItemMaxAggregateInputType = {
    id?: true;
    serial?: true;
    serialKey?: true;
    bcItemNo?: true;
    productId?: true;
    status?: true;
    locationCode?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ItemCountAggregateInputType = {
    id?: true;
    serial?: true;
    serialKey?: true;
    bcItemNo?: true;
    productId?: true;
    status?: true;
    locationCode?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ItemAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput | Prisma.ItemOrderByWithRelationInput[];
    cursor?: Prisma.ItemWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ItemCountAggregateInputType;
    _avg?: ItemAvgAggregateInputType;
    _sum?: ItemSumAggregateInputType;
    _min?: ItemMinAggregateInputType;
    _max?: ItemMaxAggregateInputType;
};
export type GetItemAggregateType<T extends ItemAggregateArgs> = {
    [P in keyof T & keyof AggregateItem]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateItem[P]> : Prisma.GetScalarType<T[P], AggregateItem[P]>;
};
export type ItemGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithAggregationInput | Prisma.ItemOrderByWithAggregationInput[];
    by: Prisma.ItemScalarFieldEnum[] | Prisma.ItemScalarFieldEnum;
    having?: Prisma.ItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ItemCountAggregateInputType | true;
    _avg?: ItemAvgAggregateInputType;
    _sum?: ItemSumAggregateInputType;
    _min?: ItemMinAggregateInputType;
    _max?: ItemMaxAggregateInputType;
};
export type ItemGroupByOutputType = {
    id: number;
    serial: string;
    serialKey: string;
    bcItemNo: string | null;
    productId: number | null;
    status: $Enums.ItemStatus;
    locationCode: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: ItemCountAggregateOutputType | null;
    _avg: ItemAvgAggregateOutputType | null;
    _sum: ItemSumAggregateOutputType | null;
    _min: ItemMinAggregateOutputType | null;
    _max: ItemMaxAggregateOutputType | null;
};
export type GetItemGroupByPayload<T extends ItemGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ItemGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ItemGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ItemGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ItemGroupByOutputType[P]>;
}>>;
export type ItemWhereInput = {
    AND?: Prisma.ItemWhereInput | Prisma.ItemWhereInput[];
    OR?: Prisma.ItemWhereInput[];
    NOT?: Prisma.ItemWhereInput | Prisma.ItemWhereInput[];
    id?: Prisma.IntFilter<"Item"> | number;
    serial?: Prisma.StringFilter<"Item"> | string;
    serialKey?: Prisma.StringFilter<"Item"> | string;
    bcItemNo?: Prisma.StringNullableFilter<"Item"> | string | null;
    productId?: Prisma.IntNullableFilter<"Item"> | number | null;
    status?: Prisma.EnumItemStatusFilter<"Item"> | $Enums.ItemStatus;
    locationCode?: Prisma.StringNullableFilter<"Item"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductNullableScalarRelationFilter, Prisma.ProductWhereInput> | null;
    events?: Prisma.ItemEventListRelationFilter;
};
export type ItemOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    bcItemNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    productId?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    product?: Prisma.ProductOrderByWithRelationInput;
    events?: Prisma.ItemEventOrderByRelationAggregateInput;
};
export type ItemWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    serialKey?: string;
    AND?: Prisma.ItemWhereInput | Prisma.ItemWhereInput[];
    OR?: Prisma.ItemWhereInput[];
    NOT?: Prisma.ItemWhereInput | Prisma.ItemWhereInput[];
    serial?: Prisma.StringFilter<"Item"> | string;
    bcItemNo?: Prisma.StringNullableFilter<"Item"> | string | null;
    productId?: Prisma.IntNullableFilter<"Item"> | number | null;
    status?: Prisma.EnumItemStatusFilter<"Item"> | $Enums.ItemStatus;
    locationCode?: Prisma.StringNullableFilter<"Item"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductNullableScalarRelationFilter, Prisma.ProductWhereInput> | null;
    events?: Prisma.ItemEventListRelationFilter;
}, "id" | "serialKey">;
export type ItemOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    bcItemNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    productId?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ItemCountOrderByAggregateInput;
    _avg?: Prisma.ItemAvgOrderByAggregateInput;
    _max?: Prisma.ItemMaxOrderByAggregateInput;
    _min?: Prisma.ItemMinOrderByAggregateInput;
    _sum?: Prisma.ItemSumOrderByAggregateInput;
};
export type ItemScalarWhereWithAggregatesInput = {
    AND?: Prisma.ItemScalarWhereWithAggregatesInput | Prisma.ItemScalarWhereWithAggregatesInput[];
    OR?: Prisma.ItemScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ItemScalarWhereWithAggregatesInput | Prisma.ItemScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Item"> | number;
    serial?: Prisma.StringWithAggregatesFilter<"Item"> | string;
    serialKey?: Prisma.StringWithAggregatesFilter<"Item"> | string;
    bcItemNo?: Prisma.StringNullableWithAggregatesFilter<"Item"> | string | null;
    productId?: Prisma.IntNullableWithAggregatesFilter<"Item"> | number | null;
    status?: Prisma.EnumItemStatusWithAggregatesFilter<"Item"> | $Enums.ItemStatus;
    locationCode?: Prisma.StringNullableWithAggregatesFilter<"Item"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Item"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Item"> | Date | string;
};
export type ItemCreateInput = {
    serial: string;
    serialKey: string;
    bcItemNo?: string | null;
    status?: $Enums.ItemStatus;
    locationCode?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    product?: Prisma.ProductCreateNestedOneWithoutItemsInput;
    events?: Prisma.ItemEventCreateNestedManyWithoutItemInput;
};
export type ItemUncheckedCreateInput = {
    id?: number;
    serial: string;
    serialKey: string;
    bcItemNo?: string | null;
    productId?: number | null;
    status?: $Enums.ItemStatus;
    locationCode?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    events?: Prisma.ItemEventUncheckedCreateNestedManyWithoutItemInput;
};
export type ItemUpdateInput = {
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    bcItemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneWithoutItemsNestedInput;
    events?: Prisma.ItemEventUpdateManyWithoutItemNestedInput;
};
export type ItemUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    bcItemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    events?: Prisma.ItemEventUncheckedUpdateManyWithoutItemNestedInput;
};
export type ItemCreateManyInput = {
    id?: number;
    serial: string;
    serialKey: string;
    bcItemNo?: string | null;
    productId?: number | null;
    status?: $Enums.ItemStatus;
    locationCode?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ItemUpdateManyMutationInput = {
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    bcItemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    bcItemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemListRelationFilter = {
    every?: Prisma.ItemWhereInput;
    some?: Prisma.ItemWhereInput;
    none?: Prisma.ItemWhereInput;
};
export type ItemOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ItemCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    bcItemNo?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ItemAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
};
export type ItemMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    bcItemNo?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ItemMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    serialKey?: Prisma.SortOrder;
    bcItemNo?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ItemSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
};
export type ItemScalarRelationFilter = {
    is?: Prisma.ItemWhereInput;
    isNot?: Prisma.ItemWhereInput;
};
export type ItemCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutProductInput, Prisma.ItemUncheckedCreateWithoutProductInput> | Prisma.ItemCreateWithoutProductInput[] | Prisma.ItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutProductInput | Prisma.ItemCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.ItemCreateManyProductInputEnvelope;
    connect?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
};
export type ItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutProductInput, Prisma.ItemUncheckedCreateWithoutProductInput> | Prisma.ItemCreateWithoutProductInput[] | Prisma.ItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutProductInput | Prisma.ItemCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.ItemCreateManyProductInputEnvelope;
    connect?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
};
export type ItemUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutProductInput, Prisma.ItemUncheckedCreateWithoutProductInput> | Prisma.ItemCreateWithoutProductInput[] | Prisma.ItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutProductInput | Prisma.ItemCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.ItemUpsertWithWhereUniqueWithoutProductInput | Prisma.ItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.ItemCreateManyProductInputEnvelope;
    set?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
    disconnect?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
    delete?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
    connect?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
    update?: Prisma.ItemUpdateWithWhereUniqueWithoutProductInput | Prisma.ItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.ItemUpdateManyWithWhereWithoutProductInput | Prisma.ItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.ItemScalarWhereInput | Prisma.ItemScalarWhereInput[];
};
export type ItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutProductInput, Prisma.ItemUncheckedCreateWithoutProductInput> | Prisma.ItemCreateWithoutProductInput[] | Prisma.ItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutProductInput | Prisma.ItemCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.ItemUpsertWithWhereUniqueWithoutProductInput | Prisma.ItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.ItemCreateManyProductInputEnvelope;
    set?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
    disconnect?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
    delete?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
    connect?: Prisma.ItemWhereUniqueInput | Prisma.ItemWhereUniqueInput[];
    update?: Prisma.ItemUpdateWithWhereUniqueWithoutProductInput | Prisma.ItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.ItemUpdateManyWithWhereWithoutProductInput | Prisma.ItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.ItemScalarWhereInput | Prisma.ItemScalarWhereInput[];
};
export type EnumItemStatusFieldUpdateOperationsInput = {
    set?: $Enums.ItemStatus;
};
export type ItemCreateNestedOneWithoutEventsInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutEventsInput, Prisma.ItemUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutEventsInput;
    connect?: Prisma.ItemWhereUniqueInput;
};
export type ItemUpdateOneRequiredWithoutEventsNestedInput = {
    create?: Prisma.XOR<Prisma.ItemCreateWithoutEventsInput, Prisma.ItemUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.ItemCreateOrConnectWithoutEventsInput;
    upsert?: Prisma.ItemUpsertWithoutEventsInput;
    connect?: Prisma.ItemWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ItemUpdateToOneWithWhereWithoutEventsInput, Prisma.ItemUpdateWithoutEventsInput>, Prisma.ItemUncheckedUpdateWithoutEventsInput>;
};
export type ItemCreateWithoutProductInput = {
    serial: string;
    serialKey: string;
    bcItemNo?: string | null;
    status?: $Enums.ItemStatus;
    locationCode?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    events?: Prisma.ItemEventCreateNestedManyWithoutItemInput;
};
export type ItemUncheckedCreateWithoutProductInput = {
    id?: number;
    serial: string;
    serialKey: string;
    bcItemNo?: string | null;
    status?: $Enums.ItemStatus;
    locationCode?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    events?: Prisma.ItemEventUncheckedCreateNestedManyWithoutItemInput;
};
export type ItemCreateOrConnectWithoutProductInput = {
    where: Prisma.ItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemCreateWithoutProductInput, Prisma.ItemUncheckedCreateWithoutProductInput>;
};
export type ItemCreateManyProductInputEnvelope = {
    data: Prisma.ItemCreateManyProductInput | Prisma.ItemCreateManyProductInput[];
    skipDuplicates?: boolean;
};
export type ItemUpsertWithWhereUniqueWithoutProductInput = {
    where: Prisma.ItemWhereUniqueInput;
    update: Prisma.XOR<Prisma.ItemUpdateWithoutProductInput, Prisma.ItemUncheckedUpdateWithoutProductInput>;
    create: Prisma.XOR<Prisma.ItemCreateWithoutProductInput, Prisma.ItemUncheckedCreateWithoutProductInput>;
};
export type ItemUpdateWithWhereUniqueWithoutProductInput = {
    where: Prisma.ItemWhereUniqueInput;
    data: Prisma.XOR<Prisma.ItemUpdateWithoutProductInput, Prisma.ItemUncheckedUpdateWithoutProductInput>;
};
export type ItemUpdateManyWithWhereWithoutProductInput = {
    where: Prisma.ItemScalarWhereInput;
    data: Prisma.XOR<Prisma.ItemUpdateManyMutationInput, Prisma.ItemUncheckedUpdateManyWithoutProductInput>;
};
export type ItemScalarWhereInput = {
    AND?: Prisma.ItemScalarWhereInput | Prisma.ItemScalarWhereInput[];
    OR?: Prisma.ItemScalarWhereInput[];
    NOT?: Prisma.ItemScalarWhereInput | Prisma.ItemScalarWhereInput[];
    id?: Prisma.IntFilter<"Item"> | number;
    serial?: Prisma.StringFilter<"Item"> | string;
    serialKey?: Prisma.StringFilter<"Item"> | string;
    bcItemNo?: Prisma.StringNullableFilter<"Item"> | string | null;
    productId?: Prisma.IntNullableFilter<"Item"> | number | null;
    status?: Prisma.EnumItemStatusFilter<"Item"> | $Enums.ItemStatus;
    locationCode?: Prisma.StringNullableFilter<"Item"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Item"> | Date | string;
};
export type ItemCreateWithoutEventsInput = {
    serial: string;
    serialKey: string;
    bcItemNo?: string | null;
    status?: $Enums.ItemStatus;
    locationCode?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    product?: Prisma.ProductCreateNestedOneWithoutItemsInput;
};
export type ItemUncheckedCreateWithoutEventsInput = {
    id?: number;
    serial: string;
    serialKey: string;
    bcItemNo?: string | null;
    productId?: number | null;
    status?: $Enums.ItemStatus;
    locationCode?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ItemCreateOrConnectWithoutEventsInput = {
    where: Prisma.ItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemCreateWithoutEventsInput, Prisma.ItemUncheckedCreateWithoutEventsInput>;
};
export type ItemUpsertWithoutEventsInput = {
    update: Prisma.XOR<Prisma.ItemUpdateWithoutEventsInput, Prisma.ItemUncheckedUpdateWithoutEventsInput>;
    create: Prisma.XOR<Prisma.ItemCreateWithoutEventsInput, Prisma.ItemUncheckedCreateWithoutEventsInput>;
    where?: Prisma.ItemWhereInput;
};
export type ItemUpdateToOneWithWhereWithoutEventsInput = {
    where?: Prisma.ItemWhereInput;
    data: Prisma.XOR<Prisma.ItemUpdateWithoutEventsInput, Prisma.ItemUncheckedUpdateWithoutEventsInput>;
};
export type ItemUpdateWithoutEventsInput = {
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    bcItemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneWithoutItemsNestedInput;
};
export type ItemUncheckedUpdateWithoutEventsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    bcItemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemCreateManyProductInput = {
    id?: number;
    serial: string;
    serialKey: string;
    bcItemNo?: string | null;
    status?: $Enums.ItemStatus;
    locationCode?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ItemUpdateWithoutProductInput = {
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    bcItemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    events?: Prisma.ItemEventUpdateManyWithoutItemNestedInput;
};
export type ItemUncheckedUpdateWithoutProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    bcItemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    events?: Prisma.ItemEventUncheckedUpdateManyWithoutItemNestedInput;
};
export type ItemUncheckedUpdateManyWithoutProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    serial?: Prisma.StringFieldUpdateOperationsInput | string;
    serialKey?: Prisma.StringFieldUpdateOperationsInput | string;
    bcItemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ItemCountOutputType = {
    events: number;
};
export type ItemCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    events?: boolean | ItemCountOutputTypeCountEventsArgs;
};
export type ItemCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemCountOutputTypeSelect<ExtArgs> | null;
};
export type ItemCountOutputTypeCountEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemEventWhereInput;
};
export type ItemSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    serial?: boolean;
    serialKey?: boolean;
    bcItemNo?: boolean;
    productId?: boolean;
    status?: boolean;
    locationCode?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.Item$productArgs<ExtArgs>;
    events?: boolean | Prisma.Item$eventsArgs<ExtArgs>;
    _count?: boolean | Prisma.ItemCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["item"]>;
export type ItemSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    serial?: boolean;
    serialKey?: boolean;
    bcItemNo?: boolean;
    productId?: boolean;
    status?: boolean;
    locationCode?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.Item$productArgs<ExtArgs>;
}, ExtArgs["result"]["item"]>;
export type ItemSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    serial?: boolean;
    serialKey?: boolean;
    bcItemNo?: boolean;
    productId?: boolean;
    status?: boolean;
    locationCode?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.Item$productArgs<ExtArgs>;
}, ExtArgs["result"]["item"]>;
export type ItemSelectScalar = {
    id?: boolean;
    serial?: boolean;
    serialKey?: boolean;
    bcItemNo?: boolean;
    productId?: boolean;
    status?: boolean;
    locationCode?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ItemOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "serial" | "serialKey" | "bcItemNo" | "productId" | "status" | "locationCode" | "createdAt" | "updatedAt", ExtArgs["result"]["item"]>;
export type ItemInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.Item$productArgs<ExtArgs>;
    events?: boolean | Prisma.Item$eventsArgs<ExtArgs>;
    _count?: boolean | Prisma.ItemCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ItemIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.Item$productArgs<ExtArgs>;
};
export type ItemIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.Item$productArgs<ExtArgs>;
};
export type $ItemPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Item";
    objects: {
        product: Prisma.$ProductPayload<ExtArgs> | null;
        events: Prisma.$ItemEventPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        serial: string;
        serialKey: string;
        bcItemNo: string | null;
        productId: number | null;
        status: $Enums.ItemStatus;
        locationCode: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["item"]>;
    composites: {};
};
export type ItemGetPayload<S extends boolean | null | undefined | ItemDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ItemPayload, S>;
export type ItemCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ItemCountAggregateInputType | true;
};
export interface ItemDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Item'];
        meta: {
            name: 'Item';
        };
    };
    findUnique<T extends ItemFindUniqueArgs>(args: Prisma.SelectSubset<T, ItemFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ItemFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ItemFindFirstArgs>(args?: Prisma.SelectSubset<T, ItemFindFirstArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ItemFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ItemFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ItemFindManyArgs>(args?: Prisma.SelectSubset<T, ItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ItemCreateArgs>(args: Prisma.SelectSubset<T, ItemCreateArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ItemCreateManyArgs>(args?: Prisma.SelectSubset<T, ItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ItemCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ItemDeleteArgs>(args: Prisma.SelectSubset<T, ItemDeleteArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ItemUpdateArgs>(args: Prisma.SelectSubset<T, ItemUpdateArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ItemDeleteManyArgs>(args?: Prisma.SelectSubset<T, ItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ItemUpdateManyArgs>(args: Prisma.SelectSubset<T, ItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ItemUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ItemUpsertArgs>(args: Prisma.SelectSubset<T, ItemUpsertArgs<ExtArgs>>): Prisma.Prisma__ItemClient<runtime.Types.Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ItemCountArgs>(args?: Prisma.Subset<T, ItemCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ItemCountAggregateOutputType> : number>;
    aggregate<T extends ItemAggregateArgs>(args: Prisma.Subset<T, ItemAggregateArgs>): Prisma.PrismaPromise<GetItemAggregateType<T>>;
    groupBy<T extends ItemGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ItemGroupByArgs['orderBy'];
    } : {
        orderBy?: ItemGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ItemFieldRefs;
}
export interface Prisma__ItemClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    product<T extends Prisma.Item$productArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Item$productArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    events<T extends Prisma.Item$eventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Item$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ItemEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ItemFieldRefs {
    readonly id: Prisma.FieldRef<"Item", 'Int'>;
    readonly serial: Prisma.FieldRef<"Item", 'String'>;
    readonly serialKey: Prisma.FieldRef<"Item", 'String'>;
    readonly bcItemNo: Prisma.FieldRef<"Item", 'String'>;
    readonly productId: Prisma.FieldRef<"Item", 'Int'>;
    readonly status: Prisma.FieldRef<"Item", 'ItemStatus'>;
    readonly locationCode: Prisma.FieldRef<"Item", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Item", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Item", 'DateTime'>;
}
export type ItemFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where: Prisma.ItemWhereUniqueInput;
};
export type ItemFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where: Prisma.ItemWhereUniqueInput;
};
export type ItemFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput | Prisma.ItemOrderByWithRelationInput[];
    cursor?: Prisma.ItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemScalarFieldEnum | Prisma.ItemScalarFieldEnum[];
};
export type ItemFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput | Prisma.ItemOrderByWithRelationInput[];
    cursor?: Prisma.ItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemScalarFieldEnum | Prisma.ItemScalarFieldEnum[];
};
export type ItemFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput | Prisma.ItemOrderByWithRelationInput[];
    cursor?: Prisma.ItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ItemScalarFieldEnum | Prisma.ItemScalarFieldEnum[];
};
export type ItemCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemCreateInput, Prisma.ItemUncheckedCreateInput>;
};
export type ItemCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ItemCreateManyInput | Prisma.ItemCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ItemCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    data: Prisma.ItemCreateManyInput | Prisma.ItemCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ItemIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ItemUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemUpdateInput, Prisma.ItemUncheckedUpdateInput>;
    where: Prisma.ItemWhereUniqueInput;
};
export type ItemUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ItemUpdateManyMutationInput, Prisma.ItemUncheckedUpdateManyInput>;
    where?: Prisma.ItemWhereInput;
    limit?: number;
};
export type ItemUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ItemUpdateManyMutationInput, Prisma.ItemUncheckedUpdateManyInput>;
    where?: Prisma.ItemWhereInput;
    limit?: number;
    include?: Prisma.ItemIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ItemUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where: Prisma.ItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.ItemCreateInput, Prisma.ItemUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ItemUpdateInput, Prisma.ItemUncheckedUpdateInput>;
};
export type ItemDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
    where: Prisma.ItemWhereUniqueInput;
};
export type ItemDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ItemWhereInput;
    limit?: number;
};
export type Item$productArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where?: Prisma.ProductWhereInput;
};
export type Item$eventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ItemDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ItemSelect<ExtArgs> | null;
    omit?: Prisma.ItemOmit<ExtArgs> | null;
    include?: Prisma.ItemInclude<ExtArgs> | null;
};
//# sourceMappingURL=Item.d.ts.map