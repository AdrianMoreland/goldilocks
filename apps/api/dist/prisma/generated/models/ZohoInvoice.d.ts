import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ZohoInvoiceModel = runtime.Types.Result.DefaultSelection<Prisma.$ZohoInvoicePayload>;
export type AggregateZohoInvoice = {
    _count: ZohoInvoiceCountAggregateOutputType | null;
    _avg: ZohoInvoiceAvgAggregateOutputType | null;
    _sum: ZohoInvoiceSumAggregateOutputType | null;
    _min: ZohoInvoiceMinAggregateOutputType | null;
    _max: ZohoInvoiceMaxAggregateOutputType | null;
};
export type ZohoInvoiceAvgAggregateOutputType = {
    id: number | null;
    customerId: number | null;
    total: runtime.Decimal | null;
    lineCount: number | null;
    importBatchId: number | null;
};
export type ZohoInvoiceSumAggregateOutputType = {
    id: number | null;
    customerId: number | null;
    total: runtime.Decimal | null;
    lineCount: number | null;
    importBatchId: number | null;
};
export type ZohoInvoiceMinAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    date: Date | null;
    customerId: number | null;
    status: string | null;
    salesOrderNumber: string | null;
    total: runtime.Decimal | null;
    lineCount: number | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ZohoInvoiceMaxAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    date: Date | null;
    customerId: number | null;
    status: string | null;
    salesOrderNumber: string | null;
    total: runtime.Decimal | null;
    lineCount: number | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ZohoInvoiceCountAggregateOutputType = {
    id: number;
    sourceKey: number;
    date: number;
    customerId: number;
    status: number;
    salesOrderNumber: number;
    total: number;
    lineCount: number;
    missingFromImport: number;
    importBatchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ZohoInvoiceAvgAggregateInputType = {
    id?: true;
    customerId?: true;
    total?: true;
    lineCount?: true;
    importBatchId?: true;
};
export type ZohoInvoiceSumAggregateInputType = {
    id?: true;
    customerId?: true;
    total?: true;
    lineCount?: true;
    importBatchId?: true;
};
export type ZohoInvoiceMinAggregateInputType = {
    id?: true;
    sourceKey?: true;
    date?: true;
    customerId?: true;
    status?: true;
    salesOrderNumber?: true;
    total?: true;
    lineCount?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ZohoInvoiceMaxAggregateInputType = {
    id?: true;
    sourceKey?: true;
    date?: true;
    customerId?: true;
    status?: true;
    salesOrderNumber?: true;
    total?: true;
    lineCount?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ZohoInvoiceCountAggregateInputType = {
    id?: true;
    sourceKey?: true;
    date?: true;
    customerId?: true;
    status?: true;
    salesOrderNumber?: true;
    total?: true;
    lineCount?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ZohoInvoiceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoInvoiceWhereInput;
    orderBy?: Prisma.ZohoInvoiceOrderByWithRelationInput | Prisma.ZohoInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.ZohoInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ZohoInvoiceCountAggregateInputType;
    _avg?: ZohoInvoiceAvgAggregateInputType;
    _sum?: ZohoInvoiceSumAggregateInputType;
    _min?: ZohoInvoiceMinAggregateInputType;
    _max?: ZohoInvoiceMaxAggregateInputType;
};
export type GetZohoInvoiceAggregateType<T extends ZohoInvoiceAggregateArgs> = {
    [P in keyof T & keyof AggregateZohoInvoice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateZohoInvoice[P]> : Prisma.GetScalarType<T[P], AggregateZohoInvoice[P]>;
};
export type ZohoInvoiceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoInvoiceWhereInput;
    orderBy?: Prisma.ZohoInvoiceOrderByWithAggregationInput | Prisma.ZohoInvoiceOrderByWithAggregationInput[];
    by: Prisma.ZohoInvoiceScalarFieldEnum[] | Prisma.ZohoInvoiceScalarFieldEnum;
    having?: Prisma.ZohoInvoiceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ZohoInvoiceCountAggregateInputType | true;
    _avg?: ZohoInvoiceAvgAggregateInputType;
    _sum?: ZohoInvoiceSumAggregateInputType;
    _min?: ZohoInvoiceMinAggregateInputType;
    _max?: ZohoInvoiceMaxAggregateInputType;
};
export type ZohoInvoiceGroupByOutputType = {
    id: number;
    sourceKey: string;
    date: Date | null;
    customerId: number | null;
    status: string | null;
    salesOrderNumber: string | null;
    total: runtime.Decimal | null;
    lineCount: number | null;
    missingFromImport: boolean;
    importBatchId: number;
    createdAt: Date;
    updatedAt: Date;
    _count: ZohoInvoiceCountAggregateOutputType | null;
    _avg: ZohoInvoiceAvgAggregateOutputType | null;
    _sum: ZohoInvoiceSumAggregateOutputType | null;
    _min: ZohoInvoiceMinAggregateOutputType | null;
    _max: ZohoInvoiceMaxAggregateOutputType | null;
};
export type GetZohoInvoiceGroupByPayload<T extends ZohoInvoiceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ZohoInvoiceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ZohoInvoiceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ZohoInvoiceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ZohoInvoiceGroupByOutputType[P]>;
}>>;
export type ZohoInvoiceWhereInput = {
    AND?: Prisma.ZohoInvoiceWhereInput | Prisma.ZohoInvoiceWhereInput[];
    OR?: Prisma.ZohoInvoiceWhereInput[];
    NOT?: Prisma.ZohoInvoiceWhereInput | Prisma.ZohoInvoiceWhereInput[];
    id?: Prisma.IntFilter<"ZohoInvoice"> | number;
    sourceKey?: Prisma.StringFilter<"ZohoInvoice"> | string;
    date?: Prisma.DateTimeNullableFilter<"ZohoInvoice"> | Date | string | null;
    customerId?: Prisma.IntNullableFilter<"ZohoInvoice"> | number | null;
    status?: Prisma.StringNullableFilter<"ZohoInvoice"> | string | null;
    salesOrderNumber?: Prisma.StringNullableFilter<"ZohoInvoice"> | string | null;
    total?: Prisma.DecimalNullableFilter<"ZohoInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.IntNullableFilter<"ZohoInvoice"> | number | null;
    missingFromImport?: Prisma.BoolFilter<"ZohoInvoice"> | boolean;
    importBatchId?: Prisma.IntFilter<"ZohoInvoice"> | number;
    createdAt?: Prisma.DateTimeFilter<"ZohoInvoice"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ZohoInvoice"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    lines?: Prisma.ZohoInvoiceLineListRelationFilter;
    payments?: Prisma.ZohoPaymentListRelationFilter;
    bcShipments?: Prisma.BcShipmentListRelationFilter;
};
export type ZohoInvoiceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    date?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    salesOrderNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    total?: Prisma.SortOrderInput | Prisma.SortOrder;
    lineCount?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    lines?: Prisma.ZohoInvoiceLineOrderByRelationAggregateInput;
    payments?: Prisma.ZohoPaymentOrderByRelationAggregateInput;
    bcShipments?: Prisma.BcShipmentOrderByRelationAggregateInput;
};
export type ZohoInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    sourceKey?: string;
    AND?: Prisma.ZohoInvoiceWhereInput | Prisma.ZohoInvoiceWhereInput[];
    OR?: Prisma.ZohoInvoiceWhereInput[];
    NOT?: Prisma.ZohoInvoiceWhereInput | Prisma.ZohoInvoiceWhereInput[];
    date?: Prisma.DateTimeNullableFilter<"ZohoInvoice"> | Date | string | null;
    customerId?: Prisma.IntNullableFilter<"ZohoInvoice"> | number | null;
    status?: Prisma.StringNullableFilter<"ZohoInvoice"> | string | null;
    salesOrderNumber?: Prisma.StringNullableFilter<"ZohoInvoice"> | string | null;
    total?: Prisma.DecimalNullableFilter<"ZohoInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.IntNullableFilter<"ZohoInvoice"> | number | null;
    missingFromImport?: Prisma.BoolFilter<"ZohoInvoice"> | boolean;
    importBatchId?: Prisma.IntFilter<"ZohoInvoice"> | number;
    createdAt?: Prisma.DateTimeFilter<"ZohoInvoice"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ZohoInvoice"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    lines?: Prisma.ZohoInvoiceLineListRelationFilter;
    payments?: Prisma.ZohoPaymentListRelationFilter;
    bcShipments?: Prisma.BcShipmentListRelationFilter;
}, "id" | "sourceKey">;
export type ZohoInvoiceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    date?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    salesOrderNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    total?: Prisma.SortOrderInput | Prisma.SortOrder;
    lineCount?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ZohoInvoiceCountOrderByAggregateInput;
    _avg?: Prisma.ZohoInvoiceAvgOrderByAggregateInput;
    _max?: Prisma.ZohoInvoiceMaxOrderByAggregateInput;
    _min?: Prisma.ZohoInvoiceMinOrderByAggregateInput;
    _sum?: Prisma.ZohoInvoiceSumOrderByAggregateInput;
};
export type ZohoInvoiceScalarWhereWithAggregatesInput = {
    AND?: Prisma.ZohoInvoiceScalarWhereWithAggregatesInput | Prisma.ZohoInvoiceScalarWhereWithAggregatesInput[];
    OR?: Prisma.ZohoInvoiceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ZohoInvoiceScalarWhereWithAggregatesInput | Prisma.ZohoInvoiceScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ZohoInvoice"> | number;
    sourceKey?: Prisma.StringWithAggregatesFilter<"ZohoInvoice"> | string;
    date?: Prisma.DateTimeNullableWithAggregatesFilter<"ZohoInvoice"> | Date | string | null;
    customerId?: Prisma.IntNullableWithAggregatesFilter<"ZohoInvoice"> | number | null;
    status?: Prisma.StringNullableWithAggregatesFilter<"ZohoInvoice"> | string | null;
    salesOrderNumber?: Prisma.StringNullableWithAggregatesFilter<"ZohoInvoice"> | string | null;
    total?: Prisma.DecimalNullableWithAggregatesFilter<"ZohoInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.IntNullableWithAggregatesFilter<"ZohoInvoice"> | number | null;
    missingFromImport?: Prisma.BoolWithAggregatesFilter<"ZohoInvoice"> | boolean;
    importBatchId?: Prisma.IntWithAggregatesFilter<"ZohoInvoice"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ZohoInvoice"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ZohoInvoice"> | Date | string;
};
export type ZohoInvoiceCreateInput = {
    sourceKey: string;
    date?: Date | string | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutInvoicesInput;
    lines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutInvoiceInput;
    payments?: Prisma.ZohoPaymentCreateNestedManyWithoutInvoiceInput;
    bcShipments?: Prisma.BcShipmentCreateNestedManyWithoutZohoInvoiceInput;
};
export type ZohoInvoiceUncheckedCreateInput = {
    id?: number;
    sourceKey: string;
    date?: Date | string | null;
    customerId?: number | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    lines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput;
    payments?: Prisma.ZohoPaymentUncheckedCreateNestedManyWithoutInvoiceInput;
    bcShipments?: Prisma.BcShipmentUncheckedCreateNestedManyWithoutZohoInvoiceInput;
};
export type ZohoInvoiceUpdateInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutInvoicesNestedInput;
    lines?: Prisma.ZohoInvoiceLineUpdateManyWithoutInvoiceNestedInput;
    payments?: Prisma.ZohoPaymentUpdateManyWithoutInvoiceNestedInput;
    bcShipments?: Prisma.BcShipmentUpdateManyWithoutZohoInvoiceNestedInput;
};
export type ZohoInvoiceUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput;
    payments?: Prisma.ZohoPaymentUncheckedUpdateManyWithoutInvoiceNestedInput;
    bcShipments?: Prisma.BcShipmentUncheckedUpdateManyWithoutZohoInvoiceNestedInput;
};
export type ZohoInvoiceCreateManyInput = {
    id?: number;
    sourceKey: string;
    date?: Date | string | null;
    customerId?: number | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ZohoInvoiceUpdateManyMutationInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoInvoiceUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoInvoiceListRelationFilter = {
    every?: Prisma.ZohoInvoiceWhereInput;
    some?: Prisma.ZohoInvoiceWhereInput;
    none?: Prisma.ZohoInvoiceWhereInput;
};
export type ZohoInvoiceOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ZohoInvoiceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    salesOrderNumber?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    lineCount?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ZohoInvoiceAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    lineCount?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type ZohoInvoiceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    salesOrderNumber?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    lineCount?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ZohoInvoiceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    salesOrderNumber?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    lineCount?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ZohoInvoiceSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    lineCount?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type ZohoInvoiceScalarRelationFilter = {
    is?: Prisma.ZohoInvoiceWhereInput;
    isNot?: Prisma.ZohoInvoiceWhereInput;
};
export type ZohoInvoiceNullableScalarRelationFilter = {
    is?: Prisma.ZohoInvoiceWhereInput | null;
    isNot?: Prisma.ZohoInvoiceWhereInput | null;
};
export type ZohoInvoiceCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutCustomerInput, Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput> | Prisma.ZohoInvoiceCreateWithoutCustomerInput[] | Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutCustomerInput | Prisma.ZohoInvoiceCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ZohoInvoiceCreateManyCustomerInputEnvelope;
    connect?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
};
export type ZohoInvoiceUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutCustomerInput, Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput> | Prisma.ZohoInvoiceCreateWithoutCustomerInput[] | Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutCustomerInput | Prisma.ZohoInvoiceCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ZohoInvoiceCreateManyCustomerInputEnvelope;
    connect?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
};
export type ZohoInvoiceUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutCustomerInput, Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput> | Prisma.ZohoInvoiceCreateWithoutCustomerInput[] | Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutCustomerInput | Prisma.ZohoInvoiceCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ZohoInvoiceUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ZohoInvoiceUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ZohoInvoiceCreateManyCustomerInputEnvelope;
    set?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
    disconnect?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
    delete?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
    connect?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
    update?: Prisma.ZohoInvoiceUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ZohoInvoiceUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ZohoInvoiceUpdateManyWithWhereWithoutCustomerInput | Prisma.ZohoInvoiceUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ZohoInvoiceScalarWhereInput | Prisma.ZohoInvoiceScalarWhereInput[];
};
export type ZohoInvoiceUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutCustomerInput, Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput> | Prisma.ZohoInvoiceCreateWithoutCustomerInput[] | Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutCustomerInput | Prisma.ZohoInvoiceCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ZohoInvoiceUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ZohoInvoiceUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ZohoInvoiceCreateManyCustomerInputEnvelope;
    set?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
    disconnect?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
    delete?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
    connect?: Prisma.ZohoInvoiceWhereUniqueInput | Prisma.ZohoInvoiceWhereUniqueInput[];
    update?: Prisma.ZohoInvoiceUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ZohoInvoiceUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ZohoInvoiceUpdateManyWithWhereWithoutCustomerInput | Prisma.ZohoInvoiceUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ZohoInvoiceScalarWhereInput | Prisma.ZohoInvoiceScalarWhereInput[];
};
export type ZohoInvoiceCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutLinesInput, Prisma.ZohoInvoiceUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutLinesInput;
    connect?: Prisma.ZohoInvoiceWhereUniqueInput;
};
export type ZohoInvoiceUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutLinesInput, Prisma.ZohoInvoiceUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.ZohoInvoiceUpsertWithoutLinesInput;
    connect?: Prisma.ZohoInvoiceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ZohoInvoiceUpdateToOneWithWhereWithoutLinesInput, Prisma.ZohoInvoiceUpdateWithoutLinesInput>, Prisma.ZohoInvoiceUncheckedUpdateWithoutLinesInput>;
};
export type ZohoInvoiceCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutPaymentsInput, Prisma.ZohoInvoiceUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.ZohoInvoiceWhereUniqueInput;
};
export type ZohoInvoiceUpdateOneWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutPaymentsInput, Prisma.ZohoInvoiceUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.ZohoInvoiceUpsertWithoutPaymentsInput;
    disconnect?: Prisma.ZohoInvoiceWhereInput | boolean;
    delete?: Prisma.ZohoInvoiceWhereInput | boolean;
    connect?: Prisma.ZohoInvoiceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ZohoInvoiceUpdateToOneWithWhereWithoutPaymentsInput, Prisma.ZohoInvoiceUpdateWithoutPaymentsInput>, Prisma.ZohoInvoiceUncheckedUpdateWithoutPaymentsInput>;
};
export type ZohoInvoiceCreateNestedOneWithoutBcShipmentsInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutBcShipmentsInput, Prisma.ZohoInvoiceUncheckedCreateWithoutBcShipmentsInput>;
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutBcShipmentsInput;
    connect?: Prisma.ZohoInvoiceWhereUniqueInput;
};
export type ZohoInvoiceUpdateOneWithoutBcShipmentsNestedInput = {
    create?: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutBcShipmentsInput, Prisma.ZohoInvoiceUncheckedCreateWithoutBcShipmentsInput>;
    connectOrCreate?: Prisma.ZohoInvoiceCreateOrConnectWithoutBcShipmentsInput;
    upsert?: Prisma.ZohoInvoiceUpsertWithoutBcShipmentsInput;
    disconnect?: Prisma.ZohoInvoiceWhereInput | boolean;
    delete?: Prisma.ZohoInvoiceWhereInput | boolean;
    connect?: Prisma.ZohoInvoiceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ZohoInvoiceUpdateToOneWithWhereWithoutBcShipmentsInput, Prisma.ZohoInvoiceUpdateWithoutBcShipmentsInput>, Prisma.ZohoInvoiceUncheckedUpdateWithoutBcShipmentsInput>;
};
export type ZohoInvoiceCreateWithoutCustomerInput = {
    sourceKey: string;
    date?: Date | string | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    lines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutInvoiceInput;
    payments?: Prisma.ZohoPaymentCreateNestedManyWithoutInvoiceInput;
    bcShipments?: Prisma.BcShipmentCreateNestedManyWithoutZohoInvoiceInput;
};
export type ZohoInvoiceUncheckedCreateWithoutCustomerInput = {
    id?: number;
    sourceKey: string;
    date?: Date | string | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    lines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput;
    payments?: Prisma.ZohoPaymentUncheckedCreateNestedManyWithoutInvoiceInput;
    bcShipments?: Prisma.BcShipmentUncheckedCreateNestedManyWithoutZohoInvoiceInput;
};
export type ZohoInvoiceCreateOrConnectWithoutCustomerInput = {
    where: Prisma.ZohoInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutCustomerInput, Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput>;
};
export type ZohoInvoiceCreateManyCustomerInputEnvelope = {
    data: Prisma.ZohoInvoiceCreateManyCustomerInput | Prisma.ZohoInvoiceCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type ZohoInvoiceUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ZohoInvoiceWhereUniqueInput;
    update: Prisma.XOR<Prisma.ZohoInvoiceUpdateWithoutCustomerInput, Prisma.ZohoInvoiceUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutCustomerInput, Prisma.ZohoInvoiceUncheckedCreateWithoutCustomerInput>;
};
export type ZohoInvoiceUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ZohoInvoiceWhereUniqueInput;
    data: Prisma.XOR<Prisma.ZohoInvoiceUpdateWithoutCustomerInput, Prisma.ZohoInvoiceUncheckedUpdateWithoutCustomerInput>;
};
export type ZohoInvoiceUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.ZohoInvoiceScalarWhereInput;
    data: Prisma.XOR<Prisma.ZohoInvoiceUpdateManyMutationInput, Prisma.ZohoInvoiceUncheckedUpdateManyWithoutCustomerInput>;
};
export type ZohoInvoiceScalarWhereInput = {
    AND?: Prisma.ZohoInvoiceScalarWhereInput | Prisma.ZohoInvoiceScalarWhereInput[];
    OR?: Prisma.ZohoInvoiceScalarWhereInput[];
    NOT?: Prisma.ZohoInvoiceScalarWhereInput | Prisma.ZohoInvoiceScalarWhereInput[];
    id?: Prisma.IntFilter<"ZohoInvoice"> | number;
    sourceKey?: Prisma.StringFilter<"ZohoInvoice"> | string;
    date?: Prisma.DateTimeNullableFilter<"ZohoInvoice"> | Date | string | null;
    customerId?: Prisma.IntNullableFilter<"ZohoInvoice"> | number | null;
    status?: Prisma.StringNullableFilter<"ZohoInvoice"> | string | null;
    salesOrderNumber?: Prisma.StringNullableFilter<"ZohoInvoice"> | string | null;
    total?: Prisma.DecimalNullableFilter<"ZohoInvoice"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.IntNullableFilter<"ZohoInvoice"> | number | null;
    missingFromImport?: Prisma.BoolFilter<"ZohoInvoice"> | boolean;
    importBatchId?: Prisma.IntFilter<"ZohoInvoice"> | number;
    createdAt?: Prisma.DateTimeFilter<"ZohoInvoice"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ZohoInvoice"> | Date | string;
};
export type ZohoInvoiceCreateWithoutLinesInput = {
    sourceKey: string;
    date?: Date | string | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutInvoicesInput;
    payments?: Prisma.ZohoPaymentCreateNestedManyWithoutInvoiceInput;
    bcShipments?: Prisma.BcShipmentCreateNestedManyWithoutZohoInvoiceInput;
};
export type ZohoInvoiceUncheckedCreateWithoutLinesInput = {
    id?: number;
    sourceKey: string;
    date?: Date | string | null;
    customerId?: number | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: Prisma.ZohoPaymentUncheckedCreateNestedManyWithoutInvoiceInput;
    bcShipments?: Prisma.BcShipmentUncheckedCreateNestedManyWithoutZohoInvoiceInput;
};
export type ZohoInvoiceCreateOrConnectWithoutLinesInput = {
    where: Prisma.ZohoInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutLinesInput, Prisma.ZohoInvoiceUncheckedCreateWithoutLinesInput>;
};
export type ZohoInvoiceUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.ZohoInvoiceUpdateWithoutLinesInput, Prisma.ZohoInvoiceUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutLinesInput, Prisma.ZohoInvoiceUncheckedCreateWithoutLinesInput>;
    where?: Prisma.ZohoInvoiceWhereInput;
};
export type ZohoInvoiceUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.ZohoInvoiceWhereInput;
    data: Prisma.XOR<Prisma.ZohoInvoiceUpdateWithoutLinesInput, Prisma.ZohoInvoiceUncheckedUpdateWithoutLinesInput>;
};
export type ZohoInvoiceUpdateWithoutLinesInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutInvoicesNestedInput;
    payments?: Prisma.ZohoPaymentUpdateManyWithoutInvoiceNestedInput;
    bcShipments?: Prisma.BcShipmentUpdateManyWithoutZohoInvoiceNestedInput;
};
export type ZohoInvoiceUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: Prisma.ZohoPaymentUncheckedUpdateManyWithoutInvoiceNestedInput;
    bcShipments?: Prisma.BcShipmentUncheckedUpdateManyWithoutZohoInvoiceNestedInput;
};
export type ZohoInvoiceCreateWithoutPaymentsInput = {
    sourceKey: string;
    date?: Date | string | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutInvoicesInput;
    lines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutInvoiceInput;
    bcShipments?: Prisma.BcShipmentCreateNestedManyWithoutZohoInvoiceInput;
};
export type ZohoInvoiceUncheckedCreateWithoutPaymentsInput = {
    id?: number;
    sourceKey: string;
    date?: Date | string | null;
    customerId?: number | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    lines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput;
    bcShipments?: Prisma.BcShipmentUncheckedCreateNestedManyWithoutZohoInvoiceInput;
};
export type ZohoInvoiceCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.ZohoInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutPaymentsInput, Prisma.ZohoInvoiceUncheckedCreateWithoutPaymentsInput>;
};
export type ZohoInvoiceUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.ZohoInvoiceUpdateWithoutPaymentsInput, Prisma.ZohoInvoiceUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutPaymentsInput, Prisma.ZohoInvoiceUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.ZohoInvoiceWhereInput;
};
export type ZohoInvoiceUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.ZohoInvoiceWhereInput;
    data: Prisma.XOR<Prisma.ZohoInvoiceUpdateWithoutPaymentsInput, Prisma.ZohoInvoiceUncheckedUpdateWithoutPaymentsInput>;
};
export type ZohoInvoiceUpdateWithoutPaymentsInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutInvoicesNestedInput;
    lines?: Prisma.ZohoInvoiceLineUpdateManyWithoutInvoiceNestedInput;
    bcShipments?: Prisma.BcShipmentUpdateManyWithoutZohoInvoiceNestedInput;
};
export type ZohoInvoiceUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput;
    bcShipments?: Prisma.BcShipmentUncheckedUpdateManyWithoutZohoInvoiceNestedInput;
};
export type ZohoInvoiceCreateWithoutBcShipmentsInput = {
    sourceKey: string;
    date?: Date | string | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutInvoicesInput;
    lines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutInvoiceInput;
    payments?: Prisma.ZohoPaymentCreateNestedManyWithoutInvoiceInput;
};
export type ZohoInvoiceUncheckedCreateWithoutBcShipmentsInput = {
    id?: number;
    sourceKey: string;
    date?: Date | string | null;
    customerId?: number | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    lines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput;
    payments?: Prisma.ZohoPaymentUncheckedCreateNestedManyWithoutInvoiceInput;
};
export type ZohoInvoiceCreateOrConnectWithoutBcShipmentsInput = {
    where: Prisma.ZohoInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutBcShipmentsInput, Prisma.ZohoInvoiceUncheckedCreateWithoutBcShipmentsInput>;
};
export type ZohoInvoiceUpsertWithoutBcShipmentsInput = {
    update: Prisma.XOR<Prisma.ZohoInvoiceUpdateWithoutBcShipmentsInput, Prisma.ZohoInvoiceUncheckedUpdateWithoutBcShipmentsInput>;
    create: Prisma.XOR<Prisma.ZohoInvoiceCreateWithoutBcShipmentsInput, Prisma.ZohoInvoiceUncheckedCreateWithoutBcShipmentsInput>;
    where?: Prisma.ZohoInvoiceWhereInput;
};
export type ZohoInvoiceUpdateToOneWithWhereWithoutBcShipmentsInput = {
    where?: Prisma.ZohoInvoiceWhereInput;
    data: Prisma.XOR<Prisma.ZohoInvoiceUpdateWithoutBcShipmentsInput, Prisma.ZohoInvoiceUncheckedUpdateWithoutBcShipmentsInput>;
};
export type ZohoInvoiceUpdateWithoutBcShipmentsInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutInvoicesNestedInput;
    lines?: Prisma.ZohoInvoiceLineUpdateManyWithoutInvoiceNestedInput;
    payments?: Prisma.ZohoPaymentUpdateManyWithoutInvoiceNestedInput;
};
export type ZohoInvoiceUncheckedUpdateWithoutBcShipmentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    customerId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput;
    payments?: Prisma.ZohoPaymentUncheckedUpdateManyWithoutInvoiceNestedInput;
};
export type ZohoInvoiceCreateManyCustomerInput = {
    id?: number;
    sourceKey: string;
    date?: Date | string | null;
    status?: string | null;
    salesOrderNumber?: string | null;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ZohoInvoiceUpdateWithoutCustomerInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.ZohoInvoiceLineUpdateManyWithoutInvoiceNestedInput;
    payments?: Prisma.ZohoPaymentUpdateManyWithoutInvoiceNestedInput;
    bcShipments?: Prisma.BcShipmentUpdateManyWithoutZohoInvoiceNestedInput;
};
export type ZohoInvoiceUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput;
    payments?: Prisma.ZohoPaymentUncheckedUpdateManyWithoutInvoiceNestedInput;
    bcShipments?: Prisma.BcShipmentUncheckedUpdateManyWithoutZohoInvoiceNestedInput;
};
export type ZohoInvoiceUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    salesOrderNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    lineCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoInvoiceCountOutputType = {
    lines: number;
    payments: number;
    bcShipments: number;
};
export type ZohoInvoiceCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | ZohoInvoiceCountOutputTypeCountLinesArgs;
    payments?: boolean | ZohoInvoiceCountOutputTypeCountPaymentsArgs;
    bcShipments?: boolean | ZohoInvoiceCountOutputTypeCountBcShipmentsArgs;
};
export type ZohoInvoiceCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceCountOutputTypeSelect<ExtArgs> | null;
};
export type ZohoInvoiceCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoInvoiceLineWhereInput;
};
export type ZohoInvoiceCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoPaymentWhereInput;
};
export type ZohoInvoiceCountOutputTypeCountBcShipmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcShipmentWhereInput;
};
export type ZohoInvoiceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    date?: boolean;
    customerId?: boolean;
    status?: boolean;
    salesOrderNumber?: boolean;
    total?: boolean;
    lineCount?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.ZohoInvoice$customerArgs<ExtArgs>;
    lines?: boolean | Prisma.ZohoInvoice$linesArgs<ExtArgs>;
    payments?: boolean | Prisma.ZohoInvoice$paymentsArgs<ExtArgs>;
    bcShipments?: boolean | Prisma.ZohoInvoice$bcShipmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.ZohoInvoiceCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["zohoInvoice"]>;
