import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BcItemModel = runtime.Types.Result.DefaultSelection<Prisma.$BcItemPayload>;
export type AggregateBcItem = {
    _count: BcItemCountAggregateOutputType | null;
    _avg: BcItemAvgAggregateOutputType | null;
    _sum: BcItemSumAggregateOutputType | null;
    _min: BcItemMinAggregateOutputType | null;
    _max: BcItemMaxAggregateOutputType | null;
};
export type BcItemAvgAggregateOutputType = {
    productId: number | null;
    salesProductId: number | null;
};
export type BcItemSumAggregateOutputType = {
    productId: number | null;
    salesProductId: number | null;
};
export type BcItemMinAggregateOutputType = {
    itemNo: string | null;
    description: string | null;
    productId: number | null;
    refineryHint: string | null;
    salesProductId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BcItemMaxAggregateOutputType = {
    itemNo: string | null;
    description: string | null;
    productId: number | null;
    refineryHint: string | null;
    salesProductId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BcItemCountAggregateOutputType = {
    itemNo: number;
    description: number;
    productId: number;
    refineryHint: number;
    salesProductId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BcItemAvgAggregateInputType = {
    productId?: true;
    salesProductId?: true;
};
export type BcItemSumAggregateInputType = {
    productId?: true;
    salesProductId?: true;
};
export type BcItemMinAggregateInputType = {
    itemNo?: true;
    description?: true;
    productId?: true;
    refineryHint?: true;
    salesProductId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BcItemMaxAggregateInputType = {
    itemNo?: true;
    description?: true;
    productId?: true;
    refineryHint?: true;
    salesProductId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BcItemCountAggregateInputType = {
    itemNo?: true;
    description?: true;
    productId?: true;
    refineryHint?: true;
    salesProductId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BcItemAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcItemWhereInput;
    orderBy?: Prisma.BcItemOrderByWithRelationInput | Prisma.BcItemOrderByWithRelationInput[];
    cursor?: Prisma.BcItemWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BcItemCountAggregateInputType;
    _avg?: BcItemAvgAggregateInputType;
    _sum?: BcItemSumAggregateInputType;
    _min?: BcItemMinAggregateInputType;
    _max?: BcItemMaxAggregateInputType;
};
export type GetBcItemAggregateType<T extends BcItemAggregateArgs> = {
    [P in keyof T & keyof AggregateBcItem]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBcItem[P]> : Prisma.GetScalarType<T[P], AggregateBcItem[P]>;
};
export type BcItemGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcItemWhereInput;
    orderBy?: Prisma.BcItemOrderByWithAggregationInput | Prisma.BcItemOrderByWithAggregationInput[];
    by: Prisma.BcItemScalarFieldEnum[] | Prisma.BcItemScalarFieldEnum;
    having?: Prisma.BcItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BcItemCountAggregateInputType | true;
    _avg?: BcItemAvgAggregateInputType;
    _sum?: BcItemSumAggregateInputType;
    _min?: BcItemMinAggregateInputType;
    _max?: BcItemMaxAggregateInputType;
};
export type BcItemGroupByOutputType = {
    itemNo: string;
    description: string;
    productId: number | null;
    refineryHint: string | null;
    salesProductId: number | null;
    createdAt: Date;
    updatedAt: Date;
    _count: BcItemCountAggregateOutputType | null;
    _avg: BcItemAvgAggregateOutputType | null;
    _sum: BcItemSumAggregateOutputType | null;
    _min: BcItemMinAggregateOutputType | null;
    _max: BcItemMaxAggregateOutputType | null;
};
export type GetBcItemGroupByPayload<T extends BcItemGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BcItemGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BcItemGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BcItemGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BcItemGroupByOutputType[P]>;
}>>;
export type BcItemWhereInput = {
    AND?: Prisma.BcItemWhereInput | Prisma.BcItemWhereInput[];
    OR?: Prisma.BcItemWhereInput[];
    NOT?: Prisma.BcItemWhereInput | Prisma.BcItemWhereInput[];
    itemNo?: Prisma.StringFilter<"BcItem"> | string;
    description?: Prisma.StringFilter<"BcItem"> | string;
    productId?: Prisma.IntNullableFilter<"BcItem"> | number | null;
    refineryHint?: Prisma.StringNullableFilter<"BcItem"> | string | null;
    salesProductId?: Prisma.IntNullableFilter<"BcItem"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"BcItem"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcItem"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductNullableScalarRelationFilter, Prisma.ProductWhereInput> | null;
    salesProduct?: Prisma.XOR<Prisma.SalesProductNullableScalarRelationFilter, Prisma.SalesProductWhereInput> | null;
};
export type BcItemOrderByWithRelationInput = {
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    productId?: Prisma.SortOrderInput | Prisma.SortOrder;
    refineryHint?: Prisma.SortOrderInput | Prisma.SortOrder;
    salesProductId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    product?: Prisma.ProductOrderByWithRelationInput;
    salesProduct?: Prisma.SalesProductOrderByWithRelationInput;
};
export type BcItemWhereUniqueInput = Prisma.AtLeast<{
    itemNo?: string;
    AND?: Prisma.BcItemWhereInput | Prisma.BcItemWhereInput[];
    OR?: Prisma.BcItemWhereInput[];
    NOT?: Prisma.BcItemWhereInput | Prisma.BcItemWhereInput[];
    description?: Prisma.StringFilter<"BcItem"> | string;
    productId?: Prisma.IntNullableFilter<"BcItem"> | number | null;
    refineryHint?: Prisma.StringNullableFilter<"BcItem"> | string | null;
    salesProductId?: Prisma.IntNullableFilter<"BcItem"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"BcItem"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcItem"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductNullableScalarRelationFilter, Prisma.ProductWhereInput> | null;
    salesProduct?: Prisma.XOR<Prisma.SalesProductNullableScalarRelationFilter, Prisma.SalesProductWhereInput> | null;
}, "itemNo">;
export type BcItemOrderByWithAggregationInput = {
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    productId?: Prisma.SortOrderInput | Prisma.SortOrder;
    refineryHint?: Prisma.SortOrderInput | Prisma.SortOrder;
    salesProductId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BcItemCountOrderByAggregateInput;
    _avg?: Prisma.BcItemAvgOrderByAggregateInput;
    _max?: Prisma.BcItemMaxOrderByAggregateInput;
    _min?: Prisma.BcItemMinOrderByAggregateInput;
    _sum?: Prisma.BcItemSumOrderByAggregateInput;
};
export type BcItemScalarWhereWithAggregatesInput = {
    AND?: Prisma.BcItemScalarWhereWithAggregatesInput | Prisma.BcItemScalarWhereWithAggregatesInput[];
    OR?: Prisma.BcItemScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BcItemScalarWhereWithAggregatesInput | Prisma.BcItemScalarWhereWithAggregatesInput[];
    itemNo?: Prisma.StringWithAggregatesFilter<"BcItem"> | string;
    description?: Prisma.StringWithAggregatesFilter<"BcItem"> | string;
    productId?: Prisma.IntNullableWithAggregatesFilter<"BcItem"> | number | null;
    refineryHint?: Prisma.StringNullableWithAggregatesFilter<"BcItem"> | string | null;
    salesProductId?: Prisma.IntNullableWithAggregatesFilter<"BcItem"> | number | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BcItem"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"BcItem"> | Date | string;
};
export type BcItemCreateInput = {
    itemNo: string;
    description: string;
    refineryHint?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    product?: Prisma.ProductCreateNestedOneWithoutBcItemsInput;
    salesProduct?: Prisma.SalesProductCreateNestedOneWithoutBcItemsInput;
};
export type BcItemUncheckedCreateInput = {
    itemNo: string;
    description: string;
    productId?: number | null;
    refineryHint?: string | null;
    salesProductId?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcItemUpdateInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneWithoutBcItemsNestedInput;
    salesProduct?: Prisma.SalesProductUpdateOneWithoutBcItemsNestedInput;
};
export type BcItemUncheckedUpdateInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcItemCreateManyInput = {
    itemNo: string;
    description: string;
    productId?: number | null;
    refineryHint?: string | null;
    salesProductId?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcItemUpdateManyMutationInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcItemUncheckedUpdateManyInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcItemListRelationFilter = {
    every?: Prisma.BcItemWhereInput;
    some?: Prisma.BcItemWhereInput;
    none?: Prisma.BcItemWhereInput;
};
export type BcItemOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BcItemCountOrderByAggregateInput = {
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    refineryHint?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcItemAvgOrderByAggregateInput = {
    productId?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
};
export type BcItemMaxOrderByAggregateInput = {
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    refineryHint?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcItemMinOrderByAggregateInput = {
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    refineryHint?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcItemSumOrderByAggregateInput = {
    productId?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
};
export type BcItemCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.BcItemCreateWithoutProductInput, Prisma.BcItemUncheckedCreateWithoutProductInput> | Prisma.BcItemCreateWithoutProductInput[] | Prisma.BcItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.BcItemCreateOrConnectWithoutProductInput | Prisma.BcItemCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.BcItemCreateManyProductInputEnvelope;
    connect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
};
export type BcItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.BcItemCreateWithoutProductInput, Prisma.BcItemUncheckedCreateWithoutProductInput> | Prisma.BcItemCreateWithoutProductInput[] | Prisma.BcItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.BcItemCreateOrConnectWithoutProductInput | Prisma.BcItemCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.BcItemCreateManyProductInputEnvelope;
    connect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
};
export type BcItemUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.BcItemCreateWithoutProductInput, Prisma.BcItemUncheckedCreateWithoutProductInput> | Prisma.BcItemCreateWithoutProductInput[] | Prisma.BcItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.BcItemCreateOrConnectWithoutProductInput | Prisma.BcItemCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.BcItemUpsertWithWhereUniqueWithoutProductInput | Prisma.BcItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.BcItemCreateManyProductInputEnvelope;
    set?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    disconnect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    delete?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    connect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    update?: Prisma.BcItemUpdateWithWhereUniqueWithoutProductInput | Prisma.BcItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.BcItemUpdateManyWithWhereWithoutProductInput | Prisma.BcItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.BcItemScalarWhereInput | Prisma.BcItemScalarWhereInput[];
};
export type BcItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.BcItemCreateWithoutProductInput, Prisma.BcItemUncheckedCreateWithoutProductInput> | Prisma.BcItemCreateWithoutProductInput[] | Prisma.BcItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.BcItemCreateOrConnectWithoutProductInput | Prisma.BcItemCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.BcItemUpsertWithWhereUniqueWithoutProductInput | Prisma.BcItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.BcItemCreateManyProductInputEnvelope;
    set?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    disconnect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    delete?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    connect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    update?: Prisma.BcItemUpdateWithWhereUniqueWithoutProductInput | Prisma.BcItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.BcItemUpdateManyWithWhereWithoutProductInput | Prisma.BcItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.BcItemScalarWhereInput | Prisma.BcItemScalarWhereInput[];
};
export type BcItemCreateNestedManyWithoutSalesProductInput = {
    create?: Prisma.XOR<Prisma.BcItemCreateWithoutSalesProductInput, Prisma.BcItemUncheckedCreateWithoutSalesProductInput> | Prisma.BcItemCreateWithoutSalesProductInput[] | Prisma.BcItemUncheckedCreateWithoutSalesProductInput[];
    connectOrCreate?: Prisma.BcItemCreateOrConnectWithoutSalesProductInput | Prisma.BcItemCreateOrConnectWithoutSalesProductInput[];
    createMany?: Prisma.BcItemCreateManySalesProductInputEnvelope;
    connect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
};
export type BcItemUncheckedCreateNestedManyWithoutSalesProductInput = {
    create?: Prisma.XOR<Prisma.BcItemCreateWithoutSalesProductInput, Prisma.BcItemUncheckedCreateWithoutSalesProductInput> | Prisma.BcItemCreateWithoutSalesProductInput[] | Prisma.BcItemUncheckedCreateWithoutSalesProductInput[];
    connectOrCreate?: Prisma.BcItemCreateOrConnectWithoutSalesProductInput | Prisma.BcItemCreateOrConnectWithoutSalesProductInput[];
    createMany?: Prisma.BcItemCreateManySalesProductInputEnvelope;
    connect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
};
export type BcItemUpdateManyWithoutSalesProductNestedInput = {
    create?: Prisma.XOR<Prisma.BcItemCreateWithoutSalesProductInput, Prisma.BcItemUncheckedCreateWithoutSalesProductInput> | Prisma.BcItemCreateWithoutSalesProductInput[] | Prisma.BcItemUncheckedCreateWithoutSalesProductInput[];
    connectOrCreate?: Prisma.BcItemCreateOrConnectWithoutSalesProductInput | Prisma.BcItemCreateOrConnectWithoutSalesProductInput[];
    upsert?: Prisma.BcItemUpsertWithWhereUniqueWithoutSalesProductInput | Prisma.BcItemUpsertWithWhereUniqueWithoutSalesProductInput[];
    createMany?: Prisma.BcItemCreateManySalesProductInputEnvelope;
    set?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    disconnect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    delete?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    connect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    update?: Prisma.BcItemUpdateWithWhereUniqueWithoutSalesProductInput | Prisma.BcItemUpdateWithWhereUniqueWithoutSalesProductInput[];
    updateMany?: Prisma.BcItemUpdateManyWithWhereWithoutSalesProductInput | Prisma.BcItemUpdateManyWithWhereWithoutSalesProductInput[];
    deleteMany?: Prisma.BcItemScalarWhereInput | Prisma.BcItemScalarWhereInput[];
};
export type BcItemUncheckedUpdateManyWithoutSalesProductNestedInput = {
    create?: Prisma.XOR<Prisma.BcItemCreateWithoutSalesProductInput, Prisma.BcItemUncheckedCreateWithoutSalesProductInput> | Prisma.BcItemCreateWithoutSalesProductInput[] | Prisma.BcItemUncheckedCreateWithoutSalesProductInput[];
    connectOrCreate?: Prisma.BcItemCreateOrConnectWithoutSalesProductInput | Prisma.BcItemCreateOrConnectWithoutSalesProductInput[];
    upsert?: Prisma.BcItemUpsertWithWhereUniqueWithoutSalesProductInput | Prisma.BcItemUpsertWithWhereUniqueWithoutSalesProductInput[];
    createMany?: Prisma.BcItemCreateManySalesProductInputEnvelope;
    set?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    disconnect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    delete?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    connect?: Prisma.BcItemWhereUniqueInput | Prisma.BcItemWhereUniqueInput[];
    update?: Prisma.BcItemUpdateWithWhereUniqueWithoutSalesProductInput | Prisma.BcItemUpdateWithWhereUniqueWithoutSalesProductInput[];
    updateMany?: Prisma.BcItemUpdateManyWithWhereWithoutSalesProductInput | Prisma.BcItemUpdateManyWithWhereWithoutSalesProductInput[];
    deleteMany?: Prisma.BcItemScalarWhereInput | Prisma.BcItemScalarWhereInput[];
};
export type BcItemCreateWithoutProductInput = {
    itemNo: string;
    description: string;
    refineryHint?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    salesProduct?: Prisma.SalesProductCreateNestedOneWithoutBcItemsInput;
};
export type BcItemUncheckedCreateWithoutProductInput = {
    itemNo: string;
    description: string;
    refineryHint?: string | null;
    salesProductId?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcItemCreateOrConnectWithoutProductInput = {
    where: Prisma.BcItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcItemCreateWithoutProductInput, Prisma.BcItemUncheckedCreateWithoutProductInput>;
};
export type BcItemCreateManyProductInputEnvelope = {
    data: Prisma.BcItemCreateManyProductInput | Prisma.BcItemCreateManyProductInput[];
    skipDuplicates?: boolean;
};
export type BcItemUpsertWithWhereUniqueWithoutProductInput = {
    where: Prisma.BcItemWhereUniqueInput;
    update: Prisma.XOR<Prisma.BcItemUpdateWithoutProductInput, Prisma.BcItemUncheckedUpdateWithoutProductInput>;
    create: Prisma.XOR<Prisma.BcItemCreateWithoutProductInput, Prisma.BcItemUncheckedCreateWithoutProductInput>;
};
export type BcItemUpdateWithWhereUniqueWithoutProductInput = {
    where: Prisma.BcItemWhereUniqueInput;
    data: Prisma.XOR<Prisma.BcItemUpdateWithoutProductInput, Prisma.BcItemUncheckedUpdateWithoutProductInput>;
};
export type BcItemUpdateManyWithWhereWithoutProductInput = {
    where: Prisma.BcItemScalarWhereInput;
    data: Prisma.XOR<Prisma.BcItemUpdateManyMutationInput, Prisma.BcItemUncheckedUpdateManyWithoutProductInput>;
};
export type BcItemScalarWhereInput = {
    AND?: Prisma.BcItemScalarWhereInput | Prisma.BcItemScalarWhereInput[];
    OR?: Prisma.BcItemScalarWhereInput[];
    NOT?: Prisma.BcItemScalarWhereInput | Prisma.BcItemScalarWhereInput[];
    itemNo?: Prisma.StringFilter<"BcItem"> | string;
    description?: Prisma.StringFilter<"BcItem"> | string;
    productId?: Prisma.IntNullableFilter<"BcItem"> | number | null;
    refineryHint?: Prisma.StringNullableFilter<"BcItem"> | string | null;
    salesProductId?: Prisma.IntNullableFilter<"BcItem"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"BcItem"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcItem"> | Date | string;
};
export type BcItemCreateWithoutSalesProductInput = {
    itemNo: string;
    description: string;
    refineryHint?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    product?: Prisma.ProductCreateNestedOneWithoutBcItemsInput;
};
export type BcItemUncheckedCreateWithoutSalesProductInput = {
    itemNo: string;
    description: string;
    productId?: number | null;
    refineryHint?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcItemCreateOrConnectWithoutSalesProductInput = {
    where: Prisma.BcItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcItemCreateWithoutSalesProductInput, Prisma.BcItemUncheckedCreateWithoutSalesProductInput>;
};
export type BcItemCreateManySalesProductInputEnvelope = {
    data: Prisma.BcItemCreateManySalesProductInput | Prisma.BcItemCreateManySalesProductInput[];
    skipDuplicates?: boolean;
};
export type BcItemUpsertWithWhereUniqueWithoutSalesProductInput = {
    where: Prisma.BcItemWhereUniqueInput;
    update: Prisma.XOR<Prisma.BcItemUpdateWithoutSalesProductInput, Prisma.BcItemUncheckedUpdateWithoutSalesProductInput>;
    create: Prisma.XOR<Prisma.BcItemCreateWithoutSalesProductInput, Prisma.BcItemUncheckedCreateWithoutSalesProductInput>;
};
export type BcItemUpdateWithWhereUniqueWithoutSalesProductInput = {
    where: Prisma.BcItemWhereUniqueInput;
    data: Prisma.XOR<Prisma.BcItemUpdateWithoutSalesProductInput, Prisma.BcItemUncheckedUpdateWithoutSalesProductInput>;
};
export type BcItemUpdateManyWithWhereWithoutSalesProductInput = {
    where: Prisma.BcItemScalarWhereInput;
    data: Prisma.XOR<Prisma.BcItemUpdateManyMutationInput, Prisma.BcItemUncheckedUpdateManyWithoutSalesProductInput>;
};
export type BcItemCreateManyProductInput = {
    itemNo: string;
    description: string;
    refineryHint?: string | null;
    salesProductId?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcItemUpdateWithoutProductInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    salesProduct?: Prisma.SalesProductUpdateOneWithoutBcItemsNestedInput;
};
export type BcItemUncheckedUpdateWithoutProductInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcItemUncheckedUpdateManyWithoutProductInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcItemCreateManySalesProductInput = {
    itemNo: string;
    description: string;
    productId?: number | null;
    refineryHint?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcItemUpdateWithoutSalesProductInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneWithoutBcItemsNestedInput;
};
export type BcItemUncheckedUpdateWithoutSalesProductInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcItemUncheckedUpdateManyWithoutSalesProductInput = {
    itemNo?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    refineryHint?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcItemSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    itemNo?: boolean;
    description?: boolean;
    productId?: boolean;
    refineryHint?: boolean;
    salesProductId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.BcItem$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.BcItem$salesProductArgs<ExtArgs>;
}, ExtArgs["result"]["bcItem"]>;
export type BcItemSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    itemNo?: boolean;
    description?: boolean;
    productId?: boolean;
    refineryHint?: boolean;
    salesProductId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.BcItem$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.BcItem$salesProductArgs<ExtArgs>;
}, ExtArgs["result"]["bcItem"]>;
export type BcItemSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    itemNo?: boolean;
    description?: boolean;
    productId?: boolean;
    refineryHint?: boolean;
    salesProductId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.BcItem$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.BcItem$salesProductArgs<ExtArgs>;
}, ExtArgs["result"]["bcItem"]>;
export type BcItemSelectScalar = {
    itemNo?: boolean;
    description?: boolean;
    productId?: boolean;
    refineryHint?: boolean;
    salesProductId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BcItemOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"itemNo" | "description" | "productId" | "refineryHint" | "salesProductId" | "createdAt" | "updatedAt", ExtArgs["result"]["bcItem"]>;
export type BcItemInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.BcItem$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.BcItem$salesProductArgs<ExtArgs>;
};
export type BcItemIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.BcItem$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.BcItem$salesProductArgs<ExtArgs>;
};
export type BcItemIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.BcItem$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.BcItem$salesProductArgs<ExtArgs>;
};
export type $BcItemPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BcItem";
    objects: {
        product: Prisma.$ProductPayload<ExtArgs> | null;
        salesProduct: Prisma.$SalesProductPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        itemNo: string;
        description: string;
        productId: number | null;
        refineryHint: string | null;
        salesProductId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["bcItem"]>;
    composites: {};
};
export type BcItemGetPayload<S extends boolean | null | undefined | BcItemDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BcItemPayload, S>;
export type BcItemCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BcItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BcItemCountAggregateInputType | true;
};
export interface BcItemDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BcItem'];
        meta: {
            name: 'BcItem';
        };
    };
    findUnique<T extends BcItemFindUniqueArgs>(args: Prisma.SelectSubset<T, BcItemFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BcItemClient<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BcItemFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BcItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BcItemClient<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BcItemFindFirstArgs>(args?: Prisma.SelectSubset<T, BcItemFindFirstArgs<ExtArgs>>): Prisma.Prisma__BcItemClient<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BcItemFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BcItemFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BcItemClient<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BcItemFindManyArgs>(args?: Prisma.SelectSubset<T, BcItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BcItemCreateArgs>(args: Prisma.SelectSubset<T, BcItemCreateArgs<ExtArgs>>): Prisma.Prisma__BcItemClient<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BcItemCreateManyArgs>(args?: Prisma.SelectSubset<T, BcItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BcItemCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BcItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BcItemDeleteArgs>(args: Prisma.SelectSubset<T, BcItemDeleteArgs<ExtArgs>>): Prisma.Prisma__BcItemClient<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BcItemUpdateArgs>(args: Prisma.SelectSubset<T, BcItemUpdateArgs<ExtArgs>>): Prisma.Prisma__BcItemClient<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BcItemDeleteManyArgs>(args?: Prisma.SelectSubset<T, BcItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BcItemUpdateManyArgs>(args: Prisma.SelectSubset<T, BcItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BcItemUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BcItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BcItemUpsertArgs>(args: Prisma.SelectSubset<T, BcItemUpsertArgs<ExtArgs>>): Prisma.Prisma__BcItemClient<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BcItemCountArgs>(args?: Prisma.Subset<T, BcItemCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BcItemCountAggregateOutputType> : number>;
    aggregate<T extends BcItemAggregateArgs>(args: Prisma.Subset<T, BcItemAggregateArgs>): Prisma.PrismaPromise<GetBcItemAggregateType<T>>;
    groupBy<T extends BcItemGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BcItemGroupByArgs['orderBy'];
    } : {
        orderBy?: BcItemGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BcItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBcItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BcItemFieldRefs;
}
export interface Prisma__BcItemClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    product<T extends Prisma.BcItem$productArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BcItem$productArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    salesProduct<T extends Prisma.BcItem$salesProductArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BcItem$salesProductArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BcItemFieldRefs {
    readonly itemNo: Prisma.FieldRef<"BcItem", 'String'>;
    readonly description: Prisma.FieldRef<"BcItem", 'String'>;
    readonly productId: Prisma.FieldRef<"BcItem", 'Int'>;
    readonly refineryHint: Prisma.FieldRef<"BcItem", 'String'>;
    readonly salesProductId: Prisma.FieldRef<"BcItem", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"BcItem", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"BcItem", 'DateTime'>;
}
export type BcItemFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    where: Prisma.BcItemWhereUniqueInput;
};
export type BcItemFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    where: Prisma.BcItemWhereUniqueInput;
};
export type BcItemFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    where?: Prisma.BcItemWhereInput;
    orderBy?: Prisma.BcItemOrderByWithRelationInput | Prisma.BcItemOrderByWithRelationInput[];
    cursor?: Prisma.BcItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcItemScalarFieldEnum | Prisma.BcItemScalarFieldEnum[];
};
export type BcItemFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    where?: Prisma.BcItemWhereInput;
    orderBy?: Prisma.BcItemOrderByWithRelationInput | Prisma.BcItemOrderByWithRelationInput[];
    cursor?: Prisma.BcItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcItemScalarFieldEnum | Prisma.BcItemScalarFieldEnum[];
};
export type BcItemFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    where?: Prisma.BcItemWhereInput;
    orderBy?: Prisma.BcItemOrderByWithRelationInput | Prisma.BcItemOrderByWithRelationInput[];
    cursor?: Prisma.BcItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcItemScalarFieldEnum | Prisma.BcItemScalarFieldEnum[];
};
export type BcItemCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcItemCreateInput, Prisma.BcItemUncheckedCreateInput>;
};
export type BcItemCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BcItemCreateManyInput | Prisma.BcItemCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BcItemCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    data: Prisma.BcItemCreateManyInput | Prisma.BcItemCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BcItemIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BcItemUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcItemUpdateInput, Prisma.BcItemUncheckedUpdateInput>;
    where: Prisma.BcItemWhereUniqueInput;
};
export type BcItemUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BcItemUpdateManyMutationInput, Prisma.BcItemUncheckedUpdateManyInput>;
    where?: Prisma.BcItemWhereInput;
    limit?: number;
};
export type BcItemUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcItemUpdateManyMutationInput, Prisma.BcItemUncheckedUpdateManyInput>;
    where?: Prisma.BcItemWhereInput;
    limit?: number;
    include?: Prisma.BcItemIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BcItemUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    where: Prisma.BcItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcItemCreateInput, Prisma.BcItemUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BcItemUpdateInput, Prisma.BcItemUncheckedUpdateInput>;
};
export type BcItemDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    where: Prisma.BcItemWhereUniqueInput;
};
export type BcItemDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcItemWhereInput;
    limit?: number;
};
export type BcItem$productArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where?: Prisma.ProductWhereInput;
};
export type BcItem$salesProductArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    where?: Prisma.SalesProductWhereInput;
};
export type BcItemDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
};
//# sourceMappingURL=BcItem.d.ts.map