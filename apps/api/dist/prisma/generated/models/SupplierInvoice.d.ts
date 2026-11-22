import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SupplierInvoiceModel = runtime.Types.Result.DefaultSelection<Prisma.$SupplierInvoicePayload>;
export type AggregateSupplierInvoice = {
    _count: SupplierInvoiceCountAggregateOutputType | null;
    _avg: SupplierInvoiceAvgAggregateOutputType | null;
    _sum: SupplierInvoiceSumAggregateOutputType | null;
    _min: SupplierInvoiceMinAggregateOutputType | null;
    _max: SupplierInvoiceMaxAggregateOutputType | null;
};
export type SupplierInvoiceAvgAggregateOutputType = {
    id: number | null;
    importBatchId: number | null;
};
export type SupplierInvoiceSumAggregateOutputType = {
    id: number | null;
    importBatchId: number | null;
};
export type SupplierInvoiceMinAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    supplier: string | null;
    number: string | null;
    firstDate: Date | null;
    lastDate: Date | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SupplierInvoiceMaxAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    supplier: string | null;
    number: string | null;
    firstDate: Date | null;
    lastDate: Date | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SupplierInvoiceCountAggregateOutputType = {
    id: number;
    sourceKey: number;
    supplier: number;
    number: number;
    firstDate: number;
    lastDate: number;
    missingFromImport: number;
    importBatchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SupplierInvoiceAvgAggregateInputType = {
    id?: true;
    importBatchId?: true;
};
export type SupplierInvoiceSumAggregateInputType = {
    id?: true;
    importBatchId?: true;
};
export type SupplierInvoiceMinAggregateInputType = {
    id?: true;
    sourceKey?: true;
    supplier?: true;
    number?: true;
    firstDate?: true;
    lastDate?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SupplierInvoiceMaxAggregateInputType = {
    id?: true;
    sourceKey?: true;
    supplier?: true;
    number?: true;
    firstDate?: true;
    lastDate?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SupplierInvoiceCountAggregateInputType = {
    id?: true;
    sourceKey?: true;
    supplier?: true;
    number?: true;
    firstDate?: true;
    lastDate?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SupplierInvoiceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierInvoiceWhereInput;
    orderBy?: Prisma.SupplierInvoiceOrderByWithRelationInput | Prisma.SupplierInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.SupplierInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SupplierInvoiceCountAggregateInputType;
    _avg?: SupplierInvoiceAvgAggregateInputType;
    _sum?: SupplierInvoiceSumAggregateInputType;
    _min?: SupplierInvoiceMinAggregateInputType;
    _max?: SupplierInvoiceMaxAggregateInputType;
};
export type GetSupplierInvoiceAggregateType<T extends SupplierInvoiceAggregateArgs> = {
    [P in keyof T & keyof AggregateSupplierInvoice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSupplierInvoice[P]> : Prisma.GetScalarType<T[P], AggregateSupplierInvoice[P]>;
};
export type SupplierInvoiceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierInvoiceWhereInput;
    orderBy?: Prisma.SupplierInvoiceOrderByWithAggregationInput | Prisma.SupplierInvoiceOrderByWithAggregationInput[];
    by: Prisma.SupplierInvoiceScalarFieldEnum[] | Prisma.SupplierInvoiceScalarFieldEnum;
    having?: Prisma.SupplierInvoiceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SupplierInvoiceCountAggregateInputType | true;
    _avg?: SupplierInvoiceAvgAggregateInputType;
    _sum?: SupplierInvoiceSumAggregateInputType;
    _min?: SupplierInvoiceMinAggregateInputType;
    _max?: SupplierInvoiceMaxAggregateInputType;
};
export type SupplierInvoiceGroupByOutputType = {
    id: number;
    sourceKey: string;
    supplier: string;
    number: string;
    firstDate: Date | null;
    lastDate: Date | null;
    missingFromImport: boolean;
    importBatchId: number;
    createdAt: Date;
    updatedAt: Date;
    _count: SupplierInvoiceCountAggregateOutputType | null;
    _avg: SupplierInvoiceAvgAggregateOutputType | null;
    _sum: SupplierInvoiceSumAggregateOutputType | null;
    _min: SupplierInvoiceMinAggregateOutputType | null;
    _max: SupplierInvoiceMaxAggregateOutputType | null;
};
export type GetSupplierInvoiceGroupByPayload<T extends SupplierInvoiceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SupplierInvoiceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SupplierInvoiceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SupplierInvoiceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SupplierInvoiceGroupByOutputType[P]>;
}>>;
export type SupplierInvoiceWhereInput = {
    AND?: Prisma.SupplierInvoiceWhereInput | Prisma.SupplierInvoiceWhereInput[];
    OR?: Prisma.SupplierInvoiceWhereInput[];
    NOT?: Prisma.SupplierInvoiceWhereInput | Prisma.SupplierInvoiceWhereInput[];
    id?: Prisma.IntFilter<"SupplierInvoice"> | number;
    sourceKey?: Prisma.StringFilter<"SupplierInvoice"> | string;
    supplier?: Prisma.StringFilter<"SupplierInvoice"> | string;
    number?: Prisma.StringFilter<"SupplierInvoice"> | string;
    firstDate?: Prisma.DateTimeNullableFilter<"SupplierInvoice"> | Date | string | null;
    lastDate?: Prisma.DateTimeNullableFilter<"SupplierInvoice"> | Date | string | null;
    missingFromImport?: Prisma.BoolFilter<"SupplierInvoice"> | boolean;
    importBatchId?: Prisma.IntFilter<"SupplierInvoice"> | number;
    createdAt?: Prisma.DateTimeFilter<"SupplierInvoice"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"SupplierInvoice"> | Date | string;
    trades?: Prisma.TradeListRelationFilter;
    lots?: Prisma.PurchaseLotListRelationFilter;
};
export type SupplierInvoiceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    supplier?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    firstDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    trades?: Prisma.TradeOrderByRelationAggregateInput;
    lots?: Prisma.PurchaseLotOrderByRelationAggregateInput;
};
export type SupplierInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    sourceKey?: string;
    supplier_number?: Prisma.SupplierInvoiceSupplierNumberCompoundUniqueInput;
    AND?: Prisma.SupplierInvoiceWhereInput | Prisma.SupplierInvoiceWhereInput[];
    OR?: Prisma.SupplierInvoiceWhereInput[];
    NOT?: Prisma.SupplierInvoiceWhereInput | Prisma.SupplierInvoiceWhereInput[];
    supplier?: Prisma.StringFilter<"SupplierInvoice"> | string;
    number?: Prisma.StringFilter<"SupplierInvoice"> | string;
    firstDate?: Prisma.DateTimeNullableFilter<"SupplierInvoice"> | Date | string | null;
    lastDate?: Prisma.DateTimeNullableFilter<"SupplierInvoice"> | Date | string | null;
    missingFromImport?: Prisma.BoolFilter<"SupplierInvoice"> | boolean;
    importBatchId?: Prisma.IntFilter<"SupplierInvoice"> | number;
    createdAt?: Prisma.DateTimeFilter<"SupplierInvoice"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"SupplierInvoice"> | Date | string;
    trades?: Prisma.TradeListRelationFilter;
    lots?: Prisma.PurchaseLotListRelationFilter;
}, "id" | "sourceKey" | "supplier_number">;
export type SupplierInvoiceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    supplier?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    firstDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SupplierInvoiceCountOrderByAggregateInput;
    _avg?: Prisma.SupplierInvoiceAvgOrderByAggregateInput;
    _max?: Prisma.SupplierInvoiceMaxOrderByAggregateInput;
    _min?: Prisma.SupplierInvoiceMinOrderByAggregateInput;
    _sum?: Prisma.SupplierInvoiceSumOrderByAggregateInput;
};
export type SupplierInvoiceScalarWhereWithAggregatesInput = {
    AND?: Prisma.SupplierInvoiceScalarWhereWithAggregatesInput | Prisma.SupplierInvoiceScalarWhereWithAggregatesInput[];
    OR?: Prisma.SupplierInvoiceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SupplierInvoiceScalarWhereWithAggregatesInput | Prisma.SupplierInvoiceScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"SupplierInvoice"> | number;
    sourceKey?: Prisma.StringWithAggregatesFilter<"SupplierInvoice"> | string;
    supplier?: Prisma.StringWithAggregatesFilter<"SupplierInvoice"> | string;
    number?: Prisma.StringWithAggregatesFilter<"SupplierInvoice"> | string;
    firstDate?: Prisma.DateTimeNullableWithAggregatesFilter<"SupplierInvoice"> | Date | string | null;
    lastDate?: Prisma.DateTimeNullableWithAggregatesFilter<"SupplierInvoice"> | Date | string | null;
    missingFromImport?: Prisma.BoolWithAggregatesFilter<"SupplierInvoice"> | boolean;
    importBatchId?: Prisma.IntWithAggregatesFilter<"SupplierInvoice"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SupplierInvoice"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"SupplierInvoice"> | Date | string;
};
export type SupplierInvoiceCreateInput = {
    sourceKey: string;
    supplier: string;
    number: string;
    firstDate?: Date | string | null;
    lastDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    trades?: Prisma.TradeCreateNestedManyWithoutSupplierInvoiceRefInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSupplierInvoiceRefInput;
};
export type SupplierInvoiceUncheckedCreateInput = {
    id?: number;
    sourceKey: string;
    supplier: string;
    number: string;
    firstDate?: Date | string | null;
    lastDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSupplierInvoiceRefInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSupplierInvoiceRefInput;
};
export type SupplierInvoiceUpdateInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    supplier?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    firstDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trades?: Prisma.TradeUpdateManyWithoutSupplierInvoiceRefNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSupplierInvoiceRefNestedInput;
};
export type SupplierInvoiceUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    supplier?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    firstDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSupplierInvoiceRefNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSupplierInvoiceRefNestedInput;
};
export type SupplierInvoiceCreateManyInput = {
    id?: number;
    sourceKey: string;
    supplier: string;
    number: string;
    firstDate?: Date | string | null;
    lastDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SupplierInvoiceUpdateManyMutationInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    supplier?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    firstDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierInvoiceUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    supplier?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    firstDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierInvoiceNullableScalarRelationFilter = {
    is?: Prisma.SupplierInvoiceWhereInput | null;
    isNot?: Prisma.SupplierInvoiceWhereInput | null;
};
export type SupplierInvoiceSupplierNumberCompoundUniqueInput = {
    supplier: string;
    number: string;
};
export type SupplierInvoiceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    supplier?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    firstDate?: Prisma.SortOrder;
    lastDate?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SupplierInvoiceAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type SupplierInvoiceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    supplier?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    firstDate?: Prisma.SortOrder;
    lastDate?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SupplierInvoiceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    supplier?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    firstDate?: Prisma.SortOrder;
    lastDate?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SupplierInvoiceSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type SupplierInvoiceCreateNestedOneWithoutTradesInput = {
    create?: Prisma.XOR<Prisma.SupplierInvoiceCreateWithoutTradesInput, Prisma.SupplierInvoiceUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.SupplierInvoiceCreateOrConnectWithoutTradesInput;
    connect?: Prisma.SupplierInvoiceWhereUniqueInput;
};
export type SupplierInvoiceUpdateOneWithoutTradesNestedInput = {
    create?: Prisma.XOR<Prisma.SupplierInvoiceCreateWithoutTradesInput, Prisma.SupplierInvoiceUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.SupplierInvoiceCreateOrConnectWithoutTradesInput;
    upsert?: Prisma.SupplierInvoiceUpsertWithoutTradesInput;
    disconnect?: Prisma.SupplierInvoiceWhereInput | boolean;
    delete?: Prisma.SupplierInvoiceWhereInput | boolean;
    connect?: Prisma.SupplierInvoiceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SupplierInvoiceUpdateToOneWithWhereWithoutTradesInput, Prisma.SupplierInvoiceUpdateWithoutTradesInput>, Prisma.SupplierInvoiceUncheckedUpdateWithoutTradesInput>;
};
export type SupplierInvoiceCreateNestedOneWithoutLotsInput = {
    create?: Prisma.XOR<Prisma.SupplierInvoiceCreateWithoutLotsInput, Prisma.SupplierInvoiceUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.SupplierInvoiceCreateOrConnectWithoutLotsInput;
    connect?: Prisma.SupplierInvoiceWhereUniqueInput;
};
export type SupplierInvoiceUpdateOneWithoutLotsNestedInput = {
    create?: Prisma.XOR<Prisma.SupplierInvoiceCreateWithoutLotsInput, Prisma.SupplierInvoiceUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.SupplierInvoiceCreateOrConnectWithoutLotsInput;
    upsert?: Prisma.SupplierInvoiceUpsertWithoutLotsInput;
    disconnect?: Prisma.SupplierInvoiceWhereInput | boolean;
    delete?: Prisma.SupplierInvoiceWhereInput | boolean;
    connect?: Prisma.SupplierInvoiceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SupplierInvoiceUpdateToOneWithWhereWithoutLotsInput, Prisma.SupplierInvoiceUpdateWithoutLotsInput>, Prisma.SupplierInvoiceUncheckedUpdateWithoutLotsInput>;
};
export type SupplierInvoiceCreateWithoutTradesInput = {
    sourceKey: string;
    supplier: string;
    number: string;
    firstDate?: Date | string | null;
    lastDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSupplierInvoiceRefInput;
};
export type SupplierInvoiceUncheckedCreateWithoutTradesInput = {
    id?: number;
    sourceKey: string;
    supplier: string;
    number: string;
    firstDate?: Date | string | null;
    lastDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSupplierInvoiceRefInput;
};
export type SupplierInvoiceCreateOrConnectWithoutTradesInput = {
    where: Prisma.SupplierInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierInvoiceCreateWithoutTradesInput, Prisma.SupplierInvoiceUncheckedCreateWithoutTradesInput>;
};
export type SupplierInvoiceUpsertWithoutTradesInput = {
    update: Prisma.XOR<Prisma.SupplierInvoiceUpdateWithoutTradesInput, Prisma.SupplierInvoiceUncheckedUpdateWithoutTradesInput>;
    create: Prisma.XOR<Prisma.SupplierInvoiceCreateWithoutTradesInput, Prisma.SupplierInvoiceUncheckedCreateWithoutTradesInput>;
    where?: Prisma.SupplierInvoiceWhereInput;
};
export type SupplierInvoiceUpdateToOneWithWhereWithoutTradesInput = {
    where?: Prisma.SupplierInvoiceWhereInput;
    data: Prisma.XOR<Prisma.SupplierInvoiceUpdateWithoutTradesInput, Prisma.SupplierInvoiceUncheckedUpdateWithoutTradesInput>;
};
export type SupplierInvoiceUpdateWithoutTradesInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    supplier?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    firstDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSupplierInvoiceRefNestedInput;
};
export type SupplierInvoiceUncheckedUpdateWithoutTradesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    supplier?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    firstDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSupplierInvoiceRefNestedInput;
};
export type SupplierInvoiceCreateWithoutLotsInput = {
    sourceKey: string;
    supplier: string;
    number: string;
    firstDate?: Date | string | null;
    lastDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    trades?: Prisma.TradeCreateNestedManyWithoutSupplierInvoiceRefInput;
};
export type SupplierInvoiceUncheckedCreateWithoutLotsInput = {
    id?: number;
    sourceKey: string;
    supplier: string;
    number: string;
    firstDate?: Date | string | null;
    lastDate?: Date | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSupplierInvoiceRefInput;
};
export type SupplierInvoiceCreateOrConnectWithoutLotsInput = {
    where: Prisma.SupplierInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierInvoiceCreateWithoutLotsInput, Prisma.SupplierInvoiceUncheckedCreateWithoutLotsInput>;
};
export type SupplierInvoiceUpsertWithoutLotsInput = {
    update: Prisma.XOR<Prisma.SupplierInvoiceUpdateWithoutLotsInput, Prisma.SupplierInvoiceUncheckedUpdateWithoutLotsInput>;
    create: Prisma.XOR<Prisma.SupplierInvoiceCreateWithoutLotsInput, Prisma.SupplierInvoiceUncheckedCreateWithoutLotsInput>;
    where?: Prisma.SupplierInvoiceWhereInput;
};
export type SupplierInvoiceUpdateToOneWithWhereWithoutLotsInput = {
    where?: Prisma.SupplierInvoiceWhereInput;
    data: Prisma.XOR<Prisma.SupplierInvoiceUpdateWithoutLotsInput, Prisma.SupplierInvoiceUncheckedUpdateWithoutLotsInput>;
};
export type SupplierInvoiceUpdateWithoutLotsInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    supplier?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    firstDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trades?: Prisma.TradeUpdateManyWithoutSupplierInvoiceRefNestedInput;
};
export type SupplierInvoiceUncheckedUpdateWithoutLotsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    supplier?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    firstDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSupplierInvoiceRefNestedInput;
};
export type SupplierInvoiceCountOutputType = {
    trades: number;
    lots: number;
};
export type SupplierInvoiceCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trades?: boolean | SupplierInvoiceCountOutputTypeCountTradesArgs;
    lots?: boolean | SupplierInvoiceCountOutputTypeCountLotsArgs;
};
export type SupplierInvoiceCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceCountOutputTypeSelect<ExtArgs> | null;
};
export type SupplierInvoiceCountOutputTypeCountTradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TradeWhereInput;
};
export type SupplierInvoiceCountOutputTypeCountLotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseLotWhereInput;
};
export type SupplierInvoiceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    supplier?: boolean;
    number?: boolean;
    firstDate?: boolean;
    lastDate?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    trades?: boolean | Prisma.SupplierInvoice$tradesArgs<ExtArgs>;
    lots?: boolean | Prisma.SupplierInvoice$lotsArgs<ExtArgs>;
    _count?: boolean | Prisma.SupplierInvoiceCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["supplierInvoice"]>;
