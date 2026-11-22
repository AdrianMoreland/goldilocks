import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BcShipmentModel = runtime.Types.Result.DefaultSelection<Prisma.$BcShipmentPayload>;
export type AggregateBcShipment = {
    _count: BcShipmentCountAggregateOutputType | null;
    _avg: BcShipmentAvgAggregateOutputType | null;
    _sum: BcShipmentSumAggregateOutputType | null;
    _min: BcShipmentMinAggregateOutputType | null;
    _max: BcShipmentMaxAggregateOutputType | null;
};
export type BcShipmentAvgAggregateOutputType = {
    id: number | null;
    customerId: number | null;
    tradeId: number | null;
    zohoInvoiceId: number | null;
    importBatchId: number | null;
};
export type BcShipmentSumAggregateOutputType = {
    id: number | null;
    customerId: number | null;
    tradeId: number | null;
    zohoInvoiceId: number | null;
    importBatchId: number | null;
};
export type BcShipmentMinAggregateOutputType = {
    id: number | null;
    no: string | null;
    customerNo: string | null;
    customerId: number | null;
    documentDate: Date | null;
    postingDate: Date | null;
    externalDocNo: string | null;
    locationCode: string | null;
    tradeId: number | null;
    zohoInvoiceId: number | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BcShipmentMaxAggregateOutputType = {
    id: number | null;
    no: string | null;
    customerNo: string | null;
    customerId: number | null;
    documentDate: Date | null;
    postingDate: Date | null;
    externalDocNo: string | null;
    locationCode: string | null;
    tradeId: number | null;
    zohoInvoiceId: number | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BcShipmentCountAggregateOutputType = {
    id: number;
    no: number;
    customerNo: number;
    customerId: number;
    documentDate: number;
    postingDate: number;
    externalDocNo: number;
    locationCode: number;
    tradeId: number;
    zohoInvoiceId: number;
    missingFromImport: number;
    importBatchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BcShipmentAvgAggregateInputType = {
    id?: true;
    customerId?: true;
    tradeId?: true;
    zohoInvoiceId?: true;
    importBatchId?: true;
};
export type BcShipmentSumAggregateInputType = {
    id?: true;
    customerId?: true;
    tradeId?: true;
    zohoInvoiceId?: true;
    importBatchId?: true;
};
export type BcShipmentMinAggregateInputType = {
    id?: true;
    no?: true;
    customerNo?: true;
    customerId?: true;
    documentDate?: true;
    postingDate?: true;
    externalDocNo?: true;
    locationCode?: true;
    tradeId?: true;
    zohoInvoiceId?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BcShipmentMaxAggregateInputType = {
    id?: true;
    no?: true;
    customerNo?: true;
    customerId?: true;
    documentDate?: true;
    postingDate?: true;
    externalDocNo?: true;
    locationCode?: true;
    tradeId?: true;
    zohoInvoiceId?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BcShipmentCountAggregateInputType = {
    id?: true;
    no?: true;
    customerNo?: true;
    customerId?: true;
    documentDate?: true;
    postingDate?: true;
    externalDocNo?: true;
    locationCode?: true;
    tradeId?: true;
    zohoInvoiceId?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BcShipmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcShipmentWhereInput;
    orderBy?: Prisma.BcShipmentOrderByWithRelationInput | Prisma.BcShipmentOrderByWithRelationInput[];
    cursor?: Prisma.BcShipmentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BcShipmentCountAggregateInputType;
    _avg?: BcShipmentAvgAggregateInputType;
    _sum?: BcShipmentSumAggregateInputType;
    _min?: BcShipmentMinAggregateInputType;
    _max?: BcShipmentMaxAggregateInputType;
};
export type GetBcShipmentAggregateType<T extends BcShipmentAggregateArgs> = {
    [P in keyof T & keyof AggregateBcShipment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBcShipment[P]> : Prisma.GetScalarType<T[P], AggregateBcShipment[P]>;
};
export type BcShipmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcShipmentWhereInput;
    orderBy?: Prisma.BcShipmentOrderByWithAggregationInput | Prisma.BcShipmentOrderByWithAggregationInput[];
    by: Prisma.BcShipmentScalarFieldEnum[] | Prisma.BcShipmentScalarFieldEnum;
    having?: Prisma.BcShipmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BcShipmentCountAggregateInputType | true;
    _avg?: BcShipmentAvgAggregateInputType;
    _sum?: BcShipmentSumAggregateInputType;
    _min?: BcShipmentMinAggregateInputType;
    _max?: BcShipmentMaxAggregateInputType;
};
export type BcShipmentGroupByOutputType = {
    id: number;
    no: string;
    customerNo: string | null;
    customerId: number | null;
    documentDate: Date | null;
    postingDate: Date | null;
    externalDocNo: string | null;
    locationCode: string | null;
    tradeId: number | null;
    zohoInvoiceId: number | null;
    missingFromImport: boolean;
    importBatchId: number;
    createdAt: Date;
    updatedAt: Date;
    _count: BcShipmentCountAggregateOutputType | null;
    _avg: BcShipmentAvgAggregateOutputType | null;
    _sum: BcShipmentSumAggregateOutputType | null;
    _min: BcShipmentMinAggregateOutputType | null;
    _max: BcShipmentMaxAggregateOutputType | null;
};
export type GetBcShipmentGroupByPayload<T extends BcShipmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BcShipmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BcShipmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BcShipmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BcShipmentGroupByOutputType[P]>;
}>>;
export type BcShipmentWhereInput = {
    AND?: Prisma.BcShipmentWhereInput | Prisma.BcShipmentWhereInput[];
    OR?: Prisma.BcShipmentWhereInput[];
    NOT?: Prisma.BcShipmentWhereInput | Prisma.BcShipmentWhereInput[];
    id?: Prisma.IntFilter<"BcShipment"> | number;
    no?: Prisma.StringFilter<"BcShipment"> | string;
    customerNo?: Prisma.StringNullableFilter<"BcShipment"> | string | null;
    customerId?: Prisma.IntNullableFilter<"BcShipment"> | number | null;
    documentDate?: Prisma.DateTimeNullableFilter<"BcShipment"> | Date | string | null;
    postingDate?: Prisma.DateTimeNullableFilter<"BcShipment"> | Date | string | null;
    externalDocNo?: Prisma.StringNullableFilter<"BcShipment"> | string | null;
    locationCode?: Prisma.StringNullableFilter<"BcShipment"> | string | null;
    tradeId?: Prisma.IntNullableFilter<"BcShipment"> | number | null;
    zohoInvoiceId?: Prisma.IntNullableFilter<"BcShipment"> | number | null;
    missingFromImport?: Prisma.BoolFilter<"BcShipment"> | boolean;
    importBatchId?: Prisma.IntFilter<"BcShipment"> | number;
    createdAt?: Prisma.DateTimeFilter<"BcShipment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcShipment"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    trade?: Prisma.XOR<Prisma.TradeNullableScalarRelationFilter, Prisma.TradeWhereInput> | null;
    zohoInvoice?: Prisma.XOR<Prisma.ZohoInvoiceNullableScalarRelationFilter, Prisma.ZohoInvoiceWhereInput> | null;
};
export type BcShipmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    documentDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    postingDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    externalDocNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    tradeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    zohoInvoiceId?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    trade?: Prisma.TradeOrderByWithRelationInput;
    zohoInvoice?: Prisma.ZohoInvoiceOrderByWithRelationInput;
};
export type BcShipmentWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    no?: string;
    AND?: Prisma.BcShipmentWhereInput | Prisma.BcShipmentWhereInput[];
    OR?: Prisma.BcShipmentWhereInput[];
    NOT?: Prisma.BcShipmentWhereInput | Prisma.BcShipmentWhereInput[];
    customerNo?: Prisma.StringNullableFilter<"BcShipment"> | string | null;
    customerId?: Prisma.IntNullableFilter<"BcShipment"> | number | null;
    documentDate?: Prisma.DateTimeNullableFilter<"BcShipment"> | Date | string | null;
    postingDate?: Prisma.DateTimeNullableFilter<"BcShipment"> | Date | string | null;
    externalDocNo?: Prisma.StringNullableFilter<"BcShipment"> | string | null;
    locationCode?: Prisma.StringNullableFilter<"BcShipment"> | string | null;
    tradeId?: Prisma.IntNullableFilter<"BcShipment"> | number | null;
    zohoInvoiceId?: Prisma.IntNullableFilter<"BcShipment"> | number | null;
    missingFromImport?: Prisma.BoolFilter<"BcShipment"> | boolean;
    importBatchId?: Prisma.IntFilter<"BcShipment"> | number;
    createdAt?: Prisma.DateTimeFilter<"BcShipment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcShipment"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    trade?: Prisma.XOR<Prisma.TradeNullableScalarRelationFilter, Prisma.TradeWhereInput> | null;
    zohoInvoice?: Prisma.XOR<Prisma.ZohoInvoiceNullableScalarRelationFilter, Prisma.ZohoInvoiceWhereInput> | null;
}, "id" | "no">;
export type BcShipmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    documentDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    postingDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    externalDocNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    tradeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    zohoInvoiceId?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BcShipmentCountOrderByAggregateInput;
    _avg?: Prisma.BcShipmentAvgOrderByAggregateInput;
    _max?: Prisma.BcShipmentMaxOrderByAggregateInput;
    _min?: Prisma.BcShipmentMinOrderByAggregateInput;
    _sum?: Prisma.BcShipmentSumOrderByAggregateInput;
};
export type BcShipmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.BcShipmentScalarWhereWithAggregatesInput | Prisma.BcShipmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.BcShipmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BcShipmentScalarWhereWithAggregatesInput | Prisma.BcShipmentScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"BcShipment"> | number;
    no?: Prisma.StringWithAggregatesFilter<"BcShipment"> | string;
    customerNo?: Prisma.StringNullableWithAggregatesFilter<"BcShipment"> | string | null;
    customerId?: Prisma.IntNullableWithAggregatesFilter<"BcShipment"> | number | null;
    documentDate?: Prisma.DateTimeNullableWithAggregatesFilter<"BcShipment"> | Date | string | null;
    postingDate?: Prisma.DateTimeNullableWithAggregatesFilter<"BcShipment"> | Date | string | null;
    externalDocNo?: Prisma.StringNullableWithAggregatesFilter<"BcShipment"> | string | null;
    locationCode?: Prisma.StringNullableWithAggregatesFilter<"BcShipment"> | string | null;
    tradeId?: Prisma.IntNullableWithAggregatesFilter<"BcShipment"> | number | null;
    zohoInvoiceId?: Prisma.IntNullableWithAggregatesFilter<"BcShipment"> | number | null;
    missingFromImport?: Prisma.BoolWithAggregatesFilter<"BcShipment"> | boolean;
    importBatchId?: Prisma.IntWithAggregatesFilter<"BcShipment"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BcShipment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"BcShipment"> | Date | string;
};
export type BcShipmentCreateInput = {
    no: string;
    customerNo?: string | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutBcShipmentsInput;
    trade?: Prisma.TradeCreateNestedOneWithoutBcShipmentsInput;
    zohoInvoice?: Prisma.ZohoInvoiceCreateNestedOneWithoutBcShipmentsInput;
};
export type BcShipmentUncheckedCreateInput = {
    id?: number;
    no: string;
    customerNo?: string | null;
    customerId?: number | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    tradeId?: number | null;
    zohoInvoiceId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentUpdateInput = {
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutBcShipmentsNestedInput;
    trade?: Prisma.TradeUpdateOneWithoutBcShipmentsNestedInput;
    zohoInvoice?: Prisma.ZohoInvoiceUpdateOneWithoutBcShipmentsNestedInput;
};
export type BcShipmentUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    zohoInvoiceId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentCreateManyInput = {
    id?: number;
    no: string;
    customerNo?: string | null;
    customerId?: number | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    tradeId?: number | null;
    zohoInvoiceId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentUpdateManyMutationInput = {
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    zohoInvoiceId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentListRelationFilter = {
    every?: Prisma.BcShipmentWhereInput;
    some?: Prisma.BcShipmentWhereInput;
    none?: Prisma.BcShipmentWhereInput;
};
export type BcShipmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BcShipmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    documentDate?: Prisma.SortOrder;
    postingDate?: Prisma.SortOrder;
    externalDocNo?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    zohoInvoiceId?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcShipmentAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    zohoInvoiceId?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type BcShipmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    documentDate?: Prisma.SortOrder;
    postingDate?: Prisma.SortOrder;
    externalDocNo?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    zohoInvoiceId?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcShipmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    no?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    documentDate?: Prisma.SortOrder;
    postingDate?: Prisma.SortOrder;
    externalDocNo?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    zohoInvoiceId?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcShipmentSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    zohoInvoiceId?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type BcShipmentCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutTradeInput, Prisma.BcShipmentUncheckedCreateWithoutTradeInput> | Prisma.BcShipmentCreateWithoutTradeInput[] | Prisma.BcShipmentUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutTradeInput | Prisma.BcShipmentCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.BcShipmentCreateManyTradeInputEnvelope;
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
};
export type BcShipmentUncheckedCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutTradeInput, Prisma.BcShipmentUncheckedCreateWithoutTradeInput> | Prisma.BcShipmentCreateWithoutTradeInput[] | Prisma.BcShipmentUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutTradeInput | Prisma.BcShipmentCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.BcShipmentCreateManyTradeInputEnvelope;
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
};
export type BcShipmentUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutTradeInput, Prisma.BcShipmentUncheckedCreateWithoutTradeInput> | Prisma.BcShipmentCreateWithoutTradeInput[] | Prisma.BcShipmentUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutTradeInput | Prisma.BcShipmentCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.BcShipmentUpsertWithWhereUniqueWithoutTradeInput | Prisma.BcShipmentUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.BcShipmentCreateManyTradeInputEnvelope;
    set?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    disconnect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    delete?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    update?: Prisma.BcShipmentUpdateWithWhereUniqueWithoutTradeInput | Prisma.BcShipmentUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.BcShipmentUpdateManyWithWhereWithoutTradeInput | Prisma.BcShipmentUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.BcShipmentScalarWhereInput | Prisma.BcShipmentScalarWhereInput[];
};
export type BcShipmentUncheckedUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutTradeInput, Prisma.BcShipmentUncheckedCreateWithoutTradeInput> | Prisma.BcShipmentCreateWithoutTradeInput[] | Prisma.BcShipmentUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutTradeInput | Prisma.BcShipmentCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.BcShipmentUpsertWithWhereUniqueWithoutTradeInput | Prisma.BcShipmentUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.BcShipmentCreateManyTradeInputEnvelope;
    set?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    disconnect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    delete?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    update?: Prisma.BcShipmentUpdateWithWhereUniqueWithoutTradeInput | Prisma.BcShipmentUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.BcShipmentUpdateManyWithWhereWithoutTradeInput | Prisma.BcShipmentUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.BcShipmentScalarWhereInput | Prisma.BcShipmentScalarWhereInput[];
};
export type BcShipmentCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutCustomerInput, Prisma.BcShipmentUncheckedCreateWithoutCustomerInput> | Prisma.BcShipmentCreateWithoutCustomerInput[] | Prisma.BcShipmentUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutCustomerInput | Prisma.BcShipmentCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.BcShipmentCreateManyCustomerInputEnvelope;
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
};
export type BcShipmentUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutCustomerInput, Prisma.BcShipmentUncheckedCreateWithoutCustomerInput> | Prisma.BcShipmentCreateWithoutCustomerInput[] | Prisma.BcShipmentUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutCustomerInput | Prisma.BcShipmentCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.BcShipmentCreateManyCustomerInputEnvelope;
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
};
export type BcShipmentUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutCustomerInput, Prisma.BcShipmentUncheckedCreateWithoutCustomerInput> | Prisma.BcShipmentCreateWithoutCustomerInput[] | Prisma.BcShipmentUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutCustomerInput | Prisma.BcShipmentCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.BcShipmentUpsertWithWhereUniqueWithoutCustomerInput | Prisma.BcShipmentUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.BcShipmentCreateManyCustomerInputEnvelope;
    set?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    disconnect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    delete?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    update?: Prisma.BcShipmentUpdateWithWhereUniqueWithoutCustomerInput | Prisma.BcShipmentUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.BcShipmentUpdateManyWithWhereWithoutCustomerInput | Prisma.BcShipmentUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.BcShipmentScalarWhereInput | Prisma.BcShipmentScalarWhereInput[];
};
export type BcShipmentUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutCustomerInput, Prisma.BcShipmentUncheckedCreateWithoutCustomerInput> | Prisma.BcShipmentCreateWithoutCustomerInput[] | Prisma.BcShipmentUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutCustomerInput | Prisma.BcShipmentCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.BcShipmentUpsertWithWhereUniqueWithoutCustomerInput | Prisma.BcShipmentUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.BcShipmentCreateManyCustomerInputEnvelope;
    set?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    disconnect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    delete?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    update?: Prisma.BcShipmentUpdateWithWhereUniqueWithoutCustomerInput | Prisma.BcShipmentUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.BcShipmentUpdateManyWithWhereWithoutCustomerInput | Prisma.BcShipmentUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.BcShipmentScalarWhereInput | Prisma.BcShipmentScalarWhereInput[];
};
export type BcShipmentCreateNestedManyWithoutZohoInvoiceInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutZohoInvoiceInput, Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput> | Prisma.BcShipmentCreateWithoutZohoInvoiceInput[] | Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutZohoInvoiceInput | Prisma.BcShipmentCreateOrConnectWithoutZohoInvoiceInput[];
    createMany?: Prisma.BcShipmentCreateManyZohoInvoiceInputEnvelope;
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
};
export type BcShipmentUncheckedCreateNestedManyWithoutZohoInvoiceInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutZohoInvoiceInput, Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput> | Prisma.BcShipmentCreateWithoutZohoInvoiceInput[] | Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutZohoInvoiceInput | Prisma.BcShipmentCreateOrConnectWithoutZohoInvoiceInput[];
    createMany?: Prisma.BcShipmentCreateManyZohoInvoiceInputEnvelope;
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
};
export type BcShipmentUpdateManyWithoutZohoInvoiceNestedInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutZohoInvoiceInput, Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput> | Prisma.BcShipmentCreateWithoutZohoInvoiceInput[] | Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutZohoInvoiceInput | Prisma.BcShipmentCreateOrConnectWithoutZohoInvoiceInput[];
    upsert?: Prisma.BcShipmentUpsertWithWhereUniqueWithoutZohoInvoiceInput | Prisma.BcShipmentUpsertWithWhereUniqueWithoutZohoInvoiceInput[];
    createMany?: Prisma.BcShipmentCreateManyZohoInvoiceInputEnvelope;
    set?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    disconnect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    delete?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    update?: Prisma.BcShipmentUpdateWithWhereUniqueWithoutZohoInvoiceInput | Prisma.BcShipmentUpdateWithWhereUniqueWithoutZohoInvoiceInput[];
    updateMany?: Prisma.BcShipmentUpdateManyWithWhereWithoutZohoInvoiceInput | Prisma.BcShipmentUpdateManyWithWhereWithoutZohoInvoiceInput[];
    deleteMany?: Prisma.BcShipmentScalarWhereInput | Prisma.BcShipmentScalarWhereInput[];
};
export type BcShipmentUncheckedUpdateManyWithoutZohoInvoiceNestedInput = {
    create?: Prisma.XOR<Prisma.BcShipmentCreateWithoutZohoInvoiceInput, Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput> | Prisma.BcShipmentCreateWithoutZohoInvoiceInput[] | Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput[];
    connectOrCreate?: Prisma.BcShipmentCreateOrConnectWithoutZohoInvoiceInput | Prisma.BcShipmentCreateOrConnectWithoutZohoInvoiceInput[];
    upsert?: Prisma.BcShipmentUpsertWithWhereUniqueWithoutZohoInvoiceInput | Prisma.BcShipmentUpsertWithWhereUniqueWithoutZohoInvoiceInput[];
    createMany?: Prisma.BcShipmentCreateManyZohoInvoiceInputEnvelope;
    set?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    disconnect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    delete?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    connect?: Prisma.BcShipmentWhereUniqueInput | Prisma.BcShipmentWhereUniqueInput[];
    update?: Prisma.BcShipmentUpdateWithWhereUniqueWithoutZohoInvoiceInput | Prisma.BcShipmentUpdateWithWhereUniqueWithoutZohoInvoiceInput[];
    updateMany?: Prisma.BcShipmentUpdateManyWithWhereWithoutZohoInvoiceInput | Prisma.BcShipmentUpdateManyWithWhereWithoutZohoInvoiceInput[];
    deleteMany?: Prisma.BcShipmentScalarWhereInput | Prisma.BcShipmentScalarWhereInput[];
};
export type BcShipmentCreateWithoutTradeInput = {
    no: string;
    customerNo?: string | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutBcShipmentsInput;
    zohoInvoice?: Prisma.ZohoInvoiceCreateNestedOneWithoutBcShipmentsInput;
};
export type BcShipmentUncheckedCreateWithoutTradeInput = {
    id?: number;
    no: string;
    customerNo?: string | null;
    customerId?: number | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    zohoInvoiceId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentCreateOrConnectWithoutTradeInput = {
    where: Prisma.BcShipmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcShipmentCreateWithoutTradeInput, Prisma.BcShipmentUncheckedCreateWithoutTradeInput>;
};
export type BcShipmentCreateManyTradeInputEnvelope = {
    data: Prisma.BcShipmentCreateManyTradeInput | Prisma.BcShipmentCreateManyTradeInput[];
    skipDuplicates?: boolean;
};
export type BcShipmentUpsertWithWhereUniqueWithoutTradeInput = {
    where: Prisma.BcShipmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.BcShipmentUpdateWithoutTradeInput, Prisma.BcShipmentUncheckedUpdateWithoutTradeInput>;
    create: Prisma.XOR<Prisma.BcShipmentCreateWithoutTradeInput, Prisma.BcShipmentUncheckedCreateWithoutTradeInput>;
};
export type BcShipmentUpdateWithWhereUniqueWithoutTradeInput = {
    where: Prisma.BcShipmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.BcShipmentUpdateWithoutTradeInput, Prisma.BcShipmentUncheckedUpdateWithoutTradeInput>;
};
export type BcShipmentUpdateManyWithWhereWithoutTradeInput = {
    where: Prisma.BcShipmentScalarWhereInput;
    data: Prisma.XOR<Prisma.BcShipmentUpdateManyMutationInput, Prisma.BcShipmentUncheckedUpdateManyWithoutTradeInput>;
};
export type BcShipmentScalarWhereInput = {
    AND?: Prisma.BcShipmentScalarWhereInput | Prisma.BcShipmentScalarWhereInput[];
    OR?: Prisma.BcShipmentScalarWhereInput[];
    NOT?: Prisma.BcShipmentScalarWhereInput | Prisma.BcShipmentScalarWhereInput[];
    id?: Prisma.IntFilter<"BcShipment"> | number;
    no?: Prisma.StringFilter<"BcShipment"> | string;
    customerNo?: Prisma.StringNullableFilter<"BcShipment"> | string | null;
    customerId?: Prisma.IntNullableFilter<"BcShipment"> | number | null;
    documentDate?: Prisma.DateTimeNullableFilter<"BcShipment"> | Date | string | null;
    postingDate?: Prisma.DateTimeNullableFilter<"BcShipment"> | Date | string | null;
    externalDocNo?: Prisma.StringNullableFilter<"BcShipment"> | string | null;
    locationCode?: Prisma.StringNullableFilter<"BcShipment"> | string | null;
    tradeId?: Prisma.IntNullableFilter<"BcShipment"> | number | null;
    zohoInvoiceId?: Prisma.IntNullableFilter<"BcShipment"> | number | null;
    missingFromImport?: Prisma.BoolFilter<"BcShipment"> | boolean;
    importBatchId?: Prisma.IntFilter<"BcShipment"> | number;
    createdAt?: Prisma.DateTimeFilter<"BcShipment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcShipment"> | Date | string;
};
export type BcShipmentCreateWithoutCustomerInput = {
    no: string;
    customerNo?: string | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    trade?: Prisma.TradeCreateNestedOneWithoutBcShipmentsInput;
    zohoInvoice?: Prisma.ZohoInvoiceCreateNestedOneWithoutBcShipmentsInput;
};
export type BcShipmentUncheckedCreateWithoutCustomerInput = {
    id?: number;
    no: string;
    customerNo?: string | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    tradeId?: number | null;
    zohoInvoiceId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentCreateOrConnectWithoutCustomerInput = {
    where: Prisma.BcShipmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcShipmentCreateWithoutCustomerInput, Prisma.BcShipmentUncheckedCreateWithoutCustomerInput>;
};
export type BcShipmentCreateManyCustomerInputEnvelope = {
    data: Prisma.BcShipmentCreateManyCustomerInput | Prisma.BcShipmentCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type BcShipmentUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.BcShipmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.BcShipmentUpdateWithoutCustomerInput, Prisma.BcShipmentUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.BcShipmentCreateWithoutCustomerInput, Prisma.BcShipmentUncheckedCreateWithoutCustomerInput>;
};
export type BcShipmentUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.BcShipmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.BcShipmentUpdateWithoutCustomerInput, Prisma.BcShipmentUncheckedUpdateWithoutCustomerInput>;
};
export type BcShipmentUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.BcShipmentScalarWhereInput;
    data: Prisma.XOR<Prisma.BcShipmentUpdateManyMutationInput, Prisma.BcShipmentUncheckedUpdateManyWithoutCustomerInput>;
};
export type BcShipmentCreateWithoutZohoInvoiceInput = {
    no: string;
    customerNo?: string | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutBcShipmentsInput;
    trade?: Prisma.TradeCreateNestedOneWithoutBcShipmentsInput;
};
export type BcShipmentUncheckedCreateWithoutZohoInvoiceInput = {
    id?: number;
    no: string;
    customerNo?: string | null;
    customerId?: number | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    tradeId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentCreateOrConnectWithoutZohoInvoiceInput = {
    where: Prisma.BcShipmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcShipmentCreateWithoutZohoInvoiceInput, Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput>;
};
export type BcShipmentCreateManyZohoInvoiceInputEnvelope = {
    data: Prisma.BcShipmentCreateManyZohoInvoiceInput | Prisma.BcShipmentCreateManyZohoInvoiceInput[];
    skipDuplicates?: boolean;
};
export type BcShipmentUpsertWithWhereUniqueWithoutZohoInvoiceInput = {
    where: Prisma.BcShipmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.BcShipmentUpdateWithoutZohoInvoiceInput, Prisma.BcShipmentUncheckedUpdateWithoutZohoInvoiceInput>;
    create: Prisma.XOR<Prisma.BcShipmentCreateWithoutZohoInvoiceInput, Prisma.BcShipmentUncheckedCreateWithoutZohoInvoiceInput>;
};
export type BcShipmentUpdateWithWhereUniqueWithoutZohoInvoiceInput = {
    where: Prisma.BcShipmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.BcShipmentUpdateWithoutZohoInvoiceInput, Prisma.BcShipmentUncheckedUpdateWithoutZohoInvoiceInput>;
};
export type BcShipmentUpdateManyWithWhereWithoutZohoInvoiceInput = {
    where: Prisma.BcShipmentScalarWhereInput;
    data: Prisma.XOR<Prisma.BcShipmentUpdateManyMutationInput, Prisma.BcShipmentUncheckedUpdateManyWithoutZohoInvoiceInput>;
};
export type BcShipmentCreateManyTradeInput = {
    id?: number;
    no: string;
    customerNo?: string | null;
    customerId?: number | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    zohoInvoiceId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentUpdateWithoutTradeInput = {
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutBcShipmentsNestedInput;
    zohoInvoice?: Prisma.ZohoInvoiceUpdateOneWithoutBcShipmentsNestedInput;
};
export type BcShipmentUncheckedUpdateWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    zohoInvoiceId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentUncheckedUpdateManyWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    zohoInvoiceId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentCreateManyCustomerInput = {
    id?: number;
    no: string;
    customerNo?: string | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    tradeId?: number | null;
    zohoInvoiceId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentUpdateWithoutCustomerInput = {
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trade?: Prisma.TradeUpdateOneWithoutBcShipmentsNestedInput;
    zohoInvoice?: Prisma.ZohoInvoiceUpdateOneWithoutBcShipmentsNestedInput;
};
export type BcShipmentUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    zohoInvoiceId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    zohoInvoiceId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentCreateManyZohoInvoiceInput = {
    id?: number;
    no: string;
    customerNo?: string | null;
    customerId?: number | null;
    documentDate?: Date | string | null;
    postingDate?: Date | string | null;
    externalDocNo?: string | null;
    locationCode?: string | null;
    tradeId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentUpdateWithoutZohoInvoiceInput = {
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutBcShipmentsNestedInput;
    trade?: Prisma.TradeUpdateOneWithoutBcShipmentsNestedInput;
};
export type BcShipmentUncheckedUpdateWithoutZohoInvoiceInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentUncheckedUpdateManyWithoutZohoInvoiceInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    no?: Prisma.StringFieldUpdateOperationsInput | string;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    documentDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    postingDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalDocNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    no?: boolean;
    customerNo?: boolean;
    customerId?: boolean;
    documentDate?: boolean;
    postingDate?: boolean;
    externalDocNo?: boolean;
    locationCode?: boolean;
    tradeId?: boolean;
    zohoInvoiceId?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.BcShipment$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.BcShipment$tradeArgs<ExtArgs>;
    zohoInvoice?: boolean | Prisma.BcShipment$zohoInvoiceArgs<ExtArgs>;
}, ExtArgs["result"]["bcShipment"]>;
export type BcShipmentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    no?: boolean;
    customerNo?: boolean;
    customerId?: boolean;
    documentDate?: boolean;
    postingDate?: boolean;
    externalDocNo?: boolean;
    locationCode?: boolean;
    tradeId?: boolean;
    zohoInvoiceId?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.BcShipment$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.BcShipment$tradeArgs<ExtArgs>;
    zohoInvoice?: boolean | Prisma.BcShipment$zohoInvoiceArgs<ExtArgs>;
}, ExtArgs["result"]["bcShipment"]>;
export type BcShipmentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    no?: boolean;
    customerNo?: boolean;
    customerId?: boolean;
    documentDate?: boolean;
    postingDate?: boolean;
    externalDocNo?: boolean;
    locationCode?: boolean;
    tradeId?: boolean;
    zohoInvoiceId?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.BcShipment$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.BcShipment$tradeArgs<ExtArgs>;
    zohoInvoice?: boolean | Prisma.BcShipment$zohoInvoiceArgs<ExtArgs>;
}, ExtArgs["result"]["bcShipment"]>;
export type BcShipmentSelectScalar = {
    id?: boolean;
    no?: boolean;
    customerNo?: boolean;
    customerId?: boolean;
    documentDate?: boolean;
    postingDate?: boolean;
    externalDocNo?: boolean;
    locationCode?: boolean;
    tradeId?: boolean;
    zohoInvoiceId?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BcShipmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "no" | "customerNo" | "customerId" | "documentDate" | "postingDate" | "externalDocNo" | "locationCode" | "tradeId" | "zohoInvoiceId" | "missingFromImport" | "importBatchId" | "createdAt" | "updatedAt", ExtArgs["result"]["bcShipment"]>;
export type BcShipmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.BcShipment$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.BcShipment$tradeArgs<ExtArgs>;
    zohoInvoice?: boolean | Prisma.BcShipment$zohoInvoiceArgs<ExtArgs>;
};
export type BcShipmentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.BcShipment$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.BcShipment$tradeArgs<ExtArgs>;
    zohoInvoice?: boolean | Prisma.BcShipment$zohoInvoiceArgs<ExtArgs>;
};
export type BcShipmentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.BcShipment$customerArgs<ExtArgs>;
    trade?: boolean | Prisma.BcShipment$tradeArgs<ExtArgs>;
    zohoInvoice?: boolean | Prisma.BcShipment$zohoInvoiceArgs<ExtArgs>;
};
export type $BcShipmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BcShipment";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs> | null;
        trade: Prisma.$TradePayload<ExtArgs> | null;
        zohoInvoice: Prisma.$ZohoInvoicePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        no: string;
        customerNo: string | null;
        customerId: number | null;
        documentDate: Date | null;
        postingDate: Date | null;
        externalDocNo: string | null;
        locationCode: string | null;
        tradeId: number | null;
        zohoInvoiceId: number | null;
        missingFromImport: boolean;
        importBatchId: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["bcShipment"]>;
    composites: {};
};
export type BcShipmentGetPayload<S extends boolean | null | undefined | BcShipmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload, S>;
export type BcShipmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BcShipmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BcShipmentCountAggregateInputType | true;
};
export interface BcShipmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BcShipment'];
        meta: {
            name: 'BcShipment';
        };
    };
    findUnique<T extends BcShipmentFindUniqueArgs>(args: Prisma.SelectSubset<T, BcShipmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BcShipmentClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BcShipmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BcShipmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BcShipmentClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BcShipmentFindFirstArgs>(args?: Prisma.SelectSubset<T, BcShipmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__BcShipmentClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BcShipmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BcShipmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BcShipmentClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BcShipmentFindManyArgs>(args?: Prisma.SelectSubset<T, BcShipmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BcShipmentCreateArgs>(args: Prisma.SelectSubset<T, BcShipmentCreateArgs<ExtArgs>>): Prisma.Prisma__BcShipmentClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BcShipmentCreateManyArgs>(args?: Prisma.SelectSubset<T, BcShipmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BcShipmentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BcShipmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BcShipmentDeleteArgs>(args: Prisma.SelectSubset<T, BcShipmentDeleteArgs<ExtArgs>>): Prisma.Prisma__BcShipmentClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BcShipmentUpdateArgs>(args: Prisma.SelectSubset<T, BcShipmentUpdateArgs<ExtArgs>>): Prisma.Prisma__BcShipmentClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BcShipmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, BcShipmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BcShipmentUpdateManyArgs>(args: Prisma.SelectSubset<T, BcShipmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BcShipmentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BcShipmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BcShipmentUpsertArgs>(args: Prisma.SelectSubset<T, BcShipmentUpsertArgs<ExtArgs>>): Prisma.Prisma__BcShipmentClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BcShipmentCountArgs>(args?: Prisma.Subset<T, BcShipmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BcShipmentCountAggregateOutputType> : number>;
    aggregate<T extends BcShipmentAggregateArgs>(args: Prisma.Subset<T, BcShipmentAggregateArgs>): Prisma.PrismaPromise<GetBcShipmentAggregateType<T>>;
    groupBy<T extends BcShipmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BcShipmentGroupByArgs['orderBy'];
    } : {
        orderBy?: BcShipmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BcShipmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBcShipmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BcShipmentFieldRefs;
}
export interface Prisma__BcShipmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.BcShipment$customerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BcShipment$customerArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    trade<T extends Prisma.BcShipment$tradeArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BcShipment$tradeArgs<ExtArgs>>): Prisma.Prisma__TradeClient<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    zohoInvoice<T extends Prisma.BcShipment$zohoInvoiceArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BcShipment$zohoInvoiceArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BcShipmentFieldRefs {
    readonly id: Prisma.FieldRef<"BcShipment", 'Int'>;
    readonly no: Prisma.FieldRef<"BcShipment", 'String'>;
    readonly customerNo: Prisma.FieldRef<"BcShipment", 'String'>;
    readonly customerId: Prisma.FieldRef<"BcShipment", 'Int'>;
    readonly documentDate: Prisma.FieldRef<"BcShipment", 'DateTime'>;
    readonly postingDate: Prisma.FieldRef<"BcShipment", 'DateTime'>;
    readonly externalDocNo: Prisma.FieldRef<"BcShipment", 'String'>;
    readonly locationCode: Prisma.FieldRef<"BcShipment", 'String'>;
    readonly tradeId: Prisma.FieldRef<"BcShipment", 'Int'>;
    readonly zohoInvoiceId: Prisma.FieldRef<"BcShipment", 'Int'>;
    readonly missingFromImport: Prisma.FieldRef<"BcShipment", 'Boolean'>;
    readonly importBatchId: Prisma.FieldRef<"BcShipment", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"BcShipment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"BcShipment", 'DateTime'>;
}
export type BcShipmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
    where: Prisma.BcShipmentWhereUniqueInput;
};
export type BcShipmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
    where: Prisma.BcShipmentWhereUniqueInput;
};
export type BcShipmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
    where?: Prisma.BcShipmentWhereInput;
    orderBy?: Prisma.BcShipmentOrderByWithRelationInput | Prisma.BcShipmentOrderByWithRelationInput[];
    cursor?: Prisma.BcShipmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcShipmentScalarFieldEnum | Prisma.BcShipmentScalarFieldEnum[];
};
export type BcShipmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
    where?: Prisma.BcShipmentWhereInput;
    orderBy?: Prisma.BcShipmentOrderByWithRelationInput | Prisma.BcShipmentOrderByWithRelationInput[];
    cursor?: Prisma.BcShipmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcShipmentScalarFieldEnum | Prisma.BcShipmentScalarFieldEnum[];
};
export type BcShipmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
    where?: Prisma.BcShipmentWhereInput;
    orderBy?: Prisma.BcShipmentOrderByWithRelationInput | Prisma.BcShipmentOrderByWithRelationInput[];
    cursor?: Prisma.BcShipmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcShipmentScalarFieldEnum | Prisma.BcShipmentScalarFieldEnum[];
};
export type BcShipmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcShipmentCreateInput, Prisma.BcShipmentUncheckedCreateInput>;
};
export type BcShipmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BcShipmentCreateManyInput | Prisma.BcShipmentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BcShipmentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    data: Prisma.BcShipmentCreateManyInput | Prisma.BcShipmentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BcShipmentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BcShipmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcShipmentUpdateInput, Prisma.BcShipmentUncheckedUpdateInput>;
    where: Prisma.BcShipmentWhereUniqueInput;
};
export type BcShipmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BcShipmentUpdateManyMutationInput, Prisma.BcShipmentUncheckedUpdateManyInput>;
    where?: Prisma.BcShipmentWhereInput;
    limit?: number;
};
export type BcShipmentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcShipmentUpdateManyMutationInput, Prisma.BcShipmentUncheckedUpdateManyInput>;
    where?: Prisma.BcShipmentWhereInput;
    limit?: number;
    include?: Prisma.BcShipmentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BcShipmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
    where: Prisma.BcShipmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcShipmentCreateInput, Prisma.BcShipmentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BcShipmentUpdateInput, Prisma.BcShipmentUncheckedUpdateInput>;
};
export type BcShipmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
    where: Prisma.BcShipmentWhereUniqueInput;
};
export type BcShipmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcShipmentWhereInput;
    limit?: number;
};
export type BcShipment$customerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
};
export type BcShipment$tradeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TradeSelect<ExtArgs> | null;
    omit?: Prisma.TradeOmit<ExtArgs> | null;
    include?: Prisma.TradeInclude<ExtArgs> | null;
    where?: Prisma.TradeWhereInput;
};
export type BcShipment$zohoInvoiceArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    where?: Prisma.ZohoInvoiceWhereInput;
};
export type BcShipmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentOmit<ExtArgs> | null;
    include?: Prisma.BcShipmentInclude<ExtArgs> | null;
};
//# sourceMappingURL=BcShipment.d.ts.map