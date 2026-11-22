import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type VendorModel = runtime.Types.Result.DefaultSelection<Prisma.$VendorPayload>;
export type AggregateVendor = {
    _count: VendorCountAggregateOutputType | null;
    _avg: VendorAvgAggregateOutputType | null;
    _sum: VendorSumAggregateOutputType | null;
    _min: VendorMinAggregateOutputType | null;
    _max: VendorMaxAggregateOutputType | null;
};
export type VendorAvgAggregateOutputType = {
    id: number | null;
    importBatchId: number | null;
};
export type VendorSumAggregateOutputType = {
    id: number | null;
    importBatchId: number | null;
};
export type VendorMinAggregateOutputType = {
    id: number | null;
    redactionCode: string | null;
    name: string | null;
    zohoNumber: string | null;
    status: string | null;
    currency: string | null;
    sources: string | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VendorMaxAggregateOutputType = {
    id: number | null;
    redactionCode: string | null;
    name: string | null;
    zohoNumber: string | null;
    status: string | null;
    currency: string | null;
    sources: string | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VendorCountAggregateOutputType = {
    id: number;
    redactionCode: number;
    name: number;
    zohoNumber: number;
    status: number;
    currency: number;
    sources: number;
    missingFromImport: number;
    importBatchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type VendorAvgAggregateInputType = {
    id?: true;
    importBatchId?: true;
};
export type VendorSumAggregateInputType = {
    id?: true;
    importBatchId?: true;
};
export type VendorMinAggregateInputType = {
    id?: true;
    redactionCode?: true;
    name?: true;
    zohoNumber?: true;
    status?: true;
    currency?: true;
    sources?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VendorMaxAggregateInputType = {
    id?: true;
    redactionCode?: true;
    name?: true;
    zohoNumber?: true;
    status?: true;
    currency?: true;
    sources?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VendorCountAggregateInputType = {
    id?: true;
    redactionCode?: true;
    name?: true;
    zohoNumber?: true;
    status?: true;
    currency?: true;
    sources?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type VendorAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithRelationInput | Prisma.VendorOrderByWithRelationInput[];
    cursor?: Prisma.VendorWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VendorCountAggregateInputType;
    _avg?: VendorAvgAggregateInputType;
    _sum?: VendorSumAggregateInputType;
    _min?: VendorMinAggregateInputType;
    _max?: VendorMaxAggregateInputType;
};
export type GetVendorAggregateType<T extends VendorAggregateArgs> = {
    [P in keyof T & keyof AggregateVendor]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVendor[P]> : Prisma.GetScalarType<T[P], AggregateVendor[P]>;
};
export type VendorGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithAggregationInput | Prisma.VendorOrderByWithAggregationInput[];
    by: Prisma.VendorScalarFieldEnum[] | Prisma.VendorScalarFieldEnum;
    having?: Prisma.VendorScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorCountAggregateInputType | true;
    _avg?: VendorAvgAggregateInputType;
    _sum?: VendorSumAggregateInputType;
    _min?: VendorMinAggregateInputType;
    _max?: VendorMaxAggregateInputType;
};
export type VendorGroupByOutputType = {
    id: number;
    redactionCode: string;
    name: string;
    zohoNumber: string | null;
    status: string | null;
    currency: string | null;
    sources: string | null;
    missingFromImport: boolean;
    importBatchId: number;
    createdAt: Date;
    updatedAt: Date;
    _count: VendorCountAggregateOutputType | null;
    _avg: VendorAvgAggregateOutputType | null;
    _sum: VendorSumAggregateOutputType | null;
    _min: VendorMinAggregateOutputType | null;
    _max: VendorMaxAggregateOutputType | null;
};
export type GetVendorGroupByPayload<T extends VendorGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VendorGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VendorGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VendorGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VendorGroupByOutputType[P]>;
}>>;
export type VendorWhereInput = {
    AND?: Prisma.VendorWhereInput | Prisma.VendorWhereInput[];
    OR?: Prisma.VendorWhereInput[];
    NOT?: Prisma.VendorWhereInput | Prisma.VendorWhereInput[];
    id?: Prisma.IntFilter<"Vendor"> | number;
    redactionCode?: Prisma.StringFilter<"Vendor"> | string;
    name?: Prisma.StringFilter<"Vendor"> | string;
    zohoNumber?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    status?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    currency?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    sources?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    missingFromImport?: Prisma.BoolFilter<"Vendor"> | boolean;
    importBatchId?: Prisma.IntFilter<"Vendor"> | number;
    createdAt?: Prisma.DateTimeFilter<"Vendor"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Vendor"> | Date | string;
    purchaseOrderLines?: Prisma.ZohoPurchaseOrderLineListRelationFilter;
};
export type VendorOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    redactionCode?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    zohoNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    currency?: Prisma.SortOrderInput | Prisma.SortOrder;
    sources?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    purchaseOrderLines?: Prisma.ZohoPurchaseOrderLineOrderByRelationAggregateInput;
};
export type VendorWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    redactionCode?: string;
    AND?: Prisma.VendorWhereInput | Prisma.VendorWhereInput[];
    OR?: Prisma.VendorWhereInput[];
    NOT?: Prisma.VendorWhereInput | Prisma.VendorWhereInput[];
    name?: Prisma.StringFilter<"Vendor"> | string;
    zohoNumber?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    status?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    currency?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    sources?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    missingFromImport?: Prisma.BoolFilter<"Vendor"> | boolean;
    importBatchId?: Prisma.IntFilter<"Vendor"> | number;
    createdAt?: Prisma.DateTimeFilter<"Vendor"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Vendor"> | Date | string;
    purchaseOrderLines?: Prisma.ZohoPurchaseOrderLineListRelationFilter;
}, "id" | "redactionCode">;
export type VendorOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    redactionCode?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    zohoNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    currency?: Prisma.SortOrderInput | Prisma.SortOrder;
    sources?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.VendorCountOrderByAggregateInput;
    _avg?: Prisma.VendorAvgOrderByAggregateInput;
    _max?: Prisma.VendorMaxOrderByAggregateInput;
    _min?: Prisma.VendorMinOrderByAggregateInput;
    _sum?: Prisma.VendorSumOrderByAggregateInput;
};
export type VendorScalarWhereWithAggregatesInput = {
    AND?: Prisma.VendorScalarWhereWithAggregatesInput | Prisma.VendorScalarWhereWithAggregatesInput[];
    OR?: Prisma.VendorScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VendorScalarWhereWithAggregatesInput | Prisma.VendorScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Vendor"> | number;
    redactionCode?: Prisma.StringWithAggregatesFilter<"Vendor"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Vendor"> | string;
    zohoNumber?: Prisma.StringNullableWithAggregatesFilter<"Vendor"> | string | null;
    status?: Prisma.StringNullableWithAggregatesFilter<"Vendor"> | string | null;
    currency?: Prisma.StringNullableWithAggregatesFilter<"Vendor"> | string | null;
    sources?: Prisma.StringNullableWithAggregatesFilter<"Vendor"> | string | null;
    missingFromImport?: Prisma.BoolWithAggregatesFilter<"Vendor"> | boolean;
    importBatchId?: Prisma.IntWithAggregatesFilter<"Vendor"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Vendor"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Vendor"> | Date | string;
};
export type VendorCreateInput = {
    redactionCode: string;
    name: string;
    zohoNumber?: string | null;
    status?: string | null;
    currency?: string | null;
    sources?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    purchaseOrderLines?: Prisma.ZohoPurchaseOrderLineCreateNestedManyWithoutVendorInput;
};
export type VendorUncheckedCreateInput = {
    id?: number;
    redactionCode: string;
    name: string;
    zohoNumber?: string | null;
    status?: string | null;
    currency?: string | null;
    sources?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    purchaseOrderLines?: Prisma.ZohoPurchaseOrderLineUncheckedCreateNestedManyWithoutVendorInput;
};
export type VendorUpdateInput = {
    redactionCode?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    zohoNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sources?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    purchaseOrderLines?: Prisma.ZohoPurchaseOrderLineUpdateManyWithoutVendorNestedInput;
};
export type VendorUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    redactionCode?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    zohoNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sources?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    purchaseOrderLines?: Prisma.ZohoPurchaseOrderLineUncheckedUpdateManyWithoutVendorNestedInput;
};
export type VendorCreateManyInput = {
    id?: number;
    redactionCode: string;
    name: string;
    zohoNumber?: string | null;
    status?: string | null;
    currency?: string | null;
    sources?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorUpdateManyMutationInput = {
    redactionCode?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    zohoNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sources?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    redactionCode?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    zohoNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sources?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    redactionCode?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    zohoNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    sources?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type VendorMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    redactionCode?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    zohoNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    sources?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    redactionCode?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    zohoNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    sources?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type VendorNullableScalarRelationFilter = {
    is?: Prisma.VendorWhereInput | null;
    isNot?: Prisma.VendorWhereInput | null;
};
export type VendorCreateNestedOneWithoutPurchaseOrderLinesInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutPurchaseOrderLinesInput, Prisma.VendorUncheckedCreateWithoutPurchaseOrderLinesInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutPurchaseOrderLinesInput;
    connect?: Prisma.VendorWhereUniqueInput;
};
export type VendorUpdateOneWithoutPurchaseOrderLinesNestedInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutPurchaseOrderLinesInput, Prisma.VendorUncheckedCreateWithoutPurchaseOrderLinesInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutPurchaseOrderLinesInput;
    upsert?: Prisma.VendorUpsertWithoutPurchaseOrderLinesInput;
    disconnect?: Prisma.VendorWhereInput | boolean;
    delete?: Prisma.VendorWhereInput | boolean;
    connect?: Prisma.VendorWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorUpdateToOneWithWhereWithoutPurchaseOrderLinesInput, Prisma.VendorUpdateWithoutPurchaseOrderLinesInput>, Prisma.VendorUncheckedUpdateWithoutPurchaseOrderLinesInput>;
};
export type VendorCreateWithoutPurchaseOrderLinesInput = {
    redactionCode: string;
    name: string;
    zohoNumber?: string | null;
    status?: string | null;
    currency?: string | null;
    sources?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorUncheckedCreateWithoutPurchaseOrderLinesInput = {
    id?: number;
    redactionCode: string;
    name: string;
    zohoNumber?: string | null;
    status?: string | null;
    currency?: string | null;
    sources?: string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorCreateOrConnectWithoutPurchaseOrderLinesInput = {
    where: Prisma.VendorWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorCreateWithoutPurchaseOrderLinesInput, Prisma.VendorUncheckedCreateWithoutPurchaseOrderLinesInput>;
};
export type VendorUpsertWithoutPurchaseOrderLinesInput = {
    update: Prisma.XOR<Prisma.VendorUpdateWithoutPurchaseOrderLinesInput, Prisma.VendorUncheckedUpdateWithoutPurchaseOrderLinesInput>;
    create: Prisma.XOR<Prisma.VendorCreateWithoutPurchaseOrderLinesInput, Prisma.VendorUncheckedCreateWithoutPurchaseOrderLinesInput>;
    where?: Prisma.VendorWhereInput;
};
export type VendorUpdateToOneWithWhereWithoutPurchaseOrderLinesInput = {
    where?: Prisma.VendorWhereInput;
    data: Prisma.XOR<Prisma.VendorUpdateWithoutPurchaseOrderLinesInput, Prisma.VendorUncheckedUpdateWithoutPurchaseOrderLinesInput>;
};
export type VendorUpdateWithoutPurchaseOrderLinesInput = {
    redactionCode?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    zohoNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sources?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorUncheckedUpdateWithoutPurchaseOrderLinesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    redactionCode?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    zohoNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sources?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorCountOutputType = {
    purchaseOrderLines: number;
};
export type VendorCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    purchaseOrderLines?: boolean | VendorCountOutputTypeCountPurchaseOrderLinesArgs;
};
export type VendorCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorCountOutputTypeSelect<ExtArgs> | null;
};
export type VendorCountOutputTypeCountPurchaseOrderLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoPurchaseOrderLineWhereInput;
};
export type VendorSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    redactionCode?: boolean;
    name?: boolean;
    zohoNumber?: boolean;
    status?: boolean;
    currency?: boolean;
    sources?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    purchaseOrderLines?: boolean | Prisma.Vendor$purchaseOrderLinesArgs<ExtArgs>;
    _count?: boolean | Prisma.VendorCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendor"]>;
