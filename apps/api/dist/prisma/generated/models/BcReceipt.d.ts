import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BcReceiptModel = runtime.Types.Result.DefaultSelection<Prisma.$BcReceiptPayload>;
export type AggregateBcReceipt = {
    _count: BcReceiptCountAggregateOutputType | null;
    _avg: BcReceiptAvgAggregateOutputType | null;
    _sum: BcReceiptSumAggregateOutputType | null;
    _min: BcReceiptMinAggregateOutputType | null;
    _max: BcReceiptMaxAggregateOutputType | null;
};
export type BcReceiptAvgAggregateOutputType = {
    id: number | null;
    sellerId: number | null;
    importBatchId: number | null;
};
export type BcReceiptSumAggregateOutputType = {
    id: number | null;
    sellerId: number | null;
    importBatchId: number | null;
};
export type BcReceiptMinAggregateOutputType = {
    id: number | null;
    no: string | null;
    vendorNo: string | null;
    sellerId: number | null;
    documentDate: Date | null;
    locationCode: string | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BcReceiptMaxAggregateOutputType = {
    id: number | null;
    no: string | null;
    vendorNo: string | null;
    sellerId: number | null;
    documentDate: Date | null;
    locationCode: string | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BcReceiptCountAggregateOutputType = {
    id: number;
    no: number;
    vendorNo: number;
    sellerId: number;
    documentDate: number;
    locationCode: number;
    missingFromImport: number;
    importBatchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BcReceiptAvgAggregateInputType = {
    id?: true;
    sellerId?: true;
    importBatchId?: true;
};
export type BcReceiptSumAggregateInputType = {
    id?: true;
    sellerId?: true;
    importBatchId?: true;
};
export type BcReceiptMinAggregateInputType = {
    id?: true;
    no?: true;
    vendorNo?: true;
    sellerId?: true;
    documentDate?: true;
    locationCode?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BcReceiptMaxAggregateInputType = {
    id?: true;
    no?: true;
    vendorNo?: true;
    sellerId?: true;
    documentDate?: true;
    locationCode?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BcReceiptCountAggregateInputType = {
    id?: true;
    no?: true;
    vendorNo?: true;
    sellerId?: true;
    documentDate?: true;
    locationCode?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BcReceiptAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcReceiptWhereInput;
    orderBy?: Prisma.BcReceiptOrderByWithRelationInput | Prisma.BcReceiptOrderByWithRelationInput[];
    cursor?: Prisma.BcReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BcReceiptCountAggregateInputType;
    _avg?: BcReceiptAvgAggregateInputType;
    _sum?: BcReceiptSumAggregateInputType;
    _min?: BcReceiptMinAggregateInputType;
    _max?: BcReceiptMaxAggregateInputType;
};
export type GetBcReceiptAggregateType<T extends BcReceiptAggregateArgs> = {
    [P in keyof T & keyof AggregateBcReceipt]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBcReceipt[P]> : Prisma.GetScalarType<T[P], AggregateBcReceipt[P]>;
};
export type BcReceiptGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcReceiptWhereInput;
    orderBy?: Prisma.BcReceiptOrderByWithAggregationInput | Prisma.BcReceiptOrderByWithAggregationInput[];
    by: Prisma.BcReceiptScalarFieldEnum[] | Prisma.BcReceiptScalarFieldEnum;
    having?: Prisma.BcReceiptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BcReceiptCountAggregateInputType | true;
    _avg?: BcReceiptAvgAggregateInputType;
    _sum?: BcReceiptSumAggregateInputType;
    _min?: BcReceiptMinAggregateInputType;
    _max?: BcReceiptMaxAggregateInputType;
};
export type BcReceiptGroupByOutputType = {
    id: number;
    no: string;
    vendorNo: string | null;
    sellerId: number | null;
    documentDate: Date | null;
    locationCode: string | null;
    missingFromImport: boolean;
    importBatchId: number;
    createdAt: Date;
    updatedAt: Date;
    _count: BcReceiptCountAggregateOutputType | null;
    _avg: BcReceiptAvgAggregateOutputType | null;
    _sum: BcReceiptSumAggregateOutputType | null;
    _min: BcReceiptMinAggregateOutputType | null;
    _max: BcReceiptMaxAggregateOutputType | null;
};
export type GetBcReceiptGroupByPayload<T extends BcReceiptGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BcReceiptGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BcReceiptGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BcReceiptGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BcReceiptGroupByOutputType[P]>;
}>>;
export type BcReceiptWhereInput = {
    AND?: Prisma.BcReceiptWhereInput | Prisma.BcReceiptWhereInput[];
    OR?: Prisma.BcReceiptWhereInput[];
    NOT?: Prisma.BcReceiptWhereInput | Prisma.BcReceiptWhereInput[];
    id?: Prisma.IntFilter<"BcReceipt"> | number;
    no?: Prisma.StringFilter<"BcReceipt"> | string;
    vendorNo?: Prisma.StringNullableFilter<"BcReceipt"> | string | null;
    sellerId?: Prisma.IntNullableFilter<"BcReceipt"> | number | null;
    documentDate?: Prisma.DateTimeNullableFilter<"BcReceipt"> | Date | string | null;
    locationCode?: Prisma.StringNullableFilter<"BcReceipt"> | string | null;
    missingFromImport?: Prisma.BoolFilter<"BcReceipt"> | boolean;
    importBatchId?: Prisma.IntFilter<"BcReceipt"> | number;
    createdAt?: Prisma.DateTimeFilter<"BcReceipt"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcReceipt"> | Date | string;
    seller?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
};
export type BcReceiptOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    vendorNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    sellerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    documentDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    seller?: Prisma.CustomerOrderByWithRelationInput;
};
export type BcReceiptWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    no?: string;
    AND?: Prisma.BcReceiptWhereInput | Prisma.BcReceiptWhereInput[];
    OR?: Prisma.BcReceiptWhereInput[];
    NOT?: Prisma.BcReceiptWhereInput | Prisma.BcReceiptWhereInput[];
    vendorNo?: Prisma.StringNullableFilter<"BcReceipt"> | string | null;
    sellerId?: Prisma.IntNullableFilter<"BcReceipt"> | number | null;
    documentDate?: Prisma.DateTimeNullableFilter<"BcReceipt"> | Date | string | null;
    locationCode?: Prisma.StringNullableFilter<"BcReceipt"> | string | null;
    missingFromImport?: Prisma.BoolFilter<"BcReceipt"> | boolean;
    importBatchId?: Prisma.IntFilter<"BcReceipt"> | number;
    createdAt?: Prisma.DateTimeFilter<"BcReceipt"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcReceipt"> | Date | string;
    seller?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
}, "id" | "no">;
export type BcReceiptOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    vendorNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    sellerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    documentDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BcReceiptCountOrderByAggregateInput;
    _avg?: Prisma.BcReceiptAvgOrderByAggregateInput;
    _max?: Prisma.BcReceiptMaxOrderByAggregateInput;
    _min?: Prisma.BcReceiptMinOrderByAggregateInput;
    _sum?: Prisma.BcReceiptSumOrderByAggregateInput;
};
export type BcReceiptScalarWhereWithAggregatesInput = {
    AND?: Prisma.BcReceiptScalarWhereWithAggregatesInput | Prisma.BcReceiptScalarWhereWithAggregatesInput[];
    OR?: Prisma.BcReceiptScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BcReceiptScalarWhereWithAggregatesInput | Prisma.BcReceiptScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"BcReceipt"> | number;
    no?: Prisma.StringWithAggregatesFilter<"BcReceipt"> | string;
    vendorNo?: Prisma.StringNullableWithAggregatesFilter<"BcReceipt"> | string | null;
    sellerId?: Prisma.IntNullableWithAggregatesFilter<"BcReceipt"> | number | null;
    documentDate?: Prisma.DateTimeNullableWithAggregatesFilter<"BcReceipt"> | Date | string | null;
    locationCode?: Prisma.StringNullableWithAggregatesFilter<"BcReceipt"> | string | null;
    missingFromImport?: Prisma.BoolWithAggregatesFilter<"BcReceipt"> | boolean;
    importBatchId?: Prisma.IntWithAggregatesFilter<"BcReceipt"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BcReceipt"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"BcReceipt"> | Date | string;
};
export type BcReceiptCreateInput = {
    no: string;
    vendorNo?: string | null;
    documentDate?: Date | string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    seller?: Prisma.CustomerCreateNestedOneWithoutBcReceiptsInput;
};
export type BcReceiptUncheckedCreateInput = {
    id?: number;
    no: string;
    vendorNo?: string | null;
    sellerId?: number | null;
    documentDate?: Date | string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcReceiptUpdateInput = {
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    seller?: Prisma.CustomerUpdateOneWithoutBcReceiptsNestedInput;
};
export type BcReceiptUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sellerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcReceiptCreateManyInput = {
    id?: number;
    no: string;
    vendorNo?: string | null;
    sellerId?: number | null;
    documentDate?: Date | string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcReceiptUpdateManyMutationInput = {
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcReceiptUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sellerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcReceiptListRelationFilter = {
    every?: Prisma.BcReceiptWhereInput;
    some?: Prisma.BcReceiptWhereInput;
    none?: Prisma.BcReceiptWhereInput;
};
export type BcReceiptOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BcReceiptCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    vendorNo?: Prisma.SortOrder;
    sellerId?: Prisma.SortOrder;
    documentDate?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcReceiptAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sellerId?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type BcReceiptMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    vendorNo?: Prisma.SortOrder;
    sellerId?: Prisma.SortOrder;
    documentDate?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcReceiptMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    vendorNo?: Prisma.SortOrder;
    sellerId?: Prisma.SortOrder;
    documentDate?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcReceiptSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sellerId?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type BcReceiptCreateNestedManyWithoutSellerInput = {
    create?: Prisma.XOR<Prisma.BcReceiptCreateWithoutSellerInput, Prisma.BcReceiptUncheckedCreateWithoutSellerInput> | Prisma.BcReceiptCreateWithoutSellerInput[] | Prisma.BcReceiptUncheckedCreateWithoutSellerInput[];
    connectOrCreate?: Prisma.BcReceiptCreateOrConnectWithoutSellerInput | Prisma.BcReceiptCreateOrConnectWithoutSellerInput[];
    createMany?: Prisma.BcReceiptCreateManySellerInputEnvelope;
    connect?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
};
export type BcReceiptUncheckedCreateNestedManyWithoutSellerInput = {
    create?: Prisma.XOR<Prisma.BcReceiptCreateWithoutSellerInput, Prisma.BcReceiptUncheckedCreateWithoutSellerInput> | Prisma.BcReceiptCreateWithoutSellerInput[] | Prisma.BcReceiptUncheckedCreateWithoutSellerInput[];
    connectOrCreate?: Prisma.BcReceiptCreateOrConnectWithoutSellerInput | Prisma.BcReceiptCreateOrConnectWithoutSellerInput[];
    createMany?: Prisma.BcReceiptCreateManySellerInputEnvelope;
    connect?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
};
export type BcReceiptUpdateManyWithoutSellerNestedInput = {
    create?: Prisma.XOR<Prisma.BcReceiptCreateWithoutSellerInput, Prisma.BcReceiptUncheckedCreateWithoutSellerInput> | Prisma.BcReceiptCreateWithoutSellerInput[] | Prisma.BcReceiptUncheckedCreateWithoutSellerInput[];
    connectOrCreate?: Prisma.BcReceiptCreateOrConnectWithoutSellerInput | Prisma.BcReceiptCreateOrConnectWithoutSellerInput[];
    upsert?: Prisma.BcReceiptUpsertWithWhereUniqueWithoutSellerInput | Prisma.BcReceiptUpsertWithWhereUniqueWithoutSellerInput[];
    createMany?: Prisma.BcReceiptCreateManySellerInputEnvelope;
    set?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
    disconnect?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
    delete?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
    connect?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
    update?: Prisma.BcReceiptUpdateWithWhereUniqueWithoutSellerInput | Prisma.BcReceiptUpdateWithWhereUniqueWithoutSellerInput[];
    updateMany?: Prisma.BcReceiptUpdateManyWithWhereWithoutSellerInput | Prisma.BcReceiptUpdateManyWithWhereWithoutSellerInput[];
    deleteMany?: Prisma.BcReceiptScalarWhereInput | Prisma.BcReceiptScalarWhereInput[];
};
export type BcReceiptUncheckedUpdateManyWithoutSellerNestedInput = {
    create?: Prisma.XOR<Prisma.BcReceiptCreateWithoutSellerInput, Prisma.BcReceiptUncheckedCreateWithoutSellerInput> | Prisma.BcReceiptCreateWithoutSellerInput[] | Prisma.BcReceiptUncheckedCreateWithoutSellerInput[];
    connectOrCreate?: Prisma.BcReceiptCreateOrConnectWithoutSellerInput | Prisma.BcReceiptCreateOrConnectWithoutSellerInput[];
    upsert?: Prisma.BcReceiptUpsertWithWhereUniqueWithoutSellerInput | Prisma.BcReceiptUpsertWithWhereUniqueWithoutSellerInput[];
    createMany?: Prisma.BcReceiptCreateManySellerInputEnvelope;
    set?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
    disconnect?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
    delete?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
    connect?: Prisma.BcReceiptWhereUniqueInput | Prisma.BcReceiptWhereUniqueInput[];
    update?: Prisma.BcReceiptUpdateWithWhereUniqueWithoutSellerInput | Prisma.BcReceiptUpdateWithWhereUniqueWithoutSellerInput[];
    updateMany?: Prisma.BcReceiptUpdateManyWithWhereWithoutSellerInput | Prisma.BcReceiptUpdateManyWithWhereWithoutSellerInput[];
    deleteMany?: Prisma.BcReceiptScalarWhereInput | Prisma.BcReceiptScalarWhereInput[];
};
export type BcReceiptCreateWithoutSellerInput = {
    no: string;
    vendorNo?: string | null;
    documentDate?: Date | string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcReceiptUncheckedCreateWithoutSellerInput = {
    id?: number;
    no: string;
    vendorNo?: string | null;
    documentDate?: Date | string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcReceiptCreateOrConnectWithoutSellerInput = {
    where: Prisma.BcReceiptWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcReceiptCreateWithoutSellerInput, Prisma.BcReceiptUncheckedCreateWithoutSellerInput>;
};
export type BcReceiptCreateManySellerInputEnvelope = {
    data: Prisma.BcReceiptCreateManySellerInput | Prisma.BcReceiptCreateManySellerInput[];
    skipDuplicates?: boolean;
};
export type BcReceiptUpsertWithWhereUniqueWithoutSellerInput = {
    where: Prisma.BcReceiptWhereUniqueInput;
    update: Prisma.XOR<Prisma.BcReceiptUpdateWithoutSellerInput, Prisma.BcReceiptUncheckedUpdateWithoutSellerInput>;
    create: Prisma.XOR<Prisma.BcReceiptCreateWithoutSellerInput, Prisma.BcReceiptUncheckedCreateWithoutSellerInput>;
};
export type BcReceiptUpdateWithWhereUniqueWithoutSellerInput = {
    where: Prisma.BcReceiptWhereUniqueInput;
    data: Prisma.XOR<Prisma.BcReceiptUpdateWithoutSellerInput, Prisma.BcReceiptUncheckedUpdateWithoutSellerInput>;
};
export type BcReceiptUpdateManyWithWhereWithoutSellerInput = {
    where: Prisma.BcReceiptScalarWhereInput;
    data: Prisma.XOR<Prisma.BcReceiptUpdateManyMutationInput, Prisma.BcReceiptUncheckedUpdateManyWithoutSellerInput>;
};
export type BcReceiptScalarWhereInput = {
    AND?: Prisma.BcReceiptScalarWhereInput | Prisma.BcReceiptScalarWhereInput[];
    OR?: Prisma.BcReceiptScalarWhereInput[];
    NOT?: Prisma.BcReceiptScalarWhereInput | Prisma.BcReceiptScalarWhereInput[];
    id?: Prisma.IntFilter<"BcReceipt"> | number;
    no?: Prisma.StringFilter<"BcReceipt"> | string;
    vendorNo?: Prisma.StringNullableFilter<"BcReceipt"> | string | null;
    sellerId?: Prisma.IntNullableFilter<"BcReceipt"> | number | null;
    documentDate?: Prisma.DateTimeNullableFilter<"BcReceipt"> | Date | string | null;
    locationCode?: Prisma.StringNullableFilter<"BcReceipt"> | string | null;
    missingFromImport?: Prisma.BoolFilter<"BcReceipt"> | boolean;
    importBatchId?: Prisma.IntFilter<"BcReceipt"> | number;
    createdAt?: Prisma.DateTimeFilter<"BcReceipt"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcReceipt"> | Date | string;
};
export type BcReceiptCreateManySellerInput = {
    id?: number;
    no: string;
    vendorNo?: string | null;
    documentDate?: Date | string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcReceiptUpdateWithoutSellerInput = {
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcReceiptUncheckedUpdateWithoutSellerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcReceiptUncheckedUpdateManyWithoutSellerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcReceiptSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    no?: boolean;
    vendorNo?: boolean;
    sellerId?: boolean;
    documentDate?: boolean;
    locationCode?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    seller?: boolean | Prisma.BcReceipt$sellerArgs<ExtArgs>;
}, ExtArgs["result"]["bcReceipt"]>;
export type BcReceiptSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    no?: boolean;
    vendorNo?: boolean;
    sellerId?: boolean;
    documentDate?: boolean;
    locationCode?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    seller?: boolean | Prisma.BcReceipt$sellerArgs<ExtArgs>;
}, ExtArgs["result"]["bcReceipt"]>;
export type BcReceiptSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    no?: boolean;
    vendorNo?: boolean;
    sellerId?: boolean;
    documentDate?: boolean;
    locationCode?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    seller?: boolean | Prisma.BcReceipt$sellerArgs<ExtArgs>;
}, ExtArgs["result"]["bcReceipt"]>;
export type BcReceiptSelectScalar = {
    id?: boolean;
    no?: boolean;
    vendorNo?: boolean;
    sellerId?: boolean;
    documentDate?: boolean;
    locationCode?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BcReceiptOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "no" | "vendorNo" | "sellerId" | "documentDate" | "locationCode" | "missingFromImport" | "importBatchId" | "createdAt" | "updatedAt", ExtArgs["result"]["bcReceipt"]>;
export type BcReceiptInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    seller?: boolean | Prisma.BcReceipt$sellerArgs<ExtArgs>;
};
export type BcReceiptIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    seller?: boolean | Prisma.BcReceipt$sellerArgs<ExtArgs>;
};
export type BcReceiptIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    seller?: boolean | Prisma.BcReceipt$sellerArgs<ExtArgs>;
};
export type $BcReceiptPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BcReceipt";
    objects: {
        seller: Prisma.$CustomerPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        no: string;
        vendorNo: string | null;
        sellerId: number | null;
        documentDate: Date | null;
        locationCode: string | null;
        missingFromImport: boolean;
        importBatchId: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["bcReceipt"]>;
    composites: {};
};
export type BcReceiptGetPayload<S extends boolean | null | undefined | BcReceiptDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload, S>;
export type BcReceiptCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BcReceiptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BcReceiptCountAggregateInputType | true;
};
export interface BcReceiptDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BcReceipt'];
        meta: {
            name: 'BcReceipt';
        };
    };
    findUnique<T extends BcReceiptFindUniqueArgs>(args: Prisma.SelectSubset<T, BcReceiptFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BcReceiptClient<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BcReceiptFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BcReceiptFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BcReceiptClient<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BcReceiptFindFirstArgs>(args?: Prisma.SelectSubset<T, BcReceiptFindFirstArgs<ExtArgs>>): Prisma.Prisma__BcReceiptClient<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BcReceiptFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BcReceiptFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BcReceiptClient<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BcReceiptFindManyArgs>(args?: Prisma.SelectSubset<T, BcReceiptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BcReceiptCreateArgs>(args: Prisma.SelectSubset<T, BcReceiptCreateArgs<ExtArgs>>): Prisma.Prisma__BcReceiptClient<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BcReceiptCreateManyArgs>(args?: Prisma.SelectSubset<T, BcReceiptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BcReceiptCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BcReceiptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BcReceiptDeleteArgs>(args: Prisma.SelectSubset<T, BcReceiptDeleteArgs<ExtArgs>>): Prisma.Prisma__BcReceiptClient<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BcReceiptUpdateArgs>(args: Prisma.SelectSubset<T, BcReceiptUpdateArgs<ExtArgs>>): Prisma.Prisma__BcReceiptClient<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BcReceiptDeleteManyArgs>(args?: Prisma.SelectSubset<T, BcReceiptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BcReceiptUpdateManyArgs>(args: Prisma.SelectSubset<T, BcReceiptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BcReceiptUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BcReceiptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BcReceiptUpsertArgs>(args: Prisma.SelectSubset<T, BcReceiptUpsertArgs<ExtArgs>>): Prisma.Prisma__BcReceiptClient<runtime.Types.Result.GetResult<Prisma.$BcReceiptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BcReceiptCountArgs>(args?: Prisma.Subset<T, BcReceiptCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BcReceiptCountAggregateOutputType> : number>;
    aggregate<T extends BcReceiptAggregateArgs>(args: Prisma.Subset<T, BcReceiptAggregateArgs>): Prisma.PrismaPromise<GetBcReceiptAggregateType<T>>;
    groupBy<T extends BcReceiptGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BcReceiptGroupByArgs['orderBy'];
    } : {
        orderBy?: BcReceiptGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BcReceiptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBcReceiptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BcReceiptFieldRefs;
}
export interface Prisma__BcReceiptClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    seller<T extends Prisma.BcReceipt$sellerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BcReceipt$sellerArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BcReceiptFieldRefs {
    readonly id: Prisma.FieldRef<"BcReceipt", 'Int'>;
    readonly no: Prisma.FieldRef<"BcReceipt", 'String'>;
    readonly vendorNo: Prisma.FieldRef<"BcReceipt", 'String'>;
    readonly sellerId: Prisma.FieldRef<"BcReceipt", 'Int'>;
    readonly documentDate: Prisma.FieldRef<"BcReceipt", 'DateTime'>;
    readonly locationCode: Prisma.FieldRef<"BcReceipt", 'String'>;
    readonly missingFromImport: Prisma.FieldRef<"BcReceipt", 'Boolean'>;
    readonly importBatchId: Prisma.FieldRef<"BcReceipt", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"BcReceipt", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"BcReceipt", 'DateTime'>;
}
export type BcReceiptFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
    where: Prisma.BcReceiptWhereUniqueInput;
};
export type BcReceiptFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
    where: Prisma.BcReceiptWhereUniqueInput;
};
export type BcReceiptFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
    where?: Prisma.BcReceiptWhereInput;
    orderBy?: Prisma.BcReceiptOrderByWithRelationInput | Prisma.BcReceiptOrderByWithRelationInput[];
    cursor?: Prisma.BcReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcReceiptScalarFieldEnum | Prisma.BcReceiptScalarFieldEnum[];
};
export type BcReceiptFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
    where?: Prisma.BcReceiptWhereInput;
    orderBy?: Prisma.BcReceiptOrderByWithRelationInput | Prisma.BcReceiptOrderByWithRelationInput[];
    cursor?: Prisma.BcReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcReceiptScalarFieldEnum | Prisma.BcReceiptScalarFieldEnum[];
};
export type BcReceiptFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
    where?: Prisma.BcReceiptWhereInput;
    orderBy?: Prisma.BcReceiptOrderByWithRelationInput | Prisma.BcReceiptOrderByWithRelationInput[];
    cursor?: Prisma.BcReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcReceiptScalarFieldEnum | Prisma.BcReceiptScalarFieldEnum[];
};
export type BcReceiptCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcReceiptCreateInput, Prisma.BcReceiptUncheckedCreateInput>;
};
export type BcReceiptCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BcReceiptCreateManyInput | Prisma.BcReceiptCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BcReceiptCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    data: Prisma.BcReceiptCreateManyInput | Prisma.BcReceiptCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BcReceiptIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BcReceiptUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcReceiptUpdateInput, Prisma.BcReceiptUncheckedUpdateInput>;
    where: Prisma.BcReceiptWhereUniqueInput;
};
export type BcReceiptUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BcReceiptUpdateManyMutationInput, Prisma.BcReceiptUncheckedUpdateManyInput>;
    where?: Prisma.BcReceiptWhereInput;
    limit?: number;
};
export type BcReceiptUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcReceiptUpdateManyMutationInput, Prisma.BcReceiptUncheckedUpdateManyInput>;
    where?: Prisma.BcReceiptWhereInput;
    limit?: number;
    include?: Prisma.BcReceiptIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BcReceiptUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
    where: Prisma.BcReceiptWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcReceiptCreateInput, Prisma.BcReceiptUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BcReceiptUpdateInput, Prisma.BcReceiptUncheckedUpdateInput>;
};
export type BcReceiptDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
    where: Prisma.BcReceiptWhereUniqueInput;
};
export type BcReceiptDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcReceiptWhereInput;
    limit?: number;
};
export type BcReceipt$sellerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
};
export type BcReceiptDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcReceiptSelect<ExtArgs> | null;
    omit?: Prisma.BcReceiptOmit<ExtArgs> | null;
    include?: Prisma.BcReceiptInclude<ExtArgs> | null;
};
//# sourceMappingURL=BcReceipt.d.ts.map