export type ZohoInvoiceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    date?: boolean;
    customerId?: boolean;
    status?: boolean;
    salesOrderNumber?: boolean;
    total?: boolean;
    lineCount?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.ZohoInvoice$customerArgs<ExtArgs>;
}, ExtArgs["result"]["zohoInvoice"]>;
export type ZohoInvoiceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    date?: boolean;
    customerId?: boolean;
    status?: boolean;
    salesOrderNumber?: boolean;
    total?: boolean;
    lineCount?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.ZohoInvoice$customerArgs<ExtArgs>;
}, ExtArgs["result"]["zohoInvoice"]>;
export type ZohoInvoiceSelectScalar = {
    id?: boolean;
    sourceKey?: boolean;
    date?: boolean;
    customerId?: boolean;
    status?: boolean;
    salesOrderNumber?: boolean;
    total?: boolean;
    lineCount?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ZohoInvoiceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sourceKey" | "date" | "customerId" | "status" | "salesOrderNumber" | "total" | "lineCount" | "missingFromImport" | "importBatchId" | "createdAt" | "updatedAt", ExtArgs["result"]["zohoInvoice"]>;
export type ZohoInvoiceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.ZohoInvoice$customerArgs<ExtArgs>;
    lines?: boolean | Prisma.ZohoInvoice$linesArgs<ExtArgs>;
    payments?: boolean | Prisma.ZohoInvoice$paymentsArgs<ExtArgs>;
    bcShipments?: boolean | Prisma.ZohoInvoice$bcShipmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.ZohoInvoiceCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ZohoInvoiceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.ZohoInvoice$customerArgs<ExtArgs>;
};
export type ZohoInvoiceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.ZohoInvoice$customerArgs<ExtArgs>;
};
export type $ZohoInvoicePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ZohoInvoice";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs> | null;
        lines: Prisma.$ZohoInvoiceLinePayload<ExtArgs>[];
        payments: Prisma.$ZohoPaymentPayload<ExtArgs>[];
        bcShipments: Prisma.$BcShipmentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        sourceKey: string;
        date: Date | null;
        customerId: number | null;
        status: string | null;
        salesOrderNumber: string | null;
        total: runtime.Decimal | null;
        lineCount: number | null;
        missingFromImport: boolean;
        importBatchId: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["zohoInvoice"]>;
    composites: {};
};
export type ZohoInvoiceGetPayload<S extends boolean | null | undefined | ZohoInvoiceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload, S>;
export type ZohoInvoiceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ZohoInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ZohoInvoiceCountAggregateInputType | true;
};
export interface ZohoInvoiceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ZohoInvoice'];
        meta: {
            name: 'ZohoInvoice';
        };
    };
    findUnique<T extends ZohoInvoiceFindUniqueArgs>(args: Prisma.SelectSubset<T, ZohoInvoiceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ZohoInvoiceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ZohoInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ZohoInvoiceFindFirstArgs>(args?: Prisma.SelectSubset<T, ZohoInvoiceFindFirstArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ZohoInvoiceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ZohoInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ZohoInvoiceFindManyArgs>(args?: Prisma.SelectSubset<T, ZohoInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ZohoInvoiceCreateArgs>(args: Prisma.SelectSubset<T, ZohoInvoiceCreateArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ZohoInvoiceCreateManyArgs>(args?: Prisma.SelectSubset<T, ZohoInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ZohoInvoiceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ZohoInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ZohoInvoiceDeleteArgs>(args: Prisma.SelectSubset<T, ZohoInvoiceDeleteArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ZohoInvoiceUpdateArgs>(args: Prisma.SelectSubset<T, ZohoInvoiceUpdateArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ZohoInvoiceDeleteManyArgs>(args?: Prisma.SelectSubset<T, ZohoInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ZohoInvoiceUpdateManyArgs>(args: Prisma.SelectSubset<T, ZohoInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ZohoInvoiceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ZohoInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ZohoInvoiceUpsertArgs>(args: Prisma.SelectSubset<T, ZohoInvoiceUpsertArgs<ExtArgs>>): Prisma.Prisma__ZohoInvoiceClient<runtime.Types.Result.GetResult<Prisma.$ZohoInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ZohoInvoiceCountArgs>(args?: Prisma.Subset<T, ZohoInvoiceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ZohoInvoiceCountAggregateOutputType> : number>;
    aggregate<T extends ZohoInvoiceAggregateArgs>(args: Prisma.Subset<T, ZohoInvoiceAggregateArgs>): Prisma.PrismaPromise<GetZohoInvoiceAggregateType<T>>;
    groupBy<T extends ZohoInvoiceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ZohoInvoiceGroupByArgs['orderBy'];
    } : {
        orderBy?: ZohoInvoiceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ZohoInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetZohoInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ZohoInvoiceFieldRefs;
}
export interface Prisma__ZohoInvoiceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.ZohoInvoice$customerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ZohoInvoice$customerArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    lines<T extends Prisma.ZohoInvoice$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ZohoInvoice$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoInvoiceLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    payments<T extends Prisma.ZohoInvoice$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ZohoInvoice$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    bcShipments<T extends Prisma.ZohoInvoice$bcShipmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ZohoInvoice$bcShipmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcShipmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ZohoInvoiceFieldRefs {
    readonly id: Prisma.FieldRef<"ZohoInvoice", 'Int'>;
    readonly sourceKey: Prisma.FieldRef<"ZohoInvoice", 'String'>;
    readonly date: Prisma.FieldRef<"ZohoInvoice", 'DateTime'>;
    readonly customerId: Prisma.FieldRef<"ZohoInvoice", 'Int'>;
    readonly status: Prisma.FieldRef<"ZohoInvoice", 'String'>;
    readonly salesOrderNumber: Prisma.FieldRef<"ZohoInvoice", 'String'>;
    readonly total: Prisma.FieldRef<"ZohoInvoice", 'Decimal'>;
    readonly lineCount: Prisma.FieldRef<"ZohoInvoice", 'Int'>;
    readonly missingFromImport: Prisma.FieldRef<"ZohoInvoice", 'Boolean'>;
    readonly importBatchId: Prisma.FieldRef<"ZohoInvoice", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"ZohoInvoice", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ZohoInvoice", 'DateTime'>;
}
export type ZohoInvoiceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    where: Prisma.ZohoInvoiceWhereUniqueInput;
};
export type ZohoInvoiceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    where: Prisma.ZohoInvoiceWhereUniqueInput;
};
export type ZohoInvoiceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    where?: Prisma.ZohoInvoiceWhereInput;
    orderBy?: Prisma.ZohoInvoiceOrderByWithRelationInput | Prisma.ZohoInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.ZohoInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoInvoiceScalarFieldEnum | Prisma.ZohoInvoiceScalarFieldEnum[];
};
export type ZohoInvoiceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    where?: Prisma.ZohoInvoiceWhereInput;
    orderBy?: Prisma.ZohoInvoiceOrderByWithRelationInput | Prisma.ZohoInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.ZohoInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoInvoiceScalarFieldEnum | Prisma.ZohoInvoiceScalarFieldEnum[];
};
export type ZohoInvoiceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    where?: Prisma.ZohoInvoiceWhereInput;
    orderBy?: Prisma.ZohoInvoiceOrderByWithRelationInput | Prisma.ZohoInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.ZohoInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoInvoiceScalarFieldEnum | Prisma.ZohoInvoiceScalarFieldEnum[];
};
export type ZohoInvoiceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ZohoInvoiceCreateInput, Prisma.ZohoInvoiceUncheckedCreateInput>;
};
export type ZohoInvoiceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ZohoInvoiceCreateManyInput | Prisma.ZohoInvoiceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ZohoInvoiceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    data: Prisma.ZohoInvoiceCreateManyInput | Prisma.ZohoInvoiceCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ZohoInvoiceIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ZohoInvoiceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ZohoInvoiceUpdateInput, Prisma.ZohoInvoiceUncheckedUpdateInput>;
    where: Prisma.ZohoInvoiceWhereUniqueInput;
};
export type ZohoInvoiceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ZohoInvoiceUpdateManyMutationInput, Prisma.ZohoInvoiceUncheckedUpdateManyInput>;
    where?: Prisma.ZohoInvoiceWhereInput;
    limit?: number;
};
export type ZohoInvoiceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ZohoInvoiceUpdateManyMutationInput, Prisma.ZohoInvoiceUncheckedUpdateManyInput>;
    where?: Prisma.ZohoInvoiceWhereInput;
    limit?: number;
    include?: Prisma.ZohoInvoiceIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ZohoInvoiceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    where: Prisma.ZohoInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.ZohoInvoiceCreateInput, Prisma.ZohoInvoiceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ZohoInvoiceUpdateInput, Prisma.ZohoInvoiceUncheckedUpdateInput>;
};
export type ZohoInvoiceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
    where: Prisma.ZohoInvoiceWhereUniqueInput;
};
export type ZohoInvoiceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoInvoiceWhereInput;
    limit?: number;
};
export type ZohoInvoice$customerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
};
export type ZohoInvoice$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceLineInclude<ExtArgs> | null;
    where?: Prisma.ZohoInvoiceLineWhereInput;
    orderBy?: Prisma.ZohoInvoiceLineOrderByWithRelationInput | Prisma.ZohoInvoiceLineOrderByWithRelationInput[];
    cursor?: Prisma.ZohoInvoiceLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoInvoiceLineScalarFieldEnum | Prisma.ZohoInvoiceLineScalarFieldEnum[];
};
export type ZohoInvoice$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ZohoPaymentOmit<ExtArgs> | null;
    include?: Prisma.ZohoPaymentInclude<ExtArgs> | null;
    where?: Prisma.ZohoPaymentWhereInput;
    orderBy?: Prisma.ZohoPaymentOrderByWithRelationInput | Prisma.ZohoPaymentOrderByWithRelationInput[];
    cursor?: Prisma.ZohoPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoPaymentScalarFieldEnum | Prisma.ZohoPaymentScalarFieldEnum[];
};
export type ZohoInvoice$bcShipmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ZohoInvoiceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceInclude<ExtArgs> | null;
};
//# sourceMappingURL=ZohoInvoice.d.ts.map