export type VendorSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    redactionCode?: boolean;
    name?: boolean;
    zohoNumber?: boolean;
    status?: boolean;
    currency?: boolean;
    sources?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["vendor"]>;
export type VendorSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    redactionCode?: boolean;
    name?: boolean;
    zohoNumber?: boolean;
    status?: boolean;
    currency?: boolean;
    sources?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["vendor"]>;
export type VendorSelectScalar = {
    id?: boolean;
    redactionCode?: boolean;
    name?: boolean;
    zohoNumber?: boolean;
    status?: boolean;
    currency?: boolean;
    sources?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type VendorOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "redactionCode" | "name" | "zohoNumber" | "status" | "currency" | "sources" | "missingFromImport" | "importBatchId" | "createdAt" | "updatedAt", ExtArgs["result"]["vendor"]>;
export type VendorInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    purchaseOrderLines?: boolean | Prisma.Vendor$purchaseOrderLinesArgs<ExtArgs>;
    _count?: boolean | Prisma.VendorCountOutputTypeDefaultArgs<ExtArgs>;
};
export type VendorIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type VendorIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $VendorPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Vendor";
    objects: {
        purchaseOrderLines: Prisma.$ZohoPurchaseOrderLinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        redactionCode: string;
        name: string;
        zohoNumber: string | null;
        status: string | null;
        currency: string | null;
        sources: string | null;
        missingFromImport: boolean;
        importBatchId: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["vendor"]>;
    composites: {};
};
export type VendorGetPayload<S extends boolean | null | undefined | VendorDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VendorPayload, S>;
export type VendorCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VendorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VendorCountAggregateInputType | true;
};
export interface VendorDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Vendor'];
        meta: {
            name: 'Vendor';
        };
    };
    findUnique<T extends VendorFindUniqueArgs>(args: Prisma.SelectSubset<T, VendorFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VendorFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VendorFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VendorFindFirstArgs>(args?: Prisma.SelectSubset<T, VendorFindFirstArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VendorFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VendorFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VendorFindManyArgs>(args?: Prisma.SelectSubset<T, VendorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VendorCreateArgs>(args: Prisma.SelectSubset<T, VendorCreateArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VendorCreateManyArgs>(args?: Prisma.SelectSubset<T, VendorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VendorCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VendorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VendorDeleteArgs>(args: Prisma.SelectSubset<T, VendorDeleteArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VendorUpdateArgs>(args: Prisma.SelectSubset<T, VendorUpdateArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VendorDeleteManyArgs>(args?: Prisma.SelectSubset<T, VendorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VendorUpdateManyArgs>(args: Prisma.SelectSubset<T, VendorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VendorUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VendorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VendorUpsertArgs>(args: Prisma.SelectSubset<T, VendorUpsertArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VendorCountArgs>(args?: Prisma.Subset<T, VendorCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VendorCountAggregateOutputType> : number>;
    aggregate<T extends VendorAggregateArgs>(args: Prisma.Subset<T, VendorAggregateArgs>): Prisma.PrismaPromise<GetVendorAggregateType<T>>;
    groupBy<T extends VendorGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VendorGroupByArgs['orderBy'];
    } : {
        orderBy?: VendorGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VendorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VendorFieldRefs;
}
export interface Prisma__VendorClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    purchaseOrderLines<T extends Prisma.Vendor$purchaseOrderLinesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Vendor$purchaseOrderLinesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoPurchaseOrderLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VendorFieldRefs {
    readonly id: Prisma.FieldRef<"Vendor", 'Int'>;
    readonly redactionCode: Prisma.FieldRef<"Vendor", 'String'>;
    readonly name: Prisma.FieldRef<"Vendor", 'String'>;
    readonly zohoNumber: Prisma.FieldRef<"Vendor", 'String'>;
    readonly status: Prisma.FieldRef<"Vendor", 'String'>;
    readonly currency: Prisma.FieldRef<"Vendor", 'String'>;
    readonly sources: Prisma.FieldRef<"Vendor", 'String'>;
    readonly missingFromImport: Prisma.FieldRef<"Vendor", 'Boolean'>;
    readonly importBatchId: Prisma.FieldRef<"Vendor", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Vendor", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Vendor", 'DateTime'>;
}
export type VendorFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where: Prisma.VendorWhereUniqueInput;
};
export type VendorFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where: Prisma.VendorWhereUniqueInput;
};
export type VendorFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithRelationInput | Prisma.VendorOrderByWithRelationInput[];
    cursor?: Prisma.VendorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorScalarFieldEnum | Prisma.VendorScalarFieldEnum[];
};
export type VendorFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithRelationInput | Prisma.VendorOrderByWithRelationInput[];
    cursor?: Prisma.VendorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorScalarFieldEnum | Prisma.VendorScalarFieldEnum[];
};
export type VendorFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithRelationInput | Prisma.VendorOrderByWithRelationInput[];
    cursor?: Prisma.VendorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorScalarFieldEnum | Prisma.VendorScalarFieldEnum[];
};
export type VendorCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorCreateInput, Prisma.VendorUncheckedCreateInput>;
};
export type VendorCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VendorCreateManyInput | Prisma.VendorCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    data: Prisma.VendorCreateManyInput | Prisma.VendorCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorUpdateInput, Prisma.VendorUncheckedUpdateInput>;
    where: Prisma.VendorWhereUniqueInput;
};
export type VendorUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VendorUpdateManyMutationInput, Prisma.VendorUncheckedUpdateManyInput>;
    where?: Prisma.VendorWhereInput;
    limit?: number;
};
export type VendorUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorUpdateManyMutationInput, Prisma.VendorUncheckedUpdateManyInput>;
    where?: Prisma.VendorWhereInput;
    limit?: number;
};
export type VendorUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where: Prisma.VendorWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorCreateInput, Prisma.VendorUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VendorUpdateInput, Prisma.VendorUncheckedUpdateInput>;
};
export type VendorDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where: Prisma.VendorWhereUniqueInput;
};
export type VendorDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorWhereInput;
    limit?: number;
};
export type Vendor$purchaseOrderLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoPurchaseOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.ZohoPurchaseOrderLineOmit<ExtArgs> | null;
    include?: Prisma.ZohoPurchaseOrderLineInclude<ExtArgs> | null;
    where?: Prisma.ZohoPurchaseOrderLineWhereInput;
    orderBy?: Prisma.ZohoPurchaseOrderLineOrderByWithRelationInput | Prisma.ZohoPurchaseOrderLineOrderByWithRelationInput[];
    cursor?: Prisma.ZohoPurchaseOrderLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoPurchaseOrderLineScalarFieldEnum | Prisma.ZohoPurchaseOrderLineScalarFieldEnum[];
};
export type VendorDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
};
//# sourceMappingURL=Vendor.d.ts.map