export type SupplierInvoiceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    supplier?: boolean;
    number?: boolean;
    firstDate?: boolean;
    lastDate?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["supplierInvoice"]>;
export type SupplierInvoiceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    supplier?: boolean;
    number?: boolean;
    firstDate?: boolean;
    lastDate?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["supplierInvoice"]>;
export type SupplierInvoiceSelectScalar = {
    id?: boolean;
    sourceKey?: boolean;
    supplier?: boolean;
    number?: boolean;
    firstDate?: boolean;
    lastDate?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SupplierInvoiceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sourceKey" | "supplier" | "number" | "firstDate" | "lastDate" | "missingFromImport" | "importBatchId" | "createdAt" | "updatedAt", ExtArgs["result"]["supplierInvoice"]>;
export type SupplierInvoiceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trades?: boolean | Prisma.SupplierInvoice$tradesArgs<ExtArgs>;
    lots?: boolean | Prisma.SupplierInvoice$lotsArgs<ExtArgs>;
    _count?: boolean | Prisma.SupplierInvoiceCountOutputTypeDefaultArgs<ExtArgs>;
};
export type SupplierInvoiceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type SupplierInvoiceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $SupplierInvoicePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SupplierInvoice";
    objects: {
        trades: Prisma.$TradePayload<ExtArgs>[];
        lots: Prisma.$PurchaseLotPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        sourceKey: string;
        supplier: string;
        number: string;
        firstDate: Date | null;
        lastDate: Date | null;
        missingFromImport: boolean;
        importBatchId: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["supplierInvoice"]>;
    composites: {};
};
export type SupplierInvoiceGetPayload<S extends boolean | null | undefined | SupplierInvoiceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload, S>;
export type SupplierInvoiceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SupplierInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SupplierInvoiceCountAggregateInputType | true;
};
export interface SupplierInvoiceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SupplierInvoice'];
        meta: {
            name: 'SupplierInvoice';
        };
    };
    findUnique<T extends SupplierInvoiceFindUniqueArgs>(args: Prisma.SelectSubset<T, SupplierInvoiceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SupplierInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SupplierInvoiceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SupplierInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SupplierInvoiceFindFirstArgs>(args?: Prisma.SelectSubset<T, SupplierInvoiceFindFirstArgs<ExtArgs>>): Prisma.Prisma__SupplierInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SupplierInvoiceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SupplierInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SupplierInvoiceFindManyArgs>(args?: Prisma.SelectSubset<T, SupplierInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SupplierInvoiceCreateArgs>(args: Prisma.SelectSubset<T, SupplierInvoiceCreateArgs<ExtArgs>>): Prisma.Prisma__SupplierInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SupplierInvoiceCreateManyArgs>(args?: Prisma.SelectSubset<T, SupplierInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SupplierInvoiceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SupplierInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SupplierInvoiceDeleteArgs>(args: Prisma.SelectSubset<T, SupplierInvoiceDeleteArgs<ExtArgs>>): Prisma.Prisma__SupplierInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SupplierInvoiceUpdateArgs>(args: Prisma.SelectSubset<T, SupplierInvoiceUpdateArgs<ExtArgs>>): Prisma.Prisma__SupplierInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SupplierInvoiceDeleteManyArgs>(args?: Prisma.SelectSubset<T, SupplierInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SupplierInvoiceUpdateManyArgs>(args: Prisma.SelectSubset<T, SupplierInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SupplierInvoiceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SupplierInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SupplierInvoiceUpsertArgs>(args: Prisma.SelectSubset<T, SupplierInvoiceUpsertArgs<ExtArgs>>): Prisma.Prisma__SupplierInvoiceClient<runtime.Types.Result.GetResult<Prisma.$SupplierInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SupplierInvoiceCountArgs>(args?: Prisma.Subset<T, SupplierInvoiceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SupplierInvoiceCountAggregateOutputType> : number>;
    aggregate<T extends SupplierInvoiceAggregateArgs>(args: Prisma.Subset<T, SupplierInvoiceAggregateArgs>): Prisma.PrismaPromise<GetSupplierInvoiceAggregateType<T>>;
    groupBy<T extends SupplierInvoiceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SupplierInvoiceGroupByArgs['orderBy'];
    } : {
        orderBy?: SupplierInvoiceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SupplierInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SupplierInvoiceFieldRefs;
}
export interface Prisma__SupplierInvoiceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    trades<T extends Prisma.SupplierInvoice$tradesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SupplierInvoice$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    lots<T extends Prisma.SupplierInvoice$lotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SupplierInvoice$lotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseLotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SupplierInvoiceFieldRefs {
    readonly id: Prisma.FieldRef<"SupplierInvoice", 'Int'>;
    readonly sourceKey: Prisma.FieldRef<"SupplierInvoice", 'String'>;
    readonly supplier: Prisma.FieldRef<"SupplierInvoice", 'String'>;
    readonly number: Prisma.FieldRef<"SupplierInvoice", 'String'>;
    readonly firstDate: Prisma.FieldRef<"SupplierInvoice", 'DateTime'>;
    readonly lastDate: Prisma.FieldRef<"SupplierInvoice", 'DateTime'>;
    readonly missingFromImport: Prisma.FieldRef<"SupplierInvoice", 'Boolean'>;
    readonly importBatchId: Prisma.FieldRef<"SupplierInvoice", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"SupplierInvoice", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"SupplierInvoice", 'DateTime'>;
}
export type SupplierInvoiceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
    where: Prisma.SupplierInvoiceWhereUniqueInput;
};
export type SupplierInvoiceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
    where: Prisma.SupplierInvoiceWhereUniqueInput;
};
export type SupplierInvoiceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
    where?: Prisma.SupplierInvoiceWhereInput;
    orderBy?: Prisma.SupplierInvoiceOrderByWithRelationInput | Prisma.SupplierInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.SupplierInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierInvoiceScalarFieldEnum | Prisma.SupplierInvoiceScalarFieldEnum[];
};
export type SupplierInvoiceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
    where?: Prisma.SupplierInvoiceWhereInput;
    orderBy?: Prisma.SupplierInvoiceOrderByWithRelationInput | Prisma.SupplierInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.SupplierInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierInvoiceScalarFieldEnum | Prisma.SupplierInvoiceScalarFieldEnum[];
};
export type SupplierInvoiceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
    where?: Prisma.SupplierInvoiceWhereInput;
    orderBy?: Prisma.SupplierInvoiceOrderByWithRelationInput | Prisma.SupplierInvoiceOrderByWithRelationInput[];
    cursor?: Prisma.SupplierInvoiceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierInvoiceScalarFieldEnum | Prisma.SupplierInvoiceScalarFieldEnum[];
};
export type SupplierInvoiceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierInvoiceCreateInput, Prisma.SupplierInvoiceUncheckedCreateInput>;
};
export type SupplierInvoiceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SupplierInvoiceCreateManyInput | Prisma.SupplierInvoiceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SupplierInvoiceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    data: Prisma.SupplierInvoiceCreateManyInput | Prisma.SupplierInvoiceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SupplierInvoiceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierInvoiceUpdateInput, Prisma.SupplierInvoiceUncheckedUpdateInput>;
    where: Prisma.SupplierInvoiceWhereUniqueInput;
};
export type SupplierInvoiceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SupplierInvoiceUpdateManyMutationInput, Prisma.SupplierInvoiceUncheckedUpdateManyInput>;
    where?: Prisma.SupplierInvoiceWhereInput;
    limit?: number;
};
export type SupplierInvoiceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierInvoiceUpdateManyMutationInput, Prisma.SupplierInvoiceUncheckedUpdateManyInput>;
    where?: Prisma.SupplierInvoiceWhereInput;
    limit?: number;
};
export type SupplierInvoiceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
    where: Prisma.SupplierInvoiceWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierInvoiceCreateInput, Prisma.SupplierInvoiceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SupplierInvoiceUpdateInput, Prisma.SupplierInvoiceUncheckedUpdateInput>;
};
export type SupplierInvoiceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
    where: Prisma.SupplierInvoiceWhereUniqueInput;
};
export type SupplierInvoiceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierInvoiceWhereInput;
    limit?: number;
};
export type SupplierInvoice$tradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SupplierInvoice$lotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SupplierInvoiceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierInvoiceSelect<ExtArgs> | null;
    omit?: Prisma.SupplierInvoiceOmit<ExtArgs> | null;
    include?: Prisma.SupplierInvoiceInclude<ExtArgs> | null;
};
//# sourceMappingURL=SupplierInvoice.d.ts.map