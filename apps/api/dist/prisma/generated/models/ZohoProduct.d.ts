import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ZohoProductModel = runtime.Types.Result.DefaultSelection<Prisma.$ZohoProductPayload>;
export type AggregateZohoProduct = {
    _count: ZohoProductCountAggregateOutputType | null;
    _avg: ZohoProductAvgAggregateOutputType | null;
    _sum: ZohoProductSumAggregateOutputType | null;
    _min: ZohoProductMinAggregateOutputType | null;
    _max: ZohoProductMaxAggregateOutputType | null;
};
export type ZohoProductAvgAggregateOutputType = {
    id: number | null;
    qtySold: runtime.Decimal | null;
    amount: runtime.Decimal | null;
    avgPrice: runtime.Decimal | null;
    productId: number | null;
    salesProductId: number | null;
    importBatchId: number | null;
};
export type ZohoProductSumAggregateOutputType = {
    id: number | null;
    qtySold: runtime.Decimal | null;
    amount: runtime.Decimal | null;
    avgPrice: runtime.Decimal | null;
    productId: number | null;
    salesProductId: number | null;
    importBatchId: number | null;
};
export type ZohoProductMinAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    sku: string | null;
    itemName: string | null;
    productNorm: string | null;
    metal: string | null;
    qtySold: runtime.Decimal | null;
    amount: runtime.Decimal | null;
    avgPrice: runtime.Decimal | null;
    productId: number | null;
    salesProductId: number | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ZohoProductMaxAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    sku: string | null;
    itemName: string | null;
    productNorm: string | null;
    metal: string | null;
    qtySold: runtime.Decimal | null;
    amount: runtime.Decimal | null;
    avgPrice: runtime.Decimal | null;
    productId: number | null;
    salesProductId: number | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ZohoProductCountAggregateOutputType = {
    id: number;
    sourceKey: number;
    sku: number;
    itemName: number;
    productNorm: number;
    metal: number;
    qtySold: number;
    amount: number;
    avgPrice: number;
    productId: number;
    salesProductId: number;
    missingFromImport: number;
    importBatchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ZohoProductAvgAggregateInputType = {
    id?: true;
    qtySold?: true;
    amount?: true;
    avgPrice?: true;
    productId?: true;
    salesProductId?: true;
    importBatchId?: true;
};
export type ZohoProductSumAggregateInputType = {
    id?: true;
    qtySold?: true;
    amount?: true;
    avgPrice?: true;
    productId?: true;
    salesProductId?: true;
    importBatchId?: true;
};
export type ZohoProductMinAggregateInputType = {
    id?: true;
    sourceKey?: true;
    sku?: true;
    itemName?: true;
    productNorm?: true;
    metal?: true;
    qtySold?: true;
    amount?: true;
    avgPrice?: true;
    productId?: true;
    salesProductId?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ZohoProductMaxAggregateInputType = {
    id?: true;
    sourceKey?: true;
    sku?: true;
    itemName?: true;
    productNorm?: true;
    metal?: true;
    qtySold?: true;
    amount?: true;
    avgPrice?: true;
    productId?: true;
    salesProductId?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ZohoProductCountAggregateInputType = {
    id?: true;
    sourceKey?: true;
    sku?: true;
    itemName?: true;
    productNorm?: true;
    metal?: true;
    qtySold?: true;
    amount?: true;
    avgPrice?: true;
    productId?: true;
    salesProductId?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ZohoProductAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoProductWhereInput;
    orderBy?: Prisma.ZohoProductOrderByWithRelationInput | Prisma.ZohoProductOrderByWithRelationInput[];
    cursor?: Prisma.ZohoProductWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ZohoProductCountAggregateInputType;
    _avg?: ZohoProductAvgAggregateInputType;
    _sum?: ZohoProductSumAggregateInputType;
    _min?: ZohoProductMinAggregateInputType;
    _max?: ZohoProductMaxAggregateInputType;
};
export type GetZohoProductAggregateType<T extends ZohoProductAggregateArgs> = {
    [P in keyof T & keyof AggregateZohoProduct]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateZohoProduct[P]> : Prisma.GetScalarType<T[P], AggregateZohoProduct[P]>;
};
export type ZohoProductGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoProductWhereInput;
    orderBy?: Prisma.ZohoProductOrderByWithAggregationInput | Prisma.ZohoProductOrderByWithAggregationInput[];
    by: Prisma.ZohoProductScalarFieldEnum[] | Prisma.ZohoProductScalarFieldEnum;
    having?: Prisma.ZohoProductScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ZohoProductCountAggregateInputType | true;
    _avg?: ZohoProductAvgAggregateInputType;
    _sum?: ZohoProductSumAggregateInputType;
    _min?: ZohoProductMinAggregateInputType;
    _max?: ZohoProductMaxAggregateInputType;
};
export type ZohoProductGroupByOutputType = {
    id: number;
    sourceKey: string;
    sku: string | null;
    itemName: string;
    productNorm: string | null;
    metal: string | null;
    qtySold: runtime.Decimal | null;
    amount: runtime.Decimal | null;
    avgPrice: runtime.Decimal | null;
    productId: number | null;
    salesProductId: number | null;
    missingFromImport: boolean;
    importBatchId: number;
    createdAt: Date;
    updatedAt: Date;
    _count: ZohoProductCountAggregateOutputType | null;
    _avg: ZohoProductAvgAggregateOutputType | null;
    _sum: ZohoProductSumAggregateOutputType | null;
    _min: ZohoProductMinAggregateOutputType | null;
    _max: ZohoProductMaxAggregateOutputType | null;
};
export type GetZohoProductGroupByPayload<T extends ZohoProductGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ZohoProductGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ZohoProductGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ZohoProductGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ZohoProductGroupByOutputType[P]>;
}>>;
export type ZohoProductWhereInput = {
    AND?: Prisma.ZohoProductWhereInput | Prisma.ZohoProductWhereInput[];
    OR?: Prisma.ZohoProductWhereInput[];
    NOT?: Prisma.ZohoProductWhereInput | Prisma.ZohoProductWhereInput[];
    id?: Prisma.IntFilter<"ZohoProduct"> | number;
    sourceKey?: Prisma.StringFilter<"ZohoProduct"> | string;
    sku?: Prisma.StringNullableFilter<"ZohoProduct"> | string | null;
    itemName?: Prisma.StringFilter<"ZohoProduct"> | string;
    productNorm?: Prisma.StringNullableFilter<"ZohoProduct"> | string | null;
    metal?: Prisma.StringNullableFilter<"ZohoProduct"> | string | null;
    qtySold?: Prisma.DecimalNullableFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.DecimalNullableFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.DecimalNullableFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: Prisma.IntNullableFilter<"ZohoProduct"> | number | null;
    salesProductId?: Prisma.IntNullableFilter<"ZohoProduct"> | number | null;
    missingFromImport?: Prisma.BoolFilter<"ZohoProduct"> | boolean;
    importBatchId?: Prisma.IntFilter<"ZohoProduct"> | number;
    createdAt?: Prisma.DateTimeFilter<"ZohoProduct"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ZohoProduct"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductNullableScalarRelationFilter, Prisma.ProductWhereInput> | null;
    salesProduct?: Prisma.XOR<Prisma.SalesProductNullableScalarRelationFilter, Prisma.SalesProductWhereInput> | null;
};
export type ZohoProductOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    itemName?: Prisma.SortOrder;
    productNorm?: Prisma.SortOrderInput | Prisma.SortOrder;
    metal?: Prisma.SortOrderInput | Prisma.SortOrder;
    qtySold?: Prisma.SortOrderInput | Prisma.SortOrder;
    amount?: Prisma.SortOrderInput | Prisma.SortOrder;
    avgPrice?: Prisma.SortOrderInput | Prisma.SortOrder;
    productId?: Prisma.SortOrderInput | Prisma.SortOrder;
    salesProductId?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    product?: Prisma.ProductOrderByWithRelationInput;
    salesProduct?: Prisma.SalesProductOrderByWithRelationInput;
};
export type ZohoProductWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    sourceKey?: string;
    AND?: Prisma.ZohoProductWhereInput | Prisma.ZohoProductWhereInput[];
    OR?: Prisma.ZohoProductWhereInput[];
    NOT?: Prisma.ZohoProductWhereInput | Prisma.ZohoProductWhereInput[];
    sku?: Prisma.StringNullableFilter<"ZohoProduct"> | string | null;
    itemName?: Prisma.StringFilter<"ZohoProduct"> | string;
    productNorm?: Prisma.StringNullableFilter<"ZohoProduct"> | string | null;
    metal?: Prisma.StringNullableFilter<"ZohoProduct"> | string | null;
    qtySold?: Prisma.DecimalNullableFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.DecimalNullableFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.DecimalNullableFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: Prisma.IntNullableFilter<"ZohoProduct"> | number | null;
    salesProductId?: Prisma.IntNullableFilter<"ZohoProduct"> | number | null;
    missingFromImport?: Prisma.BoolFilter<"ZohoProduct"> | boolean;
    importBatchId?: Prisma.IntFilter<"ZohoProduct"> | number;
    createdAt?: Prisma.DateTimeFilter<"ZohoProduct"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ZohoProduct"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductNullableScalarRelationFilter, Prisma.ProductWhereInput> | null;
    salesProduct?: Prisma.XOR<Prisma.SalesProductNullableScalarRelationFilter, Prisma.SalesProductWhereInput> | null;
}, "id" | "sourceKey">;
export type ZohoProductOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    itemName?: Prisma.SortOrder;
    productNorm?: Prisma.SortOrderInput | Prisma.SortOrder;
    metal?: Prisma.SortOrderInput | Prisma.SortOrder;
    qtySold?: Prisma.SortOrderInput | Prisma.SortOrder;
    amount?: Prisma.SortOrderInput | Prisma.SortOrder;
    avgPrice?: Prisma.SortOrderInput | Prisma.SortOrder;
    productId?: Prisma.SortOrderInput | Prisma.SortOrder;
    salesProductId?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ZohoProductCountOrderByAggregateInput;
    _avg?: Prisma.ZohoProductAvgOrderByAggregateInput;
    _max?: Prisma.ZohoProductMaxOrderByAggregateInput;
    _min?: Prisma.ZohoProductMinOrderByAggregateInput;
    _sum?: Prisma.ZohoProductSumOrderByAggregateInput;
};
export type ZohoProductScalarWhereWithAggregatesInput = {
    AND?: Prisma.ZohoProductScalarWhereWithAggregatesInput | Prisma.ZohoProductScalarWhereWithAggregatesInput[];
    OR?: Prisma.ZohoProductScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ZohoProductScalarWhereWithAggregatesInput | Prisma.ZohoProductScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ZohoProduct"> | number;
    sourceKey?: Prisma.StringWithAggregatesFilter<"ZohoProduct"> | string;
    sku?: Prisma.StringNullableWithAggregatesFilter<"ZohoProduct"> | string | null;
    itemName?: Prisma.StringWithAggregatesFilter<"ZohoProduct"> | string;
    productNorm?: Prisma.StringNullableWithAggregatesFilter<"ZohoProduct"> | string | null;
    metal?: Prisma.StringNullableWithAggregatesFilter<"ZohoProduct"> | string | null;
    qtySold?: Prisma.DecimalNullableWithAggregatesFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.DecimalNullableWithAggregatesFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.DecimalNullableWithAggregatesFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: Prisma.IntNullableWithAggregatesFilter<"ZohoProduct"> | number | null;
    salesProductId?: Prisma.IntNullableWithAggregatesFilter<"ZohoProduct"> | number | null;
    missingFromImport?: Prisma.BoolWithAggregatesFilter<"ZohoProduct"> | boolean;
    importBatchId?: Prisma.IntWithAggregatesFilter<"ZohoProduct"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ZohoProduct"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ZohoProduct"> | Date | string;
};
export type ZohoProductCreateInput = {
    sourceKey: string;
    sku?: string | null;
    itemName: string;
    productNorm?: string | null;
    metal?: string | null;
    qtySold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    product?: Prisma.ProductCreateNestedOneWithoutZohoProductsInput;
    salesProduct?: Prisma.SalesProductCreateNestedOneWithoutZohoProductsInput;
};
export type ZohoProductUncheckedCreateInput = {
    id?: number;
    sourceKey: string;
    sku?: string | null;
    itemName: string;
    productNorm?: string | null;
    metal?: string | null;
    qtySold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: number | null;
    salesProductId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ZohoProductUpdateInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneWithoutZohoProductsNestedInput;
    salesProduct?: Prisma.SalesProductUpdateOneWithoutZohoProductsNestedInput;
};
export type ZohoProductUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    salesProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoProductCreateManyInput = {
    id?: number;
    sourceKey: string;
    sku?: string | null;
    itemName: string;
    productNorm?: string | null;
    metal?: string | null;
    qtySold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: number | null;
    salesProductId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ZohoProductUpdateManyMutationInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoProductUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    salesProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoProductListRelationFilter = {
    every?: Prisma.ZohoProductWhereInput;
    some?: Prisma.ZohoProductWhereInput;
    none?: Prisma.ZohoProductWhereInput;
};
export type ZohoProductOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ZohoProductCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    itemName?: Prisma.SortOrder;
    productNorm?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    qtySold?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    avgPrice?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ZohoProductAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    qtySold?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    avgPrice?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type ZohoProductMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    itemName?: Prisma.SortOrder;
    productNorm?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    qtySold?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    avgPrice?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ZohoProductMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    itemName?: Prisma.SortOrder;
    productNorm?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    qtySold?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    avgPrice?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ZohoProductSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    qtySold?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    avgPrice?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    salesProductId?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type ZohoProductCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.ZohoProductCreateWithoutProductInput, Prisma.ZohoProductUncheckedCreateWithoutProductInput> | Prisma.ZohoProductCreateWithoutProductInput[] | Prisma.ZohoProductUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ZohoProductCreateOrConnectWithoutProductInput | Prisma.ZohoProductCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.ZohoProductCreateManyProductInputEnvelope;
    connect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
};
export type ZohoProductUncheckedCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.ZohoProductCreateWithoutProductInput, Prisma.ZohoProductUncheckedCreateWithoutProductInput> | Prisma.ZohoProductCreateWithoutProductInput[] | Prisma.ZohoProductUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ZohoProductCreateOrConnectWithoutProductInput | Prisma.ZohoProductCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.ZohoProductCreateManyProductInputEnvelope;
    connect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
};
export type ZohoProductUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.ZohoProductCreateWithoutProductInput, Prisma.ZohoProductUncheckedCreateWithoutProductInput> | Prisma.ZohoProductCreateWithoutProductInput[] | Prisma.ZohoProductUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ZohoProductCreateOrConnectWithoutProductInput | Prisma.ZohoProductCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.ZohoProductUpsertWithWhereUniqueWithoutProductInput | Prisma.ZohoProductUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.ZohoProductCreateManyProductInputEnvelope;
    set?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    disconnect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    delete?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    connect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    update?: Prisma.ZohoProductUpdateWithWhereUniqueWithoutProductInput | Prisma.ZohoProductUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.ZohoProductUpdateManyWithWhereWithoutProductInput | Prisma.ZohoProductUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.ZohoProductScalarWhereInput | Prisma.ZohoProductScalarWhereInput[];
};
export type ZohoProductUncheckedUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.ZohoProductCreateWithoutProductInput, Prisma.ZohoProductUncheckedCreateWithoutProductInput> | Prisma.ZohoProductCreateWithoutProductInput[] | Prisma.ZohoProductUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ZohoProductCreateOrConnectWithoutProductInput | Prisma.ZohoProductCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.ZohoProductUpsertWithWhereUniqueWithoutProductInput | Prisma.ZohoProductUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.ZohoProductCreateManyProductInputEnvelope;
    set?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    disconnect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    delete?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    connect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    update?: Prisma.ZohoProductUpdateWithWhereUniqueWithoutProductInput | Prisma.ZohoProductUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.ZohoProductUpdateManyWithWhereWithoutProductInput | Prisma.ZohoProductUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.ZohoProductScalarWhereInput | Prisma.ZohoProductScalarWhereInput[];
};
export type ZohoProductCreateNestedManyWithoutSalesProductInput = {
    create?: Prisma.XOR<Prisma.ZohoProductCreateWithoutSalesProductInput, Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput> | Prisma.ZohoProductCreateWithoutSalesProductInput[] | Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput[];
    connectOrCreate?: Prisma.ZohoProductCreateOrConnectWithoutSalesProductInput | Prisma.ZohoProductCreateOrConnectWithoutSalesProductInput[];
    createMany?: Prisma.ZohoProductCreateManySalesProductInputEnvelope;
    connect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
};
export type ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput = {
    create?: Prisma.XOR<Prisma.ZohoProductCreateWithoutSalesProductInput, Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput> | Prisma.ZohoProductCreateWithoutSalesProductInput[] | Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput[];
    connectOrCreate?: Prisma.ZohoProductCreateOrConnectWithoutSalesProductInput | Prisma.ZohoProductCreateOrConnectWithoutSalesProductInput[];
    createMany?: Prisma.ZohoProductCreateManySalesProductInputEnvelope;
    connect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
};
export type ZohoProductUpdateManyWithoutSalesProductNestedInput = {
    create?: Prisma.XOR<Prisma.ZohoProductCreateWithoutSalesProductInput, Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput> | Prisma.ZohoProductCreateWithoutSalesProductInput[] | Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput[];
    connectOrCreate?: Prisma.ZohoProductCreateOrConnectWithoutSalesProductInput | Prisma.ZohoProductCreateOrConnectWithoutSalesProductInput[];
    upsert?: Prisma.ZohoProductUpsertWithWhereUniqueWithoutSalesProductInput | Prisma.ZohoProductUpsertWithWhereUniqueWithoutSalesProductInput[];
    createMany?: Prisma.ZohoProductCreateManySalesProductInputEnvelope;
    set?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    disconnect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    delete?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    connect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    update?: Prisma.ZohoProductUpdateWithWhereUniqueWithoutSalesProductInput | Prisma.ZohoProductUpdateWithWhereUniqueWithoutSalesProductInput[];
    updateMany?: Prisma.ZohoProductUpdateManyWithWhereWithoutSalesProductInput | Prisma.ZohoProductUpdateManyWithWhereWithoutSalesProductInput[];
    deleteMany?: Prisma.ZohoProductScalarWhereInput | Prisma.ZohoProductScalarWhereInput[];
};
export type ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput = {
    create?: Prisma.XOR<Prisma.ZohoProductCreateWithoutSalesProductInput, Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput> | Prisma.ZohoProductCreateWithoutSalesProductInput[] | Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput[];
    connectOrCreate?: Prisma.ZohoProductCreateOrConnectWithoutSalesProductInput | Prisma.ZohoProductCreateOrConnectWithoutSalesProductInput[];
    upsert?: Prisma.ZohoProductUpsertWithWhereUniqueWithoutSalesProductInput | Prisma.ZohoProductUpsertWithWhereUniqueWithoutSalesProductInput[];
    createMany?: Prisma.ZohoProductCreateManySalesProductInputEnvelope;
    set?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    disconnect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    delete?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    connect?: Prisma.ZohoProductWhereUniqueInput | Prisma.ZohoProductWhereUniqueInput[];
    update?: Prisma.ZohoProductUpdateWithWhereUniqueWithoutSalesProductInput | Prisma.ZohoProductUpdateWithWhereUniqueWithoutSalesProductInput[];
    updateMany?: Prisma.ZohoProductUpdateManyWithWhereWithoutSalesProductInput | Prisma.ZohoProductUpdateManyWithWhereWithoutSalesProductInput[];
    deleteMany?: Prisma.ZohoProductScalarWhereInput | Prisma.ZohoProductScalarWhereInput[];
};
export type ZohoProductCreateWithoutProductInput = {
    sourceKey: string;
    sku?: string | null;
    itemName: string;
    productNorm?: string | null;
    metal?: string | null;
    qtySold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    salesProduct?: Prisma.SalesProductCreateNestedOneWithoutZohoProductsInput;
};
export type ZohoProductUncheckedCreateWithoutProductInput = {
    id?: number;
    sourceKey: string;
    sku?: string | null;
    itemName: string;
    productNorm?: string | null;
    metal?: string | null;
    qtySold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    salesProductId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ZohoProductCreateOrConnectWithoutProductInput = {
    where: Prisma.ZohoProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.ZohoProductCreateWithoutProductInput, Prisma.ZohoProductUncheckedCreateWithoutProductInput>;
};
export type ZohoProductCreateManyProductInputEnvelope = {
    data: Prisma.ZohoProductCreateManyProductInput | Prisma.ZohoProductCreateManyProductInput[];
    skipDuplicates?: boolean;
};
export type ZohoProductUpsertWithWhereUniqueWithoutProductInput = {
    where: Prisma.ZohoProductWhereUniqueInput;
    update: Prisma.XOR<Prisma.ZohoProductUpdateWithoutProductInput, Prisma.ZohoProductUncheckedUpdateWithoutProductInput>;
    create: Prisma.XOR<Prisma.ZohoProductCreateWithoutProductInput, Prisma.ZohoProductUncheckedCreateWithoutProductInput>;
};
export type ZohoProductUpdateWithWhereUniqueWithoutProductInput = {
    where: Prisma.ZohoProductWhereUniqueInput;
    data: Prisma.XOR<Prisma.ZohoProductUpdateWithoutProductInput, Prisma.ZohoProductUncheckedUpdateWithoutProductInput>;
};
export type ZohoProductUpdateManyWithWhereWithoutProductInput = {
    where: Prisma.ZohoProductScalarWhereInput;
    data: Prisma.XOR<Prisma.ZohoProductUpdateManyMutationInput, Prisma.ZohoProductUncheckedUpdateManyWithoutProductInput>;
};
export type ZohoProductScalarWhereInput = {
    AND?: Prisma.ZohoProductScalarWhereInput | Prisma.ZohoProductScalarWhereInput[];
    OR?: Prisma.ZohoProductScalarWhereInput[];
    NOT?: Prisma.ZohoProductScalarWhereInput | Prisma.ZohoProductScalarWhereInput[];
    id?: Prisma.IntFilter<"ZohoProduct"> | number;
    sourceKey?: Prisma.StringFilter<"ZohoProduct"> | string;
    sku?: Prisma.StringNullableFilter<"ZohoProduct"> | string | null;
    itemName?: Prisma.StringFilter<"ZohoProduct"> | string;
    productNorm?: Prisma.StringNullableFilter<"ZohoProduct"> | string | null;
    metal?: Prisma.StringNullableFilter<"ZohoProduct"> | string | null;
    qtySold?: Prisma.DecimalNullableFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.DecimalNullableFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.DecimalNullableFilter<"ZohoProduct"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: Prisma.IntNullableFilter<"ZohoProduct"> | number | null;
    salesProductId?: Prisma.IntNullableFilter<"ZohoProduct"> | number | null;
    missingFromImport?: Prisma.BoolFilter<"ZohoProduct"> | boolean;
    importBatchId?: Prisma.IntFilter<"ZohoProduct"> | number;
    createdAt?: Prisma.DateTimeFilter<"ZohoProduct"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ZohoProduct"> | Date | string;
};
export type ZohoProductCreateWithoutSalesProductInput = {
    sourceKey: string;
    sku?: string | null;
    itemName: string;
    productNorm?: string | null;
    metal?: string | null;
    qtySold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    product?: Prisma.ProductCreateNestedOneWithoutZohoProductsInput;
};
export type ZohoProductUncheckedCreateWithoutSalesProductInput = {
    id?: number;
    sourceKey: string;
    sku?: string | null;
    itemName: string;
    productNorm?: string | null;
    metal?: string | null;
    qtySold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ZohoProductCreateOrConnectWithoutSalesProductInput = {
    where: Prisma.ZohoProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.ZohoProductCreateWithoutSalesProductInput, Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput>;
};
export type ZohoProductCreateManySalesProductInputEnvelope = {
    data: Prisma.ZohoProductCreateManySalesProductInput | Prisma.ZohoProductCreateManySalesProductInput[];
    skipDuplicates?: boolean;
};
export type ZohoProductUpsertWithWhereUniqueWithoutSalesProductInput = {
    where: Prisma.ZohoProductWhereUniqueInput;
    update: Prisma.XOR<Prisma.ZohoProductUpdateWithoutSalesProductInput, Prisma.ZohoProductUncheckedUpdateWithoutSalesProductInput>;
    create: Prisma.XOR<Prisma.ZohoProductCreateWithoutSalesProductInput, Prisma.ZohoProductUncheckedCreateWithoutSalesProductInput>;
};
export type ZohoProductUpdateWithWhereUniqueWithoutSalesProductInput = {
    where: Prisma.ZohoProductWhereUniqueInput;
    data: Prisma.XOR<Prisma.ZohoProductUpdateWithoutSalesProductInput, Prisma.ZohoProductUncheckedUpdateWithoutSalesProductInput>;
};
export type ZohoProductUpdateManyWithWhereWithoutSalesProductInput = {
    where: Prisma.ZohoProductScalarWhereInput;
    data: Prisma.XOR<Prisma.ZohoProductUpdateManyMutationInput, Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductInput>;
};
export type ZohoProductCreateManyProductInput = {
    id?: number;
    sourceKey: string;
    sku?: string | null;
    itemName: string;
    productNorm?: string | null;
    metal?: string | null;
    qtySold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    salesProductId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ZohoProductUpdateWithoutProductInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    salesProduct?: Prisma.SalesProductUpdateOneWithoutZohoProductsNestedInput;
};
export type ZohoProductUncheckedUpdateWithoutProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    salesProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoProductUncheckedUpdateManyWithoutProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    salesProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoProductCreateManySalesProductInput = {
    id?: number;
    sourceKey: string;
    sku?: string | null;
    itemName: string;
    productNorm?: string | null;
    metal?: string | null;
    qtySold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: number | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ZohoProductUpdateWithoutSalesProductInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneWithoutZohoProductsNestedInput;
};
export type ZohoProductUncheckedUpdateWithoutSalesProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoProductUncheckedUpdateManyWithoutSalesProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemName?: Prisma.StringFieldUpdateOperationsInput | string;
    productNorm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metal?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qtySold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    amount?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    avgPrice?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    productId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ZohoProductSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    sku?: boolean;
    itemName?: boolean;
    productNorm?: boolean;
    metal?: boolean;
    qtySold?: boolean;
    amount?: boolean;
    avgPrice?: boolean;
    productId?: boolean;
    salesProductId?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.ZohoProduct$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.ZohoProduct$salesProductArgs<ExtArgs>;
}, ExtArgs["result"]["zohoProduct"]>;
export type ZohoProductSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    sku?: boolean;
    itemName?: boolean;
    productNorm?: boolean;
    metal?: boolean;
    qtySold?: boolean;
    amount?: boolean;
    avgPrice?: boolean;
    productId?: boolean;
    salesProductId?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.ZohoProduct$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.ZohoProduct$salesProductArgs<ExtArgs>;
}, ExtArgs["result"]["zohoProduct"]>;
export type ZohoProductSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    sku?: boolean;
    itemName?: boolean;
    productNorm?: boolean;
    metal?: boolean;
    qtySold?: boolean;
    amount?: boolean;
    avgPrice?: boolean;
    productId?: boolean;
    salesProductId?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.ZohoProduct$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.ZohoProduct$salesProductArgs<ExtArgs>;
}, ExtArgs["result"]["zohoProduct"]>;
export type ZohoProductSelectScalar = {
    id?: boolean;
    sourceKey?: boolean;
    sku?: boolean;
    itemName?: boolean;
    productNorm?: boolean;
    metal?: boolean;
    qtySold?: boolean;
    amount?: boolean;
    avgPrice?: boolean;
    productId?: boolean;
    salesProductId?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ZohoProductOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sourceKey" | "sku" | "itemName" | "productNorm" | "metal" | "qtySold" | "amount" | "avgPrice" | "productId" | "salesProductId" | "missingFromImport" | "importBatchId" | "createdAt" | "updatedAt", ExtArgs["result"]["zohoProduct"]>;
export type ZohoProductInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ZohoProduct$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.ZohoProduct$salesProductArgs<ExtArgs>;
};
export type ZohoProductIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ZohoProduct$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.ZohoProduct$salesProductArgs<ExtArgs>;
};
export type ZohoProductIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ZohoProduct$productArgs<ExtArgs>;
    salesProduct?: boolean | Prisma.ZohoProduct$salesProductArgs<ExtArgs>;
};
export type $ZohoProductPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ZohoProduct";
    objects: {
        product: Prisma.$ProductPayload<ExtArgs> | null;
        salesProduct: Prisma.$SalesProductPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        sourceKey: string;
        sku: string | null;
        itemName: string;
        productNorm: string | null;
        metal: string | null;
        qtySold: runtime.Decimal | null;
        amount: runtime.Decimal | null;
        avgPrice: runtime.Decimal | null;
        productId: number | null;
        salesProductId: number | null;
        missingFromImport: boolean;
        importBatchId: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["zohoProduct"]>;
    composites: {};
};
export type ZohoProductGetPayload<S extends boolean | null | undefined | ZohoProductDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload, S>;
export type ZohoProductCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ZohoProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ZohoProductCountAggregateInputType | true;
};
export interface ZohoProductDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ZohoProduct'];
        meta: {
            name: 'ZohoProduct';
        };
    };
    findUnique<T extends ZohoProductFindUniqueArgs>(args: Prisma.SelectSubset<T, ZohoProductFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ZohoProductClient<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ZohoProductFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ZohoProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ZohoProductClient<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ZohoProductFindFirstArgs>(args?: Prisma.SelectSubset<T, ZohoProductFindFirstArgs<ExtArgs>>): Prisma.Prisma__ZohoProductClient<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ZohoProductFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ZohoProductFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ZohoProductClient<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ZohoProductFindManyArgs>(args?: Prisma.SelectSubset<T, ZohoProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ZohoProductCreateArgs>(args: Prisma.SelectSubset<T, ZohoProductCreateArgs<ExtArgs>>): Prisma.Prisma__ZohoProductClient<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ZohoProductCreateManyArgs>(args?: Prisma.SelectSubset<T, ZohoProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ZohoProductCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ZohoProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ZohoProductDeleteArgs>(args: Prisma.SelectSubset<T, ZohoProductDeleteArgs<ExtArgs>>): Prisma.Prisma__ZohoProductClient<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ZohoProductUpdateArgs>(args: Prisma.SelectSubset<T, ZohoProductUpdateArgs<ExtArgs>>): Prisma.Prisma__ZohoProductClient<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ZohoProductDeleteManyArgs>(args?: Prisma.SelectSubset<T, ZohoProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ZohoProductUpdateManyArgs>(args: Prisma.SelectSubset<T, ZohoProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ZohoProductUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ZohoProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ZohoProductUpsertArgs>(args: Prisma.SelectSubset<T, ZohoProductUpsertArgs<ExtArgs>>): Prisma.Prisma__ZohoProductClient<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ZohoProductCountArgs>(args?: Prisma.Subset<T, ZohoProductCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ZohoProductCountAggregateOutputType> : number>;
    aggregate<T extends ZohoProductAggregateArgs>(args: Prisma.Subset<T, ZohoProductAggregateArgs>): Prisma.PrismaPromise<GetZohoProductAggregateType<T>>;
    groupBy<T extends ZohoProductGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ZohoProductGroupByArgs['orderBy'];
    } : {
        orderBy?: ZohoProductGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ZohoProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetZohoProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ZohoProductFieldRefs;
}
export interface Prisma__ZohoProductClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    product<T extends Prisma.ZohoProduct$productArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ZohoProduct$productArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    salesProduct<T extends Prisma.ZohoProduct$salesProductArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ZohoProduct$salesProductArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ZohoProductFieldRefs {
    readonly id: Prisma.FieldRef<"ZohoProduct", 'Int'>;
    readonly sourceKey: Prisma.FieldRef<"ZohoProduct", 'String'>;
    readonly sku: Prisma.FieldRef<"ZohoProduct", 'String'>;
    readonly itemName: Prisma.FieldRef<"ZohoProduct", 'String'>;
    readonly productNorm: Prisma.FieldRef<"ZohoProduct", 'String'>;
    readonly metal: Prisma.FieldRef<"ZohoProduct", 'String'>;
    readonly qtySold: Prisma.FieldRef<"ZohoProduct", 'Decimal'>;
    readonly amount: Prisma.FieldRef<"ZohoProduct", 'Decimal'>;
    readonly avgPrice: Prisma.FieldRef<"ZohoProduct", 'Decimal'>;
    readonly productId: Prisma.FieldRef<"ZohoProduct", 'Int'>;
    readonly salesProductId: Prisma.FieldRef<"ZohoProduct", 'Int'>;
    readonly missingFromImport: Prisma.FieldRef<"ZohoProduct", 'Boolean'>;
    readonly importBatchId: Prisma.FieldRef<"ZohoProduct", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"ZohoProduct", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ZohoProduct", 'DateTime'>;
}
export type ZohoProductFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    where: Prisma.ZohoProductWhereUniqueInput;
};
export type ZohoProductFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    where: Prisma.ZohoProductWhereUniqueInput;
};
export type ZohoProductFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    where?: Prisma.ZohoProductWhereInput;
    orderBy?: Prisma.ZohoProductOrderByWithRelationInput | Prisma.ZohoProductOrderByWithRelationInput[];
    cursor?: Prisma.ZohoProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoProductScalarFieldEnum | Prisma.ZohoProductScalarFieldEnum[];
};
export type ZohoProductFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    where?: Prisma.ZohoProductWhereInput;
    orderBy?: Prisma.ZohoProductOrderByWithRelationInput | Prisma.ZohoProductOrderByWithRelationInput[];
    cursor?: Prisma.ZohoProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoProductScalarFieldEnum | Prisma.ZohoProductScalarFieldEnum[];
};
export type ZohoProductFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    where?: Prisma.ZohoProductWhereInput;
    orderBy?: Prisma.ZohoProductOrderByWithRelationInput | Prisma.ZohoProductOrderByWithRelationInput[];
    cursor?: Prisma.ZohoProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoProductScalarFieldEnum | Prisma.ZohoProductScalarFieldEnum[];
};
export type ZohoProductCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ZohoProductCreateInput, Prisma.ZohoProductUncheckedCreateInput>;
};
export type ZohoProductCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ZohoProductCreateManyInput | Prisma.ZohoProductCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ZohoProductCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    data: Prisma.ZohoProductCreateManyInput | Prisma.ZohoProductCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ZohoProductIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ZohoProductUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ZohoProductUpdateInput, Prisma.ZohoProductUncheckedUpdateInput>;
    where: Prisma.ZohoProductWhereUniqueInput;
};
export type ZohoProductUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ZohoProductUpdateManyMutationInput, Prisma.ZohoProductUncheckedUpdateManyInput>;
    where?: Prisma.ZohoProductWhereInput;
    limit?: number;
};
export type ZohoProductUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ZohoProductUpdateManyMutationInput, Prisma.ZohoProductUncheckedUpdateManyInput>;
    where?: Prisma.ZohoProductWhereInput;
    limit?: number;
    include?: Prisma.ZohoProductIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ZohoProductUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    where: Prisma.ZohoProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.ZohoProductCreateInput, Prisma.ZohoProductUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ZohoProductUpdateInput, Prisma.ZohoProductUncheckedUpdateInput>;
};
export type ZohoProductDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    where: Prisma.ZohoProductWhereUniqueInput;
};
export type ZohoProductDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoProductWhereInput;
    limit?: number;
};
export type ZohoProduct$productArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where?: Prisma.ProductWhereInput;
};
export type ZohoProduct$salesProductArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    where?: Prisma.SalesProductWhereInput;
};
export type ZohoProductDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
};
//# sourceMappingURL=ZohoProduct.d.ts.map